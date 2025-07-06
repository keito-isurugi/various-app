/**
 * src/app/accounting/depreciation/page.tsx
 *
 * 減価償却の詳細解説ページ
 * 会計初心者向けのインタラクティブな学習コンテンツ
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { depreciationExplanationData } from "../../../data/explanations/depreciation-explanation";
import type {
	DepreciationInput,
	DepreciationResult,
} from "../../../types/accounting";
import { DepreciationCalculator } from "../../../utils/calculators/depreciation";

/**
 * 減価償却学習ページ
 * 理論と実践を組み合わせた包括的な学習体験を提供
 */
export default function DepreciationPage() {
	// 計算機の状態管理
	const [input, setInput] = useState<DepreciationInput>({
		acquisitionCost: 1000000,
		residualValue: 100000,
		usefulLife: 5,
		method: "straight_line",
	});

	const [result, setResult] = useState<DepreciationResult | null>(null);
	const [isCalculating, setIsCalculating] = useState(false);

	/**
	 * 減価償却を計算
	 */
	const calculateDepreciation = useCallback(() => {
		setIsCalculating(true);
		try {
			const calculationResult = DepreciationCalculator.calculate(input);
			setResult(calculationResult);
		} catch (error) {
			console.error("計算エラー:", error);
		} finally {
			setIsCalculating(false);
		}
	}, [input]);

	/**
	 * プリセット例を設定
	 */
	const setPresetExample = useCallback(
		(preset: "computer" | "car" | "building") => {
			const presets: Record<string, DepreciationInput> = {
				computer: {
					acquisitionCost: 500000,
					residualValue: 50000,
					usefulLife: 4,
					method: "straight_line",
				},
				car: {
					acquisitionCost: 3000000,
					residualValue: 300000,
					usefulLife: 6,
					method: "straight_line",
				},
				building: {
					acquisitionCost: 50000000,
					residualValue: 5000000,
					usefulLife: 30,
					method: "straight_line",
				},
			};
			setInput(presets[preset]);
			setResult(null);
		},
		[],
	);

	/**
	 * 入力値の更新
	 */
	const updateInput = useCallback(
		(field: keyof DepreciationInput, value: number | string) => {
			setInput((prev) => ({ ...prev, [field]: value }));
			setResult(null);
		},
		[],
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずナビゲーション */}
				<nav className="mb-6" aria-label="パンくずナビゲーション">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Link
							href="/accounting"
							className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
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
							会計解説
						</Link>
						<span className="text-gray-400">／</span>
						<span className="text-gray-900 dark:text-gray-100 font-medium">
							減価償却
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
						減価償却をマスターしよう
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						スマホの分割払いと同じ考え方で、会計の基本である減価償却を理解しよう
					</p>
				</header>

				{/* 概要カード */}
				<div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								約15分
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								学習時間
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
								★★☆☆☆
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								4種類
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								計算方法
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								実践的
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								学習スタイル
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 計算機パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								🧮 減価償却計算機
							</h3>

							{/* プリセット例 */}
							<div className="mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
									よくある例から選ぶ
								</h4>
								<div className="grid grid-cols-3 gap-2">
									<button
										type="button"
										onClick={() => setPresetExample("computer")}
										className="text-xs py-2 px-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
									>
										💻 パソコン
									</button>
									<button
										type="button"
										onClick={() => setPresetExample("car")}
										className="text-xs py-2 px-3 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-colors"
									>
										🚗 車両
									</button>
									<button
										type="button"
										onClick={() => setPresetExample("building")}
										className="text-xs py-2 px-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg transition-colors"
									>
										🏢 建物
									</button>
								</div>
							</div>

							{/* 入力フィールド */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="acquisition-cost"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										取得価額（円）
									</label>
									<input
										id="acquisition-cost"
										type="number"
										value={input.acquisitionCost}
										onChange={(e) =>
											updateInput("acquisitionCost", Number(e.target.value))
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
										placeholder="1000000"
									/>
								</div>

								<div>
									<label
										htmlFor="residual-value"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										残存価額（円）
									</label>
									<input
										id="residual-value"
										type="number"
										value={input.residualValue}
										onChange={(e) =>
											updateInput("residualValue", Number(e.target.value))
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
										placeholder="100000"
									/>
								</div>

								<div>
									<label
										htmlFor="useful-life"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										耐用年数（年）
									</label>
									<input
										id="useful-life"
										type="number"
										value={input.usefulLife}
										onChange={(e) =>
											updateInput("usefulLife", Number(e.target.value))
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
										placeholder="5"
										min="1"
										max="100"
									/>
								</div>

								<div>
									<label
										htmlFor="method"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										計算方法
									</label>
									<select
										id="method"
										value={input.method}
										onChange={(e) => updateInput("method", e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="straight_line">定額法（おすすめ）</option>
										<option value="declining_balance">定率法</option>
										<option value="sum_of_years">年数合計法</option>
									</select>
								</div>
							</div>

							{/* 計算ボタン */}
							<button
								type="button"
								onClick={calculateDepreciation}
								disabled={isCalculating}
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
									isCalculating
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isCalculating ? "計算中..." : "🚀 計算実行"}
							</button>

							{/* 計算結果 */}
							{result && (
								<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
									{result.success ? (
										<div>
											<h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
												📊 計算結果
											</h4>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span className="text-gray-600 dark:text-gray-400">
														償却可能額:
													</span>
													<span className="font-mono font-bold">
														{result.summary.depreciableAmount.toLocaleString()}
														円
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-600 dark:text-gray-400">
														年間平均償却額:
													</span>
													<span className="font-mono font-bold text-blue-600 dark:text-blue-400">
														{Math.round(
															result.summary.averageAnnualDepreciation,
														).toLocaleString()}
														円
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-600 dark:text-gray-400">
														総償却額:
													</span>
													<span className="font-mono font-bold">
														{Math.round(
															result.totalDepreciation,
														).toLocaleString()}
														円
													</span>
												</div>
											</div>
										</div>
									) : (
										<div className="text-red-600 dark:text-red-400">
											❌ {result.error}
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* 結果表示エリア */}
					<div className="xl:col-span-2">
						{result?.success ? (
							<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
									📈 年次償却スケジュール
								</h3>

								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b border-gray-200 dark:border-gray-700">
												<th className="text-left py-2 font-medium text-gray-600 dark:text-gray-400">
													年度
												</th>
												<th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">
													期首帳簿価額
												</th>
												<th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">
													年間償却額
												</th>
												<th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">
													累計償却額
												</th>
												<th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">
													期末帳簿価額
												</th>
											</tr>
										</thead>
										<tbody>
											{result.yearlyData.map((year) => (
												<tr
													key={year.year}
													className="border-b border-gray-100 dark:border-gray-700/50"
												>
													<td className="py-2 font-medium">{year.year}年目</td>
													<td className="py-2 text-right font-mono">
														{year.beginningBookValue.toLocaleString()}円
													</td>
													<td className="py-2 text-right font-mono text-blue-600 dark:text-blue-400 font-bold">
														{year.annualDepreciation.toLocaleString()}円
													</td>
													<td className="py-2 text-right font-mono">
														{year.accumulatedDepreciation.toLocaleString()}円
													</td>
													<td className="py-2 text-right font-mono">
														{year.endingBookValue.toLocaleString()}円
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						) : (
							<div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center mb-8">
								<div className="text-6xl mb-4">🧮</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									計算してみましょう
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の計算機で条件を設定し、「計算実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={depreciationExplanationData}
						defaultExpanded={false}
						className="shadow-xl"
					/>
				</section>
			</div>
		</div>
	);
}
