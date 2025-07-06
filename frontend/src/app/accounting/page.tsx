/**
 * src/app/accounting/page.tsx
 *
 * 会計解説のメインページ
 * 会計を知らない人向けの学習支援サイト
 */

"use client";

import Link from "next/link";
import React from "react";

/**
 * 会計概念のカードデータ
 */
const accountingConcepts = [
	{
		id: "depreciation",
		title: "減価償却",
		description:
			"高額な物を買った時に、その費用を何年かに分けて計上する会計のルール",
		difficulty: 2,
		time: 15,
		color: "bg-blue-500",
		icon: "📉",
		available: true,
		path: "/accounting/depreciation",
	},
	{
		id: "inventory",
		title: "在庫管理",
		description:
			"商品や材料の価値を正しく計算し、売上と費用を適切に把握する方法",
		difficulty: 3,
		time: 20,
		color: "bg-green-500",
		icon: "📦",
		available: false,
		path: "/accounting/inventory",
	},
	{
		id: "accrual",
		title: "発生主義",
		description: "お金の動きと売上・費用の発生タイミングが違う場合の会計処理",
		difficulty: 3,
		time: 25,
		color: "bg-purple-500",
		icon: "⏰",
		available: false,
		path: "/accounting/accrual",
	},
	{
		id: "financial-statements",
		title: "財務諸表",
		description: "会社の財政状態や経営成績を表す3つの重要な報告書の見方",
		difficulty: 4,
		time: 30,
		color: "bg-orange-500",
		icon: "📊",
		available: false,
		path: "/accounting/financial-statements",
	},
];

/**
 * 学習ガイドデータ
 */
const learningGuide = [
	{
		step: 1,
		title: "減価償却から始めよう",
		description:
			"会計の基本概念である減価償却を理解することで、お金と時間の関係を学びます",
		recommended: true,
	},
	{
		step: 2,
		title: "在庫の概念を理解",
		description: "商品がお金に変わるプロセスと、在庫の価値評価方法を学びます",
		recommended: false,
	},
	{
		step: 3,
		title: "発生主義の考え方",
		description: "現金の動きと売上・費用の認識タイミングの違いを理解します",
		recommended: false,
	},
	{
		step: 4,
		title: "財務諸表を読んでみよう",
		description: "会社の状況を数字で理解する方法を学びます",
		recommended: false,
	},
];

/**
 * 会計学習メインページ
 * 初心者向けの会計概念解説とナビゲーション
 */
export default function AccountingPage() {
	/**
	 * 難易度を星で表示
	 */
	const getDifficultyStars = (difficulty: number): string => {
		return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* ページヘッダー */}
				<header className="mb-12 text-center">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						わかりやすい会計解説
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
						会計を知らない人でも理解できる、身近な例を使った会計の基礎学習
					</p>

					{/* 学習の特徴 */}
					<div className="grid md:grid-cols-3 gap-6 mt-8">
						<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
							<div className="text-3xl mb-3">💡</div>
							<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
								身近な例で理解
							</h3>
							<p className="text-blue-700 dark:text-blue-300 text-sm">
								スマホの分割払いなど、日常の例を使って説明
							</p>
						</div>
						<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
							<div className="text-3xl mb-3">🧮</div>
							<h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
								計算練習
							</h3>
							<p className="text-green-700 dark:text-green-300 text-sm">
								実際に数値を入力して計算を体験
							</p>
						</div>
						<div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
							<div className="text-3xl mb-3">📈</div>
							<h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
								段階的学習
							</h3>
							<p className="text-purple-700 dark:text-purple-300 text-sm">
								基礎から応用まで、無理のないペースで習得
							</p>
						</div>
					</div>
				</header>

				{/* 学習概念一覧 */}
				<section className="mb-12">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
						📚 学習できる会計概念
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						{accountingConcepts.map((concept) => (
							<div
								key={concept.id}
								className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-200 ${
									concept.available
										? "hover:shadow-xl hover:scale-105"
										: "opacity-60"
								}`}
							>
								{concept.available ? (
									<Link href={concept.path}>
										<div className="group cursor-pointer">
											{/* 概念名とアイコン */}
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-center gap-3">
													<div className="text-4xl">{concept.icon}</div>
													<div>
														<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
															{concept.title}
														</h3>
														<div className="flex items-center gap-4 mt-1">
															<span className="text-sm text-gray-500">
																難易度: {getDifficultyStars(concept.difficulty)}
															</span>
															<span className="text-sm text-gray-500">
																約{concept.time}分
															</span>
														</div>
													</div>
												</div>
												<div className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
													→
												</div>
											</div>

											{/* 説明 */}
											<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
												{concept.description}
											</p>
										</div>
									</Link>
								) : (
									<div>
										{/* 準備中の概念 */}
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center gap-3">
												<div className="text-4xl grayscale">{concept.icon}</div>
												<div>
													<h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">
														{concept.title}
													</h3>
													<div className="flex items-center gap-4 mt-1">
														<span className="text-sm text-gray-400">
															難易度: {getDifficultyStars(concept.difficulty)}
														</span>
														<span className="text-sm text-gray-400">
															約{concept.time}分
														</span>
													</div>
												</div>
											</div>
											<span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
												準備中
											</span>
										</div>
										<p className="text-gray-500 dark:text-gray-500 text-sm leading-relaxed">
											{concept.description}
										</p>
									</div>
								)}
							</div>
						))}
					</div>
				</section>

				{/* 学習ガイド */}
				<section className="mb-12">
					<div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-indigo-200 dark:border-indigo-700">
						<h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-6 text-center">
							🎯 おすすめの学習順序
						</h2>

						<div className="space-y-4">
							{learningGuide.map((guide) => (
								<div key={guide.step} className="flex items-start gap-4">
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
											guide.recommended ? "bg-indigo-500" : "bg-gray-400"
										}`}
									>
										{guide.step}
									</div>
									<div className="flex-1">
										<h3
											className={`font-semibold mb-1 ${
												guide.recommended
													? "text-indigo-900 dark:text-indigo-100"
													: "text-gray-600 dark:text-gray-400"
											}`}
										>
											{guide.title}
											{guide.recommended && (
												<span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded">
													おすすめ
												</span>
											)}
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{guide.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* フッター情報 */}
				<footer className="text-center text-gray-600 dark:text-gray-400">
					<p className="text-sm">
						💼 会計の基礎を理解して、ビジネスに活かしましょう！
					</p>
				</footer>
			</div>
		</div>
	);
}
