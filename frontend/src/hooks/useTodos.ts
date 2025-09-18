import { todoService } from "@/lib/todo/todoService";
import type { Todo, TodoFormData } from "@/types/todo";
import { useCallback, useEffect, useState } from "react";

export const useTodos = (selectedDate: Date) => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTodos = useCallback(async () => {
		try {
			setLoading(true);
			const data = await todoService.getTodosByDate(selectedDate);
			setTodos(data);
			setError(null);
		} catch (err) {
			setError("TODOの取得に失敗しました");
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, [selectedDate]);

	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	const createTodo = async (data: TodoFormData) => {
		try {
			await todoService.createTodo(data);
			await fetchTodos();
		} catch (err) {
			setError("TODOの作成に失敗しました");
			throw err;
		}
	};

	const updateTodo = async (id: string, data: Partial<TodoFormData>) => {
		try {
			await todoService.updateTodo(id, data);
			await fetchTodos();
		} catch (err) {
			setError("TODOの更新に失敗しました");
			throw err;
		}
	};

	const deleteTodo = async (id: string) => {
		try {
			await todoService.deleteTodo(id);
			await fetchTodos();
		} catch (err) {
			setError("TODOの削除に失敗しました");
			throw err;
		}
	};

	const toggleComplete = async (id: string, completed: boolean) => {
		try {
			await todoService.toggleTodoComplete(id, completed);
			await fetchTodos();
		} catch (err) {
			setError("TODOの状態更新に失敗しました");
			throw err;
		}
	};

	return {
		todos,
		loading,
		error,
		createTodo,
		updateTodo,
		deleteTodo,
		toggleComplete,
		refetch: fetchTodos,
	};
};
