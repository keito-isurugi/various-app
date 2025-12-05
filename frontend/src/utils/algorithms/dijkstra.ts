import type {
	Algorithm,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
	GraphData,
} from "@/types/algorithm";

/**
 * ダイクストラ法のアルゴリズム実装
 * 単一始点最短経路問題を解く
 */
export class DijkstraAlgorithm implements Algorithm {
	readonly info = {
		id: "dijkstra",
		name: "ダイクストラ法",
		description: "単一始点最短経路問題を解くアルゴリズム",
		category: "graph" as const,
		timeComplexity: {
			best: "O(V log V)",
			average: "O((V + E) log V)",
			worst: "O((V + E) log V)",
		},
		spaceComplexity: "O(V)",
		difficulty: 3,
	};

	execute(input: AlgorithmInput): AlgorithmResult {
		const { graph, startNode = 0 } = input;
		const startNodeIndex = Number(startNode);

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

		const n = graphData.nodes.length;
		const distances = new Array(n).fill(Number.POSITIVE_INFINITY);
		const visited = new Array(n).fill(false);
		const previous = new Array(n).fill(-1);
		const steps: AlgorithmStep[] = [];
		let stepId = 0;

		// 始点の距離を0に設定
		distances[startNodeIndex] = 0;

		steps.push({
			id: stepId++,
			description: `始点 ${graphData.nodes[startNodeIndex]} からの最短距離を計算開始`,
			state: {
				distances: [...distances],
				visited: [...visited],
				current: startNodeIndex,
			},
		});

		// 全ノードを処理
		for (let i = 0; i < n; i++) {
			// 未訪問ノードの中で最小距離のノードを選択
			let minDistance = Number.POSITIVE_INFINITY;
			let currentNode = -1;

			for (let j = 0; j < n; j++) {
				if (!visited[j] && distances[j] < minDistance) {
					minDistance = distances[j];
					currentNode = j;
				}
			}

			if (currentNode === -1) break; // 到達不可能なノードしか残っていない

			visited[currentNode] = true;

			steps.push({
				id: stepId++,
				description: `ノード ${graphData.nodes[currentNode]} を選択（距離: ${distances[currentNode]}）`,
				state: {
					distances: [...distances],
					visited: [...visited],
					current: currentNode,
				},
			});

			// 隣接ノードの距離を更新
			if (graphData.edges) {
				for (const edge of graphData.edges) {
					if (edge.from === currentNode && !visited[edge.to]) {
						const newDistance = distances[currentNode] + edge.weight;
						if (newDistance < distances[edge.to]) {
							distances[edge.to] = newDistance;
							previous[edge.to] = currentNode;

							steps.push({
								id: stepId++,
								description: `ノード ${graphData.nodes[edge.to]} への距離を ${newDistance} に更新`,
								state: {
									distances: [...distances],
									visited: [...visited],
									current: currentNode,
									updated: edge.to,
									edge: { ...edge },
								},
							});
						}
					}
				}
			}
		}

		// 最短経路を構築
		const paths: Record<number, number[]> = {};
		for (let i = 0; i < n; i++) {
			if (i !== startNodeIndex && distances[i] !== Number.POSITIVE_INFINITY) {
				const path = [];
				let current = i;
				while (current !== -1) {
					path.unshift(current);
					current = previous[current];
				}
				paths[i] = path;
			}
		}

		steps.push({
			id: stepId++,
			description: "ダイクストラ法の計算が完了しました",
			state: {
				distances: [...distances],
				visited: [...visited],
				paths,
			},
		});

		return {
			steps,
			result: {
				distances,
				paths,
				startNode: startNodeIndex,
			},
		};
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return DijkstraAlgorithm.getDefaultInput();
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
ダイクストラ法は、重み付きグラフで単一始点最短経路問題を解くグリーディアルゴリズムです。

【詳細】**基本原理**
1. 始点の距離を0、他を∞に初期化
2. 未確定の頂点から最短距離の頂点を選択
3. その頂点の隣接頂点の距離を更新
4. 全頂点が確定するまで繰り返し

 **効率性**
- 優先度付きキューを使用してO((V+E)logV)を実現
- 負の重みがない場合に最適解を保証

【ポイント】**実用例**
- カーナビゲーションシステム
- ネットワークルーティング
- ゲームAIの経路探索
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
					{ from: 0, to: 1, weight: 4 },
					{ from: 0, to: 2, weight: 2 },
					{ from: 1, to: 2, weight: 1 },
					{ from: 1, to: 3, weight: 5 },
					{ from: 2, to: 3, weight: 8 },
					{ from: 2, to: 4, weight: 10 },
					{ from: 3, to: 4, weight: 2 },
				],
			},
			startNode: 0,
		};
	}

	/**
	 * 推奨されるサンプル入力
	 */
	static getRecommendedExamples(): AlgorithmInput[] {
		return [
			{
				graph: {
					nodes: ["S", "A", "B", "C", "T"],
					edges: [
						{ from: 0, to: 1, weight: 3 },
						{ from: 0, to: 2, weight: 5 },
						{ from: 1, to: 2, weight: 1 },
						{ from: 1, to: 3, weight: 2 },
						{ from: 2, to: 3, weight: 1 },
						{ from: 3, to: 4, weight: 4 },
						{ from: 2, to: 4, weight: 6 },
					],
				},
				startNode: 0,
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
				startNode: 0,
			},
		];
	}
}
