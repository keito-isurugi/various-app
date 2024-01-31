// pages/image/index.js
import { useEffect, useState } from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const directoryPath = './public/tmp/img/';

const deleteFilesInDirectory = (directory) => {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    fs.unlinkSync(filePath);
  });
};

// 実際に削除を行う
const ImagePage = () => {
    const [array, setArray] = useState([]);
    const [url, setUrl] = useState('取得したい画像のあるサイトのURL')

    const fetchImages = async () => {

    const res = await fetch(`/api/scrapeImages?url=${url}`);
    const data = await res.json();
    
    // 上記非同期処理完了後に実行
    const dllink = '/tmp/img/images.zip';
    const link = document.createElement('a');
    link.href = dllink;
    link.download = 'archive.zip';
    link.click();

    setArray(data.array);
    console.log("===========================")
    deleteFilesInDirectory(directoryPath);

}
        

 return (
  <div>
    <p> 
        <label>URL:</label><input onChange={(e) => setUrl(e.target.value)} type='text' value={url} />
    </p>
    <button onClick={fetchImages}>実行</button>
    {array?.map((a, index) => (
      <p key={index}>{a}</p>
    ))}
  </div>
 );
};

export default ImagePage;
