"use client";

import { TechQuizBreadcrumb } from "@/components/study/TechQuizBreadcrumb";
import { TechQuizQuickNav } from "@/components/study/TechQuizQuickNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questionService } from "@/lib/study/questionService";
import { testService } from "@/lib/study/testService";
import { Award, BookOpen, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function TestModePage() {
	const router = useRouter();
	const [questionCount, setQuestionCount] = useState(10);
	const [timeLimit, setTimeLimit] = useState<number | null>(null); // 秒、nullは制限なし
	const [totalQuestions, setTotalQuestions] = useState(0);
	const [stats, setStats] = useState({
		totalTests: 0,
		averagePercentage: 0,
		highestScore: 0,
	});
	const [loading, setLoading] = useState(true);

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const [questions, testStats] = await Promise.all([
				questionService.getAllQuestions(),
				testService.getTestStatistics(),
			]);
			setTotalQuestions(questions.length);
			setStats({
				totalTests: testStats.totalTests,
				averagePercentage: testStats.averagePercentage,
				highestScore: testStats.highestScore,
			});
		} catch (error) {
			console.error("Failed to load data:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleStartTest = () => {
		// クエリパラメータでテスト設定を渡す
		const params = new URLSearchParams({
			count: questionCount.toString(),
			...(timeLimit && { timeLimit: timeLimit.toString() }),
		});
		router.push(`/study/techquiz/test/start?${params.toString()}`);
	};

	const questionOptions = [10, 20, 30, 50];
	const timeLimitOptions = [
		{ label: "制限なし", value: null },
		{ label: "10分", value: 600 },
		{ label: "20分", value: 1200 },
		{ label: "30分", value: 1800 },
		{ label: "60分", value: 3600 },
	];

	if (loading) {
		return (
			<div className="container mx-auto max-w-4xl p-6">
				<div className="flex items-center justify-center py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-4xl p-6">
			{/* パンくずリスト */}
			<TechQuizBreadcrumb items={[{ label: "テストモード" }]} />

			{/* クイックナビゲーション */}
			<TechQuizQuickNav />

			{/* ヘッダー */}
			<div className="mb-8">
				<h1 className="mb-2 text-3xl font-bold">テストモード</h1>
				<p className="text-gray-600">模擬試験で理解度をチェックしましょう</p>
			</div>

			{/* 統計カード */}
			{stats.totalTests > 0 && (
				<div className="mb-8 grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
								<BookOpen className="h-4 w-4" />
								受験回数
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalTests}回</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
								<TrendingUp className="h-4 w-4" />
								平均正答率
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats.averagePercentage}%
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
								<Award className="h-4 w-4" />
								最高得点
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.highestScore}問</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* テスト設定 */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>テスト設定</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* 問題数選択 */}
					<div>
						<div className="mb-3 text-sm font-medium">問題数を選択</div>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
							{questionOptions.map((count) => (
								<Button
									key={count}
									type="button"
									variant={questionCount === count ? "default" : "outline"}
									onClick={() => setQuestionCount(count)}
									disabled={count > totalQuestions}
									className="h-16"
								>
									<div className="text-center">
										<div className="text-2xl font-bold">{count}</div>
										<div className="text-xs">問</div>
									</div>
								</Button>
							))}
						</div>
					</div>

					{/* 制限時間選択 */}
					<div>
						<div className="mb-3 text-sm font-medium">制限時間を選択</div>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
							{timeLimitOptions.map((option) => (
								<Button
									key={option.label}
									type="button"
									variant={timeLimit === option.value ? "default" : "outline"}
									onClick={() => setTimeLimit(option.value)}
									className="h-16"
								>
									<div className="text-center">
										<Clock className="mx-auto mb-1 h-5 w-5" />
										<div className="text-sm">{option.label}</div>
									</div>
								</Button>
							))}
						</div>
					</div>

					{/* プレビュー */}
					<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-900">テスト内容</p>
								<p className="mt-1 text-blue-700">
									{questionCount}問
									{timeLimit
										? ` / ${Math.floor(timeLimit / 60)}分`
										: " / 制限時間なし"}
								</p>
							</div>
							<Button onClick={handleStartTest} size="lg">
								テスト開始
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* テスト履歴へのリンク */}
			{stats.totalTests > 0 && (
				<Card>
					<CardContent className="py-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">過去のテスト結果を確認</p>
								<p className="text-sm text-gray-600">
									これまでの成績と間違えた問題を振り返る
								</p>
							</div>
							<Link href="/study/techquiz/test/history">
								<Button variant="outline">履歴を見る</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
