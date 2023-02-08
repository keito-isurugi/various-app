import { useEffect, useState } from 'react'
import styels from '@/public/css/pokemon.module.css'
import { client } from '@/lib/axios'
import InfiniteScroll  from "react-infinite-scroller"

export default function Home() {
	const [datas, setDatas] = useState([])
	const [hasMore, setHasMore] = useState(true);  //再読み込み判定

	const loadMore = async (page) => {
      
		// const response = await fetch(`http://localhost:3000/api/test?page=${page}`);  //API通信
		// const data = await response.json();  //取得データ

		// //データ件数が0件の場合、処理終了
		// if (data.length < 1) {
		// 	setHasMore(false);
		// 	return;
		// }
		// //取得データをリストに追加
		// setDatas([...datas, ...data])
		fetchPokemons(page)
	}

	const fetchPokemons = async (page) => {
		await client
			// .get(`/api/pokemons`)
			.get(`/api/pokemon/list/?page=${page}`)
			.then((res) => {
				console.log(res.data)
				// setDatas(res.data)

				//データ件数が0件の場合、処理終了
				if (res.data.length < 1) {
					setHasMore(false);
					return;
				}
				//取得データをリストに追加
				setDatas([...datas, ...res.data])
			})
			.catch(error => {
					console.error(error)
			})
	}

	useEffect(() => {
		fetchPokemons(1)
	}, [])

 //ロード中に表示する項目
 const loader =<div className="loader" key={0}>Loading ...</div>;

	return (
    <>
		<div className='px-10'>
			<div className='flex gap-4 flex-wrap justify-between'>
			<InfiniteScroll
        loadMore={loadMore}    //項目を読み込む際に処理するコールバック関数
        hasMore={hasMore}         //読み込みを行うかどうかの判定
        loader={loader}
				className='flex gap-4 flex-wrap justify-between'
				>      {/* 読み込み最中に表示する項目 */}
					{datas.map((data, index) => (
						<div key={index} className={`w-1/6 rounded overflow-hidden shadow-lg cursor-pointer ${styels.card}`}>
							<div className="w-full mx-auto bg-gray-300">
								<img className="w-full" src={data.img} alt={data.name} />	
							</div>
							<div className="px-2 py-2">
								<div className="font-bold text-xl text-center">No.{data.no}：{data.name}</div>
							</div>
						</div>
					))}
				</InfiniteScroll>
			</div>
		</div>
    </>
  )
}
