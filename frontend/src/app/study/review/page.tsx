"use client";

import { ReviewQueueCard } from "@/components/study/review/ReviewQueueCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questionService } from "@/lib/study/questionService";
import { reviewService } from "@/lib/study/reviewService";
import type { Question, UserProgress } from "@/types/study";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function ReviewPage() {
	const [reviewQuestions, setReviewQuestions] = useState<UserProgress[]>([]);
	const [overdueQuestions, setOverdueQuestions] = useState<UserProgress[]>([]);
	const [allQuestions, setAllQuestions] = useState<Question[]>([]);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalReviewsToday: 0,
		totalOverdue: 0,
		completedToday: 0,
	});

	const loadReviewData = useCallback(async () => {
		setLoading(true);
		try {
			const [reviews, overdue, questions, statistics] = await Promise.all([
				reviewService.getTodayReviewQuestions(),
				reviewService.getOverdueReviewQuestions(),
				questionService.getAllQuestions(),
				reviewService.getReviewStatistics(),
			]);

			setReviewQuestions(reviews);
			setOverdueQuestions(overdue);
			setAllQuestions(questions);
			setStats(statistics);
		} catch (error) {
			console.error("Failed to load review data:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadReviewData();
	}, [loadReviewData]);

	if (loading) {
		return (
			<div className="container mx-auto max-w-7xl p-6">
				<div className="flex items-center justify-center py-12">
					<RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-7xl p-6">
			{/* ヘッダー */}
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">復習リスト</h1>
					<p className="mt-2 text-gray-600">
						間隔反復学習で知識を定着させましょう
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						size="sm"
						onClick={loadReviewData}
						className="flex items-center gap-2"
					>
						<RefreshCw className="h-4 w-4" />
						更新
					</Button>
					<Link href="/study/dashboard">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="mr-2 h-4 w-4" />
							ダッシュボード
						</Button>
					</Link>
				</div>
			</div>

			{/* 今日の復習統計 */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>今日の復習進捗</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">
								復習完了: {stats.completedToday} / {stats.totalReviewsToday}
							</p>
							<div className="mt-2 h-2 w-64 overflow-hidden rounded-full bg-gray-200">
								<div
									className="h-full bg-blue-600 transition-all duration-300"
									style={{
										width: `${
											stats.totalReviewsToday > 0
												? (stats.completedToday / stats.totalReviewsToday) * 100
												: 0
										}%`,
									}}
								/>
							</div>
						</div>
						{stats.completedToday === stats.totalReviewsToday &&
							stats.totalReviewsToday > 0 && (
								<div className="rounded-lg bg-green-50 p-3 text-green-700">
									🎉 今日の復習完了！
								</div>
							)}
					</div>
				</CardContent>
			</Card>

			{/* 復習キューカード */}
			{reviewQuestions.length > 0 ? (
				<ReviewQueueCard
					reviewQuestions={reviewQuestions}
					overdueQuestions={overdueQuestions}
					allQuestions={allQuestions}
				/>
			) : (
				<Card>
					<CardContent className="py-12 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
							<span className="text-3xl">✨</span>
						</div>
						<h3 className="mb-2 text-xl font-semibold">
							復習する問題がありません
						</h3>
						<p className="text-gray-600">
							素晴らしい！今日の復習は全て完了しました。
						</p>
						<div className="mt-6 flex justify-center gap-3">
							<Link href="/study">
								<Button>新しい問題を学習</Button>
							</Link>
							<Link href="/study/dashboard">
								<Button variant="outline">ダッシュボードへ</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			)}

			{/* SM-2アルゴリズムの説明 */}
			<Card className="mt-6">
				<CardHeader>
					<CardTitle className="text-lg">間隔反復学習について</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3 text-sm text-gray-600">
						<p>
							このアプリは<strong>SM-2アルゴリズム</strong>
							を使用して、最適な復習タイミングを計算します。
						</p>
						<ul className="list-inside list-disc space-y-1">
							<li>理解した問題は徐々に復習間隔が長くなります</li>
							<li>理解できなかった問題は短い間隔で再度復習します</li>
							<li>繰り返し学習することで長期記憶に定着します</li>
						</ul>
						<p className="mt-4">
							<strong>復習間隔の例:</strong> 1日 → 6日 → 15日 → 37日 → ...
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
