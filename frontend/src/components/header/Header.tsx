import Link from "next/link";
import type React from "react";

/**
 * サイト全体のヘッダーコンポーネント
 * ロゴとグローバルナビゲーションを含む
 */
export const Header: React.FC = () => {
	const navItems = [
		{ href: "/", label: "Home" },
		{ href: "/blog/posts", label: "Blog" },
		{ href: "/about", label: "About" },
		{ href: "/contact", label: "Contact" },
	];

	return (
		<header className="bg-white shadow-sm border-b border-gray-200">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* ロゴ/サイトタイトル */}
					<div className="flex-shrink-0">
						<Link
							href="/"
							className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
						>
							kei-talk
						</Link>
					</div>

					{/* ナビゲーションメニュー */}
					<nav aria-label="メインナビゲーション">
						<ul className="flex space-x-8">
							{navItems.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>
		</header>
	);
};
