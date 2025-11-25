"use client";

import { QuestionCard } from "@/components/study/QuestionCard";
import { StudyNavigation } from "@/components/study/StudyNavigation";
import { StudyProgress } from "@/components/study/StudyProgress";
import { TechQuizBreadcrumb } from "@/components/study/TechQuizBreadcrumb";
import { TechQuizQuickNav } from "@/components/study/TechQuizQuickNav";
import { Button } from "@/components/ui/button";
import { progressService } from "@/lib/study/progressService";
import { questionService } from "@/lib/study/questionService";
import { statsService } from "@/lib/study/statsService";
import type { Language, Question } from "@/types/study";
import { Download, Languages, List, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudyPage() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [language, setLanguage] = useState<Language>("ja");
	const [showAnswer, setShowAnswer] = useState(false);
	const [loading, setLoading] = useState(true);
	const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
	const [importing, setImporting] = useState(false);
	const [importMessage, setImportMessage] = useState<string | null>(null);
	const [isCompleted, setIsCompleted] = useState(false);

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

	const handleUnderstandingRecord = (understood: boolean) => {
		if (!currentQuestion) return;

		const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
		const questionId = currentQuestion.id;
		const category = currentQuestion.category;

		// 最後の問題かどうかをチェック
		const isLastQuestion = currentIndex === questions.length - 1;

		if (isLastQuestion) {
			// 最後の問題の場合、完了状態に設定
			setIsCompleted(true);
		} else {
			// 次の問題へ遷移
			handleNext();
		}

		// バックグラウンドで進捗と統計を記録
		Promise.all([
			progressService.recordAttempt(questionId, understood, timeSpent),
			statsService.recordStudy(category, understood, timeSpent),
		])
			.then(() => {
				console.log(
					`Recorded: ${understood ? "understood" : "not understood"}, time: ${timeSpent}s`,
				);
			})
			.catch((error) => {
				console.error("Failed to record progress:", error);
				// エラーが発生してもUIには影響させない
			});
	};

	const handleNewSession = () => {
		loadQuestions();
		setCurrentIndex(0);
		setShowAnswer(false);
		setSessionStartTime(Date.now());
		setIsCompleted(false);
	};

	const handleImportData = async () => {
		setImporting(true);
		setImportMessage(null);

		try {
			const response = await fetch("/api/study/import", {
				method: "POST",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "インポートに失敗しました");
			}

			setImportMessage(
				`成功: ${data.stats.success}件 / 失敗: ${data.stats.failed}件`,
			);

			// データをリロード
			await loadQuestions();
		} catch (error) {
			setImportMessage(
				`エラー: ${error instanceof Error ? error.message : "不明なエラー"}`,
			);
		} finally {
			setImporting(false);
		}
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
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				<div className="text-center space-y-6">
					<div>
						<h2 className="text-2xl font-bold mb-2">問題が見つかりません</h2>
						<p className="text-muted-foreground">
							問題データをインポートしてください
						</p>
					</div>

					<Button
						onClick={handleImportData}
						disabled={importing}
						size="lg"
						className="w-full sm:w-auto"
					>
						{importing ? (
							<>
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
								インポート中...
							</>
						) : (
							<>
								<Download className="mr-2 h-5 w-5" />
								問題データをインポート
							</>
						)}
					</Button>

					{importMessage && (
						<div
							className={`p-4 rounded-lg ${
								importMessage.startsWith("成功")
									? "bg-green-50 text-green-800 border border-green-200"
									: "bg-red-50 text-red-800 border border-red-200"
							}`}
						>
							{importMessage}
						</div>
					)}
				</div>
			</div>
		);
	}

	// セッション完了画面
	if (isCompleted) {
		return (
			<div className="container mx-auto px-4 py-6 max-w-4xl">
				{/* パンくずリスト */}
				<TechQuizBreadcrumb items={[{ label: "ランダム演習" }]} />

				{/* クイックナビゲーション */}
				<TechQuizQuickNav />

				{/* 完了メッセージ */}
				<div className="flex flex-col items-center justify-center space-y-6 py-12">
					<div className="text-center space-y-4">
						<div className="text-6xl">🎉</div>
						<h2 className="text-3xl font-bold">セッション完了！</h2>
						<p className="text-lg text-gray-600">
							{questions.length}問の演習を完了しました
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
						<Button
							onClick={handleNewSession}
							size="lg"
							className="flex-1"
							type="button"
						>
							<RefreshCw className="mr-2 h-5 w-5" />
							新しいセットで続ける
						</Button>
						<Link href="/study/techquiz/dashboard" className="flex-1">
							<Button
								variant="outline"
								size="lg"
								className="w-full"
								type="button"
							>
								統計を見る
							</Button>
						</Link>
					</div>

					<Link
						href="/study/techquiz"
						className="text-blue-600 hover:underline"
					>
						ホームに戻る
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6 max-w-4xl">
			{/* パンくずリスト */}
			<TechQuizBreadcrumb items={[{ label: "ランダム演習" }]} />

			{/* クイックナビゲーション */}
			<TechQuizQuickNav />

			{/* ツールバー */}
			<div className="mb-6 space-y-4">
				<div className="flex items-center justify-between">
					<h1 className="text-xl sm:text-2xl font-bold">ランダム演習</h1>

					<div className="flex items-center gap-2">
						<Link href="/study/techquiz/questions">
							<Button
								variant="outline"
								size="sm"
								className="flex items-center gap-2"
								type="button"
							>
								<List className="h-4 w-4" />
								<span className="hidden sm:inline">問題一覧</span>
							</Button>
						</Link>

						<Button
							variant="outline"
							size="sm"
							onClick={handleLanguageToggle}
							className="flex items-center gap-2"
							type="button"
						>
							<Languages className="h-4 w-4" />
							<span className="hidden sm:inline">
								{language === "ja" ? "日本語" : "English"}
							</span>
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={handleNewSession}
							className="flex items-center gap-2"
							type="button"
						>
							<RefreshCw className="h-4 w-4" />
							<span className="hidden sm:inline">新しいセット</span>
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={handleImportData}
							disabled={importing}
							className="flex items-center gap-2"
							type="button"
						>
							{importing ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Download className="h-4 w-4" />
							)}
							<span className="hidden sm:inline">データ更新</span>
						</Button>
					</div>
				</div>

				<StudyProgress
					currentIndex={currentIndex}
					totalQuestions={questions.length}
				/>
			</div>

			{/* 問題カード */}
			<div className="mb-8">
				<QuestionCard
					question={currentQuestion}
					language={language}
					showAnswer={showAnswer}
					onToggleAnswer={handleToggleAnswer}
					onUnderstanding={handleUnderstandingRecord}
				/>
			</div>

			{/* ナビゲーション */}
			<StudyNavigation
				currentIndex={currentIndex}
				totalQuestions={questions.length}
				onPrevious={handlePrevious}
				onNext={handleNext}
				canGoPrevious={currentIndex > 0}
				canGoNext={currentIndex < questions.length - 1}
			/>
		</div>
	);
}
