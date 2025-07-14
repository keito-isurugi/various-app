import type {
	Algorithm,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
	GraphData,
} from "@/types/algorithm";

/**
 * Union-Find（Disjoint Set Union）データ構造
 * クラスカル法で使用する効率的な集合管理
 */
class UnionFind {
	private parent: number[];
	private rank: number[];

	constructor(n: number) {
		this.parent = Array.from({ length: n }, (_, i) => i);
		this.rank = new Array(n).fill(0);
	}

	/**
	 * 要素xが属する集合の代表元を返す（経路圧縮あり）
	 */
	find(x: number): number {
		if (this.parent[x] !== x) {
			this.parent[x] = this.find(this.parent[x]); // 経路圧縮
		}
		return this.parent[x];
	}

	/**
	 * 要素xとyが同じ集合に属するかを判定
	 */
	same(x: number, y: number): boolean {
		return this.find(x) === this.find(y);
	}

	/**
	 * 要素xとyの集合を統合（ランクによる最適化）
	 */
	union(x: number, y: number): boolean {
		const rootX = this.find(x);
		const rootY = this.find(y);

		if (rootX === rootY) return false; // 既に同じ集合

		// ランクの小さい方を大きい方に統合
		if (this.rank[rootX] < this.rank[rootY]) {
			this.parent[rootX] = rootY;
		} else if (this.rank[rootX] > this.rank[rootY]) {
			this.parent[rootY] = rootX;
		} else {
			this.parent[rootY] = rootX;
			this.rank[rootX]++;
		}

		return true;
	}

	/**
	 * 現在の集合の状態を取得
	 */
	getGroups(): Record<number, number[]> {
		const groups: Record<number, number[]> = {};
		for (let i = 0; i < this.parent.length; i++) {
			const root = this.find(i);
			if (!groups[root]) groups[root] = [];
			groups[root].push(i);
		}
		return groups;
	}
}

/**
 * クラスカル法のアルゴリズム実装
 * 最小全域木を構築する
 */
export class KruskalAlgorithm implements Algorithm {
	readonly info = {
		id: "kruskal",
		name: "クラスカル法",
		description: "最小全域木を求めるアルゴリズム（辺ベース）",
		category: "graph" as const,
		timeComplexity: {
			best: "O(E log E)",
			average: "O(E log E)",
			worst: "O(E log E)",
		},
		spaceComplexity: "O(V)",
		difficulty: 3,
	};

	execute(input: AlgorithmInput): AlgorithmResult {
		const { graph } = input;

		// GraphData形式のチェック
		if (
			!graph ||
			typeof graph !== "object" ||
			!("nodes" in graph) ||
			!("edges" in graph)
		) {
			return {
				steps: [],
				result: { error: "グラフが入力されていません（GraphData形式が必要）" },
			};
		}

		const graphData = graph as GraphData;
		if (!graphData.nodes || graphData.nodes.length === 0) {
			return {
				steps: [],
				result: { error: "グラフが入力されていません" },
			};
		}

		if (!graphData.edges || graphData.edges.length === 0) {
			return {
				steps: [],
				result: { error: "辺が存在しません" },
			};
		}

		const n = graphData.nodes.length;
		const steps: AlgorithmStep[] = [];
		const mst: typeof graphData.edges = [];
		let totalWeight = 0;

		// Union-Findデータ構造を初期化
		const uf = new UnionFind(n);

		// 辺を重み順にソート
		const sortedEdges = [...graphData.edges].sort(
			(a, b) => a.weight - b.weight,
		);

		steps.push({
			id: 0,
			description: "辺を重みの昇順にソートしました",
			state: {
				sortedEdges: [...sortedEdges],
				mst: [],
				totalWeight: 0,
				groups: uf.getGroups(),
			},
		});

		// 各辺を重みの小さい順に検討
		for (let i = 0; i < sortedEdges.length; i++) {
			const edge = sortedEdges[i];
			const { from, to, weight } = edge;

			// 閉路を形成しないかチェック
			if (!uf.same(from, to)) {
				// この辺をMSTに追加
				uf.union(from, to);
				mst.push(edge);
				totalWeight += weight;

				steps.push({
					id: steps.length,
					description: `辺 ${graphData.nodes[from]} - ${graphData.nodes[to]} (重み: ${weight}) をMSTに追加`,
					state: {
						currentEdge: edge,
						mst: [...mst],
						totalWeight,
						groups: uf.getGroups(),
						edgeIndex: i,
					},
				});

				// V-1本の辺を選択したら完了
				if (mst.length === n - 1) {
					break;
				}
			} else {
				steps.push({
					id: steps.length,
					description: `辺 ${graphData.nodes[from]} - ${graphData.nodes[to]} (重み: ${weight}) は閉路を形成するため除外`,
					state: {
						currentEdge: edge,
						mst: [...mst],
						totalWeight,
						groups: uf.getGroups(),
						edgeIndex: i,
					},
				});
			}
		}

		// 最小全域木の完成チェック
		if (mst.length === n - 1) {
			steps.push({
				id: steps.length,
				description: `最小全域木が完成しました（総重み: ${totalWeight}）`,
				state: {
					mst: [...mst],
					totalWeight,
					groups: uf.getGroups(),
				},
			});
		} else {
			steps.push({
				id: steps.length,
				description: "グラフが連結していないため、最小全域木を構築できません",
				state: {
					mst: [...mst],
					totalWeight,
					groups: uf.getGroups(),
				},
			});
		}

		return {
			steps,
			result: {
				mst,
				totalWeight,
				isComplete: mst.length === n - 1,
			},
		};
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return KruskalAlgorithm.getDefaultInput();
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
クラスカル法は、重み付き無向グラフから最小全域木を構築するグリーディアルゴリズムです。

🔍 **基本原理**
1. 全ての辺を重みの昇順にソート
2. 軽い辺から順に検討
3. 閉路を形成しない辺のみを選択
4. V-1本の辺を選択したら完了

📈 **効率性**
- O(E log E)の時間計算量
- Union-Findで効率的な閉路検出
- 疎グラフに適している

🎯 **実用例**
- ネットワーク設計での最小コスト配線
- クラスタ分析での階層クラスタリング
- 画像処理でのセグメンテーション
		`.trim();
	}

	/**
	 * デフォルトの入力値を生成
	 */
	static getDefaultInput(): AlgorithmInput {
		return {
			graph: {
				nodes: ["A", "B", "C", "D", "E"],
				edges: [
					{ from: 0, to: 1, weight: 2 },
					{ from: 0, to: 3, weight: 6 },
					{ from: 1, to: 2, weight: 3 },
					{ from: 1, to: 3, weight: 8 },
					{ from: 1, to: 4, weight: 5 },
					{ from: 2, to: 4, weight: 7 },
					{ from: 3, to: 4, weight: 9 },
				],
			},
		};
	}

	/**
	 * 推奨されるサンプル入力
	 */
	static getRecommendedExamples(): AlgorithmInput[] {
		return [
			{
				graph: {
					nodes: ["A", "B", "C", "D", "E", "F"],
					edges: [
						{ from: 0, to: 1, weight: 4 },
						{ from: 0, to: 2, weight: 2 },
						{ from: 1, to: 2, weight: 1 },
						{ from: 1, to: 3, weight: 5 },
						{ from: 2, to: 3, weight: 8 },
						{ from: 2, to: 4, weight: 10 },
						{ from: 3, to: 4, weight: 2 },
						{ from: 3, to: 5, weight: 6 },
						{ from: 4, to: 5, weight: 3 },
					],
				},
			},
			{
				graph: {
					nodes: ["1", "2", "3", "4", "5", "6"],
					edges: [
						{ from: 0, to: 1, weight: 7 },
						{ from: 0, to: 2, weight: 9 },
						{ from: 0, to: 5, weight: 14 },
						{ from: 1, to: 2, weight: 10 },
						{ from: 1, to: 3, weight: 15 },
						{ from: 2, to: 3, weight: 11 },
						{ from: 2, to: 5, weight: 2 },
						{ from: 3, to: 4, weight: 6 },
						{ from: 4, to: 5, weight: 9 },
					],
				},
			},
		];
	}
}
