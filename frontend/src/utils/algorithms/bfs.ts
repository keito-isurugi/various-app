import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "@/types/algorithm";

export class BreadthFirstSearchAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "breadth-first-search",
		name: "幅優先探索（BFS）",
		category: "graph",
		description: "グラフや木構造を幅優先で探索する基本的なアルゴリズム",
		timeComplexity: {
			best: "O(V + E)",
			average: "O(V + E)",
			worst: "O(V + E)",
		},
		difficulty: 2,
		spaceComplexity: "O(1)",
	};

	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private visited: Set<string> = new Set();
	private queue: string[] = [];
	private path: string[] = [];
	private levels: Map<string, number> = new Map();

	execute(input: AlgorithmInput): AlgorithmResult {
		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.visited = new Set();
		this.queue = [];
		this.path = [];
		this.levels = new Map();

		const startTime = performance.now();

		// 入力検証
		if (!input.graph || typeof input.graph !== "object") {
			throw new Error("有効なグラフを入力してください");
		}

		const graph = input.graph as Record<string, string[]>;
		const startNode = input.startNode || "0";
		const targetNode = input.targetNode;
		const method = input.method || "iterative";

		// グラフの統計情報を取得
		const stats = BreadthFirstSearchAlgorithm.getGraphStatistics(graph);

		// 開始ノードが存在するか確認
		if (!graph[startNode] && !Object.keys(graph).includes(startNode)) {
			throw new Error(`開始ノード '${startNode}' がグラフに存在しません`);
		}

		// 初期ステップ
		this.addStep({
			description: `BFS開始: 開始ノード = ${startNode}${targetNode ? `, 目標ノード = ${targetNode}` : ""}`,
			highlight: [startNode],
			details: `グラフ情報: ${stats.totalNodes}ノード, ${stats.totalEdges}エッジ`,
		});

		// BFSの実行
		if (method === "levels") {
			this.bfsWithLevels(graph, startNode, targetNode);
		} else {
			this.bfsIterative(graph, startNode, targetNode);
		}

		const endTime = performance.now();

		// 結果のサマリー
		const summary =
			targetNode && this.path.includes(targetNode)
				? `目標ノード '${targetNode}' に到達しました。経路長: ${this.levels.get(targetNode) || this.path.indexOf(targetNode) + 1}`
				: `探索完了: ${this.visited.size}ノードを訪問`;

		this.addStep({
			description: summary,
			highlight:
				targetNode && this.path.includes(targetNode) ? [targetNode] : [],
			details: `総訪問ノード数: ${this.visited.size}, 実行時間: ${(endTime - startTime).toFixed(2)}ms`,
		});

		return {
			steps: this.steps,
			summary: {
				comparisons: this.visited.size,
				swaps: 0,
				timeElapsed: endTime - startTime,
				finalArray: this.path,
			},
		};
	}

	// 通常のBFS（反復的実装）
	private bfsIterative(
		graph: Record<string, string[]>,
		start: string,
		target?: string,
	): void {
		this.queue = [start];
		this.visited.add(start);
		this.path = [];

		this.addStep({
			description: `キューに開始ノード '${start}' を追加`,
			highlight: [start],
			details: `キュー: [${this.queue.join(", ")}]`,
		});

		while (this.queue.length > 0) {
			const node = this.queue.shift();
			if (!node) break;
			this.path.push(node);

			this.addStep({
				description: `ノード '${node}' を訪問`,
				highlight: [node],
				details: `キュー: [${this.queue.join(", ")}], 訪問済み: {${Array.from(this.visited).join(", ")}}`,
			});

			// 目標ノードに到達した場合
			if (target && node === target) {
				this.addStep({
					description: `目標ノード '${target}' に到達！`,
					highlight: [target],
					details: `探索経路: ${this.path.join(" → ")}`,
				});
				break;
			}

			// 隣接ノードを探索
			const neighbors = graph[node] || [];
			const unvisitedNeighbors = neighbors.filter((n) => !this.visited.has(n));

			if (unvisitedNeighbors.length > 0) {
				this.addStep({
					description: `ノード '${node}' の未訪問隣接ノードを発見: [${unvisitedNeighbors.join(", ")}]`,
					highlight: [node, ...unvisitedNeighbors],
					secondary: unvisitedNeighbors,
				});

				for (const neighbor of unvisitedNeighbors) {
					if (!this.visited.has(neighbor)) {
						this.visited.add(neighbor);
						this.queue.push(neighbor);
					}
				}

				this.addStep({
					description: "隣接ノードをキューに追加",
					highlight: unvisitedNeighbors,
					details: `キュー: [${this.queue.join(", ")}]`,
				});
			}
		}
	}

	// レベル別BFS（深さを記録）
	private bfsWithLevels(
		graph: Record<string, string[]>,
		start: string,
		target?: string,
	): void {
		const levelQueue: Array<[string, number]> = [[start, 0]];
		this.visited.add(start);
		this.levels.set(start, 0);
		this.path = [];

		this.addStep({
			description: `レベル別BFS開始: '${start}' (レベル0)`,
			highlight: [start],
			details: `レベル0: [${start}]`,
		});

		let currentLevel = 0;
		const nodesAtLevel: Map<number, string[]> = new Map([[0, [start]]]);

		while (levelQueue.length > 0) {
			const item = levelQueue.shift();
			if (!item) break;
			const [node, level] = item;
			this.path.push(node);

			if (level > currentLevel) {
				currentLevel = level;
				this.addStep({
					description: `レベル ${level} の探索開始`,
					highlight: nodesAtLevel.get(level) || [],
					details: `レベル ${level}: [${(nodesAtLevel.get(level) || []).join(", ")}]`,
				});
			}

			this.addStep({
				description: `ノード '${node}' を訪問 (レベル ${level})`,
				highlight: [node],
				details: `訪問順: ${this.path.join(" → ")}`,
			});

			// 目標ノードに到達した場合
			if (target && node === target) {
				this.addStep({
					description: `目標ノード '${target}' に到達！ (レベル ${level})`,
					highlight: [target],
					details: `最短距離: ${level}`,
				});
				break;
			}

			// 隣接ノードを探索
			const neighbors = graph[node] || [];
			const unvisitedNeighbors = neighbors.filter((n) => !this.visited.has(n));

			for (const neighbor of unvisitedNeighbors) {
				if (!this.visited.has(neighbor)) {
					this.visited.add(neighbor);
					this.levels.set(neighbor, level + 1);
					levelQueue.push([neighbor, level + 1]);

					// レベルごとのノードを記録
					if (!nodesAtLevel.has(level + 1)) {
						nodesAtLevel.set(level + 1, []);
					}
					nodesAtLevel.get(level + 1)?.push(neighbor);
				}
			}

			if (unvisitedNeighbors.length > 0) {
				this.addStep({
					description: `ノード '${node}' から隣接ノードを次のレベルに追加`,
					highlight: [node, ...unvisitedNeighbors],
					secondary: unvisitedNeighbors,
					details: `追加: [${unvisitedNeighbors.join(", ")}] → レベル ${level + 1}`,
				});
			}
		}

		// レベル情報のサマリー
		const levelSummary = Array.from(nodesAtLevel.entries())
			.map(([lvl, nodes]) => `レベル${lvl}: ${nodes.length}ノード`)
			.join(", ");

		this.addStep({
			description: "レベル別探索完了",
			highlight: [],
			details: levelSummary,
		});
	}

	// ステップを追加するヘルパーメソッド
	private addStep(step: Omit<AlgorithmStep, "id" | "state">): void {
		this.steps.push({
			id: this.stepId++,
			...step,
			state: {
				visited: Array.from(this.visited),
				queue: [...this.queue],
				path: [...this.path],
				levels: Object.fromEntries(this.levels),
			},
		});
	}

	getDefaultInput(): AlgorithmInput {
		return {
			graph: {
				"0": ["1", "2"],
				"1": ["0", "3", "4"],
				"2": ["0", "5", "6"],
				"3": ["1"],
				"4": ["1", "5"],
				"5": ["2", "4"],
				"6": ["2"],
			},
			startNode: "0",
			method: "iterative",
		};
	}

	getExplanation(): string {
		return `幅優先探索（BFS）は、グラフや木構造を探索する基本的なアルゴリズムです。

主な特徴：
1. キュー（FIFO）を使用して実装
2. 始点から近い頂点を優先的に探索
3. 無重みグラフで最短経路を保証
4. 時間計算量：O(V + E)
5. 空間計算量：O(V)

使用例：
- 最短経路問題
- ソーシャルネットワーク分析
- Webクローラー
- パズルゲームの解法`;
	}

	// 推奨グラフの例を返す静的メソッド
	static getRecommendedGraphs(): Array<{
		name: string;
		data: Record<string, string[]>;
	}> {
		return [
			{
				name: "単純な木構造",
				data: {
					"0": ["1", "2"],
					"1": ["3", "4"],
					"2": ["5", "6"],
					"3": [],
					"4": [],
					"5": [],
					"6": [],
				},
			},
			{
				name: "サイクルを含むグラフ",
				data: {
					"0": ["1", "2"],
					"1": ["0", "3", "4"],
					"2": ["0", "5", "6"],
					"3": ["1"],
					"4": ["1", "5"],
					"5": ["2", "4"],
					"6": ["2"],
				},
			},
			{
				name: "完全グラフ (K5)",
				data: {
					"0": ["1", "2", "3", "4"],
					"1": ["0", "2", "3", "4"],
					"2": ["0", "1", "3", "4"],
					"3": ["0", "1", "2", "4"],
					"4": ["0", "1", "2", "3"],
				},
			},
			{
				name: "二部グラフ",
				data: {
					A1: ["B1", "B2", "B3"],
					A2: ["B1", "B2", "B3"],
					A3: ["B1", "B2", "B3"],
					B1: ["A1", "A2", "A3"],
					B2: ["A1", "A2", "A3"],
					B3: ["A1", "A2", "A3"],
				},
			},
			{
				name: "迷路風グラフ",
				data: {
					"00": ["01", "10"],
					"01": ["00", "11"],
					"10": ["00", "11", "20"],
					"11": ["01", "10", "21"],
					"20": ["10", "21", "30"],
					"21": ["11", "20", "31"],
					"30": ["20", "31"],
					"31": ["21", "30"],
				},
			},
		];
	}

	// グラフの統計情報を取得する静的メソッド
	static getGraphStatistics(graph: Record<string, string[]>): {
		totalNodes: number;
		totalEdges: number;
		avgDegree: number;
		isConnected: boolean;
	} {
		const nodes = new Set<string>();
		let totalEdges = 0;

		// ノードと辺をカウント
		for (const [node, neighbors] of Object.entries(graph)) {
			nodes.add(node);
			for (const n of neighbors) {
				nodes.add(n);
			}
			totalEdges += neighbors.length;
		}

		const totalNodes = nodes.size;
		const avgDegree = totalNodes > 0 ? totalEdges / totalNodes : 0;

		// 連結性のチェック（簡易版）
		const isConnected =
			totalNodes <= 1 || Object.keys(graph).length === totalNodes;

		return {
			totalNodes,
			totalEdges: Math.floor(totalEdges / 2), // 無向グラフとして扱う
			avgDegree: Number(avgDegree.toFixed(2)),
			isConnected,
		};
	}
}
