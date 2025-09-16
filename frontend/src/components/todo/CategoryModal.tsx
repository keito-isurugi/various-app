"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useCategories";
import type { CategoryFormData } from "@/types/todo";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface CategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const PRESET_COLORS = [
	"#ef4444", // red
	"#f97316", // orange
	"#eab308", // yellow
	"#22c55e", // green
	"#3b82f6", // blue
	"#8b5cf6", // purple
	"#ec4899", // pink
];

export function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
	const { categories, createCategory, updateCategory, deleteCategory } =
		useCategories();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState(PRESET_COLORS[0]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const editingCategory = editingId
		? categories.find((c) => c.id === editingId)
		: null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		setIsSubmitting(true);
		try {
			const data: CategoryFormData = {
				title: title.trim(),
				description: description.trim() || undefined,
				color,
			};

			if (editingId) {
				await updateCategory(editingId, data);
			} else {
				await createCategory(data);
			}

			resetForm();
		} catch (error) {
			console.error("Failed to save category:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (id: string) => {
		const category = categories.find((c) => c.id === id);
		if (category) {
			setEditingId(id);
			setTitle(category.title);
			setDescription(category.description || "");
			setColor(category.color);
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("このカテゴリを削除しますか？")) {
			try {
				await deleteCategory(id);
			} catch (error) {
				console.error("Failed to delete category:", error);
			}
		}
	};

	const resetForm = () => {
		setEditingId(null);
		setTitle("");
		setDescription("");
		setColor(PRESET_COLORS[0]);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>カテゴリ管理</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<div>
						<h3 className="font-medium mb-3">カテゴリ一覧</h3>
						{categories.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">
								カテゴリがありません
							</p>
						) : (
							<div className="space-y-2">
								{categories.map((category) => (
									<Card key={category.id} className="p-3">
										<div className="flex items-start justify-between gap-3">
											<div className="flex items-center gap-3 flex-1">
												<div
													className="w-4 h-4 rounded-full"
													style={{ backgroundColor: category.color }}
												/>
												<div className="flex-1">
													<h4 className="font-medium">{category.title}</h4>
													{category.description && (
														<p className="text-sm text-muted-foreground">
															{category.description}
														</p>
													)}
												</div>
											</div>
											<div className="flex gap-1">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleEdit(category.id)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDelete(category.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</Card>
								))}
							</div>
						)}
					</div>

					<div>
						<h3 className="font-medium mb-3">
							{editingId ? "カテゴリを編集" : "新規カテゴリ作成"}
						</h3>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="cat-title">タイトル *</Label>
								<Input
									id="cat-title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="カテゴリ名"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="cat-description">詳細説明</Label>
								<Textarea
									id="cat-description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="説明（オプション）"
									rows={2}
								/>
							</div>

							<div className="space-y-2">
								<Label>カラー *</Label>
								<div className="flex gap-2">
									{PRESET_COLORS.map((presetColor) => (
										<button
											key={presetColor}
											type="button"
											onClick={() => setColor(presetColor)}
											className={`w-8 h-8 rounded-full border-2 ${
												color === presetColor
													? "border-foreground"
													: "border-transparent"
											}`}
											style={{ backgroundColor: presetColor }}
										/>
									))}
								</div>
							</div>

							<div className="flex gap-2">
								{editingId && (
									<Button type="button" variant="outline" onClick={resetForm}>
										キャンセル
									</Button>
								)}
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? "保存中..." : editingId ? "更新" : "作成"}
									{!editingId && <Plus className="h-4 w-4 ml-1" />}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
