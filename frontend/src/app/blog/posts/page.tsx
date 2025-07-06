import { notion } from "@/libs/notion/notionAPI";
import { formatDateToJapanese } from "@/utils/date";
import Link from "next/link";
import React from "react";

export default async function Home() {
	// notionAPIでページ一覧取得
	const response = await notion.databases.query({
		database_id: process.env.NOTION_DATABASE_ID || "",
	});
	const posts: any = response.results;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* ページヘッダー */}
				<header className="text-center mb-12">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						ブログ一覧
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						技術記事やプログラミングに関する投稿をまとめています
					</p>
				</header>

				{/* ブログ記事一覧 */}
				<div className="grid gap-6">
					{posts?.map((post: any) => (
						<article
							key={post.id}
							className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
						>
							<Link href={`/blog/posts/${post.id}`} className="block group">
								<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
									{post.properties.title.title[0].plain_text}
								</h2>
							</Link>

							<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
								{/* 更新日 */}
								<div className="flex items-center gap-1">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>更新日</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									<span>
										{formatDateToJapanese(
											post.properties.updated_at.last_edited_time,
										)}
									</span>
								</div>

								{/* タグ */}
								<div className="flex items-center gap-1">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>タグ</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
										/>
									</svg>
									<div className="flex flex-wrap gap-2">
										{post.properties.tag.multi_select.length === 0 ? (
											<span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs">
												なし
											</span>
										) : (
											post.properties.tag.multi_select.map((tag: any) => (
												<span
													key={tag.id}
													className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium"
												>
													{tag.name}
												</span>
											))
										)}
									</div>
								</div>
							</div>
						</article>
					))}
				</div>

				{/* フッター */}
				<footer className="mt-12 text-center">
					<p className="text-gray-500 dark:text-gray-400 text-sm">
						定期的に新しい記事を投稿しています
					</p>
				</footer>
			</div>
		</div>
	);
}
