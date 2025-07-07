/**
 * 施工事例データの型定義とモックデータ
 */

export interface WorkProject {
	id: string;
	title: string;
	location: string;
	category: string;
	buildingType: string;
	completionDate: string;
	floorArea: string;
	budget: string;
	description: string;
	features: string[];
	materials: string[];
	images: WorkImage[];
	client: ClientInfo;
	specifications: ProjectSpecs;
}

export interface WorkImage {
	id: string;
	url: string;
	caption: string;
	type: "exterior" | "interior" | "garden" | "detail";
}

export interface ClientInfo {
	familyStructure: string;
	requests: string[];
	challenges: string[];
}

export interface ProjectSpecs {
	structure: string;
	floors: string;
	rooms: string;
	parking: string;
	garden: boolean;
}

// モックデータ
export const worksData: WorkProject[] = [
	{
		id: "1",
		title: "伝統美が息づく平屋の家",
		location: "神奈川県鎌倉市",
		category: "平屋住宅",
		buildingType: "注文住宅",
		completionDate: "2024年3月",
		floorArea: "120㎡",
		budget: "3,500万円",
		description:
			"古民家の良さを現代に活かした、開放感あふれる平屋住宅。大きな開口部から差し込む自然光が、無垢材の温もりを際立たせます。伝統的な日本建築の美しさと現代の住み心地を両立させた理想の住まいです。",
		features: ["平屋建て", "古民家風", "大開口", "庭園付き", "無垢材使用"],
		materials: ["国産ヒノキ", "漆喰壁", "瓦屋根", "畳", "珪藻土"],
		images: [
			{
				id: "1-1",
				url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='house1' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%235D3E2A'/%3E%3Cstop offset='100%25' stop-color='%238B6F47'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23house1)'/%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Crect x='100' y='200' width='600' height='300' rx='20'/%3E%3Crect x='140' y='120' width='520' height='80' rx='10'/%3E%3Ccircle cx='400' cy='100' r='60'/%3E%3C/g%3E%3Ctext x='400' y='550' text-anchor='middle' fill='%23FFFFFF' font-size='24' font-family='serif'%3E平屋の家 - 外観%3C/text%3E%3C/svg%3E",
				caption: "緑豊かな庭園に囲まれた平屋の外観",
				type: "exterior",
			},
			{
				id: "1-2",
				url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='interior1' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23F5F2EB'/%3E%3Cstop offset='100%25' stop-color='%23E8E0D0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23interior1)'/%3E%3Cg fill='%235D3E2A' fill-opacity='0.8'%3E%3Crect x='50' y='450' width='700' height='20'/%3E%3Crect x='100' y='100' width='600' height='300' rx='10' fill='none' stroke='%235D3E2A' stroke-width='3'/%3E%3Crect x='150' y='150' width='200' height='150' fill='%23FAF9F6'/%3E%3Crect x='450' y='150' width='200' height='150' fill='%23FAF9F6'/%3E%3C/g%3E%3Ctext x='400' y='550' text-anchor='middle' fill='%235D3E2A' font-size='24' font-family='serif'%3E リビング - 無垢材の温もり%3C/text%3E%3C/svg%3E",
				caption: "無垢材の床と漆喰壁が調和するリビング",
				type: "interior",
			},
		],
		client: {
			familyStructure: "ご夫婦 + お子様2人",
			requests: [
				"平屋で老後も安心",
				"自然素材を使いたい",
				"庭でガーデニングを楽しみたい",
			],
			challenges: [
				"限られた敷地の有効活用",
				"プライバシーの確保",
				"収納の充実",
			],
		},
		specifications: {
			structure: "木造軸組工法",
			floors: "平屋建て",
			rooms: "4LDK",
			parking: "2台",
			garden: true,
		},
	},
	{
		id: "2",
		title: "都市型和モダン住宅",
		location: "東京都世田谷区",
		category: "都市型住宅",
		buildingType: "注文住宅",
		completionDate: "2024年1月",
		floorArea: "95㎡",
		budget: "4,200万円",
		description:
			"限られた敷地を最大限に活用した3階建て住宅。和の要素を取り入れながら、現代的な機能性も兼ね備えた住まいです。縦の空間を活かした設計で、都市部でも開放感を感じられる工夫を施しました。",
		features: ["3階建て", "狭小住宅", "和モダン", "屋上庭園", "スキップフロア"],
		materials: [
			"集成材",
			"ガルバリウム鋼板",
			"竹フローリング",
			"和紙クロス",
			"御影石",
		],
		images: [
			{
				id: "2-1",
				url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='house2' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%236B8E23'/%3E%3Cstop offset='100%25' stop-color='%239ACD32'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23house2)'/%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Crect x='200' y='100' width='400' height='400' rx='20'/%3E%3Crect x='240' y='140' width='320' height='100' rx='10'/%3E%3Crect x='240' y='260' width='320' height='100' rx='10'/%3E%3Crect x='240' y='380' width='320' height='100' rx='10'/%3E%3C/g%3E%3Ctext x='400' y='550' text-anchor='middle' fill='%23FFFFFF' font-size='24' font-family='serif'%3E都市型住宅 - 外観%3C/text%3E%3C/svg%3E",
				caption: "3階建ての洗練された外観デザイン",
				type: "exterior",
			},
		],
		client: {
			familyStructure: "ご夫婦 + お子様1人",
			requests: [
				"都心で庭のある暮らし",
				"和の雰囲気を大切に",
				"将来の二世帯同居も考慮",
			],
			challenges: ["狭小地での機能確保", "近隣への配慮", "採光の工夫"],
		},
		specifications: {
			structure: "木造3階建て",
			floors: "3階建て",
			rooms: "3LDK + 屋上",
			parking: "1台",
			garden: true,
		},
	},
	{
		id: "3",
		title: "自然素材の二世帯住宅",
		location: "埼玉県川越市",
		category: "二世帯住宅",
		buildingType: "注文住宅",
		completionDate: "2023年11月",
		floorArea: "180㎡",
		budget: "5,800万円",
		description:
			"二世帯がお互いのプライバシーを保ちながら、共に暮らせる住まい。自然素材の温もりが家族の絆を深めます。完全分離型でありながら、共有スペースでの交流も楽しめる設計です。",
		features: [
			"二世帯住宅",
			"自然素材",
			"プライバシー重視",
			"バリアフリー",
			"共有スペース",
		],
		materials: ["国産杉", "珪藻土", "天然石", "無垢材", "漆喰"],
		images: [
			{
				id: "3-1",
				url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='house3' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23D4AF37'/%3E%3Cstop offset='100%25' stop-color='%23FFF8DC'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23house3)'/%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Crect x='100' y='160' width='300' height='340' rx='20'/%3E%3Crect x='400' y='160' width='300' height='340' rx='20'/%3E%3Crect x='340' y='120' width='120' height='40' rx='10'/%3E%3Ccircle cx='250' cy='100' r='50'/%3E%3Ccircle cx='550' cy='100' r='50'/%3E%3C/g%3E%3Ctext x='400' y='550' text-anchor='middle' fill='%23FFFFFF' font-size='24' font-family='serif'%3E二世帯住宅 - 外観%3C/text%3E%3C/svg%3E",
				caption: "二世帯が調和する外観デザイン",
				type: "exterior",
			},
		],
		client: {
			familyStructure: "親世帯 + 子世帯（4人家族）",
			requests: [
				"お互いの生活リズムを尊重",
				"孫との交流スペース",
				"将来の介護も考慮",
			],
			challenges: [
				"完全分離とコミュニケーションの両立",
				"建築コストの調整",
				"敷地の有効活用",
			],
		},
		specifications: {
			structure: "木造2階建て",
			floors: "2階建て",
			rooms: "6LDK（3LDK × 2世帯）",
			parking: "3台",
			garden: true,
		},
	},
	{
		id: "4",
		title: "里山に佇む週末住宅",
		location: "長野県軽井沢町",
		category: "別荘",
		buildingType: "セカンドハウス",
		completionDate: "2023年8月",
		floorArea: "85㎡",
		budget: "3,200万円",
		description:
			"週末を自然の中で過ごすためのセカンドハウス。木々に囲まれた立地を活かし、四季の移ろいを感じられる設計です。薪ストーブのある暮らしで、都市では味わえない豊かな時間を演出します。",
		features: [
			"セカンドハウス",
			"自然立地",
			"大きな窓",
			"薪ストーブ",
			"ウッドデッキ",
		],
		materials: ["カラマツ", "天然石", "ガラス", "鉄", "天然木"],
		images: [
			{
				id: "4-1",
				url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='house4' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%233D2914'/%3E%3Cstop offset='100%25' stop-color='%235D3E2A'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23house4)'/%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Cpolygon points='400,60 240,200 560,200'/%3E%3Crect x='280' y='200' width='240' height='240' rx='20'/%3E%3Ccircle cx='180' cy='160' r='30'/%3E%3Ccircle cx='620' cy='160' r='30'/%3E%3Ccircle cx='700' cy='240' r='20'/%3E%3C/g%3E%3Ctext x='400' y='550' text-anchor='middle' fill='%23FFFFFF' font-size='24' font-family='serif'%3E週末住宅 - 外観%3C/text%3E%3C/svg%3E",
				caption: "森に囲まれた週末住宅",
				type: "exterior",
			},
		],
		client: {
			familyStructure: "ご夫婦",
			requests: [
				"自然を満喫できる住まい",
				"薪ストーブのある生活",
				"メンテナンスしやすい構造",
			],
			challenges: ["冬季の寒さ対策", "湿気対策", "管理のしやすさ"],
		},
		specifications: {
			structure: "木造平屋建て",
			floors: "平屋建て",
			rooms: "2LDK",
			parking: "2台",
			garden: false,
		},
	},
];

// カテゴリー別フィルタリング用
export const workCategories = [
	"すべて",
	"平屋住宅",
	"都市型住宅",
	"二世帯住宅",
	"別荘",
] as const;

export type WorkCategory = (typeof workCategories)[number];

// 施工事例を取得する関数
export const getWorkById = (id: string): WorkProject | undefined => {
	return worksData.find((work) => work.id === id);
};

// カテゴリーでフィルタリングする関数
export const getWorksByCategory = (category: WorkCategory): WorkProject[] => {
	if (category === "すべて") {
		return worksData;
	}
	return worksData.filter((work) => work.category === category);
};
