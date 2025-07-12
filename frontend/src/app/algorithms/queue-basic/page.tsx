/**
 * src/app/algorithms/queue-basic/page.tsx
 *
 * キュー（基本操作）アルゴリズムの解説ページ
 * FIFO原理に基づくキューデータ構造の基本操作と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { QueueBasicAlgorithm } from "../../../utils/algorithms/queue-basic";

/**
 * キュー（基本操作）学習ページ
 * FIFO原理の理解とキュー操作の可視化
 */
export default function QueueBasicPage() {
	// アルゴリズムインスタンス
	const algorithm = new QueueBasicAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [selectedOperation, setSelectedOperation] = useState("enqueue");
	const [operationValue, setOperationValue] = useState("4");
	const [customQueue, setCustomQueue] = useState("1,2,3");

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
		(operation: string, value?: number, initialQueue?: number[]) => {
			setInput({
				array: initialQueue || [],
				parameters: { operation, value },
			});
			setSelectedOperation(operation);
			if (value !== undefined) {
				setOperationValue(value.toString());
			}
			if (initialQueue) {
				setCustomQueue(initialQueue.join(","));
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
			// キューの解析
			let queue: number[] = [];
			if (customQueue.trim()) {
				queue = customQueue.split(",").map((str) => {
					const num = Number.parseInt(str.trim(), 10);
					if (Number.isNaN(num)) {
						throw new Error(`無効な数値: ${str.trim()}`);
					}
					return num;
				});
			}

			// 値が必要な操作の検証
			let value: number | undefined;
			if (selectedOperation === "enqueue") {
				value = Number.parseInt(operationValue.trim(), 10);
				if (Number.isNaN(value)) {
					alert("enqueue操作には有効な数値が必要です");
					return;
				}
			}

			setInput({
				array: queue,
				parameters: { operation: selectedOperation, value },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customQueue, selectedOperation, operationValue]);

	// 推奨操作を取得
	const recommendedOperations = QueueBasicAlgorithm.getRecommendedOperations();

	// 現在のキューと操作
	const currentQueue = input.array || [];
	const currentOperation = input.parameters?.operation || "enqueue";
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
							キュー（基本操作）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
						キュー（基本操作）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						FIFO（First In, First
						Out）原理に基づくキューデータ構造の基本操作を学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
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
								FIFO
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
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								🔧 操作設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										現在のキュー:
									</span>
									<div className="font-mono text-sm text-green-600 dark:text-green-400 mt-1">
										[{currentQueue.join(", ")}]
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										選択した操作:
									</span>
									<div className="font-mono text-lg font-bold text-green-600 dark:text-green-400 mt-1">
										{currentOperation}
										{currentValue !== undefined && `(${currentValue})`}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										キューサイズ:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{currentQueue.length} 要素
									</div>
								</div>
								<div className="flex justify-between">
									<div>
										<span className="text-xs text-gray-500 dark:text-gray-500">
											先頭:
										</span>
										<div className="font-mono text-xs text-green-600 dark:text-green-400">
											{currentQueue.length > 0 ? currentQueue[0] : "なし"}
										</div>
									</div>
									<div>
										<span className="text-xs text-gray-500 dark:text-gray-500">
											末尾:
										</span>
										<div className="font-mono text-xs text-green-600 dark:text-green-400">
											{currentQueue.length > 0
												? currentQueue[currentQueue.length - 1]
												: "なし"}
										</div>
									</div>
								</div>
								<div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-800 dark:text-green-200">
									📚 FIFO: 最初に入れた要素が最初に取り出される
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
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="enqueue">enqueue - 要素を追加</option>
										<option value="dequeue">dequeue - 要素を取り出し</option>
										<option value="front">front - 先頭要素を確認</option>
										<option value="rear">rear - 末尾要素を確認</option>
										<option value="isEmpty">isEmpty - 空かどうか確認</option>
										<option value="size">size - 要素数を確認</option>
									</select>
								</div>

								{selectedOperation === "enqueue" && (
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
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
								)}

								<div>
									<label
										htmlFor="custom-queue"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										初期キュー（カンマ区切り）
									</label>
									<input
										id="custom-queue"
										type="text"
										value={customQueue}
										onChange={(e) => setCustomQueue(e.target.value)}
										placeholder="1,2,3"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
												rec.initialQueue?.join(",") || "empty"
											}`}
											type="button"
											onClick={() =>
												setRecommendedOperation(
													rec.operation,
													rec.value,
													rec.initialQueue,
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
										: "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "実行中..." : "📚 キュー操作実行"}
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
											<span className="ml-2 font-mono font-bold text-green-600 dark:text-green-400">
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
								<div className="text-6xl mb-4">📋</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									キュー操作を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから操作を選択し、「キュー操作実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
							📖 キューについて
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
								<code>{`class Queue {
    constructor() {
        this.items = [];
    }
    
    // 要素を末尾に追加 - O(1)
    enqueue(element) {
        this.items.push(element);
        return this.items.length;
    }
    
    // 先頭要素を取り出し - O(1)
    dequeue() {
        if (this.isEmpty()) {
            throw new Error("キューが空です");
        }
        return this.items.shift();
    }
    
    // 先頭要素を確認（削除なし） - O(1)
    front() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[0];
    }
    
    // 末尾要素を確認（削除なし） - O(1)
    rear() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.items.length - 1];
    }
    
    // キューが空かどうかを確認 - O(1)
    isEmpty() {
        return this.items.length === 0;
    }
    
    // 要素数を取得 - O(1)
    size() {
        return this.items.length;
    }
    
    // キューの内容を表示
    display() {
        return this.items.slice(); // 先頭から末尾の順序で表示
    }
}

// 使用例
const queue = new Queue();

// 要素の追加（enqueue）
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.display()); // [1, 2, 3] (左が先頭、右が末尾)

// 先頭・末尾要素の確認
console.log(queue.front()); // 1 (最初に追加された要素)
console.log(queue.rear());  // 3 (最後に追加された要素)

// 要素の取り出し（dequeue）
console.log(queue.dequeue()); // 1 (先頭要素を取り出し)
console.log(queue.display()); // [2, 3]

// 状態の確認
console.log(queue.size()); // 2
console.log(queue.isEmpty()); // false

// 全要素の取り出し
queue.dequeue(); // 2
queue.dequeue(); // 3
console.log(queue.isEmpty()); // true`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
						<h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
							🎯 キューの特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
									基本特性
								</h4>
								<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
									<li>• FIFO（First In, First Out）原理</li>
									<li>• すべての基本操作がO(1)で高速</li>
									<li>• 先頭から取り出し、末尾に追加</li>
									<li>• 順序を保つデータアクセス</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
									実世界での応用
								</h4>
								<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
									<li>• プロセス管理のタスクキュー</li>
									<li>• ネットワークデータパケット処理</li>
									<li>• プリンタの印刷待ち行列</li>
									<li>• 幅優先探索（BFS）アルゴリズム</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
							<p className="text-sm text-blue-800 dark:text-blue-200">
								💡 <strong>ポイント:</strong>{" "}
								キューは待ち行列のイメージで、日常生活でも身近な概念です。
								順序を保って処理したい場面で活用されます。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
