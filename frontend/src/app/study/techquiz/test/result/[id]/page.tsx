"use client";

import { TechQuizBreadcrumb } from "@/components/study/TechQuizBreadcrumb";
import { TechQuizQuickNav } from "@/components/study/TechQuizQuickNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questionService } from "@/lib/study/questionService";
import { testService } from "@/lib/study/testService";
import type { Question, TestResult } from "@/types/study";
import {
	Award,
	Check,
	Clock,
	Home,
	RotateCw,
	TrendingUp,
	X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function TestResultPage() {
	const params = useParams();
	const testId = params.id as string;
	const [testResult, setTestResult] = useState<TestResult | null>(null);
	const [questions, setQuestions] = useState<Map<string, Question>>(new Map());
	const [loading, setLoading] = useState(true);

	const loadTestResult = useCallback(async () => {
		setLoading(true);
		try {
			const result = await testService.getTestResult(testId);
			if (!result) {
				console.error("Test result not found");
				return;
			}

			setTestResult(result);

			// 問題データを取得
			const questionIds = result.questionResults.map(
				(r: { questionId: string }) => r.questionId,
			);
			const allQuestions = await questionService.getAllQuestions();
			const questionMap = new Map<string, Question>();

			for (const q of allQuestions) {
				if (questionIds.includes(q.id)) {
					questionMap.set(q.id, q);
				}
			}

			setQuestions(questionMap);
		} catch (error) {
			console.error("Failed to load test result:", error);
		} finally {
			setLoading(false);
		}
	}, [testId]);

	useEffect(() => {
		loadTestResult();
	}, [loadTestResult]);

	if (loading) {
		return (
			<div className="container mx-auto max-w-6xl p-6">
				<div className="flex items-center justify-center py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
				</div>
			</div>
		);
	}

	if (!testResult) {
		return (
			<div className="container mx-auto max-w-6xl p-6">
				<div className="text-center">
					<p className="text-gray-600">テスト結果が見つかりませんでした</p>
					<Link href="/study/techquiz/test">
						<Button className="mt-4">テストモードに戻る</Button>
					</Link>
				</div>
			</div>
		);
	}

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}分${secs}秒`;
	};

	const correctCount = testResult.score;
	const incorrectCount = testResult.questionCount - testResult.score;
	const isPerfect = testResult.percentage === 100;
	const isGood = testResult.percentage >= 80;

	return (
		<div className="container mx-auto max-w-6xl p-6">
			{/* パンくずリスト */}
			<TechQuizBreadcrumb
				items={[
					{ label: "テストモード", href: "/study/techquiz/test" },
					{ label: "テスト結果" },
				]}
			/>

			{/* クイックナビゲーション */}
			<TechQuizQuickNav />

			{/* 結果サマリー */}
			<Card className="mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
				<CardContent className="pt-8 text-center">
					<div className="mb-4">
						{isPerfect ? (
							<div className="mb-2 text-6xl">🏆</div>
						) : isGood ? (
							<div className="mb-2 text-6xl">🎉</div>
						) : (
							<div className="mb-2 text-6xl">📝</div>
						)}
						<h1 className="mb-2 text-3xl font-bold">
							{isPerfect
								? "完璧です！"
								: isGood
									? "素晴らしい！"
									: "お疲れ様でした"}
						</h1>
						<p className="text-gray-600">テスト結果</p>
					</div>

					<div className="mb-6 text-6xl font-bold text-blue-600">
						{testResult.percentage}%
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						<div>
							<div className="text-sm text-gray-600">正答数</div>
							<div className="text-2xl font-bold text-green-600">
								{correctCount} / {testResult.questionCount}
							</div>
						</div>
						<div>
							<div className="text-sm text-gray-600">所要時間</div>
							<div className="text-2xl font-bold">
								{formatTime(testResult.totalTimeSpent)}
							</div>
						</div>
						<div>
							<div className="text-sm text-gray-600">平均解答時間</div>
							<div className="text-2xl font-bold">
								{Math.round(
									testResult.totalTimeSpent / testResult.questionCount,
								)}
								秒
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* 統計カード */}
			<div className="mb-8 grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
							<Check className="h-4 w-4" />
							正答
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-green-600">
							{correctCount}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
							<X className="h-4 w-4" />
							誤答
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-red-600">
							{incorrectCount}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
							<Clock className="h-4 w-4" />
							総時間
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatTime(testResult.totalTimeSpent)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
							<Award className="h-4 w-4" />
							達成率
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{testResult.percentage}%</div>
					</CardContent>
				</Card>
			</div>

			{/* 問題別結果 */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						<span>問題別結果</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{testResult.questionResults.map((result, index) => {
							const question = questions.get(result.questionId);
							if (!question) return null;

							return (
								<div
									key={result.questionId}
									className={`flex items-start gap-3 rounded-lg border p-4 ${
										result.understood
											? "border-green-200 bg-green-50"
											: "border-red-200 bg-red-50"
									}`}
								>
									<div
										className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
											result.understood
												? "bg-green-600 text-white"
												: "bg-red-600 text-white"
										}`}
									>
										{result.understood ? (
											<Check className="h-5 w-5" />
										) : (
											<X className="h-5 w-5" />
										)}
									</div>

									<div className="flex-1">
										<div className="mb-1 flex items-center gap-2">
											<span className="text-sm font-medium text-gray-600">
												問題 {index + 1}
											</span>
											<span className="rounded-full bg-white px-2 py-1 text-xs">
												{question.category}
											</span>
											<span className="text-xs text-gray-600">
												解答時間: {result.timeSpent}秒
											</span>
										</div>
										<p className="font-medium">{question.japaneseQuestion}</p>
										{!result.understood && (
											<Link href={`/study/techquiz/questions/${question.id}`}>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="mt-2"
												>
													解説を見る
												</Button>
											</Link>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* アクション */}
			<div className="flex flex-wrap justify-center gap-3">
				<Link href="/study/techquiz/test">
					<Button type="button" size="lg">
						<RotateCw className="mr-2 h-5 w-5" />
						もう一度テスト
					</Button>
				</Link>
				<Link href="/study/techquiz/test/history">
					<Button type="button" variant="outline" size="lg">
						テスト履歴を見る
					</Button>
				</Link>
				<Link href="/study/techquiz/dashboard">
					<Button type="button" variant="outline" size="lg">
						<Home className="mr-2 h-5 w-5" />
						ダッシュボード
					</Button>
				</Link>
			</div>
		</div>
	);
}
