/**
 * src/app/algorithms/deque-basic/page.tsx
 *
 * 両端キュー（基本操作）アルゴリズムの解説ページ
 * 両端アクセス可能なキューデータ構造の基本操作と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { DequeBasicAlgorithm } from "../../../utils/algorithms/deque-basic";

/**
 * 両端キュー（基本操作）学習ページ
 * 双方向アクセスの理解と両端キュー操作の可視化
 */
export default function DequeBasicPage() {
	// アルゴリズムインスタンス
	const algorithm = new DequeBasicAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [selectedOperation, setSelectedOperation] = useState("pushBack");
	const [operationValue, setOperationValue] = useState("4");
	const [customDeque, setCustomDeque] = useState("1,2,3");

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
		(operation: string, value?: number, initialDeque?: number[]) => {
			setInput({
				array: initialDeque || [],
				parameters: { operation, value },
			});
			setSelectedOperation(operation);
			if (value !== undefined) {
				setOperationValue(value.toString());
			}
			if (initialDeque) {
				setCustomDeque(initialDeque.join(","));
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
			// 両端キューの解析
			let deque: number[] = [];
			if (customDeque.trim()) {
				deque = customDeque.split(",").map((str) => {
					const num = Number.parseInt(str.trim(), 10);
					if (Number.isNaN(num)) {
						throw new Error(`無効な数値: ${str.trim()}`);
					}
					return num;
				});
			}

			// 値が必要な操作の検証
			let value: number | undefined;
			if (
				selectedOperation === "pushFront" ||
				selectedOperation === "pushBack"
			) {
				value = Number.parseInt(operationValue.trim(), 10);
				if (Number.isNaN(value)) {
					alert("push操作には有効な数値が必要です");
					return;
				}
			}

			setInput({
				array: deque,
				parameters: { operation: selectedOperation, value },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customDeque, selectedOperation, operationValue]);

	// 推奨操作を取得
	const recommendedOperations = DequeBasicAlgorithm.getRecommendedOperations();

	// 現在の両端キューと操作
	const currentDeque = input.array || [];
	const currentOperation = input.parameters?.operation || "pushBack";
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
							両端キュー（基本操作）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
						両端キュー（基本操作）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						両端からのアクセスが可能な双方向キューデータ構造の基本操作を学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
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
								中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								双方向
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								アクセス
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								🔧 操作設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										現在の両端キュー:
									</span>
									<div className="font-mono text-sm text-purple-600 dark:text-purple-400 mt-1">
										[{currentDeque.join(", ")}]
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										選択した操作:
									</span>
									<div className="font-mono text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">
										{currentOperation}
										{currentValue !== undefined && `(${currentValue})`}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										サイズ:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{currentDeque.length} 要素
									</div>
								</div>
								<div className="flex justify-between">
									<div>
										<span className="text-xs text-gray-500 dark:text-gray-500">
											先頭:
										</span>
										<div className="font-mono text-xs text-purple-600 dark:text-purple-400">
											{currentDeque.length > 0 ? currentDeque[0] : "なし"}
										</div>
									</div>
									<div>
										<span className="text-xs text-gray-500 dark:text-gray-500">
											末尾:
										</span>
										<div className="font-mono text-xs text-purple-600 dark:text-purple-400">
											{currentDeque.length > 0
												? currentDeque[currentDeque.length - 1]
												: "なし"}
										</div>
									</div>
								</div>
								<div className="mt-2 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-purple-800 dark:text-purple-200">
									📚 両端アクセス: 先頭と末尾の両方から操作可能
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
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<optgroup label="追加操作">
											<option value="pushFront">pushFront - 先頭に追加</option>
											<option value="pushBack">pushBack - 末尾に追加</option>
										</optgroup>
										<optgroup label="削除操作">
											<option value="popFront">popFront - 先頭から削除</option>
											<option value="popBack">popBack - 末尾から削除</option>
										</optgroup>
										<optgroup label="確認操作">
											<option value="front">front - 先頭要素を確認</option>
											<option value="back">back - 末尾要素を確認</option>
											<option value="isEmpty">isEmpty - 空かどうか確認</option>
											<option value="size">size - 要素数を確認</option>
										</optgroup>
									</select>
								</div>

								{(selectedOperation === "pushFront" ||
									selectedOperation === "pushBack") && (
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
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
								)}

								<div>
									<label
										htmlFor="custom-deque"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										初期両端キュー（カンマ区切り）
									</label>
									<input
										id="custom-deque"
										type="text"
										value={customDeque}
										onChange={(e) => setCustomDeque(e.target.value)}
										placeholder="1,2,3"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
								>
									設定を適用
								</button>
							</div>

							{/* 推奨操作ボタン */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									📚 推奨操作例
								</h4>
								<div className="space-y-2">
									{recommendedOperations.map((rec, index) => (
										<button
											key={`${rec.operation}-${rec.value || "no-value"}-${
												rec.initialDeque?.join(",") || "empty"
											}`}
											type="button"
											onClick={() =>
												setRecommendedOperation(
													rec.operation,
													rec.value,
													rec.initialDeque,
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
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
									isExecuting
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "実行中..." : "📚 両端キュー操作実行"}
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
											<span className="ml-2 font-mono font-bold text-purple-600 dark:text-purple-400">
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
								<div className="text-6xl mb-4">🔄</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									両端キュー操作を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから操作を選択し、「両端キュー操作実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
							📖 両端キューについて
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
								<code>{`class Deque {
    constructor() {
        this.items = [];
    }
    
    // 先頭に要素を追加 - O(1)
    pushFront(element) {
        this.items.unshift(element);
        return this.items.length;
    }
    
    // 末尾に要素を追加 - O(1)
    pushBack(element) {
        this.items.push(element);
        return this.items.length;
    }
    
    // 先頭要素を取り出し - O(1)
    popFront() {
        if (this.isEmpty()) {
            throw new Error("両端キューが空です");
        }
        return this.items.shift();
    }
    
    // 末尾要素を取り出し - O(1)
    popBack() {
        if (this.isEmpty()) {
            throw new Error("両端キューが空です");
        }
        return this.items.pop();
    }
    
    // 先頭要素を確認（削除なし） - O(1)
    front() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[0];
    }
    
    // 末尾要素を確認（削除なし） - O(1)
    back() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.items.length - 1];
    }
    
    // 両端キューが空かどうかを確認 - O(1)
    isEmpty() {
        return this.items.length === 0;
    }
    
    // 要素数を取得 - O(1)
    size() {
        return this.items.length;
    }
    
    // 両端キューの内容を表示
    display() {
        return this.items.slice();
    }
}

// 使用例
const deque = new Deque();

// 両端から要素の追加
deque.pushBack(2);   // [2]
deque.pushFront(1);  // [1, 2]
deque.pushBack(3);   // [1, 2, 3]
deque.pushFront(0);  // [0, 1, 2, 3]

console.log(deque.display()); // [0, 1, 2, 3]

// 両端の要素確認
console.log(deque.front()); // 0
console.log(deque.back());  // 3

// 両端から要素の削除
console.log(deque.popFront()); // 0 → [1, 2, 3]
console.log(deque.popBack());  // 3 → [1, 2]

console.log(deque.display()); // [1, 2]

// 状態の確認
console.log(deque.size());    // 2
console.log(deque.isEmpty()); // false

// スタックとしての使用（pushBack, popBack）
deque.pushBack(4);
deque.pushBack(5);
console.log(deque.popBack()); // 5 (LIFO)

// キューとしての使用（pushBack, popFront）
deque.pushBack(6);
console.log(deque.popFront()); // 1 (FIFO)`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
						<h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
							🎯 両端キューの特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
									基本特性
								</h4>
								<ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
									<li>• 両端からの追加・削除が可能</li>
									<li>• すべての基本操作がO(1)で高速</li>
									<li>• スタックとキューの機能を統合</li>
									<li>• 柔軟なデータアクセスパターン</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
									実世界での応用
								</h4>
								<ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
									<li>• ブラウザの履歴管理（前進・後退）</li>
									<li>• アンドゥ・リドゥ機能の実装</li>
									<li>• スライディングウィンドウ</li>
									<li>• 回文判定アルゴリズム</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
							<p className="text-sm text-yellow-800 dark:text-yellow-200">
								💡 <strong>ポイント:</strong>{" "}
								両端キューはスタックとキューの最良の特徴を併せ持ち、
								より柔軟なデータアクセスを可能にします。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
