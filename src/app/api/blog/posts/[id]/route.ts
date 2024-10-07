import fs from "node:fs";
import path from "path";
import { n2m, notion } from "@/libs/notion/notionAPI";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const response = await notion.blocks.children.list({
		block_id: params.id,
	});

	// const mdblocks = await n2m.pageToMarkdown(params.id);
	// const mdString = n2m.toMarkdownString(mdblocks);
	// console.log(mdString.parent);

	// saveMarkdownFile(params.id)
	const post: any = response.results;
	return Response.json({ post });
}

function getFormattedDate() {
	const now = new Date();
	const yyyy = now.getFullYear().toString();
	const mm = (now.getMonth() + 1).toString().padStart(2, "0"); // 月は0始まりのため+1
	const dd = now.getDate().toString().padStart(2, "0");
	return `${yyyy}${mm}${dd}`;
}

// マークダウンファイルの保存関数
async function saveMarkdownFile(pageId: string) {
	try {
		// NotionページをMarkdownに変換
		const mdBlocks = await n2m.pageToMarkdown(pageId);
		const mdString = n2m.toMarkdownString(mdBlocks);

		// 保存するフォルダとファイルパスの指定
		const formattedDate = getFormattedDate();
		const dirPath = path.join(
			process.cwd(),
			"files",
			"blog-posts",
			"tech",
			formattedDate,
		);
		const filePath = path.join(dirPath, `${pageId}.md`);
		console.log("石動慧人", filePath);

		// ディレクトリが存在しない場合は作成
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		// マークダウンデータをファイルに書き込み
		fs.writeFileSync(filePath, mdString.parent);
		console.log(`Markdown file saved at: ${filePath}`);
	} catch (error) {
		console.error("Error saving Markdown file:", error);
	}
}

// // ページIDを指定してMarkdownファイルを保存
// const pageId = params.id; // ここでNotionページのIDを指定
// saveMarkdownFile(pageId);
