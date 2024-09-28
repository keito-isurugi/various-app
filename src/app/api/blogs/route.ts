import { notion } from "../../libs/notion/notionAPI"

export async function GET() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID || "",
  })
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const posts: any = response.results
  return Response.json({ title: posts[0].properties.title.title[0]?.plain_text})
}