/**
 * src/app/algorithms/quick-sort/page.tsx
 *
 * クイックソートアルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import {
	Code,
	Scale,
	Settings,
	Shuffle,
	TrendingDown,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { quickSortExplanation } from "../../../data/explanations/quick-sort-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import {
	type PivotStrategy,
	QuickSortAlgorithm,
	type QuickSortInput,
} from "../../../utils/algorithms/quick-sort";

/**
 * クイックソート学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function QuickSortPage() {
	// アルゴリズムインスタンス
	const algorithm = new QuickSortAlgorithm();

	// 状態管理
	const [input, setInput] = useState<QuickSortInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("");
	const [pivotStrategy, setPivotStrategy] = useState<PivotStrategy>("last");

	/**
	 * アルゴリズムを実行
	 */
	const executeAlgorithm = useCallback(() => {
		setIsExecuting(true);
		try {
			const executionResult = algorithm.execute({
				...input,
				pivotStrategy: pivotStrategy,
			});
			setResult(executionResult);
		} catch (error) {
			console.error("アルゴリズム実行エラー:", error);
			alert(
				error instanceof Error ? error.message : "実行中にエラーが発生しました",
			);
		} finally {
			setIsExecuting(false);
		}
	}, [algorithm, input, pivotStrategy]);

	/**
	 * ランダムな配列を生成
	 */
	const generateRandomArray = useCallback(() => {
		const size = Math.floor(Math.random() * 5) + 6; // 6-10個の要素
		const array = QuickSortAlgorithm.generateRandomArray(size, 50);

		setInput({ array, pivotStrategy });
		setCustomArray(array.join(", "));
		setResult(null);
	}, [pivotStrategy]);

	/**
	 * 逆順配列を生成（最悪ケース）
	 */
	const generateReverseArray = useCallback(() => {
		const size = Math.floor(Math.random() * 3) + 6; // 6-8個の要素
		const array = QuickSortAlgorithm.generateReverseArray(size);

		setInput({ array, pivotStrategy });
		setCustomArray(array.join(", "));
		setResult(null);
	}, [pivotStrategy]);

	/**
	 * ソート済み配列を生成（最悪ケース）
	 */
	const generateSortedArray = useCallback(() => {
		const size = Math.floor(Math.random() * 3) + 6; // 6-8個の要素
		const array = QuickSortAlgorithm.generateSortedArray(size);

		setInput({ array, pivotStrategy });
		setCustomArray(array.join(", "));
		setResult(null);
	}, [pivotStrategy]);

	/**
	 * バランスの取れた配列を生成（最良ケース）
	 */
	const generateBalancedArray = useCallback(() => {
		const size = Math.floor(Math.random() * 3) + 7; // 7-9個の要素
		const array = QuickSortAlgorithm.generateBalancedArray(size);

		setInput({ array, pivotStrategy });
		setCustomArray(array.join(", "));
		setResult(null);
	}, [pivotStrategy]);

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

			setInput({ array, pivotStrategy });
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customArray, pivotStrategy]);

	/**
	 * ピボット戦略を変更
	 */
	const handlePivotStrategyChange = useCallback((strategy: PivotStrategy) => {
		setPivotStrategy(strategy);
		setInput((prev) => ({ ...prev, pivotStrategy: strategy }));
		setResult(null);
	}, []);

	/**
	 * ピボット戦略の表示名を取得
	 */
	const getPivotStrategyName = (strategy: PivotStrategy): string => {
		const strategyNames: Record<PivotStrategy, string> = {
			first: "先頭要素",
			last: "末尾要素",
			middle: "中央要素",
			random: "ランダム要素",
		};
		return strategyNames[strategy];
	};

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
							クイックソート
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
						クイックソートアルゴリズム
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						分割統治法を使用した高速で実用的なソートアルゴリズムを学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								O(n log n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量（平均）
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								O(log n)
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
								ソート
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
										配列:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										[{input.array?.join(", ") ?? ""}]
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										要素数:
									</span>
									<div className="font-mono text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">
										{input.array?.length ?? 0}
									</div>
								</div>
								<div>
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										ピボット戦略:
									</span>
									<div className="font-mono text-sm text-blue-600 dark:text-blue-400 mt-1">
										{getPivotStrategyName(pivotStrategy)}
									</div>
								</div>
							</div>

							{/* ピボット戦略選択 */}
							<div className="mb-6">
								<div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									ピボット選択戦略
								</div>
								<div className="grid grid-cols-2 gap-2">
									{(
										["first", "last", "middle", "random"] as PivotStrategy[]
									).map((strategy) => (
										<button
											key={strategy}
											type="button"
											onClick={() => handlePivotStrategyChange(strategy)}
											className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
												pivotStrategy === strategy
													? "bg-purple-600 text-white"
													: "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
											}`}
										>
											{getPivotStrategyName(strategy)}
										</button>
									))}
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
										placeholder="3, 6, 8, 10, 1, 2, 1"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
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
									onClick={generateBalancedArray}
									className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									<Scale className="w-4 h-4" />
									バランス配列（最良ケース）
								</button>
								<button
									type="button"
									onClick={generateSortedArray}
									className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									<TrendingUp className="w-4 h-4" />
									ソート済み（最悪ケース）
								</button>
								<button
									type="button"
									onClick={generateReverseArray}
									className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									<TrendingDown className="w-4 h-4" />
									逆順配列（最悪ケース）
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
										<Zap className="w-4 h-4" />
										クイックソート実行
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
											<span className="ml-2 font-mono font-bold text-purple-600 dark:text-purple-400">
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
									<Zap className="w-16 h-16 mx-auto text-purple-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから条件を設定し、「クイックソート実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={quickSortExplanation}
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
								<code>{`function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        // パーティション操作：ピボットの正しい位置を見つける
        const pivotIndex = partition(arr, low, high);
        
        // ピボットの左側を再帰的にソート
        quickSort(arr, low, pivotIndex - 1);
        
        // ピボットの右側を再帰的にソート
        quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high]; // 末尾をピボットに選択
    let i = low - 1; // 小さい要素の境界
    
    for (let j = low; j < high; j++) {
        // 現在の要素がピボット以下の場合
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; // 交換
        }
    }
    
    // ピボットを正しい位置に配置
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1; // ピボットの位置を返す
}

// 使用例
const unsortedArray = [3, 6, 8, 10, 1, 2, 1];
const sortedArray = quickSort([...unsortedArray]);
console.log(sortedArray); // [1, 1, 2, 3, 6, 8, 10]`}</code>
							</pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
