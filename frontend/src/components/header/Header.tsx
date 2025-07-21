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
						? "bg-white/90 dark:bg-gray-900/90 shadow-medium backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
						: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
				}`}
			>
				<div className="container mx-auto container-padding">
					<div className="flex items-center justify-between h-16 lg:h-18">
						{/* ハンバーガーメニューボタン */}
						<button
							type="button"
							onClick={() => setIsSideNavOpen(!isSideNavOpen)}
							className="relative p-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 xl:hidden group"
							aria-label={isSideNavOpen ? "メニューを閉じる" : "メニューを開く"}
						>
							<div className="w-6 h-6 flex flex-col justify-center items-center">
								<span
									className={`block h-0.5 w-5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ease-out ${
										isSideNavOpen
											? "rotate-45 translate-y-1"
											: "-translate-y-0.5"
									}`}
								/>
								<span
									className={`block h-0.5 w-5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ease-out ${
										isSideNavOpen ? "opacity-0" : "my-0.5"
									}`}
								/>
								<span
									className={`block h-0.5 w-5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ease-out ${
										isSideNavOpen
											? "-rotate-45 -translate-y-1"
											: "translate-y-0.5"
									}`}
								/>
							</div>
						</button>

						{/* ロゴ/サイトタイトル - 中央配置（モバイル）または左寄せ（デスクトップ） */}
						<div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
							<Link
								href="/"
								className="group flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
							>
								<div className="relative">
									<div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
										<span className="text-white font-bold text-lg">K</span>
									</div>
									<div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full animate-pulse-soft" />
								</div>
								<span className="text-xl font-bold gradient-text-primary group-hover:scale-105 transition-transform duration-300">
									Keito
								</span>
							</Link>
						</div>

						{/* デスクトップナビゲーション */}
						<nav className="hidden xl:flex items-center space-x-1">
							<NavLink href="/" label="Home" />
							<NavLink href="/blog/posts" label="Blog" />
							<NavLink href="/algorithms" label="Algorithms" />
							<NavLink href="/securities" label="Securities" />
							<NavLink href="/accounting" label="Accounting" />
							<NavLink href="/calculator" label="Calculator" />
							<NavLink href="/big3" label="BIG3" />
							<NavLink href="/playground" label="Playground" />
							<NavLink href="/about" label="About" />
							<NavLink href="/contact" label="Contact" />
						</nav>

						{/* ダークモードトグル（デスクトップ） */}
						<div className="hidden lg:flex items-center space-x-4">
							<ThemeToggle />
							<div className="w-px h-6 bg-border" />
							<Link
								href="/contact"
								className="btn-primary px-4 py-2 text-sm hover:scale-105 transition-transform duration-200"
							>
								Get Started
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

/**
 * ナビゲーションリンクコンポーネント
 */
const NavLink: React.FC<{ href: string; label: string }> = ({
	href,
	label,
}) => (
	<Link
		href={href}
		className="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
	>
		{label}
		<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-500 rounded-full group-hover:w-6 transition-all duration-300" />
	</Link>
);

/**
 * テーマトグルボタン
 */
const ThemeToggle: React.FC = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const isDarkMode = document.documentElement.classList.contains("dark");
		setIsDark(isDarkMode);
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);

		if (newIsDark) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
			aria-label="テーマを切り替え"
		>
			<div className="w-5 h-5 relative overflow-hidden">
				{/* Sun icon */}
				<div
					className={`absolute inset-0 transition-all duration-300 ${
						isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
					}`}
				>
					<svg
						className="w-5 h-5 text-yellow-500"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Light mode</title>
						<path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
					</svg>
				</div>

				{/* Moon icon */}
				<div
					className={`absolute inset-0 transition-all duration-300 ${
						isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
					}`}
				>
					<svg
						className="w-5 h-5 text-blue-400"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Dark mode</title>
						<path
							fillRule="evenodd"
							d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			</div>
		</button>
	);
};
