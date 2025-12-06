"use client";

import { Calendar } from "lucide-react";
import type {
	ExerciseKey,
	ExerciseProgram,
	WeeklyFrequency,
} from "../../types/training-menu";
import {
	EXERCISE_LABELS,
	EXERCISE_SHORT_LABELS,
} from "../../types/training-menu";

interface ProgramTableProps {
	exercise: ExerciseKey;
	program: ExerciseProgram;
	oneRM: number;
	frequency: WeeklyFrequency;
}

export function ProgramTable({
	exercise,
	program,
	oneRM,
	frequency,
}: ProgramTableProps) {
	const showLightDay = frequency === 2;

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
			{/* Header */}
			<div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span className="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">
							{EXERCISE_SHORT_LABELS[exercise]}
						</span>
						<div className="flex items-center gap-2">
							<Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								{EXERCISE_LABELS[exercise]} - MAXアップ プログラム
							</h3>
						</div>
					</div>
					<span className="text-sm text-gray-500 dark:text-gray-400">
						1RM: {oneRM} kg
					</span>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
							<th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
								週
							</th>
							<th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
								強度
							</th>
							<th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
								回数 × セット
							</th>
							{showLightDay ? (
								<>
									<th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
										<span className="inline-flex items-center gap-1">
											<span className="w-2 h-2 bg-red-500 rounded-full" />A
											(Heavy)
										</span>
									</th>
									<th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
										<span className="inline-flex items-center gap-1">
											<span className="w-2 h-2 bg-blue-500 rounded-full" />B
											(Light)
										</span>
									</th>
								</>
							) : (
								<th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
									重量
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{program.weeks.map((week, index) => {
							const isDeloadWeek = index === program.weeks.length - 1;
							return (
								<tr
									key={week.week}
									className={`border-b border-gray-100 dark:border-gray-700 ${
										isDeloadWeek
											? "bg-blue-50 dark:bg-blue-900/20"
											: "hover:bg-gray-50 dark:hover:bg-gray-700/50"
									}`}
								>
									<td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
										Week {week.week}
										{isDeloadWeek && (
											<span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
												(調整週)
											</span>
										)}
									</td>
									<td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
										{week.intensityPercent}%
									</td>
									<td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
										{week.reps}回 × {week.sets}セット
									</td>
									{showLightDay ? (
										<>
											<td className="px-4 py-3 text-center">
												<span className="font-bold text-red-600 dark:text-red-400">
													{week.weightHeavy} kg
												</span>
											</td>
											<td className="px-4 py-3 text-center">
												<span className="font-bold text-blue-600 dark:text-blue-400">
													{week.weightLight} kg
												</span>
											</td>
										</>
									) : (
										<td className="px-4 py-3 text-center">
											<span className="font-bold text-gray-900 dark:text-gray-100">
												{week.weightHeavy} kg
											</span>
										</td>
									)}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Footer note */}
			<div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
				{showLightDay
					? "A (Heavy): メインセッション / B (Light): Aから-5%でリカバリー重視"
					: "RPE8〜9目安（失敗しない重量で確実に挙げる）"}
			</div>
		</div>
	);
}
