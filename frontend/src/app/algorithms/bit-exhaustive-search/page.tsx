/**
 * src/app/algorithms/bit-exhaustive-search/page.tsx
 *
 * ビット全探索アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { bitExhaustiveSearchExplanation } from "../../../data/explanations/bit-exhaustive-search-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { BitExhaustiveSearchAlgorithm } from "../../../utils/algorithms/bit-exhaustive-search";

/**
 * ビット全探索学習ページ
 * ビット演算による効率的な全探索の原理を可視化で理解
 */
export default function BitExhaustiveSearchPage() {
	// アルゴリズムインスタンス
	const algorithm = new BitExhaustiveSearchAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("");
	const [customTarget, setCustomTarget] = useState("");
	const [customCapacity, setCustomCapacity] = useState("");
	const [customWeights, setCustomWeights] = useState("");
	const [customValues, setCustomValues] = useState("");

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
	 * 配列のパース
	 */
	const parseArray = useCallback((str: string): number[] => {
		const trimmed = str.trim();
		if (!trimmed) throw new Error("配列を入力してください");

		return trimmed.split(",").map((s) => {
			const num = Number(s.trim());
			if (Number.isNaN(num)) {
				throw new Error(`"${s.trim()}" は有効な数値ではありません`);
			}
			return num;
		});
	}, []);

	/**
	 * 全部分集合の入力を設定
	 */
	const setAllSubsetsOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);

			setInput({
				parameters: {
					operation: "allSubsets",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * 部分集合和の入力を設定
	 */
	const setSubsetSumOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);
			const target = Number(customTarget);

			if (Number.isNaN(target)) {
				alert("目標値には有効な数値を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "subsetSum",
					array: array,
					target: target,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, customTarget, parseArray]);

	/**
	 * 最大部分集合和の入力を設定
	 */
	const setMaxSubsetSumOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);

			setInput({
				parameters: {
					operation: "maxSubsetSum",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * ナップサック問題の入力を設定
	 */
	const setKnapsackOperation = useCallback(() => {
		try {
			const weights = parseArray(customWeights);
			const values = parseArray(customValues);
			const capacity = Number(customCapacity);

			if (Number.isNaN(capacity) || capacity <= 0) {
				alert("容量には正の数値を入力してください");
				return;
			}

			if (weights.length !== values.length) {
				alert("重みと価値の配列の長さが一致していません");
				return;
			}

			setInput({
				parameters: {
					operation: "knapsack",
					weights: weights,
					values: values,
					capacity: capacity,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customWeights, customValues, customCapacity, parseArray]);

	/**
	 * 組み合わせ和の入力を設定
	 */
	const setCombinationSumOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);
			const target = Number(customTarget);

			if (Number.isNaN(target)) {
				alert("目標値には有効な数値を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "combinationSum",
					array: array,
					target: target,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, customTarget, parseArray]);

	/**
	 * 推奨操作の適用
	 */
	const applyRecommendedOperation = useCallback((rec: any) => {
		setInput({
			parameters: {
				operation: rec.operation,
				array: rec.array,
				target: rec.target,
				weights: rec.weights,
				values: rec.values,
				capacity: rec.capacity,
			},
		});

		// カスタム入力フィールドも更新
		if (rec.array) setCustomArray(rec.array.join(", "));
		if (rec.target !== undefined) setCustomTarget(rec.target.toString());
		if (rec.weights) setCustomWeights(rec.weights.join(", "));
		if (rec.values) setCustomValues(rec.values.join(", "));
		if (rec.capacity !== undefined) setCustomCapacity(rec.capacity.toString());

		setResult(null);
	}, []);

	// 推奨操作リスト
	const recommendedOperations =
		BitExhaustiveSearchAlgorithm.getRecommendedOperations();

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずナビゲーション */}
				<nav className="mb-6" aria-label="パンくずナビゲーション">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Link
							href="/algorithms"
							className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1"
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
							ビット全探索
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
						ビット全探索
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						ビット演算を活用して効率的に全ての部分集合を探索する重要な技法を学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								O(2^n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								O(n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								空間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
								その他
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								カテゴリ
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								🔧 実行設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										操作:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{input.parameters?.operation || "未設定"}
									</div>
								</div>
								{input.parameters?.array && (
									<div className="mb-2">
										<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
											配列:
										</span>
										<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
											[{(input.parameters.array as number[]).join(", ")}]
										</div>
									</div>
								)}
								{input.parameters?.target !== undefined && (
									<div className="mb-2">
										<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
											目標値:
										</span>
										<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
											{input.parameters.target}
										</div>
									</div>
								)}
							</div>

							{/* カスタム入力 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="custom-array"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										配列（カンマ区切り）
									</label>
									<input
										id="custom-array"
										type="text"
										value={customArray}
										onChange={(e) => setCustomArray(e.target.value)}
										placeholder="1, 2, 3, 4"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<div>
									<label
										htmlFor="custom-target"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										目標値（部分集合和用）
									</label>
									<input
										id="custom-target"
										type="number"
										value={customTarget}
										onChange={(e) => setCustomTarget(e.target.value)}
										placeholder="6"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="knapsack-settings"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										ナップサック用設定
									</label>
									<input
										id="knapsack-settings"
										type="text"
										value={customWeights}
										onChange={(e) => setCustomWeights(e.target.value)}
										placeholder="重み: 1, 2, 3"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
									<input
										type="text"
										value={customValues}
										onChange={(e) => setCustomValues(e.target.value)}
										placeholder="価値: 10, 15, 20"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
									<input
										type="number"
										value={customCapacity}
										onChange={(e) => setCustomCapacity(e.target.value)}
										placeholder="容量: 5"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
							</div>

							{/* 操作選択ボタン */}
							<div className="space-y-2 mb-6">
								<button
									type="button"
									onClick={setAllSubsetsOperation}
									className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
								>
									🔢 全部分集合
								</button>
								<button
									type="button"
									onClick={setSubsetSumOperation}
									className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
								>
									🎯 部分集合和
								</button>
								<button
									type="button"
									onClick={setMaxSubsetSumOperation}
									className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
								>
									🏆 最大部分集合和
								</button>
								<button
									type="button"
									onClick={setKnapsackOperation}
									className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
								>
									🎒 ナップサック問題
								</button>
								<button
									type="button"
									onClick={setCombinationSumOperation}
									className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm"
								>
									🔍 組み合わせ和
								</button>
							</div>

							{/* 推奨操作 */}
							<div className="mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									💡 推奨操作
								</h4>
								<div className="space-y-1 max-h-48 overflow-y-auto">
									{recommendedOperations.map((rec) => (
										<button
											key={rec.description}
											type="button"
											onClick={() => applyRecommendedOperation(rec)}
											className="w-full text-left px-3 py-2 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
										>
											{rec.description}
										</button>
									))}
								</div>
							</div>

							{/* 実行ボタン */}
							<button
								type="button"
								onClick={executeAlgorithm}
								disabled={isExecuting}
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
									isExecuting
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "実行中..." : "🚀 アルゴリズム実行"}
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
												操作:
											</span>
											<span className="ml-2 font-mono font-bold text-purple-600 dark:text-purple-400">
												{result.summary?.operation}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												結果:
											</span>
											<span className="ml-2 font-mono font-bold text-green-600 dark:text-green-400">
												{typeof result.result === "object"
													? `${JSON.stringify(result.result, null, 2).substring(
															0,
															100,
														)}...`
													: result.result}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												実行ステップ数:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{result.executionSteps?.length ?? 0}
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
								<div className="text-6xl mb-4">🔢</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから操作を選択し、「アルゴリズム実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={bitExhaustiveSearchExplanation}
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
								<code>{`// 全部分集合の生成
function allSubsets(arr) {
    const n = arr.length;
    const result = [];
    
    // 0から2^n-1まで全てのビットパターンを試す
    for (let mask = 0; mask < (1 << n); mask++) {
        const subset = [];
        
        for (let i = 0; i < n; i++) {
            // i番目のビットが立っているかチェック
            if ((mask >> i) & 1) {
                subset.push(arr[i]);
            }
        }
        
        result.push(subset);
    }
    
    return result;
}

// 部分集合和問題
function subsetSum(arr, target) {
    const n = arr.length;
    
    for (let mask = 0; mask < (1 << n); mask++) {
        let sum = 0;
        const subset = [];
        
        for (let i = 0; i < n; i++) {
            if ((mask >> i) & 1) {
                sum += arr[i];
                subset.push(arr[i]);
            }
        }
        
        if (sum === target) {
            return subset; // 解が見つかった
        }
    }
    
    return null; // 解なし
}

// ナップサック問題（小規模）
function knapsack(weights, values, capacity) {
    const n = weights.length;
    let maxValue = 0;
    let bestSubset = [];
    
    for (let mask = 0; mask < (1 << n); mask++) {
        let totalWeight = 0;
        let totalValue = 0;
        const subset = [];
        
        for (let i = 0; i < n; i++) {
            if ((mask >> i) & 1) {
                totalWeight += weights[i];
                totalValue += values[i];
                subset.push(i);
            }
        }
        
        if (totalWeight <= capacity && totalValue > maxValue) {
            maxValue = totalValue;
            bestSubset = subset;
        }
    }
    
    return { value: maxValue, items: bestSubset };
}

// 使用例
const arr = [1, 2, 3];
console.log(allSubsets(arr)); // [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
console.log(subsetSum([1, 3, 5, 7], 8)); // [1, 7] or [3, 5]

const weights = [2, 1, 3];
const values = [12, 10, 20];
console.log(knapsack(weights, values, 5)); // {value: 22, items: [0, 1]}`}</code>
							</pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
