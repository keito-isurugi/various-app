"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface StepControlsProps {
	currentStep: number;
	totalSteps: number;
	onPrev: () => void;
	onNext: () => void;
	onReset: () => void;
}

export function StepControls({
	currentStep,
	totalSteps,
	onPrev,
	onNext,
	onReset,
}: StepControlsProps) {
	const isFirst = currentStep === 0;
	const isLast = currentStep === totalSteps - 1;

	return (
		<div className="flex items-center justify-center gap-3">
			<button
				type="button"
				onClick={onReset}
				className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
			>
				<RotateCcw size={14} />
				リセット
			</button>

			<button
				type="button"
				onClick={onPrev}
				disabled={isFirst}
				className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
			>
				<ChevronLeft size={16} />
				戻る
			</button>

			{/* プログレスバー */}
			<div className="flex gap-1">
				{Array.from({ length: totalSteps }, (_, i) => (
					<div
						key={`step-dot-${i}`}
						className={`w-2 h-2 rounded-full transition-all duration-300 ${
							i === currentStep
								? "bg-blue-600 dark:bg-blue-400 scale-125"
								: i < currentStep
									? "bg-blue-300 dark:bg-blue-700"
									: "bg-gray-300 dark:bg-gray-600"
						}`}
					/>
				))}
			</div>

			<button
				type="button"
				onClick={onNext}
				disabled={isLast}
				className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
			>
				次へ
				<ChevronRight size={16} />
			</button>
		</div>
	);
}
