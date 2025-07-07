import Link from "next/link";
import type React from "react";

/**
 * 施工事例セクションコンポーネント
 * 3-4枚の住宅写真をカード形式で表示
 */
export const WorksSection: React.FC = () => {
	const works = [
		{
			id: 1,
			title: "伝統美が息づく平屋の家",
			location: "神奈川県鎌倉市",
			description:
				"古民家の良さを現代に活かした、開放感あふれる平屋住宅。大きな開口部から差し込む自然光が、無垢材の温もりを際立たせます。",
			features: ["平屋建て", "古民家風", "大開口", "庭園付き"],
			imageUrl:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='house1' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%235D3E2A'/%3E%3Cstop offset='100%25' stop-color='%238B6F47'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23house1)'/%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Crect x='50' y='100' width='300' height='150' rx='10'/%3E%3Crect x='70' y='60' width='260' height='40' rx='5'/%3E%3Ccircle cx='200' cy='50' r='30'/%3E%3C/g%3E%3Ctext x='200' y='280' text-anchor='middle' fill='%23FFFFFF' font-size='16' font-family='serif'%3E平屋の家%3C/text%3E%3C/svg%3E",
		},
		{
			id: 2,
			title: "都市型和モダン住宅",
			location: "東京都世田谷区",
			description:
				"限られた敷地を最大限に活用した3階建て住宅。和の要素を取り入れながら、現代的な機能性も兼ね備えた住まいです。",
			features: ["3階建て", "狭小住宅", "和モダン", "屋上庭園"],
			imageUrl:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='house2' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%236B8E23'/%3E%3Cstop offset='100%25' stop-color='%239ACD32'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23house2)'/%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Crect x='100' y='50' width='200' height='200' rx='10'/%3E%3Crect x='120' y='70' width='160' height='50' rx='5'/%3E%3Crect x='120' y='130' width='160' height='50' rx='5'/%3E%3Crect x='120' y='190' width='160' height='50' rx='5'/%3E%3C/g%3E%3Ctext x='200' y='280' text-anchor='middle' fill='%23FFFFFF' font-size='16' font-family='serif'%3E都市型住宅%3C/text%3E%3C/svg%3E",
		},
		{
			id: 3,
			title: "自然素材の二世帯住宅",
			location: "埼玉県川越市",
			description:
				"二世帯がお互いのプライバシーを保ちながら、共に暮らせる住まい。自然素材の温もりが家族の絆を深めます。",
			features: ["二世帯住宅", "自然素材", "プライバシー重視", "バリアフリー"],
			imageUrl:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='house3' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23D4AF37'/%3E%3Cstop offset='100%25' stop-color='%23FFF8DC'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23house3)'/%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Crect x='50' y='80' width='150' height='170' rx='10'/%3E%3Crect x='200' y='80' width='150' height='170' rx='10'/%3E%3Crect x='170' y='60' width='60' height='20' rx='5'/%3E%3Ccircle cx='125' cy='50' r='25'/%3E%3Ccircle cx='275' cy='50' r='25'/%3E%3C/g%3E%3Ctext x='200' y='280' text-anchor='middle' fill='%23FFFFFF' font-size='16' font-family='serif'%3E二世帯住宅%3C/text%3E%3C/svg%3E",
		},
		{
			id: 4,
			title: "里山に佇む週末住宅",
			location: "長野県軽井沢町",
			description:
				"週末を自然の中で過ごすためのセカンドハウス。木々に囲まれた立地を活かし、四季の移ろいを感じられる設計です。",
			features: ["セカンドハウス", "自然立地", "大きな窓", "薪ストーブ"],
			imageUrl:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='house4' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%233D2914'/%3E%3Cstop offset='100%25' stop-color='%235D3E2A'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23house4)'/%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Cpolygon points='200,30 120,100 280,100'/%3E%3Crect x='140' y='100' width='120' height='120' rx='10'/%3E%3Ccircle cx='90' cy='80' r='15'/%3E%3Ccircle cx='310' cy='80' r='15'/%3E%3Ccircle cx='350' cy='120' r='10'/%3E%3C/g%3E%3Ctext x='200' y='280' text-anchor='middle' fill='%23FFFFFF' font-size='16' font-family='serif'%3E週末住宅%3C/text%3E%3C/svg%3E",
		},
	];

	return (
		<section id="works" className="wa-section bg-washi-white">
			<div className="wa-container">
				{/* セクションタイトル */}
				<div className="text-center mb-16">
					<h2 className="wa-heading-2 wa-text-dark-contrast mb-4 font-japanese">
						施工事例
					</h2>
					<p className="wa-text-large wa-text-contrast max-w-2xl mx-auto">
						お客様の想いを形にした、
						<br className="hidden sm:block" />
						こだわりの住まいをご紹介します。
					</p>
					<div className="wa-divider-vertical mt-8" />
				</div>

				{/* 施工事例カード */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
					{works.map((work, index) => (
						<div key={work.id} className="wa-card">
							{/* 画像 */}
							<div className="relative mb-6">
								<img
									src={work.imageUrl}
									alt={work.title}
									className="wa-card-image"
								/>
								<div className="absolute top-4 right-4 bg-tatami-green text-washi-white px-3 py-1 rounded-full text-sm font-japanese">
									{work.location}
								</div>
							</div>

							{/* タイトル */}
							<h3 className="wa-heading-3 mb-3 font-japanese">{work.title}</h3>

							{/* 説明 */}
							<p className="wa-text-body mb-4">{work.description}</p>

							{/* 特徴タグ */}
							<div className="flex flex-wrap gap-2 mb-4">
								{work.features.map((feature) => (
									<span
										key={feature}
										className="bg-wood-light text-washi-white px-3 py-1 rounded-full text-sm font-japanese"
									>
										{feature}
									</span>
								))}
							</div>

							{/* 詳細ボタン */}
							<Link
								href={`/hp/sample/1/works/${work.id}`}
								className="wa-btn-secondary w-full font-japanese text-center block"
							>
								詳細を見る
							</Link>
						</div>
					))}
				</div>

				{/* 全事例を見るボタン */}
				<div className="text-center">
					<Link
						href="/hp/sample/1/works"
						className="wa-btn-primary px-8 py-3 font-japanese"
					>
						全ての施工事例を見る
					</Link>
				</div>
			</div>
		</section>
	);
};
