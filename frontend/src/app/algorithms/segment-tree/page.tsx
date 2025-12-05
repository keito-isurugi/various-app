/**
 * src/app/algorithms/segment-tree/page.tsx
 *
 * セグメント木アルゴリズムの解説ページ
 * 範囲クエリと一点更新の効率的な処理を学習・可視化
 */

"use client";

import { BookOpen, Lightbulb, Target, TreeDeciduous } from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { segmentTreeExplanation } from "../../../data/explanations/segment-tree-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { SegmentTreeAlgorithm } from "../../../utils/algorithms/segment-tree";

/**
 * セグメント木操作の種類
 */
type SegmentTreeOperationType =
	| "build"
	| "query"
	| "update"
	| "rangeUpdate"
	| "pointQuery"
	| "getNode"
	| "visualizeTree";

/**
 * セグメント木のクエリタイプ
 */
type QueryType = "sum" | "min" | "max" | "gcd" | "lcm";

/**
 * セグメント木学習ページ
 * 範囲クエリの効率的な処理と分割統治の理解・可視化
 */
export default function SegmentTreePage() {
	// アルゴリズムインスタンス
	const algorithm = new SegmentTreeAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [operation, setOperation] = useState<SegmentTreeOperationType>("build");
	const [queryType, setQueryType] = useState<QueryType>("sum");
	const [array, setArray] = useState("4,7,1,9,3,6,2,5");
	const [left, setLeft] = useState(1);
	const [right, setRight] = useState(4);
	const [index, setIndex] = useState(2);
	const [value, setValue] = useState(10);

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
			op: SegmentTreeOperationType,
			arr?: number[],
			qType: QueryType = "sum",
			l?: number,
			r?: number,
			idx?: number,
			val?: number,
			tree?: number[],
		) => {
			const newInput: AlgorithmInput = {
				parameters: {
					operation: op,
					queryType: qType,
					...(arr && { array: arr }),
					...(l !== undefined && { left: l }),
					...(r !== undefined && { right: r }),
					...(idx !== undefined && { index: idx }),
					...(val !== undefined && { value: val }),
					...(tree && { tree: tree }),
				},
			};

			setInput(newInput);
			setOperation(op);
			setQueryType(qType);
			if (arr) setArray(arr.join(","));
			if (l !== undefined) setLeft(l);
			if (r !== undefined) setRight(r);
			if (idx !== undefined) setIndex(idx);
			if (val !== undefined) setValue(val);
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
					queryType: queryType,
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
				case "query":
				case "rangeUpdate":
					newInput.parameters = { ...newInput.parameters, left, right };
					if (operation === "rangeUpdate") {
						newInput.parameters = { ...newInput.parameters, value };
					}
					break;
				case "update":
				case "pointQuery":
				case "getNode":
					newInput.parameters = { ...newInput.parameters, index };
					if (operation === "update") {
						newInput.parameters = { ...newInput.parameters, value };
					}
					break;
			}

			// 現在のセグメント木状態を引き継ぎ
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
	}, [operation, queryType, array, left, right, index, value, result]);

	// 推奨操作例を取得
	const recommendedOperations = SegmentTreeAlgorithm.getRecommendedOperations();

	// 現在のパラメータ
	const currentOperation =
		(input.parameters?.operation as SegmentTreeOperationType) || "build";
	const currentQueryType = (input.parameters?.queryType as QueryType) || "sum";

	/**
	 * 操作の説明を取得
	 */
	const getOperationDescription = (op: SegmentTreeOperationType): string => {
		const descriptions = {
			build: "セグメント木の構築",
			query: "範囲クエリ",
			update: "一点更新",
			rangeUpdate: "範囲更新",
			pointQuery: "一点クエリ",
			getNode: "ノード情報取得",
			visualizeTree: "木構造の可視化",
		};
		return descriptions[op] || "操作";
	};

	/**
	 * クエリタイプの説明を取得
	 */
	const getQueryTypeDescription = (type: QueryType): string => {
		const descriptions = {
			sum: "合計",
			min: "最小値",
			max: "最大値",
			gcd: "最大公約数",
			lcm: "最小公倍数",
		};
		return descriptions[type] || "クエリ";
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずナビゲーション */}
				<nav className="mb-6" aria-label="パンくずナビゲーション">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Link
							href="/algorithms"
							className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
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
							セグメント木
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
						セグメント木（Segment Tree）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						完全二分木による範囲クエリと一点更新の効率的な処理。分割統治法の美しい実現
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								O(log n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								クエリ・更新
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
								O(n)
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
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								O(4n)
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
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
								<TreeDeciduous className="w-5 h-5" />
								セグメント木操作設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										操作:
									</span>
									<div className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
										{getOperationDescription(currentOperation)}
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										クエリタイプ:
									</span>
									<div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
										{getQueryTypeDescription(currentQueryType)}
									</div>
								</div>
								<div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-200">
									<Target className="w-4 h-4" />
									分割統治による効率的な範囲処理
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
											setOperation(e.target.value as SegmentTreeOperationType)
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="build">木構築</option>
										<option value="query">範囲クエリ</option>
										<option value="update">一点更新</option>
										<option value="rangeUpdate">範囲更新</option>
										<option value="pointQuery">一点クエリ</option>
										<option value="getNode">ノード取得</option>
										<option value="visualizeTree">木可視化</option>
									</select>
								</div>

								<div>
									<label
										htmlFor="query-type-select"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										クエリタイプ
									</label>
									<select
										id="query-type-select"
										value={queryType}
										onChange={(e) => setQueryType(e.target.value as QueryType)}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="sum">合計（Sum）</option>
										<option value="min">最小値（Min）</option>
										<option value="max">最大値（Max）</option>
										<option value="gcd">最大公約数（GCD）</option>
										<option value="lcm">最小公倍数（LCM）</option>
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
											placeholder="4,7,1,9,3,6,2,5"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								{(operation === "query" || operation === "rangeUpdate") && (
									<>
										<div>
											<label
												htmlFor="left-input"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												左端（Left）
											</label>
											<input
												id="left-input"
												type="number"
												value={left}
												onChange={(e) =>
													setLeft(Number.parseInt(e.target.value) || 0)
												}
												min={0}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
											/>
										</div>
										<div>
											<label
												htmlFor="right-input"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												右端（Right）
											</label>
											<input
												id="right-input"
												type="number"
												value={right}
												onChange={(e) =>
													setRight(Number.parseInt(e.target.value) || 0)
												}
												min={0}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
											/>
										</div>
									</>
								)}

								{(operation === "update" ||
									operation === "pointQuery" ||
									operation === "getNode") && (
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
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								{(operation === "update" || operation === "rangeUpdate") && (
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
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
													rec.queryType || "sum",
													rec.left,
													rec.right,
													rec.index,
													rec.value,
													undefined,
												)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
										>
											<div className="font-semibold">{rec.description}</div>
											<div className="text-xs opacity-75">
												{rec.operation} - {rec.queryType || "sum"}
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
										<TreeDeciduous className="w-4 h-4" />
										セグメント木操作実行
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
											<span className="ml-2 font-mono font-bold text-blue-600 dark:text-blue-400">
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
									<TreeDeciduous className="w-16 h-16 mx-auto text-purple-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									セグメント木操作を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルから操作を設定し、「セグメント木操作実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={segmentTreeExplanation}
						defaultExpanded={false}
						className="shadow-xl"
					/>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
						<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
							<Target className="w-5 h-5" />
							セグメント木の特徴と応用
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									構造的特徴
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 完全二分木による分割統治</li>
									<li>• 配列による効率的実装</li>
									<li>• O(log n)の範囲アクセス</li>
									<li>• 多様な結合演算対応</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									実用的応用
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 範囲クエリの高速処理</li>
									<li>• データベースのインデックス</li>
									<li>• 動的プログラミング</li>
									<li>• 競技プログラミング</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
							<p className="text-sm text-amber-800 dark:text-amber-200">
								<Lightbulb className="w-3 h-3 inline" />{" "}
								<strong>学習ポイント:</strong>{" "}
								セグメント木は分割統治法の美しい実現であり、
								様々な結合可能演算に対して汎用的な範囲処理を提供します。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
