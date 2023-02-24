export const usePokeInfoHooks = () => {

		const generationName = (num: any) => {
		switch (num) {
			case 1:
				return "赤・緑・青"
			case 2:
				return "金・銀"
			case 3:
				return "ルビー・サファイア"
			case 4:
				return "ダイヤモンド・パール"
			case 5:
				return "ブラック・ホワイト"
			case 6:
				return "X・Y"
			case 7:
				return "Uサン・Uムーン"
			case 8:
				return "ソード・シールド"
			case 9:
				return "スカーレット・ヴァイオレット"
			case 999:
				return "全世代"
			default:
				return "全世代"
		}
	}

	const typeImage = (type: any): any => {
		switch (type) {
			case "ノーマル":
				return "/img/pokemon/icon_type_1.svg"
			case "ほのお":
				return "/img/pokemon/icon_type_2.svg"
			case "みず":
				return "/img/pokemon/icon_type_3.svg"
			case "くさ":
				return "/img/pokemon/icon_type_4.svg"
			case "でんき":
				return "/img/pokemon/icon_type_5.svg"
			case "こおり":
				return "/img/pokemon/icon_type_6.svg"
			case "かくとう":
				return "/img/pokemon/icon_type_7.svg"
			case "どく":
				return "/img/pokemon/icon_type_8.svg"
			case "じめん":
				return "/img/pokemon/icon_type_9.svg"
			case "ひこう":
				return "/img/pokemon/icon_type_10.svg"
			case "エスパー":
				return "/img/pokemon/icon_type_11.svg"
			case "むし":
				return "/img/pokemon/icon_type_12.svg"
			case "いわ":
				return "/img/pokemon/icon_type_13.svg"
			case "ゴースト":
				return "/img/pokemon/icon_type_14.svg"
			case "ドラゴン":
				return "/img/pokemon/icon_type_15.svg"
			case "あく":
				return "/img/pokemon/icon_type_16.svg"
			case "はがね":
				return "/img/pokemon/icon_type_17.svg"
			case "フェアリー":
				return "/img/pokemon/icon_type_18.svg"
		}
	}

	const statusName = (key: any): any => {
		switch (key) {
			case "hp":
				return "HP"
		case "attack":
				return "こうげき"
			case "defense":
				return "ぼうぎょ"
			case "special_attack":
				return "とくこう"
			case "special_defense":
				return "とくぼう"
			case "speed":
				return "すばやさ"
		}
	}

	const statusBarIsValue = (status: any = 15): any => {
		let statusRatio = Math.round(status / 15) !== 0 ? Math.round(status / 15) : 1
		if(statusRatio >= 15) {
			return Array.from(Array(15).keys(), x => x)
		} else {
			return Array.from(Array(statusRatio).keys(), x => x)
		}
	}	

	const statusBarNonValue = (status: any = 15): any => {
		console.log(status)
		let statusRatio = Math.round(status / 15) !== 0 ? 15 - Math.round(status / 15) : 14
		console.log(statusRatio)
		if(statusRatio <= 0) {
			return 0
		} else {
			return Array.from(Array(statusRatio).keys(), x => x)
		}
	}

	return {
		generationName, typeImage, statusBarIsValue, statusBarNonValue, statusName
	}
	
}

