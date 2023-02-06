import { useEffect, useState } from 'react'
import Axios from 'axios'
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import db from "@/lib/firabase"
import { collection, getDocs, doc, onSnapshot, setDoc } from "firebase/firestore"; 
import pokemonJson from '@/lib/json/pokemon_demo.json';

export default function Home() {
	const [datas, setDatas] = useState<any[]>(pokemonJson)
	const [isLoading, setIsLoading] = useState(false)
	

	const onPokeRegister = () => {
		setIsLoading(true)
		datas.map((poke, index) => {
			setDoc(doc(db, "pokemon", `pokemon_${index + 1}`), poke);
		})
		setIsLoading(false)
	}

  return (
    <>
			<div className=''>
				<p className='font-bold text-3xl'>ポケモンデータFirabase登録</p>
				<LoadingButton loading={isLoading} className='bg-blue-600 hover:bg-blue-400 text-white font-bold' onClick={() => onPokeRegister()}>ポケモンデータ登録</LoadingButton>
			</div>
    </>
  )
}