import fs from "node:fs";
import path from "path";
import { notion } from "@/libs/notion/notionAPI";
import { formatDateToJapanese } from "@/utils/date";
import { notFound } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

/**
 * ブログ記事の静的パラメータを生成
 * ビルド時にNotionからすべての記事IDを取得してSSG対象を決定
 */
export async function generateStaticParams() {
	try {
		// Notionデータベースから全ての記事を取得
		const response = await notion.databases.query({
			database_id: process.env.NOTION_DATABASE_ID || "",
		});

		// 記事IDの配列を返す
		return response.results.map((post: any) => ({
			id: post.id,
		}));
	} catch (error) {
		console.error("静的パラメータ生成エラー:", error);
		// エラー時は空配列を返してビルドを継続
		return [];
	}
}

/**
 * ISR（Incremental Static Regeneration）設定
 * 1時間ごとに静的ページを再生成して最新のコンテンツを反映
 */
export const revalidate = 3600; // 3600秒 = 1時間

/**
 * ブログ記事詳細ページコンポーネント
 * SSGで生成され、ISRにより定期的に更新される
 */
export default async function Home(props: any) {
	const { params } = props;

	try {
		// Notionから記事データを取得
		const response: any = await notion.pages.retrieve({ page_id: params.id });

		// プロパティの存在確認
		if (!response.properties?.title?.title?.[0]?.plain_text) {
			console.error("記事タイトルが見つかりません:", params.id);
			notFound();
		}

		const title = response.properties.title.title[0].plain_text;
		const updatedAt = response.properties.updated_at.last_edited_time;
		const tags = response.properties.tag.multi_select || [];

		// マークダウンファイルのパス
		const filePath = path.join(
			process.cwd(),
			"files/blog-posts/tech",
			`${params.id}.md`,
		);

		// ファイルの存在確認と読み込み
		let markdownString: string;
		try {
			markdownString = fs.readFileSync(filePath, "utf8");
		} catch (fileError) {
			console.error("マークダウンファイルが見つかりません:", filePath);
			notFound();
		}

		return (
			<div className="min-h-screen bg-gradient-to-br from-secondary to-background py-20">
				<div className="container mx-auto px-4 max-w-4xl">
					{/* ブログ記事ヘッダー */}
					<header className="mb-8">
						<h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
							{title}
						</h1>

						<div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
							{/* 更新日 */}
							<div className="flex items-center gap-2">
								<svg
									className="w-5 h-5"
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
								<span className="font-medium">
									{formatDateToJapanese(updatedAt)}
								</span>
							</div>

							{/* タグ */}
							<div className="flex items-center gap-2">
								<svg
									className="w-5 h-5"
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
									{tags.length === 0 ? (
										<span className="px-3 py-1 bg-secondary text-muted-foreground rounded-full text-sm">
											なし
										</span>
									) : (
										tags.map((tag: any) => (
											<span
												key={tag.id}
												className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
											>
												{tag.name}
											</span>
										))
									)}
								</div>
							</div>
						</div>

						{/* 区切り線 */}
						<div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
					</header>

					{/* ブログコンテンツ */}
					<main className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-lg">
						<article className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary">
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								rehypePlugins={[rehypeRaw]}
								components={{
									code({ node, className, children, ...props }) {
										const match = /language-(\w+)/.exec(className || "");
										return match ? (
											<div className="relative">
												<SyntaxHighlighter
													style={oneDark as any}
													language={match[1]}
													PreTag="div"
													customStyle={{
														margin: 0,
														borderRadius: "0.75rem",
														boxShadow:
															"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
													}}
												>
													{String(children).replace(/\n$/, "")}
												</SyntaxHighlighter>
											</div>
										) : (
											<code
												className={`${className} bg-secondary text-foreground px-1.5 py-0.5 rounded text-sm font-mono`}
												{...props}
											>
												{children}
											</code>
										);
									},
									pre: ({ children }) => (
										<div className="overflow-x-auto">{children}</div>
									),
									blockquote: ({ children }) => (
										<blockquote className="border-l-4 border-primary bg-primary/5 pl-4 py-2 my-4 italic text-muted-foreground">
											{children}
										</blockquote>
									),
									table: ({ children }) => (
										<div className="overflow-x-auto my-4">
											<table className="min-w-full border-collapse border border-border">
												{children}
											</table>
										</div>
									),
									th: ({ children }) => (
										<th className="border border-border bg-secondary px-4 py-2 text-left font-semibold text-foreground">
											{children}
										</th>
									),
									td: ({ children }) => (
										<td className="border border-border px-4 py-2 text-muted-foreground">
											{children}
										</td>
									),
								}}
							>
								{markdownString}
							</ReactMarkdown>
						</article>
					</main>
				</div>
			</div>
		);
	} catch (error) {
		// Notion APIエラーやその他の予期しないエラーをハンドリング
		console.error("ブログページ表示エラー:", error);
		notFound();
	}
}
