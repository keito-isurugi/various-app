import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserStats } from "@/types/study";
import { Flame } from "lucide-react";

interface StreakDisplayProps {
	stats: UserStats | null;
}

export function StreakDisplay({ stats }: StreakDisplayProps) {
	if (!stats) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>連続学習日数</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center">読み込み中...</div>
				</CardContent>
			</Card>
		);
	}

	const getStreakMessage = (streak: number) => {
		if (streak === 0) return "今日から始めましょう！";
		if (streak < 7) return "良いスタートです！";
		if (streak < 30) return "素晴らしい継続力です！";
		if (streak < 100) return "驚異的なストリークです！";
		return "伝説級の継続力です！";
	};

	const getStreakBadge = (streak: number) => {
		if (streak >= 100) return " レジェンド";
		if (streak >= 30) return " ゴールド";
		if (streak >= 7) return " シルバー";
		if (streak >= 3) return " ブロンズ";
		return " スターター";
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Flame className="h-5 w-5 text-orange-500" />
					連続学習日数
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* 現在のストリーク */}
				<div className="text-center space-y-2">
					<div className="text-6xl font-bold text-orange-500">
						{stats.currentStreak}
					</div>
					<div className="text-xl text-muted-foreground">日連続</div>
					<div className="text-sm text-muted-foreground">
						{getStreakMessage(stats.currentStreak)}
					</div>
				</div>

				{/* バッジ */}
				<div className="flex justify-center">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
						<span className="text-2xl">
							{getStreakBadge(stats.currentStreak)}
						</span>
					</div>
				</div>

				{/* 最長記録 */}
				<div className="border-t pt-4">
					<div className="flex justify-between items-center">
						<span className="text-sm text-muted-foreground">最長記録</span>
						<span className="text-lg font-bold">{stats.longestStreak}日</span>
					</div>
				</div>

				{/* 次のマイルストーン */}
				{stats.currentStreak < 100 && (
					<div className="border-t pt-4">
						<div className="text-sm text-muted-foreground mb-2">
							次のマイルストーン
						</div>
						<div className="space-y-2">
							{stats.currentStreak < 7 && (
								<div className="flex justify-between items-center">
									<span className="text-sm"> ブロンズ</span>
									<span className="text-sm text-muted-foreground">
										あと{7 - stats.currentStreak}日
									</span>
								</div>
							)}
							{stats.currentStreak >= 3 && stats.currentStreak < 30 && (
								<div className="flex justify-between items-center">
									<span className="text-sm"> ゴールド</span>
									<span className="text-sm text-muted-foreground">
										あと{30 - stats.currentStreak}日
									</span>
								</div>
							)}
							{stats.currentStreak >= 7 && stats.currentStreak < 100 && (
								<div className="flex justify-between items-center">
									<span className="text-sm"> レジェンド</span>
									<span className="text-sm text-muted-foreground">
										あと{100 - stats.currentStreak}日
									</span>
								</div>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
