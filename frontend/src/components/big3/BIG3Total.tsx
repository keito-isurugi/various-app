import {
	Activity,
	AlertTriangle,
	Crown,
	Dumbbell,
	Flame,
	Info,
	Scale,
	Sprout,
	Wrench,
	XCircle,
	Zap,
} from "lucide-react";
import type React from "react";
import type { BIG3TotalData, Gender, WeightLevel } from "../../types/big3";
import { validateBodyWeightByGender } from "../../utils/big3-calculator-gender";
import { calculateBIG3TotalByGender } from "../../utils/big3-total-calculator";

interface BIG3TotalProps {
	bodyWeight: number | "";
	gender: Gender;
}

const LEVEL_CONFIG: Record<
	WeightLevel,
	{
		icon: React.ComponentType<{ className?: string }>;
		gradient: string;
		bgColor: string;
	}
> = {
	初心者: {
		icon: Sprout,
		gradient: "from-green-500 to-emerald-600",
		bgColor: "bg-green-500",
	},
	初級者: {
		icon: Dumbbell,
		gradient: "from-blue-500 to-cyan-600",
		bgColor: "bg-blue-500",
	},
	中級者: {
		icon: Flame,
		gradient: "from-orange-500 to-amber-600",
		bgColor: "bg-orange-500",
	},
	上級者: {
		icon: Zap,
		gradient: "from-purple-500 to-violet-600",
		bgColor: "bg-purple-500",
	},
	エリート: {
		icon: Crown,
		gradient: "from-yellow-500 to-orange-600",
		bgColor: "bg-yellow-500",
	},
};

export const BIG3Total: React.FC<BIG3TotalProps> = ({ bodyWeight, gender }) => {
	if (bodyWeight === "") {
		return (
			<div className="text-center py-12">
				<Scale className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
				<p className="text-gray-600 dark:text-gray-400">
					体重を入力すると各レベルのBIG3合計値を確認できます
				</p>
			</div>
		);
	}

	const validation = validateBodyWeightByGender(bodyWeight, gender);
	if (!validation.isValid) {
		return (
			<div className="text-center py-12">
				<AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
				<p className="text-red-600 dark:text-red-400 font-medium mb-1">
					{validation.errorMessage}
				</p>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					有効な範囲で入力してください
				</p>
			</div>
		);
	}

	const totalData = calculateBIG3TotalByGender(bodyWeight, gender);
	if (!totalData) {
		return (
			<div className="text-center py-12">
				<XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
				<p className="text-red-600 dark:text-red-400 font-medium">
					データの計算に失敗しました
				</p>
			</div>
		);
	}

	const renderLevelCard = (level: WeightLevel, data: BIG3TotalData) => {
		const config = LEVEL_CONFIG[level];
		const Icon = config.icon;

		return (
			<div
				key={level}
				className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
			>
				<div
					className={`bg-gradient-to-r ${config.gradient} px-4 py-3 flex items-center gap-3`}
				>
					<Icon className="w-5 h-5 text-white" />
					<h3 className="font-bold text-white">{level}</h3>
				</div>

				<div className="p-4 space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
							<Dumbbell className="w-4 h-4" />
							ベンチプレス
						</span>
						<span className="font-medium text-gray-900 dark:text-gray-100">
							{data.benchPress}kg
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
							<Activity className="w-4 h-4" />
							スクワット
						</span>
						<span className="font-medium text-gray-900 dark:text-gray-100">
							{data.squat}kg
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
							<Wrench className="w-4 h-4" />
							デッドリフト
						</span>
						<span className="font-medium text-gray-900 dark:text-gray-100">
							{data.deadlift}kg
						</span>
					</div>

					<div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
						<span className="font-medium text-gray-700 dark:text-gray-300">
							合計
						</span>
						<span
							className={`text-xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
						>
							{data.total}kg
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
					BIG3合計値
				</h2>
				<p className="text-gray-600 dark:text-gray-400">
					体重{" "}
					<span className="font-semibold text-blue-600 dark:text-blue-400">
						{bodyWeight}kg
					</span>{" "}
					での各レベル目標
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
				{Object.entries(totalData).map(([level, data]) =>
					renderLevelCard(level as WeightLevel, data),
				)}
			</div>

			<div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
				<Info className="w-4 h-4 shrink-0 mt-0.5" />
				<p>
					BIG3合計値はベンチプレス・スクワット・デッドリフトの合計重量です。体重別の一般的な指標であり、個人差があります。
				</p>
			</div>
		</div>
	);
};
