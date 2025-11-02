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
		{ href: "/todo", label: "TODOアプリ", icon: "✅" },
		{ href: "/massage-ticket/create", label: "肩たたき券作成", icon: "🎫" },
		{ href: "/massage-ticket/admin/list", label: "肩たたき券一覧", icon: "📋" },
		{
			href: "/massage-ticket/admin/scan",
			label: "肩たたき券読み込み",
			icon: "📷",
		},
		{ href: "/algorithms", label: "アルゴリズム学習", icon: "🔍" },
		{ href: "/securities", label: "セキュリティ", icon: "🔐" },
		{ href: "/auth", label: "認証・認可", icon: "🔑" },
		{ href: "/accounting", label: "会計解説", icon: "💼" },
		{ href: "/big3", label: "BIG3計算", icon: "💪" },
		{ href: "/calculator", label: "物理計算", icon: "🔬" },
		{ href: "/playground", label: "Playground", icon: "🚀" },
		{ href: "/about", label: "私について", icon: "👤" },
		{ href: "/contact", label: "お問い合わせ", icon: "📧" },
	];

	// エスケープキーでメニューを閉じる、フォーカス管理
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleKeyDown);
			// メニューが開いた時に最初の要素にフォーカス
			const firstFocusableElement = document.querySelector(
				'nav[aria-label="サイドナビゲーション"] a',
			) as HTMLElement;
			if (firstFocusableElement) {
				firstFocusableElement.focus();
			}
		}

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
			<div
				className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out z-[60] ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						onClose();
					}
				}}
				role="button"
				tabIndex={0}
				aria-label="メニューを閉じる"
			/>

			{/* サイドメニュー */}
			<div
				className={`fixed top-0 left-0 h-full w-80 bg-card text-card-foreground shadow-lg transform transition-transform duration-300 ease-in-out z-[70] ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* ヘッダー */}
				<div className="flex items-center justify-between p-6 border-b border-border">
					<Link
						href="/"
						className="text-xl font-bold text-foreground"
						onClick={onClose}
					>
						Keito
					</Link>
					<button
						type="button"
						onClick={onClose}
						className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
						aria-label="メニューを閉じる"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>閉じる</title>
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
				<nav className="px-6 py-4" aria-label="サイドナビゲーション">
					<ul className="space-y-2">
						{navItems.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									onClick={onClose}
									className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
								>
									<span className="text-lg">{item.icon}</span>
									<span className="font-medium">{item.label}</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>

				{/* フッター情報 */}
				<div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
					<div className="text-center text-sm text-muted-foreground">
						<p>&copy; 2024 Keito</p>
						<p>技術ブログとポートフォリオ</p>
					</div>
				</div>
			</div>
		</>
	);
};
