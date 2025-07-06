export interface CelestialBody {
	id: string;
	name: string;
	nameJa: string;
	mass: number; // kg
	radius?: number; // m (半径)
	category: "solar_system" | "star";
	description?: string;
}

export const celestialBodies: CelestialBody[] = [
	// 太陽系の天体
	{
		id: "sun",
		name: "Sun",
		nameJa: "太陽",
		mass: 1.989e30,
		radius: 6.96e8,
		category: "solar_system",
		description: "太陽系の中心星",
	},
	{
		id: "mercury",
		name: "Mercury",
		nameJa: "水星",
		mass: 3.3011e23,
		radius: 2.4397e6,
		category: "solar_system",
		description: "太陽系で最も小さい惑星",
	},
	{
		id: "venus",
		name: "Venus",
		nameJa: "金星",
		mass: 4.8675e24,
		radius: 6.0518e6,
		category: "solar_system",
		description: "太陽系で最も高温の惑星",
	},
	{
		id: "earth",
		name: "Earth",
		nameJa: "地球",
		mass: 5.972e24,
		radius: 6.371e6,
		category: "solar_system",
		description: "私たちの故郷",
	},
	{
		id: "mars",
		name: "Mars",
		nameJa: "火星",
		mass: 6.4171e23,
		radius: 3.3972e6,
		category: "solar_system",
		description: "赤い惑星",
	},
	{
		id: "jupiter",
		name: "Jupiter",
		nameJa: "木星",
		mass: 1.8982e27,
		radius: 6.9911e7,
		category: "solar_system",
		description: "太陽系最大の惑星",
	},
	{
		id: "saturn",
		name: "Saturn",
		nameJa: "土星",
		mass: 5.6834e26,
		radius: 5.8232e7,
		category: "solar_system",
		description: "美しい環を持つ惑星",
	},
	{
		id: "uranus",
		name: "Uranus",
		nameJa: "天王星",
		mass: 8.681e25,
		radius: 2.5362e7,
		category: "solar_system",
		description: "横倒しに回転する惑星",
	},
	{
		id: "neptune",
		name: "Neptune",
		nameJa: "海王星",
		mass: 1.02413e26,
		radius: 2.4622e7,
		category: "solar_system",
		description: "太陽系最外の惑星",
	},
	{
		id: "moon",
		name: "Moon",
		nameJa: "月",
		mass: 7.342e22,
		radius: 1.737e6,
		category: "solar_system",
		description: "地球の衛星",
	},
	// 有名な星
	{
		id: "sirius",
		name: "Sirius",
		nameJa: "シリウス",
		mass: 4.02e30,
		category: "star",
		description: "夜空で最も明るい恒星",
	},
	{
		id: "canopus",
		name: "Canopus",
		nameJa: "カノープス",
		mass: 1.59e31,
		category: "star",
		description: "りゅうこつ座の超巨星",
	},
	{
		id: "arcturus",
		name: "Arcturus",
		nameJa: "アークトゥルス",
		mass: 2.2e30,
		category: "star",
		description: "うしかい座の赤色巨星",
	},
	{
		id: "vega",
		name: "Vega",
		nameJa: "ベガ",
		mass: 4.25e30,
		category: "star",
		description: "こと座の主星",
	},
	{
		id: "capella",
		name: "Capella",
		nameJa: "カペラ",
		mass: 4.95e30,
		category: "star",
		description: "ぎょしゃ座の主星",
	},
	{
		id: "rigel",
		name: "Rigel",
		nameJa: "リゲル",
		mass: 4.78e31,
		category: "star",
		description: "オリオン座の青色超巨星",
	},
	{
		id: "procyon",
		name: "Procyon",
		nameJa: "プロキオン",
		mass: 3.0e30,
		category: "star",
		description: "こいぬ座の主星",
	},
	{
		id: "betelgeuse",
		name: "Betelgeuse",
		nameJa: "ベテルギウス",
		mass: 3.58e31,
		category: "star",
		description: "オリオン座の赤色超巨星",
	},
	{
		id: "altair",
		name: "Altair",
		nameJa: "アルタイル",
		mass: 3.58e30,
		category: "star",
		description: "わし座の主星",
	},
	{
		id: "aldebaran",
		name: "Aldebaran",
		nameJa: "アルデバラン",
		mass: 3.38e30,
		category: "star",
		description: "おうし座の赤色巨星",
	},
	{
		id: "spica",
		name: "Spica",
		nameJa: "スピカ",
		mass: 2.11e31,
		category: "star",
		description: "おとめ座の青色巨星",
	},
	{
		id: "antares",
		name: "Antares",
		nameJa: "アンタレス",
		mass: 2.39e31,
		category: "star",
		description: "さそり座の赤色超巨星",
	},
	{
		id: "pollux",
		name: "Pollux",
		nameJa: "ポルックス",
		mass: 3.58e30,
		category: "star",
		description: "ふたご座の巨星",
	},
	{
		id: "fomalhaut",
		name: "Fomalhaut",
		nameJa: "フォーマルハウト",
		mass: 3.84e30,
		category: "star",
		description: "みなみのうお座の主星",
	},
	{
		id: "deneb",
		name: "Deneb",
		nameJa: "デネブ",
		mass: 3.78e31,
		category: "star",
		description: "はくちょう座の青色超巨星",
	},
];

export const getCelestialBodyById = (id: string): CelestialBody | undefined => {
	return celestialBodies.find((body) => body.id === id);
};

export const getCelestialBodiesByCategory = (
	category: "solar_system" | "star",
): CelestialBody[] => {
	return celestialBodies.filter((body) => body.category === category);
};
