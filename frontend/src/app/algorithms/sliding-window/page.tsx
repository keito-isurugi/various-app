/**
 * src/app/algorithms/sliding-window/page.tsx
 *
 * スライディングウィンドウ（尺取り法）アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { slidingWindowExplanation } from "../../../data/explanations/sliding-window-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { SlidingWindowAlgorithm } from "../../../utils/algorithms/sliding-window";

/**
 * スライディングウィンドウ学習ページ
 * 効率的な部分列処理の原理を可視化で理解
 */
export default function SlidingWindowPage() {
	// アルゴリズムインスタンス
	const algorithm = new SlidingWindowAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("");
	const [customWindowSize, setCustomWindowSize] = useState("");
	const [customTargetSum, setCustomTargetSum] = useState("");
	const [customText, setCustomText] = useState("");
	const [customTargetString, setCustomTargetString] = useState("");

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
	 * 固定サイズウィンドウの入力を設定
	 */
	const setFixedSizeOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);
			const windowSize = Number(customWindowSize);

			if (Number.isNaN(windowSize) || windowSize <= 0) {
				alert("ウィンドウサイズには正の整数を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "fixedSize",
					array: array,
					windowSize: windowSize,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, customWindowSize, parseArray]);

	/**
	 * 可変サイズウィンドウの入力を設定
	 */
	const setVariableSizeOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);
			const targetSum = Number(customTargetSum);

			if (Number.isNaN(targetSum)) {
				alert("目標和には有効な数値を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "variableSize",
					array: array,
					targetSum: targetSum,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, customTargetSum, parseArray]);

	/**
	 * 最大和ウィンドウの入力を設定
	 */
	const setMaxSumOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);
			const windowSize = Number(customWindowSize);

			if (Number.isNaN(windowSize) || windowSize <= 0) {
				alert("ウィンドウサイズには正の整数を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "maxSum",
					array: array,
					windowSize: windowSize,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, customWindowSize, parseArray]);

	/**
	 * 最長部分文字列の入力を設定
	 */
	const setLongestSubstringOperation = useCallback(() => {
		try {
			const text = customText.trim();
			if (!text) {
				alert("文字列を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "longestSubstring",
					text: text,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customText]);

	/**
	 * 推奨操作の適用
	 */
	const applyRecommendedOperation = useCallback((rec: any) => {
		setInput({
			parameters: {
				operation: rec.operation,
				array: rec.array,
				windowSize: rec.windowSize,
				targetSum: rec.targetSum,
				text: rec.text,
				targetString: rec.targetString,
			},
		});

		// カスタム入力フィールドも更新
		if (rec.array) setCustomArray(rec.array.join(", "));
		if (rec.windowSize !== undefined)
			setCustomWindowSize(rec.windowSize.toString());
		if (rec.targetSum !== undefined)
			setCustomTargetSum(rec.targetSum.toString());
		if (rec.text) setCustomText(rec.text);
		if (rec.targetString) setCustomTargetString(rec.targetString);

		setResult(null);
	}, []);

	// 推奨操作リスト
	const recommendedOperations =
		SlidingWindowAlgorithm.getRecommendedOperations();

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
							スライディングウィンドウ
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
						スライディングウィンドウ（尺取り法）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						配列の連続する部分列を効率的に処理する重要な技法を学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								O(n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								O(1)
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
								{input.parameters?.text && (
									<div className="mb-2">
										<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
											文字列:
										</span>
										<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
											"{input.parameters.text}"
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
										placeholder="1, 3, 2, 6, -1, 4, 1, 8, 2"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<div className="grid grid-cols-2 gap-2">
									<div>
										<label
											htmlFor="custom-window-size"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											ウィンドウサイズ
										</label>
										<input
											id="custom-window-size"
											type="number"
											value={customWindowSize}
											onChange={(e) => setCustomWindowSize(e.target.value)}
											placeholder="3"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
									<div>
										<label
											htmlFor="custom-target-sum"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											目標和
										</label>
										<input
											id="custom-target-sum"
											type="number"
											value={customTargetSum}
											onChange={(e) => setCustomTargetSum(e.target.value)}
											placeholder="7"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="custom-text-string"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										文字列（部分文字列用）
									</label>
									<input
										id="custom-text-string"
										type="text"
										value={customText}
										onChange={(e) => setCustomText(e.target.value)}
										placeholder="abcabcbb"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
							</div>

							{/* 操作選択ボタン */}
							<div className="space-y-2 mb-6">
								<button
									type="button"
									onClick={setFixedSizeOperation}
									className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
								>
									🪟 固定サイズウィンドウ
								</button>
								<button
									type="button"
									onClick={setVariableSizeOperation}
									className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
								>
									📏 可変サイズ（尺取り法）
								</button>
								<button
									type="button"
									onClick={setMaxSumOperation}
									className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
								>
									🏆 最大和ウィンドウ
								</button>
								<button
									type="button"
									onClick={setLongestSubstringOperation}
									className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
								>
									📝 最長部分文字列
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
								<div className="text-6xl mb-4">🪟</div>
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
						explanationData={slidingWindowExplanation}
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
								<code>{`// 固定サイズウィンドウの合計
function fixedWindowSum(arr, windowSize) {
    const result = [];
    let windowSum = 0;
    
    // 最初のウィンドウ
    for (let i = 0; i < windowSize; i++) {
        windowSum += arr[i];
    }
    result.push(windowSum);
    
    // ウィンドウをスライド
    for (let i = windowSize; i < arr.length; i++) {
        windowSum = windowSum - arr[i - windowSize] + arr[i];
        result.push(windowSum);
    }
    
    return result;
}

// 尺取り法（可変サイズウィンドウ）
function twoPointers(arr, targetSum) {
    let left = 0, right = 0;
    let currentSum = 0;
    
    while (right < arr.length) {
        currentSum += arr[right];
        
        while (currentSum > targetSum && left <= right) {
            currentSum -= arr[left];
            left++;
        }
        
        if (currentSum === targetSum) {
            return { found: true, left, right };
        }
        
        right++;
    }
    
    return { found: false };
}

// 最長非重複部分文字列
function longestUniqueSubstring(s) {
    const charSet = new Set();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// 使用例
const arr = [1, 3, 2, 6, -1, 4, 1, 8, 2];
console.log(fixedWindowSum(arr, 3)); // [6, 11, 7, 9, 4, 13, 11]
console.log(twoPointers([1, 4, 2, 3, 5], 7)); // {found: true, left: 1, right: 2}
console.log(longestUniqueSubstring("abcabcbb")); // 3`}</code>
							</pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
