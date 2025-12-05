/**
 * src/app/algorithms/two-pointer/page.tsx
 *
 * 2 pointer法アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import {
	Code,
	Droplet,
	FileText,
	Lightbulb,
	Play,
	RefreshCw,
	Settings,
	Target,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { twoPointerExplanation } from "../../../data/explanations/two-pointer-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { TwoPointerAlgorithm } from "../../../utils/algorithms/two-pointer";

/**
 * 2 pointer法学習ページ
 * 効率的な配列処理の原理を可視化で理解
 */
export default function TwoPointerPage() {
	// アルゴリズムインスタンス
	const algorithm = new TwoPointerAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("");
	const [customTarget, setCustomTarget] = useState("");
	const [customText, setCustomText] = useState("");
	const [customArray1, setCustomArray1] = useState("");
	const [customArray2, setCustomArray2] = useState("");

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
	 * Two Sum操作の入力を設定
	 */
	const setTwoSumOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);
			const target = Number(customTarget);

			if (Number.isNaN(target)) {
				alert("目標値には有効な数値を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "twoSum",
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
	 * 配列反転操作の入力を設定
	 */
	const setReverseArrayOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);

			setInput({
				parameters: {
					operation: "reverseArray",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * 回文判定操作の入力を設定
	 */
	const setIsPalindromeOperation = useCallback(() => {
		try {
			const text = customText.trim();
			if (!text) {
				alert("文字列を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "isPalindrome",
					text: text,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customText]);

	/**
	 * 重複除去操作の入力を設定
	 */
	const setRemoveDuplicatesOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);

			setInput({
				parameters: {
					operation: "removeDuplicates",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * 最大水容量操作の入力を設定
	 */
	const setContainerWaterOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);

			setInput({
				parameters: {
					operation: "containerWater",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * 配列マージ操作の入力を設定
	 */
	const setMergeSortedOperation = useCallback(() => {
		try {
			const array1 = parseArray(customArray1);
			const array2 = parseArray(customArray2);

			setInput({
				parameters: {
					operation: "mergeSorted",
					array1: array1,
					array2: array2,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray1, customArray2, parseArray]);

	/**
	 * 推奨操作の適用
	 */
	const applyRecommendedOperation = useCallback((rec: any) => {
		setInput({
			parameters: {
				operation: rec.operation,
				array: rec.array,
				target: rec.target,
				text: rec.text,
				array1: rec.array1,
				array2: rec.array2,
			},
		});

		// カスタム入力フィールドも更新
		if (rec.array) setCustomArray(rec.array.join(", "));
		if (rec.target !== undefined) setCustomTarget(rec.target.toString());
		if (rec.text) setCustomText(rec.text);
		if (rec.array1) setCustomArray1(rec.array1.join(", "));
		if (rec.array2) setCustomArray2(rec.array2.join(", "));

		setResult(null);
	}, []);

	// 推奨操作リスト
	const recommendedOperations = TwoPointerAlgorithm.getRecommendedOperations();

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
							2 pointer法
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
						2 pointer法
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						2つのポインタを使って配列を効率的に処理する重要な技法を学ぼう
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
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
								<Settings className="w-5 h-5" />
								実行設定
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
										placeholder="2, 7, 11, 15"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<div>
									<label
										htmlFor="custom-target-value"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										目標値
									</label>
									<input
										id="custom-target-value"
										type="number"
										value={customTarget}
										onChange={(e) => setCustomTarget(e.target.value)}
										placeholder="9"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<div>
									<label
										htmlFor="custom-text-input"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										文字列（回文判定用）
									</label>
									<input
										id="custom-text-input"
										type="text"
										value={customText}
										onChange={(e) => setCustomText(e.target.value)}
										placeholder="A man a plan a canal Panama"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="custom-array1"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										配列1（マージ用）
									</label>
									<input
										id="custom-array1"
										type="text"
										value={customArray1}
										onChange={(e) => setCustomArray1(e.target.value)}
										placeholder="1, 3, 5"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
									<label
										htmlFor="custom-array2"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										配列2（マージ用）
									</label>
									<input
										id="custom-array2"
										type="text"
										value={customArray2}
										onChange={(e) => setCustomArray2(e.target.value)}
										placeholder="2, 4, 6"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
							</div>

							{/* 操作選択ボタン */}
							<div className="space-y-2 mb-6">
								<button
									type="button"
									onClick={setTwoSumOperation}
									className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
								>
									<Target className="w-4 h-4" />
									Two Sum問題
								</button>
								<button
									type="button"
									onClick={setReverseArrayOperation}
									className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
								>
									<RefreshCw className="w-4 h-4" />
									配列反転
								</button>
								<button
									type="button"
									onClick={setIsPalindromeOperation}
									className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
								>
									<FileText className="w-4 h-4" />
									回文判定
								</button>
								<button
									type="button"
									onClick={setRemoveDuplicatesOperation}
									className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
								>
									<Trash2 className="w-4 h-4" />
									重複除去
								</button>
								<button
									type="button"
									onClick={setContainerWaterOperation}
									className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
								>
									<Droplet className="w-4 h-4" />
									最大水容量
								</button>
								<button
									type="button"
									onClick={setMergeSortedOperation}
									className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm"
								>
									 配列マージ
								</button>
							</div>

							{/* 推奨操作 */}
							<div className="mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									<Lightbulb className="w-3 h-3 inline" /> 推奨操作
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
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
									isExecuting
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
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
								<div className="text-6xl mb-4"></div>
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
						explanationData={twoPointerExplanation}
						defaultExpanded={false}
						className="shadow-xl"
					/>
				</section>

				{/* コード例セクション */}
				<section className="mt-12">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
							<Code className="w-5 h-5" />
							実装例（JavaScript）
						</h3>
						<div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
							<pre className="text-sm text-gray-100">
								<code>{`// Two Sum (ソート済み配列)
function twoSum(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left < right) {
        const sum = arr[left] + arr[right];
        
        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [-1, -1]; // 見つからない
}

// 配列の反転 (in-place)
function reverseArray(arr) {
    let left = 0, right = arr.length - 1;
    
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
    
    return arr;
}

// 回文判定
function isPalindrome(s) {
    // 英数字のみを抽出して小文字化
    const processed = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = processed.length - 1;
    
    while (left < right) {
        if (processed[left] !== processed[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}

// 重複除去 (ソート済み配列, in-place)
function removeDuplicates(arr) {
    if (arr.length === 0) return 0;
    
    let writeIndex = 1;
    
    for (let readIndex = 1; readIndex < arr.length; readIndex++) {
        if (arr[readIndex] !== arr[readIndex - 1]) {
            arr[writeIndex] = arr[readIndex];
            writeIndex++;
        }
    }
    
    return writeIndex; // 新しい長さ
}

// 使用例
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(reverseArray([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]
console.log(isPalindrome("A man a plan a canal Panama")); // true`}</code>
							</pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
