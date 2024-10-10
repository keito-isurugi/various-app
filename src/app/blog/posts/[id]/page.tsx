import React from "react";
import fs from "node:fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function Home(props: any) {
	const { params, searchParams } = props;

	// マークダウンファイルのパス
	const filePath = path.join(
		process.cwd(),
		"files/blog-posts/tech",
		`${params.id}.md`,
	);
	// ファイルを読み込み
	const markdownString = fs.readFileSync(filePath, "utf8");

	return (
    <div className="grid place-items-center min-h-screen py-20">
      <article className="prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-xl">
        <h1>{searchParams.title}</h1>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({node, className, children, ...props}) {
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
      </article>
    </div>
  );
}
