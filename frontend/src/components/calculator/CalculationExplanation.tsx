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
	DetailedExplanationData,
	ExplanationData,
	ExplanationSection,
} from "../../types/algorithm";

interface CalculationExplanationProps {
	/** 表示する解説データ */
	explanationData: ExplanationData | DetailedExplanationData;
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
	 * セクションIDを取得（DetailedExplanationSectionにはidがないため）
	 */
	const getSectionId = (section: any, index: number): string => {
		return section.id || `section-${index}`;
	};

	/**
	 * DetailedExplanationDataかどうかを判定
	 */
	const isDetailedExplanation = (
		data: ExplanationData | DetailedExplanationData,
	): data is DetailedExplanationData => {
		return "complexity" in data || "applications" in data;
	};

	/**
	 * 重要度に応じたスタイリング
	 */
	const getSectionStyles = (importance: ExplanationSection["importance"]) => {
		switch (importance) {
			case "high":
				return "border-primary/30 bg-primary/5";
			case "medium":
				return "border-green-500/30 bg-green-500/5";
			case "low":
				return "border-border bg-secondary";
			default:
				return "border-border bg-secondary";
		}
	};

	return (
		<div
			className={`bg-card rounded-xl shadow-lg border border-border ${className}`}
		>
			{/* ヘッダー部分 */}
			<button
				type="button"
				className="w-full p-6 text-left hover:bg-secondary transition-colors rounded-t-xl cursor-pointer"
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
							<h3 className="text-xl font-bold text-foreground">
								{explanationData.title}
							</h3>
							<p className="text-sm text-muted-foreground mt-1">
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
				<div className="px-6 pb-6 border-t border-border">
					{/* 概要説明 */}
					<div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
						<h4 className="text-lg font-semibold text-primary mb-2">📚 概要</h4>
						<p className="text-foreground leading-relaxed">
							{explanationData.overview}
						</p>
					</div>

					{/* 詳細セクション */}
					<div className="mt-6 space-y-4">
						<h4 className="text-lg font-semibold text-foreground mb-4">
							🔍 詳細解説
						</h4>

						{explanationData.sections.map((section, index) => {
							const sectionId = getSectionId(section, index);
							const isDetailedSection = isDetailedExplanation(explanationData);
							return (
								<div
									key={sectionId}
									className={`border rounded-lg ${!isDetailedSection ? getSectionStyles((section as any).importance) : "border-border bg-secondary"}`}
								>
									{/* セクションヘッダー */}
									<button
										type="button"
										className="w-full p-4 text-left hover:opacity-80 transition-opacity cursor-pointer"
										onClick={() => toggleSectionExpansion(sectionId)}
										aria-expanded={expandedSections.has(sectionId)}
										aria-label={`${section.title}の詳細を${expandedSections.has(sectionId) ? "折りたたむ" : "展開する"}`}
									>
										<div className="flex items-center justify-between">
											<h5 className="font-semibold text-foreground">
												{section.title}
											</h5>
											<div
												className={`transform transition-transform duration-200 ${expandedSections.has(sectionId) ? "rotate-180" : ""}`}
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
									{expandedSections.has(sectionId) && (
										<div className="px-4 pb-4 border-t border-border pt-4">
											{/* 説明文 */}
											<p className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
												{section.content}
											</p>

											{/* 数式表示（通常のExplanationSection用） */}
											{!isDetailedSection && (section as any).formula && (
												<div className="mb-4 p-3 bg-card rounded-md border border-border">
													<h6 className="text-sm font-semibold text-muted-foreground mb-2">
														📐 数式
													</h6>
													<div className="text-lg font-mono text-center text-foreground">
														{(section as any).formula?.replace(
															/<[^>]*>/g,
															"",
														) || ""}
													</div>
												</div>
											)}

											{/* 数式表示（DetailedExplanationSection用） */}
											{isDetailedSection &&
												(section as any).formulas &&
												(section as any).formulas.length > 0 && (
													<div className="mb-4 space-y-3">
														<h6 className="text-sm font-semibold text-muted-foreground">
															📐 数式
														</h6>
														{(section as any).formulas.map(
															(formula: any, formulaIndex: number) => (
																<div
																	key={`formula-${formula.name || formulaIndex}`}
																	className="p-3 bg-card rounded-md border border-border"
																>
																	<div className="font-semibold text-sm text-muted-foreground mb-1">
																		{formula.name}
																	</div>
																	<div className="text-lg font-mono text-center text-foreground mb-2">
																		{formula.expression}
																	</div>
																	<div className="text-xs text-muted-foreground">
																		{formula.description}
																	</div>
																</div>
															),
														)}
													</div>
												)}

											{/* 実例表示（通常のExplanationSection用） */}
											{!isDetailedSection &&
												(section as any).examples &&
												(section as any).examples.length > 0 && (
													<div className="p-3 bg-yellow-500/10 rounded-md border border-yellow-500/30">
														<h6 className="text-sm font-semibold text-yellow-600 mb-2">
															💡 具体例
														</h6>
														<ul className="space-y-1">
															{(section as any).examples.map(
																(example: string, exampleIndex: number) => (
																	<li
																		key={`example-${example.slice(0, 30)}-${sectionId}-${exampleIndex}`}
																		className="text-sm text-foreground flex items-start gap-2"
																	>
																		<span className="text-yellow-500 mt-1">
																			•
																		</span>
																		<span>{example}</span>
																	</li>
																),
															)}
														</ul>
													</div>
												)}

											{/* 実例表示（DetailedExplanationSection用） */}
											{isDetailedSection &&
												(section as any).examples &&
												(section as any).examples.length > 0 && (
													<div className="mb-4 space-y-3">
														<h6 className="text-sm font-semibold text-yellow-600">
															💡 実装例
														</h6>
														{(section as any).examples.map(
															(example: any, exampleIndex: number) => (
																<div
																	key={`example-${example.title || exampleIndex}`}
																	className="p-3 bg-yellow-500/10 rounded-md border border-yellow-500/30"
																>
																	<div className="font-semibold text-sm text-yellow-600 mb-2">
																		{example.title}
																	</div>
																	<pre className="text-xs text-foreground overflow-x-auto whitespace-pre-wrap font-mono bg-secondary p-2 rounded">
																		{example.code}
																	</pre>
																</div>
															),
														)}
													</div>
												)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};
