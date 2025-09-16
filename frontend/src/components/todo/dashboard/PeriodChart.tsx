"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DailyStats } from "@/lib/todo/statisticsService";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface PeriodChartProps {
	dailyStats: DailyStats[];
	weeklyStats: DailyStats[];
	monthlyStats: DailyStats[];
}

export function PeriodChart({
	dailyStats,
	weeklyStats,
	monthlyStats,
}: PeriodChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>期間別統計</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="daily" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="daily">日別</TabsTrigger>
						<TabsTrigger value="weekly">週別</TabsTrigger>
						<TabsTrigger value="monthly">月別</TabsTrigger>
					</TabsList>

					<TabsContent value="daily" className="mt-4">
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={dailyStats}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
									<YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
									<Tooltip />
									<Legend />
									<Bar
										yAxisId="left"
										dataKey="completedCount"
										name="完了タスク数"
										fill="#8884d8"
									/>
									<Bar
										yAxisId="right"
										dataKey="completedDuration"
										name="完了時間(分)"
										fill="#82ca9d"
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</TabsContent>

					<TabsContent value="weekly" className="mt-4">
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={weeklyStats}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
									<YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
									<Tooltip />
									<Legend />
									<Bar
										yAxisId="left"
										dataKey="completedCount"
										name="完了タスク数"
										fill="#8884d8"
									/>
									<Bar
										yAxisId="right"
										dataKey="completedDuration"
										name="完了時間(分)"
										fill="#82ca9d"
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</TabsContent>

					<TabsContent value="monthly" className="mt-4">
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={monthlyStats}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
									<YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
									<Tooltip />
									<Legend />
									<Bar
										yAxisId="left"
										dataKey="completedCount"
										name="完了タスク数"
										fill="#8884d8"
									/>
									<Bar
										yAxisId="right"
										dataKey="completedDuration"
										name="完了時間(分)"
										fill="#82ca9d"
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
