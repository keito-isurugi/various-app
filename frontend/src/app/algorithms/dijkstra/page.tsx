"use client";

import Link from "next/link";
import { useState } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { dijkstraExplanation } from "../../../data/explanations/dijkstra-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { DijkstraAlgorithm } from "../../../utils/algorithms/dijkstra";

/**
 * ダイクストラ法の実装ページ
 */
export default function DijkstraPage() {
	const algorithm = new DijkstraAlgorithm();
	const defaultInput = DijkstraAlgorithm.getDefaultInput();

	const [input, setInput] = useState<AlgorithmInput>(defaultInput);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isCalculating, setIsCalculating] = useState(false);

	/**
	 * アルゴリズムを実行
	 */
	const handleCalculate = () => {
		setIsCalculating(true);
		setResult(null);

		setTimeout(() => {
			const calculationResult = algorithm.execute(input);
			setResult(calculationResult);
			setIsCalculating(false);
		}, 300);
	};

	return (
		<div className="max-w-7xl mx-auto p-4">
			{/* パンくずリスト */}
			<nav className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
				<Link href="/" className="hover:text-blue-600 transition-colors">
					ホーム
				</Link>
				<span>/</span>
				<Link
					href="/algorithms"
					className="hover:text-blue-600 transition-colors"
				>
					アルゴリズム
				</Link>
				<span>/</span>
				<Link
					href="/algorithms/graph-shortest-path"
					className="hover:text-blue-600 transition-colors"
				>
					グラフの最短経路
				</Link>
				<span>/</span>
				<span className="text-gray-900 dark:text-gray-100">ダイクストラ法</span>
			</nav>

			{/* ヘッダー */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-4">ダイクストラ法</h1>
				<p className="text-gray-600 dark:text-gray-400">
					単一始点最短経路問題を効率的に解くアルゴリズムです。
					非負の重みを持つグラフで、始点から全ての頂点への最短距離を計算します。
				</p>
			</div>

			{/* アルゴリズム情報 */}
			<div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
				<h2 className="text-xl font-semibold mb-4">アルゴリズム情報</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							時間計算量
						</p>
						<p className="font-mono">{algorithm.info.timeComplexity.average}</p>
					</div>
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							空間計算量
						</p>
						<p className="font-mono">{algorithm.info.spaceComplexity}</p>
					</div>
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400">カテゴリ</p>
						<p>{algorithm.info.category}</p>
					</div>
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400">難易度</p>
						<p>{algorithm.info.difficulty}</p>
					</div>
				</div>
			</div>

			{/* 実行ボタン */}
			<div className="mb-8">
				<button
					type="button"
					onClick={handleCalculate}
					disabled={isCalculating}
					className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
				>
					{isCalculating ? "計算中..." : "計算実行"}
				</button>
			</div>

			{/* ビジュアライザー */}
			{result && (
				<div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
					<h2 className="text-xl font-semibold mb-4">ビジュアライザー</h2>
					<AlgorithmVisualizer
						steps={result.steps}
						algorithmType="graph"
						speed={1000}
					/>
				</div>
			)}

			{/* 詳細説明 */}
			<div className="mt-12">
				<CalculationExplanation explanationData={dijkstraExplanation} />
			</div>
		</div>
	);
}
