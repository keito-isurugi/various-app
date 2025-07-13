/**
 * src/app/algorithms/exponentiation-by-squaring/page.tsx
 *
 * 繰り返し二乗法アルゴリズムの解説ページ
 * 効率的なべき乗計算の分割統治法アプローチの学習と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { exponentiationBySquaringExplanation } from "../../../data/explanations/exponentiation-by-squaring-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { ExponentiationBySquaringAlgorithm } from "../../../utils/algorithms/exponentiation-by-squaring";

/**
 * 計算モードの種類を定義
 */
type ExponentiationMode = "basic" | "modular";

/**
 * 繰り返し二乗法学習ページ
 * 効率的なべき乗計算アルゴリズムの理解と可視化
 */
export default function ExponentiationBySquaringPage() {
	// アルゴリズムインスタンス
	const algorithm = new ExponentiationBySquaringAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [inputBase, setInputBase] = useState(3);
	const [inputExponent, setInputExponent] = useState(10);
	const [inputModulus, setInputModulus] = useState(1000);
	const [mode, setMode] = useState<ExponentiationMode>("basic");

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
		(
			base: number,
			exponent: number,
			modulus: number | undefined,
			selectedMode: ExponentiationMode,
		) => {
			setInput({
				parameters: {
					base,
					exponent,
					modulus,
					mode: selectedMode,
				},
			});
			setInputBase(base);
			setInputExponent(exponent);
			if (modulus) setInputModulus(modulus);
			setMode(selectedMode);
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
			if (!Number.isInteger(inputBase) || !Number.isInteger(inputExponent)) {
				alert("基数と指数は整数である必要があります");
				return;
			}

			if (inputExponent < 0) {
				alert("指数は非負整数である必要があります");
				return;
			}

			if (inputBase === 0 && inputExponent === 0) {
				alert("0^0は数学的に定義が曖昧です");
				return;
			}

			if (inputExponent > 30) {
				alert("教育目的のため、指数は30以下に制限されています");
				return;
			}

			if (Math.abs(inputBase) > 100) {
				alert("教育目的のため、基数は-100から100の範囲に制限されています");
				return;
			}

			// モジュラー演算の検証
			if (mode === "modular") {
				if (!Number.isInteger(inputModulus) || inputModulus <= 0) {
					alert("モジュラー演算では、法は正の整数である必要があります");
					return;
				}
				if (inputModulus > 1000) {
					alert("教育目的のため、法は1000以下に制限されています");
					return;
				}
			}

			setInput({
				parameters: {
					base: inputBase,
					exponent: inputExponent,
					modulus: mode === "modular" ? inputModulus : undefined,
					mode: mode,
				},
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [inputBase, inputExponent, inputModulus, mode]);

	// 推奨入力例を取得
	const recommendedInputs =
		ExponentiationBySquaringAlgorithm.getRecommendedInputs();

	// 現在のパラメータ
	const currentBase = (input.parameters?.base as number) || 3;
	const currentExponent = (input.parameters?.exponent as number) || 10;
	const currentModulus = (input.parameters?.modulus as number) || undefined;
	const currentMode = (input.parameters?.mode as ExponentiationMode) || "basic";

	/**
	 * 計算式を表示
	 */
	const getCalculationFormula = (): string => {
		if (currentMode === "modular") {
			return `${currentBase}^${currentExponent} mod ${currentModulus}`;
		}
		return `${currentBase}^${currentExponent}`;
	};

	/**
	 * 効率性分析を表示
	 */
	const getEfficiencyAnalysis = () => {
		const analysis =
			ExponentiationBySquaringAlgorithm.analyzeEfficiency(currentExponent);
		return analysis;
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
							繰り返し二乗法
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						繰り返し二乗法
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						分割統治法による効率的なべき乗計算。O(n)からO(log
						n)への劇的な改善を実現する古典アルゴリズム
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
								O(log n)
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
								分割統治
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								アルゴリズム分類
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								⚡ べき乗計算設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										計算式:
									</span>
									<div className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
										{getCalculationFormula()}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										二進表現:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										{currentExponent} = {currentExponent.toString(2)}₂
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										効率性:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										{getEfficiencyAnalysis().naiveMultiplications}回 →{" "}
										{getEfficiencyAnalysis().optimizedMultiplications}回 （約
										{Math.floor(getEfficiencyAnalysis().speedup)}倍高速）
									</div>
								</div>
								<div className="mt-2 p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded text-xs text-indigo-800 dark:text-indigo-200">
									🚀 分割統治法：指数を二進分解して効率化
								</div>
							</div>

							{/* 計算モード選択 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="mode-select"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										計算モード
									</label>
									<select
										id="mode-select"
										value={mode}
										onChange={(e) =>
											setMode(e.target.value as ExponentiationMode)
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="basic">基本べき乗計算</option>
										<option value="modular">モジュラー冪乗計算</option>
									</select>
								</div>

								{/* パラメータ入力 */}
								<div>
									<label
										htmlFor="input-base"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										基数（base）
									</label>
									<input
										id="input-base"
										type="number"
										value={inputBase}
										onChange={(e) =>
											setInputBase(Number.parseInt(e.target.value) || 0)
										}
										min={-100}
										max={100}
										step={1}
										placeholder="3"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
									/>
									<div className="text-xs text-gray-500 mt-1">
										-100から100の整数
									</div>
								</div>

								<div>
									<label
										htmlFor="input-exponent"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										指数（exponent）
									</label>
									<input
										id="input-exponent"
										type="number"
										value={inputExponent}
										onChange={(e) =>
											setInputExponent(Number.parseInt(e.target.value) || 0)
										}
										min={0}
										max={30}
										step={1}
										placeholder="10"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
									/>
									<div className="text-xs text-gray-500 mt-1">0-30の整数</div>
								</div>

								{mode === "modular" && (
									<div>
										<label
											htmlFor="input-modulus"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											法（modulus）
										</label>
										<input
											id="input-modulus"
											type="number"
											value={inputModulus}
											onChange={(e) =>
												setInputModulus(Number.parseInt(e.target.value) || 1)
											}
											min={1}
											max={1000}
											step={1}
											placeholder="1000"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
										<div className="text-xs text-gray-500 mt-1">
											1-1000の整数
										</div>
									</div>
								)}

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
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									📚 推奨入力例
								</h4>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{recommendedInputs.map((rec, index) => (
										<button
											key={`${rec.base}-${rec.exponent}-${rec.modulus}-${rec.mode}-${index}`}
											type="button"
											onClick={() =>
												setRecommendedInput(
													rec.base,
													rec.exponent,
													rec.modulus,
													rec.mode,
												)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={`期待結果: ${rec.expectedResult}`}
										>
											<div className="font-semibold">{rec.description}</div>
											<div className="text-xs opacity-75">
												{rec.mode === "basic" && `${rec.base}^${rec.exponent}`}
												{rec.mode === "modular" &&
													`${rec.base}^${rec.exponent} mod ${rec.modulus}`}
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
										: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "計算中..." : "⚡ 繰り返し二乗法実行"}
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
											<span className="ml-2 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-lg">
												{result.result}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												反復回数:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{result.summary?.iterations || 0}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												効率性:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{result.summary?.efficiency || 0}回の反復
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
								<div className="text-6xl mb-4">⚡</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									繰り返し二乗法を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルからパラメータを設定し、「繰り返し二乗法実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={exponentiationBySquaringExplanation}
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
								<code>{`// 繰り返し二乗法（基本版）
function fastPower(base, exponent) {
    if (exponent === 0) return 1;
    
    let result = 1;
    let currentBase = base;
    let currentExp = exponent;
    
    while (currentExp > 0) {
        // 指数が奇数なら結果に基数を乗算
        if (currentExp % 2 === 1) {
            result *= currentBase;
        }
        
        // 基数を二乗し、指数を半分に
        currentBase *= currentBase;
        currentExp = Math.floor(currentExp / 2);
    }
    
    return result;
}

// モジュラー繰り返し二乗法
function fastPowerMod(base, exponent, modulus) {
    if (exponent === 0) return 1;
    
    let result = 1;
    let currentBase = base % modulus;
    let currentExp = exponent;
    
    while (currentExp > 0) {
        if (currentExp % 2 === 1) {
            result = (result * currentBase) % modulus;
        }
        
        currentBase = (currentBase * currentBase) % modulus;
        currentExp = Math.floor(currentExp / 2);
    }
    
    return result;
}

// 再帰版実装（教育的）
function fastPowerRecursive(base, exponent) {
    if (exponent === 0) return 1;
    if (exponent === 1) return base;
    
    if (exponent % 2 === 0) {
        // 偶数の場合: a^n = (a^(n/2))^2
        const half = fastPowerRecursive(base, exponent / 2);
        return half * half;
    } else {
        // 奇数の場合: a^n = a * a^(n-1)
        return base * fastPowerRecursive(base, exponent - 1);
    }
}

// 使用例
console.log(fastPower(3, 10)); // 59049
console.log(fastPowerMod(3, 13, 7)); // 6
console.log(fastPowerRecursive(2, 16)); // 65536

// 効率性の比較
function compareEfficiency(base, exponent) {
    console.time('ナイーブ法');
    let naiveResult = 1;
    for (let i = 0; i < exponent; i++) {
        naiveResult *= base;
    }
    console.timeEnd('ナイーブ法');
    
    console.time('繰り返し二乗法');
    const fastResult = fastPower(base, exponent);
    console.timeEnd('繰り返し二乗法');
    
    console.log(\`結果一致: \${naiveResult === fastResult}\`);
    
    // 理論的な計算回数
    const naiveMultiplications = exponent;
    const fastMultiplications = Math.ceil(Math.log2(exponent + 1));
    const speedup = naiveMultiplications / fastMultiplications;
    
    console.log(\`ナイーブ法: \${naiveMultiplications}回の乗算\`);
    console.log(\`繰り返し二乗法: \${fastMultiplications}回の反復\`);
    console.log(\`理論的高速化: 約\${speedup.toFixed(1)}倍\`);
}

compareEfficiency(3, 100);

// 二進表現を使った理解
function explainBinaryExponentiation(base, exponent) {
    console.log(\`\${base}^\${exponent} の計算過程:\`);
    console.log(\`指数の二進表現: \${exponent} = \${exponent.toString(2)}₂\`);
    
    let result = 1;
    let currentPower = base;
    let exp = exponent;
    let step = 0;
    
    while (exp > 0) {
        const bit = exp % 2;
        console.log(\`ステップ\${++step}: 二進ビット = \${bit}\`);
        
        if (bit === 1) {
            result *= currentPower;
            console.log(\`  → result *= \${currentPower} → result = \${result}\`);
        }
        
        if (exp > 1) {
            currentPower *= currentPower;
            console.log(\`  → 基数を二乗: \${Math.sqrt(currentPower)} → \${currentPower}\`);
        }
        
        exp = Math.floor(exp / 2);
    }
    
    console.log(\`最終結果: \${result}\`);
    return result;
}

explainBinaryExponentiation(3, 13);

// 暗号学的応用例（RSA暗号の簡易版）
function simpleRSADemo() {
    // 小さな素数を使用（実際のRSAはもっと大きな数）
    const p = 61, q = 53;
    const n = p * q; // 3233
    const phi = (p - 1) * (q - 1); // 3120
    const e = 17; // 公開指数
    
    // 秘密指数dを計算（簡略化）
    const d = 2753; // modularInverse(e, phi)
    
    const message = 123;
    
    // 暗号化: c = m^e mod n
    const encrypted = fastPowerMod(message, e, n);
    console.log(\`暗号化: \${message}^\${e} mod \${n} = \${encrypted}\`);
    
    // 復号化: m = c^d mod n
    const decrypted = fastPowerMod(encrypted, d, n);
    console.log(\`復号化: \${encrypted}^\${d} mod \${n} = \${decrypted}\`);
    
    console.log(\`復号成功: \${message === decrypted}\`);
}

simpleRSADemo();

// 大きな数での効率性実証
function largePowerDemo() {
    const base = 2;
    const exponent = 1000;
    const modulus = 1000000007; // 大きな素数
    
    console.log(\`大きな数での計算: \${base}^\${exponent} mod \${modulus}\`);
    
    console.time('モジュラー繰り返し二乗法');
    const result = fastPowerMod(base, exponent, modulus);
    console.timeEnd('モジュラー繰り返し二乗法');
    
    console.log(\`結果: \${result}\`);
    console.log(\`反復回数: \${Math.ceil(Math.log2(exponent + 1))}\`);
    console.log(\`ナイーブ法なら\${exponent}回の乗算が必要\`);
}

largePowerDemo();`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
						<h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
							🎯 繰り返し二乗法の特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
									アルゴリズムの特性
								</h4>
								<ul className="space-y-2 text-indigo-700 dark:text-indigo-300 text-sm">
									<li>• 分割統治法による効率的な計算</li>
									<li>• 指数の二進表現を活用</li>
									<li>• O(n)からO(log n)への劇的改善</li>
									<li>• 再帰・反復両方の実装が可能</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
									実用的応用
								</h4>
								<ul className="space-y-2 text-indigo-700 dark:text-indigo-300 text-sm">
									<li>• RSA暗号のモジュラー冪乗計算</li>
									<li>• 離散対数問題と楕円曲線暗号</li>
									<li>• 大きな数の高速べき乗計算</li>
									<li>• 数学的計算ライブラリの基盤</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
							<p className="text-sm text-amber-800 dark:text-amber-200">
								💡 <strong>学習ポイント:</strong>{" "}
								繰り返し二乗法は分割統治法の美しい応用例として、効率的アルゴリズム設計の核心を学べる
								優秀な教材であり、現代暗号学の理解への入り口でもあります。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
