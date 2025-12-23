"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryStats } from "@/lib/todo/statisticsService";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface CategoryAnalysisProps {
	categoryStats: CategoryStats[];
}

const COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884D8",
	"#82CA9D",
	"#FFC658",
];

export function CategoryAnalysis({ categoryStats }: CategoryAnalysisProps) {
	const pieData = categoryStats.map((stat) => ({
		name: stat.categoryName,
		value: stat.completedDuration,
	}));

	const barData = categoryStats.map((stat) => ({
		name: stat.categoryName,
		completionRate: stat.completionRate,
		completed: stat.completedCount,
		total: stat.totalCount,
	}));

	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>カテゴリ別時間配分</CardTitle>
				</CardHeader>
				<CardContent>
					{pieData.length > 0 ? (
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={pieData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={(props: any) =>
											`${props.name} ${(props.percent * 100).toFixed(0)}%`
										}
										outerRadius={80}
										fill="#8884d8"
										dataKey="value"
									>
										{pieData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip formatter={(value) => `${value}分`} />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					) : (
						<div className="h-[300px] flex items-center justify-center text-muted-foreground">
							データがありません
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>カテゴリ別完了率</CardTitle>
				</CardHeader>
				<CardContent>
					{barData.length > 0 ? (
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={barData} layout="vertical">
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis type="number" domain={[0, 100]} />
									<YAxis dataKey="name" type="category" width={100} />
									<Tooltip
										formatter={(value, name, props) => {
											if (
												name === "completionRate" &&
												typeof value === "number"
											) {
												return [
													`${value.toFixed(1)}% (${props.payload.completed}/${props.payload.total})`,
													"完了率",
												];
											}
											return value;
										}}
									/>
									<Bar dataKey="completionRate" name="完了率" fill="#8884d8" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					) : (
						<div className="h-[300px] flex items-center justify-center text-muted-foreground">
							データがありません
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
