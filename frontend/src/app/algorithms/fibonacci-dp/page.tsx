/**
 * src/app/algorithms/fibonacci-dp/page.tsx
 *
 * フィボナッチ数列（動的計画法版）アルゴリズムの解説ページ
 * メモ化による効率的な実装とテーブル構築の可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { fibonacciDpExplanation } from "../../../data/explanations/fibonacci-dp-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { FibonacciDPAlgorithm } from "../../../utils/algorithms/fibonacci-dp";

/**
 * フィボナッチ数列（動的計画法）学習ページ
 * DPによる効率的な計算とメモ化テーブルの可視化
 */
export default function FibonacciDPPage() {
	// アルゴリズムインスタンス
	const algorithm = new FibonacciDPAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customN, setCustomN] = useState("10");

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

			if (n > 1000) {
				alert("教育目的のため、nは1000以下に制限されています");
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
	const recommendedValues = FibonacciDPAlgorithm.getRecommendedValues();

	// 現在のnを取得
	const currentN = input.target || input.parameters?.n || 0;

	// メモリ使用量を計算
	const memoryUsage = FibonacciDPAlgorithm.calculateMemoryUsage(currentN);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずナビゲーション */}
				<nav className="mb-6" aria-label="パンくずナビゲーション">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Link
							href="/algorithms"
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
							アルゴリズム学習
						</Link>
						<span className="text-gray-400">／</span>
						<span className="text-gray-900 dark:text-gray-100 font-medium">
							フィボナッチ数列（動的計画法）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						フィボナッチ数列（動的計画法）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						動的計画法で効率的に計算し、再帰版の問題を解決しよう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量（線形）
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
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								初級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
								DP
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
									<div className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
										F({currentN})
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										メモリ使用量:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{memoryUsage} 要素
									</div>
								</div>
								<div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-800 dark:text-green-200">
									✅ 大きな値でも効率的に計算可能
								</div>
							</div>

							{/* カスタム入力 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="custom-n"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										n の値（0以上1000以下）
									</label>
									<input
										id="custom-n"
										type="number"
										min="0"
										max="1000"
										value={customN}
										onChange={(e) => setCustomN(e.target.value)}
										placeholder="10"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
									{recommendedValues.map((rec) => (
										<button
											key={rec.n}
											type="button"
											onClick={() => setRecommendedValue(rec.n)}
											className={`py-1 px-2 text-xs rounded transition-colors ${
												currentN === rec.n
													? "bg-blue-600 text-white"
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
							<div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
								<h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
									🔢 フィボナッチ数列
								</h4>
								<div className="text-xs text-purple-700 dark:text-purple-300 font-mono">
									{FibonacciDPAlgorithm.generateSequence(
										Math.min(currentN + 1, 10),
									)
										.map((val, i) => `F(${i})=${val}`)
										.join(", ")}
									{currentN + 1 > 10 && ", ..."}
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
										: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "実行中..." : "🚀 DP計算実行"}
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
												{result.executionSteps?.length ?? 0}
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
								<div className="text-6xl mb-4">🚀</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルからnの値を設定し、「DP計算実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={fibonacciDpExplanation}
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
								<code>{`function fibonacciDP(n) {
    // エッジケース
    if (n <= 1) {
        return n;
    }
    
    // DPテーブルを初期化
    const dp = new Array(n + 1);
    dp[0] = 0;  // F(0) = 0
    dp[1] = 1;  // F(1) = 1
    
    // ボトムアップで計算
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// メモリ最適化版（O(1)空間計算量）
function fibonacciDPOptimized(n) {
    if (n <= 1) {
        return n;
    }
    
    let prev2 = 0;  // F(i-2)
    let prev1 = 1;  // F(i-1)
    
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// 使用例
console.log(fibonacciDP(10));     // 55
console.log(fibonacciDP(50));     // 12586269025
console.log(fibonacciDP(100));    // 354224848179261915075

// DPテーブル全体を返す版
function fibonacciDPWithTable(n) {
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return { result: dp[n], table: dp };
}`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* 再帰版との比較セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
						<h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
							⚖️ 再帰版との比較
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
									再帰版（非効率）
								</h4>
								<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
									<li>• 時間計算量: O(2^n)</li>
									<li>• 空間計算量: O(n)（コールスタック）</li>
									<li>• n=40で約10億回の計算</li>
									<li>• 同じ値を何度も再計算</li>
									<li>• 実行時間が指数的に増加</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									DP版（効率的）
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 時間計算量: O(n)</li>
									<li>• 空間計算量: O(n) または O(1)</li>
									<li>• n=40でも40回の計算のみ</li>
									<li>• 各値を一度だけ計算</li>
									<li>• 実行時間が線形的に増加</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
							<p className="text-sm text-blue-800 dark:text-blue-200">
								💡 <strong>ポイント:</strong>{" "}
								動的計画法は「部分問題の解を保存して再利用」することで、
								計算の重複を避け、効率的にアルゴリズムを実行します。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
