"use client";

import { AlertTriangle, Dumbbell, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { OneRMInputForm } from "../../components/training-menu/OneRMInputForm";
import { TrainingMenuCard } from "../../components/training-menu/TrainingMenuCard";
import type {
	ExerciseKey,
	OneRMInput,
	WeightIncrement,
} from "../../types/training-menu";
import { calculateAllMenus } from "../../utils/training-menu-calculator";

const EXERCISES: ExerciseKey[] = ["squat", "bench", "deadlift"];

export default function TrainingMenuPage() {
	const [input, setInput] = useState<OneRMInput>({
		squat: "",
		bench: "",
		deadlift: "",
	});
	const [increment, setIncrement] = useState<WeightIncrement>(2.5);

	const handleInputChange = (exercise: ExerciseKey, value: number | "") => {
		setInput((prev) => ({ ...prev, [exercise]: value }));
	};

	const menus = useMemo(
		() => calculateAllMenus(input, increment),
		[input, increment],
	);

	const hasAnyInput = Object.values(input).some((v) => v !== "");
	const hasAnyMenu = Object.keys(menus).length > 0;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Header */}
				<header className="text-center mb-8">
					<div className="flex items-center justify-center gap-3 mb-2">
						<Dumbbell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
							BIG3 トレーニングメニュー
						</h1>
					</div>
					<p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
						1RM（最大挙上重量）を入力すると、MAXアップ向けと筋肥大向けのトレーニングメニューを自動計算します
					</p>
				</header>

				{/* Input Section */}
				<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						1RMを入力
					</h2>
					<OneRMInputForm
						input={input}
						onInputChange={handleInputChange}
						increment={increment}
						onIncrementChange={setIncrement}
					/>
				</div>

				{/* Results Section */}
				{hasAnyInput && (
					<div className="space-y-6">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
							トレーニングメニュー
						</h2>

						{hasAnyMenu ? (
							<div className="space-y-6">
								{EXERCISES.map((exercise) => {
									const menu = menus[exercise];
									const oneRM = input[exercise];
									if (!menu || oneRM === "") return null;

									return (
										<TrainingMenuCard
											key={exercise}
											exercise={exercise}
											menu={menu}
											oneRM={oneRM}
										/>
									);
								})}
							</div>
						) : (
							<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
								<div className="flex items-start gap-3">
									<AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
									<p className="text-yellow-800 dark:text-yellow-200">
										有効な1RM値を入力してください（1kg〜500kg）
									</p>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Notes */}
				<div className="mt-8 space-y-4">
					<div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
						<Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
						<div className="space-y-1">
							<p className="font-medium text-gray-900 dark:text-gray-100">
								使い方
							</p>
							<p>
								各種目の1RM（最大挙上重量）をkg単位で入力してください。重量刻みを変更すると、使用重量が再計算されます。
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
						<AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
						<div className="space-y-1">
							<p className="font-medium text-gray-900 dark:text-gray-100">
								注意事項
							</p>
							<p>
								MAXアップメニューは高強度（85%
								1RM）のため、適切なフォームと十分なウォームアップを行ってください。
								無理な重量への挑戦は怪我の原因となります。
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
						<Dumbbell className="w-5 h-5 shrink-0 mt-0.5 text-gray-500" />
						<div className="space-y-1">
							<p className="font-medium text-gray-900 dark:text-gray-100">
								メニュー仕様
							</p>
							<ul className="list-disc list-inside space-y-1">
								<li>MAXアップ day: 85% 1RM × 3回 × 5セット（休憩3〜5分）</li>
								<li>筋肥大 day: 70% 1RM × 8回 × 4セット（休憩1.5〜3分）</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
