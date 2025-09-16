"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Todo, TodoFormData } from "@/types/todo";
import { useEffect, useState } from "react";

interface TodoFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: TodoFormData) => Promise<void>;
	onDelete?: () => Promise<void>;
	categories: Category[];
	initialData?: Todo;
	selectedDate: Date;
}

export function TodoFormModal({
	isOpen,
	onClose,
	onSubmit,
	onDelete,
	categories,
	initialData,
	selectedDate,
}: TodoFormModalProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [date, setDate] = useState("");
	const [duration, setDuration] = useState("");
	const [categoryId, setCategoryId] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title);
			setDescription(initialData.description || "");
			setDate(initialData.date.toISOString().split("T")[0]);
			setDuration(initialData.duration.toString());
			setCategoryId(initialData.categoryId || "");
		} else {
			setTitle("");
			setDescription("");
			setDate(selectedDate.toISOString().split("T")[0]);
			setDuration("60");
			setCategoryId("");
		}
	}, [initialData, selectedDate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		setIsSubmitting(true);
		try {
			await onSubmit({
				title: title.trim(),
				description: description.trim() || undefined,
				date: new Date(date),
				duration: Number.parseInt(duration, 10),
				categoryId: categoryId || undefined,
			});
			onClose();
		} catch (error) {
			console.error("Failed to submit todo:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{initialData ? "TODOを編集" : "新規TODO作成"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">タイトル *</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="タスクのタイトル"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">詳細説明</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="タスクの詳細（オプション）"
							rows={3}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="date">日付 *</Label>
						<Input
							id="date"
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="duration">所要時間（分） *</Label>
						<Input
							id="duration"
							type="number"
							min="1"
							value={duration}
							onChange={(e) => setDuration(e.target.value)}
							placeholder="60"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="category">カテゴリ</Label>
						<Select value={categoryId} onValueChange={setCategoryId}>
							<SelectTrigger id="category">
								<SelectValue placeholder="カテゴリを選択" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">なし</SelectItem>
								{categories.map((category) => (
									<SelectItem key={category.id} value={category.id}>
										{category.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<DialogFooter className="flex justify-between">
						<div>
							{initialData && onDelete && (
								<Button
									type="button"
									variant="destructive"
									onClick={async () => {
										if (confirm("このTODOを削除しますか？")) {
											await onDelete();
										}
									}}
								>
									削除
								</Button>
							)}
						</div>
						<div className="flex gap-2">
							<Button type="button" variant="outline" onClick={onClose}>
								キャンセル
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "保存中..." : initialData ? "更新" : "作成"}
							</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
