/**
 * src/app/algorithms/linear-search/page.tsx
 *
 * 線形探索アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { linearSearchExplanation } from "../../../data/explanations/linear-search-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { LinearSearchAlgorithm } from "../../../utils/algorithms/linear-search";

/**
 * 線形探索学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function LinearSearchPage() {
	// アルゴリズムインスタンス
	const algorithm = new LinearSearchAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("");
	const [customTarget, setCustomTarget] = useState("");

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
	 * ランダムな配列を生成
	 */
	const generateRandomArray = useCallback(() => {
		const size = Math.floor(Math.random() * 6) + 6; // 6-11個の要素
		const array = LinearSearchAlgorithm.generateRandomArray(size, 15);
		const target = LinearSearchAlgorithm.getRandomTarget(array);

		setInput({ array, target });
		setCustomArray(array.join(", "));
		setCustomTarget(target.toString());
		setResult(null);
	}, []);

	/**
	 * 最良ケースを生成（最初に見つかる）
	 */
	const generateBestCase = useCallback(() => {
		const size = Math.floor(Math.random() * 6) + 6; // 6-11個の要素
		const array = LinearSearchAlgorithm.generateRandomArray(size, 15);
		const target = LinearSearchAlgorithm.getFirstElement(array);

		setInput({ array, target });
		setCustomArray(array.join(", "));
		setCustomTarget(target.toString());
		setResult(null);
	}, []);

	/**
	 * 最悪ケースを生成（最後に見つかる）
	 */
	const generateWorstCase = useCallback(() => {
		const size = Math.floor(Math.random() * 6) + 6; // 6-11個の要素
		const array = LinearSearchAlgorithm.generateRandomArray(size, 15);
		const target = LinearSearchAlgorithm.getLastElement(array);

		setInput({ array, target });
		setCustomArray(array.join(", "));
		setCustomTarget(target.toString());
		setResult(null);
	}, []);

	/**
	 * 見つからないケースを生成
	 */
	const generateNotFoundCase = useCallback(() => {
		const size = Math.floor(Math.random() * 6) + 6; // 6-11個の要素
		const array = LinearSearchAlgorithm.generateRandomArray(size, 15);
		const target = LinearSearchAlgorithm.getNonExistentTarget(array);

		setInput({ array, target });
		setCustomArray(array.join(", "));
		setCustomTarget(target.toString());
		setResult(null);
	}, []);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			// 配列のパース
			const arrayStr = customArray.trim();
			if (!arrayStr) {
				alert("配列を入力してください");
				return;
			}

			const array = arrayStr.split(",").map((s) => {
				const num = Number(s.trim());
				if (Number.isNaN(num)) {
					throw new Error(`"${s.trim()}" は有効な数値ではありません`);
				}
				return num;
			});

			// ターゲットのパース
			const targetStr = customTarget.trim();
			if (!targetStr) {
				alert("探索対象の値を入力してください");
				return;
			}

			const target = Number(targetStr);
			if (Number.isNaN(target)) {
				alert("探索対象は有効な数値を入力してください");
				return;
			}

			// 配列のサイズ制限
			if (array.length > 15) {
				alert("配列のサイズは15個以下にしてください（可視化のため）");
				return;
			}

			if (array.length < 1) {
				alert("配列には最低1個の要素が必要です");
				return;
			}

			setInput({ array, target });
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customArray, customTarget]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずナビゲーション */}
				<nav className="mb-6" aria-label="パンくずナビゲーション">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Link
							href="/algorithms"
							className="hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-1"
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
							線形探索
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
						線形探索アルゴリズム
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						配列の先頭から順番に要素をチェックして目標値を探すシンプルな探索アルゴリズムを学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
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
								初級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
								探索
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
										配列:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										[{input.array.join(", ")}]
									</div>
								</div>
								<div>
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										探索対象:
									</span>
									<div className="font-mono text-lg font-bold text-green-600 dark:text-green-400 mt-1">
										{input.target}
									</div>
								</div>
							</div>

							{/* カスタム入力 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="custom-array"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										配列（カンマ区切り、最大15個）
									</label>
									<input
										id="custom-array"
										type="text"
										value={customArray}
										onChange={(e) => setCustomArray(e.target.value)}
										placeholder="3, 1, 4, 1, 5, 9, 2"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<div>
									<label
										htmlFor="custom-target"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										探索対象
									</label>
									<input
										id="custom-target"
										type="number"
										value={customTarget}
										onChange={(e) => setCustomTarget(e.target.value)}
										placeholder="5"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
								>
									適用
								</button>
							</div>

							{/* プリセットボタン */}
							<div className="space-y-2 mb-6">
								<button
									type="button"
									onClick={generateRandomArray}
									className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
								>
									🎲 ランダム生成
								</button>
								<button
									type="button"
									onClick={generateBestCase}
									className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
								>
									⚡ 最良ケース（最初に発見）
								</button>
								<button
									type="button"
									onClick={generateWorstCase}
									className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
								>
									🐌 最悪ケース（最後に発見）
								</button>
								<button
									type="button"
									onClick={generateNotFoundCase}
									className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
								>
									❌ 見つからないケース
								</button>
							</div>

							{/* 実行ボタン */}
							<button
								type="button"
								onClick={executeAlgorithm}
								disabled={isExecuting}
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
									isExecuting
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "実行中..." : "🔍 線形探索実行"}
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
											<span
												className={`ml-2 font-mono font-bold ${
													result.success
														? "text-green-600 dark:text-green-400"
														: "text-red-600 dark:text-red-400"
												}`}
											>
												{result.success
													? `インデックス ${result.result}`
													: "見つかりませんでした"}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												実行ステップ数:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{result.executionSteps}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												時間計算量:
											</span>
											<span className="ml-2 font-mono font-bold text-green-600 dark:text-green-400">
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
								<div className="text-6xl mb-4">🔍</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから条件を設定し、「線形探索実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={linearSearchExplanation}
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
								<code>{`function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // 見つかった位置を返す
        }
    }
    return -1; // 見つからない場合
}

// 使用例
const array = [3, 1, 4, 1, 5, 9, 2, 6];
const index = linearSearch(array, 5);
console.log(index); // 4

// 全ての一致位置を取得する版
function linearSearchAll(arr, target) {
    const indices = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            indices.push(i);
        }
    }
    return indices;
}

const allIndices = linearSearchAll([1, 3, 1, 5, 1], 1);
console.log(allIndices); // [0, 2, 4]`}</code>
							</pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
