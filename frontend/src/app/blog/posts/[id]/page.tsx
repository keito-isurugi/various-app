import fs from "node:fs";
import path from "path";
import { notion } from "@/libs/notion/notionAPI";
import { formatDateToJapanese } from "@/utils/date";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default async function Home(props: any) {
	const { params, searchParams } = props;

	const response: any = await notion.pages.retrieve({ page_id: params.id });
	const title = response.properties.title.title[0].plain_text;
	const updatedAt = response.properties.updated_at.last_edited_time;
	const tags = response.properties.tag.multi_select;

	// マークダウンファイルのパス
	const filePath = path.join(
		process.cwd(),
		"files/blog-posts/tech",
		`${params.id}.md`,
	);
	// ファイルを読み込み
	const markdownString = fs.readFileSync(filePath, "utf8");

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* ブログ記事ヘッダー */}
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
						{title}
					</h1>
					
					<div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
						{/* 更新日 */}
						<div className="flex items-center gap-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span className="font-medium">{formatDateToJapanese(updatedAt)}</span>
						</div>
						
						{/* タグ */}
						<div className="flex items-center gap-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
							</svg>
							<div className="flex flex-wrap gap-2">
								{tags.length === 0 ? (
									<span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
										なし
									</span>
								) : (
									tags.map((tag: any) => (
										<span
											key={tag.id}
											className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
										>
											{tag.name}
										</span>
									))
								)}
							</div>
						</div>
					</div>
					
					{/* 区切り線 */}
					<div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-8"></div>
				</header>

				{/* ブログコンテンツ */}
				<main className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
					<article className="prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
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
													borderRadius: '0.75rem',
													boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
												}}
											>
												{String(children).replace(/\n$/, "")}
											</SyntaxHighlighter>
										</div>
									) : (
										<code className={`${className} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
											{children}
										</code>
									);
								},
								pre: ({ children }) => (
									<div className="overflow-x-auto">
										{children}
									</div>
								),
								blockquote: ({ children }) => (
									<blockquote className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300">
										{children}
									</blockquote>
								),
								table: ({ children }) => (
									<div className="overflow-x-auto my-4">
										<table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
											{children}
										</table>
									</div>
								),
								th: ({ children }) => (
									<th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
										{children}
									</th>
								),
								td: ({ children }) => (
									<td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
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
}
