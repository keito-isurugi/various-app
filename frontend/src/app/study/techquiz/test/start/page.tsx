"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { questionService } from "@/lib/study/questionService";
import { testService } from "@/lib/study/testService";
import type { Question } from "@/types/study";
import { AlertCircle, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function TestStartContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<Map<string, boolean>>(new Map());
	const [timesPerQuestion, setTimesPerQuestion] = useState<Map<string, number>>(
		new Map(),
	);
	const [showAnswer, setShowAnswer] = useState(false);
	const [startTime] = useState(Date.now());
	const [questionStartTime, setQuestionStartTime] = useState(Date.now());
	const [timeLimit, setTimeLimit] = useState<number | null>(null);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [loading, setLoading] = useState(true);

	const loadQuestions = useCallback(async () => {
		const count = Number.parseInt(searchParams.get("count") || "10");
		const timeLimitParam = searchParams.get("timeLimit");
		const limit = timeLimitParam ? Number.parseInt(timeLimitParam) : null;

		setTimeLimit(limit);

		try {
			const randomQuestions = await questionService.getRandomQuestions(count);
			setQuestions(randomQuestions);
			setQuestionStartTime(Date.now());
		} catch (error) {
			console.error("Failed to load questions:", error);
		} finally {
			setLoading(false);
		}
	}, [searchParams]);

	useEffect(() => {
		loadQuestions();
	}, [loadQuestions]);

	// タイマー
	useEffect(() => {
		const interval = setInterval(() => {
			setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, [startTime]);

	// 制限時間チェック
	useEffect(() => {
		if (timeLimit && elapsedTime >= timeLimit) {
			handleFinishTest();
		}
	}, [elapsedTime, timeLimit]);

	const currentQuestion = questions[currentIndex];

	const handleAnswer = (understood: boolean) => {
		if (!currentQuestion) return;

		const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

		setAnswers(new Map(answers.set(currentQuestion.id, understood)));
		setTimesPerQuestion(
			new Map(timesPerQuestion.set(currentQuestion.id, timeSpent)),
		);

		setShowAnswer(false);

		// 自動的に次の問題へ
		if (currentIndex < questions.length - 1) {
			setCurrentIndex(currentIndex + 1);
			setQuestionStartTime(Date.now());
		}
	};

	const handleNext = () => {
		if (currentIndex < questions.length - 1) {
			setCurrentIndex(currentIndex + 1);
			setQuestionStartTime(Date.now());
			setShowAnswer(false);
		}
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
			setQuestionStartTime(Date.now());
			setShowAnswer(false);
		}
	};

	const handleFinishTest = async () => {
		try {
			const testId = await testService.saveTestResult(
				questions,
				answers,
				timesPerQuestion,
				startTime,
				timeLimit,
			);
			router.push(`/study/techquiz/test/result/${testId}`);
		} catch (error) {
			console.error("Failed to save test result:", error);
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const answeredCount = answers.size;
	const remainingTime = timeLimit ? timeLimit - elapsedTime : null;

	if (loading) {
		return (
			<div className="container mx-auto max-w-4xl p-6">
				<div className="flex items-center justify-center py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
				</div>
			</div>
		);
	}

	if (!currentQuestion) {
		return (
			<div className="container mx-auto max-w-4xl p-6">
				<div className="text-center">
					<p className="text-gray-600">問題が見つかりませんでした</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-4xl p-6">
			{/* ヘッダー */}
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">テスト実施中</h1>
					<p className="text-sm text-gray-600">
						問題 {currentIndex + 1} / {questions.length} （解答済み:{" "}
						{answeredCount}）
					</p>
				</div>
				<div className="text-right">
					<div className="text-sm text-gray-600">経過時間</div>
					<div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
					{remainingTime !== null && (
						<div
							className={`text-sm ${remainingTime < 300 ? "font-bold text-red-600" : "text-gray-600"}`}
						>
							残り {formatTime(remainingTime)}
						</div>
					)}
				</div>
			</div>

			{/* 進捗バー */}
			<div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
				<div
					className="h-full bg-blue-600 transition-all duration-300"
					style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
				/>
			</div>

			{/* 問題カード */}
			<Card className="mb-6">
				<CardContent className="pt-6">
					<div className="mb-4 flex items-center gap-2">
						<span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
							{currentQuestion.group}
						</span>
						<span className="text-sm text-gray-600">
							{currentQuestion.category}
						</span>
					</div>

					<div className="mb-6">
						<h2 className="mb-4 text-xl font-bold">
							{currentQuestion.japaneseQuestion}
						</h2>

						{showAnswer ? (
							<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
								<p className="mb-2 text-sm font-medium text-gray-700">解答:</p>
								<p className="whitespace-pre-wrap text-gray-900">
									{currentQuestion.japaneseAnswer}
								</p>
							</div>
						) : (
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowAnswer(true)}
								className="w-full"
							>
								解答を表示
							</Button>
						)}
					</div>

					{/* 解答ボタン */}
					{showAnswer && !answers.has(currentQuestion.id) && (
						<div className="flex gap-3">
							<Button
								type="button"
								onClick={() => handleAnswer(true)}
								className="flex-1 bg-green-600 hover:bg-green-700"
							>
								<Check className="mr-2 h-5 w-5" />
								理解した
							</Button>
							<Button
								type="button"
								onClick={() => handleAnswer(false)}
								variant="outline"
								className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
							>
								<X className="mr-2 h-5 w-5" />
								理解していない
							</Button>
						</div>
					)}

					{/* 既に解答済み */}
					{answers.has(currentQuestion.id) && (
						<div
							className={`rounded-lg p-3 ${
								answers.get(currentQuestion.id)
									? "bg-green-50 text-green-800"
									: "bg-red-50 text-red-800"
							}`}
						>
							{answers.get(currentQuestion.id)
								? "✓ 理解した"
								: "✗ 理解していない"}
						</div>
					)}
				</CardContent>
			</Card>

			{/* ナビゲーション */}
			<div className="flex items-center justify-between">
				<Button
					type="button"
					variant="outline"
					onClick={handlePrevious}
					disabled={currentIndex === 0}
				>
					<ChevronLeft className="mr-2 h-4 w-4" />
					前の問題
				</Button>

				<div className="flex gap-3">
					{answeredCount < questions.length && (
						<Button
							type="button"
							variant="outline"
							onClick={handleFinishTest}
							className="border-orange-600 text-orange-600 hover:bg-orange-50"
						>
							<AlertCircle className="mr-2 h-4 w-4" />
							未回答で終了
						</Button>
					)}

					{answeredCount === questions.length && (
						<Button type="button" onClick={handleFinishTest}>
							テスト終了
						</Button>
					)}
				</div>

				<Button
					type="button"
					variant="outline"
					onClick={handleNext}
					disabled={currentIndex === questions.length - 1}
				>
					次の問題
					<ChevronRight className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}

export default function TestStartPage() {
	return (
		<Suspense
			fallback={
				<div className="container mx-auto max-w-4xl p-6">
					<div className="flex items-center justify-center py-12">
						<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
					</div>
				</div>
			}
		>
			<TestStartContent />
		</Suspense>
	);
}
