import { useEffect, useState } from 'react'
import styles from '@/public/css/pokemon.module.css'
import { client } from '@/lib/axios'
import InfiniteScroll  from "react-infinite-scroller"
import  BallSpinner from '@/components/parts/BallSpinner'

export default function Home() {
	const [datas, setDatas] = useState([])
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);  //再読み込み判定

	const loadMore = async (page) => {
		fetchPokemons(page, false)
	}

	const fetchPokemons = async (page, lodaing = true) => {
		setIsLoading(lodaing)
		await client
			.get(`/api/pokemon/list/?page=${page}`)
			.then((res) => {
				console.log(res.data)

				//データ件数が0件の場合、処理終了
				if (res.data.length < 1) {
					setHasMore(false);
					return;
				}
				//取得データをリストに追加
				setDatas([...datas, ...res.data])
				setIsLoading(false);
			})
			.catch(error => {
					console.error(error)
					setIsLoading(false);
			})
	}

	useEffect(() => {
		fetchPokemons(1, true)
	}, [])

 //ロード中に表示する項目
 const loader = '';

	return (
    <>
			<InfiniteScroll
				loadMore={loadMore}    //項目を読み込む際に処理するコールバック関数
				hasMore={hasMore}    //読み込みを行うかどうかの判定
				loader={loader} 			 //読み込み最中に表示する項目
				className={`${styles.poke_wrap}`}
				>
					{hasMore === false && <BallSpinner />}
					{datas.map((data, index) => (
						<div 
							key={index} 
							className={`rounded shadow-lg cursor-pointer ${styles.card}`} 
							>
							<div className="w-full mx-auto bg-gray-300">
								<img src={data.img} alt={data.name} />	
							</div>
							<div className="px-1 py-1 lg:px-2 lg:py-2">
								<p className="font-bold text-xs lg:text-xl" >{data.name}</p>
							</div>
						</div>
					))}
				</InfiniteScroll>
				{hasMore === true && <BallSpinner />}
    </>
  )
}
