/**
 * 質量の大きさを身近な例で比較表示するためのユーティリティ
 */

interface MassComparison {
	description: string;
	emphasis?: boolean;
}

/**
 * 質量を身近な例で比較表示
 * @param mass 質量（kg）
 * @returns わかりやすい比較表現
 */
export function getMassComparison(mass: number): MassComparison {
	// 人間（約70kg）
	if (mass < 1e3) {
		const humanCount = Math.round(mass / 70);
		return {
			description: `人間約${humanCount}人分`,
		};
	}

	// 自動車（約1.5トン）
	if (mass < 1e6) {
		const carCount = Math.round(mass / 1500);
		return {
			description: `自動車約${carCount.toLocaleString()}台分`,
		};
	}

	// 東京タワー（約4,000トン）
	if (mass < 1e9) {
		const towerCount = Math.round(mass / 4e6);
		return {
			description: `東京タワー約${towerCount.toLocaleString()}基分`,
		};
	}

	// 富士山（約1兆トン）
	if (mass < 1e18) {
		const fujiCount = (mass / 1e15).toFixed(1);
		return {
			description: `富士山約${fujiCount}個分`,
		};
	}

	// 月（約7.3×10²²kg）よりも軽い場合
	if (mass < 7.342e22) {
		const fujiCount = (mass / 1e15).toFixed(1);
		return {
			description: `富士山約${fujiCount}個分`,
		};
	}

	// 地球（約6×10²⁴kg）よりも軽い場合
	if (mass < 5.972e24) {
		const moonCount = (mass / 7.342e22).toFixed(1);
		return {
			description: `月約${moonCount}個分`,
			emphasis: true,
		};
	}

	// 太陽（約2×10³⁰kg）よりも軽い場合
	if (mass < 1.989e30) {
		const earthCount = (mass / 5.972e24).toFixed(1);
		return {
			description: `地球約${earthCount}個分`,
			emphasis: true,
		};
	}

	// 太陽以上の場合
	const sunCount = (mass / 1.989e30).toFixed(1);
	return {
		description: `太陽約${sunCount}個分`,
		emphasis: true,
	};
}

/**
 * 質量を読みやすい形式でフォーマット
 * @param mass 質量（kg）
 * @returns フォーマットされた文字列
 */
export function formatMass(mass: number): string {
	if (mass < 1e3) {
		return `${mass.toLocaleString()} kg`;
	}

	if (mass < 1e6) {
		return `${(mass / 1e3).toLocaleString()} トン`;
	}

	if (mass < 1e9) {
		return `${(mass / 1e6).toLocaleString()} 千トン`;
	}

	if (mass < 1e12) {
		return `${(mass / 1e9).toLocaleString()} 百万トン`;
	}

	if (mass < 1e15) {
		return `${(mass / 1e12).toLocaleString()} 十億トン`;
	}

	if (mass < 1e18) {
		return `${(mass / 1e15).toLocaleString()} 兆トン`;
	}

	if (mass < 1e21) {
		return `${(mass / 1e18).toLocaleString()} 千兆トン`;
	}

	if (mass < 1e24) {
		return `${(mass / 1e21).toLocaleString()} 百京トン`;
	}

	if (mass < 1e27) {
		return `${(mass / 1e24).toLocaleString()} 垓トン`;
	}

	if (mass < 1e30) {
		return `${(mass / 1e27).toLocaleString()} 千垓トン`;
	}

	return `${mass.toExponential(2)} kg`;
}
