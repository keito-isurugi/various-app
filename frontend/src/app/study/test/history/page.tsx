"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testService } from "@/lib/study/testService";
import type { TestResult } from "@/types/study";
import { ArrowLeft, Award, Calendar, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function TestHistoryPage() {
	const [testResults, setTestResults] = useState<TestResult[]>([]);
	const [stats, setStats] = useState({
		totalTests: 0,
		averagePercentage: 0,
		highestScore: 0,
	});
	const [loading, setLoading] = useState(true);

	const loadTestHistory = useCallback(async () => {
		setLoading(true);
		try {
			const [results, statistics] = await Promise.all([
				testService.getAllTestResults(),
				testService.getTestStatistics(),
			]);
			setTestResults(results);
			setStats({
				totalTests: statistics.totalTests,
				averagePercentage: statistics.averagePercentage,
				highestScore: statistics.highestScore,
			});
		} catch (error) {
			console.error("Failed to load test history:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadTestHistory();
	}, [loadTestHistory]);

	if (loading) {
		return (
			<div className="container mx-auto max-w-6xl p-6">
				<div className="flex items-center justify-center py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-6xl p-6">
			{/* ヘッダー */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="mb-2 text-3xl font-bold">テスト履歴</h1>
					<p className="text-gray-600">過去のテスト結果を確認</p>
				</div>
				<Link href="/study/test">
					<Button variant="outline">
						<ArrowLeft className="mr-2 h-4 w-4" />
						テストモード
					</Button>
				</Link>
			</div>

			{/* 統計サマリー */}
			{stats.totalTests > 0 && (
				<div className="mb-8 grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
								<Calendar className="h-4 w-4" />
								受験回数
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.totalTests}回</div>
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
							<div className="text-3xl font-bold">
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
							<div className="text-3xl font-bold">{stats.highestScore}問</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* テスト履歴リスト */}
			{testResults.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="mb-4 text-gray-600">まだテストを受けていません</p>
						<Link href="/study/test">
							<Button>最初のテストを受ける</Button>
						</Link>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{testResults.map((result) => {
						const isPerfect = result.percentage === 100;
						const isGood = result.percentage >= 80;

						return (
							<Link key={result.id} href={`/study/test/result/${result.id}`}>
								<Card className="transition-all hover:border-blue-300 hover:shadow-md">
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<div className="mb-2 flex items-center gap-3">
													<div className="text-3xl">
														{isPerfect ? "🏆" : isGood ? "🎉" : "📝"}
													</div>
													<div>
														<div className="flex items-center gap-2">
															<span
																className={`text-2xl font-bold ${
																	isPerfect
																		? "text-yellow-600"
																		: isGood
																			? "text-green-600"
																			: "text-blue-600"
																}`}
															>
																{result.percentage}%
															</span>
															<span className="text-sm text-gray-600">
																({result.score} / {result.questionCount}問正解)
															</span>
														</div>
														<div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
															<span className="flex items-center gap-1">
																<Calendar className="h-4 w-4" />
																{result.completedAt
																	.toDate()
																	.toLocaleDateString("ja-JP")}
															</span>
															<span className="flex items-center gap-1">
																<Clock className="h-4 w-4" />
																{Math.floor(result.totalTimeSpent / 60)}分
																{result.totalTimeSpent % 60}秒
															</span>
															{result.timeLimit && (
																<span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
																	制限時間: {Math.floor(result.timeLimit / 60)}
																	分
																</span>
															)}
														</div>
													</div>
												</div>
												<div className="mt-3 flex flex-wrap gap-2">
													{result.categories.map((category) => (
														<span
															key={category}
															className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
														>
															{category}
														</span>
													))}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
