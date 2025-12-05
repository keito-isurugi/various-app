/**
 * src/app/algorithms/warshall-floyd/page.tsx
 *
 * ワーシャルフロイド法アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import { BarChart3, Play, Settings, Star } from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { warshallFloydExplanation } from "../../../data/explanations/warshall-floyd-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { WarshallFloydAlgorithm } from "../../../utils/algorithms/warshall-floyd";

/**
 * ワーシャルフロイド法学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function WarshallFloydPage() {
	// アルゴリズムインスタンス
	const algorithm = new WarshallFloydAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customGraph, setCustomGraph] = useState("");

	/**
	 * アルゴリズムを実行
	 */
	const executeAlgorithm = useCallback(() => {
		setIsExecuting(true);
		try {
			const updatedInput = {
				...input,
				graph: customGraph ? JSON.parse(customGraph) : input.graph,
			};
			setInput(updatedInput);
			const execResult = algorithm.execute(updatedInput);
			setResult(execResult);
		} catch (error) {
			console.error("ワーシャルフロイド法実行エラー:", error);
			alert("グラフの形式が正しくありません。JSON形式で入力してください。");
		} finally {
			setIsExecuting(false);
		}
	}, [algorithm, input, customGraph]);

	/**
	 * ランダムなグラフを生成
	 */
	const generateRandomGraph = useCallback(() => {
		const examples = WarshallFloydAlgorithm.getRecommendedExamples();
		const randomExample = examples[Math.floor(Math.random() * examples.length)];

		setInput(randomExample);
		setCustomGraph(JSON.stringify(randomExample.graph, null, 2));
		setResult(null);
	}, []);

	/**
	 * デフォルトケースをロード
	 */
	const loadDefaultCase = useCallback(() => {
		const defaultInput = algorithm.getDefaultInput();
		setInput(defaultInput);
		setCustomGraph(JSON.stringify(defaultInput.graph, null, 2));
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
			};
			setInput(updatedInput);
		} catch (error) {
			alert("グラフのJSON形式が正しくありません");
		}
	}, [customGraph, input]);

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
						ワーシャルフロイド法
					</span>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
						ワーシャルフロイド法
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						重み付きグラフで全点間最短経路問題を解く動的計画法のアルゴリズム
					</p>
				</header>

				{/* アルゴリズム情報 */}
				<section className="mb-8">
					<div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center">
								<div className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
									時間計算量
								</div>
								<div className="font-mono text-lg font-bold text-gray-900 dark:text-gray-100">
									{algorithm.info.timeComplexity.average}
								</div>
							</div>
							<div className="text-center">
								<div className="text-pink-600 dark:text-pink-400 font-semibold text-sm">
									空間計算量
								</div>
								<div className="font-mono text-lg font-bold text-gray-900 dark:text-gray-100">
									{algorithm.info.spaceComplexity}
								</div>
							</div>
							<div className="text-center">
								<div className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
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
								<div className="text-pink-600 dark:text-pink-400 font-semibold text-sm">
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
										<div className="flex justify-between">
											<span className="text-gray-600 dark:text-gray-400">
												エッジ数:
											</span>
											<span className="font-mono text-pink-600 dark:text-pink-400">
												{input.graph &&
												typeof input.graph === "object" &&
												"edges" in input.graph
													? input.graph.edges?.length || 0
													: 0}
											</span>
										</div>
									</div>
								</div>

								{/* カスタム入力 */}
								<div className="space-y-4 mb-6">
									<div>
										<label
											htmlFor="graph-data-floyd"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											グラフデータ (JSON)
										</label>
										<textarea
											id="graph-data-floyd"
											value={
												customGraph || JSON.stringify(input.graph, null, 2)
											}
											onChange={(e) => setCustomGraph(e.target.value)}
											className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-xs"
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
											: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
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
									<div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
										<h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3">
											実行結果
										</h3>
										{result.summary && (
											<div className="space-y-2 text-sm">
												{Object.entries(result.summary).map(([key, value]) => (
													<div key={key} className="flex justify-between">
														<span className="text-purple-700 dark:text-purple-300">
															{key}:
														</span>
														<span className="font-mono font-medium text-purple-900 dark:text-purple-100">
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
							<div className="space-y-8">
								<AlgorithmVisualizer steps={result.steps} className="mb-8" />

								{/* 最短距離行列の表示 */}
								{result.result?.distances && (
									<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
										<h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
											全点間最短距離行列
										</h3>
										<div className="overflow-x-auto">
											<table className="min-w-full text-sm">
												<thead>
													<tr>
														<th className="px-3 py-2 text-left text-purple-800 dark:text-purple-200">
															From/To
														</th>
														{Array.from(
															{ length: result.result.distances.length },
															(_, nodeIndex) => (
																<th
																	// biome-ignore lint/suspicious/noArrayIndexKey: Node indices are stable identifiers
																	key={`node-header-${nodeIndex}`}
																	className="px-3 py-2 text-center text-purple-800 dark:text-purple-200"
																>
																	{nodeIndex}
																</th>
															),
														)}
													</tr>
												</thead>
												<tbody>
													{result.result.distances.map(
														(row: number[], rowIndex: number) => (
															<tr
																// biome-ignore lint/suspicious/noArrayIndexKey: Row indices are stable node identifiers
																key={`distance-row-${rowIndex}`}
																className="border-t border-purple-200 dark:border-purple-700"
															>
																<td className="px-3 py-2 font-medium text-purple-800 dark:text-purple-200">
																	{rowIndex}
																</td>
																{row.map(
																	(distance: number, colIndex: number) => (
																		<td
																			// biome-ignore lint/suspicious/noArrayIndexKey: Column indices are stable node identifiers
																			key={`distance-${rowIndex}-to-${colIndex}`}
																			className="px-3 py-2 text-center font-mono text-purple-700 dark:text-purple-300"
																		>
																			{distance === Number.POSITIVE_INFINITY
																				? "∞"
																				: distance}
																		</td>
																	),
																)}
															</tr>
														),
													)}
												</tbody>
											</table>
										</div>
									</div>
								)}
							</div>
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
						explanationData={warshallFloydExplanation}
						defaultExpanded={false}
						className="shadow-xl"
					/>
				</section>
			</div>
		</div>
	);
}
