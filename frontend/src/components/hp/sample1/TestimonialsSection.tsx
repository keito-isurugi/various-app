import type React from "react";

/**
 * お客様の声セクションコンポーネント
 * 写真付きのtestimonialを表示
 */
export const TestimonialsSection: React.FC = () => {
	const testimonials = [
		{
			id: 1,
			name: "田中 健一様",
			location: "神奈川県鎌倉市",
			age: "40代",
			houseType: "平屋住宅",
			comment:
				"自然素材の温もりが毎日の疲れを癒してくれます。特に無垢の床の心地よさは想像以上でした。職人さんの丁寧な仕事ぶりにも感動し、安心してお任せできました。",
			rating: 5,
			imageUrl:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%235D3E2A'/%3E%3Ccircle cx='40' cy='40' r='3' fill='%23FFFFFF'/%3E%3Ccircle cx='60' cy='40' r='3' fill='%23FFFFFF'/%3E%3Cpath d='M35 60 Q50 75 65 60' stroke='%23FFFFFF' stroke-width='2' fill='none'/%3E%3C/svg%3E",
		},
		{
			id: 2,
			name: "佐藤 美和子様",
			location: "東京都世田谷区",
			age: "30代",
			houseType: "二世帯住宅",
			comment:
				"二世帯住宅でプライバシーを保ちながらも、家族の絆を深められる設計に大満足です。漆喰の壁は調湿効果があり、一年中快適に過ごせています。",
			rating: 5,
			imageUrl:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%236B8E23'/%3E%3Ccircle cx='40' cy='40' r='3' fill='%23FFFFFF'/%3E%3Ccircle cx='60' cy='40' r='3' fill='%23FFFFFF'/%3E%3Cpath d='M35 60 Q50 75 65 60' stroke='%23FFFFFF' stroke-width='2' fill='none'/%3E%3C/svg%3E",
		},
		{
			id: 3,
			name: "山田 雄一様",
			location: "埼玉県川越市",
			age: "50代",
			houseType: "和モダン住宅",
			comment:
				"アフターサービスの充実ぶりに感謝しています。定期点検では細かなところまでチェックしていただき、安心して住み続けられています。建てて3年経ちますが、木の香りがまだ残っているのも嬉しいです。",
			rating: 5,
			imageUrl:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23D4AF37'/%3E%3Ccircle cx='40' cy='40' r='3' fill='%23FFFFFF'/%3E%3Ccircle cx='60' cy='40' r='3' fill='%23FFFFFF'/%3E%3Cpath d='M35 60 Q50 75 65 60' stroke='%23FFFFFF' stroke-width='2' fill='none'/%3E%3C/svg%3E",
		},
	];

	const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
		const stars = [1, 2, 3, 4, 5];
		return (
			<div className="flex space-x-1">
				{stars.map((starNumber) => (
					<span
						key={`star-${starNumber}`}
						className={`text-lg ${
							starNumber <= rating ? "text-gold-accent" : "text-gray-300"
						}`}
					>
						★
					</span>
				))}
			</div>
		);
	};

	return (
		<section id="testimonials" className="wa-section bg-tatami-texture">
			<div className="wa-container">
				{/* セクションタイトル */}
				<div className="text-center mb-16 bg-overlay-dark rounded-xl py-8 mx-auto max-w-4xl">
					<h2 className="wa-heading-2 wa-text-light-contrast mb-4 font-japanese">
						お客様の声
					</h2>
					<p className="wa-text-large wa-text-light-contrast max-w-2xl mx-auto">
						実際にお住まいいただいているお客様から
						<br className="hidden sm:block" />
						いただいた貴重なご意見をご紹介します。
					</p>
					<div className="wa-divider-vertical mt-8" />
				</div>

				{/* お客様の声カード */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
					{testimonials.map((testimonial, index) => (
						<div key={testimonial.id} className="wa-card bg-washi-white">
							{/* 顧客情報 */}
							<div className="flex items-center mb-6">
								<img
									src={testimonial.imageUrl}
									alt={testimonial.name}
									className="w-16 h-16 rounded-full mr-4"
								/>
								<div>
									<h3 className="wa-heading-3 mb-1 font-japanese">
										{testimonial.name}
									</h3>
									<p className="text-wood-medium text-sm">
										{testimonial.age} ・ {testimonial.location}
									</p>
									<p className="text-tatami-green text-sm font-bold">
										{testimonial.houseType}
									</p>
								</div>
							</div>

							{/* 評価 */}
							<div className="mb-4">
								<StarRating rating={testimonial.rating} />
							</div>

							{/* コメント */}
							<div className="wa-quote mb-4">
								<p className="wa-text-body">{testimonial.comment}</p>
							</div>
						</div>
					))}
				</div>

				{/* 顧客満足度統計 */}
				<div className="bg-washi-white rounded-xl p-8 text-center">
					<h3 className="wa-heading-3 mb-6 font-japanese">顧客満足度</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<div className="text-4xl font-bold text-tatami-green mb-2">
								98%
							</div>
							<p className="wa-text-body">お客様満足度</p>
						</div>
						<div>
							<div className="text-4xl font-bold text-wood-dark mb-2">100%</div>
							<p className="wa-text-body">工期遵守率</p>
						</div>
						<div>
							<div className="text-4xl font-bold text-gold-accent mb-2">
								15年
							</div>
							<p className="wa-text-body">平均お付き合い期間</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
