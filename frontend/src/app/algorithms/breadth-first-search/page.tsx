"use client";

import Link from "next/link";
import React, { useState } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { bfsExplanation } from "../../../data/explanations/bfs-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { BreadthFirstSearchAlgorithm } from "../../../utils/algorithms/bfs";

const bfs = new BreadthFirstSearchAlgorithm();

export default function BreadthFirstSearchPage() {
	const [input, setInput] = useState<AlgorithmInput>(bfs.getDefaultInput());
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState<"iterative" | "levels">(
		"iterative",
	);
	const [customGraph, setCustomGraph] = useState("");
	const [startNode, setStartNode] = useState("0");
	const [targetNode, setTargetNode] = useState("");

	const handleExecute = () => {
		setIsExecuting(true);
		try {
			const updatedInput = {
				...input,
				method: selectedMethod,
				graph: customGraph ? JSON.parse(customGraph) : input.graph,
				startNode: Number(startNode),
				targetNode: targetNode ? Number(targetNode) : undefined,
			};
			setInput(updatedInput);
			const execResult = bfs.execute(updatedInput);
			setResult(execResult);
		} catch (error) {
			console.error("BFS実行エラー:", error);
			alert("グラフの形式が正しくありません。JSON形式で入力してください。");
		} finally {
			setIsExecuting(false);
		}
	};

	const handleGraphSelect = (graphJson: string) => {
		setCustomGraph(graphJson);
		try {
			const graph = JSON.parse(graphJson);
			// グラフのノードから開始ノードを設定
			const nodes = Object.keys(graph);
			if (nodes.length > 0) {
				setStartNode(nodes[0]);
			}
		} catch (error) {
			console.error("グラフ選択エラー:", error);
		}
	};

	const handleReset = () => {
		setInput(bfs.getDefaultInput());
		setResult(null);
		setCustomGraph("");
		setStartNode("0");
		setTargetNode("");
		setSelectedMethod("iterative");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* パンくずナビゲーション */}
			<nav className="mb-6">
				<ol className="flex items-center space-x-2 text-sm text-gray-500">
					<li>
						<Link href="/" className="hover:text-blue-600">
							ホーム
						</Link>
					</li>
					<li>←</li>
					<li>
						<Link href="/algorithms" className="hover:text-blue-600">
							アルゴリズム
						</Link>
					</li>
					<li>←</li>
					<li className="text-blue-600">幅優先探索（BFS）</li>
				</ol>
			</nav>

			{/* ページヘッダー */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-4">幅優先探索（BFS）</h1>
				<p className="text-xl text-gray-600">
					グラフや木構造を幅優先で探索する基本的なアルゴリズム
				</p>
			</div>

			{/* アルゴリズム情報 */}
			<div className="bg-white rounded-lg border shadow-sm mb-8">
				<div className="p-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<dt className="text-sm font-medium text-gray-500">時間計算量</dt>
							<dd className="text-lg font-semibold text-gray-900">
								{bfs.info.timeComplexity.average}
							</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">空間計算量</dt>
							<dd className="text-lg font-semibold text-gray-900">
								{bfs.info.spaceComplexity}
							</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">カテゴリ</dt>
							<dd className="text-lg font-semibold text-gray-900">
								{bfs.info.category}
							</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-gray-500">難易度</dt>
							<dd className="text-lg font-semibold text-gray-900">
								{"★".repeat(bfs.info.difficulty)}
								{"☆".repeat(5 - bfs.info.difficulty)}
							</dd>
						</div>
					</div>
				</div>
			</div>

			{/* メインコンテンツ */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
				{/* 左側：設定パネル */}
				<div className="space-y-6">
					{/* 実行設定 */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b">
							<h3 className="text-lg font-semibold">実行設定</h3>
						</div>
						<div className="p-4 space-y-4">
							<div>
								<fieldset>
									<legend className="block text-sm font-medium text-gray-700 mb-2">
										実装方式
									</legend>
									<div className="space-y-2">
										<label className="flex items-center">
											<input
												type="radio"
												name="method"
												value="iterative"
												checked={selectedMethod === "iterative"}
												onChange={(e) =>
													setSelectedMethod(
														e.target.value as "iterative" | "levels",
													)
												}
												className="mr-2"
											/>
											通常のBFS（キューを使用）
										</label>
										<label className="flex items-center">
											<input
												type="radio"
												name="method"
												value="levels"
												checked={selectedMethod === "levels"}
												onChange={(e) =>
													setSelectedMethod(
														e.target.value as "iterative" | "levels",
													)
												}
												className="mr-2"
											/>
											レベル別BFS（深さを記録）
										</label>
									</div>
								</fieldset>
							</div>

							<div className="flex gap-4">
								<button
									type="button"
									onClick={handleExecute}
									disabled={isExecuting}
									className="flex-1 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700"
								>
									{isExecuting ? "実行中..." : "実行"}
								</button>
								<button
									type="button"
									onClick={handleReset}
									className="flex-1 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
								>
									リセット
								</button>
							</div>
						</div>
					</div>

					{/* グラフ設定 */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b">
							<h3 className="text-lg font-semibold">グラフ設定</h3>
						</div>
						<div className="p-4 space-y-4">
							<div>
								<label
									htmlFor="startNode"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									開始ノード
								</label>
								<input
									id="startNode"
									type="text"
									value={startNode}
									onChange={(e) => setStartNode(e.target.value)}
									placeholder="例: 0"
									className="w-full border border-gray-300 rounded px-3 py-2"
								/>
							</div>
							<div>
								<label
									htmlFor="targetNode"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									目標ノード（オプション）
								</label>
								<input
									id="targetNode"
									type="text"
									value={targetNode}
									onChange={(e) => setTargetNode(e.target.value)}
									placeholder="例: 5"
									className="w-full border border-gray-300 rounded px-3 py-2"
								/>
							</div>
							<div>
								<label
									htmlFor="customGraph"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									カスタムグラフ（JSON形式）
								</label>
								<textarea
									id="customGraph"
									value={customGraph}
									onChange={(e) => setCustomGraph(e.target.value)}
									placeholder='{"0": ["1", "2"], "1": ["3"], ...}'
									rows={6}
									className="w-full border border-gray-300 rounded px-3 py-2"
								/>
							</div>
						</div>
					</div>

					{/* 推奨グラフ */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b">
							<h3 className="text-lg font-semibold">推奨グラフ</h3>
						</div>
						<div className="p-4 space-y-2">
							{BreadthFirstSearchAlgorithm.getRecommendedGraphs().map(
								(graph) => (
									<button
										key={graph.name}
										type="button"
										className="w-full text-left border border-gray-300 px-3 py-2 rounded hover:bg-gray-50"
										onClick={() =>
											handleGraphSelect(JSON.stringify(graph.data))
										}
									>
										{graph.name}
									</button>
								),
							)}
						</div>
					</div>
				</div>

				{/* 右側：可視化エリア */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-lg border shadow-sm h-full">
						<div className="p-4 border-b">
							<h3 className="text-lg font-semibold">可視化</h3>
						</div>
						<div className="p-4">
							<AlgorithmVisualizer
								steps={result?.steps || []}
								speed={500}
								algorithmType="graph"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* 詳細解説 */}
			<div className="mb-12">
				<CalculationExplanation explanationData={bfsExplanation} />
			</div>

			{/* コード例 */}
			<div className="bg-white rounded-lg border shadow-sm mb-12">
				<div className="p-4 border-b">
					<h3 className="text-lg font-semibold">コード例</h3>
				</div>
				<div className="p-4 space-y-6">
					<div>
						<h4 className="text-md font-semibold mb-2">TypeScript実装</h4>
						<pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto">
							<code>{`// 幅優先探索（BFS）の実装
function breadthFirstSearch(graph: Record<string, string[]>, start: string, target?: string): string[] {
    const visited = new Set<string>();
    const queue: string[] = [start];
    const path: string[] = [];
    
    while (queue.length > 0) {
        const node = queue.shift()!;
        
        if (visited.has(node)) continue;
        
        visited.add(node);
        path.push(node);
        
        // 目標ノードに到達した場合
        if (target && node === target) {
            break;
        }
        
        // 隣接ノードをキューに追加
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
            }
        }
    }
    
    return path;
}`}</code>
						</pre>
					</div>

					<div>
						<h4 className="text-md font-semibold mb-2">レベル別BFS実装</h4>
						<pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto">
							<code>{`// レベル（深さ）を記録するBFS
function bfsWithLevels(graph: Record<string, string[]>, start: string): Map<string, number> {
    const visited = new Set<string>();
    const queue: [string, number][] = [[start, 0]];
    const levels = new Map<string, number>();
    
    while (queue.length > 0) {
        const [node, level] = queue.shift()!;
        
        if (visited.has(node)) continue;
        
        visited.add(node);
        levels.set(node, level);
        
        // 隣接ノードを次のレベルとしてキューに追加
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push([neighbor, level + 1]);
            }
        }
    }
    
    return levels;
}`}</code>
						</pre>
					</div>
				</div>
			</div>

			{/* 実装比較 */}
			<div className="bg-white rounded-lg border shadow-sm mb-12">
				<div className="p-4 border-b">
					<h3 className="text-lg font-semibold">DFSとBFSの比較</h3>
				</div>
				<div className="p-4">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead>
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										特徴
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										BFS（幅優先探索）
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										DFS（深さ優先探索）
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								<tr>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										データ構造
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										キュー（FIFO）
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										スタック（LIFO）または再帰
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										探索順序
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										レベルごとに探索
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										可能な限り深く探索
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										最短経路
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										保証される（無重みグラフ）
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										保証されない
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										空間計算量
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										O(|V|)
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										O(h) ※hは最大深さ
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										適用例
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										最短経路、レベル順走査
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										経路探索、トポロジカルソート
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* 応用例 */}
			<div className="bg-white rounded-lg border shadow-sm">
				<div className="p-4 border-b">
					<h3 className="text-lg font-semibold">BFSの応用例</h3>
				</div>
				<div className="p-4">
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-semibold mb-2">1. 最短経路問題</h4>
							<p className="text-sm text-gray-600">
								無重みグラフにおいて、始点から各頂点への最短経路を求める。迷路の最短経路探索などに使用。
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-2">
								2. ソーシャルネットワーク分析
							</h4>
							<p className="text-sm text-gray-600">
								友達の友達など、特定の距離にいる人々を見つける。LinkedInの「つながり」機能など。
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-2">3. Webクローラー</h4>
							<p className="text-sm text-gray-600">
								ウェブサイトのリンクを幅優先で探索し、効率的にページを収集。
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-2">4. ゲームAI</h4>
							<p className="text-sm text-gray-600">
								チェスや将棋などのゲームで、可能な手を探索する際に使用。
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
