import { useEffect, useState } from 'react'
import Axios from 'axios'
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

export default function Home() {
	const [datas, setDatas] = useState<any[]>([])
	const [generation, setGeneration] = useState<Number>(1)
	const [pokeNum, setPokeNum] = useState(Array.from(Array(151).keys(), x => x + 1))
	const [isLoading, setIsLoading] = useState(false)

	const createPokeNomArray = (gen: any) => {
		switch (gen) {
			case 1:
				setPokeNum(Array.from(Array(151).keys(), x => x + 1))
				break;
			case 2:
				setPokeNum(Array.from(Array(100).keys(), x => x + 152))
				break;
			case 3:
				setPokeNum(Array.from(Array(135).keys(), x => x + 252))
				break;
			case 4:
				setPokeNum(Array.from(Array(107).keys(), x => x + 387))
				break;
			case 5:
				setPokeNum(Array.from(Array(156).keys(), x => x + 494))
				break;
			case 6:
				setPokeNum(Array.from(Array(72).keys(), x => x + 650))
				break;
			case 7:
				setPokeNum(Array.from(Array(88).keys(), x => x + 722))
				break;
			case 8:
				setPokeNum(Array.from(Array(96).keys(), x => x + 810))
				break;
			case 9:
				setPokeNum(Array.from(Array(103).keys(), x => x + 906))
				break;
			case 999:
				setPokeNum(Array.from(Array(1008).keys(), x => x + 1))
				break;
			default:
				setPokeNum(Array.from(Array(151).keys(), x => x + 1))
				break;
		}
	}

	const onClickSetGeneration = (num: any) => {
		setGeneration(num)
		createPokeNomArray(num)
	}

	const fetchPokeSpecies = (id: number) => {
		return new Promise((resolve, rejects) => {
			Axios
				.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
				.then((res) => {
					let pokemon = res.data
					resolve(pokemon)
				})
				.catch(error => {
						console.error(error)
						setIsLoading(false)
				})
		})
	}
	const fetchPoke = (id: number) => {
		return new Promise((resolve, reject) => {
			Axios
				.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
				.then((res) => {
					let pokemon = res.data
					resolve(pokemon)
				})
				.catch(error => {
						console.error(error)
						setIsLoading(false)
				})
		})
	}

	const fetchType = (url: any) => {
		return new Promise((resolve, reject) => {
			Axios
				.get(`${url}`)
				.then((res) => {
					let type = res.data
					resolve(type)
				})
				.catch(error => {
						console.error(error)
						setIsLoading(false)
				})
		})
	}
	
	const main = async() => {
		let pokeDatas: any[] = [];
		setIsLoading(true)
		await Promise.all(pokeNum.map(async(num, i) => {
			// ?????????????????????????????????
			let pokeSpecies = await fetchPokeSpecies(num)
			// ??????????????????????????????
			let poke = await fetchPoke(num)
			let pokeData = await fetchPokeDetail(num, pokeSpecies, poke)
			pokeDatas.push(pokeData)
		}))
		await pokeDatasSet(pokeDatas)
		console.log("????????????")
	}

	const onCliciMain = () => {
		(async ()=>{
			console.log("???????????????????????????")
			await main()
		}).call([])
	}

	const pokeDatasSet = async(pokeDatas: any) => {
		pokeDatas.sort((a: any, b: any) => a.no - b.no);
		setDatas(pokeDatas)
		setIsLoading(false)
	}

	const fetchPokeDetail  = async (i: any, pokeSpecies: any, poke: any) => {
			// ????????????
			let pokeNo = i
			// ??????
			const name_ja =  pokeSpecies.names.filter((g: any) => g.language.name === "ja")
			let name = name_ja[0].name
			// ????????????
			const genera_ja =  pokeSpecies.genera.filter((g: any) => g.language.name === "ja")
			let classification = genera_ja[0]?.genus
			// ?????????1
			let type1_datas: any = await fetchType(poke.types[0].type.url)
			let type1_data = type1_datas.names.filter((g: any) => g.language.name === "ja")
			let type1 = type1_data[0].name
			// ????????????
			let type2_datas: any = ""
			let type2_data: any = ""
			let type2: any = ""
			if(poke.types[1] !== undefined) {
				type2_datas = await fetchType(poke.types[1]?.type.url)
				type2_data = type2_datas.names.filter((g: any) => g.language.name === "ja")
				type2 = type2_data[0].name
			}
			// ??????
			let height = poke.height
			// ??????
			let weight = poke.weight
			// ??????
			const flavor_text_entries_ja =  pokeSpecies?.flavor_text_entries.filter((g: any) => g.language.name === "ja")
			let flavor_text = flavor_text_entries_ja[0]?.flavor_text
			// ?????????(HP????????????????????????????????????????????????)
			let hp = poke.stats[0].base_stat
			let attack = poke.stats[1].base_stat
			let defense = poke.stats[2].base_stat
			let special_attack = poke.stats[3].base_stat
			let special_defense = poke.stats[4].base_stat
			let speed = poke.stats[5].base_stat
			// ??????
			let img = poke.sprites.other["official-artwork"].front_default
			// let images = poke.sprites

			// ??????
			let poke_json = {
				no: pokeNo,
				name: name,
				classification: classification !== undefined ? classification : "",
				type1: type1,
				type2: type2,
				height: height,
				weight: weight,
				flavor_text: flavor_text !== undefined ? flavor_text : "",
				status: {
					hp: hp,
					attack: attack,
					defense: defense,
					special_attack: special_attack,
					special_defense: special_defense,
					speed: speed,
				},
				img: img,
				generation: generation
				// images: images
			}
			return poke_json
	}


	const fileDl = () => {
		setIsLoading(true)
		const fileName = `pokemon_${generation}.json`;
		const data = JSON.stringify(datas);
		const link = document.createElement("a");
		link.href = "data:text/plain," + encodeURIComponent(data);
		link.download = fileName;
		link.click();
		setIsLoading(false)
	}

	console.log(datas)

  return (
    <>
			<div className='flex gap-3'>
				<p className='font-bold text-3xl'>??????????????????</p>
				<select 
					id="generation"
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 font-bold"
					onChange={(e) => onClickSetGeneration(Number(e.target.value))}
					>
					<option selected>?????????????????????????????????</option>
					{[...Array(9)].map((_, i) => (
						<option key={i+1} value={i+1}>???{i+1}??????</option>
					))}
					<option value={999}>?????????</option>
				</select>
				<LoadingButton loading={isLoading} className='bg-red-600 hover:bg-red-400 text-white font-bold' onClick={() => onCliciMain()}>???????????????????????????</LoadingButton>
				<LoadingButton loading={isLoading} className='bg-blue-600 hover:bg-blue-400 text-white font-bold' onClick={() => fileDl()}>json????????????DL</LoadingButton>
			</div>
    </>
  )
}