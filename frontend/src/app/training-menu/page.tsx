"use client";

import {
	AlertTriangle,
	Calendar,
	Check,
	Copy,
	Dumbbell,
	Info,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SaveClearButtons } from "../../components/common/SaveClearButtons";
import { OneRMInputForm } from "../../components/training-menu/OneRMInputForm";
import { ProgramSettingsForm } from "../../components/training-menu/ProgramSettingsForm";
import { ProgramTable } from "../../components/training-menu/ProgramTable";
import { TrainingMenuCard } from "../../components/training-menu/TrainingMenuCard";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type {
	ExerciseKey,
	OneRMInput,
	ProgramSettings,
	WeightIncrement,
} from "../../types/training-menu";
import {
	calculateAllMenus,
	calculateAllPrograms,
	formatAllDailyMenusForCopy,
	formatAllProgramsForCopy,
} from "../../utils/training-menu-calculator";

const EXERCISES: ExerciseKey[] = ["squat", "bench", "deadlift"];

type ViewMode = "daily" | "program";

interface TrainingMenuSettings {
	input: OneRMInput;
	increment: WeightIncrement;
	viewMode: ViewMode;
	programSettings: ProgramSettings;
}

const DEFAULT_SETTINGS: TrainingMenuSettings = {
	input: { squat: "", bench: "", deadlift: "" },
	increment: 2.5,
	viewMode: "daily",
	programSettings: { duration: 4, frequency: 1 },
};

export default function TrainingMenuPage() {
	const {
		data: settings,
		setData: setSettings,
		hasSavedData,
		isSaved,
		save,
		clear,
	} = useLocalStorage({
		key: "training-menu-settings",
		defaultValue: DEFAULT_SETTINGS,
	});

	const [isCopied, setIsCopied] = useState(false);

	const { input, increment, viewMode, programSettings } = settings;

	const handleInputChange = (exercise: ExerciseKey, value: number | "") => {
		setSettings((prev) => ({
			...prev,
			input: { ...prev.input, [exercise]: value },
		}));
	};

	const setIncrement = (increment: WeightIncrement) => {
		setSettings((prev) => ({ ...prev, increment }));
	};

	const setViewMode = (viewMode: ViewMode) => {
		setSettings((prev) => ({ ...prev, viewMode }));
	};

	const setProgramSettings = (programSettings: ProgramSettings) => {
		setSettings((prev) => ({ ...prev, programSettings }));
	};

	const menus = useMemo(
		() => calculateAllMenus(input, increment),
		[input, increment],
	);

	const programs = useMemo(
		() => calculateAllPrograms(input, increment, programSettings),
		[input, increment, programSettings],
	);

	const hasAnyInput = Object.values(input).some((v) => v !== "");
	const hasAnyMenu = Object.keys(menus).length > 0;
	const hasAnyProgram = Object.keys(programs).length > 0;

	const handleCopyAll = async () => {
		const text =
			viewMode === "daily"
				? formatAllDailyMenusForCopy(input, menus)
				: formatAllProgramsForCopy(
						input,
						programs,
						programSettings.frequency,
						programSettings.duration,
					);

		try {
			await navigator.clipboard.writeText(text);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} catch {
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = text;
			textArea.style.position = "fixed";
			textArea.style.left = "-9999px";
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		}
	};

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
				<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							1RMを入力
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
					<OneRMInputForm
						input={input}
						onInputChange={handleInputChange}
						increment={increment}
						onIncrementChange={setIncrement}
					/>
				</div>

				{/* View Mode Toggle */}
				<div className="flex gap-2 mb-6">
					<button
						type="button"
						onClick={() => setViewMode("daily")}
						className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
							viewMode === "daily"
								? "bg-blue-600 text-white"
								: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
						}`}
					>
						<Dumbbell className="w-5 h-5" />
						当日メニュー
					</button>
					<button
						type="button"
						onClick={() => setViewMode("program")}
						className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
							viewMode === "program"
								? "bg-red-600 text-white"
								: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
						}`}
					>
						<Calendar className="w-5 h-5" />
						MAXアップ プログラム
					</button>
				</div>

				{/* Program Settings (only shown in program mode) */}
				{viewMode === "program" && (
					<div className="mb-6">
						<ProgramSettingsForm
							settings={programSettings}
							onSettingsChange={setProgramSettings}
						/>
					</div>
				)}

				{/* Results Section */}
				{hasAnyInput && (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
								{viewMode === "daily"
									? "トレーニングメニュー"
									: `MAXアップ ${programSettings.duration}週間プログラム`}
							</h2>
							{((viewMode === "daily" && hasAnyMenu) ||
								(viewMode === "program" && hasAnyProgram)) && (
								<button
									type="button"
									onClick={handleCopyAll}
									className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
										isCopied
											? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
									}`}
								>
									{isCopied ? (
										<>
											<Check className="w-4 h-4" />
											コピーしました
										</>
									) : (
										<>
											<Copy className="w-4 h-4" />
											すべてコピー
										</>
									)}
								</button>
							)}
						</div>

						{viewMode === "daily" ? (
							// Daily Menu View
							hasAnyMenu ? (
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
							)
						) : // Program View
						hasAnyProgram ? (
							<div className="space-y-6">
								{EXERCISES.map((exercise) => {
									const program = programs[exercise];
									const oneRM = input[exercise];
									if (!program || oneRM === "") return null;

									return (
										<ProgramTable
											key={exercise}
											exercise={exercise}
											program={program}
											oneRM={oneRM}
											frequency={programSettings.frequency}
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
								MAXアップメニューは高強度のため、適切なフォームと十分なウォームアップを行ってください。
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
								<li>
									当日メニュー: MAXアップ day (85% 1RM) / 筋肥大 day (70% 1RM)
								</li>
								<li>
									MAXアッププログラム:
									4/6/8週間の漸進的プログラム（最終週は調整週）
								</li>
								<li>
									週2回の場合: A (Heavy) と B (Light: -5%) の2セッション構成
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
