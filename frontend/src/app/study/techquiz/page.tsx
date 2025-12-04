"use client";

import { questionService } from "@/lib/study/questionService";
import { reviewService } from "@/lib/study/reviewService";
import { statsService } from "@/lib/study/statsService";
import {
	Award,
	BookOpen,
	Brain,
	Calendar,
	CheckCircle,
	Clock,
	Info,
	ListChecks,
	Loader2,
	PieChart,
	RefreshCw,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TechQuizHomePage() {
	const [stats, setStats] = useState({
		totalQuestions: 0,
		answeredQuestions: 0,
		understoodCount: 0,
		currentStreak: 0,
	});
	const [reviewCount, setReviewCount] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const [questions, reviewQuestions] = await Promise.all([
					questionService.getAllQuestions(),
					reviewService.getTodayReviewQuestions(),
				]);

				let userStats = await statsService.getUserStats();
				if (!userStats) {
					userStats = await statsService.initializeUserStats();
				}

				setStats({
					totalQuestions: questions.length,
					answeredQuestions: userStats.answeredQuestions,
					understoodCount: userStats.understoodCount,
					currentStreak: userStats.currentStreak,
				});
				setReviewCount(reviewQuestions.length);
			} catch (error) {
				console.error("Failed to load data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const accuracyRate =
		stats.answeredQuestions > 0
			? Math.round((stats.understoodCount / stats.answeredQuestions) * 100)
			: 0;

	const navigationCards = [
		{
			href: "/study/techquiz/practice",
			icon: RefreshCw,
			title: "ランダム演習",
			description: "ランダムに選ばれた問題で学習",
			color: "blue",
		},
		{
			href: "/study/techquiz/questions",
			icon: ListChecks,
			title: "問題一覧",
			description: "全ての問題を閲覧・フィルター",
			color: "purple",
		},
		{
			href: "/study/techquiz/dashboard",
			icon: PieChart,
			title: "ダッシュボード",
			description: "学習統計と進捗を確認",
			color: "green",
		},
		{
			href: "/study/techquiz/review",
			icon: Clock,
			title: "復習リスト",
			description: `復習が必要な問題 (${reviewCount}件)`,
			color: "orange",
			badge: reviewCount > 0 ? reviewCount : null,
		},
		{
			href: "/study/techquiz/test",
			icon: Award,
			title: "テストモード",
			description: "模擬試験で実力チェック",
			color: "red",
		},
	];

	const getColorClasses = (color: string) => {
		const colors: Record<string, { bg: string; icon: string; hover: string }> =
			{
				blue: {
					bg: "bg-blue-50 dark:bg-blue-900/20",
					icon: "text-blue-600 dark:text-blue-400",
					hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
				},
				purple: {
					bg: "bg-purple-50 dark:bg-purple-900/20",
					icon: "text-purple-600 dark:text-purple-400",
					hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
				},
				green: {
					bg: "bg-green-50 dark:bg-green-900/20",
					icon: "text-green-600 dark:text-green-400",
					hover: "hover:bg-green-100 dark:hover:bg-green-900/30",
				},
				orange: {
					bg: "bg-orange-50 dark:bg-orange-900/20",
					icon: "text-orange-600 dark:text-orange-400",
					hover: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
				},
				red: {
					bg: "bg-red-50 dark:bg-red-900/20",
					icon: "text-red-600 dark:text-red-400",
					hover: "hover:bg-red-100 dark:hover:bg-red-900/30",
				},
			};
		return colors[color] || colors.blue;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto px-4 py-8">
				{/* Header */}
				<header className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						Tech Quiz
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						技術問題で知識を習慣的に学習・定着させよう
					</p>
				</header>

				{/* About Section */}
				<section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
					<div className="flex items-center gap-3 mb-4">
						<Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
							Tech Quizとは？
						</h2>
					</div>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						科学的な記憶定着アルゴリズムを活用した技術学習プラットフォームです。
						理解度に応じた最適なタイミングでの復習により、長期記憶への定着を促進します。
					</p>

					<div className="grid gap-4 md:grid-cols-3 mb-6">
						<div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
							<div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-medium">
								<TrendingUp className="h-5 w-5" />
								SM-2アルゴリズム
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								理解度に応じて最適な復習タイミングを自動計算
							</p>
						</div>

						<div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
							<div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400 font-medium">
								<CheckCircle className="h-5 w-5" />
								理解度に応じた出題
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								苦手な問題は短い間隔で、得意な問題は長い間隔で復習
							</p>
						</div>

						<div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
							<div className="flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-400 font-medium">
								<Calendar className="h-5 w-5" />
								習慣化サポート
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								連続学習日数の記録やテストモードで継続的な学習をサポート
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
						<p>
							毎日少しずつ継続し、復習リストを定期的にチェックすることで効果的に学習できます。
						</p>
					</div>
				</section>

				{/* Stats */}
				<section className="grid gap-4 md:grid-cols-4 mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
							総問題数
						</p>
						<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{stats.totalQuestions}
						</p>
					</div>
					<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
							解答済み
						</p>
						<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
							{stats.answeredQuestions}
						</p>
					</div>
					<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
							正答率
						</p>
						<p className="text-2xl font-bold text-green-600 dark:text-green-400">
							{accuracyRate}%
						</p>
					</div>
					<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
							連続学習日数
						</p>
						<p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
							{stats.currentStreak}
							<span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
								日
							</span>
						</p>
					</div>
				</section>

				{/* Navigation Cards */}
				<section className="mb-8">
					<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
						機能メニュー
					</h2>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{navigationCards.map((card) => {
							const colors = getColorClasses(card.color);
							return (
								<Link key={card.href} href={card.href}>
									<div
										className={`relative h-full p-5 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors ${colors.bg} ${colors.hover}`}
									>
										<div className="flex items-center justify-between mb-3">
											<card.icon className={`h-7 w-7 ${colors.icon}`} />
											{card.badge && (
												<span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
													{card.badge}
												</span>
											)}
										</div>
										<h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
											{card.title}
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{card.description}
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				</section>

				{/* Quick Start */}
				<section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center gap-3 mb-4">
						<BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
							クイックスタート
						</h2>
					</div>
					<div className="flex flex-col sm:flex-row gap-3">
						<Link href="/study/techquiz/practice" className="flex-1">
							<button
								type="button"
								className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
							>
								ランダム演習を開始
							</button>
						</Link>
						{reviewCount > 0 && (
							<Link href="/study/techquiz/review" className="flex-1">
								<button
									type="button"
									className="w-full px-6 py-3 border-2 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-medium rounded-lg transition-colors"
								>
									今日の復習 ({reviewCount}件)
								</button>
							</Link>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}
