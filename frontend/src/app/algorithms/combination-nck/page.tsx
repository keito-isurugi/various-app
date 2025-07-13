/**
 * src/app/algorithms/combination-nck/page.tsx
 *
 * nCk組み合わせ計算アルゴリズムの解説ページ
 * 数学的基礎から効率的実装まで複数手法の学習と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { combinationNCkExplanation } from "../../../data/explanations/combination-nck-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { CombinationNCkAlgorithm } from "../../../utils/algorithms/combination-nck";

/**
 * 計算方法の種類を定義
 */
type CombinationMethod = "factorial" | "optimized" | "pascal" | "iterative";

/**
 * nCk組み合わせ計算学習ページ
 * 複数の計算手法による組み合わせ数学の理解と可視化
 */
export default function CombinationNCkPage() {
	// アルゴリズムインスタンス
	const algorithm = new CombinationNCkAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [inputN, setInputN] = useState(5);
	const [inputK, setInputK] = useState(2);
	const [method, setMethod] = useState<CombinationMethod>("optimized");

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
		(n: number, k: number, selectedMethod: CombinationMethod) => {
			setInput({
				parameters: {
					n,
					k,
					method: selectedMethod,
				},
			});
			setInputN(n);
			setInputK(k);
			setMethod(selectedMethod);
			setResult(null);
		},
		[],
	);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			// 入力値の検証
			if (!Number.isInteger(inputN) || !Number.isInteger(inputK)) {
				alert("nとkは整数である必要があります");
				return;
			}

			if (inputN < 0 || inputK < 0) {
				alert("nとkは非負整数である必要があります");
				return;
			}

			if (inputK > inputN) {
				alert("kはn以下である必要があります");
				return;
			}

			if (inputN > 20) {
				alert("教育目的のため、nは20以下に制限されています");
				return;
			}

			// 階乗方法での追加制限
			if (method === "factorial" && inputN > 15) {
				alert("階乗方法では、nは15以下に制限されています");
				return;
			}

			setInput({
				parameters: {
					n: inputN,
					k: inputK,
					method: method,
				},
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [inputN, inputK, method]);

	// 推奨入力例を取得
	const recommendedInputs = CombinationNCkAlgorithm.getRecommendedInputs();

	// 現在のパラメータ
	const currentN = (input.parameters?.n as number) || 5;
	const currentK = (input.parameters?.k as number) || 2;
	const currentMethod =
		(input.parameters?.method as CombinationMethod) || "optimized";

	/**
	 * 計算方法の説明を取得
	 */
	const getMethodDescription = (methodType: CombinationMethod): string => {
		const descriptions = {
			factorial: "階乗による直接計算",
			optimized: "最適化された効率的計算",
			pascal: "パスカルの三角形（動的計画法）",
			iterative: "逐次計算（安全版）",
		};
		return descriptions[methodType] || "組み合わせ計算";
	};

	/**
	 * 計算式を表示
	 */
	const getCalculationFormula = (): string => {
		return `C(${currentN},${currentK})`;
	};

	/**
	 * 効率性分析を表示
	 */
	const getEfficiencyAnalysis = () => {
		const minK = Math.min(currentK, currentN - currentK);
		switch (currentMethod) {
			case "factorial":
				return {
					method: "階乗計算",
					operations: `${currentN + currentK + (currentN - currentK)}回の乗算`,
					complexity: `O(${currentN})`,
				};
			case "optimized":
			case "iterative":
				return {
					method: "最適化計算",
					operations: `${minK}回の演算`,
					complexity: `O(${minK})`,
				};
			case "pascal":
				return {
					method: "動的計画法",
					operations: `${currentN * minK}回の加算`,
					complexity: `O(${currentN}×${minK})`,
				};
			default:
				return {
					method: "組み合わせ計算",
					operations: "効率的な演算",
					complexity: "O(min(k,n-k))",
				};
		}
	};

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
							nCk組み合わせ計算
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent mb-4">
						nCk組み合わせ計算
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						数学的基礎から効率的実装まで。確率論と統計学を支える組み合わせ数学の核心
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(min(k,n-k))
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
								初中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								数学・確率
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								応用分野
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								🧮 組み合わせ計算設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										計算式:
									</span>
									<div className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
										{getCalculationFormula()}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										計算方法:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										{getMethodDescription(currentMethod)}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										効率性:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										{getEfficiencyAnalysis().operations} (
										{getEfficiencyAnalysis().complexity})
									</div>
								</div>
								<div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-200">
									🎯 組み合わせ: n個からk個を選ぶ場合の数
								</div>
							</div>

							{/* 計算方法選択 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="method-select"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										計算方法
									</label>
									<select
										id="method-select"
										value={method}
										onChange={(e) =>
											setMethod(e.target.value as CombinationMethod)
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="optimized">最適化計算</option>
										<option value="factorial">階乗による計算</option>
										<option value="pascal">パスカルの三角形</option>
										<option value="iterative">逐次計算</option>
									</select>
								</div>

								{/* パラメータ入力 */}
								<div>
									<label
										htmlFor="input-n"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										n（全体の要素数）
									</label>
									<input
										id="input-n"
										type="number"
										value={inputN}
										onChange={(e) =>
											setInputN(Number.parseInt(e.target.value) || 0)
										}
										min={0}
										max={method === "factorial" ? 15 : 20}
										step={1}
										placeholder="5"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
									/>
									<div className="text-xs text-gray-500 mt-1">
										{method === "factorial" ? "0-15の整数" : "0-20の整数"}
									</div>
								</div>

								<div>
									<label
										htmlFor="input-k"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										k（選択する要素数）
									</label>
									<input
										id="input-k"
										type="number"
										value={inputK}
										onChange={(e) =>
											setInputK(Number.parseInt(e.target.value) || 0)
										}
										min={0}
										max={inputN}
										step={1}
										placeholder="2"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
									/>
									<div className="text-xs text-gray-500 mt-1">0-nの整数</div>
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
									{recommendedInputs.map((rec, index) => (
										<button
											key={`${rec.n}-${rec.k}-${rec.method}-${index}`}
											type="button"
											onClick={() =>
												setRecommendedInput(rec.n, rec.k, rec.method)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={`期待結果: ${rec.expectedResult}`}
										>
											<div className="font-semibold">{rec.description}</div>
											<div className="text-xs opacity-75">
												C({rec.n},{rec.k}) = {rec.expectedResult}
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
										: "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "計算中..." : "🧮 nCk組み合わせ計算実行"}
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
												結果:
											</span>
											<span className="ml-2 font-mono font-bold text-blue-600 dark:text-blue-400 text-lg">
												{result.result}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												計算方法:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{getMethodDescription(currentMethod)}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												計算量:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{result.timeComplexity}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												実行ステップ:
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
								<div className="text-6xl mb-4">🧮</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									nCk組み合わせ計算を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルからパラメータを設定し、「nCk組み合わせ計算実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={combinationNCkExplanation}
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
								<code>{`// 最適化されたnCk組み合わせ計算
function combinationOptimized(n, k) {
    // 対称性を利用した効率化
    if (k > n - k) k = n - k;
    
    if (k === 0) return 1;
    if (k === 1) return n;
    
    let result = 1;
    for (let i = 0; i < k; i++) {
        result = (result * (n - i)) / (i + 1);
    }
    return result;
}

// 階乗による基本計算
function combinationFactorial(n, k) {
    if (k > n || k < 0) return 0;
    
    function factorial(num) {
        if (num <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        return result;
    }
    
    return factorial(n) / (factorial(k) * factorial(n - k));
}

// パスカルの三角形による動的計画法
function combinationPascal(n, k) {
    if (k > n - k) k = n - k;  // 効率化
    
    let prev = new Array(k + 1).fill(0);
    let curr = new Array(k + 1).fill(0);
    
    prev[0] = 1;
    
    for (let i = 1; i <= n; i++) {
        curr[0] = 1;
        for (let j = 1; j <= Math.min(i, k); j++) {
            curr[j] = prev[j - 1] + (prev[j] || 0);
        }
        [prev, curr] = [curr, prev];
        curr.fill(0);
    }
    
    return prev[k];
}

// 安全な逐次計算
function combinationSafe(n, k) {
    if (k === 0 || k === n) return 1;
    if (k > n - k) k = n - k;  // 効率化
    
    let result = 1;
    for (let i = 0; i < k; i++) {
        // 乗算と除算を適切な順序で実行
        result = Math.floor((result * (n - i)) / (i + 1));
    }
    return result;
}

// 使用例
console.log(combinationOptimized(5, 2));    // 10
console.log(combinationFactorial(6, 3));    // 20
console.log(combinationPascal(8, 2));       // 28
console.log(combinationSafe(10, 5));        // 252

// 効率性の比較
function compareMethodsEfficiency(n, k) {
    console.log(\`C(\${n},\${k})の計算方法比較:\`);
    
    // 最適化法
    console.time('最適化法');
    const optimized = combinationOptimized(n, k);
    console.timeEnd('最適化法');
    
    // 階乗法（小さなnのみ）
    if (n <= 15) {
        console.time('階乗法');
        const factorial = combinationFactorial(n, k);
        console.timeEnd('階乗法');
    }
    
    // パスカル法
    console.time('パスカル法');
    const pascal = combinationPascal(n, k);
    console.timeEnd('パスカル法');
    
    console.log(\`結果: \${optimized}\`);
    console.log(\`計算量: O(min(\${k}, \${n-k}))\`);
}

compareMethodsEfficiency(15, 7);

// 実用的な応用例
class CombinationCalculator {
    // メモ化による高速化
    constructor() {
        this.memo = new Map();
    }
    
    calculate(n, k) {
        const key = \`\${n},\${k}\`;
        if (this.memo.has(key)) {
            return this.memo.get(key);
        }
        
        const result = combinationOptimized(n, k);
        this.memo.set(key, result);
        return result;
    }
    
    // 確率計算への応用
    probabilityOfExact(n, k, p) {
        // 二項分布: P(X = k) = C(n,k) * p^k * (1-p)^(n-k)
        const combination = this.calculate(n, k);
        return combination * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }
    
    // サンプリング計算
    samplingCombinations(population, sampleSize) {
        return this.calculate(population, sampleSize);
    }
}

// 電卓インスタンス
const calc = new CombinationCalculator();

// 確率論での使用例
console.log('10回コイン投げで5回表が出る確率:');
console.log(calc.probabilityOfExact(10, 5, 0.5));  // ≈ 0.246

// サンプリングでの使用例
console.log('100人から10人のサンプルを選ぶ方法:');
console.log(calc.samplingCombinations(100, 10));   // 4.26×10^13

// 大きな数値での安全な計算
function largeCombinationSafe(n, k) {
    if (k > n - k) k = n - k;
    
    // 対数を使用した数値安定化
    let logResult = 0;
    for (let i = 0; i < k; i++) {
        logResult += Math.log(n - i) - Math.log(i + 1);
    }
    
    return Math.round(Math.exp(logResult));
}

console.log('大きな数値: C(50, 25) ≈', largeCombinationSafe(50, 25));`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
						<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
							🎯 nCk組み合わせ計算の特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									数学的性質
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 対称性：C(n,k) = C(n,n-k)</li>
									<li>• パスカルの恒等式：C(n,k) = C(n-1,k-1) + C(n-1,k)</li>
									<li>• 境界条件：C(n,0) = C(n,n) = 1</li>
									<li>• 二項定理との関係</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									実用的応用
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 確率論：二項分布の計算</li>
									<li>• 統計学：サンプリング理論</li>
									<li>• 組合せ最適化：解空間の大きさ</li>
									<li>• 暗号学：鍵空間の評価</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
							<p className="text-sm text-amber-800 dark:text-amber-200">
								💡 <strong>学習ポイント:</strong>{" "}
								nCk組み合わせ計算は数学とコンピュータサイエンスの基礎として、
								効率的アルゴリズム設計と数値計算の安定性を学ぶ優秀な教材です。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
