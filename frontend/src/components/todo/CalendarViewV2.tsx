"use client";

import { TodoFormModal } from "@/components/todo/TodoFormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/hooks/useCategories";
import { todoService } from "@/lib/todo/todoService";
import { type CalendarViewMode, Category, type Todo } from "@/types/todo";
import {
	addDays,
	addMonths,
	addWeeks,
	endOfDay,
	endOfMonth,
	endOfWeek,
	format,
	startOfDay,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { DayView } from "./calendar/DayView";
import { MonthView } from "./calendar/MonthView";
import { WeekView } from "./calendar/WeekView";

interface CalendarViewV2Props {
	selectedDate: Date;
	onSelectDate: (date: Date) => void;
}

export function CalendarViewV2({
	selectedDate,
	onSelectDate,
}: CalendarViewV2Props) {
	const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
	const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
	const [todos, setTodos] = useState<Todo[]>([]);
	const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const { categories } = useCategories();

	useEffect(() => {
		const fetchTodos = async () => {
			let start: Date;
			let end: Date;

			switch (viewMode) {
				case "month":
					start = startOfWeek(startOfMonth(currentDate));
					end = endOfWeek(endOfMonth(currentDate));
					break;
				case "week":
					start = startOfWeek(currentDate);
					end = endOfWeek(currentDate);
					break;
				case "day":
					start = startOfDay(currentDate);
					end = endOfDay(currentDate);
					break;
			}

			const fetchedTodos = await todoService.getTodosByDateRange(start, end);
			setTodos(fetchedTodos);
		};

		fetchTodos();
	}, [currentDate, viewMode]);

	const handlePrevious = () => {
		switch (viewMode) {
			case "month":
				setCurrentDate(addMonths(currentDate, -1));
				break;
			case "week":
				setCurrentDate(addWeeks(currentDate, -1));
				break;
			case "day":
				setCurrentDate(addDays(currentDate, -1));
				break;
		}
	};

	const handleNext = () => {
		switch (viewMode) {
			case "month":
				setCurrentDate(addMonths(currentDate, 1));
				break;
			case "week":
				setCurrentDate(addWeeks(currentDate, 1));
				break;
			case "day":
				setCurrentDate(addDays(currentDate, 1));
				break;
		}
	};

	const handleToday = () => {
		setCurrentDate(new Date());
	};

	const getTitle = () => {
		switch (viewMode) {
			case "month":
				return format(currentDate, "yyyy年 M月", { locale: ja });
			case "week": {
				const weekStart = startOfWeek(currentDate);
				const weekEnd = endOfWeek(currentDate);
				return `${format(weekStart, "M月d日", { locale: ja })} - ${format(weekEnd, "M月d日", { locale: ja })}`;
			}
			case "day":
				return format(currentDate, "yyyy年 M月d日（E）", { locale: ja });
		}
	};

	const handleTodoClick = (todo: Todo) => {
		setEditingTodo(todo);
		setIsEditModalOpen(true);
	};

	const handleTodoUpdate = async (data: any) => {
		if (editingTodo) {
			await todoService.updateTodo(editingTodo.id, data);
			// Refresh todos
			const start =
				viewMode === "month"
					? startOfWeek(startOfMonth(currentDate))
					: viewMode === "week"
						? startOfWeek(currentDate)
						: startOfDay(currentDate);
			const end =
				viewMode === "month"
					? endOfWeek(endOfMonth(currentDate))
					: viewMode === "week"
						? endOfWeek(currentDate)
						: endOfDay(currentDate);
			const fetchedTodos = await todoService.getTodosByDateRange(start, end);
			setTodos(fetchedTodos);
		}
	};

	const handleTodoDelete = async () => {
		if (editingTodo) {
			await todoService.deleteTodo(editingTodo.id);
			// Refresh todos
			const start =
				viewMode === "month"
					? startOfWeek(startOfMonth(currentDate))
					: viewMode === "week"
						? startOfWeek(currentDate)
						: startOfDay(currentDate);
			const end =
				viewMode === "month"
					? endOfWeek(endOfMonth(currentDate))
					: viewMode === "week"
						? endOfWeek(currentDate)
						: endOfDay(currentDate);
			const fetchedTodos = await todoService.getTodosByDateRange(start, end);
			setTodos(fetchedTodos);
			setIsEditModalOpen(false);
			setEditingTodo(null);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between mb-4">
					<CardTitle>{getTitle()}</CardTitle>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={handleToday}>
							今日
						</Button>
						<Button variant="outline" size="icon" onClick={handlePrevious}>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="icon" onClick={handleNext}>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<Tabs
					value={viewMode}
					onValueChange={(v) => setViewMode(v as CalendarViewMode)}
				>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="month">月</TabsTrigger>
						<TabsTrigger value="week">週</TabsTrigger>
						<TabsTrigger value="day">日</TabsTrigger>
					</TabsList>
				</Tabs>
			</CardHeader>

			<CardContent>
				{viewMode === "month" && (
					<MonthView
						currentDate={currentDate}
						selectedDate={selectedDate}
						todos={todos}
						onSelectDate={onSelectDate}
						onTodoClick={handleTodoClick}
					/>
				)}
				{viewMode === "week" && (
					<WeekView
						currentDate={currentDate}
						selectedDate={selectedDate}
						todos={todos}
						onSelectDate={onSelectDate}
						onTodoClick={handleTodoClick}
					/>
				)}
				{viewMode === "day" && (
					<DayView
						currentDate={currentDate}
						todos={todos}
						onSelectDate={onSelectDate}
						onTodoClick={handleTodoClick}
					/>
				)}
			</CardContent>

			<TodoFormModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setEditingTodo(null);
				}}
				onSubmit={async (data) => {
					await handleTodoUpdate(data);
					setIsEditModalOpen(false);
					setEditingTodo(null);
				}}
				onDelete={handleTodoDelete}
				categories={categories}
				initialData={editingTodo || undefined}
				selectedDate={selectedDate}
			/>
		</Card>
	);
}
