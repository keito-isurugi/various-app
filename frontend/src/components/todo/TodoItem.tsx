"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatDuration } from "@/lib/todo/progressUtils";
import type { Category, Todo } from "@/types/todo";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface TodoItemProps {
	todo: Todo;
	categories: Category[];
	onToggleComplete: (id: string, completed: boolean) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export function TodoItem({
	todo,
	categories,
	onToggleComplete,
	onEdit,
	onDelete,
}: TodoItemProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const category = todo.categoryId
		? categories.find((c) => c.id === todo.categoryId)
		: null;

	return (
		<>
			<Card className="p-4">
				<div className="flex items-start gap-3">
					<Checkbox
						checked={todo.completed}
						onCheckedChange={(checked) =>
							onToggleComplete(todo.id, checked as boolean)
						}
						className="mt-1"
					/>

					<div className="flex-1 space-y-2">
						<div className="flex items-start justify-between gap-2">
							<div className="flex-1">
								<h3
									className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
								>
									{todo.title}
								</h3>
								{todo.description && (
									<p className="text-sm text-muted-foreground mt-1">
										{todo.description}
									</p>
								)}
							</div>

							<div className="flex gap-1">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEdit(todo.id)}
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setShowDeleteDialog(true)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>

						<div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Clock className="h-3 w-3" />
								<span>{formatDuration(todo.duration)}</span>
							</div>
							{category && (
								<>
									<span>•</span>
									<Badge
										variant="outline"
										style={{
											borderColor: category.color,
											color: category.color,
										}}
									>
										{category.title}
									</Badge>
								</>
							)}
						</div>
					</div>
				</div>
			</Card>

			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>TODOを削除しますか？</DialogTitle>
						<DialogDescription>
							「{todo.title}」を削除します。この操作は取り消せません。
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowDeleteDialog(false)}
						>
							キャンセル
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								onDelete(todo.id);
								setShowDeleteDialog(false);
							}}
						>
							削除
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
