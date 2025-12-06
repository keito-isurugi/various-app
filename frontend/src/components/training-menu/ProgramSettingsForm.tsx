"use client";

import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { useState } from "react";
import type {
	ProgramDuration,
	ProgramSettings,
	WeeklyFrequency,
} from "../../types/training-menu";

interface ProgramSettingsFormProps {
	settings: ProgramSettings;
	onSettingsChange: (settings: ProgramSettings) => void;
}

const DURATION_OPTIONS: { value: ProgramDuration; label: string }[] = [
	{ value: 4, label: "4週間" },
	{ value: 6, label: "6週間" },
	{ value: 8, label: "8週間" },
];

const FREQUENCY_OPTIONS: { value: WeeklyFrequency; label: string }[] = [
	{ value: 1, label: "週1回" },
	{ value: 2, label: "週2回" },
];

export function ProgramSettingsForm({
	settings,
	onSettingsChange,
}: ProgramSettingsFormProps) {
	const [isExpanded, setIsExpanded] = useState(true);

	const handleDurationChange = (duration: ProgramDuration) => {
		onSettingsChange({ ...settings, duration });
	};

	const handleFrequencyChange = (frequency: WeeklyFrequency) => {
		onSettingsChange({ ...settings, frequency });
	};

	return (
		<div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
			>
				<div className="flex items-center gap-2">
					<Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					<span className="font-medium text-gray-900 dark:text-gray-100">
						MAXアップ プログラム設定
					</span>
				</div>
				{isExpanded ? (
					<ChevronUp className="w-5 h-5 text-gray-500" />
				) : (
					<ChevronDown className="w-5 h-5 text-gray-500" />
				)}
			</button>

			{isExpanded && (
				<div className="p-4 bg-white dark:bg-gray-800 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* プログラム期間 */}
						<div className="space-y-2">
							<label
								htmlFor="program-duration"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								プログラム期間
							</label>
							<select
								id="program-duration"
								value={settings.duration}
								onChange={(e) =>
									handleDurationChange(
										Number(e.target.value) as ProgramDuration,
									)
								}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{DURATION_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{/* 週間頻度 */}
						<div className="space-y-2">
							<label
								htmlFor="weekly-frequency"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								週間頻度
							</label>
							<select
								id="weekly-frequency"
								value={settings.frequency}
								onChange={(e) =>
									handleFrequencyChange(
										Number(e.target.value) as WeeklyFrequency,
									)
								}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{FREQUENCY_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{settings.frequency === 2 && (
						<p className="text-sm text-gray-500 dark:text-gray-400">
							週2回の場合：A（Heavy）と B（Light: -5%）の2枠で表示されます
						</p>
					)}
				</div>
			)}
		</div>
	);
}
