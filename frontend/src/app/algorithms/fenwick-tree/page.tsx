/**
 * src/app/algorithms/fenwick-tree/page.tsx
 *
 * Fenwick Tree（Binary Indexed Tree）アルゴリズムの解説ページ
 * ビット演算による累積和の効率的な計算と一点更新の学習・可視化
 */

"use client";

import { Binary, BookOpen, Lightbulb, Target } from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { fenwickTreeExplanation } from "../../../data/explanations/fenwick-tree-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { FenwickTreeAlgorithm } from "../../../utils/algorithms/fenwick-tree";

/**
 * Fenwick Tree操作の種類
 */
type FenwickTreeOperationType =
	| "build"
	| "update"
	| "query"
	| "rangeQuery"
	| "set"
	| "get"
	| "visualizeBits"
	| "showStructure";

/**
 * Fenwick Tree（Binary Indexed Tree）学習ページ
 * ビット演算による効率的な累積和処理の理解と可視化
 */
export default function FenwickTreePage() {
	// アルゴリズムインスタンス
	const algorithm = new FenwickTreeAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [operation, setOperation] = useState<FenwickTreeOperationType>("build");
	const [array, setArray] = useState("3,2,1,6,5,4,7,8");
	const [index, setIndex] = useState(3);
	const [value, setValue] = useState(5);
	const [left, setLeft] = useState(2);
	const [right, setRight] = useState(6);

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
			op: FenwickTreeOperationType,
			arr?: number[],
			idx?: number,
			val?: number,
			l?: number,
			r?: number,
			tree?: number[],
		) => {
			const newInput: AlgorithmInput = {
				parameters: {
					operation: op,
					...(arr && { array: arr }),
					...(idx !== undefined && { index: idx }),
					...(val !== undefined && { value: val }),
					...(l !== undefined && { left: l }),
					...(r !== undefined && { right: r }),
					...(tree && { tree: tree }),
				},
			};

			setInput(newInput);
			setOperation(op);
			if (arr) setArray(arr.join(","));
			if (idx !== undefined) setIndex(idx);
			if (val !== undefined) setValue(val);
			if (l !== undefined) setLeft(l);
			if (r !== undefined) setRight(r);
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
				},
			};

			// 操作に応じてパラメータを設定
			switch (operation) {
				case "build": {
					const arrayValues = array
						.split(",")
						.map((v) => Number.parseInt(v.trim(), 10));
					if (arrayValues.some(Number.isNaN)) {
						alert("配列は数値をカンマ区切りで入力してください");
						return;
					}
					newInput.parameters = { ...newInput.parameters, array: arrayValues };
					break;
				}
				case "update":
				case "query":
				case "set":
				case "get":
					newInput.parameters = { ...newInput.parameters, index };
					if (operation === "update" || operation === "set") {
						newInput.parameters = { ...newInput.parameters, value };
					}
					break;
				case "rangeQuery":
					newInput.parameters = { ...newInput.parameters, left, right };
					break;
			}

			// 現在のFenwick Tree状態を引き継ぎ
			if (result?.success && operation !== "build") {
				// 前回の結果から木の状態を取得
				const lastStep = result.steps[result.steps.length - 1];
				if (lastStep?.tree) {
					newInput.parameters = {
						...newInput.parameters,
						tree: [...lastStep.tree],
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
	}, [operation, array, index, value, left, right, result]);

	// 推奨操作例を取得
	const recommendedOperations = FenwickTreeAlgorithm.getRecommendedOperations();

	// 現在のパラメータ
	const currentOperation =
		(input.parameters?.operation as FenwickTreeOperationType) || "build";

	/**
	 * 操作の説明を取得
	 */
	const getOperationDescription = (op: FenwickTreeOperationType): string => {
		const descriptions = {
			build: "Fenwick Tree構築",
			update: "一点更新（加算）",
			query: "累積和クエリ",
			rangeQuery: "範囲和クエリ",
			set: "値の設定",
			get: "値の取得",
			visualizeBits: "ビット構造可視化",
			showStructure: "木構造表示",
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
							Fenwick Tree（Binary Indexed Tree）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
						Fenwick Tree（Binary Indexed Tree）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						ビット演算による累積和の巧妙な実装。lowbit操作で効率的な範囲管理を実現
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								O(log n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								更新・クエリ
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
								O(n log n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								構築時間
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
								中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
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
								<Binary className="w-4 h-4" />
								Fenwick Tree操作設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										操作:
									</span>
									<div className="font-mono text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">
										{getOperationDescription(currentOperation)}
									</div>
								</div>
								<div className="mt-2 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-purple-800 dark:text-purple-200">
									<Target className="w-4 h-4" />
									ビット演算による累積和管理
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
											setOperation(e.target.value as FenwickTreeOperationType)
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="build">Fenwick Tree構築</option>
										<option value="update">一点更新（加算）</option>
										<option value="query">累積和クエリ</option>
										<option value="rangeQuery">範囲和クエリ</option>
										<option value="set">値設定</option>
										<option value="get">値取得</option>
										<option value="visualizeBits">ビット可視化</option>
										<option value="showStructure">構造表示</option>
									</select>
								</div>

								{/* 操作に応じた入力フィールド */}
								{operation === "build" && (
									<div>
										<label
											htmlFor="array-input"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											配列（カンマ区切り）
										</label>
										<input
											id="array-input"
											type="text"
											value={array}
											onChange={(e) => setArray(e.target.value)}
											placeholder="3,2,1,6,5,4,7,8"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								{(operation === "update" ||
									operation === "query" ||
									operation === "set" ||
									operation === "get") && (
									<div>
										<label
											htmlFor="index-input"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											インデックス（1-based）
										</label>
										<input
											id="index-input"
											type="number"
											value={index}
											onChange={(e) =>
												setIndex(Number.parseInt(e.target.value) || 1)
											}
											min={1}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								{(operation === "update" || operation === "set") && (
									<div>
										<label
											htmlFor="value-input"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											{operation === "update" ? "加算値" : "設定値"}
										</label>
										<input
											id="value-input"
											type="number"
											value={value}
											onChange={(e) =>
												setValue(Number.parseInt(e.target.value) || 0)
											}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								{operation === "rangeQuery" && (
									<>
										<div>
											<label
												htmlFor="left-input"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												左端（1-based）
											</label>
											<input
												id="left-input"
												type="number"
												value={left}
												onChange={(e) =>
													setLeft(Number.parseInt(e.target.value) || 1)
												}
												min={1}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
											/>
										</div>
										<div>
											<label
												htmlFor="right-input"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												右端（1-based）
											</label>
											<input
												id="right-input"
												type="number"
												value={right}
												onChange={(e) =>
													setRight(Number.parseInt(e.target.value) || 1)
												}
												min={1}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
											/>
										</div>
									</>
								)}

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
								>
									設定を適用
								</button>
							</div>

							{/* 推奨操作例 */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
									<BookOpen className="w-4 h-4" />
									推奨操作例
								</h4>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{recommendedOperations.map((rec, index) => (
										<button
											key={`${rec.operation}-${index}`}
											type="button"
											onClick={() =>
												setRecommendedOperation(
													rec.operation,
													rec.array,
													rec.index,
													rec.value,
													rec.left,
													rec.right,
													undefined,
												)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
										>
											<div className="font-semibold">{rec.description}</div>
											<div className="text-xs opacity-75">
												{rec.operation}
												{rec.index !== undefined &&
													` - インデックス${rec.index}`}
												{rec.value !== undefined && ` 値${rec.value}`}
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
										: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? (
									"実行中..."
								) : (
									<>
										<Binary className="w-4 h-4" />
										Fenwick Tree操作実行
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
												結果:
											</span>
											<span className="ml-2 font-mono font-bold text-purple-600 dark:text-purple-400">
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
												配列サイズ:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{result.summary?.arraySize || 0}
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
									<Binary className="w-16 h-16 mx-auto text-purple-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									Fenwick Tree操作を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルから操作を設定し、「Fenwick
									Tree操作実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={fenwickTreeExplanation}
						defaultExpanded={false}
						className="shadow-xl"
					/>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
						<h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
							<Target className="w-5 h-5" />
							Fenwick Treeの特徴と応用
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
									技術的特徴
								</h4>
								<ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
									<li>• lowbit操作（x & -x）の活用</li>
									<li>• 1-based配列による実装</li>
									<li>• シンプルで高速な実装</li>
									<li>• セグメント木より省メモリ</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
									実用的応用
								</h4>
								<ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
									<li>• 累積和の動的計算</li>
									<li>• 転倒数（逆順ペア）計算</li>
									<li>• 競技プログラミング</li>
									<li>• リアルタイム統計処理</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
							<p className="text-sm text-amber-800 dark:text-amber-200">
								<Lightbulb className="w-3 h-3 inline" />{" "}
								<strong>学習ポイント:</strong> Fenwick
								Treeはビット演算の巧妙な活用により、
								累積和に特化した最適化を実現した実用的なデータ構造です。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
