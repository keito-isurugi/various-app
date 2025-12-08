"use client";

import { AlertTriangle, Calculator, ClipboardList, Info } from "lucide-react";
import Link from "next/link";
import { SaveClearButtons } from "../../components/common/SaveClearButtons";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { ExerciseKey } from "../../types/training-menu";
import { EXERCISE_LABELS } from "../../types/training-menu";
import { estimateOneRM } from "../../utils/training-menu-calculator";

interface ExerciseEstimate {
	weight: number | "";
	reps: number | "";
}

interface EstimatorSettings {
	squat: ExerciseEstimate;
	bench: ExerciseEstimate;
	deadlift: ExerciseEstimate;
}

const DEFAULT_SETTINGS: EstimatorSettings = {
	squat: { weight: "", reps: "" },
	bench: { weight: "", reps: "" },
	deadlift: { weight: "", reps: "" },
};

const EXERCISES: ExerciseKey[] = ["squat", "bench", "deadlift"];

const EXERCISE_BADGES: Record<ExerciseKey, { label: string; color: string }> = {
	squat: { label: "SQ", color: "bg-red-500" },
	bench: { label: "BP", color: "bg-blue-500" },
	deadlift: { label: "DL", color: "bg-green-500" },
};

export default function OneRMEstimatorPage() {
	const {
		data: settings,
		setData: setSettings,
		hasSavedData,
		isSaved,
		save,
		clear,
	} = useLocalStorage({
		key: "one-rm-estimator-settings",
		defaultValue: DEFAULT_SETTINGS,
	});

	const handleWeightChange = (exercise: ExerciseKey, value: number | "") => {
		setSettings((prev) => ({
			...prev,
			[exercise]: { ...prev[exercise], weight: value },
		}));
	};

	const handleRepsChange = (exercise: ExerciseKey, value: number | "") => {
		setSettings((prev) => ({
			...prev,
			[exercise]: { ...prev[exercise], reps: value },
		}));
	};

	const getEstimate = (exercise: ExerciseKey): number => {
		const { weight, reps } = settings[exercise];
		if (weight === "" || reps === "") return 0;
		return estimateOneRM(exercise, weight, reps);
	};

	const hasAnyInput = EXERCISES.some(
		(ex) => settings[ex].weight !== "" || settings[ex].reps !== "",
	);

	const estimates = EXERCISES.map((ex) => ({
		exercise: ex,
		estimate: getEstimate(ex),
	})).filter((e) => e.estimate > 0);

	const totalBig3 = estimates.reduce((sum, e) => sum + e.estimate, 0);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-2xl mx-auto px-4 py-8">
				{/* Header */}
				<header className="text-center mb-8">
					<div className="flex items-center justify-center gap-3 mb-2">
						<Calculator className="w-8 h-8 text-purple-600 dark:text-purple-400" />
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
							1RM推定計算
						</h1>
					</div>
					<p className="text-gray-600 dark:text-gray-400">
						挙げた重量と回数から1RM（最大挙上重量）を推定します
					</p>
				</header>

				{/* Main Content */}
				<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							記録を入力
						</h2>
						<SaveClearButtons
							canSave={hasAnyInput}
							canClear={hasAnyInput || hasSavedData}
							isSaved={isSaved}
							hasSavedData={hasSavedData}
							onSave={save}
							onClear={clear}
						/>
					</div>

					<div className="space-y-4">
						{EXERCISES.map((exercise) => {
							const { weight, reps } = settings[exercise];
							const estimate = getEstimate(exercise);
							const badge = EXERCISE_BADGES[exercise];

							return (
								<div
									key={exercise}
									className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
								>
									{/* 種目名 */}
									<div className="flex items-center gap-2 mb-3">
										<span
											className={`${badge.color} text-white text-xs font-bold px-2 py-1 rounded`}
										>
											{badge.label}
										</span>
										<span className="font-medium text-gray-900 dark:text-gray-100">
											{EXERCISE_LABELS[exercise]}
										</span>
									</div>

									{/* 入力と結果 */}
									<div className="flex items-center gap-3">
										{/* 重量入力 */}
										<div className="flex-1">
											<label
												htmlFor={`${exercise}-weight`}
												className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
											>
												重量
											</label>
											<div className="relative">
												<input
													type="number"
													id={`${exercise}-weight`}
													value={weight}
													onChange={(e) =>
														handleWeightChange(
															exercise,
															e.target.value === ""
																? ""
																: Number(e.target.value),
														)
													}
													placeholder="80"
													min="1"
													max="500"
													className="w-full h-10 px-3 pr-8 text-center font-medium border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
												/>
												<span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
													kg
												</span>
											</div>
										</div>

										<span className="text-gray-400 font-bold mt-5">×</span>

										{/* 回数入力 */}
										<div className="w-20">
											<label
												htmlFor={`${exercise}-reps`}
												className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
											>
												回数
											</label>
											<div className="relative">
												<input
													type="number"
													id={`${exercise}-reps`}
													value={reps}
													onChange={(e) =>
														handleRepsChange(
															exercise,
															e.target.value === ""
																? ""
																: Number(e.target.value),
														)
													}
													placeholder="5"
													min="1"
													max="30"
													className="w-full h-10 px-2 pr-6 text-center font-medium border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
												/>
												<span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
													回
												</span>
											</div>
										</div>

										<span className="text-gray-400 font-bold mt-5">=</span>

										{/* 結果表示 */}
										<div className="w-24">
											<span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
												1RM
											</span>
											{estimate > 0 ? (
												<div className="h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-lg">
													<span className="text-lg font-bold text-purple-700 dark:text-purple-300">
														{estimate}
														<span className="text-xs font-normal ml-0.5">
															kg
														</span>
													</span>
												</div>
											) : (
												<div className="h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-600/50 border border-gray-200 dark:border-gray-600 rounded-lg">
													<span className="text-sm text-gray-400">--</span>
												</div>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{/* BIG3合計 */}
					{estimates.length > 1 && (
						<div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-amber-700 dark:text-amber-300">
										BIG3 合計
									</p>
									<p className="text-xs text-amber-600 dark:text-amber-400">
										{estimates.length}種目の推定1RM合計
									</p>
								</div>
								<p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
									{totalBig3}
									<span className="text-lg font-normal ml-1">kg</span>
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Related Link */}
				<Link
					href="/training-menu"
					className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-md transition-shadow"
				>
					<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
						<ClipboardList className="w-5 h-5 text-white" />
					</div>
					<div>
						<p className="font-medium text-gray-900 dark:text-gray-100">
							トレーニングメニュー
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							推定した1RMでメニューを自動計算
						</p>
					</div>
				</Link>

				{/* Notes */}
				<div className="mt-8 space-y-4">
					<div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
						<Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
						<div className="space-y-1">
							<p className="font-medium text-gray-900 dark:text-gray-100">
								計算式
							</p>
							<ul className="list-disc list-inside space-y-1">
								<li>ベンチプレス: 重量 × 回数 ÷ 40 + 重量</li>
								<li>スクワット・デッドリフト: 重量 × 回数 ÷ 33.3 + 重量</li>
							</ul>
						</div>
					</div>

					<div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
						<AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
						<div className="space-y-1">
							<p className="font-medium text-gray-900 dark:text-gray-100">
								注意事項
							</p>
							<p>
								推定値は目安です。実際の1RM測定時は適切なウォームアップとスポッターを確保してください。
								高回数（10回以上）での推定は誤差が大きくなる傾向があります。
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
