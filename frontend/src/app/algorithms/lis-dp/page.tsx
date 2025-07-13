/**
 * src/app/algorithms/lis-dp/page.tsx
 *
 * 最長増加部分列（LIS）アルゴリズムの解説ページ
 * 動的計画法を使って配列から最長の増加部分列を効率的に求めるアルゴリズムの学習と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { lisDpExplanation } from "../../../data/explanations/lis-dp-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { LISDPAlgorithm } from "../../../utils/algorithms/lis-dp";

/**
 * LIS（最長増加部分列）学習ページ
 * 動的計画法による効率的なLIS計算の理解と可視化
 */
export default function LISDPPage() {
	// アルゴリズムインスタンス
	const algorithm = new LISDPAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [inputArrayString, setInputArrayString] = useState(
		"10, 22, 9, 33, 21, 50, 41, 60",
	);

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
	 * 推奨入力を設定
	 */
	const setRecommendedInput = useCallback((array: number[]) => {
		setInput({
			array: [...array],
		});
		setInputArrayString(array.join(", "));
		setResult(null);
	}, []);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			const arrayStr = inputArrayString.trim();

			if (!arrayStr) {
				alert("配列を入力してください");
				return;
			}

			// カンマ区切りの数値をパース
			const numbers = arrayStr
				.split(",")
				.map((s) => s.trim())
				.filter((s) => s !== "")
				.map((s) => {
					const num = Number.parseInt(s, 10);
					if (Number.isNaN(num)) {
						throw new Error(`"${s}" は有効な数値ではありません`);
					}
					return num;
				});

			if (numbers.length === 0) {
				alert("少なくとも1つの数値を入力してください");
				return;
			}

			if (numbers.length > 12) {
				alert("配列のサイズは12要素以下にしてください");
				return;
			}

			// 値の範囲制限
			if (numbers.some((num) => num < 1 || num > 100)) {
				alert("値は1から100の範囲で設定してください");
				return;
			}

			setInput({
				array: numbers,
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [inputArrayString]);

	// 推奨入力例を取得
	const recommendedInputs = LISDPAlgorithm.getRecommendedInputs();

	// 現在の配列
	const currentArray = input.array || [10, 22, 9, 33, 21, 50, 41, 60];

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
							最長増加部分列（LIS）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						最長増加部分列（LIS）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						動的計画法で配列から最長の増加部分列を効率的に求める最適化アルゴリズム
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(n²)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量
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
							<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
								中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								配列DP
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								一次元テーブル
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								📝 配列入力
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										処理対象:
									</span>
									<div className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
										[{currentArray.join(", ")}]
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										配列サイズ:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										{currentArray.length} 要素
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										DPテーブル:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										dp[0] ～ dp[{currentArray.length - 1}]
									</div>
								</div>
								<div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-200">
									📈 部分列：元の順序を保ったまま要素を選択したもの
								</div>
							</div>

							{/* 入力フォーム */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="input-array"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										配列（カンマ区切り）
									</label>
									<textarea
										id="input-array"
										value={inputArrayString}
										onChange={(e) => setInputArrayString(e.target.value)}
										rows={3}
										placeholder="10, 22, 9, 33, 21, 50, 41, 60"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono text-sm resize-none"
									/>
									<div className="text-xs text-gray-500 mt-1">
										1-100の整数、最大12要素まで
									</div>
								</div>

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
								>
									設定を適用
								</button>
							</div>

							{/* 推奨入力例 */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									📚 推奨入力例
								</h4>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{recommendedInputs.map((rec) => (
										<button
											key={`${rec.array.join(",")}-${rec.expectedLength}`}
											type="button"
											onClick={() => setRecommendedInput(rec.array)}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={`期待されるLIS: [${rec.expectedLIS.join(", ")}] (長さ${rec.expectedLength})`}
										>
											<div className="font-semibold">
												[{rec.array.join(", ")}]
											</div>
											<div className="text-xs opacity-75">
												{rec.description}
											</div>
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
										: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "計算中..." : "🧮 LIS計算実行"}
							</button>

							{/* 結果表示 */}
							{result && (
								<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
										計算結果
									</h4>
									<div className="space-y-2 text-sm">
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												最長増加部分列:
											</span>
											<span className="ml-2 font-mono font-bold text-blue-600 dark:text-blue-400 text-lg">
												[{(result.result as number[]).join(", ")}]
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												LISの長さ:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{(result.result as number[]).length}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												計算ステップ数:
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
								<div className="text-6xl mb-4">🧮</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									最長増加部分列を計算してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルから配列を設定し、「LIS計算実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={lisDpExplanation}
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
								<code>{`// 最長増加部分列（LIS）を動的計画法で求める
function lis(arr) {
    const n = arr.length;
    if (n === 0) return { length: 0, lis: [] };
    
    // DPテーブルを初期化（全て1で初期化）
    const dp = Array(n).fill(1);
    const predecessor = Array(n).fill(-1);
    
    // DPテーブルを構築
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            // 増加条件を満たし、より長いLISが見つかった場合
            if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                predecessor[i] = j; // バックトラック用
            }
        }
    }
    
    // 最大長とその位置を見つける
    let maxLength = Math.max(...dp);
    let maxIndex = dp.indexOf(maxLength);
    
    // バックトラックでLISを構築
    const lisArray = [];
    let currentIndex = maxIndex;
    
    while (currentIndex !== -1) {
        lisArray.unshift(arr[currentIndex]);
        currentIndex = predecessor[currentIndex];
    }
    
    return {
        length: maxLength,
        lis: lisArray,
        dpTable: dp
    };
}

// 使用例
console.log(lis([10, 22, 9, 33, 21, 50, 41, 60]));
// { length: 5, lis: [10, 22, 33, 50, 60], dpTable: [1, 2, 1, 3, 3, 4, 4, 5] }

console.log(lis([3, 10, 2, 1, 20]));
// { length: 3, lis: [3, 10, 20], dpTable: [1, 2, 1, 1, 3] }

console.log(lis([1, 2, 3, 4, 5]));
// { length: 5, lis: [1, 2, 3, 4, 5], dpTable: [1, 2, 3, 4, 5] }

console.log(lis([5, 4, 3, 2, 1]));
// { length: 1, lis: [5], dpTable: [1, 1, 1, 1, 1] }

// 株価分析での応用例
function findLongestUptrend(prices) {
    const result = lis(prices);
    const uptrendRatio = (result.length / prices.length) * 100;
    
    return {
        ...result,
        uptrendRatio: uptrendRatio.toFixed(2) + "%",
        isStrongUptrend: result.length >= prices.length * 0.7
    };
}

const stockPrices = [100, 110, 95, 120, 115, 130, 125, 140];
console.log(findLongestUptrend(stockPrices));
// 最長上昇トレンドとその期間を分析

// 効率的なO(n log n)実装（二分探索使用）
function lisOptimized(arr) {
    const n = arr.length;
    if (n === 0) return { length: 0 };
    
    const tails = []; // tails[i] = 長さi+1のLISの末尾の最小値
    
    for (const num of arr) {
        // 二分探索でnumを挿入する位置を見つける
        let left = 0, right = tails.length;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // 位置leftにnumを配置
        tails[left] = num;
    }
    
    return { length: tails.length };
}

console.log(lisOptimized([10, 22, 9, 33, 21, 50, 41, 60]));
// { length: 5 } - O(n log n)で高速計算`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
						<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
							🎯 アルゴリズムの特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									動的計画法の特性
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 一次元DPテーブルによる効率的計算</li>
									<li>• 部分列 ≠ 部分配列（連続不要）</li>
									<li>• O(n²)で全探索O(2^n)より大幅高速</li>
									<li>• predecessorリンクで実際のLIS構築</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									実世界での応用
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 株価分析・最長上昇トレンド発見</li>
									<li>• データの時系列分析</li>
									<li>• ソートアルゴリズムの効率性測定</li>
									<li>• ゲームのスコア分析</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
							<p className="text-sm text-green-800 dark:text-green-200">
								💡 <strong>学習ポイント:</strong>{" "}
								LISは一次元動的計画法の代表例で、
								貪欲法では解けない最適化問題を効率的に解く重要なアルゴリズムです。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
