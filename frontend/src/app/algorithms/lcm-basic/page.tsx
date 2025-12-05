/**
 * src/app/algorithms/lcm-basic/page.tsx
 *
 * 最小公倍数（LCM）アルゴリズムの解説ページ
 * GCDを利用して二つの整数の最小公倍数を効率的に求めるアルゴリズムの学習と可視化を提供
 */

"use client";

import {
	BookOpen,
	Calculator,
	Code,
	Lightbulb,
	Link2,
	Target,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { lcmBasicExplanation } from "../../../data/explanations/lcm-basic-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { LcmBasicAlgorithm } from "../../../utils/algorithms/lcm-basic";

/**
 * 最小公倍数（LCM）学習ページ
 * GCDを利用した効率的なLCM計算の理解と可視化
 */
export default function LcmBasicPage() {
	// アルゴリズムインスタンス
	const algorithm = new LcmBasicAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [inputA, setInputA] = useState("12");
	const [inputB, setInputB] = useState("8");

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
	const setRecommendedInput = useCallback((a: number, b: number) => {
		setInput({
			parameters: { a, b },
		});
		setInputA(a.toString());
		setInputB(b.toString());
		setResult(null);
	}, []);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			const a = Number.parseInt(inputA.trim(), 10);
			const b = Number.parseInt(inputB.trim(), 10);

			if (Number.isNaN(a) || Number.isNaN(b)) {
				alert("有効な整数を入力してください");
				return;
			}

			if (a < 0 || b < 0) {
				alert("正の整数を入力してください");
				return;
			}

			if (a === 0 || b === 0) {
				alert("0との最小公倍数は定義されません");
				return;
			}

			setInput({
				parameters: { a, b },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [inputA, inputB]);

	// 推奨入力例を取得
	const recommendedInputs = LcmBasicAlgorithm.getRecommendedInputs();

	// 現在の入力値
	const currentA = input.parameters?.a || 12;
	const currentB = input.parameters?.b || 8;

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
							最小公倍数（LCM）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						最小公倍数（LCM）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						GCDを利用して二つの整数の最小公倍数を効率的に求める数学的アルゴリズム
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(log n)
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
							<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
								中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								数学的関係
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								LCM × GCD = a × b
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
								<Calculator className="w-5 h-5" />
								入力設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										計算対象:
									</span>
									<div className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
										lcm({currentA}, {currentB})
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										数学的関係:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										LCM = (a × b) / GCD(a, b)
									</div>
								</div>
								<div className="mt-2 p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded text-xs text-indigo-800 dark:text-indigo-200">
									<Link2 className="w-4 h-4" />
									GCDを利用した効率的な計算
								</div>
							</div>

							{/* 入力フォーム */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="input-a"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										数値 A
									</label>
									<input
										id="input-a"
										type="number"
										value={inputA}
										onChange={(e) => setInputA(e.target.value)}
										min="1"
										placeholder="12"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<div>
									<label
										htmlFor="input-b"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										数値 B
									</label>
									<input
										id="input-b"
										type="number"
										value={inputB}
										onChange={(e) => setInputB(e.target.value)}
										min="1"
										placeholder="8"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
								>
									設定を適用
								</button>
							</div>

							{/* 推奨入力例 */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
									<BookOpen className="w-4 h-4" />
									推奨入力例
								</h4>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{recommendedInputs.map((rec, index) => (
										<button
											key={`${rec.a}-${rec.b}`}
											type="button"
											onClick={() => setRecommendedInput(rec.a, rec.b)}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={`期待される結果: LCM=${rec.expectedLcm}, GCD=${rec.expectedGcd}`}
										>
											<div className="font-semibold">
												lcm({rec.a}, {rec.b})
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
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
									isExecuting
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? (
									"計算中..."
								) : (
									<>
										<Calculator className="w-4 h-4" />
										LCM計算実行
									</>
								)}
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
												最小公倍数:
											</span>
											<span className="ml-2 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-lg">
												{result.result}
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
								<div className="text-6xl mb-4">
									<Calculator className="w-16 h-16 mx-auto text-purple-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									最小公倍数を計算してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルから数値を設定し、「LCM計算実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={lcmBasicExplanation}
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
								<code>{`// 最小公倍数（LCM）を効率的に計算
function gcd(a, b) {
    // ユークリッドの互除法でGCDを計算
    while (b !== 0) {
        const remainder = a % b;
        a = b;
        b = remainder;
    }
    return a;
}

function lcm(a, b) {
    // LCM = |a × b| / GCD(a, b)
    if (a === 0 || b === 0) {
        throw new Error("0との最小公倍数は定義されません");
    }
    
    const absA = Math.abs(a);
    const absB = Math.abs(b);
    const gcdValue = gcd(absA, absB);
    
    return (absA * absB) / gcdValue;
}

// オーバーフロー対策版（大きな数値の場合）
function lcmSafe(a, b) {
    if (a === 0 || b === 0) {
        throw new Error("0との最小公倍数は定義されません");
    }
    
    const absA = Math.abs(a);
    const absB = Math.abs(b);
    const gcdValue = gcd(absA, absB);
    
    // (a / gcd) * b の順序で計算（オーバーフロー対策）
    return (absA / gcdValue) * absB;
}

// 複数の数の最小公倍数
function lcmMultiple(...numbers) {
    return numbers.reduce((acc, num) => lcm(acc, num));
}

// 使用例
console.log(lcm(12, 8));           // 24
console.log(lcm(17, 13));          // 221 (互いに素)
console.log(lcm(6, 4));            // 12
console.log(lcm(15, 25));          // 75
console.log(lcm(7, 21));           // 21 (一方が他方の倍数)

// 複数の数の例
console.log(lcmMultiple(4, 6, 8)); // 24

// 分数の通分での利用例
function addFractions(num1, den1, num2, den2) {
    const commonDenominator = lcm(den1, den2);
    const newNum1 = num1 * (commonDenominator / den1);
    const newNum2 = num2 * (commonDenominator / den2);
    const resultNum = newNum1 + newNum2;
    
    // 約分
    const gcdValue = gcd(resultNum, commonDenominator);
    return {
        numerator: resultNum / gcdValue,
        denominator: commonDenominator / gcdValue
    };
}

console.log(addFractions(1, 4, 1, 6)); // { numerator: 5, denominator: 12 }`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
						<h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
							<Target className="w-5 h-5" />
							最小公倍数の応用と特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
									実世界での応用
								</h4>
								<ul className="space-y-2 text-indigo-700 dark:text-indigo-300 text-sm">
									<li>• 分数の通分・加減算</li>
									<li>• 周期的現象の同期計算</li>
									<li>• タスクスケジューリング</li>
									<li>• 音楽理論（リズムパターン）</li>
									<li>• プログラミング（配列サイズ調整）</li>
									<li>• 信号処理（サンプリング周波数）</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
									数学的性質
								</h4>
								<ul className="space-y-2 text-indigo-700 dark:text-indigo-300 text-sm">
									<li>• LCM(a, b) × GCD(a, b) = a × b</li>
									<li>• LCM(a, b) ≥ max(a, b)</li>
									<li>• LCM(a, 1) = a</li>
									<li>• LCM(a, a) = a</li>
									<li>• 交換法則: LCM(a, b) = LCM(b, a)</li>
									<li>• 結合法則: LCM(a, LCM(b, c)) = LCM(LCM(a, b), c)</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
							<p className="text-sm text-blue-800 dark:text-blue-200">
								<Lightbulb className="w-3 h-3 inline" />{" "}
								<strong>重要な関係:</strong>{" "}
								LCMとGCDは相補的な関係にあり、一方を効率的に計算できれば他方も簡単に求められます。
								この数学的関係を利用することで、複雑な計算を単純化できます。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
