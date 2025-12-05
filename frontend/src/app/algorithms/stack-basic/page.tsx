/**
 * src/app/algorithms/stack-basic/page.tsx
 *
 * スタック（基本操作）アルゴリズムの解説ページ
 * LIFO原理に基づくスタックデータ構造の基本操作と可視化を提供
 */

"use client";

import { BookOpen, Code, Lightbulb, Settings, Target } from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { stackBasicExplanation } from "../../../data/explanations/stack-basic-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { StackBasicAlgorithm } from "../../../utils/algorithms/stack-basic";

/**
 * スタック（基本操作）学習ページ
 * LIFO原理の理解とスタック操作の可視化
 */
export default function StackBasicPage() {
	// アルゴリズムインスタンス
	const algorithm = new StackBasicAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [selectedOperation, setSelectedOperation] = useState("push");
	const [operationValue, setOperationValue] = useState("4");
	const [customStack, setCustomStack] = useState("1,2,3");

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
	 * 推奨操作を設定
	 */
	const setRecommendedOperation = useCallback(
		(operation: string, value?: number, initialStack?: number[]) => {
			setInput({
				array: initialStack || [],
				parameters: { operation, value },
			});
			setSelectedOperation(operation);
			if (value !== undefined) {
				setOperationValue(value.toString());
			}
			if (initialStack) {
				setCustomStack(initialStack.join(","));
			}
			setResult(null);
		},
		[],
	);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			// スタックの解析
			let stack: number[] = [];
			if (customStack.trim()) {
				stack = customStack.split(",").map((str) => {
					const num = Number.parseInt(str.trim(), 10);
					if (Number.isNaN(num)) {
						throw new Error(`無効な数値: ${str.trim()}`);
					}
					return num;
				});
			}

			// 値が必要な操作の検証
			let value: number | undefined;
			if (selectedOperation === "push") {
				value = Number.parseInt(operationValue.trim(), 10);
				if (Number.isNaN(value)) {
					alert("push操作には有効な数値が必要です");
					return;
				}
			}

			setInput({
				array: stack,
				parameters: { operation: selectedOperation, value },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customStack, selectedOperation, operationValue]);

	// 推奨操作を取得
	const recommendedOperations = StackBasicAlgorithm.getRecommendedOperations();

	// 現在のスタックと操作
	const currentStack = input.array || [];
	const currentOperation = input.parameters?.operation || "push";
	const currentValue = input.parameters?.value;

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
							スタック（基本操作）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
						スタック（基本操作）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						LIFO（Last In, First
						Out）原理に基づくスタックデータ構造の基本操作を学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(1)
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
								初級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								LIFO
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								原理
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
								操作設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										現在のスタック:
									</span>
									<div className="font-mono text-sm text-blue-600 dark:text-blue-400 mt-1">
										[{currentStack.join(", ")}]
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										選択した操作:
									</span>
									<div className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
										{currentOperation}
										{currentValue !== undefined && `(${currentValue})`}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										スタックサイズ:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{currentStack.length} 要素
									</div>
								</div>
								<div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-200 flex items-center gap-1">
									<BookOpen className="w-4 h-4" />
									LIFO: 最後に入れた要素が最初に取り出される
								</div>
							</div>

							{/* 操作選択 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="operation-select"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										操作を選択
									</label>
									<select
										id="operation-select"
										value={selectedOperation}
										onChange={(e) => setSelectedOperation(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="push">push - 要素を追加</option>
										<option value="pop">pop - 要素を取り出し</option>
										<option value="peek">peek - 先頭要素を確認</option>
										<option value="isEmpty">isEmpty - 空かどうか確認</option>
										<option value="size">size - 要素数を確認</option>
									</select>
								</div>

								{selectedOperation === "push" && (
									<div>
										<label
											htmlFor="operation-value"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											追加する値
										</label>
										<input
											id="operation-value"
											type="number"
											value={operationValue}
											onChange={(e) => setOperationValue(e.target.value)}
											placeholder="4"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
								)}

								<div>
									<label
										htmlFor="custom-stack"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										初期スタック（カンマ区切り）
									</label>
									<input
										id="custom-stack"
										type="text"
										value={customStack}
										onChange={(e) => setCustomStack(e.target.value)}
										placeholder="1,2,3"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
								>
									設定を適用
								</button>
							</div>

							{/* 推奨操作ボタン */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
									<BookOpen className="w-4 h-4" />
									推奨操作例
								</h4>
								<div className="space-y-2">
									{recommendedOperations.map((rec, index) => (
										<button
											key={`${rec.operation}-${rec.value || "no-value"}-${rec.initialStack?.join(",") || "empty"}`}
											type="button"
											onClick={() =>
												setRecommendedOperation(
													rec.operation,
													rec.value,
													rec.initialStack,
												)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={rec.description}
										>
											<div className="font-semibold">
												{rec.operation}
												{rec.value !== undefined && `(${rec.value})`}
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
										: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? (
									"実行中..."
								) : (
									<>
										<BookOpen className="w-4 h-4" />
										スタック操作実行
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
												操作結果:
											</span>
											<span className="ml-2 font-mono font-bold text-blue-600 dark:text-blue-400">
												{String(result.result)}
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
									<BookOpen className="w-16 h-16 mx-auto text-blue-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									スタック操作を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから操作を選択し、「スタック操作実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={stackBasicExplanation}
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
								<code>{`class Stack {
    constructor() {
        this.items = [];
    }
    
    // 要素を先頭に追加 - O(1)
    push(element) {
        this.items.push(element);
        return this.items.length;
    }
    
    // 先頭要素を取り出し - O(1)
    pop() {
        if (this.isEmpty()) {
            throw new Error("スタックが空です");
        }
        return this.items.pop();
    }
    
    // 先頭要素を確認（削除なし） - O(1)
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.items.length - 1];
    }
    
    // スタックが空かどうかを確認 - O(1)
    isEmpty() {
        return this.items.length === 0;
    }
    
    // 要素数を取得 - O(1)
    size() {
        return this.items.length;
    }
    
    // スタックの内容を表示
    display() {
        return this.items.slice().reverse(); // 先頭が上になるように表示
    }
}

// 使用例
const stack = new Stack();

// 要素の追加
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.display()); // [3, 2, 1] (先頭が上)

// 先頭要素の確認
console.log(stack.peek()); // 3

// 要素の取り出し
console.log(stack.pop()); // 3
console.log(stack.display()); // [2, 1]

// 状態の確認
console.log(stack.size()); // 2
console.log(stack.isEmpty()); // false`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
						<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
							<Target className="w-5 h-5" />
							スタックの特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									基本特性
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• LIFO（Last In, First Out）原理</li>
									<li>• すべての基本操作がO(1)で高速</li>
									<li>• 一方向（先頭）からのみアクセス</li>
									<li>• メモリ効率が良い</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									実世界での応用
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 関数呼び出しのコールスタック</li>
									<li>• ブラウザの戻るボタン履歴</li>
									<li>• 数式の括弧チェック</li>
									<li>• アンドゥ機能の実装</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
							<p className="text-sm text-green-800 dark:text-green-200">
								<Lightbulb className="w-3 h-3 inline" />{" "}
								<strong>ポイント:</strong>{" "}
								スタックは最も基本的なデータ構造の一つで、
								プログラミングの多くの場面で活用されています。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
