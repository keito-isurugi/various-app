/**
 * src/app/algorithms/subset-sum-dp/page.tsx
 *
 * 部分和問題（動的計画法版）アルゴリズムの解説ページ
 * 二次元DPテーブルによる効率的な解法とテーブル構築の可視化を提供
 */

"use client";

import {
	BookOpen,
	CheckCircle,
	Code,
	Lightbulb,
	Search,
	Settings,
	Target,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { subsetSumDpExplanation } from "../../../data/explanations/subset-sum-dp-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { SubsetSumDPAlgorithm } from "../../../utils/algorithms/subset-sum-dp";

/**
 * 部分和問題（動的計画法）学習ページ
 * DPによる効率的な判定とテーブル構築の可視化
 */
export default function SubsetSumDPPage() {
	// アルゴリズムインスタンス
	const algorithm = new SubsetSumDPAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("2,3,7,8,10");
	const [customTarget, setCustomTarget] = useState("11");

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
	const setRecommendedValue = useCallback((array: number[], target: number) => {
		setInput({
			array: array,
			target: target,
			parameters: { array, target },
		});
		setCustomArray(array.join(","));
		setCustomTarget(target.toString());
		setResult(null);
	}, []);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			// 配列の解析
			const arrayStr = customArray.trim();
			if (!arrayStr) {
				alert("配列を入力してください");
				return;
			}

			const array = arrayStr.split(",").map((str) => {
				const num = Number.parseInt(str.trim(), 10);
				if (Number.isNaN(num) || num <= 0) {
					throw new Error(`無効な数値: ${str.trim()}`);
				}
				return num;
			});

			if (array.length === 0) {
				alert("最低1つの数値を入力してください");
				return;
			}

			if (array.length > 10) {
				alert("教育目的のため、配列の要素数は10個以下に制限されています");
				return;
			}

			// ターゲットの解析
			const target = Number.parseInt(customTarget.trim(), 10);
			if (Number.isNaN(target) || target <= 0) {
				alert("有効な正の整数をターゲットとして入力してください");
				return;
			}

			if (target > 100) {
				alert("教育目的のため、ターゲットは100以下に制限されています");
				return;
			}

			setInput({
				array: array,
				target: target,
				parameters: { array, target },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customArray, customTarget]);

	// 推奨値を取得
	const recommendedValues = SubsetSumDPAlgorithm.getRecommendedValues();

	// 現在の配列とターゲット
	const currentArray = input.array || [];
	const currentTarget = input.target || 0;

	// DPテーブルサイズを計算
	const dpTableSize = SubsetSumDPAlgorithm.calculateTableSize(
		currentArray.length,
		currentTarget,
	);

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
							部分和問題（動的計画法）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
						部分和問題（動的計画法）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						二次元DPテーブルで部分集合の存在を効率的に判定しよう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(n×S)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								O(n×S)
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
								2次元DP
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
								<Settings className="w-5 h-5" />
								実行設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										配列:
									</span>
									<div className="font-mono text-sm text-purple-600 dark:text-purple-400 mt-1">
										[{currentArray.join(", ")}]
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										ターゲット:
									</span>
									<div className="font-mono text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">
										{currentTarget}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										DPテーブルサイズ:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{dpTableSize.rows} × {dpTableSize.cols} ={" "}
										{dpTableSize.total} セル
									</div>
								</div>
								<div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-800 dark:text-green-200">
									<CheckCircle className="w-3 h-3 inline" />{" "}
									DPにより効率的に部分集合の存在を判定
								</div>
							</div>

							{/* カスタム入力 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="custom-array"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										配列（カンマ区切り、10要素以下）
									</label>
									<input
										id="custom-array"
										type="text"
										value={customArray}
										onChange={(e) => setCustomArray(e.target.value)}
										placeholder="2,3,7,8,10"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<div>
									<label
										htmlFor="custom-target"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										ターゲット（1以上100以下）
									</label>
									<input
										id="custom-target"
										type="number"
										min="1"
										max="100"
										value={customTarget}
										onChange={(e) => setCustomTarget(e.target.value)}
										placeholder="11"
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

							{/* 推奨値ボタン */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
									<BookOpen className="w-4 h-4" />
									推奨値
								</h4>
								<div className="space-y-2">
									{recommendedValues.map((rec) => (
										<button
											key={`${rec.array.join(",")}-${rec.target}`}
											type="button"
											onClick={() => setRecommendedValue(rec.array, rec.target)}
											className={`w-full py-2 px-3 text-xs rounded transition-colors text-left ${
												JSON.stringify(currentArray) ===
													JSON.stringify(rec.array) &&
												currentTarget === rec.target
													? "bg-purple-600 text-white"
													: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											}`}
											title={rec.description}
										>
											<div className="font-semibold">
												[{rec.array.join(",")}] → {rec.target}
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
								disabled={isExecuting || currentArray.length === 0}
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
									isExecuting || currentArray.length === 0
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? (
									"実行中..."
								) : (
									<>
										<Search className="w-4 h-4" />
										部分和判定実行
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
												部分和の存在:
											</span>
											<span
												className={`ml-2 font-mono font-bold ${
													result.result
														? "text-green-600 dark:text-green-400"
														: "text-red-600 dark:text-red-400"
												}`}
											>
												{result.result ? "存在する" : "存在しない"}
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
								<div className="text-6xl mb-4">
									<Search className="w-16 h-16 mx-auto text-purple-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから配列とターゲットを設定し、「部分和判定実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={subsetSumDpExplanation}
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
								<code>{`function subsetSumDP(arr, target) {
    const n = arr.length;
    
    // DPテーブルを初期化
    // dp[i][j] = 配列の最初のi個の要素で和jが作れるかどうか
    const dp = Array(n + 1).fill(null).map(() => 
        Array(target + 1).fill(false)
    );
    
    // ベースケース：空集合の和は0
    for (let i = 0; i <= n; i++) {
        dp[i][0] = true;
    }
    
    // DPテーブルを埋める
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= target; j++) {
            // i番目の要素を含めない場合
            dp[i][j] = dp[i - 1][j];
            
            // i番目の要素を含める場合（可能であれば）
            if (j >= arr[i - 1]) {
                dp[i][j] = dp[i][j] || dp[i - 1][j - arr[i - 1]];
            }
        }
    }
    
    return dp[n][target];
}

// 部分集合を復元する関数
function findSubset(arr, target) {
    const n = arr.length;
    const dp = Array(n + 1).fill(null).map(() => 
        Array(target + 1).fill(false)
    );
    
    // DPテーブルを構築
    for (let i = 0; i <= n; i++) {
        dp[i][0] = true;
    }
    
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= target; j++) {
            dp[i][j] = dp[i - 1][j];
            if (j >= arr[i - 1]) {
                dp[i][j] = dp[i][j] || dp[i - 1][j - arr[i - 1]];
            }
        }
    }
    
    // 部分集合が存在しない場合
    if (!dp[n][target]) {
        return null;
    }
    
    // バックトラックで部分集合を復元
    const subset = [];
    let i = n, j = target;
    
    while (i > 0 && j > 0) {
        // 現在の値が上の行から来ていない場合、要素を含める
        if (dp[i][j] !== dp[i - 1][j]) {
            subset.push(arr[i - 1]);
            j -= arr[i - 1];
        }
        i--;
    }
    
    return subset.reverse();
}

// 使用例
const array = [2, 3, 7, 8, 10];
const target = 11;

console.log(subsetSumDP(array, target)); // true
console.log(findSubset(array, target));  // [3, 8] または [1, 10] など`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
						<h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
							<Target className="w-5 h-5" />
							アルゴリズムの特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
									動的計画法のメリット
								</h4>
								<ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
									<li>• 指数時間の全探索を多項式時間に改善</li>
									<li>• 重複する部分問題を一度だけ解く</li>
									<li>• テーブルから部分集合の復元も可能</li>
									<li>• 理解しやすい二次元DP構造</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
									実用的な応用例
								</h4>
								<ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
									<li>• ナップサック問題の基礎</li>
									<li>• 分割問題（配列を等しい和に分割）</li>
									<li>• 硬貨の組み合わせ問題</li>
									<li>• リソース配分の最適化</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
							<p className="text-sm text-blue-800 dark:text-blue-200">
								<Lightbulb className="w-3 h-3 inline" />{" "}
								<strong>ポイント:</strong>{" "}
								部分和問題は動的計画法の入門として最適で、
								より複雑なDP問題への基礎となります。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
