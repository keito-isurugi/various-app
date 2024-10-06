require('dotenv').config({ path: '../.env.local' });
const path = require('path');
const fs = require('fs');

// require in commonjs env
const Qiita = require('qiita-js');

// set your token
Qiita.setToken(process.env.QIITA_ACCESS_TOKEN);
Qiita.setEndpoint('https://qiita.com');

// Markdownファイルのパス
// const markdownFilePath = path.join(path.dirname(process.cwd()), 'files', 'blog_posts', '116872c8-f4a6-803f-8a5f-cff9b2043833.md');

// try {
//   // Markdownファイルの内容を読み込む
//   const markdownContent = fs.readFileSync(markdownFilePath, 'utf8');
  
//   // 記事の内容
//   const postdata = {
//     title: 'テスト投稿:更新してみました',
//     body: markdownContent,
//     private: true,
//     tags: [{ name: 'test' }]
//   };

//   // 記事投稿
//   Qiita.Resources.Item.update_item("c4a6e98fbbfcb8779163", postdata)
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((error) => {
//       console.error('Error posting to Qiita:', error);
//     });

// } catch (error) {
//   console.error('Error reading the markdown file:', error);
// }
// c4a6e98fbbfcb8779163

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
    const relativePath = '../files/blog_posts';
    const markdownFilePath = path.join(relativePath, `${pageId}.md`);
    const markdownContent = fs.readFileSync(markdownFilePath, 'utf8');

    // 投稿する記事の内容
    const postdata = {
      title: title,
      body: markdownContent,
      private: false,
      tags: tags.map(tag => ({ name: tag }))
    };

    // Qiitaに記事投稿
    const result = await Qiita.Resources.Item.create_item(postdata);
    return result.id;
  } catch (error) {
    console.error('Error posting to Qiita:', error);
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
    const relativePath = '../files/blog_posts';
    const markdownFilePath = path.join(relativePath, `${notionPageId}.md`);
    const markdownContent = fs.readFileSync(markdownFilePath, 'utf8');
    
    // 更新する記事の内容
    const postdata = {
      title: title,
      body: markdownContent,
      private: true,
      tags: tags.map(tag => ({ name: tag }))
    };

    // Qiitaの記事更新
    await Qiita.Resources.Item.update_item(qiitaPageId, postdata);
  } catch (error) {
    console.error('Error posting to Qiita:', error);
    throw error; // エラーを再スローする
  }
}

// モジュールエクスポート
module.exports = { postToQiita, updateToQiita };
