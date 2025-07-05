"use client";

import type React from "react";
import { useState, useEffect } from "react";

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
			className="fixed bottom-8 right-8 z-30 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			aria-label="ページトップへ戻る"
		>
			<svg
				className="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M5 10l7-7m0 0l7 7m-7-7v18"
				/>
			</svg>
		</button>
	);
};