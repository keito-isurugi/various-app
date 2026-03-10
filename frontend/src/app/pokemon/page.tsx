import { BookOpen, Bug } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "ポケモン | Various App",
	description: "ポケモン関連コンテンツの一覧",
};

const pokemonPages = [
	{
		href: "/pokemon/pokedex",
		title: "ポケモン図鑑",
		description: "全世代のポケモンを一覧で閲覧できます。",
		icon: BookOpen,
		color: "from-red-500 to-rose-600",
	},
	{
		href: "/pokemon/select-bug",
		title: "セレクトバグ ビジュアライザー",
		description:
			"初代ポケモンの「7番目バグ」がなぜレベル100を生み出すのか、メモリレベルで視覚的に体験できます。",
		icon: Bug,
		color: "from-green-500 to-emerald-600",
	},
];

export default function PokemonIndexPage() {
	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
					ポケモン
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{pokemonPages.map((page) => {
						const Icon = page.icon;
						return (
							<Link
								key={page.href}
								href={page.href}
								className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
							>
								<div
									className={`w-12 h-12 rounded-lg bg-gradient-to-br ${page.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
								>
									<Icon className="h-6 w-6 text-white" />
								</div>
								<h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
									{page.title}
								</h2>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{page.description}
								</p>
							</Link>
						);
					})}
				</div>
			</div>
		</main>
	);
}
