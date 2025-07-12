/**
 * src/app/algorithms/fibonacci-recursive/page.tsx
 *
 * フィボナッチ数列（再帰）アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { fibonacciExplanation } from "../../../data/explanations/fibonacci-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { FibonacciRecursiveAlgorithm } from "../../../utils/algorithms/fibonacci-recursive";

/**
 * フィボナッチ数列（再帰）学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function FibonacciRecursivePage() {
	// アルゴリズムインスタンス
	const algorithm = new FibonacciRecursiveAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customN, setCustomN] = useState("5");

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
	 * 推奨値を設定
	 */
	const setRecommendedValue = useCallback((n: number) => {
		setInput({
			array: [],
			target: n,
			parameters: { n },
		});
		setCustomN(n.toString());
		setResult(null);
	}, []);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			const n = Number.parseInt(customN.trim(), 10);

			if (Number.isNaN(n)) {
				alert("有効な数値を入力してください");
				return;
			}

			if (n < 0) {
				alert("nは0以上の値である必要があります");
				return;
			}

			if (n > 25) {
				alert("教育目的のため、nは25以下に制限されています");
				return;
			}

			setInput({
				array: [],
				target: n,
				parameters: { n },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customN]);

	// 推奨値を取得
	const recommendedValues = FibonacciRecursiveAlgorithm.getRecommendedValues();

	// 現在のnを取得
	const currentN = input.target || input.parameters?.n || 0;

	// 予想計算回数を取得
	const estimatedCalls =
		FibonacciRecursiveAlgorithm.estimateCallCount(currentN);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずナビゲーション */}
				<nav className="mb-6" aria-label="パンくずナビゲーション">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Link
							href="/algorithms"
							className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors flex items-center gap-1"
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
							フィボナッチ数列（再帰）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent mb-4">
						フィボナッチ数列（再帰）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						再帰アルゴリズムの基本概念と指数的計算量の問題を学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-red-600 dark:text-red-400">
								O(2^n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量（指数的）
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
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								再帰
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								手法
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
										計算対象:
									</span>
									<div className="font-mono text-lg font-bold text-yellow-600 dark:text-yellow-400 mt-1">
										F({currentN})
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										予想呼び出し回数:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										約 {estimatedCalls.toLocaleString()} 回
									</div>
								</div>
								{currentN > 15 && (
									<div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs text-yellow-800 dark:text-yellow-200">
										⚠️ n {">"} 15は実行に時間がかかります
									</div>
								)}
							</div>

							{/* カスタム入力 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="custom-n"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										n の値（0以上25以下）
									</label>
									<input
										id="custom-n"
										type="number"
										min="0"
										max="25"
										value={customN}
										onChange={(e) => setCustomN(e.target.value)}
										placeholder="5"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
								>
									適用
								</button>
							</div>

							{/* 推奨値ボタン */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									📚 推奨値
								</h4>
								<div className="grid grid-cols-2 gap-2">
									{recommendedValues.slice(0, 8).map((rec) => (
										<button
											key={rec.n}
											type="button"
											onClick={() => setRecommendedValue(rec.n)}
											className={`py-1 px-2 text-xs rounded transition-colors ${
												currentN === rec.n
													? "bg-yellow-600 text-white"
													: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											}`}
											title={`${rec.description} (${rec.executionTime})`}
										>
											F({rec.n})
										</button>
									))}
								</div>
							</div>

							{/* フィボナッチ数列表示 */}
							<div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
								<h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
									🔢 フィボナッチ数列
								</h4>
								<div className="text-xs text-blue-700 dark:text-blue-300 font-mono">
									{FibonacciRecursiveAlgorithm.generateSequence(
										Math.min(currentN + 3, 10),
									)
										.map((val, i) => `F(${i})=${val}`)
										.join(", ")}
									{currentN + 3 > 10 && ", ..."}
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
										: "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "実行中..." : "🔄 フィボナッチ計算実行"}
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
												F({currentN}) =
											</span>
											<span className="ml-2 font-mono font-bold text-green-600 dark:text-green-400">
												{result.result}
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
											<span className="ml-2 font-mono font-bold text-red-600 dark:text-red-400">
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
								<div className="text-6xl mb-4">🔄</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルからnの値を設定し、「フィボナッチ計算実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={fibonacciExplanation}
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
								<code>{`function fibonacci(n) {
    // ベースケース：停止条件
    if (n <= 1) {
        return n;
    }
    
    // 再帰ケース：自分自身を呼び出し
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 使用例
console.log(fibonacci(0));  // 0
console.log(fibonacci(1));  // 1
console.log(fibonacci(5));  // 5
console.log(fibonacci(10)); // 55

// 数列を生成
function generateFibonacciSequence(count) {
    const sequence = [];
    for (let i = 0; i < count; i++) {
        sequence.push(fibonacci(i));
    }
    return sequence;
}

console.log(generateFibonacciSequence(10));
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// 注意：この実装は O(2^n) の時間計算量で非効率
// 実用的な用途には最適化が必要`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* 最適化の提案セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
						<h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">
							⚡ 最適化の必要性
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">
									問題点
								</h4>
								<ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
									<li>• 同じ計算を何度も繰り返す</li>
									<li>• 計算量が指数的に増加 O(2^n)</li>
									<li>• n=40で約10億回の関数呼び出し</li>
									<li>• 実用的でない実行時間</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">
									解決策
								</h4>
								<ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
									<li>• メモ化（計算済み結果をキャッシュ）</li>
									<li>• 動的プログラミング（ボトムアップ）</li>
									<li>• 反復的実装（ループ使用）</li>
									<li>• 行列累乗による O(log n) 解法</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
