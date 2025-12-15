import { notion } from "@/libs/notion/notionAPI";
import { NextResponse } from "next/server";

export async function GET() {
	const response = await notion.databases.query({
		database_id: process.env.NOTION_DATABASE_ID || "",
	});
	const posts: any = response.results;
	return NextResponse.json({ posts });
}
