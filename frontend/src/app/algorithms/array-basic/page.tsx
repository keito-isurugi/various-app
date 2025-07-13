/**
 * src/app/algorithms/array-basic/page.tsx
 *
 * 配列（基本操作）アルゴリズムの解説ページ
 * インデックスベースのランダムアクセスとCRUD操作の可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { arrayBasicExplanation } from "../../../data/explanations/array-basic-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { ArrayBasicAlgorithm } from "../../../utils/algorithms/array-basic";

/**
 * 配列（基本操作）学習ページ
 * ランダムアクセスとCRUD操作の理解と可視化
 */
export default function ArrayBasicPage() {
	// アルゴリズムインスタンス
	const algorithm = new ArrayBasicAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [selectedOperation, setSelectedOperation] = useState("access");
	const [operationValue, setOperationValue] = useState("10");
	const [operationIndex, setOperationIndex] = useState("2");
	const [customArray, setCustomArray] = useState("1,2,3,4,5");

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
			initialArray?: number[],
		) => {
			setInput({
				array: initialArray || [],
				parameters: { operation, value, index },
			});
			setSelectedOperation(operation);
			if (value !== undefined) {
				setOperationValue(value.toString());
			}
			if (index !== undefined) {
				setOperationIndex(index.toString());
			}
			if (initialArray) {
				setCustomArray(initialArray.join(","));
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
			// 配列の解析
			let array: number[] = [];
			if (customArray.trim()) {
				array = customArray.split(",").map((str) => {
					const num = Number.parseInt(str.trim(), 10);
					if (Number.isNaN(num)) {
						throw new Error(`無効な数値: ${str.trim()}`);
					}
					return num;
				});
			}

			// 値が必要な操作の検証
			let value: number | undefined;
			if (["insert", "update", "search"].includes(selectedOperation)) {
				value = Number.parseInt(operationValue.trim(), 10);
				if (Number.isNaN(value)) {
					alert(`${selectedOperation}操作には有効な数値が必要です`);
					return;
				}
			}

			// インデックスが必要な操作の検証
			let index: number | undefined;
			if (
				["access", "insert", "delete", "update"].includes(selectedOperation)
			) {
				index = Number.parseInt(operationIndex.trim(), 10);
				if (Number.isNaN(index)) {
					alert(`${selectedOperation}操作には有効なインデックスが必要です`);
					return;
				}
			}

			setInput({
				array: array,
				parameters: { operation: selectedOperation, value, index },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customArray, selectedOperation, operationValue, operationIndex]);

	// 推奨操作を取得
	const recommendedOperations = ArrayBasicAlgorithm.getRecommendedOperations();

	// 現在の配列と操作
	const currentArray = input.array || [];
	const currentOperation = input.parameters?.operation || "access";
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
							配列（基本操作）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
						配列（基本操作）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						インデックスベースのランダムアクセスが可能な配列データ構造の基本操作を学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(1)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								アクセス・更新
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
								O(n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								挿入・削除・検索
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
								初級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
								ランダム
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								アクセス方式
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
										現在の配列:
									</span>
									<div className="font-mono text-sm text-emerald-600 dark:text-emerald-400 mt-1">
										[{currentArray.join(", ")}]
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										選択した操作:
									</span>
									<div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
										{currentOperation}
										{currentIndex !== undefined && `(${currentIndex}`}
										{currentValue !== undefined && `, ${currentValue}`}
										{(currentIndex !== undefined ||
											currentValue !== undefined) &&
											")"}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										配列サイズ:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{currentArray.length} 要素
									</div>
								</div>
								<div className="mt-2 p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded text-xs text-emerald-800 dark:text-emerald-200">
									🎯 インデックス: 任意の位置に即座にアクセス可能
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
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="access">access - 要素にアクセス</option>
										<option value="insert">insert - 要素を挿入</option>
										<option value="delete">delete - 要素を削除</option>
										<option value="update">update - 要素を更新</option>
										<option value="search">search - 要素を検索</option>
										<option value="length">length - 要素数を確認</option>
									</select>
								</div>

								{["access", "insert", "delete", "update"].includes(
									selectedOperation,
								) && (
									<div>
										<label
											htmlFor="operation-index"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											インデックス
										</label>
										<input
											id="operation-index"
											type="number"
											min="0"
											value={operationIndex}
											onChange={(e) => setOperationIndex(e.target.value)}
											placeholder="2"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
								)}

								{["insert", "update", "search"].includes(selectedOperation) && (
									<div>
										<label
											htmlFor="operation-value"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											{selectedOperation === "search" ? "検索する値" : "値"}
										</label>
										<input
											id="operation-value"
											type="number"
											value={operationValue}
											onChange={(e) => setOperationValue(e.target.value)}
											placeholder="10"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
										/>
									</div>
								)}

								<div>
									<label
										htmlFor="custom-array"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										初期配列（カンマ区切り）
									</label>
									<input
										id="custom-array"
										type="text"
										value={customArray}
										onChange={(e) => setCustomArray(e.target.value)}
										placeholder="1,2,3,4,5"
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

							{/* 推奨操作ボタン */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									📚 推奨操作例
								</h4>
								<div className="space-y-2">
									{recommendedOperations.map((rec, index) => (
										<button
											key={`${rec.operation}-${rec.value || "no-value"}-${rec.index || "no-index"}-${rec.initialArray?.join(",") || "empty"}`}
											type="button"
											onClick={() =>
												setRecommendedOperation(
													rec.operation,
													rec.value,
													rec.index,
													rec.initialArray,
												)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											title={rec.description}
										>
											<div className="font-semibold">
												{rec.operation}
												{rec.index !== undefined && `(${rec.index}`}
												{rec.value !== undefined && `, ${rec.value}`}
												{(rec.index !== undefined || rec.value !== undefined) &&
													")"}
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
								{isExecuting ? "実行中..." : "🎯 配列操作実行"}
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
											<span className="ml-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">
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
								<div className="text-6xl mb-4">🎯</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									配列操作を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから操作を選択し、「配列操作実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={arrayBasicExplanation}
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
								<code>{`class Array {
    constructor(size = 0) {
        this.items = new Array(size);
        this.length = 0;
    }
    
    // 指定インデックスの要素にアクセス - O(1)
    access(index) {
        if (index < 0 || index >= this.length) {
            throw new Error("インデックスが範囲外です");
        }
        return this.items[index];
    }
    
    // 指定位置に要素を挿入 - O(n)
    insert(index, value) {
        if (index < 0 || index > this.length) {
            throw new Error("挿入位置が無効です");
        }
        
        // 要素を右にシフト
        for (let i = this.length; i > index; i--) {
            this.items[i] = this.items[i - 1];
        }
        
        this.items[index] = value;
        this.length++;
        return this.length;
    }
    
    // 指定インデックスの要素を削除 - O(n)
    delete(index) {
        if (index < 0 || index >= this.length) {
            throw new Error("削除インデックスが範囲外です");
        }
        
        const deletedValue = this.items[index];
        
        // 要素を左にシフト
        for (let i = index; i < this.length - 1; i++) {
            this.items[i] = this.items[i + 1];
        }
        
        this.length--;
        return deletedValue;
    }
    
    // 指定インデックスの要素を更新 - O(1)
    update(index, value) {
        if (index < 0 || index >= this.length) {
            throw new Error("更新インデックスが範囲外です");
        }
        
        const oldValue = this.items[index];
        this.items[index] = value;
        return oldValue;
    }
    
    // 指定値を線形検索 - O(n)
    search(value) {
        for (let i = 0; i < this.length; i++) {
            if (this.items[i] === value) {
                return i; // インデックスを返す
            }
        }
        return -1; // 見つからない場合
    }
    
    // 配列の要素数を取得 - O(1)
    size() {
        return this.length;
    }
    
    // 配列の内容を表示
    display() {
        return this.items.slice(0, this.length);
    }
}

// 使用例
const array = new Array(10);

// 要素の挿入
array.insert(0, 10);
array.insert(1, 20);
array.insert(2, 30);
console.log(array.display()); // [10, 20, 30]

// 要素へのアクセス
console.log(array.access(1)); // 20

// 要素の更新
array.update(1, 25);
console.log(array.display()); // [10, 25, 30]

// 要素の検索
console.log(array.search(25)); // 1

// 要素の削除
array.delete(0);
console.log(array.display()); // [25, 30]`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
						<h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
							🎯 配列の特徴
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
									メリット
								</h4>
								<ul className="space-y-2 text-emerald-700 dark:text-emerald-300 text-sm">
									<li>• ランダムアクセスでO(1)の高速読み書き</li>
									<li>• メモリ効率が良い（連続配置）</li>
									<li>• キャッシュ効率が高い</li>
									<li>• 実装が簡単で理解しやすい</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
									実世界での応用
								</h4>
								<ul className="space-y-2 text-emerald-700 dark:text-emerald-300 text-sm">
									<li>• データベースのレコード管理</li>
									<li>• 画像処理（ピクセル配列）</li>
									<li>• 数値計算（行列・ベクトル）</li>
									<li>• ゲーム開発（座標・状態管理）</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
							<p className="text-sm text-blue-800 dark:text-blue-200">
								💡 <strong>ポイント:</strong> 配列は最も基本的なデータ構造で、
								他の多くのデータ構造の基礎となっています。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
