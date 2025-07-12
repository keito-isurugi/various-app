/**
 * src/app/algorithms/gcd-euclidean/page.tsx
 *
 * 最大公約数（ユークリッドの互除法）アルゴリズムの解説ページ
 * 二つの整数の最大公約数を効率的に求める古典的なアルゴリズムの学習と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { GcdEuclideanAlgorithm } from "../../../utils/algorithms/gcd-euclidean";

/**
 * 最大公約数（ユークリッドの互除法）学習ページ
 * 古典的なアルゴリズムの理解と可視化
 */
export default function GcdEuclideanPage() {
	// アルゴリズムインスタンス
	const algorithm = new GcdEuclideanAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [inputA, setInputA] = useState("48");
	const [inputB, setInputB] = useState("18");

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

			if (a === 0 && b === 0) {
				alert("両方の数値を0にすることはできません");
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
	const recommendedInputs = GcdEuclideanAlgorithm.getRecommendedInputs();

	// 現在の入力値
	const currentA = input.parameters?.a || 48;
	const currentB = input.parameters?.b || 18;

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
							最大公約数（ユークリッドの互除法）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
						最大公約数（ユークリッドの互除法）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						紀元前300年から続く古典的なアルゴリズムで二つの整数の最大公約数を効率的に求めよう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
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
								紀元前300年
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								歴史
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								🔢 入力設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										計算対象:
									</span>
									<div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
										gcd({currentA}, {currentB})
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										アルゴリズム:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										ユークリッドの互除法
									</div>
								</div>
								<div className="mt-2 p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded text-xs text-emerald-800 dark:text-emerald-200">
									📐 原理: gcd(a, b) = gcd(b, a mod b)
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
										min="0"
										placeholder="48"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
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
										min="0"
										placeholder="18"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
									/>
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
									{recommendedInputs.map((rec, index) => (
										<button
											key={`${rec.a}-${rec.b}`}
											type="button"
											onClick={() => setRecommendedInput(rec.a, rec.b)}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={`期待される結果: ${rec.expectedGcd}`}
										>
											<div className="font-semibold">
												gcd({rec.a}, {rec.b})
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
										: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "計算中..." : "🧮 GCD計算実行"}
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
												最大公約数:
											</span>
											<span className="ml-2 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">
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
								<div className="text-6xl mb-4">🧮</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									最大公約数を計算してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルから数値を設定し、「GCD計算実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
							📖 ユークリッドの互除法について
						</h3>
						<div className="prose dark:prose-invert max-w-none">
							<pre className="whitespace-pre-wrap text-sm leading-relaxed">
								{algorithm.getExplanation()}
							</pre>
						</div>
					</div>
				</section>

				{/* コード例セクション */}
				<section className="mt-12">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
							💻 実装例（JavaScript）
						</h3>
						<div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
							<pre className="text-sm text-gray-100">
								<code>{`// ユークリッドの互除法による最大公約数の計算
function gcd(a, b) {
    // 特殊ケース: 片方が0の場合
    if (b === 0) {
        return a;
    }
    
    // 負数の場合は絶対値を取る
    a = Math.abs(a);
    b = Math.abs(b);
    
    // より大きい数を最初に配置
    if (a < b) {
        [a, b] = [b, a];
    }
    
    // ユークリッドの互除法の実行
    while (b !== 0) {
        const remainder = a % b;
        console.log(\`\${a} ÷ \${b} = \${Math.floor(a / b)} あまり \${remainder}\`);
        
        // gcd(a, b) = gcd(b, a % b)
        a = b;
        b = remainder;
    }
    
    return a;
}

// 再帰版の実装
function gcdRecursive(a, b) {
    // ベースケース
    if (b === 0) {
        return a;
    }
    
    // 再帰的に呼び出し
    return gcdRecursive(b, a % b);
}

// 最小公倍数（LCM）も計算可能
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

// 使用例
console.log(gcd(48, 18));        // 6
console.log(gcd(17, 13));        // 1 (互いに素)
console.log(gcd(100, 25));       // 25
console.log(gcdRecursive(1071, 462)); // 21

// 最小公倍数の例
console.log(lcm(12, 8));         // 24

// 複数の数の最大公約数
function gcdMultiple(...numbers) {
    return numbers.reduce((acc, num) => gcd(acc, num));
}

console.log(gcdMultiple(12, 18, 24)); // 6`}</code>
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
									歴史的価値
								</h4>
								<ul className="space-y-2 text-emerald-700 dark:text-emerald-300 text-sm">
									<li>• 紀元前300年頃に考案された最古のアルゴリズム</li>
									<li>• ユークリッド「原論」第7巻に記載</li>
									<li>• 2000年以上経った現在も最効率の手法</li>
									<li>• 数学の基礎を築いた重要な発見</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
									現代での応用
								</h4>
								<ul className="space-y-2 text-emerald-700 dark:text-emerald-300 text-sm">
									<li>• RSA暗号の鍵生成アルゴリズム</li>
									<li>• 分数の約分・通分計算</li>
									<li>• コンピュータグラフィックスの比率計算</li>
									<li>• 音楽理論での和音周期の分析</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
							<p className="text-sm text-blue-800 dark:text-blue-200">
								💡 <strong>学習ポイント:</strong>{" "}
								古典的なアルゴリズムでありながら、現代のコンピュータサイエンスや暗号学でも重要な役割を果たしています。
								効率的な問題解決の思考法を学ぶ絶好の例です。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
