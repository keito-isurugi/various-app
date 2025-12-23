"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/todo/progressUtils";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface ProductivityMetricsProps {
	averageCompletionTime: number;
	completionRateTrend: { date: string; rate: number }[];
}

export function ProductivityMetrics({
	averageCompletionTime,
	completionRateTrend,
}: ProductivityMetricsProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>平均完了時間</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-[150px]">
						<div className="text-center">
							<div className="text-4xl font-bold">
								{formatDuration(averageCompletionTime)}
							</div>
							<p className="text-sm text-muted-foreground mt-2">
								1タスクあたり
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>完了率推移（過去7日間）</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-[150px]">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={completionRateTrend}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[0, 100]} />
								<Tooltip formatter={(value) => `${value}%`} />
								<Legend />
								<Line
									type="monotone"
									dataKey="rate"
									name="完了率"
									stroke="#8884d8"
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
