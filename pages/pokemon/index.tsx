import { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import pokemonJson from '@/lib/json/pokemon_999.json';
import styels from '@/public/css/pokemon.module.css'
import Button from '@mui/material/Button';
import db from "@/lib/firabase"
import { collection, getDocs, doc, onSnapshot, setDoc, query, where, orderBy, limit } from "firebase/firestore";

export default function Home() {
	const [datas, setDatas] = useState<any[]>([])
	const [pokeNum, setPokeNum] = useState<Number>(0)
	const [generation, setGeneration] = useState<Number>(999)
	const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
	const style = {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		border: '1px solid #000',
		boxShadow: 24,
		p: 4,
	};

	useEffect(() => {
		const pokeDatas = collection(db, "pokemon")
		getDocs(query(pokeDatas, orderBy('no'))).then((snapShot) => {
			setDatas(snapShot.docs.map((doc) => ({ ...doc.data() })))
		})
	}, [])


	const createPokeNomArray = (gen) => {
		switch (gen) {
			case 1:
				return "赤・緑・青"
			case 2:
				return "金・銀"
			case 3:
				return "ルビー・サファイア"
			case 4:
				return "ダイヤモンド・パール"
			case 5:
				return "ブラック・ホワイト"
			case 6:
				return "X・Y"
			case 7:
				return "Uサン・Uムーン"
			case 8:
				return "ソード・シールド"
			case 9:
				return "スカーレット・ヴァイオレット"
			case 999:
				return "全世代"
			default:
				return "全世代"
		}
	}
	
	// 詳細モーダル
	const setPokeDetail = (i) => {
		setPokeNum(i)
		handleOpen()
	}

	const onClickSetGeneration = (num) => {
		setGeneration(num)
	}

	const setPokeDatas = (num) => {
		if(num === 999) {
			setDatas(pokemonJson)
			setGeneration(num)
			return
		}
		const dataCp = pokemonJson.filter((data) => data.generation === num)
		setDatas(dataCp)
		setGeneration(num)
	}

	const chageGenerationGetPoke = (num) => {
		const pokeDatas = collection(db, "pokemon")
		getDocs(query(pokeDatas, where("generation", "=", num),  orderBy('no')))
		.then((snapShot) => {
			setDatas(snapShot.docs.map((doc) => ({ ...doc.data() })))
		})
	}

  return (
    <>
		<div className='px-10'>
			<div className='mb-6 flex gap-6 justify-between'>
				<p className='font-bold text-3xl'>ポケモン図鑑：{createPokeNomArray(generation)}　{datas.length.toLocaleString()}匹</p>
				<select 
					id="generation"
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 font-bold"
					onChange={(e) => setPokeDatas(Number(e.target.value))}
					>
					<option value={999}>全世代</option>
					{[...Array(9)].map((num, i) => (
						<option key={i + 1} value={i + 1}>{createPokeNomArray(i + 1)}</option>
					))}
				</select>
			</div>
			<div className='flex gap-4 flex-wrap justify-between'>
				{datas.map((data, index) => (
					<div key={index} className={`w-1/6 rounded overflow-hidden shadow-lg cursor-pointer ${styels.card}`} onClick={() => setPokeDetail(index)}>
						<div className="w-full mx-auto bg-gray-300">
							<img className="w-full" src={data.img} alt={data.name} />	
						</div>
						<div className="px-2 py-2">
							<div className="font-bold text-xl text-center">No.{data.no}：{data.name}</div>
						</div>
					</div>
				))}
			</div>
		</div>
			<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
				<div className="rounded overflow-hidden shadow-lg bg-white" style={style}>
					<div className="w-full mx-auto bg-gray-300">
						<img className="w-full" src={datas[pokeNum]?.img} alt={datas[pokeNum]?.name} />	
					</div>
					<div className="px-3 py-2">
						<dl className='flex flex-wrap mb-2'>
							<dt className='font-bold text-xl'>No.{datas[pokeNum]?.no}：</dt>
							<dd className='font-bold text-xl'>{datas[pokeNum]?.name}</dd>
						</dl>
						<dl className='flex flex-wrap mb-2'>
							<dt className='font-bold text-xl'>分類：</dt>
							<dd className='font-bold text-xl'>{datas[pokeNum]?.classification}</dd>
						</dl>
						<dl className='flex flex-wrap mb-2'>
							<dt className='font-bold text-xl'>タイプ：</dt>
							<dd className='font-bold text-xl'>{datas[pokeNum]?.type1}、{datas[pokeNum]?.type2}</dd>
						</dl>
						<dl className='flex flex-wrap mb-2'>
							<dt className='font-bold text-xl'>高さ：{datas[pokeNum]?.height / 10}m　重さ：{datas[pokeNum]?.weight / 10}kg</dt>
						</dl>
						<dl className='flex mb-2'>
							<dt className='w-3/6 font-bold text-xl'>説明：</dt>
							<dd className='font-bold text-xl'>{datas[pokeNum]?.flavor_text}</dd>
						</dl>
					</div>
				</div>
      </Modal>
    </>
  )
}
