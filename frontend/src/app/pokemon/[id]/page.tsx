"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import "@/css/pokemon.css";
import { usePokeInfoHooks } from "@/hooks/pokemon/usePokeInfoHooks";
import pokemonJson from "@/lib/json/pokemon_999.json";
import type { Pokemon, PokemonStatus } from "@/types/pokemon";

export default function PokemonShowPage() {
	const params = useParams();
	const router = useRouter();
	const pokeId = Number(params.id);
	const { typeImage, statusBarIsValue, statusBarNonValue, statusName } =
		usePokeInfoHooks();

	const allPokemon = useMemo(() => pokemonJson as Pokemon[], []);

	const data = useMemo(() => {
		return allPokemon.find((p) => p.no === pokeId);
	}, [allPokemon, pokeId]);

	const handleNavigate = (direction: "prev" | "next") => {
		const newId = direction === "prev" ? pokeId - 1 : pokeId + 1;
		if (newId >= 1 && newId <= allPokemon.length) {
			router.push(`/pokemon/${newId}`);
		}
	};

	if (!data) {
		return (
			<div className="text-center py-20">
				<p className="text-xl">ポケモンが見つかりませんでした</p>
			</div>
		);
	}

	const statusKeys = data.status
		? (Object.keys(data.status) as (keyof PokemonStatus)[])
		: [];

	return (
		<>
			{/* ヘッダー */}
			<div className="bg-gray-100 flex relative pb-10 lg:pb-0 pokemon-show-header">
				{/* 左矢印 */}
				<button
					type="button"
					className="pokemon-nav-button w-[20px] h-[90px] lg:w-[30px] lg:h-[136px] absolute top-[35%] left-[10px] lg:top-[25%] lg:left-[30px]"
					onClick={() => handleNavigate("prev")}
					disabled={pokeId <= 1}
				>
					<Image
						className="transform rotate-[90deg]"
						src="/img/pokemon/arrow.svg"
						alt="前へ"
						width={24}
						height={12}
					/>
				</button>

				{/* 画像と名前 */}
				<div className="w-[80%] lg:w-[60%] gap-0 lg:gap-10 flex flex-col lg:flex-row mx-auto max-w-[1000px]">
					<div className="w-full lg:w-[40%] my-0 mx-auto">
						<Image
							className="w-full h-auto"
							src={data.img}
							alt={data.name}
							width={400}
							height={400}
						/>
					</div>

					<div className="w-full lg:w-[60%] p-0 lg:pt-10 text-center lg:text-left">
						<div className="rounded h-full lg:h-[60%] bg-white shadow-lg p-5">
							<p className="font-bold text-lg lg:text-xl text-black">
								No.{data.no}
							</p>
							<p className="font-bold text-2xl lg:text-3xl text-black">
								{data.name}
							</p>
						</div>
					</div>
				</div>

				{/* 右矢印 */}
				<button
					type="button"
					className="pokemon-nav-button w-[20px] h-[90px] lg:w-[30px] lg:h-[136px] absolute top-[35%] right-[10px] lg:top-[25%] lg:right-[30px]"
					onClick={() => handleNavigate("next")}
					disabled={pokeId >= allPokemon.length}
				>
					<Image
						className="transform rotate-[270deg]"
						src="/img/pokemon/arrow.svg"
						alt="次へ"
						width={24}
						height={12}
					/>
				</button>
			</div>

			{/* メイン */}
			<div className="w-[90%] mt-10 mb-0 mx-auto max-w-[1000px]">
				<div className="flex justify-between flex-col lg:flex-row">
					{/* 情報 */}
					<ul className="w-full lg:w-[49%] border-4 rounded px-4 py-4 lg:px-16 lg:py-10 mb-4">
						<li className="mb-10">
							<dl className="flex">
								<dt className="font-bold text-xl">分類：</dt>
								<dd className="text-xl font-medium">{data.classification}</dd>
							</dl>
						</li>
						<li className="mb-4">
							<dl className="flex">
								<dt className="font-bold text-xl">タイプ：</dt>
								<dd className="flex gap-x-3">
									<div className="text-[10px] font-medium text-center">
										<Image
											className="w-[36px] my-0 mx-auto"
											src={typeImage(data.type1)}
											alt={data.type1}
											width={36}
											height={36}
										/>
										{data.type1}
									</div>
									{data.type2 && (
										<div className="text-[10px] font-medium text-center">
											<Image
												className="w-[36px] my-0 mx-auto"
												src={typeImage(data.type2)}
												alt={data.type2}
												width={36}
												height={36}
											/>
											{data.type2}
										</div>
									)}
								</dd>
							</dl>
						</li>
						<li className="mb-10 flex">
							<dl className="flex mr-10">
								<dt className="font-bold text-xl">高さ：</dt>
								<dd className="text-xl font-medium">{data.height / 10}m</dd>
							</dl>
							<dl className="flex">
								<dt className="font-bold text-xl">重さ：</dt>
								<dd className="text-xl font-medium">{data.weight / 10}kg</dd>
							</dl>
						</li>
					</ul>

					{/* ステータス */}
					<ul className="w-full lg:w-[49%] border-4 rounded py-6 px-3 lg:px-10 lg:py-10">
						{statusKeys.map((statusKey) => (
							<dl key={statusKey} className="flex mb-6">
								<dt className="font-bold lg:text-xl w-[110px]">
									{statusName(statusKey)}
								</dt>
								<dd className="text-xl font-medium">
									<ul className="flex">
										{statusBarIsValue(data.status[statusKey]).map(
											(_, index) => (
												<li
													key={`filled-${statusKey}-${index}`}
													className="bg-amber-400 rounded-[8px] w-[10px] h-[25px] lg:w-[15px] lg:h-[35px] mr-[5px]"
												/>
											),
										)}
										{statusBarNonValue(data.status[statusKey]) !== 0 &&
											(
												statusBarNonValue(data.status[statusKey]) as number[]
											).map((_, index) => (
												<li
													key={`empty-${statusKey}-${index}`}
													className="bg-gray-200 rounded-[8px] w-[10px] h-[25px] lg:w-[15px] lg:h-[35px] mr-[5px]"
												/>
											))}
									</ul>
								</dd>
							</dl>
						))}
					</ul>
				</div>

				{/* 図鑑 */}
				<div className="border-4 rounded px-4 py-5 lg:px-16 lg:py-10 mt-4 mb-3">
					<p className="text-s lg:text-xl font-medium">{data.flavor_text}</p>
				</div>
			</div>
		</>
	);
}
