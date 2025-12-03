"use client";

import {
	BookOpen,
	Brain,
	Calculator,
	Calendar,
	ChevronDown,
	ChevronUp,
	Code,
	Dumbbell,
	GraduationCap,
	Rocket,
	Ticket,
} from "lucide-react";
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
	icon: React.ComponentType<{ className?: string }>;
	color: string;
}

interface NavCategory {
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
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
		{
			href: "/blog/posts",
			label: "ブログ",
			icon: BookOpen,
			color: "from-blue-500 to-cyan-500",
		},
		{
			href: "/todo",
			label: "TODOアプリ",
			icon: Calendar,
			color: "from-green-500 to-emerald-500",
		},
		{
			href: "/massage-ticket/admin/list",
			label: "肩たたき券管理",
			icon: Ticket,
			color: "from-pink-500 to-rose-500",
		},
		{
			href: "/big3",
			label: "BIG3計算",
			icon: Dumbbell,
			color: "from-orange-500 to-red-500",
		},
	];

	// 学習カテゴリ配下の項目
	const learningCategory: NavCategory = {
		label: "学習",
		icon: GraduationCap,
		color: "from-purple-500 to-pink-500",
		items: [
			{
				href: "/study/techquiz",
				label: "Tech Quiz",
				icon: Brain,
				color: "from-purple-500 to-pink-500",
			},
			{
				href: "/algorithms",
				label: "アルゴリズム学習",
				icon: Code,
				color: "from-orange-500 to-red-500",
			},
			{
				href: "/calculator",
				label: "物理計算",
				icon: Calculator,
				color: "from-indigo-500 to-blue-500",
			},
			{
				href: "/playground",
				label: "Playground",
				icon: Rocket,
				color: "from-violet-500 to-purple-500",
			},
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
						className="text-xl font-bold text-foreground hover:scale-105 active:scale-95 transition-transform duration-150"
						onClick={onClose}
					>
						Various App
					</Link>
					<button
						type="button"
						onClick={onClose}
						className="p-2 text-foreground hover:scale-110 active:scale-95 transition-transform duration-150 cursor-pointer"
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
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={onClose}
										className="group flex items-center gap-3 px-4 py-3 rounded-lg text-foreground bg-transparent hover:bg-secondary active:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
									>
										<div
											className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}
										>
											<Icon className="h-5 w-5 text-white" />
										</div>
										<span className="font-medium">{item.label}</span>
									</Link>
								</li>
							);
						})}

						{/* 学習カテゴリ（プルダウン） */}
						<li>
							<button
								type="button"
								onClick={() => toggleCategory("learning")}
								className="group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-foreground bg-transparent hover:bg-secondary active:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
							>
								<div className="flex items-center gap-3">
									<div
										className={`w-10 h-10 rounded-lg bg-gradient-to-br ${learningCategory.color} flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}
									>
										{(() => {
											const Icon = learningCategory.icon;
											return <Icon className="h-5 w-5 text-white" />;
										})()}
									</div>
									<span className="font-medium">{learningCategory.label}</span>
								</div>
								<div className="p-1 rounded-md">
									{expandedCategory === "learning" ? (
										<ChevronUp className="h-4 w-4" />
									) : (
										<ChevronDown className="h-4 w-4" />
									)}
								</div>
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
									{learningCategory.items.map((item) => {
										const Icon = item.icon;
										return (
											<li key={item.href}>
												<Link
													href={item.href}
													onClick={onClose}
													className="group flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground bg-transparent hover:bg-secondary hover:text-foreground active:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
												>
													<div
														className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}
													>
														<Icon className="h-4 w-4 text-white" />
													</div>
													<span>{item.label}</span>
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						</li>
					</ul>
				</nav>
			</div>
		</>
	);
};
