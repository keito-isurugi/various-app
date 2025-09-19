export interface Todo {
	id: string;
	title: string;
	description?: string;
	date: Date;
	duration: number; // minutes
	categoryId?: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Category {
	id: string;
	title: string;
	description?: string;
	color: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface TodoFormData {
	title: string;
	description?: string;
	date: Date;
	duration: number;
	categoryId?: string;
}

export interface CategoryFormData {
	title: string;
	description?: string;
	color: string;
}

export type FilterType = "all" | "incomplete" | "completed";

export type CalendarViewMode = "month" | "week" | "day";

export interface ProgressData {
	completedDuration: number;
	totalDuration: number;
	percentage: number;
}

export interface DailyProgress extends ProgressData {
	date: Date;
}

export interface WeeklyProgress extends ProgressData {
	weekStart: Date;
	weekEnd: Date;
}

export interface MonthlyProgress extends ProgressData {
	month: number;
	year: number;
}

export interface CategoryProgress extends ProgressData {
	categoryId: string;
	categoryTitle: string;
}
