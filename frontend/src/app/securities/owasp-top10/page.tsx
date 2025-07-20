/**
 * src/app/securities/owasp-top10/page.tsx
 *
 * OWASP Top 10学習ページ
 * 最新のOWASP Top 10（2021版）について詳しく学習できるインタラクティブなページ
 */

"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
	type OwaspRisk,
	getRiskBgColor,
	getRiskBorderColor,
	getRiskColor,
	owaspTop10Data,
} from "./owasp-data";

/**
 * OWASP Top 10学習ページ
 * 各リスクの詳細情報、例、対策を表示
 */
export default function OwaspTop10Page() {
	// 選択中のリスクID
	const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
	// 検索クエリ
	const [searchQuery, setSearchQuery] = useState("");
	// 表示モード（リスト/詳細）
	const [viewMode, setViewMode] = useState<"list" | "detail">("list");

	// 選択中のリスクデータ
	const selectedRiskData = selectedRisk
		? owaspTop10Data.find((risk) => risk.id === selectedRisk)
		: null;

	// 検索フィルタリング
	const filteredRisks = owaspTop10Data.filter(
		(risk) =>
			risk.nameJa.toLowerCase().includes(searchQuery.toLowerCase()) ||
			risk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			risk.descriptionJa.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	/**
	 * リスクカードのクリックハンドラ
	 */
	const handleRiskClick = (riskId: string) => {
		setSelectedRisk(riskId);
		setViewMode("detail");
	};

	/**
	 * リストビューに戻る
	 */
	const handleBackToList = () => {
		setViewMode("list");
		setSelectedRisk(null);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* ページヘッダー */}
				<header className="mb-12">
					{/* パンくずリスト */}
					<nav className="mb-6">
						<ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
							<li>
								<Link
									href="/securities"
									className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
								>
									セキュリティ学習
								</Link>
							</li>
							<li>/</li>
							<li className="text-gray-900 dark:text-gray-100 font-medium">
								OWASP Top 10
							</li>
						</ol>
					</nav>

					<div className="text-center">
						<h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 dark:from-red-400 dark:via-orange-400 dark:to-yellow-400 bg-clip-text text-transparent mb-4">
							OWASP Top 10 (2021)
						</h1>
						<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
							Webアプリケーションの最も重大なセキュリティリスク10項目を学習し、
							安全なアプリケーション開発の知識を身につけよう
						</p>

						{/* 検索バー */}
						<div className="max-w-2xl mx-auto">
							<div className="relative">
								<input
									type="text"
									placeholder="リスクを検索..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
								/>
								<svg
									className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<title>検索アイコン</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</header>

				{/* メインコンテンツ */}
				{viewMode === "list" ? (
					<section>
						{/* リスク一覧 */}
						<div className="grid gap-6">
							{filteredRisks.map((risk) => (
								<button
									type="button"
									key={risk.id}
									onClick={() => handleRiskClick(risk.id)}
									className={`block w-full text-left p-6 rounded-xl border-2 ${getRiskBgColor(risk.rank)} ${getRiskBorderColor(risk.rank)} hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-4 mb-3">
												<span
													className={`text-4xl font-bold ${getRiskColor(risk.rank)}`}
												>
													#{risk.rank}
												</span>
												<div>
													<h3
														className={`text-2xl font-bold ${getRiskColor(risk.rank)}`}
													>
														{risk.nameJa}
													</h3>
													<p className="text-gray-600 dark:text-gray-400">
														{risk.code} - {risk.name}
													</p>
												</div>
											</div>
											<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
												{risk.descriptionJa}
											</p>
										</div>
										<svg
											className={`w-8 h-8 ${getRiskColor(risk.rank)} flex-shrink-0 ml-4`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<title>矢印アイコン</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</div>
								</button>
							))}
						</div>

						{filteredRisks.length === 0 && (
							<div className="text-center py-12">
								<p className="text-gray-500 dark:text-gray-400">
									検索結果が見つかりませんでした
								</p>
							</div>
						)}
					</section>
				) : (
					selectedRiskData && (
						<section>
							{/* 詳細ビュー */}
							<div className="mb-6">
								<button
									type="button"
									onClick={handleBackToList}
									className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<title>戻るアイコン</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 19l-7-7 7-7"
										/>
									</svg>
									リスク一覧に戻る
								</button>
							</div>

							<div
								className={`rounded-xl border-2 ${getRiskBgColor(selectedRiskData.rank)} ${getRiskBorderColor(selectedRiskData.rank)} p-8`}
							>
								{/* リスクヘッダー */}
								<div className="mb-8">
									<div className="flex items-center gap-4 mb-4">
										<span
											className={`text-5xl font-bold ${getRiskColor(selectedRiskData.rank)}`}
										>
											#{selectedRiskData.rank}
										</span>
										<div>
											<h2
												className={`text-3xl font-bold ${getRiskColor(selectedRiskData.rank)}`}
											>
												{selectedRiskData.nameJa}
											</h2>
											<p className="text-xl text-gray-600 dark:text-gray-400">
												{selectedRiskData.code} - {selectedRiskData.name}
											</p>
										</div>
									</div>
									<p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
										{selectedRiskData.descriptionJa}
									</p>
								</div>

								{/* 原因 */}
								<div className="mb-8">
									<h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
										🔍 主な原因
									</h3>
									<ul className="space-y-2">
										{selectedRiskData.causes.map((cause, index) => (
											<li
												key={`${selectedRiskData.id}-cause-${index}`}
												className="flex items-start gap-3"
											>
												<span className="text-red-500 mt-1">•</span>
												<span className="text-gray-700 dark:text-gray-300">
													{cause}
												</span>
											</li>
										))}
									</ul>
								</div>

								{/* 影響 */}
								<div className="mb-8">
									<h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
										⚠️ 想定される影響
									</h3>
									<ul className="space-y-2">
										{selectedRiskData.impacts.map((impact, index) => (
											<li
												key={`${selectedRiskData.id}-impact-${index}`}
												className="flex items-start gap-3"
											>
												<span className="text-orange-500 mt-1">•</span>
												<span className="text-gray-700 dark:text-gray-300">
													{impact}
												</span>
											</li>
										))}
									</ul>
								</div>

								{/* 攻撃例 */}
								<div className="mb-8">
									<h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
										💻 攻撃例
									</h3>
									<div className="space-y-6">
										{selectedRiskData.examples.map((example, index) => (
											<div
												key={`${selectedRiskData.id}-example-${index}`}
												className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
											>
												<h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
													{example.scenario}
												</h4>
												{example.code && (
													<pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto mb-3">
														<code className="text-sm text-gray-800 dark:text-gray-200">
															{example.code}
														</code>
													</pre>
												)}
												<p className="text-red-600 dark:text-red-400 text-sm">
													⚠️ {example.vulnerability}
												</p>
											</div>
										))}
									</div>
								</div>

								{/* 対策 */}
								<div className="mb-8">
									<h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
										🛡️ 対策方法
									</h3>
									<div className="space-y-6">
										{selectedRiskData.prevention.map((prevention, index) => (
											<div
												key={`${selectedRiskData.id}-prevention-${index}`}
												className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700"
											>
												<h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
													{prevention.title}
												</h4>
												<ul className="space-y-2">
													{prevention.measures.map((measure, mIndex) => (
														<li
															key={`${selectedRiskData.id}-prevention-${index}-measure-${mIndex}`}
															className="flex items-start gap-3"
														>
															<span className="text-green-600 dark:text-green-400 mt-1">
																✓
															</span>
															<span className="text-green-800 dark:text-green-200">
																{measure}
															</span>
														</li>
													))}
												</ul>
											</div>
										))}
									</div>
								</div>

								{/* ツールと参考資料 */}
								<div className="grid md:grid-cols-2 gap-6">
									{/* ツール */}
									<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
										<h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
											🔧 関連ツール
										</h3>
										<ul className="space-y-2">
											{selectedRiskData.tools.map((tool, index) => (
												<li
													key={`${selectedRiskData.id}-tool-${index}`}
													className="text-blue-700 dark:text-blue-300"
												>
													• {tool}
												</li>
											))}
										</ul>
									</div>

									{/* 参考資料 */}
									<div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
										<h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4">
											📚 参考資料
										</h3>
										<ul className="space-y-2">
											{selectedRiskData.references.map((ref, index) => (
												<li key={`${selectedRiskData.id}-ref-${index}`}>
													<a
														href={ref.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-purple-700 dark:text-purple-300 hover:underline"
													>
														{ref.title} →
													</a>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</section>
					)
				)}

				{/* 学習のヒント */}
				<section className="mt-12">
					<div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
							💡 OWASP Top 10を効果的に学習するコツ
						</h2>
						<div className="grid md:grid-cols-3 gap-6">
							<div className="text-center">
								<div className="text-4xl mb-3">📖</div>
								<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
									理論を理解する
								</h3>
								<p className="text-gray-600 dark:text-gray-400 text-sm">
									各リスクの原因と影響を深く理解し、なぜ危険なのかを把握する
								</p>
							</div>
							<div className="text-center">
								<div className="text-4xl mb-3">🔬</div>
								<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
									実践で検証する
								</h3>
								<p className="text-gray-600 dark:text-gray-400 text-sm">
									安全な環境で実際に脆弱性を再現し、攻撃手法を体験する
								</p>
							</div>
							<div className="text-center">
								<div className="text-4xl mb-3">🛡️</div>
								<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
									防御策を実装する
								</h3>
								<p className="text-gray-600 dark:text-gray-400 text-sm">
									学んだ対策を実際のコードに適用し、セキュアな開発を習慣化する
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* フッター */}
				<footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
					<p className="text-sm">
						🔒 OWASP Top
						10は定期的に更新されます。最新の脅威動向を常にチェックし、
						セキュリティ知識をアップデートし続けましょう！
					</p>
				</footer>
			</div>
		</div>
	);
}
