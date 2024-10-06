import React from "react";
import fs from "node:fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function Home({
	params,
}: {
	params: { id: string };
}) {
	// マークダウンファイルのパス
	const filePath = path.join(
		process.cwd(),
		"files/blog_posts/",
		`${params.id}.md`,
	);
	// ファイルを読み込み
	const markdownString = fs.readFileSync(filePath, "utf8");

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<h1>ブログ詳細</h1>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={{
					code({ node, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || "");
						return match ? (
							<SyntaxHighlighter
								style={oneDark as any}
								language={match[1]}
								PreTag="div"
							>
								{String(children).replace(/\n$/, "")}
							</SyntaxHighlighter>
						) : (
							<code className={className} {...props}>
								{children}
							</code>
						);
					},
				}}
			>
				{markdownString}
			</ReactMarkdown>
		</div>
	);
}
