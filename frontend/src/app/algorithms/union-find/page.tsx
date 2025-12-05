/**
 * src/app/algorithms/union-find/page.tsx
 *
 * Union-Find（素集合データ構造）アルゴリズムの解説ページ
 * 素集合の効率的な管理と最適化技法の学習と可視化を提供
 */

"use client";

import { BookOpen, Lightbulb, Target, TreeDeciduous } from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { unionFindExplanation } from "../../../data/explanations/union-find-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { UnionFindAlgorithm } from "../../../utils/algorithms/union-find";

/**
 * Union-Find操作の種類
 */
type UnionFindOperationType =
	| "makeSet"
	| "find"
	| "union"
	| "connected"
	| "initializeSet"
	| "getComponents"
	| "getSize";

/**
 * Union-Find（素集合データ構造）学習ページ
 * 効率的な集合管理と最適化技法の理解と可視化
 */
export default function UnionFindPage() {
	// アルゴリズムインスタンス
	const algorithm = new UnionFindAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [operation, setOperation] =
		useState<UnionFindOperationType>("initializeSet");
	const [size, setSize] = useState(8);
	const [element1, setElement1] = useState(0);
	const [element2, setElement2] = useState(1);

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
			op: UnionFindOperationType,
			sz?: number,
			el1?: number,
			el2?: number,
			uf?: number[],
		) => {
			const newInput: AlgorithmInput = {
				parameters: {
					operation: op,
					...(sz !== undefined && { size: sz }),
					...(el1 !== undefined && { element1: el1 }),
					...(el2 !== undefined && { element2: el2 }),
					...(uf && { unionFind: uf }),
				},
			};

			setInput(newInput);
			setOperation(op);
			if (sz !== undefined) setSize(sz);
			if (el1 !== undefined) setElement1(el1);
			if (el2 !== undefined) setElement2(el2);
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
				case "initializeSet":
					newInput.parameters = { ...newInput.parameters, size };
					break;
				case "find":
				case "makeSet":
				case "getSize":
					newInput.parameters = { ...newInput.parameters, element1 };
					break;
				case "union":
				case "connected":
					newInput.parameters = { ...newInput.parameters, element1, element2 };
					break;
			}

			// 現在のUnion-Find状態を引き継ぎ
			if (result?.success) {
				// 前回の結果から状態を取得
				const lastStep = result.steps[result.steps.length - 1];
				if (lastStep?.unionFind) {
					newInput.parameters = {
						...newInput.parameters,
						unionFind: [...lastStep.unionFind],
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
	}, [operation, size, element1, element2, result]);

	// 推奨操作例を取得
	const recommendedOperations = UnionFindAlgorithm.getRecommendedOperations();

	// 現在のパラメータ
	const currentOperation =
		(input.parameters?.operation as UnionFindOperationType) || "initializeSet";

	/**
	 * 操作の説明を取得
	 */
	const getOperationDescription = (op: UnionFindOperationType): string => {
		const descriptions = {
			makeSet: "要素の新しい集合作成",
			find: "代表元の検索",
			union: "2つの集合の合併",
			connected: "連結性の判定",
			initializeSet: "Union-Findの初期化",
			getComponents: "連結成分の取得",
			getSize: "集合サイズの取得",
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
							className="hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-1"
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
							Union-Find（素集合データ構造）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
						Union-Find（素集合データ構造）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						互いに素な集合の効率的な管理。パス圧縮とランク合併による最適化で実用的に定数時間を実現
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								O(α(n))
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Find・Union
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
								O(1)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								実用的な操作時間
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
								中級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
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
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
								<TreeDeciduous className="w-5 h-5" />
								Union-Find操作設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										操作:
									</span>
									<div className="font-mono text-lg font-bold text-green-600 dark:text-green-400 mt-1">
										{getOperationDescription(currentOperation)}
									</div>
								</div>
								<div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-800 dark:text-green-200">
									<Target className="w-4 h-4" />
									素集合の効率的な管理
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
											setOperation(e.target.value as UnionFindOperationType)
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
									>
										<option value="initializeSet">初期化</option>
										<option value="makeSet">単一集合作成</option>
										<option value="find">代表元検索</option>
										<option value="union">集合合併</option>
										<option value="connected">連結性判定</option>
										<option value="getComponents">連結成分取得</option>
										<option value="getSize">集合サイズ取得</option>
									</select>
								</div>

								{/* 操作に応じた入力フィールド */}
								{operation === "initializeSet" && (
									<div>
										<label
											htmlFor="size-input"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											要素数
										</label>
										<input
											id="size-input"
											type="number"
											value={size}
											onChange={(e) =>
												setSize(Number.parseInt(e.target.value) || 0)
											}
											min={1}
											max={20}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								{(operation === "find" ||
									operation === "makeSet" ||
									operation === "getSize") && (
									<div>
										<label
											htmlFor="element1-input"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											要素
										</label>
										<input
											id="element1-input"
											type="number"
											value={element1}
											onChange={(e) =>
												setElement1(Number.parseInt(e.target.value) || 0)
											}
											min={0}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
										/>
									</div>
								)}

								{(operation === "union" || operation === "connected") && (
									<>
										<div>
											<label
												htmlFor="element1-input"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												要素1
											</label>
											<input
												id="element1-input"
												type="number"
												value={element1}
												onChange={(e) =>
													setElement1(Number.parseInt(e.target.value) || 0)
												}
												min={0}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
											/>
										</div>
										<div>
											<label
												htmlFor="element2-input"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												要素2
											</label>
											<input
												id="element2-input"
												type="number"
												value={element2}
												onChange={(e) =>
													setElement2(Number.parseInt(e.target.value) || 0)
												}
												min={0}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 font-mono"
											/>
										</div>
									</>
								)}

								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
													rec.setSize,
													rec.x,
													rec.y,
													undefined,
												)
											}
											className="w-full py-2 px-3 text-xs rounded transition-colors text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
										>
											<div className="font-semibold">{rec.description}</div>
											<div className="text-xs opacity-75">
												{rec.operation}
												{rec.x !== undefined && ` - 要素${rec.x}`}
												{rec.y !== undefined && `,${rec.y}`}
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
										: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? (
									"実行中..."
								) : (
									<>
										<TreeDeciduous className="w-4 h-4" />
										Union-Find操作実行
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
											<span className="ml-2 font-mono font-bold text-green-600 dark:text-green-400">
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
												集合数:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{result.summary?.finalComponents || 0}
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
									Union-Find操作を実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の入力パネルから操作を設定し、「Union-Find操作実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={unionFindExplanation}
						defaultExpanded={false}
						className="shadow-xl"
					/>
				</section>

				{/* アルゴリズムの特徴セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
						<h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
							<Target className="w-5 h-5" />
							Union-Findの特徴と応用
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
									最適化技法
								</h4>
								<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
									<li>• パス圧縮（Path Compression）</li>
									<li>• ランクによる合併（Union by Rank）</li>
									<li>• 逆アッカーマン関数α(n)時間</li>
									<li>• 実用的に定数時間操作</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
									実用的応用
								</h4>
								<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
									<li>• グラフの連結性判定</li>
									<li>• クラスカル法（最小全域木）</li>
									<li>• 画像の連結成分ラベリング</li>
									<li>• ネットワーク分析</li>
								</ul>
							</div>
						</div>
						<div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
							<p className="text-sm text-amber-800 dark:text-amber-200">
								<Lightbulb className="w-3 h-3 inline" />{" "}
								<strong>学習ポイント:</strong>{" "}
								Union-Findは理論的に最適なオンラインアルゴリズムで、
								実用的にほぼ定数時間での集合管理を実現します。
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
