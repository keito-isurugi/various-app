import type {
	Category,
	CategoryProgress,
	DailyProgress,
	MonthlyProgress,
	Todo,
	WeeklyProgress,
} from "@/types/todo";

export const calculateDailyProgress = (
	todos: Todo[],
	date: Date,
): DailyProgress => {
	const completedDuration = todos
		.filter((todo) => todo.completed)
		.reduce((sum, todo) => sum + todo.duration, 0);

	const totalDuration = todos.reduce((sum, todo) => sum + todo.duration, 0);

	return {
		date,
		completedDuration,
		totalDuration,
		percentage:
			totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0,
	};
};

export const calculateWeeklyProgress = (
	todos: Todo[],
	date: Date,
): WeeklyProgress => {
	const weekStart = getWeekStart(date);
	const weekEnd = getWeekEnd(date);

	const completedDuration = todos
		.filter((todo) => todo.completed)
		.reduce((sum, todo) => sum + todo.duration, 0);

	const totalDuration = todos.reduce((sum, todo) => sum + todo.duration, 0);

	return {
		weekStart,
		weekEnd,
		completedDuration,
		totalDuration,
		percentage:
			totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0,
	};
};

export const calculateMonthlyProgress = (
	todos: Todo[],
	date: Date,
): MonthlyProgress => {
	const month = date.getMonth();
	const year = date.getFullYear();

	const completedDuration = todos
		.filter((todo) => todo.completed)
		.reduce((sum, todo) => sum + todo.duration, 0);

	const totalDuration = todos.reduce((sum, todo) => sum + todo.duration, 0);

	return {
		month,
		year,
		completedDuration,
		totalDuration,
		percentage:
			totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0,
	};
};

export const calculateCategoryProgress = (
	todos: Todo[],
	categories: Category[],
): CategoryProgress[] => {
	return categories.map((category) => {
		const categoryTodos = todos.filter(
			(todo) => todo.categoryId === category.id,
		);
		const completedDuration = categoryTodos
			.filter((todo) => todo.completed)
			.reduce((sum, todo) => sum + todo.duration, 0);
		const totalDuration = categoryTodos.reduce(
			(sum, todo) => sum + todo.duration,
			0,
		);

		return {
			categoryId: category.id,
			categoryTitle: category.title,
			completedDuration,
			totalDuration,
			percentage:
				totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0,
		};
	});
};

export const getWeekStart = (date: Date): Date => {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day;
	return new Date(d.setDate(diff));
};

export const getWeekEnd = (date: Date): Date => {
	const weekStart = getWeekStart(date);
	const weekEnd = new Date(weekStart);
	weekEnd.setDate(weekStart.getDate() + 6);
	return weekEnd;
};

export const getMonthStart = (date: Date): Date => {
	return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getMonthEnd = (date: Date): Date => {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const formatDuration = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours === 0) return `${mins}分`;
	if (mins === 0) return `${hours}時間`;
	return `${hours}時間${mins}分`;
};
