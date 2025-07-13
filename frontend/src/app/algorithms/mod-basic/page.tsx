/**
 * src/app/algorithms/mod-basic/page.tsx
 *
 * mod計算の基本アルゴリズムの解説ページ
 * 剰余演算の基礎から暗号学応用まで包括的な学習と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { modBasicExplanation } from "../../../data/explanations/mod-basic-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { ModBasicAlgorithm } from "../../../utils/algorithms/mod-basic";

/**
 * mod計算操作の種類を定義
 */
type ModOperation = "basic" | "power" | "inverse" | "properties";

/**
 * mod計算学習ページ
 * 剰余演算の基本的な操作と高度な応用を学習
 */
export default function ModBasicPage() {
	// アルゴリズムインスタンス
	const algorithm = new ModBasicAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [inputA, setInputA] = useState(17);
	const [inputB, setInputB] = useState(5);
	const [inputM, setInputM] = useState(13);
	const [operation, setOperation] = useState<ModOperation>("basic");

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
		(a: number, b: number | undefined, m: number, op: ModOperation) => {
			setInput({
				parameters: { a, b, m, operation: op },
			});
			setInputA(a);
			setInputB(b ?? 0);
			setInputM(m);
			setOperation(op);
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
			if (!Number.isInteger(inputA) || !Number.isInteger(inputM)) {
				alert("aとmは整数である必要があります");
				return;
			}

			if (inputM <= 0) {
				alert("法mは正の整数である必要があります");
				return;
			}

			if (inputA < 0 || inputA > 10000) {
				alert("aは0から10000の範囲で設定してください");
				return;
			}

			if (inputM > 1000) {
				alert("法mは1000以下に設定してください");
				return;
			}

			// 操作固有の検証
			if (
				(operation === "power" || operation === "properties") &&
				(!Number.isInteger(inputB) || inputB < 0)
			) {
				alert("べき乗操作では、bは非負整数である必要があります");
				return;
			}

			if (operation === "power" && inputB > 20) {
				alert("指数bは20以下に設定してください");
				return;
			}

			if (operation === "inverse") {
				// 互いに素かチェック
				const gcd = (x: number, y: number): number => {
					let a = x;
					let b = y;
					while (b !== 0) {
						const temp = b;
						b = a % b;
						a = temp;
					}
					return a;
				};

				if (gcd(inputA, inputM) !== 1) {
					alert("逆元計算では、aとmが互いに素である必要があります");
					return;
				}
			}

			setInput({
				parameters: {
					a: inputA,
					b:
						operation === "basic" || operation === "inverse"
							? undefined
							: inputB,
					m: inputM,
					operation: operation,
				},
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [inputA, inputB, inputM, operation]);

	// 推奨入力例を取得
	const recommendedInputs = ModBasicAlgorithm.getRecommendedInputs();

	// 現在のパラメータ
	const currentA = (input.parameters?.a as number) || 17;
	const currentB = (input.parameters?.b as number) || undefined;
	const currentM = (input.parameters?.m as number) || 13;
	const currentOperation =
		(input.parameters?.operation as ModOperation) || "basic";

	/**
	 * 操作タイプの説明を取得
	 */
	const getOperationDescription = (op: ModOperation): string => {
		switch (op) {
			case "basic":
				return "基本的な剰余計算";
			case "power":
				return "高速べき乗計算";
			case "inverse":
				return "モジュラ逆元計算";
			case "properties":
				return "mod演算の性質確認";
			default:
				return "mod計算";
		}
	};

	/**
	 * 計算式を表示
	 */
	const getCalculationFormula = (): string => {
		switch (currentOperation) {
			case "basic":
				return `${currentA} mod ${currentM}`;
			case "power":
				return `${currentA}^${currentB} mod ${currentM}`;
			case "inverse":
				return `${currentA}^(-1) mod ${currentM}`;
			case "properties":
				return `mod演算の性質確認（a=${currentA}, b=${currentB}, m=${currentM}）`;
			default:
				return "mod計算";
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
							mod計算の基本
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						mod計算の基本
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						剰余演算の数学的基礎から暗号学応用まで。現代コンピュータサイエンスを支える重要な演算
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(1)〜O(log n)
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
								数論・暗号
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
								🔢 計算設定
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
										操作タイプ:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										{getOperationDescription(currentOperation)}
									</div>
								</div>
								<div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-200">
									🎯 mod: 除算の余りを効率的に計算
								</div>
							</div>

							{/* 操作タイプ選択 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="operation-select"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										操作タイプ
									</label>
									<select
										id="operation-select"
										value={operation}
										onChange={(e) =>
											setOperation(e.target.value as ModOperation)
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="basic">基本mod計算</option>
										<option value="power">高速べき乗</option>
										<option value="inverse">モジュラ逆元</option>
										<option value="properties">演算性質確認</option>
									</select>
								</div>

								{/* パラメータ入力 */}
								<div>
									<label
										htmlFor="input-a"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										a（被演算数）
									</label>
									<input
										id="input-a"
										type="number"
										value={inputA}
										onChange={(e) =>
											setInputA(Number.parseInt(e.target.value) || 0)
										}
										min={0}
										max={10000}
										step={1}
										placeholder="17"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
									/>
									<div className="text-xs text-gray-500 mt-1">
										0-10000の整数
									</div>
								</div>

								{(operation === "power" || operation === "properties") && (
									<div>
										<label
											htmlFor="input-b"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											b（指数または第二数）
										</label>
										<input
											id="input-b"
											type="number"
											value={inputB}
											onChange={(e) =>
												setInputB(Number.parseInt(e.target.value) || 0)
											}
											min={0}
											max={operation === "power" ? 20 : 10000}
											step={1}
											placeholder="5"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
										<div className="text-xs text-gray-500 mt-1">
											{operation === "power" ? "0-20の整数" : "0-10000の整数"}
										</div>
									</div>
								)}

								<div>
									<label
										htmlFor="input-m"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										m（法）
									</label>
									<input
										id="input-m"
										type="number"
										value={inputM}
										onChange={(e) =>
											setInputM(Number.parseInt(e.target.value) || 1)
										}
										min={1}
										max={1000}
										step={1}
										placeholder="13"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
									/>
									<div className="text-xs text-gray-500 mt-1">1-1000の整数</div>
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
											key={`${rec.a}-${rec.b}-${rec.m}-${rec.operation}-${index}`}
											type="button"
											onClick={() =>
												setRecommendedInput(rec.a, rec.b, rec.m, rec.operation)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={`期待結果: ${rec.expectedResult}`}
										>
											<div className="font-semibold">{rec.description}</div>
											<div className="text-xs opacity-75">
												{rec.operation === "basic" && `${rec.a} mod ${rec.m}`}
												{rec.operation === "power" &&
													`${rec.a}^${rec.b} mod ${rec.m}`}
												{rec.operation === "inverse" &&
													`${rec.a}^(-1) mod ${rec.m}`}
												{rec.operation === "properties" && "性質確認"}
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
								{isExecuting ? "計算中..." : "🧮 mod計算実行"}
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
												操作:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{getOperationDescription(currentOperation)}
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
									mod計算を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルからパラメータを設定し、「mod計算実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={modBasicExplanation}
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
								<code>{`// 基本的なmod計算
function basicMod(a, m) {
    return a % m;
}

// 高速べき乗（modular exponentiation）
function fastPower(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

// モジュラ逆元（拡張ユークリッドの互除法）
function modularInverse(a, m) {
    function extendedGcd(a, b) {
        if (b === 0) return { gcd: a, x: 1, y: 0 };
        const result = extendedGcd(b, a % b);
        return {
            gcd: result.gcd,
            x: result.y,
            y: result.x - Math.floor(a / b) * result.y
        };
    }
    
    const result = extendedGcd(a, m);
    if (result.gcd !== 1) {
        throw new Error("モジュラ逆元が存在しません");
    }
    return ((result.x % m) + m) % m;
}

// mod演算の性質確認
function demonstrateModProperties(a, b, m) {
    // 加法の性質
    const addMod1 = (a + b) % m;
    const addMod2 = ((a % m) + (b % m)) % m;
    console.log(\`加法の性質: \${addMod1 === addMod2}\`);
    
    // 乗法の性質
    const mulMod1 = (a * b) % m;
    const mulMod2 = ((a % m) * (b % m)) % m;
    console.log(\`乗法の性質: \${mulMod1 === mulMod2}\`);
    
    return { addMod1, addMod2, mulMod1, mulMod2 };
}

// 使用例
console.log(basicMod(17, 5)); // 2
console.log(fastPower(3, 5, 7)); // 5 (3^5 = 243, 243 mod 7 = 5)
console.log(modularInverse(3, 7)); // 5 (3 * 5 = 15 ≡ 1 (mod 7))

// 暗号学的応用例（簡易RSA）
function simpleRSAExample() {
    const p = 61, q = 53; // 素数
    const n = p * q; // 3233
    const phi = (p - 1) * (q - 1); // 3120
    const e = 17; // 公開指数
    const d = modularInverse(e, phi); // 秘密指数
    
    const message = 123;
    const encrypted = fastPower(message, e, n);
    const decrypted = fastPower(encrypted, d, n);
    
    console.log(\`元メッセージ: \${message}\`);
    console.log(\`暗号化: \${encrypted}\`);
    console.log(\`復号化: \${decrypted}\`);
    console.log(\`正しく復号: \${message === decrypted}\`);
}

simpleRSAExample();

// 実用的な応用例
class ModularArithmetic {
    constructor(modulus) {
        this.mod = modulus;
    }
    
    add(a, b) {
        return (a + b) % this.mod;
    }
    
    multiply(a, b) {
        return (a * b) % this.mod;
    }
    
    power(base, exp) {
        return fastPower(base, exp, this.mod);
    }
    
    inverse(a) {
        return modularInverse(a, this.mod);
    }
    
    // ハッシュ関数での使用例
    hash(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = (hash * 31 + data.charCodeAt(i)) % this.mod;
        }
        return hash;
    }
}

// 法1009での演算
const mod1009 = new ModularArithmetic(1009);
console.log(mod1009.add(500, 600)); // 91
console.log(mod1009.multiply(123, 456)); // 56088 % 1009 = 423
console.log(mod1009.power(2, 10)); // 1024 % 1009 = 15
console.log(mod1009.hash("Hello World")); // ハッシュ値

// 分散システムでの使用例
function consistentHashing(key, numServers) {
    const hashValue = mod1009.hash(key);
    return hashValue % numServers;
}

console.log(consistentHashing("user123", 10)); // サーバー番号`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
						<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
							🎯 mod計算の特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									数学的性質
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 加法・乗法における分配法則</li>
									<li>• 結合法則と交換法則の成立</li>
									<li>• 冪等性とモジュラ逆元の存在</li>
									<li>• フェルマーの小定理との関連</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									実用的応用
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• RSA暗号の公開鍵暗号化</li>
									<li>• ハッシュ関数の内部計算</li>
									<li>• 分散システムの負荷分散</li>
									<li>• チェックサムと誤り検出</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
							<p className="text-sm text-amber-800 dark:text-amber-200">
								💡 <strong>学習ポイント:</strong>{" "}
								mod計算は数論の基礎でありながら、現代の情報セキュリティを支える重要な技術として、
								理論と実践の架け橋となる素晴らしい学習テーマです。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
