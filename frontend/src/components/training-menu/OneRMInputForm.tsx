"use client";

import { AlertCircle } from "lucide-react";
import type {
	ExerciseKey,
	OneRMInput,
	WeightIncrement,
} from "../../types/training-menu";
import { EXERCISE_LABELS } from "../../types/training-menu";
import { validateOneRM } from "../../utils/training-menu-calculator";

interface OneRMInputFormProps {
	input: OneRMInput;
	onInputChange: (exercise: ExerciseKey, value: number | "") => void;
	increment: WeightIncrement;
	onIncrementChange: (increment: WeightIncrement) => void;
}

const WEIGHT_INCREMENTS: WeightIncrement[] = [1.25, 2.5, 5];
const EXERCISES: ExerciseKey[] = ["squat", "bench", "deadlift"];

export function OneRMInputForm({
	input,
	onInputChange,
	increment,
	onIncrementChange,
}: OneRMInputFormProps) {
	const handleInputChange = (
		exercise: ExerciseKey,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = e.target.value;
		if (value === "") {
			onInputChange(exercise, "");
		} else {
			const numValue = Number(value);
			if (!Number.isNaN(numValue)) {
				onInputChange(exercise, numValue);
			}
		}
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{EXERCISES.map((exercise) => {
					const value = input[exercise];
					const validation = value !== "" ? validateOneRM(value) : null;
					const hasError = validation && !validation.isValid;

					return (
						<div key={exercise} className="space-y-2">
							<label
								htmlFor={`input-${exercise}`}
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								{EXERCISE_LABELS[exercise]} 1RM
							</label>
							<div className="relative">
								<input
									id={`input-${exercise}`}
									type="number"
									inputMode="decimal"
									min="1"
									max="500"
									step="0.5"
									value={value}
									onChange={(e) => handleInputChange(exercise, e)}
									placeholder="kg"
									className={`
										w-full px-4 py-3 pr-12 text-lg font-medium
										border rounded-lg
										bg-white dark:bg-gray-800
										text-gray-900 dark:text-gray-100
										placeholder-gray-400 dark:placeholder-gray-500
										focus:outline-none focus:ring-2 focus:ring-blue-500
										${hasError ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
									`}
								/>
								<span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
									kg
								</span>
							</div>
							{hasError && (
								<div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
									<AlertCircle className="w-4 h-4" />
									<span>{validation.errorMessage}</span>
								</div>
							)}
						</div>
					);
				})}
			</div>

			<div className="flex items-center gap-4">
				<label
					htmlFor="increment-select"
					className="text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					重量刻み
				</label>
				<select
					id="increment-select"
					value={increment}
					onChange={(e) =>
						onIncrementChange(Number(e.target.value) as WeightIncrement)
					}
					className="
						px-4 py-2 text-sm
						border border-gray-300 dark:border-gray-600 rounded-lg
						bg-white dark:bg-gray-800
						text-gray-900 dark:text-gray-100
						focus:outline-none focus:ring-2 focus:ring-blue-500
					"
				>
					{WEIGHT_INCREMENTS.map((inc) => (
						<option key={inc} value={inc}>
							{inc} kg
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
