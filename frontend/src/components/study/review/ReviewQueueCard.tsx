"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Question, UserProgress } from "@/types/study";
import { AlertCircle, Book, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ReviewQueueCardProps {
	reviewQuestions: UserProgress[];
	overdueQuestions: UserProgress[];
	allQuestions: Question[];
}

export function ReviewQueueCard({
	reviewQuestions,
	overdueQuestions,
	allQuestions,
}: ReviewQueueCardProps) {
	const [questionMap, setQuestionMap] = useState<Map<string, Question>>(
		new Map(),
	);

	useEffect(() => {
		const map = new Map<string, Question>();
		for (const q of allQuestions) {
			map.set(q.id, q);
		}
		setQuestionMap(map);
	}, [allQuestions]);

	const totalReviews = reviewQuestions.length;
	const overdueCount = overdueQuestions.length;
	const upcomingCount = totalReviews - overdueCount;

	return (
		<div className="grid gap-4 md:grid-cols-3">
			{/* 期限切れの復習 */}
			<Card className="border-red-200 bg-red-50">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-lg font-medium">
						<AlertCircle className="h-5 w-5 text-red-600" />
						<span>期限切れ</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-red-600">{overdueCount}</div>
					<p className="mt-2 text-sm text-gray-600">早めに復習しましょう</p>
					{overdueCount > 0 && (
						<Link href="/study/review?filter=overdue">
							<Button
								variant="outline"
								size="sm"
								className="mt-3 w-full border-red-300 hover:bg-red-100"
							>
								復習を開始
							</Button>
						</Link>
					)}
				</CardContent>
			</Card>

			{/* 今日の復習 */}
			<Card className="border-blue-200 bg-blue-50">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-lg font-medium">
						<Calendar className="h-5 w-5 text-blue-600" />
						<span>今日の復習</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-blue-600">
						{upcomingCount}
					</div>
					<p className="mt-2 text-sm text-gray-600">今日復習予定の問題</p>
					{upcomingCount > 0 && (
						<Link href="/study/review?filter=today">
							<Button
								variant="outline"
								size="sm"
								className="mt-3 w-full border-blue-300 hover:bg-blue-100"
							>
								復習を開始
							</Button>
						</Link>
					)}
				</CardContent>
			</Card>

			{/* 全体の復習統計 */}
			<Card className="border-green-200 bg-green-50">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-lg font-medium">
						<Book className="h-5 w-5 text-green-600" />
						<span>総復習数</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-green-600">
						{totalReviews}
					</div>
					<p className="mt-2 text-sm text-gray-600">復習が必要な問題</p>
					{totalReviews > 0 && (
						<Link href="/study/review">
							<Button
								variant="outline"
								size="sm"
								className="mt-3 w-full border-green-300 hover:bg-green-100"
							>
								全て確認
							</Button>
						</Link>
					)}
				</CardContent>
			</Card>

			{/* 復習問題リスト */}
			{totalReviews > 0 && (
				<Card className="md:col-span-3">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle2 className="h-5 w-5" />
							<span>復習予定の問題</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="max-h-96 space-y-2 overflow-y-auto">
							{reviewQuestions.slice(0, 10).map((progress) => {
								const question = questionMap.get(progress.questionId);
								if (!question) return null;

								const isOverdue =
									progress.nextReviewAt &&
									progress.nextReviewAt.toDate() < new Date();
								const reviewDate = progress.nextReviewAt?.toDate();

								return (
									<div
										key={progress.id}
										className={`flex items-center justify-between rounded-lg border p-3 ${
											isOverdue
												? "border-red-200 bg-red-50"
												: "border-gray-200 bg-white"
										}`}
									>
										<div className="flex-1">
											<div className="font-medium">
												{question.japaneseQuestion.slice(0, 80)}
												{question.japaneseQuestion.length > 80 && "..."}
											</div>
											<div className="mt-1 flex items-center gap-4 text-xs text-gray-600">
												<span className="rounded-full bg-gray-100 px-2 py-1">
													{question.category}
												</span>
												{reviewDate && (
													<span>
														次回: {reviewDate.toLocaleDateString("ja-JP")}
													</span>
												)}
												<span>間隔: {progress.interval}日</span>
											</div>
										</div>
										<Link href={`/study/questions/${question.id}`}>
											<Button variant="ghost" size="sm">
												詳細
											</Button>
										</Link>
									</div>
								);
							})}
							{totalReviews > 10 && (
								<div className="pt-2 text-center text-sm text-gray-600">
									他 {totalReviews - 10} 件
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
