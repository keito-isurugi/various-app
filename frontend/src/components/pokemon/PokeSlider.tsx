"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useEffect, useMemo, useState } from "react";
import "@splidejs/react-splide/css/sea-green";
import { usePokeInfoHooks } from "@/hooks/pokemon/usePokeInfoHooks";
import pokemonJson from "@/lib/json/pokemon_999.json";
import type { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import BallSpinner from "./BallSpinner";

const PokeSlider = () => {
	const { typeImage } = usePokeInfoHooks();

	const POKE_PICKUPS = [
		[25, 133, 39],
		[144, 145, 146],
		[133, 134, 135, 136],
	];

	const [datas, setDatas] = useState<Pokemon[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const allPokemon = useMemo(() => pokemonJson as Pokemon[], []);

	useEffect(() => {
		const random = Math.floor(Math.random() * POKE_PICKUPS.length);
		const pickupNums = POKE_PICKUPS[random];
		const pickups = allPokemon.filter((p) => pickupNums.includes(p.no));
		setDatas(pickups);
		setIsLoading(false);
	}, [allPokemon]);

	return (
		<div className="pokemon-pickup-cover">
			<section className="pokemon-pickup-wrap">
				<div className="pokemon-pickup-bg" />
				<h2 className="pokemon-pickup-title">
					<Image
						src="/img/pokemon/pickup.svg"
						alt="ピックアップ"
						width={238}
						height={60}
					/>
				</h2>
				{isLoading ? (
					<BallSpinner />
				) : (
					<Splide
						options={{
							width: "100%",
							autoplay: true,
							interval: 5000,
							speed: 2000,
							type: "loop",
						}}
						className="pokemon-slider"
					>
						{datas.map((data, index) => (
							<SplideSlide key={data.no}>
								<div className="flex justify-center items-center mx-auto my-0">
									<figure>
										<Image
											width={340}
											height={340}
											src={data.img}
											alt={data.name}
										/>
									</figure>
									<div>
										<h3 className="font-bold text-3xl text-black">
											<small className="block text-xl text-black">
												No.{data.no}
											</small>
											{data.name}
										</h3>
										<div className="pokemon-pickup-content-img">
											<div className="pokemon-pickup-content-label text-black">
												<Image
													src={typeImage(data.type1)}
													alt={data.type1}
													width={40}
													height={40}
													className="pokemon-pickup-content-label-img"
												/>
												{data.type1}
											</div>
											{data.type2 && (
												<div className="pokemon-pickup-content-label text-black">
													<Image
														src={typeImage(data.type2)}
														alt={data.type2}
														width={40}
														height={40}
														className="pokemon-pickup-content-label-img"
													/>
													{data.type2}
												</div>
											)}
										</div>
									</div>
								</div>
							</SplideSlide>
						))}
					</Splide>
				)}
			</section>
		</div>
	);
};

export default PokeSlider;
