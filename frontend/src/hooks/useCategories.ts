import { categoryService } from "@/lib/todo/categoryService";
import type { Category, CategoryFormData } from "@/types/todo";
import { useCallback, useEffect, useState } from "react";

export const useCategories = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCategories = useCallback(async () => {
		try {
			setLoading(true);
			const data = await categoryService.getAllCategories();
			setCategories(data);
			setError(null);
		} catch (err) {
			setError("カテゴリの取得に失敗しました");
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const createCategory = async (data: CategoryFormData) => {
		try {
			await categoryService.createCategory(data);
			await fetchCategories();
		} catch (err) {
			setError("カテゴリの作成に失敗しました");
			throw err;
		}
	};

	const updateCategory = async (
		id: string,
		data: Partial<CategoryFormData>,
	) => {
		try {
			await categoryService.updateCategory(id, data);
			await fetchCategories();
		} catch (err) {
			setError("カテゴリの更新に失敗しました");
			throw err;
		}
	};

	const deleteCategory = async (id: string) => {
		try {
			await categoryService.deleteCategory(id);
			await fetchCategories();
		} catch (err) {
			setError("カテゴリの削除に失敗しました");
			throw err;
		}
	};

	return {
		categories,
		loading,
		error,
		createCategory,
		updateCategory,
		deleteCategory,
		refetch: fetchCategories,
	};
};
