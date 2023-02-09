import {useState} from 'react';
import InfiniteScroll  from "react-infinite-scroller"

export default function Index() {
  //表示するデータ
  const [list, setList] = useState([]);          //表示するデータ
  const [hasMore, setHasMore] = useState(true);  //再読み込み判定
  
  //項目を読み込むときのコールバック
	const loadMore = async (page) => {
      
		const response = await fetch(`http://localhost:3000/api/test?page=${page}`);  //API通信
		const data = await response.json();  //取得データ

		//データ件数が0件の場合、処理終了
		if (data.length < 1) {
			setHasMore(false);
			return;
		}
		//取得データをリストに追加
		setList([...list, ...data])
	}

  //各スクロール要素
  const items = (
    <ul>
      {list.map((value) => <li key={value}>{value}</li>)}
    </ul>
	);
  
  //全体のスタイル
  const root_style = {
    marginLeft : "50px",
    marginTop : "50px",
  }

  //ロード中に表示する項目
  const loader =<div className="loader" key={0}>Loading ...</div>;

  return (
    <div style={root_style}>
      <InfiniteScroll
        loadMore={loadMore}    //項目を読み込む際に処理するコールバック関数
        hasMore={hasMore}         //読み込みを行うかどうかの判定
        loader={loader}>      {/* 読み込み最中に表示する項目 */}
          {items}             {/* 無限スクロールで表示する項目 */}
      </InfiniteScroll>
    </div>
  )
}