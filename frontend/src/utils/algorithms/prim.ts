import type {
	Algorithm,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
	GraphData,
} from "@/types/algorithm";

/**
 * 優先度付きキューの実装（最小ヒープ）
 */
class MinHeap<T> {
	private heap: T[];
	private compare: (a: T, b: T) => number;

	constructor(compareFunction: (a: T, b: T) => number) {
		this.heap = [];
		this.compare = compareFunction;
	}

	private parent(index: number): number {
		return Math.floor((index - 1) / 2);
	}

	private leftChild(index: number): number {
		return 2 * index + 1;
	}

	private rightChild(index: number): number {
		return 2 * index + 2;
	}

	private swap(i: number, j: number): void {
		[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
	}

	private heapifyUp(index: number): void {
		let currentIndex = index;
		while (
			currentIndex > 0 &&
			this.compare(
				this.heap[currentIndex],
				this.heap[this.parent(currentIndex)],
			) < 0
		) {
			this.swap(currentIndex, this.parent(currentIndex));
			currentIndex = this.parent(currentIndex);
		}
	}

	private heapifyDown(index: number): void {
		let minIndex = index;
		const left = this.leftChild(index);
		const right = this.rightChild(index);

		if (
			left < this.heap.length &&
			this.compare(this.heap[left], this.heap[minIndex]) < 0
		) {
			minIndex = left;
		}

		if (
			right < this.heap.length &&
			this.compare(this.heap[right], this.heap[minIndex]) < 0
		) {
			minIndex = right;
		}

		if (index !== minIndex) {
			this.swap(index, minIndex);
			this.heapifyDown(minIndex);
		}
	}

	insert(item: T): void {
		this.heap.push(item);
		this.heapifyUp(this.heap.length - 1);
	}

	extractMin(): T | undefined {
		if (this.heap.length === 0) return undefined;
		if (this.heap.length === 1) return this.heap.pop();

		const min = this.heap[0];
		const lastElement = this.heap.pop();
		if (lastElement !== undefined) {
			this.heap[0] = lastElement;
			this.heapifyDown(0);
		}
		return min;
	}

	isEmpty(): boolean {
		return this.heap.length === 0;
	}

	size(): number {
		return this.heap.length;
	}
}

/**
 * プリム法のアルゴリズム実装
 * 最小全域木を構築する
 */
export class PrimAlgorithm implements Algorithm {
	readonly info = {
		id: "prim",
		name: "プリム法",
		description: "最小全域木を求めるアルゴリズム（頂点ベース）",
		category: "graph" as const,
		timeComplexity: {
			best: "O(E log V)",
			average: "O(E log V)",
			worst: "O(E log V)",
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

		if (!graphData.edges || graphData.edges.length === 0) {
			return {
				steps: [],
				result: { error: "辺が存在しません" },
			};
		}

		const n = graphData.nodes.length;
		const steps: AlgorithmStep[] = [];
		const mst: typeof graphData.edges = [];
		const inMST = new Array(n).fill(false);
		let totalWeight = 0;

		// 隣接リストを構築
		const adjList: Array<
			Array<{ to: number; weight: number; edgeIndex: number }>
		> = Array.from({ length: n }, () => []);

		graphData.edges.forEach((edge, index) => {
			adjList[edge.from].push({
				to: edge.to,
				weight: edge.weight,
				edgeIndex: index,
			});
			adjList[edge.to].push({
				to: edge.from,
				weight: edge.weight,
				edgeIndex: index,
			});
		});

		// 優先度付きキュー（重み, 終点, 始点）
		const pq = new MinHeap<{
			weight: number;
			to: number;
			from: number;
			edgeIndex: number;
		}>((a, b) => a.weight - b.weight);

		// 開始ノードをMSTに追加
		inMST[startNodeIndex] = true;

		steps.push({
			id: 0,
			description: `ノード ${graphData.nodes[startNodeIndex]} から開始`,
			state: {
				inMST: [...inMST],
				mst: [],
				totalWeight: 0,
				currentNode: startNodeIndex,
			},
		});

		// 開始ノードから出る辺をキューに追加
		for (const neighbor of adjList[startNodeIndex]) {
			pq.insert({
				weight: neighbor.weight,
				to: neighbor.to,
				from: startNodeIndex,
				edgeIndex: neighbor.edgeIndex,
			});
		}

		// V-1本の辺を選択するまで繰り返し
		while (!pq.isEmpty() && mst.length < n - 1) {
			const edge = pq.extractMin();
			if (!edge) break;

			const { weight, to, from } = edge;

			// 既にMSTに含まれている場合はスキップ
			if (inMST[to]) {
				steps.push({
					id: steps.length,
					description: `辺 ${graphData.nodes[from]} - ${graphData.nodes[to]} (重み: ${weight}) は閉路を形成するためスキップ`,
					state: {
						inMST: [...inMST],
						mst: [...mst],
						totalWeight,
						rejectedEdge: { from, to, weight },
					},
				});
				continue;
			}

			// この辺をMSTに追加
			const selectedEdge = graphData.edges.find(
				(e) =>
					(e.from === from && e.to === to) || (e.from === to && e.to === from),
			);
			if (selectedEdge) {
				mst.push(selectedEdge);
			}

			totalWeight += weight;
			inMST[to] = true;

			steps.push({
				id: steps.length,
				description: `辺 ${graphData.nodes[from]} - ${graphData.nodes[to]} (重み: ${weight}) をMSTに追加`,
				state: {
					inMST: [...inMST],
					mst: [...mst],
					totalWeight,
					addedEdge: { from, to, weight },
					newNode: to,
				},
			});

			// 新しく追加されたノードから出る辺をキューに追加
			for (const neighbor of adjList[to]) {
				if (!inMST[neighbor.to]) {
					pq.insert({
						weight: neighbor.weight,
						to: neighbor.to,
						from: to,
						edgeIndex: neighbor.edgeIndex,
					});
				}
			}
		}

		// 最小全域木の完成チェック
		if (mst.length === n - 1) {
			steps.push({
				id: steps.length,
				description: `最小全域木が完成しました（総重み: ${totalWeight}）`,
				state: {
					inMST: [...inMST],
					mst: [...mst],
					totalWeight,
				},
			});
		} else {
			steps.push({
				id: steps.length,
				description: "グラフが連結していないため、最小全域木を構築できません",
				state: {
					inMST: [...inMST],
					mst: [...mst],
					totalWeight,
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
		return PrimAlgorithm.getDefaultInput();
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
プリム法は、重み付き無向グラフから最小全域木を構築するグリーディアルゴリズムです。

🔍 **基本原理**
1. 任意の頂点から開始してMSTに追加
2. MSTに含まれない頂点への辺の中で最小重みの辺を選択
3. その辺の終点をMSTに追加
4. V-1本の辺を選択するまで繰り返し

📈 **効率性**
- O(E log V)の時間計算量
- 優先度付きキューで効率的な最小辺選択
- 密グラフに適している

🎯 **実用例**
- 通信ネットワークの最適化
- 迷路生成アルゴリズム
- 巡回セールスマン問題の近似解法
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
