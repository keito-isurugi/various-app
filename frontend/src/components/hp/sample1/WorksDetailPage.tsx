"use client";

import type { WorkProject } from "@/data/worksData";
import Link from "next/link";
import type React from "react";
import { HousingHeader } from "./HousingHeader";
import "../../../css/housing-company.css";

interface WorksDetailPageProps {
	work: WorkProject;
}

/**
 * 施工事例詳細ページコンポーネント
 * 個別の施工事例の詳細情報を表示
 */
export const WorksDetailPage: React.FC<WorksDetailPageProps> = ({ work }) => {
	return (
		<div className="min-h-screen bg-washi-texture">
			<HousingHeader />

			{/* パンくずナビ */}
			<div className="pt-32 pb-8 bg-washi-white">
				<div className="wa-container">
					<nav className="flex items-center space-x-2 text-sm font-japanese">
						<Link
							href="/hp/sample/1"
							className="text-wood-medium hover:text-wood-dark"
						>
							ホーム
						</Link>
						<span className="text-wood-light">›</span>
						<Link
							href="/hp/sample/1/works"
							className="text-wood-medium hover:text-wood-dark"
						>
							施工事例
						</Link>
						<span className="text-wood-light">›</span>
						<span className="text-wood-dark">{work.title}</span>
					</nav>
				</div>
			</div>

			{/* メイン画像セクション */}
			<section className="py-16 bg-washi-white">
				<div className="wa-container">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<img
								src={work.images[0].url}
								alt={work.images[0].caption}
								className="w-full h-96 object-cover rounded-lg shadow-lg"
							/>
						</div>
						<div>
							<div className="mb-4">
								<span className="px-4 py-2 bg-wood-dark text-washi-white text-sm font-japanese rounded-full">
									{work.category}
								</span>
							</div>
							<h1 className="wa-heading-1 mb-6 font-japanese">{work.title}</h1>
							<p className="wa-text-large mb-8 font-japanese">
								{work.description}
							</p>

							{/* 基本情報 */}
							<div className="grid grid-cols-2 gap-4">
								<div className="wa-card">
									<h3 className="wa-heading-3 mb-2 font-japanese">所在地</h3>
									<p className="text-wood-medium font-japanese">
										{work.location}
									</p>
								</div>
								<div className="wa-card">
									<h3 className="wa-heading-3 mb-2 font-japanese">完成</h3>
									<p className="text-wood-medium font-japanese">
										{work.completionDate}
									</p>
								</div>
								<div className="wa-card">
									<h3 className="wa-heading-3 mb-2 font-japanese">延床面積</h3>
									<p className="text-wood-medium font-japanese">
										{work.floorArea}
									</p>
								</div>
								<div className="wa-card">
									<h3 className="wa-heading-3 mb-2 font-japanese">予算</h3>
									<p className="text-wood-medium font-japanese">
										{work.budget}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 詳細情報セクション */}
			<section className="py-16 bg-washi-texture">
				<div className="wa-container">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* 特徴 */}
						<div className="wa-card">
							<h2 className="wa-heading-2 mb-6 font-japanese">特徴</h2>
							<div className="space-y-3">
								{work.features.map((feature, index) => (
									<div
										key={`${work.id}-feature-${index}-${feature}`}
										className="flex items-center"
									>
										<span className="w-2 h-2 bg-wood-dark rounded-full mr-3" />
										<span className="font-japanese">{feature}</span>
									</div>
								))}
							</div>
						</div>

						{/* 使用素材 */}
						<div className="wa-card">
							<h2 className="wa-heading-2 mb-6 font-japanese">使用素材</h2>
							<div className="space-y-3">
								{work.materials.map((material, index) => (
									<div
										key={`${work.id}-material-${index}-${material}`}
										className="flex items-center"
									>
										<span className="w-2 h-2 bg-tatami-green rounded-full mr-3" />
										<span className="font-japanese">{material}</span>
									</div>
								))}
							</div>
						</div>

						{/* 仕様 */}
						<div className="wa-card">
							<h2 className="wa-heading-2 mb-6 font-japanese">仕様</h2>
							<div className="space-y-4">
								<div>
									<h4 className="font-semibold text-wood-dark mb-1 font-japanese">
										構造
									</h4>
									<p className="text-wood-medium font-japanese">
										{work.specifications.structure}
									</p>
								</div>
								<div>
									<h4 className="font-semibold text-wood-dark mb-1 font-japanese">
										階数
									</h4>
									<p className="text-wood-medium font-japanese">
										{work.specifications.floors}
									</p>
								</div>
								<div>
									<h4 className="font-semibold text-wood-dark mb-1 font-japanese">
										間取り
									</h4>
									<p className="text-wood-medium font-japanese">
										{work.specifications.rooms}
									</p>
								</div>
								<div>
									<h4 className="font-semibold text-wood-dark mb-1 font-japanese">
										駐車場
									</h4>
									<p className="text-wood-medium font-japanese">
										{work.specifications.parking}
									</p>
								</div>
								<div>
									<h4 className="font-semibold text-wood-dark mb-1 font-japanese">
										庭
									</h4>
									<p className="text-wood-medium font-japanese">
										{work.specifications.garden ? "あり" : "なし"}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* お客様の声セクション */}
			<section className="py-16 bg-washi-white">
				<div className="wa-container">
					<div className="max-w-4xl mx-auto">
						<h2 className="wa-heading-2 text-center mb-12 font-japanese">
							お客様の声
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* 家族構成 */}
							<div className="wa-card">
								<h3 className="wa-heading-3 mb-4 font-japanese">ご家族構成</h3>
								<p className="text-wood-medium font-japanese">
									{work.client.familyStructure}
								</p>
							</div>

							{/* ご要望 */}
							<div className="wa-card">
								<h3 className="wa-heading-3 mb-4 font-japanese">ご要望</h3>
								<div className="space-y-2">
									{work.client.requests.map((request, index) => (
										<div
											key={`${work.id}-request-${index}-${request.slice(0, 10)}`}
											className="flex items-start"
										>
											<span className="w-2 h-2 bg-gold-accent rounded-full mr-3 mt-2" />
											<span className="font-japanese">{request}</span>
										</div>
									))}
								</div>
							</div>

							{/* 課題・解決点 */}
							<div className="wa-card md:col-span-2">
								<h3 className="wa-heading-3 mb-4 font-japanese">
									課題・解決点
								</h3>
								<div className="space-y-2">
									{work.client.challenges.map((challenge, index) => (
										<div
											key={`${work.id}-challenge-${index}-${challenge.slice(0, 10)}`}
											className="flex items-start"
										>
											<span className="w-2 h-2 bg-wood-dark rounded-full mr-3 mt-2" />
											<span className="font-japanese">{challenge}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 関連施工事例・CTAセクション */}
			<section className="py-16 bg-wood-texture relative">
				<div className="absolute inset-0 bg-black bg-opacity-30" />
				<div className="wa-container relative z-10">
					<div className="text-center">
						<h2 className="wa-heading-2 wa-text-light-contrast mb-6 font-japanese">
							このような住まいをお考えですか？
						</h2>
						<p className="wa-text-large wa-text-light-contrast mb-8 max-w-2xl mx-auto">
							お客様のご希望に合わせた住まいづくりを
							<br className="hidden sm:block" />
							お手伝いさせていただきます。
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
						<Link
							href="/hp/sample/1/works"
							className="text-washi-white hover:text-washi-cream font-japanese underline"
						>
							← 施工事例一覧に戻る
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};
