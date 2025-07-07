"use client";

import type { WorkProject } from "@/data/worksData";
import Link from "next/link";
import type React from "react";

interface WorkCardProps {
	work: WorkProject;
}

/**
 * 施工事例カードコンポーネント
 * 一覧ページで使用される個別の施工事例カード
 */
export const WorkCard: React.FC<WorkCardProps> = ({ work }) => {
	const mainImage = work.images[0];

	return (
		<Link href={`/hp/sample/1/works/${work.id}`}>
			<div className="wa-card group cursor-pointer h-full">
				{/* 画像 */}
				<div className="relative overflow-hidden rounded-lg mb-6">
					<img
						src={mainImage.url}
						alt={mainImage.caption}
						className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute top-4 left-4">
						<span className="px-3 py-1 bg-wood-dark text-washi-white text-sm font-japanese rounded-full">
							{work.category}
						</span>
					</div>
				</div>

				{/* コンテンツ */}
				<div className="space-y-4">
					<h3 className="wa-heading-3 font-japanese group-hover:text-wood-light transition-colors">
						{work.title}
					</h3>

					<div className="space-y-2">
						<div className="flex items-center text-wood-medium">
							<span className="text-sm mr-2">📍</span>
							<span className="text-sm font-japanese">{work.location}</span>
						</div>
						<div className="flex items-center text-wood-medium">
							<span className="text-sm mr-2">🏠</span>
							<span className="text-sm font-japanese">
								{work.specifications.structure}
							</span>
						</div>
						<div className="flex items-center text-wood-medium">
							<span className="text-sm mr-2">📏</span>
							<span className="text-sm font-japanese">{work.floorArea}</span>
						</div>
					</div>

					<p className="wa-text-body text-sm line-clamp-3 font-japanese">
						{work.description}
					</p>

					{/* 特徴タグ */}
					<div className="flex flex-wrap gap-2">
						{work.features.slice(0, 3).map((feature, index) => (
							<span
								key={`${work.id}-feature-${index}-${feature}`}
								className="px-2 py-1 bg-washi-cream text-wood-dark text-xs font-japanese rounded"
							>
								{feature}
							</span>
						))}
						{work.features.length > 3 && (
							<span className="px-2 py-1 bg-tatami-green text-washi-white text-xs font-japanese rounded">
								+{work.features.length - 3}
							</span>
						)}
					</div>

					{/* 完成日 */}
					<div className="pt-4 border-t border-wood-light border-opacity-30">
						<p className="text-wood-medium text-sm font-japanese">
							完成: {work.completionDate}
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
};
