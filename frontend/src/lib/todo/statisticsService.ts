import type { Category, Todo } from "@/types/todo";
import {
	eachDayOfInterval,
	eachMonthOfInterval,
	eachWeekOfInterval,
	endOfDay,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	isSameWeek,
	startOfDay,
	startOfMonth,
	startOfWeek,
	subDays,
	subMonths,
	subWeeks,
} from "date-fns";
import { ja } from "date-fns/locale";

export interface PeriodStats {
	completedCount: number;
	totalCount: number;
	completedDuration: number;
	totalDuration: number;
	completionRate: number;
}

export interface DailyStats {
	date: string;
	completedCount: number;
	completedDuration: number;
}

export interface CategoryStats {
	categoryId: string;
	categoryName: string;
	completedCount: number;
	totalCount: number;
	completedDuration: number;
	totalDuration: number;
	completionRate: number;
}

export const statisticsService = {
	// 期間内のTODOをフィルタリング
	filterTodosByPeriod(todos: Todo[], startDate: Date, endDate: Date): Todo[] {
		return todos.filter((todo) => {
			const todoDate = new Date(todo.date);
			return todoDate >= startDate && todoDate <= endDate;
		});
	},

	// 期間の統計を計算
	calculatePeriodStats(todos: Todo[]): PeriodStats {
		const completedTodos = todos.filter((t) => t.completed);
		const completedDuration = completedTodos.reduce(
			(sum, t) => sum + t.duration,
			0,
		);
		const totalDuration = todos.reduce((sum, t) => sum + t.duration, 0);

		return {
			completedCount: completedTodos.length,
			totalCount: todos.length,
			completedDuration,
			totalDuration,
			completionRate:
				todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0,
		};
	},

	// 今日の統計
	getTodayStats(todos: Todo[]): PeriodStats {
		const today = new Date();
		const todayTodos = this.filterTodosByPeriod(
			todos,
			startOfDay(today),
			endOfDay(today),
		);
		return this.calculatePeriodStats(todayTodos);
	},

	// 今週の統計
	getThisWeekStats(todos: Todo[]): PeriodStats {
		const today = new Date();
		const weekTodos = this.filterTodosByPeriod(
			todos,
			startOfWeek(today),
			endOfWeek(today),
		);
		return this.calculatePeriodStats(weekTodos);
	},

	// 今月の統計
	getThisMonthStats(todos: Todo[]): PeriodStats {
		const today = new Date();
		const monthTodos = this.filterTodosByPeriod(
			todos,
			startOfMonth(today),
			endOfMonth(today),
		);
		return this.calculatePeriodStats(monthTodos);
	},

	// 過去N日間の日別統計
	getDailyStats(todos: Todo[], days = 7): DailyStats[] {
		const today = new Date();
		const startDate = startOfDay(subDays(today, days - 1));
		const endDate = endOfDay(today);

		const dates = eachDayOfInterval({ start: startDate, end: endDate });

		return dates.map((date) => {
			const dayTodos = todos.filter((todo) =>
				isSameDay(new Date(todo.date), date),
			);
			const completedTodos = dayTodos.filter((t) => t.completed);
			const completedDuration = completedTodos.reduce(
				(sum, t) => sum + t.duration,
				0,
			);

			return {
				date: format(date, "M/d", { locale: ja }),
				completedCount: completedTodos.length,
				completedDuration,
			};
		});
	},

	// 過去N週間の週別統計
	getWeeklyStats(todos: Todo[], weeks = 4): DailyStats[] {
		const today = new Date();
		const startDate = startOfWeek(subWeeks(today, weeks - 1));
		const endDate = endOfWeek(today);

		const weekStarts = eachWeekOfInterval({ start: startDate, end: endDate });

		return weekStarts.map((weekStart) => {
			const weekEnd = endOfWeek(weekStart);
			const weekTodos = todos.filter((todo) => {
				const todoDate = new Date(todo.date);
				return todoDate >= weekStart && todoDate <= weekEnd;
			});
			const completedTodos = weekTodos.filter((t) => t.completed);
			const completedDuration = completedTodos.reduce(
				(sum, t) => sum + t.duration,
				0,
			);

			return {
				date: format(weekStart, "M/d", { locale: ja }),
				completedCount: completedTodos.length,
				completedDuration,
			};
		});
	},

	// 過去Nヶ月の月別統計
	getMonthlyStats(todos: Todo[], months = 6): DailyStats[] {
		const today = new Date();
		const startDate = startOfMonth(subMonths(today, months - 1));
		const endDate = endOfMonth(today);

		const monthStarts = eachMonthOfInterval({ start: startDate, end: endDate });

		return monthStarts.map((monthStart) => {
			const monthEnd = endOfMonth(monthStart);
			const monthTodos = todos.filter((todo) => {
				const todoDate = new Date(todo.date);
				return todoDate >= monthStart && todoDate <= monthEnd;
			});
			const completedTodos = monthTodos.filter((t) => t.completed);
			const completedDuration = completedTodos.reduce(
				(sum, t) => sum + t.duration,
				0,
			);

			return {
				date: format(monthStart, "M月", { locale: ja }),
				completedCount: completedTodos.length,
				completedDuration,
			};
		});
	},

	// カテゴリ別統計
	getCategoryStats(todos: Todo[], categories: Category[]): CategoryStats[] {
		return categories
			.map((category) => {
				const categoryTodos = todos.filter((t) => t.categoryId === category.id);
				const stats = this.calculatePeriodStats(categoryTodos);

				return {
					categoryId: category.id,
					categoryName: category.title,
					...stats,
				};
			})
			.filter((stat) => stat.totalCount > 0); // TODOがあるカテゴリのみ
	},

	// 平均完了時間（1タスクあたり）
	getAverageCompletionTime(todos: Todo[]): number {
		const completedTodos = todos.filter((t) => t.completed);
		if (completedTodos.length === 0) return 0;

		const totalDuration = completedTodos.reduce(
			(sum, t) => sum + t.duration,
			0,
		);
		return totalDuration / completedTodos.length;
	},

	// 完了率の推移（過去7日間）
	getCompletionRateTrend(
		todos: Todo[],
		days = 7,
	): { date: string; rate: number }[] {
		const today = new Date();
		const startDate = startOfDay(subDays(today, days - 1));
		const endDate = endOfDay(today);

		const dates = eachDayOfInterval({ start: startDate, end: endDate });

		return dates.map((date) => {
			const dayTodos = todos.filter((todo) =>
				isSameDay(new Date(todo.date), date),
			);
			const completedCount = dayTodos.filter((t) => t.completed).length;
			const rate =
				dayTodos.length > 0 ? (completedCount / dayTodos.length) * 100 : 0;

			return {
				date: format(date, "M/d", { locale: ja }),
				rate: Math.round(rate),
			};
		});
	},
};
