/**
 * Notionのページ内容をMarkdownファイルで保存するスクリプト
 * 実際の運用はGitHubActionsで定期実行する
 */
console.log(
	"これはNotionのページ内容をMarkdownファイルで保存するスクリプトです",
);

const path = require("path");
const fs = require("node:fs");
const { notion, n2m } = require("./notionAPI");
const { postToQiita, updateToQiita } = require("./qiitaCreatePosts");
const { generateZennMarkdownFile } = require("./generateZennMarkdownFile");

// ローカル環境で動作確認する際に使用。GitHubActionsで実行する際はRepository secretsに環境変数を設定しておく
require("dotenv").config({ path: "../.env.local" });

(async function main() {
	// notionの記事更新履歴を取得
	const relativePath = "../files/blog-posts/tech";
	const notionHistoryFilePath = path.join(
		relativePath,
		"notion_update_history.json",
	);
	console.log("更新履歴ファイル", notionHistoryFilePath);

	const notionHistoryData = getHistory(notionHistoryFilePath);
	console.log(notionHistoryData);

	// notionのページ一覧を取得。必要なデータを配列格納(ページ詳細取得、ファイル保存に必要)
	const posts = [];
	try {
		const response = await notion.databases.query({
			database_id: process.env.NOTION_DATABASE_ID || "",
		});
		const results = response.results;

		results.forEach((post, index) => {
			const id = post.id;
			const lastEditedTime = post.last_edited_time;

			// notion_updated_history.jsonでIDに紐づく最終更新日を取得
			const lastHistoryUpdate = notionHistoryData[id];

			// 最終更新日が異なる場合、またはnotionHistoryDataにIDが存在しない場合は配列に追加
			if (
				!lastHistoryUpdate ||
				new Date(lastEditedTime) > new Date(lastHistoryUpdate)
			) {
				const title = post.properties.title.title[0].plain_text;
				const tags = post.properties.tag.multi_select.map((tag) => {
					return tag.name;
				});

				posts.push({ id, lastEditedTime, title, tags });
			}
		});
	} catch (error) {
		console.error("Error fetching or Notion posts", error);
	}

	if (posts.length <= 0) {
		console.info("新規作成＆更新されたページはありませんでした");
		return;
	}
	console.log(posts);

	/**
	 * notionのページ詳細を取得、Markdown形式でファイルを保存
	 */
	for (const post of posts) {
		try {
			const notionPageId = post.id;
			const notionPageTitle = post.title;
			const notionPageTags = post.tags;
			const notionPageLastEditedTime = post.lastEditedTime;

			// Markdown形式でファイルを保存
			await saveMarkdownFile(notionPageId);

			// Notionの更新履歴データを保存
			const updateNotionHistory = {
				...notionHistoryData,
				[notionPageId]: notionPageLastEditedTime,
			};
			saveHistory(notionHistoryFilePath, updateNotionHistory);

			// Qiitaの記事更新履歴データを取得
			const qiitaHistoryFilePath = path.join(
				relativePath,
				"qiita_update_history.json",
			);
			const qiitaHistoryData = getHistory(qiitaHistoryFilePath);

			// qiita_updated_history.jsonでIDにqiitaの記事IDを取得する
			const qiitaID = qiitaHistoryData[notionPageId];

			// qiitaの記事IDが存在すれば更新。存在しなければ新規登録
			if (qiitaID) {
				await updateToQiita(
					qiitaID,
					notionPageId,
					notionPageTitle,
					notionPageTags,
				);
			} else {
				const createdQiitaID = await postToQiita(
					notionPageId,
					notionPageTitle,
					notionPageTags,
				);
				const updateQiitaHistory = {
					...qiitaHistoryData,
					[notionPageId]: createdQiitaID,
				};
				saveHistory(qiitaHistoryFilePath, updateQiitaHistory);
			}

			// Zenn用のMarkdownファイルを更新
			generateZennMarkdownFile(notionPageId, notionPageTitle, notionPageTags);
		} catch (error) {
			console.error("Error fetching or saving markdown:", error);
		}
	}
})();

/**
 * 指定されたページIDに対応するMarkdownファイルを保存する関数。
 *
 * @param {string} pageId - NotionのページID。取得したページデータをMarkdownに変換するために使用。
 *
 * @throws Will log an error if the Markdown file cannot be saved or if the directory cannot be created.
 *
 * この関数は、指定されたNotionのページIDを使用してページの内容をMarkdown形式に変換し、
 * 指定されたファイル名で保存先ディレクトリにMarkdownファイルとして保存する。
 */
async function saveMarkdownFile(pageId) {
	try {
		// ページ詳細取得、Markdown形式に変換
		const mdBlocks = await n2m.pageToMarkdown(pageId);
		const mdString = n2m.toMarkdownString(mdBlocks);

		// 保存先ディレクトリ、保存ファイル名を生成
		const relativePath = "../files/blog-posts/tech";
		const filePath = path.join(relativePath, `${pageId}.md`);

		// 保存先ディレクトリが存在しない場合、再帰的に作成
		if (!fs.existsSync(relativePath)) {
			fs.mkdirSync(relativePath, { recursive: true });
		}

		// Markdownファイルを保存 (同期処理を非同期に変更)
		fs.writeFileSync(filePath, mdString.parent);
		console.log(`Markdown file saved at: ${filePath}`);
	} catch (error) {
		console.error("Error saving Markdown file:", error);
	}
}

// 更新履歴データを取得する関数
function getHistory(historyFilePath) {
	// 履歴ファイルを読み込む
	if (!fs.existsSync(historyFilePath)) {
		console.warn("History file not found, exiting script.");
		return;
	}

	// 履歴データを返す
	try {
		const historyFile = fs.readFileSync(historyFilePath, "utf-8");
		return JSON.parse(historyFile);
	} catch (error) {
		console.error("Error reading history file:", error);
		return;
	}
}

// 更新履歴データの保存する関数
function saveHistory(historyFilePath, updatedHistoryData) {
	try {
		fs.writeFileSync(
			historyFilePath,
			JSON.stringify(updatedHistoryData, null, 2),
			"utf-8",
		);
		console.log("History data updated successfully.");
	} catch (error) {
		console.error("Error saving history data:", error);
	}
}
