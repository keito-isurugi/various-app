"use client";

import { CategoryModal } from "@/components/todo/CategoryModal";
import { TodoFormModal } from "@/components/todo/TodoFormModal";
import { TodoItem } from "@/components/todo/TodoItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/hooks/useCategories";
import { useTodos } from "@/hooks/useTodos";
import type { FilterType } from "@/types/todo";
import { Plus, Settings } from "lucide-react";
import { useState } from "react";

interface TodoListProps {
	selectedDate: Date;
	onTodoChange?: () => void;
}

export function TodoList({ selectedDate, onTodoChange }: TodoListProps) {
	const { todos, loading, toggleComplete, deleteTodo, createTodo, updateTodo } =
		useTodos(selectedDate);
	const { categories } = useCategories();
	const [filter, setFilter] = useState<FilterType>("all");
	const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

	const filteredTodos = todos.filter((todo) => {
		if (filter === "all") return true;
		if (filter === "completed") return todo.completed;
		if (filter === "incomplete") return !todo.completed;
		return true;
	});

	const editingTodo = editingTodoId
		? todos.find((t) => t.id === editingTodoId)
		: null;

	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>
							{selectedDate.toLocaleDateString("ja-JP", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</CardTitle>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsCategoryModalOpen(true)}
							>
								<Settings className="h-4 w-4 mr-1" />
								カテゴリ管理
							</Button>
							<Button
								size="sm"
								onClick={() => {
									setEditingTodoId(null);
									setIsTodoModalOpen(true);
								}}
							>
								<Plus className="h-4 w-4 mr-1" />
								新規TODO
							</Button>
						</div>
					</div>

					<div className="flex gap-2 mt-4">
						<Button
							variant={filter === "all" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilter("all")}
						>
							全て
						</Button>
						<Button
							variant={filter === "incomplete" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilter("incomplete")}
						>
							未完了
						</Button>
						<Button
							variant={filter === "completed" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilter("completed")}
						>
							完了済み
						</Button>
					</div>
				</CardHeader>

				<CardContent>
					{loading ? (
						<div className="text-center py-8 text-muted-foreground">
							読み込み中...
						</div>
					) : filteredTodos.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							TODOがありません
						</div>
					) : (
						<div className="space-y-2">
							{filteredTodos.map((todo) => (
								<TodoItem
									key={todo.id}
									todo={todo}
									categories={categories}
									onToggleComplete={async (id, completed) => {
										await toggleComplete(id, completed);
										onTodoChange?.();
									}}
									onEdit={(id) => {
										setEditingTodoId(id);
										setIsTodoModalOpen(true);
									}}
									onDelete={async (id) => {
										await deleteTodo(id);
										onTodoChange?.();
									}}
								/>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<TodoFormModal
				isOpen={isTodoModalOpen}
				onClose={() => {
					setIsTodoModalOpen(false);
					setEditingTodoId(null);
				}}
				onSubmit={async (data) => {
					if (editingTodoId) {
						await updateTodo(editingTodoId, data);
					} else {
						await createTodo(data);
					}
					onTodoChange?.();
					setIsTodoModalOpen(false);
					setEditingTodoId(null);
				}}
				categories={categories}
				initialData={editingTodo || undefined}
				selectedDate={selectedDate}
			/>

			<CategoryModal
				isOpen={isCategoryModalOpen}
				onClose={() => setIsCategoryModalOpen(false)}
			/>
		</>
	);
}
