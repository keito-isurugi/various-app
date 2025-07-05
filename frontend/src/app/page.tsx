import Link from "next/link";

export default function HomePage() {
	return (
		<div className="min-h-screen">
			{/* ヒーローセクション */}
			<section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
				<div className="container mx-auto text-center">
					<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
						Welcome to kei-talk
					</h1>
					<p className="text-xl md:text-2xl text-gray-600 mb-8">
						技術ブログとポートフォリオサイト
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/blog/posts"
							className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
						>
							ブログを読む
						</Link>
						<Link
							href="/about"
							className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
						>
							私について
						</Link>
					</div>
				</div>
			</section>

			{/* 特徴セクション */}
			<section className="py-16 px-4">
				<div className="container mx-auto">
					<h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
						特徴
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="技術記事アイコン"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2">技術記事</h3>
							<p className="text-gray-600">
								プログラミングや技術に関する記事を定期的に公開
							</p>
						</div>
						<div className="text-center">
							<div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="ポートフォリオアイコン"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2">ポートフォリオ</h3>
							<p className="text-gray-600">
								これまでの開発実績やプロジェクトを紹介
							</p>
						</div>
						<div className="text-center">
							<div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="オープンソースアイコン"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2">オープンソース</h3>
							<p className="text-gray-600">
								GitHubでの活動とオープンソースへの貢献
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 最新記事セクション */}
			<section className="bg-gray-50 py-16 px-4">
				<div className="container mx-auto">
					<h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
						最新の記事
					</h2>
					<div className="text-center text-gray-600 mb-8">
						<p>記事の読み込み機能は現在準備中です</p>
					</div>
					<div className="text-center">
						<Link
							href="/blog/posts"
							className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
						>
							すべての記事を見る
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								role="img"
								aria-label="矢印アイコン"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
