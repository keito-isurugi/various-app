export interface PokemonStatus {
	hp: number;
	attack: number;
	defense: number;
	special_attack: number;
	special_defense: number;
	speed: number;
}

export interface Pokemon {
	no: number;
	name: string;
	img: string;
	type1: string;
	type2: string;
	classification: string;
	height: number;
	weight: number;
	flavor_text: string;
	status: PokemonStatus;
	generation: number;
}
