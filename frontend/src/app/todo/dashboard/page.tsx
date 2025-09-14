"use client";

import { Header } from "@/components/todo/Header";
import { CategoryAnalysis } from "@/components/todo/dashboard/CategoryAnalysis";
import { PeriodChart } from "@/components/todo/dashboard/PeriodChart";
import { ProductivityMetrics } from "@/components/todo/dashboard/ProductivityMetrics";
import { StatsSummaryCard } from "@/components/todo/dashboard/StatsSummaryCard";
import { useAllTodos } from "@/hooks/useAllTodos";
import { useCategories } from "@/hooks/useCategories";
import { statisticsService } from "@/lib/todo/statisticsService";

export default function DashboardPage() {
	const { todos, loading } = useAllTodos();
	const { categories } = useCategories();

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<div className="flex items-center justify-center h-[calc(100vh-64px)]">
					<p className="text-muted-foreground">読み込み中...</p>
				</div>
			</div>
		);
	}

	const todayStats = statisticsService.getTodayStats(todos);
	const weekStats = statisticsService.getThisWeekStats(todos);
	const monthStats = statisticsService.getThisMonthStats(todos);

	const dailyStats = statisticsService.getDailyStats(todos, 7);
	const weeklyStats = statisticsService.getWeeklyStats(todos, 4);
	const monthlyStats = statisticsService.getMonthlyStats(todos, 6);

	const categoryStats = statisticsService.getCategoryStats(todos, categories);
	const averageCompletionTime =
		statisticsService.getAverageCompletionTime(todos);
	const completionRateTrend = statisticsService.getCompletionRateTrend(
		todos,
		7,
	);

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="container mx-auto px-4 py-6">
				<div className="space-y-6">
					{/* サマリーカード */}
					<div className="grid gap-4 md:grid-cols-3">
						<StatsSummaryCard
							title="今日の統計"
							stats={todayStats}
							icon="check"
						/>
						<StatsSummaryCard
							title="今週の統計"
							stats={weekStats}
							icon="clock"
						/>
						<StatsSummaryCard
							title="今月の統計"
							stats={monthStats}
							icon="trending"
						/>
					</div>

					{/* 期間別グラフ */}
					<PeriodChart
						dailyStats={dailyStats}
						weeklyStats={weeklyStats}
						monthlyStats={monthlyStats}
					/>

					{/* カテゴリ別分析 */}
					<CategoryAnalysis categoryStats={categoryStats} />

					{/* 生産性指標 */}
					<ProductivityMetrics
						averageCompletionTime={averageCompletionTime}
						completionRateTrend={completionRateTrend}
					/>
				</div>
			</main>
		</div>
	);
}
