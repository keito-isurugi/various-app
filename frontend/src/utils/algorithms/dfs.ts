/**
 * src/utils/algorithms/dfs.ts
 *
 * 深さ優先探索（DFS）アルゴリズムの実装
 * 教育目的でステップバイステップのグラフ探索をサポート
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * グラフの隣接リスト表現
 */
interface Graph {
	[node: string]: string[]; // ノード名 → 隣接ノードリスト
}

/**
 * DFS探索の詳細情報
 */
interface DFSState {
	currentNode: string; // 現在探索中のノード
	visitedNodes: string[]; // 訪問済みノードのリスト
	stack: string[]; // 探索用スタック（反復実装用）
	depth: number; // 現在の探索深度
	pathFromStart: string[]; // 開始点からの経路
	isBacktracking: boolean; // バックトラック中かどうか
}

/**
 * DFSの実装方式
 */
type DFSMethod = "recursive" | "iterative";

/**
 * 深さ優先探索（DFS）アルゴリズムクラス
 *
 * グラフの深さ優先探索
 * 時間計算量: O(V + E) - 頂点数V、辺数E
 * 空間計算量: O(V) - 訪問済み管理とスタック
 */
export class DepthFirstSearchAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "depth-first-search",
		name: "深さ優先探索（DFS）",
		description:
			"グラフや木構造を深く探索するアルゴリズム。可能な限り深く進んでからバックトラックして他の経路を探索",
		category: "graph",
		timeComplexity: {
			best: "O(V + E)", // すべての場合で同じ
			average: "O(V + E)", // すべての場合で同じ
			worst: "O(V + E)", // すべての場合で同じ
		},
		difficulty: 3, // 中級（グラフ理論とスタック/再帰の理解が必要）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private graph: Graph = {};
	private visited: Set<string> = new Set();
	private visitOrder: string[] = [];
	private maxDepth = 0;
	private totalNodes = 0;

	/**
	 * 深さ優先探索を実行
	 * @param input グラフ情報と開始ノード
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証とグラフの構築
		const graphData = input.parameters?.graph as Graph;
		const startNode = input.parameters?.startNode as string;
		const method = (input.parameters?.method as DFSMethod) || "recursive";
		const targetNode = input.parameters?.targetNode as string;

		if (!graphData || typeof graphData !== "object") {
			throw new Error("グラフデータが指定されていません");
		}

		if (!startNode || typeof startNode !== "string") {
			throw new Error("開始ノードが指定されていません");
		}

		if (!(startNode in graphData)) {
			throw new Error(`開始ノード「${startNode}」がグラフに存在しません`);
		}

		// グラフのサイズ制限
		const nodeCount = Object.keys(graphData).length;
		if (nodeCount > 15) {
			throw new Error("教育目的のため、ノード数は15個以下に制限されています");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.graph = { ...graphData };
		this.visited = new Set();
		this.visitOrder = [];
		this.maxDepth = 0;
		this.totalNodes = nodeCount;

		// グラフ情報の表示
		const edges = this.getEdgeCount();
		this.steps.push({
			id: this.stepId++,
			description: `深さ優先探索（DFS）開始：${method === "recursive" ? "再帰実装" : "反復実装"}`,
			array: [], // DFSでは配列は使用しない
			operation: "初期化",
			variables: {
				graph: this.formatGraphForDisplay(),
				startNode: startNode,
				method: method === "recursive" ? "再帰実装" : "反復実装",
				nodes: nodeCount,
				edges: edges,
				targetNode: targetNode || "指定なし（全探索）",
				goal: targetNode ? `ノード「${targetNode}」を発見` : "全ノードを訪問",
			},
		});

		// 実装方式に応じて実行
		let foundTarget = false;
		if (method === "recursive") {
			foundTarget = this.dfsRecursive(startNode, targetNode, [], 0);
		} else {
			foundTarget = this.dfsIterative(startNode, targetNode);
		}

		// 完了ステップ
		const result = targetNode
			? foundTarget
			: this.visitOrder.length === nodeCount;
		this.steps.push({
			id: this.stepId++,
			description: `🎉 DFS完了！${targetNode ? (foundTarget ? `ターゲット「${targetNode}」を発見` : `ターゲット「${targetNode}」は見つかりませんでした`) : `${this.visitOrder.length}/${nodeCount}個のノードを訪問`}`,
			array: [],
			operation: "完了",
			variables: {
				success: result,
				visitOrder: [...this.visitOrder],
				visitedCount: this.visitOrder.length,
				totalNodes: nodeCount,
				maxDepth: this.maxDepth,
				method: method === "recursive" ? "再帰実装" : "反復実装",
				timeComplexity: this.info.timeComplexity.average,
				efficiency: `${this.visitOrder.length}ノード訪問、最大深度${this.maxDepth}`,
			},
		});

		return {
			success: true,
			result: targetNode ? foundTarget : this.visitOrder,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
		};
	}

	/**
	 * 再帰による深さ優先探索
	 * @param node 現在のノード
	 * @param targetNode 探索目標ノード（オプション）
	 * @param path 現在までの経路
	 * @param depth 現在の深度
	 * @returns ターゲットが見つかったかどうか
	 */
	private dfsRecursive(
		node: string,
		targetNode?: string,
		path: string[] = [],
		depth = 0,
	): boolean {
		// 深度の更新
		this.maxDepth = Math.max(this.maxDepth, depth);

		// 現在のノードを訪問
		this.visited.add(node);
		this.visitOrder.push(node);
		const currentPath = [...path, node];

		// 訪問ステップ
		this.steps.push({
			id: this.stepId++,
			description: `ノード「${node}」を訪問（深度: ${depth}）`,
			array: [],
			operation: "ノード訪問",
			variables: {
				currentNode: node,
				depth: depth,
				visited: [...this.visitOrder],
				path: [...currentPath],
				neighbors: this.graph[node] || [],
				visitedCount: this.visitOrder.length,
				isTarget: targetNode === node,
			},
		});

		// ターゲット発見チェック
		if (targetNode && node === targetNode) {
			this.steps.push({
				id: this.stepId++,
				description: `✅ ターゲット「${targetNode}」を発見！探索完了`,
				array: [],
				operation: "ターゲット発見",
				variables: {
					targetNode: targetNode,
					foundAt: node,
					path: [...currentPath],
					depth: depth,
					searchComplete: true,
				},
			});
			return true;
		}

		// 隣接ノードの探索
		const neighbors = this.graph[node] || [];
		const unvisitedNeighbors = neighbors.filter(
			(neighbor) => !this.visited.has(neighbor),
		);

		if (unvisitedNeighbors.length > 0) {
			this.steps.push({
				id: this.stepId++,
				description: `ノード「${node}」から隣接ノードを探索：[${unvisitedNeighbors.join(", ")}]`,
				array: [],
				operation: "隣接ノード探索",
				variables: {
					currentNode: node,
					allNeighbors: neighbors,
					unvisitedNeighbors: unvisitedNeighbors,
					depth: depth,
					explorationDirection: "深い方向に進む",
				},
			});

			// 各隣接ノードを再帰的に探索
			for (const neighbor of unvisitedNeighbors) {
				if (!this.visited.has(neighbor)) {
					this.steps.push({
						id: this.stepId++,
						description: `「${node}」→「${neighbor}」に移動して探索を継続`,
						array: [],
						operation: "再帰呼び出し",
						variables: {
							from: node,
							to: neighbor,
							depth: depth,
							nextDepth: depth + 1,
							action: "深く掘り下げる",
						},
					});

					// 再帰呼び出し
					const found = this.dfsRecursive(
						neighbor,
						targetNode,
						currentPath,
						depth + 1,
					);
					if (found && targetNode) {
						return true; // ターゲットが見つかった場合は早期終了
					}

					// バックトラッキング
					if (!found || !targetNode) {
						this.steps.push({
							id: this.stepId++,
							description: `「${neighbor}」から「${node}」にバックトラック（深度: ${depth + 1} → ${depth}）`,
							array: [],
							operation: "バックトラック",
							variables: {
								from: neighbor,
								to: node,
								fromDepth: depth + 1,
								toDepth: depth,
								reason: targetNode
									? "ターゲット未発見のため戻る"
									: "この方向の探索完了",
							},
						});
					}
				}
			}
		} else {
			// 行き止まり
			this.steps.push({
				id: this.stepId++,
				description: `ノード「${node}」は行き止まり（未訪問の隣接ノードなし）`,
				array: [],
				operation: "行き止まり",
				variables: {
					currentNode: node,
					allNeighbors: neighbors,
					depth: depth,
					reason: "すべての隣接ノードが訪問済み",
					action: "バックトラックの準備",
				},
			});
		}

		return false; // ターゲットは見つからなかった
	}

	/**
	 * スタックによる反復的深さ優先探索
	 * @param startNode 開始ノード
	 * @param targetNode 探索目標ノード（オプション）
	 * @returns ターゲットが見つかったかどうか
	 */
	private dfsIterative(startNode: string, targetNode?: string): boolean {
		const stack: Array<{ node: string; depth: number; path: string[] }> = [];

		// 初期化
		stack.push({ node: startNode, depth: 0, path: [] });

		this.steps.push({
			id: this.stepId++,
			description: `スタックに開始ノード「${startNode}」をプッシュ`,
			array: [],
			operation: "スタック初期化",
			variables: {
				stack: [startNode],
				stackSize: 1,
				operation: "push",
			},
		});

		while (stack.length > 0) {
			// スタックからノードをポップ
			const current = stack.pop();
			if (!current) break;

			const { node, depth, path } = current;
			const currentPath = [...path, node];

			// 深度の更新
			this.maxDepth = Math.max(this.maxDepth, depth);

			// 既に訪問済みの場合はスキップ
			if (this.visited.has(node)) {
				this.steps.push({
					id: this.stepId++,
					description: `ノード「${node}」は既に訪問済みのためスキップ`,
					array: [],
					operation: "重複チェック",
					variables: {
						node: node,
						alreadyVisited: true,
						stackSize: stack.length,
					},
				});
				continue;
			}

			// ノードを訪問
			this.visited.add(node);
			this.visitOrder.push(node);

			this.steps.push({
				id: this.stepId++,
				description: `スタックから「${node}」をポップして訪問（深度: ${depth}）`,
				array: [],
				operation: "ノード訪問",
				variables: {
					currentNode: node,
					depth: depth,
					visited: [...this.visitOrder],
					path: [...currentPath],
					stackSize: stack.length,
					stackContents: stack.map((item) => item.node),
				},
			});

			// ターゲット発見チェック
			if (targetNode && node === targetNode) {
				this.steps.push({
					id: this.stepId++,
					description: `✅ ターゲット「${targetNode}」を発見！探索完了`,
					array: [],
					operation: "ターゲット発見",
					variables: {
						targetNode: targetNode,
						foundAt: node,
						path: [...currentPath],
						depth: depth,
						searchComplete: true,
					},
				});
				return true;
			}

			// 隣接ノードをスタックに追加（逆順で追加してDFSの順序を保つ）
			const neighbors = this.graph[node] || [];
			const unvisitedNeighbors = neighbors.filter(
				(neighbor) => !this.visited.has(neighbor),
			);

			if (unvisitedNeighbors.length > 0) {
				// 逆順で追加（スタックなので最後に追加したものが最初に処理される）
				const neighborsToAdd = [...unvisitedNeighbors].reverse();

				this.steps.push({
					id: this.stepId++,
					description: `「${node}」の隣接ノード [${neighborsToAdd.join(", ")}] をスタックにプッシュ`,
					array: [],
					operation: "隣接ノード追加",
					variables: {
						currentNode: node,
						neighbors: neighborsToAdd,
						stackBefore: stack.map((item) => item.node),
						addingNodes: neighborsToAdd,
					},
				});

				for (const neighbor of neighborsToAdd) {
					if (!this.visited.has(neighbor)) {
						stack.push({
							node: neighbor,
							depth: depth + 1,
							path: currentPath,
						});
					}
				}

				this.steps.push({
					id: this.stepId++,
					description: `スタック更新完了（サイズ: ${stack.length}）`,
					array: [],
					operation: "スタック更新",
					variables: {
						stackAfter: stack.map((item) => item.node),
						stackSize: stack.length,
						nextNode: stack.length > 0 ? stack[stack.length - 1].node : "なし",
					},
				});
			} else {
				this.steps.push({
					id: this.stepId++,
					description: `「${node}」に未訪問の隣接ノードなし`,
					array: [],
					operation: "行き止まり",
					variables: {
						currentNode: node,
						allNeighbors: neighbors,
						reason: "すべての隣接ノードが訪問済み",
						stackSize: stack.length,
					},
				});
			}
		}

		// スタックが空になった
		this.steps.push({
			id: this.stepId++,
			description: "スタックが空になりました。探索完了",
			array: [],
			operation: "探索完了",
			variables: {
				finalStack: [],
				visitedNodes: [...this.visitOrder],
				totalVisited: this.visitOrder.length,
				targetFound: false,
			},
		});

		return false; // ターゲットは見つからなかった
	}

	/**
	 * グラフの辺数を計算
	 */
	private getEdgeCount(): number {
		let count = 0;
		for (const node in this.graph) {
			count += this.graph[node].length;
		}
		return count;
	}

	/**
	 * グラフを表示用にフォーマット
	 */
	private formatGraphForDisplay(): string {
		const entries = Object.entries(this.graph)
			.map(([node, neighbors]) => `${node}: [${neighbors.join(", ")}]`)
			.join(", ");
		return `{${entries}}`;
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [], // DFSでは使用しない
			target: undefined,
			parameters: {
				graph: {
					A: ["B", "C"],
					B: ["D", "E"],
					C: ["F"],
					D: [],
					E: ["F"],
					F: [],
				},
				startNode: "A",
				method: "recursive",
				targetNode: undefined, // 全探索
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
深さ優先探索（DFS）は、グラフ探索の基本アルゴリズムです。

🌲 **基本概念**
- 現在のノードから可能な限り深く進む
- 行き止まりに達したらバックトラック
- 未探索の経路があれば再び深く進む
- 全ノード訪問または目標発見まで継続

🔄 **実装方式**
- 再帰実装：直感的で理解しやすい
- 反復実装：スタック使用、スタックオーバーフロー回避
- どちらも同じ探索結果を得る

📊 **計算量**
- 時間計算量：O(V + E) - 頂点数V、辺数E
- 空間計算量：O(V) - 訪問済み管理とスタック
- 実用的な性能で大規模グラフも処理可能

🔧 **応用分野**
- 迷路の解法とパスファインディング
- グラフの連結性判定
- トポロジカルソート
- ゲームAIでの状態空間探索
- コンパイラの構文解析

💡 **学習ポイント**
- グラフ理論の基礎概念
- 再帰とスタックの理解
- バックトラッキングの仕組み
- BFS（幅優先探索）との比較
- 実用的なアルゴリズム設計
		`.trim();
	}

	/**
	 * 推奨グラフの例を取得
	 */
	static getRecommendedGraphs(): Array<{
		graph: Graph;
		startNode: string;
		description: string;
		characteristics: string;
		targetNode?: string;
	}> {
		return [
			{
				graph: { A: ["B"], B: ["C"], C: [] },
				startNode: "A",
				description: "線形グラフ（3ノード）",
				characteristics: "最もシンプルな一本道構造",
			},
			{
				graph: { A: ["B", "C"], B: [], C: [] },
				startNode: "A",
				description: "二分岐グラフ",
				characteristics: "分岐の基本パターン",
			},
			{
				graph: { A: ["B", "C"], B: ["D"], C: ["D"], D: [] },
				startNode: "A",
				description: "ダイヤモンド型",
				characteristics: "複数経路が合流する構造",
			},
			{
				graph: {
					A: ["B", "C"],
					B: ["D", "E"],
					C: ["F"],
					D: [],
					E: ["F"],
					F: [],
				},
				startNode: "A",
				description: "木構造（6ノード）",
				characteristics: "階層構造の典型例",
			},
			{
				graph: { A: ["B"], B: ["C"], C: ["A"] },
				startNode: "A",
				description: "三角形（循環グラフ）",
				characteristics: "循環構造での訪問済み管理",
			},
			{
				graph: {
					A: ["B", "D"],
					B: ["A", "C", "E"],
					C: ["B", "F"],
					D: ["A", "E"],
					E: ["B", "D", "F"],
					F: ["C", "E"],
				},
				startNode: "A",
				description: "格子グラフ（2×3）",
				characteristics: "密に接続された無向グラフ",
			},
		];
	}

	/**
	 * グラフの統計情報を取得
	 */
	static getGraphStatistics(graph: Graph): {
		nodeCount: number;
		edgeCount: number;
		maxDegree: number;
		isConnected: boolean;
		hasCycles: boolean;
	} {
		const nodes = Object.keys(graph);
		const nodeCount = nodes.length;

		let edgeCount = 0;
		let maxDegree = 0;

		for (const node of nodes) {
			const degree = graph[node]?.length || 0;
			edgeCount += degree;
			maxDegree = Math.max(maxDegree, degree);
		}

		// 無向グラフの場合は辺数を半分にする必要があるが、
		// 教育目的では有向グラフとして扱う

		return {
			nodeCount,
			edgeCount,
			maxDegree,
			isConnected: true, // 簡易実装：詳細な連結性判定は省略
			hasCycles: false, // 簡易実装：詳細な循環判定は省略
		};
	}
}
