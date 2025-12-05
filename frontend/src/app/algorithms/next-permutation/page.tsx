/**
 * src/app/algorithms/next-permutation/page.tsx
 *
 * next_permutation（順列全列挙）アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import {
	BarChart3,
	BookOpen,
	Code,
	Lightbulb,
	Play,
	RefreshCw,
	Settings,
	Target,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { nextPermutationExplanation } from "../../../data/explanations/next-permutation-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { NextPermutationAlgorithm } from "../../../utils/algorithms/next-permutation";

/**
 * next_permutation学習ページ
 * 辞書順での順列生成の原理を可視化で理解
 */
export default function NextPermutationPage() {
	// アルゴリズムインスタンス
	const algorithm = new NextPermutationAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("");
	const [customK, setCustomK] = useState("");

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
	 * 次の順列の入力を設定
	 */
	const setNextPermutationOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);

			setInput({
				parameters: {
					operation: "nextPermutation",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * 全順列の入力を設定
	 */
	const setAllPermutationsOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);

			if (array.length > 4) {
				alert("全順列生成は4要素以下でのみ実行できます（処理時間のため）");
				return;
			}

			setInput({
				parameters: {
					operation: "allPermutations",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * 順列ランクの入力を設定
	 */
	const setPermutationRankOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);

			setInput({
				parameters: {
					operation: "permutationRank",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * k番目の順列の入力を設定
	 */
	const setKthPermutationOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);
			const k = Number(customK);

			if (Number.isNaN(k) || k < 0) {
				alert("kには0以上の整数を入力してください");
				return;
			}

			setInput({
				parameters: {
					operation: "kthPermutation",
					array: array,
					k: k,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, customK, parseArray]);

	/**
	 * 順列サイクルの入力を設定
	 */
	const setPermutationCycleOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);

			setInput({
				parameters: {
					operation: "permutationCycle",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * 辞書順比較の入力を設定
	 */
	const setLexicographicOperation = useCallback(() => {
		try {
			const array = parseArray(customArray);

			setInput({
				parameters: {
					operation: "lexicographic",
					array: array,
				},
			});
			setResult(null);
		} catch (error) {
			alert(error instanceof Error ? error.message : "入力エラー");
		}
	}, [customArray, parseArray]);

	/**
	 * 推奨操作の適用
	 */
	const applyRecommendedOperation = useCallback((rec: any) => {
		setInput({
			parameters: {
				operation: rec.operation,
				array: rec.array,
				k: rec.k,
			},
		});

		// カスタム入力フィールドも更新
		if (rec.array) setCustomArray(rec.array.join(", "));
		if (rec.k !== undefined) setCustomK(rec.k.toString());

		setResult(null);
	}, []);

	// 推奨操作リスト
	const recommendedOperations =
		NextPermutationAlgorithm.getRecommendedOperations();

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
							next_permutation
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
						next_permutation（順列全列挙）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						辞書順で次の順列を効率的に生成する標準的なアルゴリズムを学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
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
								中級
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
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
								<Settings className="w-5 h-5" />
								実行設定
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
								{input.parameters?.k !== undefined && (
									<div className="mb-2">
										<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
											k:
										</span>
										<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
											{input.parameters.k}
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
										placeholder="1, 2, 3, 4"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<div>
									<label
										htmlFor="custom-k"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										k番目（k番目の順列用）
									</label>
									<input
										id="custom-k"
										type="number"
										value={customK}
										onChange={(e) => setCustomK(e.target.value)}
										placeholder="0"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
							</div>

							{/* 操作選択ボタン */}
							<div className="space-y-2 mb-6">
								<button
									type="button"
									onClick={setNextPermutationOperation}
									className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
								>
									<Play className="w-4 h-4" />
									次の順列
								</button>
								<button
									type="button"
									onClick={setAllPermutationsOperation}
									className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
								>
									<RefreshCw className="w-4 h-4" />
									全順列生成
								</button>
								<button
									type="button"
									onClick={setPermutationRankOperation}
									className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
								>
									<BarChart3 className="w-4 h-4" />
									順列ランク
								</button>
								<button
									type="button"
									onClick={setKthPermutationOperation}
									className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
								>
									<Target className="w-4 h-4" />
									k番目の順列
								</button>
								<button
									type="button"
									onClick={setPermutationCycleOperation}
									className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm"
								>
									 順列サイクル
								</button>
								<button
									type="button"
									onClick={setLexicographicOperation}
									className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm"
								>
									<BookOpen className="w-4 h-4" />
									辞書順比較
								</button>
							</div>

							{/* 推奨操作 */}
							<div className="mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									<Lightbulb className="w-3 h-3 inline" /> 推奨操作
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
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
									isExecuting
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? (
									"実行中..."
								) : (
									<>
										<Play className="w-4 h-4" />
										アルゴリズム実行
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
													? `${JSON.stringify(result.result, null, 2).substring(
															0,
															100,
														)}...`
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
								<div className="text-6xl mb-4">
									<RefreshCw className="w-16 h-16 mx-auto text-purple-500" />
								</div>
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
						explanationData={nextPermutationExplanation}
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
								<code>{`// next_permutation の実装
function nextPermutation(arr) {
    const n = arr.length;
    if (n <= 1) return false;
    
    // ステップ1: 右から最初の昇順位置（ピボット）を見つける
    let i = n - 2;
    while (i >= 0 && arr[i] >= arr[i + 1]) {
        i--;
    }
    
    // 最後の順列（降順）の場合
    if (i < 0) {
        arr.reverse(); // 最初の順列に戻す
        return false;
    }
    
    // ステップ2: ピボットより大きい最小の要素を見つける
    let j = n - 1;
    while (arr[j] <= arr[i]) {
        j--;
    }
    
    // ステップ3: ピボットと交換相手を交換
    [arr[i], arr[j]] = [arr[j], arr[i]];
    
    // ステップ4: ピボット以降を昇順に並び替え（反転）
    reverse(arr, i + 1, n - 1);
    
    return true;
}

function reverse(arr, left, right) {
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
}

// 全順列の生成
function allPermutations(arr) {
    const result = [];
    const copy = [...arr].sort((a, b) => a - b); // 昇順に並び替え
    
    do {
        result.push([...copy]);
    } while (nextPermutation(copy));
    
    return result;
}

// k番目の順列を直接計算
function kthPermutation(n, k) {
    const result = [];
    const nums = Array.from({length: n}, (_, i) => i + 1);
    const factorial = [1];
    
    // 階乗を事前計算
    for (let i = 1; i < n; i++) {
        factorial[i] = factorial[i - 1] * i;
    }
    
    k--; // 0-indexed に変換
    
    for (let i = n; i > 0; i--) {
        const index = Math.floor(k / factorial[i - 1]);
        result.push(nums[index]);
        nums.splice(index, 1);
        k %= factorial[i - 1];
    }
    
    return result;
}

// 使用例
const arr = [1, 2, 3];
console.log("初期:", arr);

while (nextPermutation(arr)) {
    console.log("次の順列:", [...arr]);
}

console.log(allPermutations([1, 2, 3]));
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]

console.log(kthPermutation(4, 9)); // [2, 3, 1, 4]`}</code>
							</pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
