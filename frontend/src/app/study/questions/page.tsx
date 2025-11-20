"use client";

import { Button } from "@/components/ui/button";
import { questionService } from "@/lib/study/questionService";
import type { Question } from "@/types/study";
import { BookOpen, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function QuestionsListPage() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedGroup, setSelectedGroup] = useState<string>("all");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const loadQuestions = useCallback(async () => {
		try {
			setLoading(true);
			const allQuestions = await questionService.getAllQuestions();
			setQuestions(allQuestions);
		} catch (error) {
			console.error("Failed to load questions:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const filterQuestions = useCallback(() => {
		let filtered = [...questions];

		// グループフィルター
		if (selectedGroup !== "all") {
			filtered = filtered.filter((q) => q.group === selectedGroup);
		}

		// カテゴリフィルター
		if (selectedCategory !== "all") {
			filtered = filtered.filter((q) => q.category === selectedCategory);
		}

		// 検索フィルター
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(q) =>
					q.japaneseQuestion.toLowerCase().includes(query) ||
					q.englishQuestion.toLowerCase().includes(query) ||
					q.japaneseAnswer.toLowerCase().includes(query) ||
					q.englishAnswer.toLowerCase().includes(query),
			);
		}

		setFilteredQuestions(filtered);
	}, [questions, selectedGroup, selectedCategory, searchQuery]);

	useEffect(() => {
		loadQuestions();
	}, [loadQuestions]);

	useEffect(() => {
		filterQuestions();
	}, [filterQuestions]);

	// ユニークなグループとカテゴリを取得
	const groups = Array.from(new Set(questions.map((q) => q.group))).sort();
	const categories = Array.from(
		new Set(
			questions
				.filter((q) => selectedGroup === "all" || q.group === selectedGroup)
				.map((q) => q.category),
		),
	).sort();

	// グループごとの色
	const getGroupColor = (group: string) => {
		const colors: Record<string, string> = {
			DSA: "bg-blue-100 text-blue-800 border-blue-200",
			Backend: "bg-green-100 text-green-800 border-green-200",
			Frontend: "bg-purple-100 text-purple-800 border-purple-200",
			DevOps: "bg-orange-100 text-orange-800 border-orange-200",
			Database: "bg-teal-100 text-teal-800 border-teal-200",
			Security: "bg-red-100 text-red-800 border-red-200",
		};
		return colors[group] || "bg-gray-100 text-gray-800 border-gray-200";
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
					<p className="text-muted-foreground">読み込み中...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			{/* ヘッダー */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-3xl font-bold">問題一覧</h1>
					<Link href="/study">
						<Button variant="outline">
							<BookOpen className="mr-2 h-4 w-4" />
							学習モード
						</Button>
					</Link>
				</div>
				<p className="text-muted-foreground">
					全{questions.length}問 / 表示中{filteredQuestions.length}問
				</p>
			</div>

			{/* フィルター */}
			<div className="mb-6 space-y-4">
				{/* 検索バー */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<input
						type="text"
						placeholder="問題や回答を検索..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
					/>
				</div>

				{/* フィルターボタン */}
				<div className="flex flex-wrap gap-3">
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">グループ:</span>
					</div>
					<Button
						variant={selectedGroup === "all" ? "default" : "outline"}
						size="sm"
						onClick={() => {
							setSelectedGroup("all");
							setSelectedCategory("all");
						}}
					>
						すべて
					</Button>
					{groups.map((group) => (
						<Button
							key={group}
							variant={selectedGroup === group ? "default" : "outline"}
							size="sm"
							onClick={() => {
								setSelectedGroup(group);
								setSelectedCategory("all");
							}}
						>
							{group}
						</Button>
					))}
				</div>

				{/* カテゴリフィルター */}
				{selectedGroup !== "all" && categories.length > 0 && (
					<div className="flex flex-wrap gap-3">
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium">カテゴリ:</span>
						</div>
						<Button
							variant={selectedCategory === "all" ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedCategory("all")}
						>
							すべて
						</Button>
						{categories.map((category) => (
							<Button
								key={category}
								variant={selectedCategory === category ? "default" : "outline"}
								size="sm"
								onClick={() => setSelectedCategory(category)}
							>
								{category}
							</Button>
						))}
					</div>
				)}
			</div>

			{/* 問題リスト */}
			{filteredQuestions.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">
						該当する問題が見つかりませんでした
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{filteredQuestions.map((question) => (
						<Link
							key={question.id}
							href={`/study/questions/${question.id}`}
							className="block"
						>
							<div className="border border-border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer">
								<div className="flex items-start gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<span
												className={`text-xs px-2 py-1 rounded-md border ${getGroupColor(question.group)}`}
											>
												{question.group}
											</span>
											<span className="text-xs text-muted-foreground">
												{question.category}
											</span>
										</div>
										<p className="font-medium mb-1">
											{question.japaneseQuestion}
										</p>
										<p className="text-sm text-muted-foreground line-clamp-2">
											{question.japaneseAnswer}
										</p>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
