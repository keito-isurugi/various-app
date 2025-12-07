"use client";

import { Calculator, X } from "lucide-react";
import { useState } from "react";
import type { ExerciseKey } from "../../types/training-menu";
import { EXERCISE_LABELS } from "../../types/training-menu";
import { estimateOneRM } from "../../utils/training-menu-calculator";

interface OneRMEstimatorProps {
	onApply: (exercise: ExerciseKey, estimatedOneRM: number) => void;
	onClose: () => void;
}

export function OneRMEstimator({ onApply, onClose }: OneRMEstimatorProps) {
	const [exercise, setExercise] = useState<ExerciseKey>("bench");
	const [weight, setWeight] = useState<number | "">("");
	const [reps, setReps] = useState<number | "">("");

	const estimatedOneRM =
		weight !== "" && reps !== "" ? estimateOneRM(exercise, weight, reps) : 0;

	const handleApply = () => {
		if (estimatedOneRM > 0) {
			onApply(exercise, estimatedOneRM);
			onClose();
		}
	};

	const exercises: ExerciseKey[] = ["squat", "bench", "deadlift"];

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-md shadow-xl">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center gap-2">
						<Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							1RM推定
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Content */}
				<div className="p-4 space-y-4">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						重量と回数から1RMを推定します。推定値は上の入力欄に反映されます。
					</p>

					{/* Exercise Select */}
					<div className="space-y-2">
						<label
							htmlFor="estimate-exercise"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							種目
						</label>
						<select
							id="estimate-exercise"
							value={exercise}
							onChange={(e) => setExercise(e.target.value as ExerciseKey)}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{exercises.map((ex) => (
								<option key={ex} value={ex}>
									{EXERCISE_LABELS[ex]}
								</option>
							))}
						</select>
					</div>

					{/* Weight & Reps */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label
								htmlFor="estimate-weight"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								重量 (kg)
							</label>
							<input
								type="number"
								id="estimate-weight"
								value={weight}
								onChange={(e) =>
									setWeight(e.target.value === "" ? "" : Number(e.target.value))
								}
								placeholder="例: 80"
								min="1"
								max="500"
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="estimate-reps"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								回数
							</label>
							<input
								type="number"
								id="estimate-reps"
								value={reps}
								onChange={(e) =>
									setReps(e.target.value === "" ? "" : Number(e.target.value))
								}
								placeholder="例: 5"
								min="1"
								max="30"
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					{/* Formula Info */}
					<div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs text-gray-500 dark:text-gray-400">
						<p className="font-medium mb-1">計算式:</p>
						<p>ベンチプレス: 重量 × 回数 ÷ 40 + 重量</p>
						<p>スクワット・デッドリフト: 重量 × 回数 ÷ 33.3 + 重量</p>
					</div>

					{/* Result */}
					{estimatedOneRM > 0 && (
						<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
							<p className="text-sm text-blue-700 dark:text-blue-300 mb-1">
								推定1RM
							</p>
							<p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
								{estimatedOneRM} kg
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
					>
						キャンセル
					</button>
					<button
						type="button"
						onClick={handleApply}
						disabled={estimatedOneRM <= 0}
						className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							estimatedOneRM > 0
								? "bg-blue-600 text-white hover:bg-blue-700"
								: "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
						}`}
					>
						適用する
					</button>
				</div>
			</div>
		</div>
	);
}
