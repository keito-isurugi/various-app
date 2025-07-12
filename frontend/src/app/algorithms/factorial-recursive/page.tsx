/**
 * src/app/algorithms/factorial-recursive/page.tsx
 *
 * 階乗の計算（再帰）アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { factorialExplanation } from "../../../data/explanations/factorial-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { FactorialRecursiveAlgorithm } from "../../../utils/algorithms/factorial-recursive";

/**
 * 階乗の計算（再帰）学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function FactorialRecursivePage() {
	// アルゴリズムインスタンス
	const algorithm = new FactorialRecursiveAlgorithm();

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

			if (n > 20) {
				alert("教育目的のため、nは20以下に制限されています");
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
	const recommendedValues = FactorialRecursiveAlgorithm.getRecommendedValues();

	// 現在のnを取得
	const currentN = input.target || input.parameters?.n || 0;

	// 予想実行時間を取得
	const estimatedTime =
		FactorialRecursiveAlgorithm.estimateExecutionTime(currentN);

	// 階乗の値を計算（表示用）
	const factorialValue =
		currentN <= 10
			? FactorialRecursiveAlgorithm.calculateFactorialIterative(currentN)
			: null;

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
							階乗の計算（再帰）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
						階乗の計算（再帰）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						線形再帰構造で再帰アルゴリズムの基本概念を学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
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
							<div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
								初級〜中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								線形再帰
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
									<div className="font-mono text-lg font-bold text-green-600 dark:text-green-400 mt-1">
										{currentN}!
									</div>
								</div>
								{factorialValue !== null && (
									<div className="mb-2">
										<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
											計算結果:
										</span>
										<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
											{factorialValue.toLocaleString()}
										</div>
									</div>
								)}
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										予想実行時間:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{estimatedTime}
									</div>
								</div>
								{currentN > 15 && (
									<div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs text-yellow-800 dark:text-yellow-200">
										⚠️ n {">"} 15は大きな値です
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
										n の値（0以上20以下）
									</label>
									<input
										id="custom-n"
										type="number"
										min="0"
										max="20"
										value={customN}
										onChange={(e) => setCustomN(e.target.value)}
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

							{/* 推奨値ボタン */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									📚 推奨値
								</h4>
								<div className="grid grid-cols-3 gap-2">
									{recommendedValues.slice(0, 9).map((rec) => (
										<button
											key={rec.n}
											type="button"
											onClick={() => setRecommendedValue(rec.n)}
											className={`py-1 px-2 text-xs rounded transition-colors ${
												currentN === rec.n
													? "bg-green-600 text-white"
													: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											}`}
											title={`${rec.description} = ${rec.result}`}
										>
											{rec.n}!
										</button>
									))}
								</div>
							</div>

							{/* 階乗の値表示 */}
							<div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
								<h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
									🔢 階乗の値
								</h4>
								<div className="text-xs text-blue-700 dark:text-blue-300 font-mono">
									{FactorialRecursiveAlgorithm.generateFactorialSequence(
										Math.min(currentN + 3, 8),
									)
										.map((val, i) => `${i}!=${val}`)
										.join(", ")}
									{currentN + 3 > 8 && ", ..."}
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
										: "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "実行中..." : "🔢 階乗計算実行"}
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
												{currentN}! =
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
								<div className="text-6xl mb-4">🔢</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルからnの値を設定し、「階乗計算実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={factorialExplanation}
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
								<code>{`function factorial(n) {
    // ベースケース：停止条件
    if (n <= 1) {
        return 1;
    }
    
    // 再帰ケース：n! = n × (n-1)!
    return n * factorial(n - 1);
}

// 使用例
console.log(factorial(0));  // 1
console.log(factorial(1));  // 1
console.log(factorial(5));  // 120
console.log(factorial(10)); // 3628800

// 反復版（比較用）
function factorialIterative(n) {
    if (n < 0) throw new Error("負数は未対応");
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

// 数列を生成
function generateFactorialSequence(count) {
    const sequence = [];
    for (let i = 0; i < count; i++) {
        sequence.push(factorial(i));
    }
    return sequence;
}

console.log(generateFactorialSequence(6));
// [1, 1, 2, 6, 24, 120]

// 注意：この再帰実装は O(n) の時間・空間計算量
// 大きなnではスタックオーバーフローに注意`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* 比較セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
						<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
							🔄 再帰 vs 反復
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									再帰実装の特徴
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 数学的定義に忠実で理解しやすい</li>
									<li>• コードが簡潔で美しい</li>
									<li>• 線形時間 O(n) で実用的</li>
									<li>• スタック使用量 O(n)</li>
									<li>• 大きなnではスタックオーバーフローリスク</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									反復実装の特徴
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• メモリ効率が良い O(1) 空間</li>
									<li>• スタックオーバーフローが発生しない</li>
									<li>• 実行速度が若干高速</li>
									<li>• 実用的なアプリケーションで推奨</li>
									<li>• 教育的価値は再帰実装の方が高い</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
