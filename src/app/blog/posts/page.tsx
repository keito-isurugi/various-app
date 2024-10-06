import Link from "next/link";
import React from "react";
import { notion } from "@/libs/notion/notionAPI";

export default async function Home() {
	// notionAPIでページ一覧取得
	const response = await notion.databases.query({
		database_id: process.env.NOTION_DATABASE_ID || "",
	});
	const posts: any = response.results;
	
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<h1>ブログ一覧</h1>
			<ul>
				{posts?.map((post: any) => (
					<li key={post.id} className="mb-3">
						<Link href={`/blog/posts/${post.id}?title=${post.properties.title.title[0].plain_text}`}>
							<p>タイトル：{post.properties.title.title[0].plain_text}</p>
						</Link>
						<p>更新日：{post.properties.updated_at.last_edited_time}</p>
						{post.properties.tag.multi_select.length
							? post.properties.tag.multi_select?.map((tag: any) => (
									<p key={tag.id}>タグ：{tag.name}</p>
								))
							: "タグ："}
					</li>
				))}
			</ul>
		</div>
	);
}
