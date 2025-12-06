"use client";

import { Clock, Dumbbell, Target, TrendingUp } from "lucide-react";
import type {
	ExerciseKey,
	ExerciseTrainingMenu,
	TrainingMenu,
} from "../../types/training-menu";
import {
	EXERCISE_LABELS,
	EXERCISE_SHORT_LABELS,
} from "../../types/training-menu";

interface TrainingMenuCardProps {
	exercise: ExerciseKey;
	menu: ExerciseTrainingMenu;
	oneRM: number;
}

interface MenuSectionProps {
	title: string;
	menu: TrainingMenu;
	colorClass: string;
	icon: React.ReactNode;
}

function MenuSection({ title, menu, colorClass, icon }: MenuSectionProps) {
	return (
		<div className={`p-4 rounded-lg ${colorClass}`}>
			<div className="flex items-center gap-2 mb-3">
				{icon}
				<h4 className="font-semibold text-gray-900 dark:text-gray-100">
					{title}
				</h4>
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
						<Dumbbell className="w-4 h-4" />
						<span className="text-sm">使用重量</span>
					</div>
					<span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{menu.weight} kg
					</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
						<Target className="w-4 h-4" />
						<span className="text-sm">回数 × セット</span>
					</div>
					<span className="text-lg font-medium text-gray-900 dark:text-gray-100">
						{menu.reps}回 × {menu.sets}セット
					</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
						<Clock className="w-4 h-4" />
						<span className="text-sm">休憩目安</span>
					</div>
					<span className="text-lg font-medium text-gray-900 dark:text-gray-100">
						{menu.restTime.min}〜{menu.restTime.max}分
					</span>
				</div>

				{menu.note && (
					<p className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
						{menu.note}
					</p>
				)}
			</div>
		</div>
	);
}

export function TrainingMenuCard({
	exercise,
	menu,
	oneRM,
}: TrainingMenuCardProps) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
			<div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded">
							{EXERCISE_SHORT_LABELS[exercise]}
						</span>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							{EXERCISE_LABELS[exercise]}
						</h3>
					</div>
					<span className="text-sm text-gray-500 dark:text-gray-400">
						1RM: {oneRM} kg
					</span>
				</div>
			</div>

			<div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<MenuSection
					title="MAXアップ day"
					menu={menu.strength}
					colorClass="bg-red-50 dark:bg-red-900/20"
					icon={
						<TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
					}
				/>
				<MenuSection
					title="筋肥大 day"
					menu={menu.hypertrophy}
					colorClass="bg-green-50 dark:bg-green-900/20"
					icon={
						<Target className="w-5 h-5 text-green-600 dark:text-green-400" />
					}
				/>
			</div>
		</div>
	);
}
