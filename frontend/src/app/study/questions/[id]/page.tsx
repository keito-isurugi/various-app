"use client";

import { Button } from "@/components/ui/button";
import { questionService } from "@/lib/study/questionService";
import type { Language, Question } from "@/types/study";
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	Eye,
	EyeOff,
	Languages as LanguagesIcon,
	List,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function QuestionDetailPage() {
	const params = useParams();
	const router = useRouter();
	const questionId = params.id as string;

	const [question, setQuestion] = useState<Question | null>(null);
	const [allQuestions, setAllQuestions] = useState<Question[]>([]);
	const [loading, setLoading] = useState(true);
	const [language, setLanguage] = useState<Language>("ja");
	const [showAnswer, setShowAnswer] = useState(false);

	const loadQuestion = useCallback(async () => {
		try {
			setLoading(true);
			const q = await questionService.getQuestionById(questionId);
			setQuestion(q);
		} catch (error) {
			console.error("Failed to load question:", error);
		} finally {
			setLoading(false);
		}
	}, [questionId]);

	const loadAllQuestions = useCallback(async () => {
		try {
			const questions = await questionService.getAllQuestions();
			setAllQuestions(questions);
		} catch (error) {
			console.error("Failed to load all questions:", error);
		}
	}, []);

	useEffect(() => {
		loadQuestion();
		loadAllQuestions();
	}, [loadQuestion, loadAllQuestions]);

	const currentIndex = allQuestions.findIndex((q) => q.id === questionId);
	const hasPrevious = currentIndex > 0;
	const hasNext = currentIndex < allQuestions.length - 1;

	const goToPrevious = () => {
		if (hasPrevious) {
			const previousId = allQuestions[currentIndex - 1].id;
			router.push(`/study/questions/${previousId}`);
			setShowAnswer(false);
		}
	};

	const goToNext = () => {
		if (hasNext) {
			const nextId = allQuestions[currentIndex + 1].id;
			router.push(`/study/questions/${nextId}`);
			setShowAnswer(false);
		}
	};

	const getGroupColor = (group: string) => {
		const colors: Record<string, string> = {
			DSA: "bg-blue-100 text-blue-800 border-blue-200",
			Backend: "bg-green-100 text-green-800 border-green-200",
			Frontend: "bg-purple-100 text-purple-800 border-purple-200",
			DevOps: "bg-orange-100 text-orange-800 border-orange-200",
			Database: "bg-teal-100 text-teal-800 border-teal-200",
			Security: "bg-red-100 text-red-800 border-red-200",
		};
		return colors[group] || "bg-gray-100 text-gray-800 border-gray-200";
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
					<p className="text-muted-foreground">読み込み中...</p>
				</div>
			</div>
		);
	}

	if (!question) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<p className="text-muted-foreground mb-4">問題が見つかりません</p>
					<Link href="/study/questions">
						<Button>問題一覧に戻る</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			{/* ヘッダー */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<Link href="/study/questions">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="mr-2 h-4 w-4" />
							一覧に戻る
						</Button>
					</Link>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setLanguage(language === "ja" ? "en" : "ja")}
						>
							<LanguagesIcon className="mr-2 h-4 w-4" />
							{language === "ja" ? "日本語" : "English"}
						</Button>
						<Link href="/study/questions">
							<Button variant="outline" size="sm">
								<List className="mr-2 h-4 w-4" />
								一覧
							</Button>
						</Link>
					</div>
				</div>

				{/* 進捗表示 */}
				{allQuestions.length > 0 && (
					<p className="text-sm text-muted-foreground">
						問題 {currentIndex + 1} / {allQuestions.length}
					</p>
				)}
			</div>

			{/* 問題カード */}
			<div className="bg-card border border-border rounded-lg p-6 mb-6">
				{/* カテゴリバッジ */}
				<div className="flex items-center gap-2 mb-4">
					<span
						className={`text-xs px-3 py-1 rounded-md border ${getGroupColor(question.group)}`}
					>
						{question.group}
					</span>
					<span className="text-sm text-muted-foreground">
						{question.category}
					</span>
				</div>

				{/* 問題 */}
				<div className="mb-6">
					<h2 className="text-lg font-semibold mb-3">問題</h2>
					<p className="text-base leading-relaxed whitespace-pre-wrap">
						{language === "ja"
							? question.japaneseQuestion
							: question.englishQuestion}
					</p>
				</div>

				{/* 回答トグル */}
				<Button
					onClick={() => setShowAnswer(!showAnswer)}
					variant={showAnswer ? "default" : "outline"}
					className="w-full mb-4"
				>
					{showAnswer ? (
						<>
							<EyeOff className="mr-2 h-4 w-4" />
							回答を隠す
						</>
					) : (
						<>
							<Eye className="mr-2 h-4 w-4" />
							回答を見る
						</>
					)}
				</Button>

				{/* 回答 */}
				{showAnswer && (
					<div className="bg-muted/50 rounded-lg p-4 mb-4">
						<h3 className="text-md font-semibold mb-3">回答</h3>
						<p className="text-base leading-relaxed whitespace-pre-wrap">
							{language === "ja"
								? question.japaneseAnswer
								: question.englishAnswer}
						</p>
					</div>
				)}

				{/* 関連リンク */}
				{question.relatedLink && (
					<div className="pt-4 border-t border-border">
						<a
							href={question.relatedLink}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer"
						>
							<ExternalLink className="h-4 w-4" />
							関連リンク
						</a>
					</div>
				)}
			</div>

			{/* ナビゲーション */}
			<div className="flex items-center justify-between gap-4">
				<Button
					onClick={goToPrevious}
					disabled={!hasPrevious}
					variant="outline"
					className="flex-1"
				>
					<ChevronLeft className="mr-2 h-4 w-4" />
					前の問題
				</Button>
				<Button
					onClick={goToNext}
					disabled={!hasNext}
					variant="outline"
					className="flex-1"
				>
					次の問題
					<ChevronRight className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
