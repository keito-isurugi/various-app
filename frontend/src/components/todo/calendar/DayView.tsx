"use client";

import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/todo/progressUtils";
import type { Todo } from "@/types/todo";
import { isSameDay } from "date-fns";
import { Clock } from "lucide-react";

interface DayViewProps {
	currentDate: Date;
	todos: Todo[];
	onSelectDate: (date: Date) => void;
	onTodoClick?: (todo: Todo) => void;
}

export function DayView({ currentDate, todos, onTodoClick }: DayViewProps) {
	const dayTodos = todos.filter((todo) =>
		isSameDay(new Date(todo.date), currentDate),
	);

	return (
		<div className="overflow-auto max-h-[600px]">
			{dayTodos.length === 0 ? (
				<div className="text-center py-12 text-muted-foreground">
					この日のTODOはありません
				</div>
			) : (
				<div className="space-y-3">
					{dayTodos.map((todo) => (
						<div
							key={todo.id}
							onClick={() => onTodoClick?.(todo)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onTodoClick?.(todo);
								}
							}}
							role="button"
							tabIndex={0}
							className={`
                p-4 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity
                ${todo.completed ? "bg-muted/50 border-muted" : "bg-primary/5 border-primary/20"}
              `}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="flex-1">
									<h4
										className={`
                      font-medium mb-1
                      ${todo.completed ? "line-through text-muted-foreground" : ""}
                    `}
									>
										{todo.title}
									</h4>
									{todo.description && (
										<p className="text-sm text-muted-foreground mb-2">
											{todo.description}
										</p>
									)}
									<div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											<span>{formatDuration(todo.duration)}</span>
										</div>
									</div>
								</div>
								{todo.completed && <Badge variant="secondary">完了</Badge>}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
