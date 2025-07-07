import type React from "react";

/**
 * 会社の特徴セクションコンポーネント
 * 「自然素材へのこだわり」「職人の技」「地域密着」の3つの特徴を紹介
 */
export const FeaturesSection: React.FC = () => {
	const features = [
		{
			id: 1,
			title: "自然素材へのこだわり",
			description:
				"無垢の木材、漆喰、珪藻土など、厳選された自然素材のみを使用。シックハウス症候群の心配がなく、家族の健康を第一に考えた住まいを提供します。",
			icon: "🌿",
			details: [
				"国産無垢材を使用した構造材",
				"調湿効果のある漆喰壁",
				"天然素材の断熱材",
				"化学物質を一切使わない仕上げ",
			],
		},
		{
			id: 2,
			title: "職人の技",
			description:
				"代々受け継がれた伝統的な技術と現代の建築技術を融合。熟練の職人が一軒一軒丁寧に仕上げ、永く愛される住まいを創り上げます。",
			icon: "🔨",
			details: [
				"宮大工の技術を活かした継手仕口",
				"伝統的な土壁工法",
				"手作業による仕上げ",
				"定期的な技術継承研修",
			],
		},
		{
			id: 3,
			title: "地域密着",
			description:
				"地域の気候風土を知り尽くした設計と施工。アフターメンテナンスも責任を持って対応し、お客様との長いお付き合いを大切にします。",
			icon: "🏠",
			details: [
				"地域の気候に適した設計",
				"近隣の優良な協力業者との連携",
				"迅速なアフターサービス",
				"地域コミュニティとの連携",
			],
		},
	];

	return (
		<section id="features" className="wa-section bg-washi-texture">
			<div className="wa-container">
				{/* セクションタイトル */}
				<div className="text-center mb-16">
					<h2 className="wa-heading-2 wa-text-dark-contrast mb-4 font-japanese">
						和心建築の特徴
					</h2>
					<p className="wa-text-large wa-text-contrast max-w-2xl mx-auto">
						私たちは3つの柱を大切にし、
						<br className="hidden sm:block" />
						お客様に最高品質の住まいを提供します。
					</p>
					<div className="wa-divider-vertical mt-8" />
				</div>

				{/* 特徴カード */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
					{features.map((feature, index) => (
						<div key={feature.id} className="wa-card text-center">
							{/* アイコン */}
							<div className="text-6xl mb-6">{feature.icon}</div>

							{/* タイトル */}
							<h3 className="wa-heading-3 mb-4 font-japanese">
								{feature.title}
							</h3>

							{/* 説明文 */}
							<p className="wa-text-body mb-6 text-left">
								{feature.description}
							</p>

							{/* 詳細リスト */}
							<ul className="text-left space-y-2">
								{feature.details.map((detail) => (
									<li key={detail} className="wa-text-body">
										<span className="text-tatami-green mr-2">✓</span>
										{detail}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* 品質保証の説明 */}
				<div className="bg-wood-texture text-center py-12 px-8 rounded-xl relative">
					{/* 背景オーバーレイ */}
					<div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl" />
					<div className="relative z-10">
						<h3 className="wa-heading-3 wa-text-light-contrast mb-4 font-japanese">
							品質保証
						</h3>
						<p className="wa-text-large wa-text-light-contrast mb-6 max-w-3xl mx-auto">
							構造躯体20年保証、設備機器10年保証を基本とし、
							<br className="hidden sm:block" />
							定期点検とメンテナンスで住まいを長期間サポートします。
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<div className="bg-washi-white bg-opacity-20 border border-washi-white border-opacity-50 px-6 py-3 rounded-lg backdrop-blur-sm">
								<span className="wa-text-light-contrast font-bold text-lg">
									構造躯体
								</span>
								<span className="wa-text-light-contrast block text-sm">
									20年保証
								</span>
							</div>
							<div className="bg-washi-white bg-opacity-20 border border-washi-white border-opacity-50 px-6 py-3 rounded-lg backdrop-blur-sm">
								<span className="wa-text-light-contrast font-bold text-lg">
									設備機器
								</span>
								<span className="wa-text-light-contrast block text-sm">
									10年保証
								</span>
							</div>
							<div className="bg-washi-white bg-opacity-20 border border-washi-white border-opacity-50 px-6 py-3 rounded-lg backdrop-blur-sm">
								<span className="wa-text-light-contrast font-bold text-lg">
									定期点検
								</span>
								<span className="wa-text-light-contrast block text-sm">
									年2回実施
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
