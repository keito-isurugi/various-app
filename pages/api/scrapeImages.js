// pages/api/scrapeImages.js
import axios from 'axios';
import cheerio from 'cheerio';
import fs, { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import archiver from 'archiver';

export default async function scrapeImages(req, res) {
 const url = req.query.url || '取得したい画像のあるサイトのURL'; // スクレイピングしたいURLを指定
 const directory = req.query.directory || '/default/directory/path'; // 保存先のディレクトリを指定
if (!fs.existsSync('./public/tmp/img/')) {
  fs.mkdirSync('./public/tmp/img/');
}

  let array = [];
  const BASE_DIRECTORY = './public/tmp/img/'
  const CLIENT_BASE_DIRECTORY = 'tmp/img/'

  const response = await axios.get(url);
  const htmlParser = response.data;
  const $ = cheerio.load(htmlParser);
  console.log("++++++++++++++++++++++++++++++++++++++++++++")

// 画像ダウンロードの非同期処理を待つPromiseを返す関数
const downloadImage = async (imageUrl, altText, baseFilePath, clientBaseFilePath) => {
  if (altText) {
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
    const filePath = path.join(BASE_DIRECTORY, path.basename(baseFilePath));
    imageResponse.data.pipe(fs.createWriteStream(filePath));
    return clientBaseFilePath;
  }
};

// 画像ダウンロードが完了した後に実行される処理
const handleDownloadComplete = async (resultArray) => {
  console.log("画像ダウンロード完了");

  // archiverを使用して画像をzip圧縮
  const zipFilePath = path.join(BASE_DIRECTORY, 'images.zip');
  const output = createWriteStream(zipFilePath);
  const archive = archiver('zip');

  archive.pipe(output);

  // 全ての画像ファイルをzipに追加
  resultArray.forEach((imagePath) => {
    if(imagePath){
      const imageFullPath = `./public/${imagePath}`;
      console.log(imageFullPath)
      archive.append(createReadStream(imageFullPath), { name: imagePath });
    }
  });

  // 圧縮を実行
  await archive.finalize();

  console.log("画像をzip圧縮しました");

  // クライアントにzipファイルのパスを返す
  res.status(200).json({ zipFilePath });
};

// Promiseの配列を作成
const downloadPromises = $("img", htmlParser).map(async function () {
  const imageUrl = $(this).attr('src');
  const altText = $(this).attr('alt')?.replace(".", "").replace(/\s+/g, "");
  if (altText) {
    const imageExtension = imageUrl.split('.').pop();
    const baseFilePath = `${BASE_DIRECTORY}${altText}.${imageExtension}`;
    const clientBaseFilePath = `${CLIENT_BASE_DIRECTORY}${altText}.${imageExtension}`;

    // downloadImage関数のPromiseを追加
    return downloadImage(imageUrl, altText, baseFilePath, clientBaseFilePath);
  }
}).get();

try {

  // すべての非同期処理が完了するのを待つ
  const resultArray = await Promise.all(downloadPromises);

  // 画像ダウンロード完了後にzip圧縮を実行
  await handleDownloadComplete(resultArray);

  // 上記処理が終了後に繰り返し処理
  console.log("++++++++++++++++++++++++++++++++++++++++++++")

  await res.status(200).json({ resultArray });
 } catch (error) {
  console.error(error);
  await res.status(500).json({ error: error.message });
 }
}
