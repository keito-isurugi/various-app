import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserStats } from "@/types/study";
import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface StatsCardsProps {
	stats: UserStats | null;
	totalQuestions: number;
}

export function StatsCards({ stats, totalQuestions }: StatsCardsProps) {
	if (!stats) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								読み込み中...
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">-</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const accuracyRate =
		stats.answeredQuestions > 0
			? Math.round((stats.understoodCount / stats.answeredQuestions) * 100)
			: 0;

	const totalHours = Math.floor(stats.totalTimeSpent / 3600);
	const totalMinutes = Math.floor((stats.totalTimeSpent % 3600) / 60);

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{/* 解答済み問題数 */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">解答済み</CardTitle>
					<BookOpen className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.answeredQuestions}</div>
					<p className="text-xs text-muted-foreground">
						全{totalQuestions}問中
					</p>
				</CardContent>
			</Card>

			{/* 理解度 */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">正答率</CardTitle>
					<CheckCircle className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{accuracyRate}%</div>
					<p className="text-xs text-muted-foreground">
						{stats.understoodCount}/{stats.answeredQuestions}問理解
					</p>
				</CardContent>
			</Card>

			{/* 学習時間 */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">学習時間</CardTitle>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{totalHours > 0 ? `${totalHours}h` : `${totalMinutes}m`}
					</div>
					<p className="text-xs text-muted-foreground">
						累計 {totalHours}時間{totalMinutes}分
					</p>
				</CardContent>
			</Card>

			{/* 連続学習日数 */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">連続学習</CardTitle>
					<TrendingUp className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.currentStreak}日</div>
					<p className="text-xs text-muted-foreground">
						最長 {stats.longestStreak}日
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
