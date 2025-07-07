"use client";

import {
	getWorksByCategory,
	workCategories,
	worksData,
} from "@/data/worksData";
import type { WorkCategory } from "@/data/worksData";
import type React from "react";
import { useState } from "react";
import { HousingHeader } from "./HousingHeader";
import { WorkCard } from "./WorkCard";
import "../../../css/housing-company.css";

/**
 * 施工事例一覧ページコンポーネント
 * カテゴリーフィルタリング機能付き
 */
export const WorksListPage: React.FC = () => {
	const [selectedCategory, setSelectedCategory] =
		useState<WorkCategory>("すべて");
	const filteredWorks = getWorksByCategory(selectedCategory);

	return (
		<div className="min-h-screen bg-washi-texture">
			<HousingHeader />

			{/* ヒーローセクション */}
			<section className="pt-32 pb-16 bg-wood-texture relative">
				<div className="absolute inset-0 bg-black bg-opacity-40" />
				<div className="wa-container relative z-10">
					<div className="text-center">
						<h1 className="wa-heading-1 wa-text-light-contrast mb-6 font-japanese">
							施工事例
						</h1>
						<p className="wa-text-large wa-text-light-contrast max-w-2xl mx-auto">
							和心建築が手がけた住まいの数々をご紹介します。
							<br className="hidden sm:block" />
							自然素材の温もりと現代的な機能性を両立した住まいをご覧ください。
						</p>
					</div>
				</div>
			</section>

			{/* フィルターセクション */}
			<section className="py-12 bg-washi-white">
				<div className="wa-container">
					<div className="flex flex-wrap justify-center gap-4">
						{workCategories.map((category) => (
							<button
								key={category}
								type="button"
								onClick={() => setSelectedCategory(category)}
								className={`px-6 py-3 rounded-lg font-japanese font-semibold transition-all border-2 ${
									selectedCategory === category
										? "bg-amber-800 text-white border-amber-800 shadow-lg"
										: "bg-white text-amber-800 border-amber-400 hover:bg-amber-800 hover:text-white hover:border-amber-800 shadow-sm"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* 施工事例一覧 */}
			<section className="py-16 bg-washi-texture">
				<div className="wa-container">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredWorks.map((work) => (
							<WorkCard key={work.id} work={work} />
						))}
					</div>

					{filteredWorks.length === 0 && (
						<div className="text-center py-16">
							<p className="wa-text-large text-wood-medium font-japanese">
								該当する施工事例がありません
							</p>
						</div>
					)}
				</div>
			</section>

			{/* CTAセクション */}
			<section className="py-16 bg-wood-texture relative">
				<div className="absolute inset-0 bg-black bg-opacity-30" />
				<div className="wa-container relative z-10">
					<div className="text-center">
						<h2 className="wa-heading-2 wa-text-light-contrast mb-6 font-japanese">
							お気に入りの住まいは見つかりましたか？
						</h2>
						<p className="wa-text-large wa-text-light-contrast mb-8 max-w-2xl mx-auto">
							お客様のご希望に合わせた住まいづくりを
							<br className="hidden sm:block" />
							お手伝いさせていただきます。
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="/hp/sample/1#contact"
								className="wa-btn-primary bg-washi-white text-wood-dark hover:bg-washi-cream font-japanese shadow-lg"
							>
								見学会予約
							</a>
							<a
								href="/hp/sample/1#contact"
								className="text-washi-white hover:bg-washi-white hover:text-wood-dark font-japanese backdrop-blur-sm bg-black bg-opacity-50 px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
							>
								資料請求
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};
