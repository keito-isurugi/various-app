"use client";

import { DailyProgressCard } from "@/components/study/dashboard/DailyProgressCard";
import { StatsCards } from "@/components/study/dashboard/StatsCards";
import { StreakDisplay } from "@/components/study/dashboard/StreakDisplay";
import { Button } from "@/components/ui/button";
import { questionService } from "@/lib/study/questionService";
import { statsService } from "@/lib/study/statsService";
import type { DailyProgress, UserStats } from "@/types/study";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
	const [stats, setStats] = useState<UserStats | null>(null);
	const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(
		null,
	);
	const [totalQuestions, setTotalQuestions] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		try {
			setLoading(true);

			// 統計情報を取得
			let userStats = await statsService.getUserStats();

			// 統計情報がない場合は初期化
			if (!userStats) {
				userStats = await statsService.initializeUserStats();
			}

			setStats(userStats);

			// 今日の進捗を取得
			const progress = await statsService.getTodayProgress();
			setTodayProgress(progress);

			// 全問題数を取得
			const allQuestions = await questionService.getAllQuestions();
			setTotalQuestions(allQuestions.length);

			// 統計の総問題数を更新（初回のみ）
			if (userStats.totalQuestions === 0 && allQuestions.length > 0) {
				await statsService.updateUserStats({
					totalQuestions: allQuestions.length,
				});
			}
		} catch (error) {
			console.error("Failed to load dashboard data:", error);
		} finally {
			setLoading(false);
		}
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
		<div className="container mx-auto px-4 py-8 max-w-7xl">
			{/* ヘッダー */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-3xl font-bold">学習ダッシュボード</h1>
					<Link href="/study">
						<Button variant="outline">
							<ArrowLeft className="mr-2 h-4 w-4" />
							学習に戻る
						</Button>
					</Link>
				</div>
				<p className="text-muted-foreground">
					あなたの学習進捗と統計を確認できます
				</p>
			</div>

			{/* 統計カード */}
			<div className="space-y-6">
				<StatsCards stats={stats} totalQuestions={totalQuestions} />

				{/* 今日の進捗とストリーク */}
				<div className="grid gap-6 md:grid-cols-2">
					<DailyProgressCard progress={todayProgress} />
					<StreakDisplay stats={stats} />
				</div>

				{/* 学習を始めるボタン */}
				<div className="flex justify-center pt-4">
					<Link href="/study">
						<Button size="lg" className="px-8">
							学習を続ける
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
