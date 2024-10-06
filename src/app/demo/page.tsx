import fs from "node:fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const Home = () => {
	// マークダウンファイルのパス
	const filePath = path.join(
		process.cwd(),
		"files/blog_posts/",
		"117872c8-f4a6-800e-a897-ddabf9a2d6a8.md",
	);
	// ファイルを読み込み
	const markdownString = fs.readFileSync(filePath, "utf8");

	return (
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
	);
};

export default Home;
