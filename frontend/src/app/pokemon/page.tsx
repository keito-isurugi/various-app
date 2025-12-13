"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/pokemon.css";
import BallSpinner from "@/components/pokemon/BallSpinner";
import PokeSlider from "@/components/pokemon/PokeSlider";
import { usePokeInfoHooks } from "@/hooks/pokemon/usePokeInfoHooks";
import pokemonJson from "@/lib/json/pokemon_999.json";
import type { Pokemon } from "@/types/pokemon";

const NUM_PER_PAGE = 64; // 1ページあたりの取得数

export default function PokemonPage() {
	const { generationName } = usePokeInfoHooks();
	const [generation, setGeneration] = useState(999);
	const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const loaderRef = useRef<HTMLDivElement>(null);

	const allPokemon = useMemo(() => pokemonJson as Pokemon[], []);

	const filteredPokemon = useMemo(() => {
		if (generation === 999) {
			return allPokemon;
		}
		return allPokemon.filter((data) => data.generation === generation);
	}, [allPokemon, generation]);

	// 初期データの読み込みとフィルター変更時のリセット
	useEffect(() => {
		setIsLoading(true);
		const initialData = filteredPokemon.slice(0, NUM_PER_PAGE);
		setDisplayedPokemon(initialData);
		setHasMore(filteredPokemon.length > NUM_PER_PAGE);
		setIsLoading(false);
	}, [filteredPokemon]);

	// 追加データを読み込む
	const loadMore = useCallback(() => {
		if (!hasMore || isLoading) return;

		const currentLength = displayedPokemon.length;
		const nextData = filteredPokemon.slice(
			currentLength,
			currentLength + NUM_PER_PAGE,
		);

		if (nextData.length > 0) {
			setDisplayedPokemon((prev) => [...prev, ...nextData]);
			setHasMore(currentLength + nextData.length < filteredPokemon.length);
		} else {
			setHasMore(false);
		}
	}, [displayedPokemon.length, filteredPokemon, hasMore, isLoading]);

	// Intersection Observerで無限スクロールを実装
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					loadMore();
				}
			},
			{ threshold: 0.1 },
		);

		const currentLoader = loaderRef.current;
		if (currentLoader) {
			observer.observe(currentLoader);
		}

		return () => {
			if (currentLoader) {
				observer.unobserve(currentLoader);
			}
		};
	}, [loadMore, hasMore, isLoading]);

	const handleGenerationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setGeneration(Number(e.target.value));
	};

	return (
		<>
			<PokeSlider />
			<div className="px-1 md:px-5 lg:px-5">
				<div className="mt-3 mb-3 flex gap-1 lg:gap-6 justify-between">
					<p className="font-bold text-xm lg:text-3xl">ポケモン図鑑</p>
					<select
						id="generation"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 font-bold max-h-[50px]"
						onChange={handleGenerationChange}
						value={generation}
					>
						<option value={999}>全世代</option>
						{[...Array(9)].map((_, i) => (
							<option key={i + 1} value={i + 1}>
								{generationName(i + 1)}
							</option>
						))}
					</select>
				</div>

				{isLoading ? (
					<BallSpinner />
				) : (
					<>
						<div className="pokemon-grid">
							{displayedPokemon.map((data) => (
								<Link
									href={`/pokemon/${data.no}`}
									key={data.no}
									className="rounded shadow-lg cursor-pointer pokemon-card block"
								>
									<div className="w-full mx-auto bg-gray-300">
										<Image
											src={data.img}
											alt={data.name}
											width={200}
											height={200}
											className="w-full h-auto"
										/>
									</div>
									<div className="px-1 py-1 lg:px-2 lg:py-2">
										<p className="font-bold text-xs lg:text-xl">{data.name}</p>
									</div>
								</Link>
							))}
						</div>
						{/* ローダー（無限スクロール用のトリガー） */}
						<div ref={loaderRef}>{hasMore && <BallSpinner />}</div>
					</>
				)}
			</div>
		</>
	);
}
