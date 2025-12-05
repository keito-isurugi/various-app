/**
 * src/app/algorithms/array-reverse-recursive/page.tsx
 *
 * 配列の逆順（再帰）アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import {
	AlertTriangle,
	BarChart3,
	BookOpen,
	Code,
	RefreshCw,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { arrayReverseExplanation } from "../../../data/explanations/array-reverse-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { ArrayReverseRecursiveAlgorithm } from "../../../utils/algorithms/array-reverse-recursive";

/**
 * 配列の逆順（再帰）学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function ArrayReverseRecursivePage() {
	// アルゴリズムインスタンス
	const algorithm = new ArrayReverseRecursiveAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("1, 2, 3, 4, 5");

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
	 * 推奨配列を設定
	 */
	const setRecommendedArray = useCallback((array: number[]) => {
		setInput({
			array: [...array],
			target: undefined,
			parameters: {},
		});
		setCustomArray(array.join(", "));
		setResult(null);
	}, []);

	/**
	 * カスタム配列を適用
	 */
	const applyCustomArray = useCallback(() => {
		try {
			// 入力文字列をパース
			const arrayStr = customArray.trim();
			if (!arrayStr) {
				alert("配列を入力してください");
				return;
			}

			// カンマ区切りの数値に変換
			const numbers = arrayStr.split(",").map((str) => {
				const num = Number.parseInt(str.trim(), 10);
				if (Number.isNaN(num)) {
					throw new Error(`"${str.trim()}" は有効な数値ではありません`);
				}
				return num;
			});

			if (numbers.length === 0) {
				alert("少なくとも1つの要素を入力してください");
				return;
			}

			if (numbers.length > 20) {
				alert("教育目的のため、配列の長さは20要素以下に制限されています");
				return;
			}

			setInput({
				array: numbers,
				target: undefined,
				parameters: {},
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error
					? error.message
					: "配列の解析でエラーが発生しました",
			);
		}
	}, [customArray]);

	// 推奨配列を取得
	const recommendedArrays =
		ArrayReverseRecursiveAlgorithm.getRecommendedArrays();

	// 現在の配列の統計情報を取得
	const currentArray = input.array || [];
	const statistics = ArrayReverseRecursiveAlgorithm.getStatistics(
		currentArray.length,
	);
	const estimatedTime = ArrayReverseRecursiveAlgorithm.estimateExecutionTime(
		currentArray.length,
	);

	// 反復実装との比較
	const iterativeResult =
		currentArray.length > 0
			? ArrayReverseRecursiveAlgorithm.reverseIterative(currentArray)
			: [];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずナビゲーション */}
				<nav className="mb-6" aria-label="パンくずナビゲーション">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Link
							href="/algorithms"
							className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1"
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
							配列の逆順（再帰）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4">
						配列の逆順（再帰）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						線形再帰パターンで分割統治の考え方を学び、両端から中央へ向かう処理を理解しよう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
								O(n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量（線形）
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
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
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
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
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
								<RefreshCw className="w-5 h-5" />
								実行設定
							</h3>

							{/* 現在の配列表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										現在の配列:
									</span>
									<div className="font-mono text-sm text-teal-600 dark:text-teal-400 mt-1 break-all">
										[{currentArray.join(", ")}]
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										配列長:
									</span>
									<span className="ml-2 font-mono text-sm text-gray-900 dark:text-gray-100">
										{currentArray.length}要素
									</span>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										予想交換回数:
									</span>
									<span className="ml-2 font-mono text-sm text-gray-900 dark:text-gray-100">
										{statistics.expectedSwaps}回
									</span>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										予想実行時間:
									</span>
									<span className="ml-2 font-mono text-sm text-gray-900 dark:text-gray-100">
										{estimatedTime}
									</span>
								</div>
								{currentArray.length > 15 && (
									<div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs text-yellow-800 dark:text-yellow-200">
										<AlertTriangle className="w-3 h-3 inline" /> 配列長 {">"}{" "}
										15は処理ステップが多くなります
									</div>
								)}
							</div>

							{/* カスタム配列入力 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="custom-array"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										配列（カンマ区切り、最大20要素）
									</label>
									<input
										id="custom-array"
										type="text"
										value={customArray}
										onChange={(e) => setCustomArray(e.target.value)}
										placeholder="1, 2, 3, 4, 5"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<button
									type="button"
									onClick={applyCustomArray}
									className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
								>
									適用
								</button>
							</div>

							{/* 推奨配列ボタン */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
									<BookOpen className="w-4 h-4" />
									推奨配列
								</h4>
								<div className="grid grid-cols-1 gap-2">
									{recommendedArrays.slice(0, 8).map((rec) => (
										<button
											key={JSON.stringify(rec.array)}
											type="button"
											onClick={() => setRecommendedArray(rec.array)}
											className={`py-2 px-3 text-left text-xs rounded transition-colors ${
												JSON.stringify(currentArray) ===
												JSON.stringify(rec.array)
													? "bg-teal-600 text-white"
													: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											}`}
											title={rec.insight}
										>
											<div className="font-mono text-xs">
												[{rec.array.join(", ")}]
											</div>
											<div className="text-xs opacity-75 mt-1">
												{rec.description}
											</div>
										</button>
									))}
								</div>
							</div>

							{/* 統計情報 */}
							<div className="mb-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
								<h4 className="text-sm font-medium text-teal-800 dark:text-teal-200 mb-2 flex items-center gap-2">
									<BarChart3 className="w-4 h-4" />
									統計情報
								</h4>
								<div className="text-xs text-teal-700 dark:text-teal-300 space-y-1">
									<div>交換回数: {statistics.expectedSwaps}回</div>
									<div>最大深度: {statistics.maxDepth}</div>
									<div>再帰呼び出し: {statistics.recursiveCalls}回</div>
									<div>時間計算量: {statistics.timeComplexity}</div>
								</div>
							</div>

							{/* 反復実装との比較 */}
							{currentArray.length > 0 && (
								<div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
									<h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
										<RefreshCw className="w-4 h-4" />
										反復実装との比較
									</h4>
									<div className="text-xs text-blue-700 dark:text-blue-300">
										<div className="mb-1">
											反復結果: [{iterativeResult.join(", ")}]
										</div>
										<div>再帰: 教育的、反復: 実用的</div>
									</div>
								</div>
							)}

							{/* 実行ボタン */}
							<button
								type="button"
								onClick={executeAlgorithm}
								disabled={isExecuting || currentArray.length === 0}
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
									isExecuting || currentArray.length === 0
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? (
									"実行中..."
								) : (
									<>
										<RefreshCw className="w-4 h-4" />
										配列逆順実行
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
												結果:
											</span>
											<div className="ml-2 font-mono text-xs text-teal-600 dark:text-teal-400 break-all">
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
											<span className="ml-2 font-mono font-bold text-teal-600 dark:text-teal-400">
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
									<RefreshCw className="w-16 h-16 mx-auto text-teal-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから配列を設定し、「配列逆順実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={arrayReverseExplanation}
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
								<code>{`function reverseArray(array, start = 0, end = array.length - 1) {
    // ベースケース：start >= end なら処理終了
    if (start >= end) {
        return;
    }
    
    // 両端の要素を交換
    const temp = array[start];
    array[start] = array[end];
    array[end] = temp;
    
    // 内側の範囲に対して再帰呼び出し
    reverseArray(array, start + 1, end - 1);
}

// 使用例
const numbers = [1, 2, 3, 4, 5];
console.log("逆順前:", numbers);
reverseArray(numbers);
console.log("逆順後:", numbers); // [5, 4, 3, 2, 1]

// より明示的な実装
function reverseArrayExplicit(array, start, end) {
    console.log(\`reverseArray(\${start}, \${end}) 呼び出し\`);
    
    if (start >= end) {
        console.log(\`ベースケース: start=\${start}, end=\${end}\`);
        return;
    }
    
    console.log(\`交換: array[\${start}]  -  array[\${end}]\`);
    [array[start], array[end]] = [array[end], array[start]];
    
    reverseArrayExplicit(array, start + 1, end - 1);
}

// 反復実装（比較用）
function reverseArrayIterative(array) {
    let start = 0;
    let end = array.length - 1;
    
    while (start < end) {
        [array[start], array[end]] = [array[end], array[start]];
        start++;
        end--;
    }
}

// 関数型実装（副作用なし）
function reverseArrayFunctional(array) {
    if (array.length <= 1) return array;
    
    return [
        array[array.length - 1],
        ...reverseArrayFunctional(array.slice(1, -1)),
        array[0]
    ];
}

// 計算量分析
// 時間計算量: O(n) - n/2回の交換
// 空間計算量: O(n) - 再帰スタック
// 再帰の深さ: floor(n/2)`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズム比較セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-700">
						<h3 className="text-xl font-semibold text-teal-900 dark:text-teal-100 mb-4 flex items-center gap-2">
							<RefreshCw className="w-5 h-5" />
							再帰 vs 反復 vs 関数型
						</h3>
						<div className="grid md:grid-cols-3 gap-6">
							<div>
								<h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-3">
									再帰実装
								</h4>
								<ul className="space-y-2 text-teal-700 dark:text-teal-300 text-sm">
									<li>• 分割統治の考え方が直感的</li>
									<li>• 数学的定義に忠実</li>
									<li>• 教育的価値が高い</li>
									<li>• スタック使用量 O(n)</li>
									<li>• 関数型プログラミングと相性良</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-3">
									反復実装
								</h4>
								<ul className="space-y-2 text-teal-700 dark:text-teal-300 text-sm">
									<li>• メモリ効率が良い O(1)</li>
									<li>• スタックオーバーフロー回避</li>
									<li>• 実用的で高速</li>
									<li>• 理解が容易</li>
									<li>• 実装がシンプル</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-3">
									関数型実装
								</h4>
								<ul className="space-y-2 text-teal-700 dark:text-teal-300 text-sm">
									<li>• 副作用なし（純粋関数）</li>
									<li>• 元配列を変更しない</li>
									<li>• 関数合成に適している</li>
									<li>• テストしやすい</li>
									<li>• メモリ使用量は多い</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
