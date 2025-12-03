"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { SideNavigation } from "../layout/SideNavigation";

/**
 * サイト全体のヘッダーコンポーネント
 * モダンデザインのロゴとハンバーガーメニューを含む
 */
export const Header: React.FC = () => {
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	// スクロール検知
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					isScrolled
						? "bg-card/90 shadow-medium backdrop-blur-md border-b border-border"
						: "bg-card/80 backdrop-blur-sm"
				}`}
			>
				<div className="container mx-auto container-padding">
					<div className="flex items-center justify-between h-16 lg:h-18">
						{/* ハンバーガーメニューボタン */}
						<button
							type="button"
							onClick={() => setIsSideNavOpen(!isSideNavOpen)}
							className="relative p-2 hover:scale-110 active:scale-95 transition-transform duration-150 cursor-pointer"
							aria-label={isSideNavOpen ? "メニューを閉じる" : "メニューを開く"}
						>
							<div className="w-6 h-6 flex flex-col justify-center items-center">
								<span
									className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ease-out ${
										isSideNavOpen
											? "rotate-45 translate-y-1"
											: "-translate-y-0.5"
									}`}
								/>
								<span
									className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ease-out ${
										isSideNavOpen ? "opacity-0" : "my-0.5"
									}`}
								/>
								<span
									className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ease-out ${
										isSideNavOpen
											? "-rotate-45 -translate-y-1"
											: "translate-y-0.5"
									}`}
								/>
							</div>
						</button>

						{/* ロゴ/サイトタイトル - 中央配置 */}
						<div className="flex-1 flex justify-center">
							<Link
								href="/"
								className="text-xl font-bold text-foreground hover:scale-105 active:scale-95 transition-transform duration-150"
							>
								Various App
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* サイドナビゲーション */}
			<SideNavigation
				isOpen={isSideNavOpen}
				onClose={() => setIsSideNavOpen(false)}
			/>
		</>
	);
};
