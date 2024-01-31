const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { JSDOM } = require('jsdom');

async function downloadImages(url, downloadDir) {
  // URLからHTMLを取得
  const response = await axios.get(url);
  const html = response.data;

  // JSDOMを使用してHTMLを解析
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // 画像を保存するディレクトリを作成
  fs.mkdirSync(downloadDir, { recursive: true });

  // imgタグを取得し、各画像をダウンロードして保存
  const imgTags = document.querySelectorAll('img[src]');
  for (const imgTag of imgTags) {
    const imgUrl = new URL(imgTag.src, url).href;
    const imgAlt = imgTag.alt || 'image';

    // ファイル名をalt属性から生成
    const fileName = `${imgAlt}.webp`;
    const filePath = path.join(downloadDir, fileName);

    // 画像をローカルに保存
    const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, Buffer.from(imgResponse.data));
    console.log(`Image '${imgAlt}' saved as '${filePath}'`);
  }
}

// メイン処理
async function main() {
  // URLの入力を促すメッセージを表示
  const urlInput = prompt('URLを入力してください: ');

  // ダウンロード先ディレクトリの入力を促すメッセージを表示
  const downloadDir = prompt('画像を保存するディレクトリを入力してください: ');

  // 画像のダウンロードを実行
  await downloadImages(urlInput, downloadDir);
}

// メイン処理を実行
main();
