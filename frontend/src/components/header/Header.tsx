"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { SideNavigation } from "../layout/SideNavigation";

/**
 * サイト全体のヘッダーコンポーネント
 * ロゴとハンバーガーメニューを含む
 */
export const Header: React.FC = () => {
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);
	const navItems = [
		{ href: "/", label: "Home" },
		{ href: "/blog/posts", label: "Blog" },
		{ href: "/big3", label: "BIG3" },
		{ href: "/playground", label: "Playground" },
		{ href: "/about", label: "About" },
		{ href: "/contact", label: "Contact" },
	];

	return (
		<header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center h-16">
					{/* ハンバーガーメニューボタン */}
					<button
						type="button"
						onClick={() => setIsSideNavOpen(!isSideNavOpen)}
						className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 mr-4"
						aria-label={isSideNavOpen ? "メニューを閉じる" : "メニューを開く"}
					>
						<div className="w-6 h-6 flex flex-col justify-center items-center">
							<span
								className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${
									isSideNavOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
								}`}
							/>
							<span
								className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${
									isSideNavOpen ? "opacity-0" : "my-0.5"
								}`}
							/>
							<span
								className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${
									isSideNavOpen
										? "-rotate-45 -translate-y-1"
										: "translate-y-0.5"
								}`}
							/>
						</div>
					</button>

					{/* ロゴ/サイトタイトル - 左寄せ */}
					<div className="flex-1">
						<Link
							href="/"
							className="text-2xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
						>
							kei-talk
						</Link>
					</div>
				</div>
			</div>

			{/* サイドナビゲーション */}
			<SideNavigation
				isOpen={isSideNavOpen}
				onClose={() => setIsSideNavOpen(false)}
			/>
		</header>
	);
};
