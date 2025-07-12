/**
 * src/components/calculator/CalculationExplanation.tsx
 *
 * 計算の解説を表示するコンポーネント
 * 一般向けにわかりやすく物理計算の概念を説明
 */

"use client";

import type React from "react";
import { useState } from "react";
import type {
	ExplanationData,
	ExplanationSection,
} from "../../types/algorithm";

interface CalculationExplanationProps {
	/** 表示する解説データ */
	explanationData: ExplanationData;
	/** 初期状態で展開するかどうか */
	defaultExpanded?: boolean;
	/** 追加のCSSクラス */
	className?: string;
}

/**
 * 計算説明コンポーネント
 * 物理計算の概念を一般向けにわかりやすく解説
 */
export const CalculationExplanation: React.FC<CalculationExplanationProps> = ({
	explanationData,
	defaultExpanded = false,
	className = "",
}) => {
	// 展開状態の管理
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const [expandedSections, setExpandedSections] = useState<Set<string>>(
		new Set(),
	);

	/**
	 * メインセクションの展開/折りたたみ
	 */
	const toggleMainExpansion = () => {
		setIsExpanded(!isExpanded);
	};

	/**
	 * 個別セクションの展開/折りたたみ
	 */
	const toggleSectionExpansion = (sectionId: string) => {
		const newExpandedSections = new Set(expandedSections);
		if (newExpandedSections.has(sectionId)) {
			newExpandedSections.delete(sectionId);
		} else {
			newExpandedSections.add(sectionId);
		}
		setExpandedSections(newExpandedSections);
	};

	/**
	 * 重要度に応じたスタイリング
	 */
	const getSectionStyles = (importance: ExplanationSection["importance"]) => {
		switch (importance) {
			case "high":
				return "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20";
			case "medium":
				return "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20";
			case "low":
				return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50";
			default:
				return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50";
		}
	};

	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
		>
			{/* ヘッダー部分 */}
			<button
				type="button"
				className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-xl"
				onClick={toggleMainExpansion}
				aria-expanded={isExpanded}
				aria-label={`${explanationData.title}の解説を${isExpanded ? "折りたたむ" : "展開する"}`}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						{/* アイコン */}
						<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
								{explanationData.title}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								クリックして詳細な解説を見る
							</p>
						</div>
					</div>

					{/* 展開/折りたたみアイコン */}
					<div
						className={`transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
					>
						<svg
							className="w-6 h-6 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
				</div>
			</button>

			{/* 展開コンテンツ */}
			{isExpanded && (
				<div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
					{/* 概要説明 */}
					<div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-700/50">
						<h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
							📚 概要
						</h4>
						<p className="text-blue-800 dark:text-blue-200 leading-relaxed">
							{explanationData.overview}
						</p>
					</div>

					{/* 詳細セクション */}
					<div className="mt-6 space-y-4">
						<h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
							🔍 詳細解説
						</h4>

						{explanationData.sections.map((section) => (
							<div
								key={section.id}
								className={`border rounded-lg ${getSectionStyles(section.importance)}`}
							>
								{/* セクションヘッダー */}
								<button
									type="button"
									className="w-full p-4 text-left hover:bg-opacity-80 transition-colors"
									onClick={() => toggleSectionExpansion(section.id)}
									aria-expanded={expandedSections.has(section.id)}
									aria-label={`${section.title}の詳細を${expandedSections.has(section.id) ? "折りたたむ" : "展開する"}`}
								>
									<div className="flex items-center justify-between">
										<h5 className="font-semibold text-gray-900 dark:text-gray-100">
											{section.title}
										</h5>
										<div
											className={`transform transition-transform duration-200 ${expandedSections.has(section.id) ? "rotate-180" : ""}`}
										>
											<svg
												className="w-5 h-5 text-gray-500"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</div>
									</div>
								</button>

								{/* セクションコンテンツ */}
								{expandedSections.has(section.id) && (
									<div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600 pt-4">
										{/* 説明文 */}
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
											{section.content}
										</p>

										{/* 数式表示 */}
										{section.formula && (
											<div className="mb-4 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
												<h6 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
													📐 数式
												</h6>
												<div className="text-lg font-mono text-center text-gray-800 dark:text-gray-200">
													{/* 数式をプレーンテキストとして表示（HTMLタグを除去） */}
													{section.formula?.replace(/<[^>]*>/g, "") || ""}
												</div>
											</div>
										)}

										{/* 実例表示 */}
										{section.examples && section.examples.length > 0 && (
											<div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-700/50">
												<h6 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
													💡 具体例
												</h6>
												<ul className="space-y-1">
													{section.examples.map((example, index) => (
														<li
															key={`example-${example.slice(0, 30)}-${section.id}-${index}`}
															className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start gap-2"
														>
															<span className="text-yellow-500 mt-1">•</span>
															<span>{example}</span>
														</li>
													))}
												</ul>
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
