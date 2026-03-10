"use client";

import type { StepDefinition } from "@/types/pokemon-select-bug";

interface StepExplanationProps {
	step: StepDefinition;
	currentStep: number;
	totalSteps: number;
	experience: number;
}

function formatExp(exp: number): string {
	return exp.toLocaleString();
}

export function StepExplanation({
	step,
	currentStep,
	totalSteps,
	experience,
}: StepExplanationProps) {
	return (
		<div className="flex flex-col h-full">
			{/* ステップ番号 */}
			<div className="flex items-center gap-2 mb-2">
				<span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
					{currentStep + 1} / {totalSteps}
				</span>
				<h3 className="font-bold text-base text-gray-800 dark:text-gray-200">
					{step.title}
				</h3>
			</div>

			{/* 説明文 */}
			<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
				{step.description}
			</p>

			{/* 技術的詳細 */}
			<div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-3 border border-gray-200 dark:border-gray-700">
				<div className="flex items-center gap-1 mb-1">
					<span className="text-xs font-bold text-gray-500 dark:text-gray-400">
						技術解説
					</span>
				</div>
				<p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
					{step.technicalDetail}
				</p>
			</div>

			{/* ステータス表示 */}
			<div className="mt-auto grid grid-cols-2 gap-2">
				<div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center">
					<div className="text-[10px] text-gray-500 dark:text-gray-400">
						入れ替えフラグ
					</div>
					<div
						className={`font-bold text-sm ${
							step.menuItemToSwap !== 0
								? "text-red-600 dark:text-red-400"
								: "text-gray-400 dark:text-gray-500"
						}`}
					>
						{step.menuItemToSwap !== 0 ? `${step.menuItemToSwap}番目` : "OFF"}
					</div>
				</div>
				<div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center">
					<div className="text-[10px] text-gray-500 dark:text-gray-400">
						経験値
					</div>
					<div className="font-bold text-sm text-gray-700 dark:text-gray-300">
						{formatExp(experience)}
					</div>
				</div>
			</div>
		</div>
	);
}
