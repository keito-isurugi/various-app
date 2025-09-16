"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/todo/progressUtils";
import type { PeriodStats } from "@/lib/todo/statisticsService";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface StatsSummaryCardProps {
	title: string;
	stats: PeriodStats;
	icon?: "check" | "clock" | "trending";
}

export function StatsSummaryCard({
	title,
	stats,
	icon = "check",
}: StatsSummaryCardProps) {
	const Icon =
		icon === "check" ? CheckCircle2 : icon === "clock" ? Clock : TrendingUp;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<div>
						<div className="text-2xl font-bold">
							{stats.completedCount} / {stats.totalCount}
						</div>
						<p className="text-xs text-muted-foreground">完了タスク数</p>
					</div>
					<div>
						<div className="text-lg font-semibold">
							{formatDuration(stats.completedDuration)} /{" "}
							{formatDuration(stats.totalDuration)}
						</div>
						<p className="text-xs text-muted-foreground">完了時間</p>
					</div>
					<div className="pt-2">
						<div className="flex items-center justify-between mb-1">
							<span className="text-sm font-medium">完了率</span>
							<span className="text-sm font-bold">
								{stats.completionRate.toFixed(1)}%
							</span>
						</div>
						<div className="w-full bg-secondary rounded-full h-2">
							<div
								className="bg-primary rounded-full h-2 transition-all"
								style={{ width: `${stats.completionRate}%` }}
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
