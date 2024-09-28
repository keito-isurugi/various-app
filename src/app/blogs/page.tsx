import { notion } from '../libs/notion/notionAPI';

// Note: APIをコールするために作成。後で修正する。
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function getAllPosts(): Promise<any> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID || "",
  })
  const posts = response.results
  return posts[0].properties.title.title[0]?.plain_text
}

export default function Home() {
  const title = getAllPosts()
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>{ title }</h1>
		</div>
	);
}
