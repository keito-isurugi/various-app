"use client";

import type React from "react";
import { useEffect, useState } from "react";

/**
 * ページトップへのスクロールボタンコンポーネント
 * 一定量スクロールしたときに表示され、クリックでページトップに戻る
 */
export const ScrollToTop: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false);

	// スクロール位置を監視
	useEffect(() => {
		const toggleVisibility = () => {
			// 300px以上スクロールしたら表示
			if (window.pageYOffset > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);

		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	// スムーズスクロールでトップに戻る
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	if (!isVisible) {
		return null;
	}

	return (
		<button
			type="button"
			onClick={scrollToTop}
			className="fixed bottom-6 right-6 z-30 p-4 bg-primary/90 hover:bg-primary text-primary-foreground rounded-2xl shadow-strong hover:shadow-glow-lg transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 backdrop-blur-sm border border-primary-300/20 group"
			aria-label="ページトップへ戻る"
		>
			<svg
				className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>上矢印アイコン</title>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2.5}
					d="M5 10l7-7m0 0l7 7m-7-7v18"
				/>
			</svg>
		</button>
	);
};
