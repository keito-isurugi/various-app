console.log("これはNotionのページ内容をMarkdownファイルで保存するスクリプトです")

require('dotenv').config({ path: '../.env.local' });
const { notion, n2m } = require('./notionAPI');
const path = require('path');
const fs = require('fs');

// メイン関数をそのまま実行するように変更
(async function main() {
// const FILE_PATH = '/files/blog_posts'

  // notionのページ一覧を取得、配列に必要なデータを格納
  const posts = []
  try {
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID || "",
    })
    const results = response.results

    results.forEach((post, index) => {
      const id = post.id
      const last_edited_time = post.last_edited_time
      const title =  post.properties.title.title[0].plain_text
      const fileName = `${id}_${last_edited_time}`
      console.log(index, id, last_edited_time, title, fileName)
      posts.push({id, last_edited_time, title, fileName})
    })
  } catch (error) {
    console.error('Error fetching or Notion posts', error);
  }
  console.log(posts)
  
  // notionのページ詳細取得
  for (const post of posts) {
    try {
      const response = await notion.blocks.children.list({
        block_id: post.id,
      });

      // const mdblocks = await n2m.pageToMarkdown(post.id, post.fileName);
      // const mdString = n2m.toMarkdownString(mdblocks);
      // console.log(mdString.parent);

      await saveMarkdownFile(post.id, post.fileName);

      const results = response.results;
      console.log(results);
    } catch (error) {
      console.error('Error fetching or saving markdown:', error);
    }
  }
})();

// 日付をフォーマットする関数
function getFormattedDate() {
  const now = new Date();
  const yyyy = now.getFullYear().toString();
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const dd = now.getDate().toString().padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

// Markdownファイルを保存する関数
async function saveMarkdownFile(pageId, fileName) {
  try {
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);

    // const formattedDate = getFormattedDate();
    const dirPath = path.join(process.cwd(), 'files', 'blog_posts');
    const filePath = path.join(dirPath, `${fileName}.md`);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, mdString.parent);
    console.log(`Markdown file saved at: ${filePath}`);
  } catch (error) {
    console.error('Error saving Markdown file:', error);
  }
}
