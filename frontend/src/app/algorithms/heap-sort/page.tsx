/**
 * src/app/algorithms/heap-sort/page.tsx
 *
 * ヒープソートアルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import {
	Code,
	RefreshCw,
	Settings,
	Shuffle,
	TreeDeciduous,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { heapSortExplanation } from "../../../data/explanations/heap-sort-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { HeapSortAlgorithm } from "../../../utils/algorithms/heap-sort";

/**
 * ヒープソート学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function HeapSortPage() {
	// アルゴリズムインスタンス
	const algorithm = new HeapSortAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("");

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
		const size = Math.floor(Math.random() * 4) + 6; // 6-9個の要素
		const array = HeapSortAlgorithm.generateRandomArray(size, 50);

		setInput({ array });
		setCustomArray(array.join(", "));
		setResult(null);
	}, []);

	/**
	 * 逆順配列を生成
	 */
	const generateReverseArray = useCallback(() => {
		const size = Math.floor(Math.random() * 3) + 6; // 6-8個の要素
		const array = HeapSortAlgorithm.generateReverseArray(size);

		setInput({ array });
		setCustomArray(array.join(", "));
		setResult(null);
	}, []);

	/**
	 * ソート済み配列を生成
	 */
	const generateSortedArray = useCallback(() => {
		const size = Math.floor(Math.random() * 3) + 6; // 6-8個の要素
		const array = HeapSortAlgorithm.generateSortedArray(size);

		setInput({ array });
		setCustomArray(array.join(", "));
		setResult(null);
	}, []);

	/**
	 * 重複要素を含む配列を生成
	 */
	const generateDuplicatesArray = useCallback(() => {
		const size = Math.floor(Math.random() * 3) + 7; // 7-9個の要素
		const array = HeapSortAlgorithm.generateArrayWithDuplicates(size);

		setInput({ array });
		setCustomArray(array.join(", "));
		setResult(null);
	}, []);

	/**
	 * ヒープ特性テスト用の配列を生成
	 */
	const generateHeapTestArray = useCallback(() => {
		const size = Math.floor(Math.random() * 3) + 7; // 7-9個の要素
		const array = HeapSortAlgorithm.generateHeapTestArray(size);

		setInput({ array });
		setCustomArray(array.join(", "));
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

			// 配列のサイズ制限
			if (array.length > 10) {
				alert("配列のサイズは10個以下にしてください（可視化のため）");
				return;
			}

			if (array.length < 2) {
				alert("配列には最低2個の要素が必要です");
				return;
			}

			setInput({ array });
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customArray]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずナビゲーション */}
				<nav className="mb-6" aria-label="パンくずナビゲーション">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Link
							href="/algorithms"
							className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1"
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
							ヒープソート
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-4">
						ヒープソートアルゴリズム
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						ヒープデータ構造を活用したインプレースソートアルゴリズムを学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
								O(n log n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量（保証）
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(1)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								空間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								インプレース
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								特性
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
										配列:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										[{input.array?.join(", ") ?? ""}]
									</div>
								</div>
								<div>
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										要素数:
									</span>
									<div className="font-mono text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
										{input.array?.length ?? 0}
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
										配列（カンマ区切り、最大10個）
									</label>
									<input
										id="custom-array"
										type="text"
										value={customArray}
										onChange={(e) => setCustomArray(e.target.value)}
										placeholder="64, 34, 25, 12, 22, 11, 90"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
								>
									適用
								</button>
							</div>

							{/* プリセットボタン */}
							<div className="space-y-2 mb-6">
								<button
									type="button"
									onClick={generateRandomArray}
									className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									<Shuffle className="w-4 h-4" />
									ランダム配列
								</button>
								<button
									type="button"
									onClick={generateSortedArray}
									className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									<TrendingUp className="w-4 h-4" />
									ソート済み配列
								</button>
								<button
									type="button"
									onClick={generateReverseArray}
									className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									<TrendingDown className="w-4 h-4" />
									逆順配列
								</button>
								<button
									type="button"
									onClick={generateDuplicatesArray}
									className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									<RefreshCw className="w-4 h-4" />
									重複要素配列
								</button>
								<button
									type="button"
									onClick={generateHeapTestArray}
									className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									<TreeDeciduous className="w-4 h-4" />
									ヒープ特性テスト
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
										: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? (
									"実行中..."
								) : (
									<>
										<TreeDeciduous className="w-4 h-4" />
										ヒープソート実行
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
												ソート結果:
											</span>
											<div className="font-mono text-sm text-green-600 dark:text-green-400 mt-1">
												[
												{Array.isArray(result.result)
													? result.result.join(", ")
													: result.result}
												]
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
												時間計算量:
											</span>
											<span className="ml-2 font-mono font-bold text-orange-600 dark:text-orange-400">
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
								<div className="text-6xl mb-4">
									<TreeDeciduous className="w-16 h-16 mx-auto text-purple-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから条件を設定し、「ヒープソート実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={heapSortExplanation}
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
								<code>{`function heapSort(arr) {
    const n = arr.length;
    
    // フェーズ1: 最大ヒープを構築
    buildMaxHeap(arr);
    
    // フェーズ2: 要素を一つずつ取り出してソート
    for (let i = n - 1; i > 0; i--) {
        // ルート（最大値）を現在の末尾と交換
        swap(arr, 0, i);
        
        // ヒープサイズを減らしてヒープ化
        heapify(arr, i, 0);
    }
    
    return arr;
}

function buildMaxHeap(arr) {
    const n = arr.length;
    
    // 最後の非葉ノードから開始
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
}

function heapify(arr, heapSize, rootIndex) {
    let largest = rootIndex;
    const leftChild = 2 * rootIndex + 1;
    const rightChild = 2 * rootIndex + 2;
    
    // 左の子と比較
    if (leftChild < heapSize && arr[leftChild] > arr[largest]) {
        largest = leftChild;
    }
    
    // 右の子と比較
    if (rightChild < heapSize && arr[rightChild] > arr[largest]) {
        largest = rightChild;
    }
    
    // 最大値がルートでない場合、交換して再帰的にヒープ化
    if (largest !== rootIndex) {
        swap(arr, rootIndex, largest);
        heapify(arr, heapSize, largest);
    }
}

function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// 使用例
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
const sortedArray = heapSort(unsortedArray);
console.log(sortedArray); // [11, 12, 22, 25, 34, 64, 90]`}</code>
							</pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
