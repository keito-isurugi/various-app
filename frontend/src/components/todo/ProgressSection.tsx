"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCategories } from "@/hooks/useCategories";
import {
	calculateCategoryProgress,
	calculateDailyProgress,
	calculateMonthlyProgress,
	calculateWeeklyProgress,
	formatDuration,
	getMonthEnd,
	getMonthStart,
	getWeekEnd,
	getWeekStart,
} from "@/lib/todo/progressUtils";
import { todoService } from "@/lib/todo/todoService";
import type { Todo } from "@/types/todo";
import { useEffect, useState } from "react";

interface ProgressSectionProps {
	selectedDate: Date;
}

export function ProgressSection({ selectedDate }: ProgressSectionProps) {
	const [dailyTodos, setDailyTodos] = useState<Todo[]>([]);
	const [weeklyTodos, setWeeklyTodos] = useState<Todo[]>([]);
	const [monthlyTodos, setMonthlyTodos] = useState<Todo[]>([]);
	const { categories } = useCategories();

	useEffect(() => {
		const fetchData = async () => {
			const daily = await todoService.getTodosByDate(selectedDate);
			setDailyTodos(daily);

			const weekStart = getWeekStart(selectedDate);
			const weekEnd = getWeekEnd(selectedDate);
			const weekly = await todoService.getTodosByDateRange(weekStart, weekEnd);
			setWeeklyTodos(weekly);

			const monthStart = getMonthStart(selectedDate);
			const monthEnd = getMonthEnd(selectedDate);
			const monthly = await todoService.getTodosByDateRange(
				monthStart,
				monthEnd,
			);
			setMonthlyTodos(monthly);
		};

		fetchData();
	}, [selectedDate]);

	const dailyProgress = calculateDailyProgress(dailyTodos, selectedDate);
	const weeklyProgress = calculateWeeklyProgress(weeklyTodos, selectedDate);
	const monthlyProgress = calculateMonthlyProgress(monthlyTodos, selectedDate);
	const categoryProgress = calculateCategoryProgress(monthlyTodos, categories);

	return (
		<Card>
			<CardHeader>
				<CardTitle>進捗状況</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="font-medium">日次進捗</span>
						<span className="text-muted-foreground">
							{formatDuration(dailyProgress.completedDuration)} /{" "}
							{formatDuration(dailyProgress.totalDuration)}
						</span>
					</div>
					<Progress value={dailyProgress.percentage} />
					<p className="text-xs text-muted-foreground text-right">
						{dailyProgress.percentage.toFixed(0)}%
					</p>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="font-medium">週次進捗</span>
						<span className="text-muted-foreground">
							{formatDuration(weeklyProgress.completedDuration)} /{" "}
							{formatDuration(weeklyProgress.totalDuration)}
						</span>
					</div>
					<Progress value={weeklyProgress.percentage} />
					<p className="text-xs text-muted-foreground text-right">
						{weeklyProgress.percentage.toFixed(0)}%
					</p>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="font-medium">月次進捗</span>
						<span className="text-muted-foreground">
							{formatDuration(monthlyProgress.completedDuration)} /{" "}
							{formatDuration(monthlyProgress.totalDuration)}
						</span>
					</div>
					<Progress value={monthlyProgress.percentage} />
					<p className="text-xs text-muted-foreground text-right">
						{monthlyProgress.percentage.toFixed(0)}%
					</p>
				</div>

				{categoryProgress.length > 0 &&
					categoryProgress.some((cp) => cp.totalDuration > 0) && (
						<div className="space-y-3 pt-2 border-t">
							<p className="text-sm font-medium">カテゴリ別進捗（今月）</p>
							{categoryProgress
								.filter((cp) => cp.totalDuration > 0)
								.map((cp) => (
									<div key={cp.categoryId} className="space-y-1">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">
												{cp.categoryTitle}
											</span>
											<span className="text-muted-foreground text-xs">
												{formatDuration(cp.completedDuration)} /{" "}
												{formatDuration(cp.totalDuration)}
											</span>
										</div>
										<Progress value={cp.percentage} className="h-2" />
									</div>
								))}
						</div>
					)}
			</CardContent>
		</Card>
	);
}
