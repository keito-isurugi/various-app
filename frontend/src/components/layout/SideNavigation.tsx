"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

interface SideNavigationProps {
	isOpen: boolean;
	onClose: () => void;
}

/**
 * サイドナビゲーションコンポーネント
 * ハンバーガーメニューで開閉するスライドメニュー
 */
export const SideNavigation: React.FC<SideNavigationProps> = ({
	isOpen,
	onClose,
}) => {
	const navItems = [
		{ href: "/", label: "ホーム", icon: "🏠" },
		{ href: "/blog/posts", label: "ブログ", icon: "📝" },
		{ href: "/big3", label: "BIG3計算", icon: "💪" },
		{ href: "/calculator", label: "物理計算", icon: "🔬" },
		{ href: "/playground", label: "Playground", icon: "🚀" },
		{ href: "/about", label: "私について", icon: "👤" },
		{ href: "/contact", label: "お問い合わせ", icon: "📧" },
	];

	// エスケープキーでメニューを閉じる
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	// スクロールを無効化
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	return (
		<>
			{/* オーバーレイ */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 lg:hidden"
					onClick={onClose}
				/>
			)}

			{/* サイドメニュー */}
			<div
				className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* ヘッダー */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
					<Link
						href="/"
						className="text-xl font-bold text-gray-900 dark:text-white"
						onClick={onClose}
					>
						kei-talk
					</Link>
					<button
						type="button"
						onClick={onClose}
						className="p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						aria-label="メニューを閉じる"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* ナビゲーションメニュー */}
				<nav className="px-6 py-4">
					<ul className="space-y-2">
						{navItems.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									onClick={onClose}
									className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
								>
									<span className="text-lg">{item.icon}</span>
									<span className="font-medium">{item.label}</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>

				{/* フッター情報 */}
				<div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
					<div className="text-center text-sm text-gray-500 dark:text-gray-400">
						<p>&copy; 2024 kei-talk</p>
						<p>技術ブログとポートフォリオ</p>
					</div>
				</div>
			</div>
		</>
	);
};
