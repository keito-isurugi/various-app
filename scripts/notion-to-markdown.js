/**
 * Notionのページ内容をMarkdownファイルで保存するスクリプト
 * 実際の運用はGitHubActionsで定期実行する
 */
console.log("これはNotionのページ内容をMarkdownファイルで保存するスクリプトです")

const { notion, n2m } = require('./notionAPI');
const path = require('path');
const fs = require('fs');

// ローカル環境で動作確認する際に使用。GitHubActionsで実行する際はRepository secretsに環境変数を設定しておく
require('dotenv').config({ path: '../.env.local' });


(async function main() {
  /**
   * notionのページ一覧を取得。必要なデータを配列格納(ページ詳細取得、ファイル保存に必要)
   */
  const posts = []
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID || "",
    })
    const results = response.results
    results.forEach((post, index) => {
      const id = post.id
      const last_edited_time = post.last_edited_time.replace(/[:T.]/g, '-').replace('Z', '') // 2024-01-01-23-59-59-000
      console.log(post.last_edited_time, last_edited_time)
      const title =  post.properties.title.title[0].plain_text
      const fileName = `${id}_${last_edited_time}`
      console.log(index, id, last_edited_time, title, fileName)
      posts.push({id, last_edited_time, title, fileName})
    })
  } catch (error) {
    console.error('Error fetching or Notion posts', error);
  }
  console.log(posts)

  /**
   * notionのページ詳細を取得、Markdown形式でファイルを保存
   */
  for (const post of posts) {
    try {
      const response = await notion.blocks.children.list({
        block_id: post.id,
      });

      await saveMarkdownFile(post.id, post.fileName);

      const results = response.results;
      console.log(results);
    } catch (error) {
      console.error('Error fetching or saving markdown:', error);
    }
  }
})();

/**
 * 指定されたページIDに対応するMarkdownファイルを保存する関数。
 * 
 * @param {string} pageId - NotionのページID。取得したページデータをMarkdownに変換するために使用。
 * @param {string} fileName - 保存するMarkdownファイルの名前。拡張子は自動的に`.md`として保存される。
 * 
 * @throws Will log an error if the Markdown file cannot be saved or if the directory cannot be created.
 * 
 * この関数は、指定されたNotionのページIDを使用してページの内容をMarkdown形式に変換し、
 * 指定されたファイル名で保存先ディレクトリにMarkdownファイルとして保存する。
 */
async function saveMarkdownFile(pageId, fileName) {
  try {
    // ページ詳細取得、マークダウン形式に変換
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);

    // 保存先ディレクトリ、保存ファイル名を生成
    const dirPath = path.join(path.dirname(process.cwd()), 'files', 'blog_posts');
    const filePath = path.join(dirPath, `${fileName}.md`);

    // 保存先ディレクトリが存在しない場合、再帰的に作成
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }    

    // Markdownファイルを保存 (同期処理を非同期に変更)
    fs.writeFileSync(filePath, mdString.parent);
    console.log(`Markdown file saved at: ${filePath}`);
  } catch (error) {
    console.error('Error saving Markdown file:', error);
  }
}
