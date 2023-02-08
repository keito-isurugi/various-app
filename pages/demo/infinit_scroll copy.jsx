import { useEffect, useState } from 'react'
import styels from '@/public/css/pokemon.module.css'
import { client } from '@/lib/axios'

export default function Home() {
	const [datas, setDatas] = useState([])

	const fetchPokemons = () => {
		client
			.get('/api/pokemon/list')
			.then((res) => {
				console.log(res.data)
				setDatas(res.data)
			})
			.catch(error => {
					console.error(error)
			})
	}

	useEffect(() => {
		fetchPokemons()
	}, [])

	return (
    <>
		<div className='px-10'>
			<div className='flex gap-4 flex-wrap justify-between'>
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
			</div>
		</div>
    </>
  )
}
