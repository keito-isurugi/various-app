/**
 * src/app/algorithms/lcs-dp/page.tsx
 *
 * 最長共通部分列（LCS）アルゴリズムの解説ページ
 * 動的計画法を使って二つの文字列の最長共通部分列を効率的に求めるアルゴリズムの学習と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { lcsDpExplanation } from "../../../data/explanations/lcs-dp-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { LCSDPAlgorithm } from "../../../utils/algorithms/lcs-dp";

/**
 * LCS（最長共通部分列）学習ページ
 * 動的計画法による効率的なLCS計算の理解と可視化
 */
export default function LCSDPPage() {
	// アルゴリズムインスタンス
	const algorithm = new LCSDPAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [inputString1, setInputString1] = useState("ABCDGH");
	const [inputString2, setInputString2] = useState("AEDFHR");

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
	const setRecommendedInput = useCallback(
		(string1: string, string2: string) => {
			setInput({
				parameters: { string1, string2 },
			});
			setInputString1(string1);
			setInputString2(string2);
			setResult(null);
		},
		[],
	);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			const str1 = inputString1.trim();
			const str2 = inputString2.trim();

			if (!str1 && !str2) {
				alert("少なくとも一方の文字列を入力してください");
				return;
			}

			if (str1.length > 10 || str2.length > 10) {
				alert("文字列の長さは10文字以下にしてください");
				return;
			}

			// 英数字のみに制限（教育目的）
			const validPattern = /^[A-Za-z0-9]*$/;
			if (!validPattern.test(str1) || !validPattern.test(str2)) {
				alert("文字列は英数字のみを使用してください");
				return;
			}

			setInput({
				parameters: { string1: str1, string2: str2 },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [inputString1, inputString2]);

	// 推奨入力例を取得
	const recommendedInputs = LCSDPAlgorithm.getRecommendedInputs();

	// 現在の入力値
	const currentString1 = (input.parameters?.string1 as string) || "ABCDGH";
	const currentString2 = (input.parameters?.string2 as string) || "AEDFHR";

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
							最長共通部分列（LCS）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
						最長共通部分列（LCS）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						動的計画法で二つの文字列の最長共通部分列を効率的に求める文字列アルゴリズム
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(m×n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								O(m×n)
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
								文字列DP
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								2次元テーブル
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								📝 文字列入力
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										比較対象:
									</span>
									<div className="font-mono text-lg font-bold text-red-600 dark:text-red-400 mt-1">
										「{currentString1}」
									</div>
									<div className="font-mono text-lg font-bold text-pink-600 dark:text-pink-400">
										「{currentString2}」
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										テーブルサイズ:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										{currentString1.length + 1} × {currentString2.length + 1} ={" "}
										{(currentString1.length + 1) * (currentString2.length + 1)}{" "}
										セル
									</div>
								</div>
								<div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-800 dark:text-red-200">
									🔤 部分列：元の順序を保ったまま文字を抜き出したもの
								</div>
							</div>

							{/* 入力フォーム */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="input-string1"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										文字列1
									</label>
									<input
										id="input-string1"
										type="text"
										value={inputString1}
										onChange={(e) =>
											setInputString1(e.target.value.toUpperCase())
										}
										maxLength={10}
										placeholder="ABCDGH"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
									/>
									<div className="text-xs text-gray-500 mt-1">
										{inputString1.length}/10 文字（英数字のみ）
									</div>
								</div>

								<div>
									<label
										htmlFor="input-string2"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										文字列2
									</label>
									<input
										id="input-string2"
										type="text"
										value={inputString2}
										onChange={(e) =>
											setInputString2(e.target.value.toUpperCase())
										}
										maxLength={10}
										placeholder="AEDFHR"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
									/>
									<div className="text-xs text-gray-500 mt-1">
										{inputString2.length}/10 文字（英数字のみ）
									</div>
								</div>

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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
									{recommendedInputs.map((rec, index) => (
										<button
											key={`${rec.string1}-${rec.string2}`}
											type="button"
											onClick={() =>
												setRecommendedInput(rec.string1, rec.string2)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={`期待される結果: 「${rec.expectedLCS}」(長さ${rec.expectedLength})`}
										>
											<div className="font-semibold">
												「{rec.string1}」 ×「{rec.string2}」
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
										: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "計算中..." : "🧮 LCS計算実行"}
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
												最長共通部分列:
											</span>
											<span className="ml-2 font-mono font-bold text-red-600 dark:text-red-400 text-lg">
												「{result.result}」
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												LCSの長さ:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{(result.result as string).length}
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
									最長共通部分列を計算してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルから文字列を設定し、「LCS計算実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={lcsDpExplanation}
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
								<code>{`// 最長共通部分列（LCS）を動的計画法で求める
function lcs(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    
    // DPテーブルを初期化（0で埋める）
    const dp = Array(m + 1).fill(null)
        .map(() => Array(n + 1).fill(0));
    
    // DPテーブルを構築
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                // 文字が一致：斜め上の値 + 1
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                // 文字が不一致：上または左の最大値
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // バックトラックでLCSを構築
    const lcsArray = [];
    let i = m, j = n;
    
    while (i > 0 && j > 0) {
        if (str1[i - 1] === str2[j - 1]) {
            // 文字が一致：LCSに追加して斜め上に移動
            lcsArray.unshift(str1[i - 1]);
            i--;
            j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            // 上の値が大きい（または同じ）：上に移動
            i--;
        } else {
            // 左の値が大きい：左に移動
            j--;
        }
    }
    
    return {
        length: dp[m][n],
        lcs: lcsArray.join('')
    };
}

// 使用例
console.log(lcs("ABCDGH", "AEDFHR"));    // { length: 3, lcs: "ADH" }
console.log(lcs("AGGTAB", "GXTXAYB"));   // { length: 4, lcs: "GTAB" }
console.log(lcs("ABC", "ABC"));          // { length: 3, lcs: "ABC" }
console.log(lcs("ABC", "DEF"));          // { length: 0, lcs: "" }

// DNA配列解析での応用例
function dnaSequenceAlignment(seq1, seq2) {
    const result = lcs(seq1, seq2);
    const similarity = (result.length / Math.max(seq1.length, seq2.length)) * 100;
    
    return {
        ...result,
        similarity: similarity.toFixed(2) + "%"
    };
}

console.log(dnaSequenceAlignment("ATCGATCG", "ATGCATCG"));
// { length: 7, lcs: "ATCATCG", similarity: "87.50%" }

// 複数文字列のLCS（再帰的適用）
function lcsMultiple(strings) {
    return strings.reduce((acc, str) => lcs(acc, str).lcs);
}`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
						<h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">
							🎯 アルゴリズムの特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">
									動的計画法の特性
								</h4>
								<ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
									<li>• 2次元DPテーブルによる効率的計算</li>
									<li>• 部分列 ≠ 部分文字列（連続不要）</li>
									<li>• O(m×n)で全探索O(2^n)より大幅高速</li>
									<li>• バックトラックで実際の部分列構築</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">
									実世界での応用
								</h4>
								<ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
									<li>• DNAシーケンス解析・遺伝子比較</li>
									<li>• テキストの差分検出（diff, git）</li>
									<li>• バージョン管理システム</li>
									<li>• 文書の類似度判定</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
							<p className="text-sm text-blue-800 dark:text-blue-200">
								💡 <strong>学習ポイント:</strong>{" "}
								LCSは動的計画法と文字列処理の代表的な組み合わせで、
								バイオインフォマティクス分野で特に重要な役割を果たします。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
