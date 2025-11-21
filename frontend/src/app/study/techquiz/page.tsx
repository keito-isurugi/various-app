"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { questionService } from "@/lib/study/questionService";
import { reviewService } from "@/lib/study/reviewService";
import { statsService } from "@/lib/study/statsService";
import {
	Award,
	BookOpen,
	Clock,
	ListChecks,
	PieChart,
	RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function TechQuizHomePage() {
	const [stats, setStats] = useState({
		totalQuestions: 0,
		answeredQuestions: 0,
		understoodCount: 0,
		currentStreak: 0,
	});
	const [reviewCount, setReviewCount] = useState(0);
	const [loading, setLoading] = useState(true);

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const [questions, userStats, reviewQuestions] = await Promise.all([
				questionService.getAllQuestions(),
				statsService.getUserStats(),
				reviewService.getTodayReviewQuestions(),
			]);

			setStats({
				totalQuestions: questions.length,
				answeredQuestions: userStats?.answeredQuestions || 0,
				understoodCount: userStats?.understoodCount || 0,
				currentStreak: userStats?.currentStreak || 0,
			});
			setReviewCount(reviewQuestions.length);
		} catch (error) {
			console.error("Failed to load data:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const accuracyRate =
		stats.answeredQuestions > 0
			? Math.round((stats.understoodCount / stats.answeredQuestions) * 100)
			: 0;

	const navigationCards = [
		{
			href: "/study/techquiz/practice",
			icon: RefreshCw,
			title: "ランダム演習",
			description: "ランダムに選ばれた問題で学習",
			color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
			iconColor: "text-blue-600",
		},
		{
			href: "/study/techquiz/questions",
			icon: ListChecks,
			title: "問題一覧",
			description: "全ての問題を閲覧・フィルター",
			color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
			iconColor: "text-purple-600",
		},
		{
			href: "/study/techquiz/dashboard",
			icon: PieChart,
			title: "ダッシュボード",
			description: "学習統計と進捗を確認",
			color: "bg-green-50 hover:bg-green-100 border-green-200",
			iconColor: "text-green-600",
		},
		{
			href: "/study/techquiz/review",
			icon: Clock,
			title: "復習リスト",
			description: `復習が必要な問題 (${reviewCount}件)`,
			color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
			iconColor: "text-orange-600",
			badge: reviewCount > 0 ? reviewCount : null,
		},
		{
			href: "/study/techquiz/test",
			icon: Award,
			title: "テストモード",
			description: "模擬試験で実力チェック",
			color: "bg-red-50 hover:bg-red-100 border-red-200",
			iconColor: "text-red-600",
		},
	];

	if (loading) {
		return (
			<div className="container mx-auto max-w-7xl p-6">
				<div className="flex items-center justify-center py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-7xl p-6">
			{/* ヘッダー */}
			<div className="mb-8">
				<h1 className="mb-2 text-4xl font-bold">Tech Quiz</h1>
				<p className="text-lg text-gray-600">
					技術問題で知識を習慣的に学習・定着させよう
				</p>
			</div>

			{/* 統計サマリー */}
			<div className="mb-8 grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-3">
						<CardDescription>総問題数</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{stats.totalQuestions}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardDescription>解答済み</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-blue-600">
							{stats.answeredQuestions}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardDescription>正答率</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-green-600">
							{accuracyRate}%
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardDescription>連続学習日数</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-baseline gap-1">
							<div className="text-3xl font-bold text-orange-600">
								{stats.currentStreak}
							</div>
							<div className="text-sm text-gray-600">日</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* ナビゲーションカード */}
			<div className="mb-8">
				<h2 className="mb-4 text-2xl font-bold">機能メニュー</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{navigationCards.map((card) => (
						<Link key={card.href} href={card.href}>
							<Card
								className={`relative h-full transition-all duration-200 ${card.color}`}
							>
								<CardHeader>
									<div className="flex items-center justify-between">
										<card.icon className={`h-8 w-8 ${card.iconColor}`} />
										{card.badge && (
											<span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
												{card.badge}
											</span>
										)}
									</div>
									<CardTitle className="text-xl">{card.title}</CardTitle>
									<CardDescription className="text-gray-700">
										{card.description}
									</CardDescription>
								</CardHeader>
							</Card>
						</Link>
					))}
				</div>
			</div>

			{/* クイックスタート */}
			<Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-6 w-6 text-blue-600" />
						<span>クイックスタート</span>
					</CardTitle>
					<CardDescription>
						今すぐ学習を始めるには、以下のボタンをクリック
					</CardDescription>
				</CardHeader>
				<CardContent className="flex gap-3">
					<Link href="/study/techquiz/practice" className="flex-1">
						<button
							type="button"
							className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
						>
							ランダム演習を開始
						</button>
					</Link>
					{reviewCount > 0 && (
						<Link href="/study/techquiz/review" className="flex-1">
							<button
								type="button"
								className="w-full rounded-lg border-2 border-orange-600 bg-white px-6 py-3 font-semibold text-orange-600 transition-colors hover:bg-orange-50"
							>
								今日の復習 ({reviewCount}件)
							</button>
						</Link>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
