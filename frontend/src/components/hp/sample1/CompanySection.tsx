import type React from "react";

/**
 * 会社概要セクションコンポーネント
 * 代表者写真と簡潔な紹介
 */
export const CompanySection: React.FC = () => {
	const companyInfo = {
		name: "和心建築株式会社",
		established: "2001年",
		capital: "3,000万円",
		employees: "25名",
		license: "建設業許可（特-30）第12345号",
		address: "神奈川県鎌倉市大船1-2-3",
		phone: "0467-12-3456",
		email: "info@washin-kenchiku.co.jp",
	};

	const president = {
		name: "代表取締役 和田 心太郎",
		experience: "建築業界歴30年",
		qualification: "一級建築士・宮大工技能士",
		message:
			"お客様の想いを形にし、永く愛される住まいを創ることが私たちの使命です。自然素材と伝統技術を大切にしながら、現代の暮らしに適した住まいを提供します。",
		imageUrl:
			"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='president' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%235D3E2A'/%3E%3Cstop offset='100%25' stop-color='%233D2914'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='90' fill='url(%23president)'/%3E%3Ccircle cx='80' cy='80' r='5' fill='%23FFFFFF'/%3E%3Ccircle cx='120' cy='80' r='5' fill='%23FFFFFF'/%3E%3Cpath d='M70 130 Q100 150 130 130' stroke='%23FFFFFF' stroke-width='3' fill='none'/%3E%3Crect x='70' y='40' width='60' height='10' rx='5' fill='%23FFFFFF' fill-opacity='0.3'/%3E%3C/svg%3E",
	};

	const achievements = [
		{ label: "施工実績", value: "500棟以上" },
		{ label: "リピート率", value: "85%" },
		{ label: "地域密着年数", value: "23年" },
		{ label: "職人在籍数", value: "12名" },
	];

	return (
		<section id="company" className="wa-section bg-washi-texture">
			<div className="wa-container">
				{/* セクションタイトル */}
				<div className="text-center mb-16">
					<h2 className="wa-heading-2 wa-text-dark-contrast mb-4 font-japanese">
						会社概要
					</h2>
					<p className="wa-text-large wa-text-contrast max-w-2xl mx-auto">
						創業以来、地域に根ざした
						<br className="hidden sm:block" />
						信頼できる住まいづくりを続けています。
					</p>
					<div className="wa-divider-vertical mt-8" />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
					{/* 代表者紹介 */}
					<div className="wa-card">
						<div className="text-center mb-6">
							<img
								src={president.imageUrl}
								alt={president.name}
								className="w-32 h-32 rounded-full mx-auto mb-4"
							/>
							<h3 className="wa-heading-3 mb-2 font-japanese">
								{president.name}
							</h3>
							<p className="text-wood-medium text-sm mb-1">
								{president.experience}
							</p>
							<p className="text-tatami-green text-sm font-bold">
								{president.qualification}
							</p>
						</div>
						<div className="wa-quote">
							<p className="wa-text-body">{president.message}</p>
						</div>
					</div>

					{/* 会社情報 */}
					<div className="wa-card">
						<h3 className="wa-heading-3 mb-6 font-japanese">会社情報</h3>
						<div className="space-y-4">
							<div className="flex">
								<span className="w-20 text-wood-medium font-bold">会社名</span>
								<span className="wa-text-body">{companyInfo.name}</span>
							</div>
							<div className="flex">
								<span className="w-20 text-wood-medium font-bold">設立</span>
								<span className="wa-text-body">{companyInfo.established}</span>
							</div>
							<div className="flex">
								<span className="w-20 text-wood-medium font-bold">資本金</span>
								<span className="wa-text-body">{companyInfo.capital}</span>
							</div>
							<div className="flex">
								<span className="w-20 text-wood-medium font-bold">従業員</span>
								<span className="wa-text-body">{companyInfo.employees}</span>
							</div>
							<div className="flex">
								<span className="w-20 text-wood-medium font-bold">許可</span>
								<span className="wa-text-body">{companyInfo.license}</span>
							</div>
							<div className="flex">
								<span className="w-20 text-wood-medium font-bold">所在地</span>
								<span className="wa-text-body">{companyInfo.address}</span>
							</div>
							<div className="flex">
								<span className="w-20 text-wood-medium font-bold">電話</span>
								<span className="wa-text-body">{companyInfo.phone}</span>
							</div>
							<div className="flex">
								<span className="w-20 text-wood-medium font-bold">メール</span>
								<span className="wa-text-body">{companyInfo.email}</span>
							</div>
						</div>
					</div>
				</div>

				{/* 実績データ */}
				<div className="bg-wood-texture rounded-xl p-8 text-center relative">
					{/* 背景オーバーレイ */}
					<div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl" />
					<div className="relative z-10">
						<h3 className="wa-heading-3 wa-text-light-contrast mb-8 font-japanese">
							これまでの実績
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							{achievements.map((achievement) => (
								<div key={achievement.label} className="text-center">
									<div className="text-3xl font-bold text-gold-accent mb-2 drop-shadow-lg">
										{achievement.value}
									</div>
									<p className="wa-text-light-contrast text-sm">
										{achievement.label}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
