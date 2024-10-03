console.log("これはNotionのページ内容をMarkdownファイルで保存するスクリプトです")

const { notion, n2m } = require('./notionAPI'); // ここを修正
const path = require('path');
const fs = require('fs');

// メイン関数をそのまま実行するように変更
(async function main() {
  const pageId = '70944115c0064432ab9181b4a5a04f5f'; // ここに対象のNotionページIDを指定

  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdblocks);
    console.log(mdString.parent);

    await saveMarkdownFile(pageId);

    const post = response.results;
    console.log({ post });
  } catch (error) {
    console.error('Error fetching or saving markdown:', error);
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
async function saveMarkdownFile(pageId) {
  try {
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);

    const formattedDate = getFormattedDate();
    const dirPath = path.join(process.cwd(), 'files', 'blog_posts', formattedDate);
    const filePath = path.join(dirPath, `${pageId}.md`);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, mdString.parent);
    console.log(`Markdown file saved at: ${filePath}`);
  } catch (error) {
    console.error('Error saving Markdown file:', error);
  }
}
