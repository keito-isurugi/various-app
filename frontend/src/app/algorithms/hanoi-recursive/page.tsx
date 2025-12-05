/**
 * src/app/algorithms/hanoi-recursive/page.tsx
 *
 * ハノイの塔（再帰）アルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import {
	AlertTriangle,
	BarChart3,
	Binary,
	Code,
	Construction,
	Gamepad2,
	Play,
	Settings,
	Target,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { hanoiExplanation } from "../../../data/explanations/hanoi-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { HanoiRecursiveAlgorithm } from "../../../utils/algorithms/hanoi-recursive";

/**
 * ハノイの塔（再帰）学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function HanoiRecursivePage() {
	// アルゴリズムインスタンス
	const algorithm = new HanoiRecursiveAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customN, setCustomN] = useState("3");

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
	 * 推奨値を設定
	 */
	const setRecommendedValue = useCallback((n: number) => {
		setInput({
			array: [],
			target: n,
			parameters: { n },
		});
		setCustomN(n.toString());
		setResult(null);
	}, []);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			const n = Number.parseInt(customN.trim(), 10);

			if (Number.isNaN(n)) {
				alert("有効な数値を入力してください");
				return;
			}

			if (n < 1) {
				alert("円盤の枚数は1以上である必要があります");
				return;
			}

			if (n > 10) {
				alert("教育目的のため、円盤の枚数は10枚以下に制限されています");
				return;
			}

			setInput({
				array: [],
				target: n,
				parameters: { n },
			});
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customN]);

	// 推奨値を取得
	const recommendedValues = HanoiRecursiveAlgorithm.getRecommendedValues();

	// 現在のnを取得
	const currentN = input.target || input.parameters?.n || 0;

	// 予想移動回数と実行時間を取得
	const expectedMoves = HanoiRecursiveAlgorithm.calculateMinMoves(currentN);
	const estimatedTime = HanoiRecursiveAlgorithm.estimateExecutionTime(currentN);
	const statistics = HanoiRecursiveAlgorithm.getStatistics(currentN);

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
							ハノイの塔（再帰）
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
						ハノイの塔（再帰）
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						分割統治法の美しい実装例で再帰的思考と指数的複雑さを学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								O(2^n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量（指数的）
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
								O(n)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								空間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
								上級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								分割統治
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								手法
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
								実行設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										円盤の枚数:
									</span>
									<div className="font-mono text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">
										{currentN}枚
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										予想移動回数:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{expectedMoves.toLocaleString()}回
									</div>
								</div>
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										予想実行時間:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										{estimatedTime}
									</div>
								</div>
								{currentN > 7 && (
									<div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs text-yellow-800 dark:text-yellow-200">
										<AlertTriangle className="w-3 h-3 inline" /> n {">"}{" "}
										7は計算量が大きいです
									</div>
								)}
							</div>

							{/* カスタム入力 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="custom-n"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										円盤の枚数（1以上10以下）
									</label>
									<input
										id="custom-n"
										type="number"
										min="1"
										max="10"
										value={customN}
										onChange={(e) => setCustomN(e.target.value)}
										placeholder="3"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
								>
									適用
								</button>
							</div>

							{/* 推奨値ボタン */}
							<div className="space-y-2 mb-6">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
									<Target className="w-4 h-4" />
									推奨値
								</h4>
								<div className="grid grid-cols-2 gap-2">
									{recommendedValues.slice(0, 8).map((rec) => (
										<button
											key={rec.n}
											type="button"
											onClick={() => setRecommendedValue(rec.n)}
											className={`py-2 px-3 text-xs rounded transition-colors ${
												currentN === rec.n
													? "bg-purple-600 text-white"
													: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
											}`}
											title={`${rec.description}: ${rec.moves}回移動, ${rec.insight}`}
										>
											{rec.n}枚
											<br />
											<span className="text-xs opacity-75">{rec.moves}回</span>
										</button>
									))}
								</div>
							</div>

							{/* 統計情報 */}
							<div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
								<h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
									<BarChart3 className="w-4 h-4" />
									統計情報
								</h4>
								<div className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
									<div>移動回数: {statistics.totalMoves}回</div>
									<div>関数呼び出し: {statistics.totalCalls}回</div>
									<div>最大深度: {statistics.maxDepth}</div>
									<div>複雑さ: {statistics.timeComplexity}</div>
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
										<Play className="w-4 h-4" />
										ハノイの塔実行
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
												{result.result}
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
											<span className="ml-2 font-mono font-bold text-purple-600 dark:text-purple-400">
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
								<div className="text-6xl mb-4 flex justify-center">
									<Construction className="w-16 h-16 text-purple-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから円盤の枚数を設定し、「ハノイの塔実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={hanoiExplanation}
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
								<code>{`function hanoi(n, from, to, aux) {
    // ベースケース：1枚の円盤なら直接移動
    if (n === 1) {
        console.log(\`円盤1を\${from}から\${to}に移動\`);
        return;
    }
    
    // ステップ1：上のn-1枚を補助杭に移動
    hanoi(n - 1, from, aux, to);
    
    // ステップ2：最下段の円盤を目標杭に移動
    console.log(\`円盤\${n}を\${from}から\${to}に移動\`);
    
    // ステップ3：補助杭のn-1枚を目標杭に移動
    hanoi(n - 1, aux, to, from);
}

// 使用例：3枚の円盤を杭Aから杭Cに移動
hanoi(3, 'A', 'C', 'B');

// 出力：
// 円盤1をAからCに移動
// 円盤2をAからBに移動
// 円盤1をCからBに移動
// 円盤3をAからCに移動
// 円盤1をBからAに移動
// 円盤2をBからCに移動
// 円盤1をAからCに移動

// 移動回数を計算する関数
function calculateMoves(n) {
    return Math.pow(2, n) - 1;
}

console.log(calculateMoves(3)); // 7
console.log(calculateMoves(10)); // 1023

// 注意：この再帰実装は O(2^n) の時間計算量
// 大きなnでは非常に時間がかかります`}</code>
							</pre>
						</div>
					</div>
				</section>

				{/* ルールと戦略セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
						<h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
							<Gamepad2 className="w-5 h-5" />
							ハノイの塔のルールと戦略
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
									 基本ルール
								</h4>
								<ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
									<li>• 3本の杭（A、B、C）と n枚の円盤</li>
									<li>• 全円盤を杭Aから杭Cに移動する</li>
									<li>• 1回につき1枚の円盤しか移動できない</li>
									<li>• 大きい円盤を小さい円盤の上に置けない</li>
									<li>• 杭Bは補助的な作業スペースとして使用</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
									 分割統治戦略
								</h4>
								<ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
									<li>• n枚の問題を3つのサブ問題に分解</li>
									<li>• 上のn-1枚を補助杭に移動</li>
									<li>• 最下段の円盤を目標杭に移動</li>
									<li>• 補助杭のn-1枚を目標杭に移動</li>
									<li>• 各サブ問題は再帰的に解決</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* 数学的性質セクション */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
						<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
							<Binary className="w-4 h-4" />
							数学的性質と洞察
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
									<TrendingUp className="w-4 h-4" />
									計算量の特性
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 最小移動回数：2^n - 1 回</li>
									<li>• 時間計算量：O(2^n) - 指数的増加</li>
									<li>• 空間計算量：O(n) - 再帰の深さ</li>
									<li>• 円盤k の移動回数：2^(k-1) 回</li>
									<li>• n=20で約100万回の移動が必要</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
									<Target className="w-4 h-4" />
									実用的な応用
								</h4>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• バックアップシステムの最適化</li>
									<li>• 並列処理でのタスク分散</li>
									<li>• データ構造の操作戦略</li>
									<li>• プロジェクト管理での依存関係解決</li>
									<li>• 分割統治法の教育例として最適</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
