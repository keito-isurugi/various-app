/**
 * src/components/algorithm/AlgorithmVisualizer.tsx
 *
 * アルゴリズムの可視化コンポーネント
 * 配列操作を視覚的に表現し、ステップ実行をサポート
 */

"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import type {
	AlgorithmStep,
	ExecutionState,
	VisualizationElement,
} from "../../types/algorithm";

interface AlgorithmVisualizerProps {
	/** 実行ステップの配列 */
	steps: AlgorithmStep[];
	/** 初期表示するステップ（デフォルト: 0） */
	initialStep?: number;
	/** 自動実行の速度（ミリ秒、デフォルト: 1000） */
	autoPlaySpeed?: number;
	/** 実行速度（旧互換性のため） */
	speed?: number;
	/** アルゴリズムのタイプ（配列系またはグラフ系） */
	algorithmType?: "array" | "graph";
	/** 追加のCSSクラス */
	className?: string;
}

/**
 * アルゴリズム可視化コンポーネント
 * ステップ実行とアニメーションで学習効果を向上
 */
export const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
	steps,
	initialStep = 0,
	autoPlaySpeed = 1000,
	speed,
	algorithmType = "array",
	className = "",
}) => {
	// 実行状態の管理
	const [executionState, setExecutionState] = useState<ExecutionState>({
		isRunning: false,
		isPaused: false,
		currentStep: initialStep,
		speed: speed || autoPlaySpeed,
		autoPlay: false,
	});

	// 現在のステップデータ
	const currentStepData = steps[executionState.currentStep] || steps[0];

	/**
	 * 配列要素を可視化用データに変換
	 */
	const getVisualizationElements = useCallback((): VisualizationElement[] => {
		if (!currentStepData || !currentStepData.array) return [];

		return currentStepData.array.map((value, index) => {
			let state: VisualizationElement["state"] = "normal";
			let color = "";

			// 比較中の要素
			if (currentStepData.comparing?.includes(index)) {
				state = "comparing";
				color = "bg-yellow-400 border-yellow-600";
			}
			// 発見された要素
			else if (currentStepData.foundIndex === index) {
				state = "found";
				color = "bg-green-400 border-green-600";
			}
			// 探索範囲内
			else if (
				currentStepData.searchRange &&
				index >= currentStepData.searchRange.start &&
				index <= currentStepData.searchRange.end
			) {
				state = "searching";
				color = "bg-blue-200 border-blue-400";
			}
			// 探索範囲外
			else {
				state = "excluded";
				color = "bg-gray-200 border-gray-400";
			}

			return {
				value,
				index,
				state,
				color,
				isAnimating: false,
			};
		});
	}, [currentStepData]);

	const visualElements = getVisualizationElements();

	/**
	 * 次のステップに進む
	 */
	const nextStep = useCallback(() => {
		setExecutionState((prev) => ({
			...prev,
			currentStep: Math.min(prev.currentStep + 1, steps.length - 1),
		}));
	}, [steps.length]);

	/**
	 * 前のステップに戻る
	 */
	const prevStep = useCallback(() => {
		setExecutionState((prev) => ({
			...prev,
			currentStep: Math.max(prev.currentStep - 1, 0),
		}));
	}, []);

	/**
	 * 自動実行の開始/停止
	 */
	const toggleAutoPlay = useCallback(() => {
		setExecutionState((prev) => ({
			...prev,
			autoPlay: !prev.autoPlay,
			isRunning: !prev.autoPlay,
		}));
	}, []);

	/**
	 * リセット（最初のステップに戻る）
	 */
	const reset = useCallback(() => {
		setExecutionState((prev) => ({
			...prev,
			currentStep: 0,
			autoPlay: false,
			isRunning: false,
			isPaused: false,
		}));
	}, []);

	/**
	 * 自動実行のタイマー効果
	 */
	useEffect(() => {
		if (!executionState.autoPlay || !executionState.isRunning) {
			return;
		}

		const timer = setTimeout(() => {
			if (executionState.currentStep < steps.length - 1) {
				nextStep();
			} else {
				// 最後のステップに到達したら自動実行を停止
				setExecutionState((prev) => ({
					...prev,
					autoPlay: false,
					isRunning: false,
				}));
			}
		}, executionState.speed);

		return () => clearTimeout(timer);
	}, [
		executionState.autoPlay,
		executionState.isRunning,
		executionState.currentStep,
		executionState.speed,
		nextStep,
		steps.length,
	]);

	/**
	 * 状態表示のアイコンを取得
	 */
	const getStateIcon = (state: VisualizationElement["state"]): string => {
		switch (state) {
			case "comparing":
				return "🔍";
			case "found":
				return "✅";
			case "searching":
				return "🎯";
			case "excluded":
				return "❌";
			default:
				return "⚪";
		}
	};

	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}
		>
			{/* ヘッダー：現在のステップ情報 */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						アルゴリズム実行 - ステップ {executionState.currentStep + 1} /{" "}
						{steps.length}
					</h3>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						操作: {currentStepData?.operation || "待機中"}
					</div>
				</div>

				{/* 現在のステップの説明 */}
				<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
					<p className="text-blue-900 dark:text-blue-100 font-medium">
						{currentStepData?.description || "実行準備中..."}
					</p>
				</div>
			</div>

			{/* 配列の可視化 */}
			<div className="mb-6">
				<h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
					配列の状態
				</h4>
				<div className="flex flex-wrap gap-2 justify-center">
					{visualElements.map((element) => (
						<div
							key={element.index}
							className={`
								relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300 min-w-[60px]
								${element.color}
								hover:scale-105 hover:shadow-md
							`}
						>
							{/* 要素の値 */}
							<div className="text-lg font-bold text-gray-800 dark:text-gray-100">
								{element.value}
							</div>

							{/* インデックス */}
							<div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
								[{element.index}]
							</div>

							{/* 状態アイコン */}
							<div className="absolute -top-2 -right-2 text-sm">
								{getStateIcon(element.state)}
							</div>
						</div>
					))}
				</div>

				{/* 探索範囲の表示 */}
				{currentStepData?.searchRange && (
					<div className="mt-4 text-center">
						<div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm text-blue-800 dark:text-blue-200">
							<span>探索範囲:</span>
							<span className="font-mono font-bold">
								[{currentStepData.searchRange.start},{" "}
								{currentStepData.searchRange.end}]
							</span>
						</div>
					</div>
				)}
			</div>

			{/* 変数の状態表示 */}
			{currentStepData?.variables &&
				Object.keys(currentStepData.variables).length > 0 && (
					<div className="mb-6">
						<h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
							変数の値
						</h4>
						<div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
								{Object.entries(currentStepData.variables).map(
									([key, value]) => (
										<div key={key} className="text-center">
											<div className="text-xs text-gray-600 dark:text-gray-400 uppercase">
												{key}
											</div>
											<div className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">
												{String(value)}
											</div>
										</div>
									),
								)}
							</div>
						</div>
					</div>
				)}

			{/* コントロールパネル */}
			<div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
				{/* ステップ制御ボタン */}
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={reset}
						className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
						aria-label="リセット"
					>
						⏮️ リセット
					</button>

					<button
						type="button"
						onClick={prevStep}
						disabled={executionState.currentStep <= 0}
						className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
						aria-label="前のステップ"
					>
						⏪ 前へ
					</button>

					<button
						type="button"
						onClick={toggleAutoPlay}
						className={`px-4 py-2 rounded-lg transition-colors text-white ${
							executionState.autoPlay
								? "bg-red-500 hover:bg-red-600"
								: "bg-green-500 hover:bg-green-600"
						}`}
					>
						{executionState.autoPlay ? "⏸️ 停止" : "▶️ 自動実行"}
					</button>

					<button
						type="button"
						onClick={nextStep}
						disabled={executionState.currentStep >= steps.length - 1}
						className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
						aria-label="次のステップ"
					>
						次へ ⏩
					</button>
				</div>

				{/* 実行速度調整 */}
				<div className="flex items-center gap-3">
					<label
						htmlFor="speed-slider"
						className="text-sm text-gray-600 dark:text-gray-400"
					>
						実行速度:
					</label>
					<input
						id="speed-slider"
						type="range"
						min={200}
						max={3000}
						step={200}
						value={executionState.speed}
						onChange={(e) =>
							setExecutionState((prev) => ({
								...prev,
								speed: Number(e.target.value),
							}))
						}
						className="w-24"
					/>
					<span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">
						{executionState.speed}ms
					</span>
				</div>
			</div>

			{/* 凡例 */}
			<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
				<h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
					凡例
				</h4>
				<div className="flex flex-wrap gap-4 text-sm">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-yellow-400 border border-yellow-600 rounded" />
						<span className="text-gray-600 dark:text-gray-400">比較中</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-green-400 border border-green-600 rounded" />
						<span className="text-gray-600 dark:text-gray-400">発見</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded" />
						<span className="text-gray-600 dark:text-gray-400">探索範囲</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded" />
						<span className="text-gray-600 dark:text-gray-400">探索済み</span>
					</div>
				</div>
			</div>
		</div>
	);
};
