import { todoService } from "@/lib/todo/todoService";
import type { Todo } from "@/types/todo";
import { useCallback, useEffect, useState } from "react";

export const useAllTodos = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTodos = useCallback(async () => {
		try {
			setLoading(true);
			const data = await todoService.getAllTodos();
			setTodos(data);
			setError(null);
		} catch (err) {
			setError("TODOの取得に失敗しました");
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	return {
		todos,
		loading,
		error,
		refetch: fetchTodos,
	};
};
