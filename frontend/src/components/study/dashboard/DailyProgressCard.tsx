import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyProgress } from "@/types/study";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

interface DailyProgressCardProps {
	progress: DailyProgress | null;
}

export function DailyProgressCard({ progress }: DailyProgressCardProps) {
	const DAILY_GOAL = 3; // デイリー目標: 3問

	if (!progress) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						今日の進捗
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center space-y-4">
						<div className="text-muted-foreground">
							まだ今日は学習していません
						</div>
						<div className="text-sm text-muted-foreground">
							目標: {DAILY_GOAL}問
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	const progressPercentage = Math.min(
		(progress.questionsAnswered / DAILY_GOAL) * 100,
		100,
	);
	const totalMinutes = Math.floor(progress.timeSpent / 60);
	const totalSeconds = progress.timeSpent % 60;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="h-5 w-5" />
					今日の進捗
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* 進捗状況 */}
				<div className="space-y-2">
					<div className="flex justify-between items-center text-sm">
						<span className="text-muted-foreground">デイリーチャレンジ</span>
						<span className="font-medium">
							{progress.questionsAnswered} / {DAILY_GOAL}問
						</span>
					</div>
					<div className="w-full bg-muted rounded-full h-2">
						<div
							className="bg-primary h-2 rounded-full transition-all"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>

				{/* 完了バッジ */}
				{progress.completed && (
					<div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
						<CheckCircle2 className="h-5 w-5 text-green-600" />
						<span className="text-sm font-medium text-green-600">
							今日の目標達成！
						</span>
					</div>
				)}

				{/* 統計 */}
				<div className="grid grid-cols-2 gap-4 pt-4 border-t">
					<div>
						<div className="text-sm text-muted-foreground mb-1">
							理解した問題
						</div>
						<div className="text-xl font-bold">
							{progress.questionsUnderstood}
						</div>
					</div>
					<div>
						<div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
							<Clock className="h-3 w-3" />
							学習時間
						</div>
						<div className="text-xl font-bold">
							{totalMinutes > 0 ? `${totalMinutes}分` : `${totalSeconds}秒`}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
