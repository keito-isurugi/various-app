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
    <div className="grid place-items-center min-h-screen py-20">
      <article className="prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-xl">
        <h1>ブログ一覧</h1>
        <ul>
          {posts?.map((post: any) => (
            <li key={post.id} className="!mb-4">
              <Link href={`/blog/posts/${post.id}?title=${post.properties.title.title[0].plain_text}`}>
                <p className="!my-0">タイトル：{post.properties.title.title[0].plain_text}</p>
              </Link>
              <p className="!my-0">更新日：{post.properties.updated_at.last_edited_time}</p>
              <p className="!my-0">
                タグ：
                {post.properties.tag.multi_select.length === 0
                  ? 'なし'
                  : post.properties.tag.multi_select
                    .map((tag: any, index: number, arr: any[]) => <>
                      <span key={tag.id}>{tag.name}</span>{index < arr.length - 1 && '、'}
                    </>)
                }
              </p>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
