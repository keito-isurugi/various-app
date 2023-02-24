import { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/react-splide/css/sea-green';;
import styles from '@/public/css/pokemon.module.css'
import db from "@/lib/firabase"
import { collection, getDocs, doc, onSnapshot, setDoc, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { usePokeInfoHooks } from '@/hooks/pokemon/usePokeInfoHooks'
import  BallSpinner from '@/components/parts/BallSpinner'

const { typeImage } = usePokeInfoHooks()

const PokeSlider = () => {
	const defaultData = {
		no: "",
		name: "",
		img: "",
		type1: "",
		type2: "",
	}
	const POKE_PICKUPUS = [[25, 133, 39], [144, 145, 146], [133, 134, 135, 136]]
	const [datas, setDatas] = useState([defaultData])
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetchPokemons(false)
	}, [])

	const fetchPokemons = async (loading = true) => {
		setIsLoading(true)
		const random = Math.floor( Math.random() * POKE_PICKUPUS.length );
		const pickupNums = POKE_PICKUPUS[random]
		const pickups = []
		const pokeDatas = collection(db, "pokemon")
		return new Promise((resolve, reject) => {
			pickupNums?.map(async(pickup) => {
				await getDocs(query(pokeDatas,  where('no', '==', pickup))).then((snapShot) => {
					pickups.push(snapShot.docs[0].data())
				})
				setDatas(pickups)
				setIsLoading(false)
			})
		})
	}

	return (
		<>
			<div className={`${styles.pickup_cover}`}>
        <section className={`${styles.pickup_wrap}`}>
          <div className={`${styles.pickup_bg}`}></div>
          <h2 className={`${styles.pickup_title}`}>
						<img src="/img/pokemon/pickup.svg" alt="ピックアップ"/>
					</h2>
					{isLoading 
					? <BallSpinner /> 
					:
					<Splide
						options={ {
							width : '100%',
							arrowPath: 'none',
							autoplay: true,
							interval: 5000,
							speed: 2000,
							type: 'loop',
						} }
					>
						{datas?.map((data, index) => (
							<SplideSlide key={index}>
								<div className={`flex justify-center items-center mx-auto my-0`}>
									<figure>
										<img width='340' src={data?.img} alt={data?.name}/>
									</figure> 
									<div>
										<h3 className='font-bold text-3xl'>
											<small className='block text-xl'>No.{data?.no}</small>{data?.name}
										</h3>
										<p className={`${styles.pickup_content_img}`}>
											<a href="/?type%5B%5D=15" className={`${styles.pickup_content_label}`}>
												<img src={typeImage(data?.type1)} alt={data?.type1} className={`${styles.pickup_content_label_img}`} />
												{data?.type1}
											</a>
											<a href="/?type%5B%5D=6" className={`${styles.pickup_content_label}`}>
												<img src={typeImage(data?.type2)} alt={data?.type2} className={`${styles.pickup_content_label_img}`} />
												{data?.type2}
											</a>
										</p>
									</div>
								</div>
							</SplideSlide>
						))}
					</Splide>
					}
        </section>
			</div>
		</>
	)
}

export default PokeSlider