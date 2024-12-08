const fs = require("node:fs");
const path = require("path");

/**
 * Zenn用のMarkdownファイルを生成する関数
 *
 * この関数は、指定された `notionID`、`title`、`tags` を使用して、Zennのフォーマットに従ったMarkdownファイルを生成します。
 * ファイルの先頭には、指定されたタイトルやタグ情報を含むヘッダーが自動的に挿入されます。
 * また、元となるMarkdownファイルの内容を指定のディレクトリから読み込み、Zenn用のディレクトリに書き込みます。
 *
 * @param {string} notionID - ファイル名として使用されるNotionページのID。これがMarkdownファイルの名前となります。
 * @param {string} title - 記事のタイトル。ZennのMarkdownフォーマットの `title` フィールドとして使用されます。
 * @param {Array<string>} tags - 記事のトピック（タグ）。ZennのMarkdownフォーマットの `topics` フィールドとして使用されます。
 *
 * @throws {Error} ファイルの読み込みや書き込み時にエラーが発生した場合は、エラーがスローされます。
 *
 * @example
 * // 使用例:
 * const notionID = '7dd71d52-bb6e-45a4-b0e5-11c94c282934';
 * const title = 'Zenn用の記事タイトル';
 * const tags = ['JavaScript', 'Node.js', 'Web開発'];
 * generateZennMarkdownFile(notionID, title, tags);
 */
function generateZennMarkdownFile(notionID, title, tags) {
	// 先頭に挿入する文字列
	const header = `---
title: "${title}"
emoji: ""
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ${JSON.stringify(tags)}
published: true
---
`;

	// 出力するMarkdownファイルのパスを生成
	const fileName = `${notionID}.md`; // notionIDをファイル名として使用
	const relativePath = "../files/blog-posts/tech";
	const sourceFilePath = path.join(relativePath, fileName);
	const outputFilePath = path.join("../../articles", fileName);

	// 元のMarkdownファイルの内容を読み込む
	const markdownContent = fs.readFileSync(sourceFilePath, "utf8");

	// 新しいMarkdownファイルを作成し、ヘッダーと元の内容を結合して書き込む
	const fullContent = header + markdownContent;
	fs.writeFileSync(outputFilePath, fullContent, "utf8");

	console.log(`Markdownファイルが作成されました: ${outputFilePath}`);
}

module.exports = {
	generateZennMarkdownFile,
};
