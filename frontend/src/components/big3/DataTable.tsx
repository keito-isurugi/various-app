import type React from "react";
import { LEVEL_ORDER } from "../../data/big3-data";
import type { ExerciseType, Gender, WeightLevel } from "../../types/big3";
import { getBIG3DataByGender } from "../../utils/big3-calculator-gender";

interface DataTableProps {
	exercise: ExerciseType;
	gender: Gender;
	highlightBodyWeight?: number;
	compact?: boolean;
	className?: string;
}

const getLevelHeaderColor = (level: WeightLevel): string => {
	switch (level) {
		case "初心者":
			return "text-green-700 dark:text-green-400";
		case "初級者":
			return "text-blue-700 dark:text-blue-400";
		case "中級者":
			return "text-orange-700 dark:text-orange-400";
		case "上級者":
			return "text-purple-700 dark:text-purple-400";
		case "エリート":
			return "text-yellow-700 dark:text-yellow-400";
		default:
			return "text-gray-700 dark:text-gray-300";
	}
};

export const DataTable: React.FC<DataTableProps> = ({
	exercise,
	gender,
	highlightBodyWeight,
	compact = false,
	className = "",
}) => {
	const exerciseData = getBIG3DataByGender(gender)[exercise];

	const isHighlighted = (bodyWeight: number): boolean => {
		if (!highlightBodyWeight) return false;
		return Math.abs(bodyWeight - highlightBodyWeight) < 2.5;
	};

	return (
		<div className={`${compact ? "text-sm" : ""} ${className}`}>
			<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
				{exercise}
			</h2>

			<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead className="bg-gray-50 dark:bg-gray-800">
						<tr>
							<th
								scope="col"
								className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
							>
								体重
							</th>
							{LEVEL_ORDER.map((level) => (
								<th
									key={level}
									scope="col"
									className={`px-4 py-3 text-center text-sm font-semibold ${getLevelHeaderColor(level)}`}
								>
									{level}
								</th>
							))}
						</tr>
					</thead>

					<tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
						{exerciseData.map((data) => {
							const highlighted = isHighlighted(data.bodyWeight);

							return (
								<tr
									key={data.bodyWeight}
									className={
										highlighted
											? "bg-blue-50 dark:bg-blue-900/20"
											: "hover:bg-gray-50 dark:hover:bg-gray-800"
									}
								>
									<td
										className={`px-4 py-2.5 text-sm font-medium ${
											highlighted
												? "text-blue-900 dark:text-blue-300"
												: "text-gray-900 dark:text-gray-100"
										}`}
									>
										{data.bodyWeight}kg
									</td>

									{LEVEL_ORDER.map((level) => (
										<td
											key={level}
											className={`px-4 py-2.5 text-sm text-center ${
												highlighted
													? "text-blue-900 dark:text-blue-300"
													: "text-gray-700 dark:text-gray-300"
											}`}
										>
											{data[level]}
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{highlightBodyWeight && (
				<p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
					体重 {highlightBodyWeight}kg 付近の行がハイライトされています
				</p>
			)}
		</div>
	);
};
