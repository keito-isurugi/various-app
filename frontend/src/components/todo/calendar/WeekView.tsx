"use client";

import { Badge } from "@/components/ui/badge";
import type { Todo } from "@/types/todo";
import {
	eachDayOfInterval,
	endOfWeek,
	format,
	isSameDay,
	startOfWeek,
} from "date-fns";
import { ja } from "date-fns/locale";

interface WeekViewProps {
	currentDate: Date;
	selectedDate: Date;
	todos: Todo[];
	onSelectDate: (date: Date) => void;
	onTodoClick?: (todo: Todo) => void;
}

export function WeekView({
	currentDate,
	selectedDate,
	todos,
	onSelectDate,
	onTodoClick,
}: WeekViewProps) {
	const weekStart = startOfWeek(currentDate);
	const weekEnd = endOfWeek(currentDate);
	const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

	const getTodosForDate = (date: Date) => {
		return todos.filter((todo) => isSameDay(new Date(todo.date), date));
	};

	return (
		<div className="overflow-auto max-h-[600px]">
			<div className="grid grid-cols-7 gap-px bg-border">
				{days.map((day) => {
					const isSelected = isSameDay(day, selectedDate);
					const isToday = isSameDay(day, new Date());
					const dayTodos = getTodosForDate(day);

					return (
						<button
							type="button"
							key={day.toISOString()}
							onClick={() => onSelectDate(day)}
							className={`
                bg-background p-3 text-left min-h-[200px] hover:bg-accent transition-colors flex flex-col
                ${isSelected ? "ring-2 ring-primary" : ""}
                ${isToday ? "bg-primary/5" : ""}
              `}
						>
							<div className="flex items-start justify-between mb-2 flex-shrink-0">
								<div>
									<div className="text-xs text-muted-foreground">
										{format(day, "E", { locale: ja })}
									</div>
									<div
										className={`
                      text-xs font-medium
                      ${isToday ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center" : ""}
                    `}
									>
										{format(day, "d")}
									</div>
								</div>
								{dayTodos.length > 0 && (
									<Badge variant="secondary" className="text-[10px] h-4 px-1">
										{dayTodos.length}
									</Badge>
								)}
							</div>
							<div className="space-y-1 flex-1 overflow-hidden">
								{dayTodos.slice(0, 5).map((todo) => (
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
									>
										{todo.title}
									</div>
								))}
								{dayTodos.length > 5 && (
									<div className="text-xs text-muted-foreground">
										+{dayTodos.length - 5}件
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
