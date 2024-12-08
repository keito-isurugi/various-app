require("dotenv").config({ path: "../.env.local" });
const path = require("path");
const fs = require("node:fs");

// require in commonjs env
const Qiita = require("qiita-js");

// set your token
Qiita.setToken(process.env.QIITA_ACCESS_TOKEN);
Qiita.setEndpoint("https://qiita.com");

/**
 * Qiitaに記事を投稿する関数
 * @param {string} pageId - NotionのページID
 * @param {string} title - Notionのページタイトル
 * @param {Array} tags - Notionのページのタグの配列
 * @returns {Promise<string>} - 投稿したQiitaの記事ID
 */
async function postToQiita(pageId, title, tags) {
	try {
		// Markdownファイル読み込み
		const relativePath = "../files/blog-posts/tech";
		const markdownFilePath = path.join(relativePath, `${pageId}.md`);
		const markdownContent = fs.readFileSync(markdownFilePath, "utf8");

		// 投稿する記事の内容
		const postdata = {
			title: title,
			body: markdownContent,
			private: false,
			tags: tags.map((tag) => ({ name: tag })),
		};

		// Qiitaに記事投稿
		const result = await Qiita.Resources.Item.create_item(postdata);
		return result.id;
	} catch (error) {
		console.error("Error posting to Qiita:", error);
		throw error;
	}
}

/**
 * Qiitaの記事を更新する関数
 * @param {string} qiitaPageId - Qiitaの記事ID
 * @param {string} notionPageId - NotionのページID
 * @param {string} title - Notionのページのタグの配列
 * @param {Array} tags - Notionのページのタグの配列
 */
async function updateToQiita(qiitaPageId, notionPageId, title, tags) {
	try {
		// Markdownファイル読み込み
		const relativePath = "../files/blog-posts/tech";
		const markdownFilePath = path.join(relativePath, `${notionPageId}.md`);
		const markdownContent = fs.readFileSync(markdownFilePath, "utf8");

		// 更新する記事の内容
		const postdata = {
			title: title,
			body: markdownContent,
			private: true,
			tags: tags.map((tag) => ({ name: tag })),
		};

		// Qiitaの記事更新
		await Qiita.Resources.Item.update_item(qiitaPageId, postdata);
	} catch (error) {
		console.error("Error posting to Qiita:", error);
		throw error; // エラーを再スローする
	}
}

// モジュールエクスポート
module.exports = { postToQiita, updateToQiita };
