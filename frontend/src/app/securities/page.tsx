/**
 * src/app/securities/page.tsx
 *
 * セキュリティ学習のメインページ
 * 利用可能なセキュリティ学習コンテンツ一覧とガイドを提供
 */

"use client";

import Link from "next/link";
import React from "react";

/**
 * セキュリティ学習トピックの型定義
 */
interface SecurityTopic {
	id: string;
	name: string;
	description: string;
	category: string;
	difficulty: number;
	estimatedTime: string;
	keyTopics: string[];
}

/**
 * セキュリティ学習メインページ
 * 各セキュリティトピックへのナビゲーションと概要を提供
 */
export default function SecuritiesPage() {
	// 利用可能なセキュリティ学習トピック一覧
	const availableTopics: SecurityTopic[] = [
		{
			id: "basics",
			name: "セキュリティ基礎",
			description:
				"セキュリティの基本概念CIA（機密性・完全性・可用性）から、認証・認可、暗号化・ハッシュ化まで、情報セキュリティの基礎知識を体系的に学習",
			category: "fundamental",
			difficulty: 1,
			estimatedTime: "3-4時間",
			keyTopics: [
				"CIA（機密性・完全性・可用性）",
				"認証と認可",
				"暗号化とハッシュ化",
				"脆弱性と脅威",
				"セキュアコーディング",
				"OWASP Top 10",
			],
		},
		{
			id: "owasp-top10",
			name: "OWASP Top 10 (2021)",
			description:
				"Webアプリケーションの最も重大なセキュリティリスク10項目を詳しく学習。各リスクの原因、影響、攻撃例、対策方法を実践的に理解",
			category: "intermediate",
			difficulty: 3,
			estimatedTime: "5-6時間",
			keyTopics: [
				"アクセス制御の不備",
				"暗号化の失敗",
				"インジェクション",
				"安全でない設計",
				"セキュリティ設定ミス",
				"脆弱なコンポーネント",
				"認証の失敗",
				"データ整合性の失敗",
				"ログとモニタリング",
				"SSRF",
			],
		},
	];

	// 今後追加予定のトピック
	const upcomingTopics = [
		{
			name: "Webセキュリティ",
			description: "XSS、CSRF、SQLインジェクション対策",
			category: "intermediate",
		},
		{
			name: "ネットワークセキュリティ",
			description: "ファイアウォール、VPN、IDS/IPS",
			category: "intermediate",
		},
		{
			name: "暗号学応用",
			description: "公開鍵暗号、デジタル署名、証明書",
			category: "advanced",
		},
		{
			name: "インシデント対応",
			description: "セキュリティ事故の対応と復旧手順",
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
					<h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 dark:from-red-400 dark:via-orange-400 dark:to-yellow-400 bg-clip-text text-transparent mb-4">
						セキュリティ学習
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
						情報セキュリティの基礎から実践まで、安全なシステム構築に必要な知識を習得しよう
					</p>

					{/* 学習の特徴 */}
					<div className="grid md:grid-cols-3 gap-6 mt-8">
						<div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-700">
							<div className="text-3xl mb-3">🛡️</div>
							<h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
								実践的防御
							</h3>
							<p className="text-red-700 dark:text-red-300 text-sm">
								実際の攻撃手法とその対策を学習
							</p>
						</div>
						<div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
							<div className="text-3xl mb-3">⚠️</div>
							<h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
								脅威の理解
							</h3>
							<p className="text-orange-700 dark:text-orange-300 text-sm">
								最新の脅威動向と対策手法
							</p>
						</div>
						<div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
							<div className="text-3xl mb-3">🔒</div>
							<h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
								セキュア設計
							</h3>
							<p className="text-yellow-700 dark:text-yellow-300 text-sm">
								安全なシステム設計・開発手法
							</p>
						</div>
					</div>
				</header>

				{/* セキュリティ学習トピック */}
				<section className="mb-12">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
						📚 学習コンテンツ
					</h2>

					<div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
						{availableTopics.map((topic) => (
							<Link
								key={topic.id}
								href={`/securities/${topic.id}`}
								className="group"
							>
								<div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]">
									{/* トピック名とカテゴリ */}
									<div className="flex items-start justify-between mb-6">
										<h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
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
										<div className="text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform text-lg">
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
					<div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-8 border border-red-200 dark:border-red-700">
						<h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-6 text-center">
							🎯 効果的なセキュリティ学習法
						</h2>

						<div className="grid md:grid-cols-2 gap-8">
							<div>
								<h3 className="font-semibold text-red-800 dark:text-red-200 mb-4">
									📚 学習のステップ
								</h3>
								<ol className="space-y-3 text-red-700 dark:text-red-300 text-sm">
									<li>1. セキュリティの基本概念を理解する</li>
									<li>2. 認証・認可・暗号化の仕組みを学ぶ</li>
									<li>3. 代表的な攻撃手法と対策を習得する</li>
									<li>4. セキュアコーディングの実践</li>
									<li>5. インシデント対応手順を学習する</li>
								</ol>
							</div>

							<div>
								<h3 className="font-semibold text-red-800 dark:text-red-200 mb-4">
									💡 理解を深めるコツ
								</h3>
								<ul className="space-y-3 text-red-700 dark:text-red-300 text-sm">
									<li>• 攻撃者の視点で脆弱性を考える</li>
									<li>• 実際のセキュリティ事例を調べる</li>
									<li>• セキュリティツールを実際に使用する</li>
									<li>• 最新の脅威情報をキャッチアップする</li>
									<li>• セキュリティ設計を意識した開発</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* フッター情報 */}
				<footer className="text-center text-gray-600 dark:text-gray-400">
					<p className="text-sm">
						🔐
						セキュリティは日々進化する分野です。基礎知識をしっかりと身につけ、常に最新の脅威と対策を学び続けましょう！
					</p>
				</footer>
			</div>
		</div>
	);
}
