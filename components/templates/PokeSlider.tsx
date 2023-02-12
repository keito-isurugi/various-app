import { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/react-splide/css/sea-green';;
import styles from '@/public/css/pokemon.module.css'
import db from "@/lib/firabase"
import { collection, getDocs, doc, onSnapshot, setDoc, query, where, orderBy, limit, startAfter } from "firebase/firestore";

const PokeSlider = () => {
	const [datas, setDatas] = useState([])
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetchPokemons(false)
	}, [])

	const fetchPokemons = async (lodaing = true) => {
		setIsLoading(lodaing)
		const pickupNums = [1, 2, 3]
		const pickups = []
		const pokeDatas = collection(db, "pokemon")
		return new Promise((resolve, reject) => {
			pickupNums.map(async(pickup) => {
				console.log(pickup)
				await getDocs(query(pokeDatas,  where('no', '==', pickup))).then((snapShot) => {
					pickups.push(snapShot.docs[0].data())
				})
				setDatas(pickups)
			})
		})
	}
	return (
		<>
			{/* <div className={`${styles.pickup_cover}`}>
        <section className={`${styles.pickup_wrap}`}>
          <div className={`${styles.pickup_bg}`}></div>
          <h2 className={`${styles.pickup_title}`}>
						<img src="/img/pokemon/pickup.svg" alt="ピックアップ"/>
					</h2>
					<Splide
						options={ {
							width : '100%',
							arrowPath: 'none',
							autoplay: true,
							interval: 1000,
							speed: 3000,
							type: 'loop',
						} }
					>
						<SplideSlide>
							<div className={`flex justify-center items-center mx-auto my-0`}>
								<figure>
									<img width='340' src="https://zukan.pokemon.co.jp/zukan-api/up/images/index/4449f3e1ba5f48086fd2b16dc3eb36b1.png" alt="Image 1"/>
								</figure> 
								<div>
									<h3 className='font-bold text-3xl'>
										<small className='block text-xl'>No.0646</small>キュレム
									</h3>
									<p className={`${styles.pickup_content_img}`}>
										<a href="/?type%5B%5D=15" className={`${styles.pickup_content_label}`}>
											<img src="/img/pokemon/icon_type_15.svg" alt="ドラゴン" className={`${styles.pickup_content_label_img}`} />
											ドラゴン
										</a>
										<a href="/?type%5B%5D=6" className={`${styles.pickup_content_label}`}>
											<img src="/img/pokemon/icon_type_6.svg" alt="こおり" className={`${styles.pickup_content_label_img}`} />
											こおり
										</a>
									</p>
								</div>
							</div>
						</SplideSlide>
					</Splide>
        </section>
			</div> */}
		</>
	)
}

export default PokeSlider