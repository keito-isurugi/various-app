"use client";

import Link from "next/link";
import type React from "react";

/**
 * メインビジュアルセクションコンポーネント
 * 和モダン住宅の大きな写真と印象的なキャッチコピー
 */
export const HeroSection: React.FC = () => {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* 背景画像 */}
			<div className="absolute inset-0 z-0">
				<div
					className="w-full h-full bg-cover bg-center bg-no-repeat"
					style={{
						backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23D4AF37'/%3E%3Cstop offset='100%25' stop-color='%235D3E2A'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23bg)'/%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Ccircle cx='300' cy='200' r='50'/%3E%3Ccircle cx='900' cy='600' r='80'/%3E%3Crect x='500' y='300' width='200' height='200' rx='20'/%3E%3C/g%3E%3C/svg%3E")`,
					}}
				/>
			</div>

			{/* コンテンツ */}
			<div className="wa-container relative z-10 text-center">
				<div className="max-w-4xl mx-auto">
					{/* メインキャッチコピー */}
					<h1 className="wa-heading-1 wa-text-light-contrast mb-6 wa-fade-in-up">
						<span className="block text-6xl md:text-7xl font-elegant mb-4 text-with-shadow">
							自然と共に
						</span>
						<span className="block text-4xl md:text-5xl font-japanese text-with-shadow">
							心を込めて建てる家
						</span>
					</h1>

					{/* サブキャッチコピー */}
					<p className="wa-text-large wa-text-light-contrast mb-8 wa-fade-in-up max-w-2xl mx-auto">
						職人の技と自然素材へのこだわりで、
						<br className="hidden sm:block" />
						お客様だけの特別な住まいを創り上げます。
					</p>

					{/* 特徴を表すキーワード */}
					<div className="flex flex-wrap justify-center gap-4 mb-12 wa-fade-in-up">
						<div className="bg-wood-texture bg-overlay-dark px-6 py-3 rounded-full border border-washi-white border-opacity-30">
							<span className="wa-text-light-contrast font-japanese">
								自然素材
							</span>
						</div>
						<div className="bg-wood-texture bg-overlay-dark px-6 py-3 rounded-full border border-washi-white border-opacity-30">
							<span className="wa-text-light-contrast font-japanese">
								職人の技
							</span>
						</div>
						<div className="bg-wood-texture bg-overlay-dark px-6 py-3 rounded-full border border-washi-white border-opacity-30">
							<span className="wa-text-light-contrast font-japanese">
								地域密着
							</span>
						</div>
					</div>

					{/* CTAボタン */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center wa-fade-in-up">
						<Link
							href="#works"
							className="wa-btn-primary text-lg px-8 py-4 font-japanese shadow-lg"
						>
							施工事例を見る
						</Link>
						<Link
							href="#contact"
							className="text-lg px-8 py-4 font-japanese bg-washi-white bg-opacity-20 border-2 border-washi-white text-washi-white hover:bg-washi-white hover:text-wood-dark transition-all duration-300 rounded-lg backdrop-blur-sm font-semibold"
						>
							資料請求・見学会予約
						</Link>
					</div>
				</div>
			</div>

			{/* スクロールインジケーター */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
				<div className="flex flex-col items-center animate-bounce bg-overlay-dark px-4 py-2 rounded-full">
					<div className="wa-text-light-contrast text-sm mb-2 font-japanese">
						scroll
					</div>
					<svg
						className="w-6 h-6 text-washi-white drop-shadow-lg"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						role="img"
						aria-label="スクロールダウン"
					>
						<title>スクロールダウン</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 14l-7 7m0 0l-7-7m7 7V3"
						/>
					</svg>
				</div>
			</div>
		</section>
	);
};
