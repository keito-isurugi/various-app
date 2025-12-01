"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

interface SideNavigationProps {
	isOpen: boolean;
	onClose: () => void;
}

interface NavItem {
	href: string;
	label: string;
	icon: string;
}

interface NavCategory {
	label: string;
	icon: string;
	items: NavItem[];
}

/**
 * サイドナビゲーションコンポーネント
 * ハンバーガーメニューで開閉するスライドメニュー
 */
export const SideNavigation: React.FC<SideNavigationProps> = ({
	isOpen,
	onClose,
}) => {
	const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

	// 通常のナビゲーション項目
	const navItems: NavItem[] = [
		{ href: "/", label: "ホーム", icon: "🏠" },
		{ href: "/blog/posts", label: "ブログ", icon: "📝" },
		{ href: "/todo", label: "TODOアプリ", icon: "✅" },
		{ href: "/massage-ticket/admin/list", label: "肩たたき券管理", icon: "🎫" },
		{ href: "/big3", label: "BIG3計算", icon: "💪" },
	];

	// 学習カテゴリ配下の項目
	const learningCategory: NavCategory = {
		label: "学習",
		icon: "📚",
		items: [
			{ href: "/study/techquiz", label: "Tech Quiz", icon: "📝" },
			{ href: "/algorithms", label: "アルゴリズム学習", icon: "🔍" },
			{ href: "/securities", label: "セキュリティ", icon: "🔐" },
			{ href: "/auth", label: "認証・認可", icon: "🔑" },
			{ href: "/accounting", label: "会計解説", icon: "💼" },
			{ href: "/calculator", label: "物理計算", icon: "🔬" },
			{ href: "/playground", label: "Playground", icon: "🚀" },
		],
	};

	const toggleCategory = (category: string) => {
		setExpandedCategory(expandedCategory === category ? null : category);
	};

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
				className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out z-[60] cursor-pointer ${
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
						className="text-xl font-bold text-foreground cursor-pointer"
						onClick={onClose}
					>
						ホーム
					</Link>
					<button
						type="button"
						onClick={onClose}
						className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
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
				<nav
					className="px-6 py-4 overflow-y-auto h-[calc(100vh-180px)]"
					aria-label="サイドナビゲーション"
				>
					<ul className="space-y-2">
						{/* 通常のナビゲーション項目 */}
						{navItems.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									onClick={onClose}
									className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
								>
									<span className="text-lg">{item.icon}</span>
									<span className="font-medium">{item.label}</span>
								</Link>
							</li>
						))}

						{/* 学習カテゴリ（プルダウン） */}
						<li>
							<button
								type="button"
								onClick={() => toggleCategory("learning")}
								className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
							>
								<div className="flex items-center gap-3">
									<span className="text-lg">{learningCategory.icon}</span>
									<span className="font-medium">{learningCategory.label}</span>
								</div>
								{expandedCategory === "learning" ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</button>

							{/* サブメニュー */}
							<div
								className={`overflow-hidden transition-all duration-300 ease-in-out ${
									expandedCategory === "learning"
										? "max-h-[500px] opacity-100"
										: "max-h-0 opacity-0"
								}`}
							>
								<ul className="mt-1 ml-4 space-y-1">
									{learningCategory.items.map((item) => (
										<li key={item.href}>
											<Link
												href={item.href}
												onClick={onClose}
												className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
											>
												<span>{item.icon}</span>
												<span>{item.label}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</li>
					</ul>
				</nav>

				{/* フッター情報 */}
				<div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-card">
					<div className="text-center text-sm text-muted-foreground">
						<p>&copy; 2025</p>
						<p>技術ブログとポートフォリオ</p>
					</div>
				</div>
			</div>
		</>
	);
};
