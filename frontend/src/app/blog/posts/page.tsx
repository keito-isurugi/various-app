import { notion } from "@/libs/notion/notionAPI";
import { formatDateToJapanese } from "@/utils/date";
import Link from "next/link";
import React from "react";

/**
 * ISR（Incremental Static Regeneration）設定
 * ブログ一覧ページを30分ごとに再生成して新しい記事を反映
 */
export const revalidate = 1800; // 1800秒 = 30分

/**
 * ブログ一覧ページコンポーネント
 * SSGで生成され、ISRにより30分ごとに更新される
 */
export default async function Home() {
	try {
		// Notionデータベースから記事一覧を取得
		const response = await notion.databases.query({
			database_id: process.env.NOTION_DATABASE_ID || "",
		});
		const posts: any = response.results;

		return (
			<div className="min-h-screen bg-gradient-to-br from-secondary to-background py-20">
				<div className="container mx-auto px-4 max-w-4xl">
					{/* ページヘッダー */}
					<header className="text-center mb-12">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
							ブログ一覧
						</h1>
						<p className="text-lg text-muted-foreground">
							技術記事やプログラミングに関する投稿をまとめています
						</p>
					</header>

					{/* ブログ記事一覧 */}
					<div className="grid gap-6">
						{posts?.map((post: any) => (
							<article
								key={post.id}
								className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
							>
								<Link href={`/blog/posts/${post.id}`} className="block group">
									<h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
										{post.properties.title.title[0].plain_text}
									</h2>
								</Link>

								<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
												<span className="px-2 py-1 bg-secondary text-muted-foreground rounded-md text-xs">
													なし
												</span>
											) : (
												post.properties.tag.multi_select.map((tag: any) => (
													<span
														key={tag.id}
														className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
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
						<p className="text-muted-foreground text-sm">
							定期的に新しい記事を投稿しています
						</p>
					</footer>
				</div>
			</div>
		);
	} catch (error) {
		// Notion APIエラーや予期しないエラーをハンドリング
		console.error("ブログ一覧ページ表示エラー:", error);

		// エラー時のフォールバック表示
		return (
			<div className="min-h-screen bg-gradient-to-br from-secondary to-background py-20">
				<div className="container mx-auto px-4 max-w-4xl text-center">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						エラーが発生しました
					</h1>
					<p className="text-lg text-muted-foreground mb-8">
						申し訳ありませんが、ブログ記事の読み込み中にエラーが発生しました。
					</p>
					<Link
						href="/"
						className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
					>
						ホームに戻る
					</Link>
				</div>
			</div>
		);
	}
}
