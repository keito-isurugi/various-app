import Link from "next/link";
import type React from "react";

/**
 * サイト全体のフッターコンポーネント
 * コピーライト、リンク、ソーシャルメディアリンクを含む
 */
export const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	const footerLinks = [
		{ href: "/privacy", label: "プライバシーポリシー" },
		{ href: "/terms", label: "利用規約" },
	];

	const socialLinks = [
		{ href: "https://twitter.com", label: "Twitter", external: true },
		{ href: "https://github.com", label: "GitHub", external: true },
		{ href: "https://linkedin.com", label: "LinkedIn", external: true },
	];

	return (
		<footer className="bg-gray-50 border-t border-gray-200">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
					{/* コピーライト */}
					<div className="text-gray-600 text-sm">
						© {currentYear} kei-talk. All rights reserved.
					</div>

					{/* フッターナビゲーション */}
					<nav className="flex space-x-6">
						{footerLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* ソーシャルメディアリンク */}
					<div className="flex space-x-4">
						{socialLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
							>
								{link.label}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};
