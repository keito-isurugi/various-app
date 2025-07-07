"use client";

import type React from "react";
import { useEffect } from "react";
import { CompanySection } from "./CompanySection";
import { ContactSection } from "./ContactSection";
import { FeaturesSection } from "./FeaturesSection";
import { HeroSection } from "./HeroSection";
import { HousingHeader } from "./HousingHeader";
import { TestimonialsSection } from "./TestimonialsSection";
import { WorksSection } from "./WorksSection";
import "../../../css/housing-company.css";

/**
 * 和モダンテイストの木造注文住宅会社のメインページコンポーネント
 * 全セクションを統合したランディングページ
 */
export const HousingCompanyHomepage: React.FC = () => {
	// ページロード時にカスタムCSSを適用
	useEffect(() => {
		document.body.classList.add("font-japanese");
		return () => {
			document.body.classList.remove("font-japanese");
		};
	}, []);

	// スムーススクロールの実装
	useEffect(() => {
		const handleSmoothScroll = (e: Event) => {
			const target = e.target as HTMLAnchorElement;
			if (target.hash) {
				e.preventDefault();
				const element = document.querySelector(target.hash);
				if (element) {
					element.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}
			}
		};

		// ページ内の全てのアンカーリンクにイベントリスナーを追加
		const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
		for (const link of anchorLinks) {
			link.addEventListener("click", handleSmoothScroll);
		}

		return () => {
			for (const link of anchorLinks) {
				link.removeEventListener("click", handleSmoothScroll);
			}
		};
	}, []);

	return (
		<div className="min-h-screen bg-washi-white">
			{/* ヘッダー */}
			<HousingHeader />

			{/* メインコンテンツ */}
			<main>
				{/* ヒーローセクション */}
				<HeroSection />

				{/* 会社の特徴セクション */}
				<FeaturesSection />

				{/* 施工事例セクション */}
				<WorksSection />

				{/* お客様の声セクション */}
				<TestimonialsSection />

				{/* 会社概要セクション */}
				<CompanySection />

				{/* お問い合わせセクション */}
				<ContactSection />
			</main>

			{/* フッター */}
			<footer className="bg-wood-texture relative py-8">
				{/* 背景オーバーレイ */}
				<div className="absolute inset-0 bg-black bg-opacity-40" />
				<div className="wa-container relative z-10">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* 会社情報 */}
						<div>
							<h3 className="wa-heading-3 wa-text-light-contrast mb-4 font-japanese">
								和心建築株式会社
							</h3>
							<p className="wa-text-light-contrast text-sm mb-2">〒247-0056</p>
							<p className="wa-text-light-contrast text-sm mb-2">
								神奈川県鎌倉市大船1-2-3
							</p>
							<p className="wa-text-light-contrast text-sm mb-2">
								TEL: 0467-12-3456
							</p>
							<p className="wa-text-light-contrast text-sm">
								FAX: 0467-12-3457
							</p>
						</div>

						{/* ナビゲーション */}
						<div>
							<h3 className="wa-heading-3 wa-text-light-contrast mb-4 font-japanese">
								メニュー
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#features"
										className="wa-text-light-contrast text-sm hover:text-gold-accent transition-colors"
									>
										特徴
									</a>
								</li>
								<li>
									<a
										href="#works"
										className="wa-text-light-contrast text-sm hover:text-gold-accent transition-colors"
									>
										施工事例
									</a>
								</li>
								<li>
									<a
										href="#testimonials"
										className="wa-text-light-contrast text-sm hover:text-gold-accent transition-colors"
									>
										お客様の声
									</a>
								</li>
								<li>
									<a
										href="#company"
										className="wa-text-light-contrast text-sm hover:text-gold-accent transition-colors"
									>
										会社概要
									</a>
								</li>
								<li>
									<a
										href="#contact"
										className="wa-text-light-contrast text-sm hover:text-gold-accent transition-colors"
									>
										お問い合わせ
									</a>
								</li>
							</ul>
						</div>

						{/* 営業時間・資格 */}
						<div>
							<h3 className="wa-heading-3 wa-text-light-contrast mb-4 font-japanese">
								営業時間・資格
							</h3>
							<p className="wa-text-light-contrast text-sm mb-2">
								営業時間: 9:00〜18:00
							</p>
							<p className="wa-text-light-contrast text-sm mb-2">
								定休日: 水曜日・第2第4木曜日
							</p>
							<p className="wa-text-light-contrast text-sm mb-2">
								建設業許可（特-30）第12345号
							</p>
							<p className="wa-text-light-contrast text-sm">
								一級建築士事務所登録第123456号
							</p>
						</div>
					</div>

					{/* コピーライト */}
					<div className="border-t border-washi-white border-opacity-30 mt-8 pt-8 text-center">
						<p className="wa-text-light-contrast text-sm">
							© 2024 和心建築株式会社. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};
