import React from "react";
import fs from "node:fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { notion } from "@/libs/notion/notionAPI";

export default async function Home(props: any) {
	const { params, searchParams } = props;
  
  const response = await notion.pages.retrieve({ page_id: params.id });
  const title = response.properties.title.title[0].plain_text
  const updatedAt = response.properties.updated_at.last_edited_time
  const tags = response.properties.tag.multi_select

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
        <h1 className="!mb-0">{title}</h1>
        <p className="!my-0">更新日：{updatedAt}</p>
        <p className="!my-0">
          タグ：
          {tags.length === 0
            ? 'なし'
            : tags
              .map((tag: any, index: number, arr: any[]) => <>
                <span key={tag.id}>{tag.name}</span>{index < arr.length - 1 && '、'}
              </>)
          }
        </p>
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
