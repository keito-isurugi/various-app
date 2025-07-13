/**
 * src/app/algorithms/sieve-eratosthenes/page.tsx
 *
 * エラトステネスの篩アルゴリズムの解説ページ
 * 古代ギリシャから続く素数列挙の古典的アルゴリズムの学習と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { sieveEratosthenesExplanation } from "../../../data/explanations/sieve-eratosthenes-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { SieveEratosthenesAlgorithm } from "../../../utils/algorithms/sieve-eratosthenes";

/**
 * エラトステネスの篩学習ページ
 * 古典的な素数列挙アルゴリズムの理解と可視化
 */
export default function SieveEratosthenesPage() {
	// アルゴリズムインスタンス
	const algorithm = new SieveEratosthenesAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [inputLimit, setInputLimit] = useState(30);

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
	const setRecommendedInput = useCallback((limit: number) => {
		setInput({
			parameters: { limit },
		});
		setInputLimit(limit);
		setResult(null);
	}, []);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			if (!inputLimit || inputLimit < 2) {
				alert("上限値は2以上の整数を入力してください");
				return;
			}

			if (!Number.isInteger(inputLimit)) {
				alert("上限値は整数である必要があります");
				return;
			}

			if (inputLimit > 1000) {
				alert("上限値は1000以下に設定してください");
				return;
			}

			setInput({
				parameters: { limit: inputLimit },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [inputLimit]);

	// 推奨入力例を取得
	const recommendedInputs = SieveEratosthenesAlgorithm.getRecommendedInputs();

	// 現在の上限値
	const currentLimit = (input.parameters?.limit as number) || 30;

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
							エラトステネスの篩
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
						エラトステネスの篩
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						古代ギリシャから続く素数列挙の古典的アルゴリズム。2000年前の知恵が現代技術を支える
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(n log log n)
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
								初中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								古典篩
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								紀元前3世紀
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								📝 範囲設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										素数探索範囲:
									</span>
									<div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
										2 ～ {currentLimit}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										候補数:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										{currentLimit - 1} 個の数
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										処理範囲:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										√{currentLimit} ≈ {Math.sqrt(currentLimit).toFixed(1)} まで
									</div>
								</div>
								<div className="mt-2 p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded text-xs text-emerald-800 dark:text-emerald-200">
									🎯 篩：小さい素数の倍数を系統的に除外
								</div>
							</div>

							{/* 入力フォーム */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="input-limit"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										上限値
									</label>
									<input
										id="input-limit"
										type="number"
										value={inputLimit}
										onChange={(e) =>
											setInputLimit(Number.parseInt(e.target.value) || 2)
										}
										min={2}
										max={1000}
										step={1}
										placeholder="30"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
									/>
									<div className="text-xs text-gray-500 mt-1">2-1000の整数</div>
								</div>

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
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
											key={rec.limit}
											type="button"
											onClick={() => setRecommendedInput(rec.limit)}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={`期待される素数数: ${rec.expectedPrimeCount}個`}
										>
											<div className="font-semibold">上限: {rec.limit}</div>
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
										: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "計算中..." : "🧮 篩実行開始"}
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
												発見した素数:
											</span>
											<span className="ml-2 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">
												{(result.result as number[]).length}個
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												素数一覧:
											</span>
											<div className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border text-xs font-mono max-h-20 overflow-y-auto">
												{(result.result as number[]).join(", ")}
											</div>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												最大素数:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{
													(result.result as number[])[
														(result.result as number[]).length - 1
													]
												}
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
												素数密度:
											</span>
											<span className="ml-2 font-mono font-bold text-blue-600 dark:text-blue-400">
												{(
													((result.result as number[]).length / currentLimit) *
													100
												).toFixed(1)}
												%
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
									素数を篩で見つけてください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルから範囲を設定し、「篩実行開始」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={sieveEratosthenesExplanation}
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
								<code>{`// エラトステネスの篩で素数を列挙する
function sieveOfEratosthenes(limit) {
    if (limit < 2) return [];
    
    // 篩を初期化（全て素数候補として設定）
    const isPrime = Array(limit + 1).fill(true);
    isPrime[0] = isPrime[1] = false; // 0と1は素数ではない
    
    // 篩を実行
    for (let i = 2; i * i <= limit; i++) {
        if (isPrime[i]) {
            // iが素数なら、その倍数を除外
            for (let j = i * i; j <= limit; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    // 素数を収集
    const primes = [];
    for (let i = 2; i <= limit; i++) {
        if (isPrime[i]) {
            primes.push(i);
        }
    }
    
    return primes;
}

// 使用例
console.log(sieveOfEratosthenes(30));
// [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

console.log(sieveOfEratosthenes(100));
// [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]

// 素数密度の分析
function analyzePrimeDensity(limit) {
    const primes = sieveOfEratosthenes(limit);
    const density = (primes.length / limit) * 100;
    
    return {
        count: primes.length,
        density: density.toFixed(2) + "%",
        largest: primes[primes.length - 1],
        averageGap: primes.length > 1 ? 
            (primes[primes.length - 1] - primes[0]) / (primes.length - 1) : 0
    };
}

console.log(analyzePrimeDensity(100));
// { count: 25, density: "25.00%", largest: 97, averageGap: 3.96 }

console.log(analyzePrimeDensity(1000));
// { count: 168, density: "16.80%", largest: 997, averageGap: 5.95 }

// 最適化版（ビット配列使用）
function optimizedSieve(limit) {
    if (limit < 2) return [];
    
    // ビット配列的なアプローチ（偶数を除外）
    const oddLimit = Math.floor((limit - 1) / 2);
    const isPrime = Array(oddLimit + 1).fill(true);
    
    for (let i = 1; i * (2 * i + 1) <= oddLimit; i++) {
        if (isPrime[i]) {
            const prime = 2 * i + 1;
            for (let j = prime * prime; j <= limit; j += 2 * prime) {
                isPrime[Math.floor((j - 1) / 2)] = false;
            }
        }
    }
    
    const primes = [2]; // 2を追加
    for (let i = 1; i <= oddLimit; i++) {
        if (isPrime[i]) {
            primes.push(2 * i + 1);
        }
    }
    
    return primes;
}

// 区間篩（大きな範囲対応）
function segmentedSieve(low, high) {
    const simplePrimes = sieveOfEratosthenes(Math.sqrt(high));
    const isPrime = Array(high - low + 1).fill(true);
    
    for (const prime of simplePrimes) {
        let start = Math.max(prime * prime, Math.ceil(low / prime) * prime);
        for (let j = start; j <= high; j += prime) {
            isPrime[j - low] = false;
        }
    }
    
    const primes = [];
    for (let i = 0; i < isPrime.length; i++) {
        const num = low + i;
        if (num >= 2 && isPrime[i]) {
            primes.push(num);
        }
    }
    
    return primes;
}

// 大きな範囲の素数を効率的に列挙
console.log(segmentedSieve(1000000, 1000100));
// 1,000,000から1,000,100の範囲の素数

// パフォーマンス比較
function compareMethods(limit) {
    console.time('標準篩');
    const result1 = sieveOfEratosthenes(limit);
    console.timeEnd('標準篩');
    
    console.time('最適化篩');
    const result2 = optimizedSieve(limit);
    console.timeEnd('最適化篩');
    
    console.log(\`素数数: \${result1.length} (一致: \${result1.length === result2.length})\`);
}

compareMethods(100000); // パフォーマンス比較実行`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
						<h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
							🎯 アルゴリズムの特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
									古典アルゴリズムの特性
								</h4>
								<ul className="space-y-2 text-emerald-700 dark:text-emerald-300 text-sm">
									<li>• 紀元前3世紀から変わらぬ効率性</li>
									<li>• O(n log log n)の優秀な時間計算量</li>
									<li>• 系統的除外による確実な素数判定</li>
									<li>• √nまでの処理で全素数を列挙</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
									現代での応用
								</h4>
								<ul className="space-y-2 text-emerald-700 dark:text-emerald-300 text-sm">
									<li>• RSA暗号での大きな素数生成</li>
									<li>• 競技プログラミングの前処理</li>
									<li>• 数論研究での基礎計算</li>
									<li>• 分散システムでのハッシュ関数</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
							<p className="text-sm text-amber-800 dark:text-amber-200">
								💡 <strong>学習ポイント:</strong>{" "}
								エラトステネスの篩は、古代の知恵が現代技術を支える美しい例として、
								アルゴリズムの時代を超えた価値を示しています。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
