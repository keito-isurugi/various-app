/**
 * src/app/databases/page.tsx
 *
 * データベース学習のメインページ
 * 利用可能なデータベース学習コンテンツ一覧とガイドを提供
 */

"use client";

import Link from "next/link";
import React from "react";

/**
 * データベース学習トピックの型定義
 */
interface DatabaseTopic {
	id: string;
	name: string;
	description: string;
	category: string;
	difficulty: number;
	estimatedTime: string;
	keyTopics: string[];
}

/**
 * データベース学習メインページ
 * 各データベーストピックへのナビゲーションと概要を提供
 */
export default function DatabasesPage() {
	// 利用可能なデータベース学習トピック一覧
	const availableTopics: DatabaseTopic[] = [
		{
			id: "basics",
			name: "データベース基礎",
			description:
				"データベースの基本概念から、RDBとNoSQLの違い、基本用語、SQLの基礎まで、データベース技術の土台となる知識を体系的に学習",
			category: "fundamental",
			difficulty: 1,
			estimatedTime: "3-4時間",
			keyTopics: [
				"データベースとは",
				"RDB vs NoSQL",
				"基本用語（テーブル、レコードなど）",
				"SQL基礎",
				"正規化",
				"インデックス",
			],
		},
	];

	// 今後追加予定のトピック
	const upcomingTopics = [
		{
			name: "SQL実践",
			description: "複雑なクエリとパフォーマンス最適化",
			category: "intermediate",
		},
		{
			name: "データベース設計",
			description: "効率的なスキーマ設計とER図作成",
			category: "intermediate",
		},
		{
			name: "NoSQLデータベース",
			description: "MongoDB、DynamoDBなどの実践",
			category: "intermediate",
		},
		{
			name: "データベース運用",
			description: "バックアップ、レプリケーション、監視",
			category: "advanced",
		},
	];

	/**
	 * 難易度レベルを星で表示
	 */
	const getDifficultyStars = (difficulty: number): string => {
		return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
	};

	/**
	 * カテゴリの日本語名を取得
	 */
	const getCategoryName = (category: string): string => {
		const categoryMap: Record<string, string> = {
			fundamental: "基礎",
			intermediate: "中級",
			advanced: "上級",
			practical: "実践",
		};
		return categoryMap[category] || category;
	};

	/**
	 * カテゴリの色を取得
	 */
	const getCategoryColor = (category: string): string => {
		const colorMap: Record<string, string> = {
			fundamental:
				"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
			intermediate:
				"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
			advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
			practical:
				"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
		};
		return colorMap[category] || colorMap.fundamental;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* ページヘッダー */}
				<header className="mb-12 text-center">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						データベース学習
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
						データベースの基礎から実践まで、効率的なデータ管理技術をマスターしよう
					</p>

					{/* 学習の特徴 */}
					<div className="grid md:grid-cols-3 gap-6 mt-8">
						<div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-6 border border-cyan-200 dark:border-cyan-700">
							<div className="text-3xl mb-3">🗄️</div>
							<h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
								基礎から実践
							</h3>
							<p className="text-cyan-700 dark:text-cyan-300 text-sm">
								概念理解から実際のDBops管理まで
							</p>
						</div>
						<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
							<div className="text-3xl mb-3">💾</div>
							<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
								SQL+NoSQL
							</h3>
							<p className="text-blue-700 dark:text-blue-300 text-sm">
								RDBからNoSQLまで幅広くカバー
							</p>
						</div>
						<div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
							<div className="text-3xl mb-3">⚡</div>
							<h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
								実践重視
							</h3>
							<p className="text-purple-700 dark:text-purple-300 text-sm">
								ハンズオンでスキルを身につける
							</p>
						</div>
					</div>
				</header>

				{/* データベース学習トピック */}
				<section className="mb-12">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
						📚 学習コンテンツ
					</h2>

					<div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
						{availableTopics.map((topic) => (
							<Link
								key={topic.id}
								href={`/databases/${topic.id}`}
								className="group"
							>
								<div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]">
									{/* トピック名とカテゴリ */}
									<div className="flex items-start justify-between mb-6">
										<h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
											{topic.name}
										</h3>
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(topic.category)}`}
										>
											{getCategoryName(topic.category)}
										</span>
									</div>

									{/* 説明 */}
									<p className="text-gray-600 dark:text-gray-400 text-base mb-6 leading-relaxed">
										{topic.description}
									</p>

									{/* 学習項目 */}
									<div className="mb-6">
										<h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
											📋 学習項目:
										</h4>
										<div className="grid md:grid-cols-2 gap-2">
											{topic.keyTopics.map((keyTopic) => (
												<span
													key={keyTopic}
													className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full"
												>
													{keyTopic}
												</span>
											))}
										</div>
									</div>

									{/* メタ情報 */}
									<div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
										<div className="flex items-center space-x-6">
											<div className="text-sm">
												<span className="text-gray-500 dark:text-gray-500">
													難易度:
												</span>
												<span className="ml-2 text-yellow-500">
													{getDifficultyStars(topic.difficulty)}
												</span>
											</div>
											<div className="text-sm">
												<span className="text-gray-500 dark:text-gray-500">
													学習時間:
												</span>
												<span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
													{topic.estimatedTime}
												</span>
											</div>
										</div>
										<div className="text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform text-lg">
											→
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>

				{/* 今後の予定 */}
				<section className="mb-12">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
						🚀 今後追加予定のコンテンツ
					</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
						{upcomingTopics.map((topic) => (
							<div
								key={`${topic.name}-${topic.category}`}
								className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center"
							>
								<div className="text-3xl mb-3">⏳</div>
								<h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
									{topic.name}
								</h3>
								<p className="text-gray-500 dark:text-gray-500 text-sm mb-3">
									{topic.description}
								</p>
								<span
									className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}
								>
									{getCategoryName(topic.category)}
								</span>
							</div>
						))}
					</div>
				</section>

				{/* 学習ガイド */}
				<section className="mb-12">
					<div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-cyan-200 dark:border-cyan-700">
						<h2 className="text-2xl font-bold text-cyan-900 dark:text-cyan-100 mb-6 text-center">
							🎯 効果的なデータベース学習法
						</h2>

						<div className="grid md:grid-cols-2 gap-8">
							<div>
								<h3 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-4">
									📚 学習のステップ
								</h3>
								<ol className="space-y-3 text-cyan-700 dark:text-cyan-300 text-sm">
									<li>1. データベースの基本概念を理解する</li>
									<li>2. SQLの基本構文をマスターする</li>
									<li>3. データベース設計の原則を学ぶ</li>
									<li>4. 実際のプロジェクトで実践する</li>
									<li>5. パフォーマンス最適化を学習する</li>
								</ol>
							</div>

							<div>
								<h3 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-4">
									💡 理解を深めるコツ
								</h3>
								<ul className="space-y-3 text-cyan-700 dark:text-cyan-300 text-sm">
									<li>• 実際にデータベースを操作して学習する</li>
									<li>• 身近なデータで練習問題を作る</li>
									<li>• ERダイアグラムを書いて設計力を養う</li>
									<li>• 異なるDBMSの特徴を比較する</li>
									<li>• パフォーマンス問題を意識する</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* フッター情報 */}
				<footer className="text-center text-gray-600 dark:text-gray-400">
					<p className="text-sm">
						🗄️
						データは現代のビジネスの核心です。適切なデータベース設計と管理で、価値あるシステムを構築しましょう！
					</p>
				</footer>
			</div>
		</div>
	);
}
