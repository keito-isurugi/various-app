import { SelectBugVisualizer } from "@/components/pokemon-select-bug/SelectBugVisualizer";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "セレクトバグ ビジュアライザー | 初代ポケモン",
	description:
		"初代ポケモン（赤・緑・青）のセレクトバグ（7番目バグ）の原理をインタラクティブに体験・理解できるビジュアライザー",
};

export default function PokemonSelectBugPage() {
	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
			<div className="max-w-4xl mx-auto">
				{/* ヘッダー */}
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
						セレクトバグ ビジュアライザー
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						初代ポケモン（赤・緑・青）の「7番目バグ」がなぜレベル100を生み出すのか、
						メモリレベルで視覚的に体験できます。
					</p>
				</div>

				{/* メインコンテンツ */}
				<SelectBugVisualizer />

				{/* フッター */}
				<div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
					<p>
						参考: pokered 逆アセンブリ (pret/pokered) / アニヲタWiki
						セレクトバグ(ポケモン)
					</p>
					<p className="mt-1">
						教育目的のコンテンツです。実機でのバグ利用は自己責任で行ってください。
					</p>
				</div>
			</div>
		</main>
	);
}
