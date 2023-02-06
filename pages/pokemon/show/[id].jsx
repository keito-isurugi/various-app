import Link from 'next/link'
import { useRouter } from 'next/router'
// import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import pokemonJson from '@/lib/json/pokemon_999.json';
import styles from '@/public/css/pokemon.module.css'
import { usePokeInfoHooks } from '@/hooks/pokemon/usePokeInfoHooks'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const PokeShowPage = () => {
// const PokeShowPage: NextPage = () => {
  const router = useRouter()
  const pokeId = router.query.id
	const [ typeImage, statusBarIsValue, statusBarNonValue, statusName ] = usePokeInfoHooks()

  return (
		<>
			{/* ヘッダー */}
			<div className={`bg-gray-100 flex relative pb-10 lg:pb-0 ${styles.poke_show_header}`}>
				{/* 左矢印 */}
				<div className='border-2 rounded w-[20px] h-[90px] lg:w-[30px] lg:h-[136px] bg-white border-gray-400 absolute  top-[35%] left-[10px] lg:top-[25%] lg:left-[30px] cursor-pointer flex justify-center items-center hover:bg-gray-50' onClick={() => router.push(`/pokemon/show/${Number(pokeId) - 1}`)}>
					<img className='transform rotate-[90deg]' src="/img/pokemon/arrow.svg" alt="" />
				</div>
				{/* 画像と名前 */}
				<div className="w-[80%] lg:w-[60%] gap-0 lg:gap-10 flex flex-col lg:flex-row mx-auto max-w-[1000px]">

					<div className="w-[100%] lg:w-[40%] my-0 mx-auto">
						<img className="w-full" src={pokemonJson[pokeId]?.img} alt={pokemonJson[pokeId]?.name} />
					</div>

					<div className='w-[100%] lg:w-[60%] p-0 lg:pt-10 text-center lg:text-left'>
						<div className='rounded h-[100%] lg:h-[60%] bg-white shadow-lg p-5'>
							<p className='font-bold text-lg lg:text-xl'>No.{pokemonJson[pokeId]?.no}</p>
							<p className='font-bold text-2xl lg:text-3xl'>{pokemonJson[pokeId]?.name}</p>
						</div>
					</div>
				</div>
				{/* 右矢印 */}
				<div className='border-2 rounded w-[20px] h-[90px] lg:w-[30px] lg:h-[136px] bg-white border-gray-400 absolute  top-[35%] right-[10px] lg:top-[25%] lg:right-[30px] cursor-pointer flex justify-center items-center hover:bg-gray-50' onClick={() => router.push(`/pokemon/show/${Number(pokeId) + 1}`)}>
					<img className='transform rotate-[270deg]' src="/img/pokemon/arrow.svg" alt="" />
				</div>
			</div>

			{/* メイン */}
			<div className='w-[90%] mt-10 mb-0 mx-auto max-w-[1000px]'>
				<div className='flex justify-between flex-col lg:flex-row'>
					{/* 情報 */}
					<ul className='w-[100%] lg:w-[49%] border-4 rounded px-4 py-4 lg:px-16 lg:py-10 mb-4'>
						<li className='mb-10'>
							<dl className='flex'>
								<dt className='font-bold text-xl'>分類：</dt>
								<dd className='text-xl font-medium'>{pokemonJson[pokeId]?.classification}</dd>
							</dl>
						</li>
						<li className='mb-4'>
							<dl className='flex'>
								<dt className='font-bold text-xl'>タイプ：</dt>
								<dd className='flex gap-x-3'>
									<div className='text-[10px] font-medium text-center'>
										<img className="w-[36px] my-0 mx-auto" src={typeImage(pokemonJson[pokeId]?.type1)} alt="" />
										{pokemonJson[pokeId]?.type1}
									</div>
									<div className='text-[10px] font-medium text-center'>
										<img className="w-[36px] my-0 mx-auto" src={typeImage(pokemonJson[pokeId]?.type2)} alt="" />
										{pokemonJson[pokeId]?.type2}
									</div>
								</dd>
							</dl>
						</li>
						<li className='mb-10 flex'>
							<dl className='flex mr-10'>
								<dt className='font-bold text-xl'>高さ：</dt>
								<dd className='text-xl font-medium'>{pokemonJson[pokeId]?.height / 10}m</dd>
							</dl>
							<dl className='flex'>
								<dt className='font-bold text-xl'>重さ：</dt>
								<dd className='text-xl font-medium'>{pokemonJson[pokeId]?.weight / 10}kg</dd>
							</dl>
						</li>
					</ul>

					{/* ステータス */}
					<ul className='w-[100%] lg:w-[49%] border-4 rounded py-6 px-3 lg:px-10 lg:py-10'>
						{pokemonJson[pokeId]?.status !== undefined && Object.keys(pokemonJson[pokeId]?.status)?.map((status, index) => (
							<dl key={index} className='flex mb-6'>
								<dt className='font-bold lg:text-xl w-[110px]'>{statusName(status)}</dt>
								<dd className='text-xl font-medium'>
									<ul className='flex'>
										{statusBarIsValue(pokemonJson[pokeId]?.status[status]).map((_, index) => (
											<li key={index} className='bg-amber-400 rounded-[8px] w-[10px] h-[25px] lg:w-[15px] lg:h-[35px] mr-[5px]'></li>
										))}
										{statusBarNonValue(pokemonJson[pokeId]?.status[status]) !== 0 && statusBarNonValue(pokemonJson[pokeId]?.status[status]).map((_, index) => (
											<li key={index} className='bg-gray-200 rounded-[8px] w-[10px] h-[25px] lg:w-[15px] lg:h-[35px] mr-[5px]'></li>
										))}
									</ul>
								</dd>
							</dl>
						))}
					</ul>
				</div>
				
				{/* 図鑑 */}
				<div className='border-4 rounded px-4 py-5 lg:px-16 lg:py-10 mt-4 mb-3'>
					<p className='text-s lg:text-xl font-medium'>
						{pokemonJson[pokeId]?.flavor_text}
					</p>
				</div>
			</div>
		</>
		)
}

export default PokeShowPage