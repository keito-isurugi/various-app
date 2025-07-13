/**
 * src/app/algorithms/heap-priority-queue/page.tsx
 *
 * ヒープ（優先度付きキュー）アルゴリズムの解説ページ
 * 完全二分木による効率的な優先度管理の学習と可視化を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { heapPriorityQueueExplanation } from "../../../data/explanations/heap-priority-queue-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { HeapPriorityQueueAlgorithm } from "../../../utils/algorithms/heap-priority-queue";

/**
 * ヒープ操作の種類
 */
type HeapOperationType =
	| "insert"
	| "extractMax"
	| "extractMin"
	| "peek"
	| "buildHeap"
	| "heapify"
	| "changePriority"
	| "remove";

/**
 * ヒープタイプ
 */
type HeapType = "max" | "min";

/**
 * ヒープ（優先度付きキュー）学習ページ
 * 完全二分木による優先度管理の理解と可視化
 */
export default function HeapPriorityQueuePage() {
	// アルゴリズムインスタンス
	const algorithm = new HeapPriorityQueueAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [operation, setOperation] = useState<HeapOperationType>("insert");
	const [heapType, setHeapType] = useState<HeapType>("max");
	const [value, setValue] = useState(10);
	const [index, setIndex] = useState(0);
	const [values, setValues] = useState("4,7,1,9,3,6,2");

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
			op: HeapOperationType,
			val?: number,
			vals?: number[],
			idx?: number,
			hType: HeapType = "max",
			heap?: number[],
		) => {
			const newInput: AlgorithmInput = {
				parameters: {
					operation: op,
					heapType: hType,
					...(val !== undefined && { value: val }),
					...(vals && { values: vals }),
					...(idx !== undefined && { index: idx }),
					...(heap && { heap: heap }),
				},
			};

			setInput(newInput);
			setOperation(op);
			setHeapType(hType);
			if (val !== undefined) setValue(val);
			if (idx !== undefined) setIndex(idx);
			if (vals) setValues(vals.join(","));
			setResult(null);
		},
		[],
	);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			const newInput: AlgorithmInput = {
				parameters: {
					operation: operation,
					heapType: heapType,
				},
			};

			// 操作に応じてパラメータを設定
			switch (operation) {
				case "insert":
				case "changePriority":
					newInput.parameters = { ...newInput.parameters, value };
					if (operation === "changePriority") {
						newInput.parameters = { ...newInput.parameters, index };
					}
					break;
				case "buildHeap": {
					const valuesArray = values
						.split(",")
						.map((v) => Number.parseInt(v.trim(), 10));
					if (valuesArray.some(Number.isNaN)) {
						alert("値は数値をカンマ区切りで入力してください");
						return;
					}
					newInput.parameters = { ...newInput.parameters, values: valuesArray };
					break;
				}
				case "heapify":
				case "remove":
					newInput.parameters = { ...newInput.parameters, index };
					break;
			}

			// 現在のヒープ状態を引き継ぎ
			if (result?.success && result.summary?.finalSize > 0) {
				// 前回の結果から配列を取得
				const lastStep = result.steps[result.steps.length - 1];
				if (lastStep?.array) {
					newInput.parameters = {
						...newInput.parameters,
						heap: [...lastStep.array],
					};
				}
			}

			setInput(newInput);
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [operation, heapType, value, index, values, result]);

	// 推奨操作例を取得
	const recommendedOperations =
		HeapPriorityQueueAlgorithm.getRecommendedOperations();

	// 現在のパラメータ
	const currentOperation =
		(input.parameters?.operation as HeapOperationType) || "insert";
	const currentHeapType = (input.parameters?.heapType as HeapType) || "max";

	/**
	 * 操作の説明を取得
	 */
	const getOperationDescription = (op: HeapOperationType): string => {
		const descriptions = {
			insert: "要素の挿入",
			extractMax: "最大値の取り出し",
			extractMin: "最小値の取り出し",
			peek: "最大/最小値の確認",
			buildHeap: "ヒープの構築",
			heapify: "ヒープ性の修復",
			changePriority: "優先度の変更",
			remove: "要素の削除",
		};
		return descriptions[op] || "操作";
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
							ヒープ（優先度付きキュー）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-4">
						ヒープ（優先度付きキュー）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						完全二分木による効率的な優先度管理。最大/最小値の高速取得と動的な優先度更新を実現
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
								O(log n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								挿入・削除
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-red-600 dark:text-red-400">
								O(1)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								最大/最小値取得
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
								中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								O(n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								空間計算量
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								🏗️ ヒープ操作設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										操作:
									</span>
									<div className="font-mono text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
										{getOperationDescription(currentOperation)}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										ヒープタイプ:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										{currentHeapType === "max" ? "最大ヒープ" : "最小ヒープ"}
									</div>
								</div>
								<div className="mt-2 p-2 bg-orange-100 dark:bg-orange-900/30 rounded text-xs text-orange-800 dark:text-orange-200">
									🎯 完全二分木による優先度管理
								</div>
							</div>

							{/* 操作選択 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="operation-select"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										操作
									</label>
									<select
										id="operation-select"
										value={operation}
										onChange={(e) =>
											setOperation(e.target.value as HeapOperationType)
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="buildHeap">ヒープ構築</option>
										<option value="insert">要素挿入</option>
										<option value="extractMax">最大値取り出し</option>
										<option value="extractMin">最小値取り出し</option>
										<option value="peek">最大/最小値確認</option>
										<option value="heapify">ヒープ化</option>
										<option value="changePriority">優先度変更</option>
										<option value="remove">要素削除</option>
									</select>
								</div>

								<div>
									<label
										htmlFor="heap-type-select"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										ヒープタイプ
									</label>
									<select
										id="heap-type-select"
										value={heapType}
										onChange={(e) => setHeapType(e.target.value as HeapType)}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="max">最大ヒープ</option>
										<option value="min">最小ヒープ</option>
									</select>
								</div>

								{/* 操作に応じた入力フィールド */}
								{(operation === "insert" || operation === "changePriority") && (
									<div>
										<label
											htmlFor="value-input"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											値
										</label>
										<input
											id="value-input"
											type="number"
											value={value}
											onChange={(e) =>
												setValue(Number.parseInt(e.target.value) || 0)
											}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								{operation === "buildHeap" && (
									<div>
										<label
											htmlFor="values-input"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											配列（カンマ区切り）
										</label>
										<input
											id="values-input"
											type="text"
											value={values}
											onChange={(e) => setValues(e.target.value)}
											placeholder="4,7,1,9,3,6,2"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								{(operation === "heapify" ||
									operation === "remove" ||
									operation === "changePriority") && (
									<div>
										<label
											htmlFor="index-input"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											インデックス
										</label>
										<input
											id="index-input"
											type="number"
											value={index}
											onChange={(e) =>
												setIndex(Number.parseInt(e.target.value) || 0)
											}
											min={0}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
								>
									設定を適用
								</button>
							</div>

							{/* 推奨操作例 */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									📚 推奨操作例
								</h4>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{recommendedOperations.map((rec, index) => (
										<button
											key={`${rec.operation}-${index}`}
											type="button"
											onClick={() =>
												setRecommendedOperation(
													rec.operation,
													rec.value,
													rec.values,
													rec.index,
													rec.heapType,
													rec.heap,
												)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
										>
											<div className="font-semibold">{rec.description}</div>
											<div className="text-xs opacity-75">
												{rec.operation} - {rec.heapType}ヒープ
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
								{isExecuting ? "実行中..." : "🏗️ ヒープ操作実行"}
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
												結果:
											</span>
											<span className="ml-2 font-mono font-bold text-orange-600 dark:text-orange-400">
												{String(result.result)}
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
												ヒープサイズ:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{result.summary?.finalSize || 0}
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
								<div className="text-6xl mb-4">🏗️</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									ヒープ操作を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルから操作を設定し、「ヒープ操作実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={heapPriorityQueueExplanation}
						defaultExpanded={false}
						className="shadow-xl"
					/>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
						<h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">
							🎯 ヒープの特徴と応用
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">
									構造的特徴
								</h4>
								<ul className="space-y-2 text-orange-700 dark:text-orange-300 text-sm">
									<li>• 完全二分木構造</li>
									<li>• 配列による効率的実装</li>
									<li>• ヒープ性質の維持</li>
									<li>• 親子関係の簡単な計算</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">
									実用的応用
								</h4>
								<ul className="space-y-2 text-orange-700 dark:text-orange-300 text-sm">
									<li>• 優先度付きキュー</li>
									<li>• ダイクストラ法</li>
									<li>• ヒープソート</li>
									<li>• タスクスケジューリング</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
							<p className="text-sm text-amber-800 dark:text-amber-200">
								💡 <strong>学習ポイント:</strong>{" "}
								ヒープは効率的な優先度管理を実現する基本的なデータ構造で、
								多くの高度なアルゴリズムの基盤となっています。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
