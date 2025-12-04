"use client";

import { TechQuizBreadcrumb } from "@/components/study/TechQuizBreadcrumb";
import { TechQuizQuickNav } from "@/components/study/TechQuizQuickNav";
import { DailyProgressCard } from "@/components/study/dashboard/DailyProgressCard";
import { StatsCards } from "@/components/study/dashboard/StatsCards";
import { StreakDisplay } from "@/components/study/dashboard/StreakDisplay";
import { questionService } from "@/lib/study/questionService";
import { statsService } from "@/lib/study/statsService";
import type { DailyProgress, UserStats } from "@/types/study";
import { Loader2 } from "lucide-react";
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

			let userStats = await statsService.getUserStats();

			if (!userStats) {
				userStats = await statsService.initializeUserStats();
			}

			setStats(userStats);

			const progress = await statsService.getTodayProgress();
			setTodayProgress(progress);

			const allQuestions = await questionService.getAllQuestions();
			setTotalQuestions(allQuestions.length);

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
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<TechQuizBreadcrumb items={[{ label: "ダッシュボード" }]} />
				<TechQuizQuickNav />

				<header className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						学習ダッシュボード
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						あなたの学習進捗と統計を確認できます
					</p>
				</header>

				<div className="space-y-6">
					<StatsCards stats={stats} totalQuestions={totalQuestions} />

					<div className="grid gap-6 md:grid-cols-2">
						<DailyProgressCard progress={todayProgress} />
						<StreakDisplay stats={stats} />
					</div>

					<div className="flex justify-center pt-4">
						<Link href="/study/techquiz/practice">
							<button
								type="button"
								className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
							>
								学習を続ける
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
