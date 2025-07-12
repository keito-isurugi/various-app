/**
 * src/app/algorithms/depth-first-search/page.tsx
 *
 * 深さ優先探索（DFS）アルゴリズムの解説ページ
 * インタラクティブなグラフ操作と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { dfsExplanation } from "../../../data/explanations/dfs-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { DepthFirstSearchAlgorithm } from "../../../utils/algorithms/dfs";

/**
 * グラフの隣接リスト表現
 */
interface Graph {
	[node: string]: string[];
}

/**
 * 深さ優先探索学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function DepthFirstSearchPage() {
	// アルゴリズムインスタンス
	const algorithm = new DepthFirstSearchAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState<
		"recursive" | "iterative"
	>("recursive");
	const [customGraph, setCustomGraph] = useState(
		'{"A":["B","C"],"B":["D","E"],"C":["F"],"D":[],"E":["F"],"F":[]}',
	);
	const [startNode, setStartNode] = useState("A");
	const [targetNode, setTargetNode] = useState("");

	/**
	 * アルゴリズムを実行
	 */
	const executeAlgorithm = useCallback(() => {
		setIsExecuting(true);
		try {
			const executionResult = algorithm.execute(input);
			setResult(executionResult);
		} catch (error) {
			console.error("アルゴリズム実行エラー:", error);
			alert(
				error instanceof Error ? error.message : "実行中にエラーが発生しました",
			);
		} finally {
			setIsExecuting(false);
		}
	}, [algorithm, input]);

	/**
	 * 推奨グラフを設定
	 */
	const setRecommendedGraph = useCallback(
		(graphData: {
			graph: Graph;
			startNode: string;
			targetNode?: string;
		}) => {
			setInput({
				array: [],
				target: undefined,
				parameters: {
					graph: graphData.graph,
					startNode: graphData.startNode,
					method: selectedMethod,
					targetNode: graphData.targetNode || undefined,
				},
			});
			setCustomGraph(JSON.stringify(graphData.graph));
			setStartNode(graphData.startNode);
			setTargetNode(graphData.targetNode || "");
			setResult(null);
		},
		[selectedMethod],
	);

	/**
	 * カスタムグラフを適用
	 */
	const applyCustomGraph = useCallback(() => {
		try {
			// JSON形式のグラフをパース
			const graphData = JSON.parse(customGraph) as Graph;

			// グラフデータの検証
			if (typeof graphData !== "object" || Array.isArray(graphData)) {
				throw new Error(
					"グラフは { ノード: [隣接ノード配列] } の形式で入力してください",
				);
			}

			// ノード名の検証
			const nodes = Object.keys(graphData);
			if (nodes.length === 0) {
				throw new Error("少なくとも1つのノードを含む必要があります");
			}

			if (nodes.length > 15) {
				throw new Error("教育目的のため、ノード数は15個以下に制限されています");
			}

			// 隣接リストの検証
			for (const [node, neighbors] of Object.entries(graphData)) {
				if (!Array.isArray(neighbors)) {
					throw new Error(
						`ノード「${node}」の隣接リストは配列である必要があります`,
					);
				}

				for (const neighbor of neighbors) {
					if (typeof neighbor !== "string") {
						throw new Error(
							`隣接ノードは文字列である必要があります：${neighbor}`,
						);
					}
				}
			}

			// 開始ノードの検証
			if (!startNode || !(startNode in graphData)) {
				throw new Error(`開始ノード「${startNode}」がグラフに存在しません`);
			}

			// ターゲットノードの検証（指定されている場合）
			if (targetNode && !(targetNode in graphData)) {
				throw new Error(
					`ターゲットノード「${targetNode}」がグラフに存在しません`,
				);
			}

			setInput({
				array: [],
				target: undefined,
				parameters: {
					graph: graphData,
					startNode: startNode,
					method: selectedMethod,
					targetNode: targetNode || undefined,
				},
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error
					? error.message
					: "グラフの解析でエラーが発生しました",
			);
		}
	}, [customGraph, startNode, targetNode, selectedMethod]);

	/**
	 * 実装方式の変更
	 */
	const handleMethodChange = useCallback(
		(method: "recursive" | "iterative") => {
			setSelectedMethod(method);
			if (input.parameters) {
				setInput({
					...input,
					parameters: {
						...input.parameters,
						method: method,
					},
				});
			}
			setResult(null);
		},
		[input],
	);

	// 推奨グラフを取得
	const recommendedGraphs = DepthFirstSearchAlgorithm.getRecommendedGraphs();

	// 現在のグラフの統計情報
	const currentGraph = (input.parameters?.graph as Graph) || {};
	const currentStartNode = (input.parameters?.startNode as string) || "";
	const currentTargetNode = (input.parameters?.targetNode as string) || "";
	const statistics = DepthFirstSearchAlgorithm.getGraphStatistics(currentGraph);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずナビゲーション */}
				<nav className="mb-6" aria-label="パンくずナビゲーション">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Link
							href="/algorithms"
							className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>戻る</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							アルゴリズム学習
						</Link>
						<span className="text-gray-400">／</span>
						<span className="text-gray-900 dark:text-gray-100 font-medium">
							深さ優先探索（DFS）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						深さ優先探索（DFS）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						グラフを深く探索するアルゴリズム。バックトラッキングで全経路を系統的に調査
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
								O(V+E)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								O(V)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								空間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
								中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								グラフ探索
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								手法
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 設定パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								🌲 実行設定
							</h3>

							{/* 実装方式選択 */}
							<div className="mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									実装方式
								</h4>
								<div className="grid grid-cols-2 gap-2">
									<button
										type="button"
										onClick={() => handleMethodChange("recursive")}
										className={`py-2 px-3 text-sm rounded transition-colors ${
											selectedMethod === "recursive"
												? "bg-indigo-600 text-white"
												: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
										}`}
									>
										再帰実装
									</button>
									<button
										type="button"
										onClick={() => handleMethodChange("iterative")}
										className={`py-2 px-3 text-sm rounded transition-colors ${
											selectedMethod === "iterative"
												? "bg-indigo-600 text-white"
												: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
										}`}
									>
										反復実装
									</button>
								</div>
							</div>

							{/* 現在のグラフ情報 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										ノード数:
									</span>
									<span className="ml-2 font-mono text-sm text-indigo-600 dark:text-indigo-400">
										{statistics.nodeCount}個
									</span>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										辺数:
									</span>
									<span className="ml-2 font-mono text-sm text-gray-900 dark:text-gray-100">
										{statistics.edgeCount}本
									</span>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										開始ノード:
									</span>
									<span className="ml-2 font-mono text-sm font-bold text-green-600 dark:text-green-400">
										{currentStartNode}
									</span>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										ターゲット:
									</span>
									<span className="ml-2 font-mono text-sm text-red-600 dark:text-red-400">
										{currentTargetNode || "なし（全探索）"}
									</span>
								</div>
							</div>

							{/* グラフ設定 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="custom-graph"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										グラフ（JSON形式）
									</label>
									<textarea
										id="custom-graph"
										value={customGraph}
										onChange={(e) => setCustomGraph(e.target.value)}
										placeholder='{"A":["B","C"],"B":[],"C":[]}'
										rows={4}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 font-mono text-xs"
									/>
								</div>

								<div className="grid grid-cols-2 gap-2">
									<div>
										<label
											htmlFor="start-node"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
										>
											開始ノード
										</label>
										<input
											id="start-node"
											type="text"
											value={startNode}
											onChange={(e) => setStartNode(e.target.value)}
											placeholder="A"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
									<div>
										<label
											htmlFor="target-node"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
										>
											ターゲット（任意）
										</label>
										<input
											id="target-node"
											type="text"
											value={targetNode}
											onChange={(e) => setTargetNode(e.target.value)}
											placeholder="F"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
								</div>

								<button
									type="button"
									onClick={applyCustomGraph}
									className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
								>
									適用
								</button>
							</div>

							{/* 推奨グラフ */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									📊 推奨グラフ
								</h4>
								<div className="space-y-2">
									{recommendedGraphs.slice(0, 6).map((rec) => (
										<button
											key={rec.description}
											type="button"
											onClick={() => setRecommendedGraph(rec)}
											className="w-full py-2 px-3 text-left text-xs rounded transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={rec.characteristics}
										>
											<div className="font-medium">{rec.description}</div>
											<div className="text-xs opacity-75 mt-1">
												開始: {rec.startNode},{" "}
												{
													DepthFirstSearchAlgorithm.getGraphStatistics(
														rec.graph,
													).nodeCount
												}
												ノード
											</div>
										</button>
									))}
								</div>
							</div>

							{/* 実行ボタン */}
							<button
								type="button"
								onClick={executeAlgorithm}
								disabled={isExecuting || statistics.nodeCount === 0}
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
									isExecuting || statistics.nodeCount === 0
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting
									? "実行中..."
									: `🌲 DFS実行（${selectedMethod === "recursive" ? "再帰" : "反復"}）`}
							</button>

							{/* 結果表示 */}
							{result && (
								<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
										実行結果
									</h4>
									<div className="space-y-2 text-sm">
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												結果:
											</span>
											<div className="ml-2 font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all">
												{Array.isArray(result.result)
													? `[${result.result.join(" → ")}]`
													: result.result?.toString()}
											</div>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												実行ステップ数:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{result.executionSteps?.length ?? 0}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												計算量:
											</span>
											<span className="ml-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">
												{result.timeComplexity}
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* 可視化エリア */}
					<div className="xl:col-span-2">
						{result ? (
							<AlgorithmVisualizer steps={result.steps} className="mb-8" />
						) : (
							<div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center mb-8">
								<div className="text-6xl mb-4">🌲</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									深さ優先探索を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルからグラフを設定し、「DFS実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={dfsExplanation}
						defaultExpanded={false}
						className="shadow-xl"
					/>
				</section>

				{/* コード例セクション */}
				<section className="mt-12">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
							💻 実装例（JavaScript）
						</h3>
						<div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
							<pre className="text-sm text-gray-100">
								<code>{`// 再帰による深さ優先探索
function dfsRecursive(graph, startNode, visited = new Set()) {
    // 現在のノードを訪問
    visited.add(startNode);
    console.log(\`訪問: \${startNode}\`);
    
    // 隣接ノードを再帰的に探索
    const neighbors = graph[startNode] || [];
    for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            dfsRecursive(graph, neighbor, visited);
        }
    }
}

// スタックによる反復実装
function dfsIterative(graph, startNode) {
    const visited = new Set();
    const stack = [startNode];
    
    while (stack.length > 0) {
        const currentNode = stack.pop();
        
        if (!visited.has(currentNode)) {
            visited.add(currentNode);
            console.log(\`訪問: \${currentNode}\`);
            
            // 隣接ノードをスタックに追加（逆順で追加）
            const neighbors = graph[currentNode] || [];
            for (let i = neighbors.length - 1; i >= 0; i--) {
                if (!visited.has(neighbors[i])) {
                    stack.push(neighbors[i]);
                }
            }
        }
    }
}

// 使用例
const graph = {
    A: ['B', 'C'],
    B: ['D', 'E'],
    C: ['F'],
    D: [],
    E: ['F'],
    F: []
};

console.log("=== 再帰実装 ===");
dfsRecursive(graph, 'A');

console.log("=== 反復実装 ===");
dfsIterative(graph, 'A');

// パス探索版（目標ノードまでの経路を発見）
function findPath(graph, start, target, visited = new Set(), path = []) {
    visited.add(start);
    path.push(start);
    
    if (start === target) {
        return path; // 経路を発見
    }
    
    const neighbors = graph[start] || [];
    for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            const result = findPath(graph, neighbor, target, visited, [...path]);
            if (result) {
                return result;
            }
        }
    }
    
    return null; // 経路が見つからない
}

// 連結成分の検出
function getConnectedComponents(graph) {
    const visited = new Set();
    const components = [];
    
    for (const node in graph) {
        if (!visited.has(node)) {
            const component = [];
            dfsComponent(graph, node, visited, component);
            components.push(component);
        }
    }
    
    return components;
}

function dfsComponent(graph, node, visited, component) {
    visited.add(node);
    component.push(node);
    
    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            dfsComponent(graph, neighbor, visited, component);
        }
    }
}`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* 実装比較セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
						<h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
							🔄 再帰実装 vs 反復実装
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
									再帰実装の特徴
								</h4>
								<ul className="space-y-2 text-indigo-700 dark:text-indigo-300 text-sm">
									<li>• 直感的で理解しやすい</li>
									<li>• コードが簡潔で美しい</li>
									<li>• バックトラッキングが自動</li>
									<li>• 関数型プログラミングと相性良</li>
									<li>• 深いグラフでスタックオーバーフローリスク</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
									反復実装の特徴
								</h4>
								<ul className="space-y-2 text-indigo-700 dark:text-indigo-300 text-sm">
									<li>• スタックオーバーフロー回避</li>
									<li>• メモリ使用量の制御が容易</li>
									<li>• 大規模グラフでも安全</li>
									<li>• 探索過程の一時停止・再開が可能</li>
									<li>• 明示的なスタック管理が必要</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* 応用例セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
						<h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
							🚀 深さ優先探索の応用分野
						</h3>
						<div className="grid md:grid-cols-3 gap-6">
							<div>
								<h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
									基本的な応用
								</h4>
								<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
									<li>• 迷路の解法</li>
									<li>• 経路探索</li>
									<li>• 連結性の判定</li>
									<li>• 循環検出</li>
									<li>• 木の走査</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
									アルゴリズム応用
								</h4>
								<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
									<li>• トポロジカルソート</li>
									<li>• 強連結成分の検出</li>
									<li>• 橋・関節点の発見</li>
									<li>• 最小全域木（Kruskal）</li>
									<li>• バックトラッキング</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
									実世界の応用
								</h4>
								<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
									<li>• ウェブクローリング</li>
									<li>• ファイルシステム探索</li>
									<li>• ゲームAI（ゲーム木探索）</li>
									<li>• SNSの友達関係分析</li>
									<li>• 依存関係解析</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
