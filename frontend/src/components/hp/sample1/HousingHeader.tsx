"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

/**
 * 住宅会社専用のヘッダーコンポーネント
 * 和モダンテイストでシンプルなデザイン
 */
export const HousingHeader: React.FC = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	// スクロール検知でヘッダーの背景を変更
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-washi-texture shadow-medium backdrop-blur-sm"
					: "bg-transparent"
			}`}
		>
			<div className="wa-container">
				<div className="flex items-center justify-between h-20">
					{/* ロゴ */}
					<Link href="#" className="flex items-center space-x-3">
						<div className="w-12 h-12 bg-wood-texture rounded-lg flex items-center justify-center">
							<span className="text-washi-white font-bold text-xl font-elegant">
								和
							</span>
						</div>
						<div className="flex flex-col">
							<span className="text-wood-dark font-bold text-xl font-japanese">
								和心建築
							</span>
							<span className="text-wood-medium text-sm font-japanese">
								自然素材の注文住宅
							</span>
						</div>
					</Link>

					{/* デスクトップナビゲーション */}
					<nav className="hidden md:flex items-center space-x-6">
						<Link
							href="#features"
							className="relative px-4 py-2 text-wood-dark hover:text-charcoal transition-all font-japanese font-semibold text-shadow-sm group"
						>
							<span className="relative z-10">特徴</span>
							<div className="absolute inset-0 bg-washi-white bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300" />
							<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-wood-dark group-hover:w-8 transition-all duration-300" />
						</Link>
						<Link
							href="#works"
							className="relative px-4 py-2 text-wood-dark hover:text-charcoal transition-all font-japanese font-semibold text-shadow-sm group"
						>
							<span className="relative z-10">施工事例</span>
							<div className="absolute inset-0 bg-washi-white bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300" />
							<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-wood-dark group-hover:w-8 transition-all duration-300" />
						</Link>
						<Link
							href="#testimonials"
							className="relative px-4 py-2 text-wood-dark hover:text-charcoal transition-all font-japanese font-semibold text-shadow-sm group"
						>
							<span className="relative z-10">お客様の声</span>
							<div className="absolute inset-0 bg-washi-white bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300" />
							<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-wood-dark group-hover:w-8 transition-all duration-300" />
						</Link>
						<Link
							href="#company"
							className="relative px-4 py-2 text-wood-dark hover:text-charcoal transition-all font-japanese font-semibold text-shadow-sm group"
						>
							<span className="relative z-10">会社概要</span>
							<div className="absolute inset-0 bg-washi-white bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300" />
							<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-wood-dark group-hover:w-8 transition-all duration-300" />
						</Link>
					</nav>

					{/* CTAボタン */}
					<div className="flex items-center space-x-4">
						<Link
							href="#contact"
							className="hidden sm:inline-block text-sm px-4 py-2 font-japanese bg-washi-white text-wood-dark font-semibold rounded-lg hover:bg-washi-cream hover:shadow-md transition-all shadow-sm"
						>
							資料請求
						</Link>
						<Link
							href="#contact"
							className="wa-btn-primary text-sm px-4 py-2 font-japanese shadow-md"
						>
							見学会予約
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
};
