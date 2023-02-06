import Link from 'next/link'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import pokemonJson from '@/lib/json/pokemon_999.json';
import styles from '@/public/css/pokemon.module.css'
import { usePokeInfoHooks } from '@/hooks/pokemon/usePokeInfoHooks'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const PokeShowPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
	const [ typeImage, statusBarIsValue, statusBarNonValue, statusName ] = usePokeInfoHooks()

	console.log(pokemonJson[id]?.status === undefined)
	console.log(pokemonJson[id]?.status !== undefined && Object.keys(pokemonJson[id]?.status))

  return (
		<>
			{/* ヘッダー */}
			<div className={`bg-gray-100 flex relative ${styles.poke_show_header}`}>
				<div className='border-2 rounded w-[30px] h-[136px] bg-white border-gray-400 absolute top-[25%] left-[30px] cursor-pointer flex justify-center items-center hover:bg-gray-50' onClick={() => router.push(`/pokemon/show/${Number(id) - 1}`)}>
					<img className='transform rotate-[90deg]' src="/img/pokemon/arrow.svg" alt="" />
				</div>
				<div className="w-[60%] gap-10 flex mx-auto max-w-[1000px]">
					<div className="w-[40%] mx-auto">
						<img className="w-full" src={pokemonJson[id]?.img} alt={pokemonJson[id]?.name} />
					</div>
					<div className='w-[60%] pt-10'>
						<div className='rounded h-[60%] bg-white shadow-lg p-5'>
							<p className='font-bold text-xl'>No.{pokemonJson[id]?.no}</p>
							<p className='font-bold text-3xl'>{pokemonJson[id]?.name}</p>
						</div>
					</div>
				</div>
				<div className='border-2 rounded w-[30px] h-[136px] bg-white border-gray-400 absolute top-[25%] right-[30px] flex justify-center items-center cursor-pointer hover:bg-gray-50' onClick={() => router.push(`/pokemon/show/${Number(id) + 1}`)}>
					<img className='transform rotate-[270deg]' src="/img/pokemon/arrow.svg" alt="" />
				</div>
			</div>

			{/* メイン */}
			<div className='w-[90%] mt-10 mb-0 mx-auto max-w-[1000px]'>
				<div className='flex justify-between'>
					{/* 情報 */}
					<ul className='w-[49%] border-4 rounded px-16 py-10'>
						<li className='mb-10'>
							<dl className='flex'>
								<dt className='font-bold text-xl'>分類：</dt>
								<dd className='text-xl font-medium'>{pokemonJson[id]?.classification}</dd>
							</dl>
						</li>
						<li className='mb-4'>
							<dl className='flex'>
								<dt className='font-bold text-xl'>タイプ：</dt>
								<dd className='flex gap-x-3'>
									<div className='text-[10px] font-medium text-center'>
										<img className="w-[36px] my-0 mx-auto" src={typeImage(pokemonJson[id]?.type1)} alt="" />
										{pokemonJson[id]?.type1}
									</div>
									<div className='text-[10px] font-medium text-center'>
										<img className="w-[36px] my-0 mx-auto" src={typeImage(pokemonJson[id]?.type2)} alt="" />
										{pokemonJson[id]?.type2}
									</div>
								</dd>
							</dl>
						</li>
						<li className='mb-10 flex'>
							<dl className='flex mr-10'>
								<dt className='font-bold text-xl'>高さ：</dt>
								<dd className='text-xl font-medium'>{pokemonJson[id]?.height / 10}m</dd>
							</dl>
							<dl className='flex'>
								<dt className='font-bold text-xl'>重さ：</dt>
								<dd className='text-xl font-medium'>{pokemonJson[id]?.weight / 10}kg</dd>
							</dl>
						</li>
					</ul>

					{/* ステータス */}
					<ul className='w-[49%] border-4 rounded p-10'>
						{pokemonJson[id]?.status !== undefined && Object.keys(pokemonJson[id]?.status)?.map((status) => (
							<dl className='flex mb-6'>
								<dt className='font-bold text-xl w-[110px]'>{statusName(status)}</dt>
								<dd className='text-xl font-medium'>
									<ul className='flex'>
										{statusBarIsValue(pokemonJson[id]?.status[status]).map((i) => (
											<li className='bg-amber-400 rounded-[8px] w-[15px] h-[35px] mr-[5px]'></li>
										))}
										{statusBarNonValue(pokemonJson[id]?.status[status]) !== 0 && statusBarNonValue(pokemonJson[id]?.status[status]).map((i) => (
											<li className='bg-gray-200 rounded-[8px] w-[15px] h-[35px] mr-[5px]'></li>
										))}
									</ul>
								</dd>
							</dl>
						))}
					</ul>
				</div>
				
				{/* 図鑑 */}
				<div className='border-4 rounded px-16 py-10 mt-4'>
					<p className='text-xl font-medium'>
						{pokemonJson[id]?.flavor_text}
					</p>
				</div>
			</div>
		</>
		)
}

export default PokeShowPage