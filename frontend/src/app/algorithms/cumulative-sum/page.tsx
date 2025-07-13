/**
 * src/app/algorithms/cumulative-sum/page.tsx
 *
 * 累積和・差分配列アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { cumulativeSumExplanation } from "../../../data/explanations/cumulative-sum-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { CumulativeSumAlgorithm } from "../../../utils/algorithms/cumulative-sum";

/**
 * 累積和・差分配列学習ページ
 * 前処理による高速化の原理を可視化で理解
 */
export default function CumulativeSumPage() {
	// アルゴリズムインスタンス
	const algorithm = new CumulativeSumAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("");
	const [customTarget, setCustomTarget] = useState("");
	const [customLeft, setCustomLeft] = useState("");
	const [customRight, setCustomRight] = useState("");
	const [customIndex, setCustomIndex] = useState("");
	const [customValue, setCustomValue] = useState("");

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
	 * 累積和構築の入力を設定
	 */
	const setBuildOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);
			setInput({
				parameters: {
					operation: "build",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * 区間和クエリの入力を設定
	 */
	const setRangeSumOperation = useCallback(() => {
		try {
			const left = Number(customLeft);
			const right = Number(customRight);

			if (Number.isNaN(left) || Number.isNaN(right)) {
				alert("左端と右端には有効な数値を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "rangeSum",
					left: left,
					right: right,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customLeft, customRight]);

	/**
	 * 区間更新の入力を設定
	 */
	const setRangeUpdateOperation = useCallback(() => {
		try {
			const left = Number(customLeft);
			const right = Number(customRight);
			const value = Number(customValue);

			if (Number.isNaN(left) || Number.isNaN(right) || Number.isNaN(value)) {
				alert("範囲と値には有効な数値を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "rangeUpdate",
					left: left,
					right: right,
					value: value,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customLeft, customRight, customValue]);

	/**
	 * 推奨操作の適用
	 */
	const applyRecommendedOperation = useCallback((rec: any) => {
		setInput({
			parameters: {
				operation: rec.operation,
				array: rec.array,
				left: rec.left,
				right: rec.right,
				index: rec.index,
				value: rec.value,
				target: rec.target,
				queries: rec.queries,
			},
		});

		// カスタム入力フィールドも更新
		if (rec.array) setCustomArray(rec.array.join(", "));
		if (rec.left !== undefined) setCustomLeft(rec.left.toString());
		if (rec.right !== undefined) setCustomRight(rec.right.toString());
		if (rec.index !== undefined) setCustomIndex(rec.index.toString());
		if (rec.value !== undefined) setCustomValue(rec.value.toString());
		if (rec.target !== undefined) setCustomTarget(rec.target.toString());

		setResult(null);
	}, []);

	// 推奨操作リスト
	const recommendedOperations =
		CumulativeSumAlgorithm.getRecommendedOperations();

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
							累積和・差分配列
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
						累積和・差分配列
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						前処理による配列の区間操作を劇的に高速化する重要な技法を学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								O(1)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								クエリ時間
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								O(n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								前処理時間
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								初中級
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
										placeholder="1, 3, 5, 7, 9, 11, 13, 15"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<div className="grid grid-cols-2 gap-2">
									<div>
										<label
											htmlFor="custom-left"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											左端 (L)
										</label>
										<input
											id="custom-left"
											type="number"
											value={customLeft}
											onChange={(e) => setCustomLeft(e.target.value)}
											placeholder="1"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
									<div>
										<label
											htmlFor="custom-right"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											右端 (R)
										</label>
										<input
											id="custom-right"
											type="number"
											value={customRight}
											onChange={(e) => setCustomRight(e.target.value)}
											placeholder="4"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="custom-value"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										値（更新用）
									</label>
									<input
										id="custom-value"
										type="number"
										value={customValue}
										onChange={(e) => setCustomValue(e.target.value)}
										placeholder="5"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
							</div>

							{/* 操作選択ボタン */}
							<div className="space-y-2 mb-6">
								<button
									type="button"
									onClick={setBuildOperation}
									className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
								>
									📊 累積和配列を構築
								</button>
								<button
									type="button"
									onClick={setRangeSumOperation}
									className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
								>
									➕ 区間和を計算
								</button>
								<button
									type="button"
									onClick={setRangeUpdateOperation}
									className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
								>
									📝 区間更新（差分配列）
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
													? JSON.stringify(result.result)
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
								<div className="text-6xl mb-4">📊</div>
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
						explanationData={cumulativeSumExplanation}
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
								<code>{`// 累積和の構築
function buildCumulativeSum(arr) {
    const n = arr.length;
    const cumSum = new Array(n + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        cumSum[i + 1] = cumSum[i] + arr[i];
    }
    
    return cumSum;
}

// 区間和クエリ O(1)
function rangeSum(cumSum, left, right) {
    return cumSum[right + 1] - cumSum[left];
}

// 差分配列による区間更新 O(1)
function rangeUpdate(diff, left, right, value) {
    diff[left] += value;
    if (right + 1 < diff.length) {
        diff[right + 1] -= value;
    }
}

// 差分配列から元配列を復元 O(n)
function restore(diff) {
    const n = diff.length;
    const arr = new Array(n);
    arr[0] = diff[0];
    
    for (let i = 1; i < n; i++) {
        arr[i] = arr[i - 1] + diff[i];
    }
    
    return arr;
}

// 使用例
const arr = [1, 3, 5, 7, 9];
const cumSum = buildCumulativeSum(arr);
console.log(rangeSum(cumSum, 1, 3)); // 15 (3+5+7)`}</code>
							</pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
