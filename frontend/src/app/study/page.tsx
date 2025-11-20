"use client";

import { QuestionCard } from "@/components/study/QuestionCard";
import { StudyHeader } from "@/components/study/StudyHeader";
import { StudyNavigation } from "@/components/study/StudyNavigation";
import { StudyProgress } from "@/components/study/StudyProgress";
import { progressService } from "@/lib/study/progressService";
import { questionService } from "@/lib/study/questionService";
import type { Language, Question } from "@/types/study";
import { useEffect, useState } from "react";

export default function StudyPage() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [language, setLanguage] = useState<Language>("ja");
	const [showAnswer, setShowAnswer] = useState(false);
	const [loading, setLoading] = useState(true);
	const [sessionStartTime, setSessionStartTime] = useState<number>(
		Date.now(),
	);

	// 問題を読み込む
	useEffect(() => {
		loadQuestions();
	}, []);

	const loadQuestions = async () => {
		try {
			setLoading(true);
			const randomQuestions = await questionService.getRandomQuestions(10);
			setQuestions(randomQuestions);
		} catch (error) {
			console.error("Failed to load questions:", error);
		} finally {
			setLoading(false);
		}
	};

	const currentQuestion = questions[currentIndex];

	const handleNext = () => {
		if (currentIndex < questions.length - 1) {
			setCurrentIndex(currentIndex + 1);
			setShowAnswer(false);
			setSessionStartTime(Date.now());
		}
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
			setShowAnswer(false);
			setSessionStartTime(Date.now());
		}
	};

	const handleToggleAnswer = () => {
		setShowAnswer(!showAnswer);
	};

	const handleLanguageToggle = () => {
		setLanguage(language === "ja" ? "en" : "ja");
	};

	const handleUnderstandingRecord = async (understood: boolean) => {
		if (!currentQuestion) return;

		const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);

		try {
			await progressService.recordAttempt(
				currentQuestion.id,
				understood,
				timeSpent,
			);
			console.log(
				`Recorded: ${understood ? "understood" : "not understood"}, time: ${timeSpent}s`,
			);

			// 次の問題へ自動遷移
			handleNext();
		} catch (error) {
			console.error("Failed to record progress:", error);
		}
	};

	const handleNewSession = () => {
		loadQuestions();
		setCurrentIndex(0);
		setShowAnswer(false);
		setSessionStartTime(Date.now());
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
					<p className="text-muted-foreground">問題を読み込んでいます...</p>
				</div>
			</div>
		);
	}

	if (questions.length === 0) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<p className="text-muted-foreground mb-4">
						問題が見つかりませんでした
					</p>
					<p className="text-sm text-muted-foreground">
						Firebase Emulatorを起動し、問題データをインポートしてください
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<StudyHeader
				onLanguageToggle={handleLanguageToggle}
				currentLanguage={language}
				onNewSession={handleNewSession}
			/>

			<main className="container mx-auto px-4 py-6 max-w-4xl">
				<StudyProgress
					currentIndex={currentIndex}
					totalQuestions={questions.length}
				/>

				<div className="mt-6">
					<QuestionCard
						question={currentQuestion}
						language={language}
						showAnswer={showAnswer}
						onToggleAnswer={handleToggleAnswer}
						onUnderstanding={handleUnderstandingRecord}
					/>
				</div>

				<StudyNavigation
					currentIndex={currentIndex}
					totalQuestions={questions.length}
					onPrevious={handlePrevious}
					onNext={handleNext}
					canGoPrevious={currentIndex > 0}
					canGoNext={currentIndex < questions.length - 1}
				/>
			</main>
		</div>
	);
}
