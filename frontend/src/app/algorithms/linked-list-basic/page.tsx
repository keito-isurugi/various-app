/**
 * src/app/algorithms/linked-list-basic/page.tsx
 *
 * 連結リスト（基本操作）アルゴリズムの解説ページ
 * ノードとポインタによる動的データ構造の基本操作と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { linkedListBasicExplanation } from "../../../data/explanations/linked-list-basic-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { LinkedListBasicAlgorithm } from "../../../utils/algorithms/linked-list-basic";

/**
 * 連結リスト（基本操作）学習ページ
 * 動的データ構造の理解と連結リスト操作の可視化
 */
export default function LinkedListBasicPage() {
	// アルゴリズムインスタンス
	const algorithm = new LinkedListBasicAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [selectedOperation, setSelectedOperation] = useState("insertTail");
	const [operationValue, setOperationValue] = useState("4");
	const [operationIndex, setOperationIndex] = useState("1");
	const [customList, setCustomList] = useState("1,2,3");

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
		(
			operation: string,
			value?: number,
			index?: number,
			initialList?: number[],
		) => {
			setInput({
				array: initialList || [],
				parameters: { operation, value, index },
			});
			setSelectedOperation(operation);
			if (value !== undefined) {
				setOperationValue(value.toString());
			}
			if (index !== undefined) {
				setOperationIndex(index.toString());
			}
			if (initialList) {
				setCustomList(initialList.join(","));
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
			// 連結リストの解析
			let list: number[] = [];
			if (customList.trim()) {
				list = customList.split(",").map((str) => {
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
				["insertHead", "insertTail", "insertAt", "find"].includes(
					selectedOperation,
				)
			) {
				value = Number.parseInt(operationValue.trim(), 10);
				if (Number.isNaN(value)) {
					alert("この操作には有効な数値が必要です");
					return;
				}
			}

			// インデックスが必要な操作の検証
			let index: number | undefined;
			if (["insertAt", "deleteAt"].includes(selectedOperation)) {
				index = Number.parseInt(operationIndex.trim(), 10);
				if (Number.isNaN(index)) {
					alert("この操作には有効なインデックスが必要です");
					return;
				}
			}

			setInput({
				array: list,
				parameters: { operation: selectedOperation, value, index },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customList, selectedOperation, operationValue, operationIndex]);

	// 推奨操作を取得
	const recommendedOperations =
		LinkedListBasicAlgorithm.getRecommendedOperations();

	// 現在の連結リストと操作
	const currentList = input.array || [];
	const currentOperation = input.parameters?.operation || "insertTail";
	const currentValue = input.parameters?.value;
	const currentIndex = input.parameters?.index;

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
							連結リスト（基本操作）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-4">
						連結リスト（基本操作）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						ノードとポインタで構成される動的データ構造の基本操作を学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(1)〜O(n)
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
							<div className="text-2xl font-bold text-red-600 dark:text-red-400">
								上級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								動的
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								データ構造
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
										現在の連結リスト:
									</span>
									<div className="font-mono text-sm text-orange-600 dark:text-orange-400 mt-1">
										{currentList.length > 0
											? `${currentList.join(" → ")} → null`
											: "空のリスト"}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										選択した操作:
									</span>
									<div className="font-mono text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
										{currentOperation}
										{currentValue !== undefined && `(${currentValue})`}
										{currentIndex !== undefined && `, index:${currentIndex}`}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										リストサイズ:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{currentList.length} ノード
									</div>
								</div>
								<div className="flex justify-between">
									<div>
										<span className="text-xs text-gray-500 dark:text-gray-500">
											先頭:
										</span>
										<div className="font-mono text-xs text-orange-600 dark:text-orange-400">
											{currentList.length > 0 ? currentList[0] : "なし"}
										</div>
									</div>
									<div>
										<span className="text-xs text-gray-500 dark:text-gray-500">
											末尾:
										</span>
										<div className="font-mono text-xs text-orange-600 dark:text-orange-400">
											{currentList.length > 0
												? currentList[currentList.length - 1]
												: "なし"}
										</div>
									</div>
								</div>
								<div className="mt-2 p-2 bg-orange-100 dark:bg-orange-900/30 rounded text-xs text-orange-800 dark:text-orange-200">
									🔗 動的構造: ノード → ノード → ... → null
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
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<optgroup label="挿入操作">
											<option value="insertHead">
												insertHead - 先頭に挿入
											</option>
											<option value="insertTail">
												insertTail - 末尾に挿入
											</option>
											<option value="insertAt">
												insertAt - 指定位置に挿入
											</option>
										</optgroup>
										<optgroup label="削除操作">
											<option value="deleteHead">
												deleteHead - 先頭を削除
											</option>
											<option value="deleteTail">
												deleteTail - 末尾を削除
											</option>
											<option value="deleteAt">
												deleteAt - 指定位置を削除
											</option>
										</optgroup>
										<optgroup label="確認操作">
											<option value="find">find - 値を検索</option>
											<option value="size">size - サイズを確認</option>
											<option value="isEmpty">isEmpty - 空かどうか確認</option>
										</optgroup>
									</select>
								</div>

								{["insertHead", "insertTail", "insertAt", "find"].includes(
									selectedOperation,
								) && (
									<div>
										<label
											htmlFor="operation-value"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											{selectedOperation === "find"
												? "検索する値"
												: "挿入する値"}
										</label>
										<input
											id="operation-value"
											type="number"
											value={operationValue}
											onChange={(e) => setOperationValue(e.target.value)}
											placeholder="4"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
								)}

								{["insertAt", "deleteAt"].includes(selectedOperation) && (
									<div>
										<label
											htmlFor="operation-index"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											インデックス（位置）
										</label>
										<input
											id="operation-index"
											type="number"
											value={operationIndex}
											onChange={(e) => setOperationIndex(e.target.value)}
											placeholder="1"
											min="0"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
								)}

								<div>
									<label
										htmlFor="custom-list"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										初期連結リスト（カンマ区切り）
									</label>
									<input
										id="custom-list"
										type="text"
										value={customList}
										onChange={(e) => setCustomList(e.target.value)}
										placeholder="1,2,3"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
								>
									設定を適用
								</button>
							</div>

							{/* 推奨操作ボタン */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									📚 推奨操作例
								</h4>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{recommendedOperations.map((rec, index) => (
										<button
											key={`${rec.operation}-${rec.value || "no-value"}-${rec.index || "no-index"}-${
												rec.initialList?.join(",") || "empty"
											}`}
											type="button"
											onClick={() =>
												setRecommendedOperation(
													rec.operation,
													rec.value,
													rec.index,
													rec.initialList,
												)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={rec.description}
										>
											<div className="font-semibold">
												{rec.operation}
												{rec.value !== undefined && `(${rec.value})`}
												{rec.index !== undefined && `, i:${rec.index}`}
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
										: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "実行中..." : "🔗 連結リスト操作実行"}
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
											<span className="ml-2 font-mono font-bold text-orange-600 dark:text-orange-400">
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
								<div className="text-6xl mb-4">🔗</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									連結リスト操作を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから操作を選択し、「連結リスト操作実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={linkedListBasicExplanation}
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
								<code>{`// ノードクラス
class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

// 連結リストクラス
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // 先頭に挿入 - O(1)
    insertHead(value) {
        const newNode = new ListNode(value);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
        return this.size;
    }
    
    // 末尾に挿入 - O(n)
    insertTail(value) {
        const newNode = new ListNode(value);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
        return this.size;
    }
    
    // 指定位置に挿入 - O(n)
    insertAt(index, value) {
        if (index < 0 || index > this.size) {
            throw new Error("インデックスが範囲外です");
        }
        
        if (index === 0) {
            return this.insertHead(value);
        }
        
        const newNode = new ListNode(value);
        let current = this.head;
        
        for (let i = 0; i < index - 1; i++) {
            current = current.next;
        }
        
        newNode.next = current.next;
        current.next = newNode;
        this.size++;
        return this.size;
    }
    
    // 先頭を削除 - O(1)
    deleteHead() {
        if (!this.head) {
            throw new Error("リストが空です");
        }
        
        const deletedValue = this.head.value;
        this.head = this.head.next;
        this.size--;
        return deletedValue;
    }
    
    // 末尾を削除 - O(n)
    deleteTail() {
        if (!this.head) {
            throw new Error("リストが空です");
        }
        
        if (!this.head.next) {
            const deletedValue = this.head.value;
            this.head = null;
            this.size--;
            return deletedValue;
        }
        
        let current = this.head;
        while (current.next.next) {
            current = current.next;
        }
        
        const deletedValue = current.next.value;
        current.next = null;
        this.size--;
        return deletedValue;
    }
    
    // 値を検索 - O(n)
    find(value) {
        let current = this.head;
        let index = 0;
        
        while (current) {
            if (current.value === value) {
                return index;
            }
            current = current.next;
            index++;
        }
        
        return -1; // 見つからない場合
    }
    
    // リストの内容を配列で表示
    toArray() {
        const result = [];
        let current = this.head;
        
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        
        return result;
    }
    
    // リストの構造を文字列で表示
    toString() {
        if (!this.head) {
            return "空のリスト";
        }
        return this.toArray().join(" → ") + " → null";
    }
    
    // リストのサイズを取得 - O(1)
    getSize() {
        return this.size;
    }
    
    // リストが空かどうかを確認 - O(1)
    isEmpty() {
        return this.head === null;
    }
}

// 使用例
const list = new LinkedList();

// 要素の挿入
list.insertHead(2);      // [2]
list.insertHead(1);      // [1, 2]
list.insertTail(4);      // [1, 2, 4]
list.insertAt(2, 3);     // [1, 2, 3, 4]

console.log(list.toString()); // "1 → 2 → 3 → 4 → null"

// 要素の検索
console.log(list.find(3)); // 2 (インデックス)
console.log(list.find(5)); // -1 (見つからない)

// 要素の削除
console.log(list.deleteHead()); // 1
console.log(list.deleteTail()); // 4
console.log(list.toString());   // "2 → 3 → null"

// 状態の確認
console.log(list.getSize());    // 2
console.log(list.isEmpty());    // false`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
						<h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">
							🎯 連結リストの特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">
									基本特性
								</h4>
								<ul className="space-y-2 text-orange-700 dark:text-orange-300 text-sm">
									<li>• 動的にサイズが変更可能</li>
									<li>• ノードとポインタによる構造</li>
									<li>• 先頭操作は高速（O(1)）</li>
									<li>• 検索は線形時間（O(n)）</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">
									実世界での応用
								</h4>
								<ul className="space-y-2 text-orange-700 dark:text-orange-300 text-sm">
									<li>• ウェブブラウザの履歴管理</li>
									<li>• 音楽プレイヤーのプレイリスト</li>
									<li>• メモリ管理システム</li>
									<li>• スタック・キューの実装基盤</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
							<p className="text-sm text-amber-800 dark:text-amber-200">
								💡 <strong>ポイント:</strong>{" "}
								連結リストは動的データ構造の基本で、ポインタ操作の理解に重要です。
								配列とは異なる利点と制約を理解しましょう。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
