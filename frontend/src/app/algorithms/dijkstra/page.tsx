/**
 * src/app/algorithms/dijkstra/page.tsx
 *
 * ダイクストラ法アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import { BarChart3, Play, Settings, Star } from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { dijkstraExplanation } from "../../../data/explanations/dijkstra-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { DijkstraAlgorithm } from "../../../utils/algorithms/dijkstra";

/**
 * ダイクストラ法学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function DijkstraPage() {
	// アルゴリズムインスタンス
	const algorithm = new DijkstraAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customGraph, setCustomGraph] = useState("");
	const [startNode, setStartNode] = useState("0");

	/**
	 * アルゴリズムを実行
	 */
	const executeAlgorithm = useCallback(() => {
		setIsExecuting(true);
		try {
			const updatedInput = {
				...input,
				graph: customGraph ? JSON.parse(customGraph) : input.graph,
				startNode: Number(startNode),
			};
			setInput(updatedInput);
			const execResult = algorithm.execute(updatedInput);
			setResult(execResult);
		} catch (error) {
			console.error("ダイクストラ法実行エラー:", error);
			alert("グラフの形式が正しくありません。JSON形式で入力してください。");
		} finally {
			setIsExecuting(false);
		}
	}, [algorithm, input, customGraph, startNode]);

	/**
	 * ランダムなグラフを生成
	 */
	const generateRandomGraph = useCallback(() => {
		const examples = DijkstraAlgorithm.getRecommendedExamples();
		const randomExample = examples[Math.floor(Math.random() * examples.length)];

		setInput(randomExample);
		setCustomGraph(JSON.stringify(randomExample.graph, null, 2));
		setStartNode(randomExample.startNode?.toString() || "0");
		setResult(null);
	}, []);

	/**
	 * デフォルトケースをロード
	 */
	const loadDefaultCase = useCallback(() => {
		const defaultInput = algorithm.getDefaultInput();
		setInput(defaultInput);
		setCustomGraph(JSON.stringify(defaultInput.graph, null, 2));
		setStartNode(defaultInput.startNode?.toString() || "0");
		setResult(null);
	}, [algorithm]);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			const graph = customGraph.trim() ? JSON.parse(customGraph) : input.graph;
			const updatedInput = {
				...input,
				graph,
				startNode: Number(startNode),
			};
			setInput(updatedInput);
		} catch (error) {
			alert("グラフのJSON形式が正しくありません");
		}
	}, [customGraph, startNode, input]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずリスト */}
				<nav className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
					<Link href="/" className="hover:text-purple-600 transition-colors">
						ホーム
					</Link>
					<span>/</span>
					<Link
						href="/algorithms"
						className="hover:text-purple-600 transition-colors"
					>
						アルゴリズム学習
					</Link>
					<span>/</span>
					<span className="text-gray-900 dark:text-gray-100">
						ダイクストラ法
					</span>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						ダイクストラ法
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						重み付きグラフで単一始点最短経路問題を解くグリーディアルゴリズム
					</p>
				</header>

				{/* アルゴリズム情報 */}
				<section className="mb-8">
					<div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center">
								<div className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
									時間計算量
								</div>
								<div className="font-mono text-lg font-bold text-gray-900 dark:text-gray-100">
									{algorithm.info.timeComplexity.average}
								</div>
							</div>
							<div className="text-center">
								<div className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
									空間計算量
								</div>
								<div className="font-mono text-lg font-bold text-gray-900 dark:text-gray-100">
									{algorithm.info.spaceComplexity}
								</div>
							</div>
							<div className="text-center">
								<div className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
									難易度
								</div>
								<div className="flex justify-center gap-0.5">
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={`star-${i}`}
											className={`w-4 h-4 ${
												i < algorithm.info.difficulty
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300 dark:text-gray-600"
											}`}
										/>
									))}
								</div>
							</div>
							<div className="text-center">
								<div className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
									カテゴリ
								</div>
								<div className="text-lg font-bold text-gray-900 dark:text-gray-100">
									グラフ
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* メインコンテンツ - 3カラムグリッド */}
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル - 左側 */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sticky top-4">
							<div className="p-6">
								<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
									<Settings className="w-5 h-5" />
									アルゴリズム設定
								</h2>

								{/* 現在の設定表示 */}
								<div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
									<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
										現在の設定
									</h3>
									<div className="space-y-1 text-sm">
										<div className="flex justify-between">
											<span className="text-gray-600 dark:text-gray-400">
												開始ノード:
											</span>
											<span className="font-mono text-blue-600 dark:text-blue-400">
												{startNode}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600 dark:text-gray-400">
												ノード数:
											</span>
											<span className="font-mono text-purple-600 dark:text-purple-400">
												{input.graph &&
												typeof input.graph === "object" &&
												"nodes" in input.graph
													? input.graph.nodes?.length || 0
													: Object.keys(input.graph || {}).length}
											</span>
										</div>
									</div>
								</div>

								{/* カスタム入力 */}
								<div className="space-y-4 mb-6">
									<div>
										<label
											htmlFor="start-node"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											開始ノード
										</label>
										<input
											id="start-node"
											type="number"
											min="0"
											value={startNode}
											onChange={(e) => setStartNode(e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
											placeholder="0"
										/>
									</div>
									<div>
										<label
											htmlFor="graph-data"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											グラフデータ (JSON)
										</label>
										<textarea
											id="graph-data"
											value={
												customGraph || JSON.stringify(input.graph, null, 2)
											}
											onChange={(e) => setCustomGraph(e.target.value)}
											className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-xs"
											placeholder="グラフのJSONデータを入力"
										/>
									</div>
								</div>

								{/* プリセットボタン */}
								<div className="grid grid-cols-1 gap-2 mb-6">
									<button
										type="button"
										onClick={loadDefaultCase}
										className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
									>
										デフォルト
									</button>
									<button
										type="button"
										onClick={generateRandomGraph}
										className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
									>
										ランダム生成
									</button>
									<button
										type="button"
										onClick={applyCustomInput}
										className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
									>
										設定適用
									</button>
								</div>

								{/* 実行ボタン */}
								<button
									type="button"
									onClick={executeAlgorithm}
									disabled={isExecuting}
									className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
										isExecuting
											? "bg-gray-400 text-gray-700 cursor-not-allowed"
											: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
									}`}
								>
									{isExecuting ? (
										"実行中..."
									) : (
										<>
											<Play className="w-4 h-4" />
											アルゴリズム実行
										</>
									)}
								</button>

								{/* 結果表示 */}
								{result && (
									<div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
										<h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">
											実行結果
										</h3>
										{result.summary && (
											<div className="space-y-2 text-sm">
												{Object.entries(result.summary).map(([key, value]) => (
													<div key={key} className="flex justify-between">
														<span className="text-blue-700 dark:text-blue-300">
															{key}:
														</span>
														<span className="font-mono font-medium text-blue-900 dark:text-blue-100">
															{String(value)}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* 可視化エリア - 右側 */}
					<div className="xl:col-span-2">
						{result ? (
							<AlgorithmVisualizer steps={result.steps} className="mb-8" />
						) : (
							<div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center mb-8">
								<div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
									<BarChart3 className="w-16 h-16 mx-auto" />
								</div>
								<h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
									アルゴリズムの可視化
								</h3>
								<p className="text-gray-500 dark:text-gray-500">
									左のパネルで設定を行い、「アルゴリズム実行」ボタンをクリックしてください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説 */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={dijkstraExplanation}
						defaultExpanded={false}
						className="shadow-xl"
					/>
				</section>
			</div>
		</div>
	);
}
