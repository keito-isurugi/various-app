"use client";

import { Badge } from "@/components/ui/badge";
import type { Todo } from "@/types/todo";
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import { ja } from "date-fns/locale";

interface MonthViewProps {
	currentDate: Date;
	selectedDate: Date;
	todos: Todo[];
	onSelectDate: (date: Date) => void;
	onTodoClick?: (todo: Todo) => void;
}

export function MonthView({
	currentDate,
	selectedDate,
	todos,
	onSelectDate,
	onTodoClick,
}: MonthViewProps) {
	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);
	const calendarStart = startOfWeek(monthStart);
	const calendarEnd = endOfWeek(monthEnd);

	const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
	const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

	const getTodosForDate = (date: Date) => {
		return todos.filter((todo) => isSameDay(new Date(todo.date), date));
	};

	return (
		<div>
			<div className="grid grid-cols-7 gap-px bg-border mb-px">
				{weekDays.map((day) => (
					<div
						key={day}
						className="bg-muted p-2 text-center text-sm font-medium"
					>
						{day}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-px bg-border">
				{days.map((day) => {
					const dayTodos = getTodosForDate(day);
					const isSelected = isSameDay(day, selectedDate);
					const isCurrentMonth = isSameMonth(day, currentDate);
					const isToday = isSameDay(day, new Date());

					return (
						<button
							type="button"
							key={day.toISOString()}
							onClick={() => onSelectDate(day)}
							className={`
                bg-background p-2 min-h-[150px] text-left hover:bg-accent transition-colors flex flex-col
                ${!isCurrentMonth ? "opacity-40" : ""}
                ${isSelected ? "ring-2 ring-primary" : ""}
              `}
						>
							<div className="flex items-start justify-between mb-2 flex-shrink-0">
								<span
									className={`
                    text-xs font-medium
                    ${isToday ? "bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-[10px]" : ""}
                  `}
								>
									{format(day, "d")}
								</span>
								{dayTodos.length > 0 && (
									<Badge variant="secondary" className="text-[10px] h-4 px-1">
										{dayTodos.length}
									</Badge>
								)}
							</div>

							<div className="space-y-1 flex-1 overflow-hidden">
								{dayTodos.slice(0, 4).map((todo) => (
									<div
										key={todo.id}
										onClick={(e) => {
											e.stopPropagation();
											onTodoClick?.(todo);
										}}
										className={`
                      text-xs p-1 rounded truncate cursor-pointer hover:opacity-80
                      ${todo.completed ? "bg-muted text-muted-foreground line-through" : "bg-primary/10 text-primary"}
                    `}
										title={todo.title}
									>
										{todo.title}
									</div>
								))}
								{dayTodos.length > 4 && (
									<div className="text-xs text-muted-foreground pl-1">
										+{dayTodos.length - 4}件
									</div>
								)}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
