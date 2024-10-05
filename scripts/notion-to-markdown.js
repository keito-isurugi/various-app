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
  // notionの記事更新履歴を取得
  const historyFilePath = path.join(path.dirname(process.cwd()), 'files', 'blog_posts', 'notion_update_history.json');
  const historyData = getHistory(historyFilePath)
  console.log(historyData)

  // notionのページ一覧を取得。必要なデータを配列格納(ページ詳細取得、ファイル保存に必要)
  const posts = []
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID || "",
    })
    const results = response.results
    results.forEach((post, index) => {
      const id = post.id
      const last_edited_time = post.last_edited_time
      // .replace(/[:T.]/g, '-').replace('Z', '') // 2024-01-01-23-59-59-000
      // console.log(post.last_edited_time, last_edited_time)
      const title =  post.properties.title.title[0].plain_text
      // const fileName = `${id}_${last_edited_time}`
      // console.log(index, id, last_edited_time, title)
      
      // notion_updated_history.jsonでIDに紐づく最終更新日を取得
      const lastHistoryUpdate = historyData[id];

      // file/blog_posts/notion_updated_history.jsonを読み込む
      // idに紐づく最終更新日を比較して異なれば配列に情報を追加
      // 最終更新日が異なる場合、またはhistoryDataにIDが存在しない場合は配列に追加
      if (!lastHistoryUpdate || new Date(last_edited_time) > new Date(lastHistoryUpdate)) {
        posts.push({id, last_edited_time, title})
      }
    })
  } catch (error) {
    console.error('Error fetching or Notion posts', error);
  }

  if(posts.length <= 0) {
    console.info("新規作成＆更新されたページはありませんでした")
    return
  }
  console.log(posts)

  /**
   * notionのページ詳細を取得、Markdown形式でファイルを保存
   */
  for (const post of posts) {
    try {
      // Markdown形式でファイルを保存
      await saveMarkdownFile(post.id);
      
      // 更新履歴データを保存
      const updateHistory = {...historyData, [post.id]: post.last_edited_time}
      saveHistory(historyFilePath, updateHistory)
    } catch (error) {
      console.error('Error fetching or saving markdown:', error);
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
    const dirPath = path.join(path.dirname(process.cwd()), 'files', 'blog_posts');
    const filePath = path.join(dirPath, `${pageId}.md`);

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

// 更新履歴データを取得する関数
function getHistory(historyFilePath) {
    // 履歴ファイルを読み込む
    if (!fs.existsSync(historyFilePath)) {
      console.warn('History file not found, exiting script.');
      return
    }
  
    // 履歴データを返す
    try {
      const historyFile = fs.readFileSync(historyFilePath, 'utf-8');
      return JSON.parse(historyFile);
    } catch (error) {
      console.error('Error reading history file:', error);
      return
    }
}

// 更新履歴データの保存する関数
function saveHistory(historyFilePath, updatedHistoryData) {
  try {
    fs.writeFileSync(historyFilePath, JSON.stringify(updatedHistoryData, null, 2), 'utf-8');
    console.log('History data updated successfully.');
  } catch (error) {
    console.error('Error saving history data:', error);
  }
}
