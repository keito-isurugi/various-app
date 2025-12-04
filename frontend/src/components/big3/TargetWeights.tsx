import { Crown, Dumbbell, Flame, Sprout, Zap } from "lucide-react";
import type React from "react";
import { LEVEL_ORDER } from "../../data/big3-data";
import type { ExerciseType, Gender, WeightLevel } from "../../types/big3";
import {
	calculateLevelWeightsByGender,
	getWeightRangeMessageByGender,
	validateBodyWeightByGender,
} from "../../utils/big3-calculator-gender";
import { BIG3Total } from "./BIG3Total";

interface TargetWeightsProps {
	bodyWeight: number | "";
	gender: Gender;
	compact?: boolean;
	className?: string;
}

const LEVEL_CONFIG: Record<
	WeightLevel,
	{
		icon: React.ComponentType<{ className?: string }>;
		bgColor: string;
		textColor: string;
	}
> = {
	初心者: {
		icon: Sprout,
		bgColor: "bg-green-100 dark:bg-green-900/30",
		textColor: "text-green-700 dark:text-green-400",
	},
	初級者: {
		icon: Dumbbell,
		bgColor: "bg-blue-100 dark:bg-blue-900/30",
		textColor: "text-blue-700 dark:text-blue-400",
	},
	中級者: {
		icon: Flame,
		bgColor: "bg-orange-100 dark:bg-orange-900/30",
		textColor: "text-orange-700 dark:text-orange-400",
	},
	上級者: {
		icon: Zap,
		bgColor: "bg-purple-100 dark:bg-purple-900/30",
		textColor: "text-purple-700 dark:text-purple-400",
	},
	エリート: {
		icon: Crown,
		bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
		textColor: "text-yellow-700 dark:text-yellow-400",
	},
};

export const TargetWeights: React.FC<TargetWeightsProps> = ({
	bodyWeight,
	gender,
	compact = false,
	className = "",
}) => {
	const exercises: ExerciseType[] = [
		"ベンチプレス",
		"スクワット",
		"デッドリフト",
	];

	if (bodyWeight === "") {
		return (
			<div className={`text-center py-12 ${className}`}>
				<Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
				<p className="text-gray-600 dark:text-gray-400">
					体重を入力すると各レベルの目標重量が表示されます
				</p>
			</div>
		);
	}

	const validation = validateBodyWeightByGender(bodyWeight, gender);
	if (!validation.isValid) {
		return (
			<div className={`text-center py-12 ${className}`}>
				<p className="text-red-600 dark:text-red-400 font-medium mb-1">
					{validation.errorMessage}
				</p>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					{getWeightRangeMessageByGender(gender)}
				</p>
			</div>
		);
	}

	return (
		<div className={className}>
			<div className="text-center mb-6">
				<h2
					className={`font-bold text-gray-900 dark:text-gray-100 ${compact ? "text-lg" : "text-2xl"}`}
				>
					目標重量
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mt-1">
					体重{" "}
					<span className="font-semibold text-blue-600 dark:text-blue-400">
						{bodyWeight}kg
					</span>
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3 mb-8">
				{exercises.map((exercise) => {
					const levelWeights = calculateLevelWeightsByGender(
						bodyWeight,
						exercise,
						gender,
					);

					if (!levelWeights) {
						return (
							<div
								key={exercise}
								className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
							>
								<h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
									{exercise}
								</h3>
								<p className="text-red-600 dark:text-red-400 text-sm">
									データを取得できませんでした
								</p>
							</div>
						);
					}

					return (
						<div
							key={exercise}
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
						>
							<div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
								<h3 className="font-bold text-gray-900 dark:text-gray-100 text-center">
									{exercise}
								</h3>
							</div>

							<div className="p-3 space-y-2">
								{LEVEL_ORDER.map((level) => {
									const weight = levelWeights[level];
									const displayWeight = Number.isInteger(weight)
										? weight
										: weight.toFixed(1);
									const config = LEVEL_CONFIG[level];
									const Icon = config.icon;

									return (
										<div
											key={level}
											className={`flex justify-between items-center px-3 py-2 rounded-lg ${config.bgColor}`}
										>
											<span
												className={`font-medium flex items-center gap-2 ${config.textColor}`}
											>
												<Icon className="w-4 h-4" />
												{level}
											</span>
											<span className={`font-bold ${config.textColor}`}>
												{displayWeight}kg
											</span>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>

			<BIG3Total bodyWeight={bodyWeight} gender={gender} />
		</div>
	);
};
