"use client";

import type React from "react";
import { useState } from "react";

/**
 * お問い合わせセクションコンポーネント
 * フォームと地図を含む
 */
export const ContactSection: React.FC = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		inquiryType: "資料請求",
		message: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// フォーム送信処理（実際のプロジェクトでは適切なAPIを呼び出す）
		console.log("フォーム送信:", formData);
		alert("お問い合わせを受け付けました。後日担当者よりご連絡いたします。");
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const contactInfo = [
		{
			title: "お電話でのお問い合わせ",
			content: "0467-12-3456",
			description: "受付時間: 平日9:00〜18:00",
			icon: "📞",
		},
		{
			title: "メールでのお問い合わせ",
			content: "info@washin-kenchiku.co.jp",
			description: "24時間受付（返信は営業時間内）",
			icon: "✉️",
		},
		{
			title: "ショールーム見学",
			content: "神奈川県鎌倉市大船1-2-3",
			description: "完全予約制（土日祝対応可）",
			icon: "🏢",
		},
	];

	return (
		<section id="contact" className="wa-section bg-washi-white">
			<div className="wa-container">
				{/* セクションタイトル */}
				<div className="text-center mb-16">
					<h2 className="wa-heading-2 wa-text-dark-contrast mb-4 font-japanese">
						お問い合わせ
					</h2>
					<p className="wa-text-large wa-text-contrast max-w-2xl mx-auto">
						住まいに関するご相談・ご質問は
						<br className="hidden sm:block" />
						お気軽にお問い合わせください。
					</p>
					<div className="wa-divider-vertical mt-8" />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
					{/* お問い合わせフォーム */}
					<div className="wa-card">
						<h3 className="wa-heading-3 mb-6 font-japanese">
							お問い合わせフォーム
						</h3>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="name"
									className="block text-wood-dark font-bold mb-2"
								>
									お名前 <span className="text-red-500">*</span>
								</label>
								<input
									id="name"
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-wood-light rounded-lg focus:outline-none focus:border-tatami-green"
									placeholder="山田 太郎"
								/>
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-wood-dark font-bold mb-2"
								>
									メールアドレス <span className="text-red-500">*</span>
								</label>
								<input
									id="email"
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-wood-light rounded-lg focus:outline-none focus:border-tatami-green"
									placeholder="example@email.com"
								/>
							</div>

							<div>
								<label
									htmlFor="phone"
									className="block text-wood-dark font-bold mb-2"
								>
									電話番号
								</label>
								<input
									id="phone"
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									className="w-full px-4 py-3 border border-wood-light rounded-lg focus:outline-none focus:border-tatami-green"
									placeholder="090-1234-5678"
								/>
							</div>

							<div>
								<label
									htmlFor="inquiryType"
									className="block text-wood-dark font-bold mb-2"
								>
									お問い合わせ種別 <span className="text-red-500">*</span>
								</label>
								<select
									id="inquiryType"
									name="inquiryType"
									value={formData.inquiryType}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-wood-light rounded-lg focus:outline-none focus:border-tatami-green"
								>
									<option value="資料請求">資料請求</option>
									<option value="見学会予約">見学会予約</option>
									<option value="設計相談">設計相談</option>
									<option value="その他">その他</option>
								</select>
							</div>

							<div>
								<label
									htmlFor="message"
									className="block text-wood-dark font-bold mb-2"
								>
									メッセージ
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									rows={4}
									className="w-full px-4 py-3 border border-wood-light rounded-lg focus:outline-none focus:border-tatami-green"
									placeholder="ご質問やご要望をお聞かせください"
								/>
							</div>

							<button
								type="submit"
								className="wa-btn-primary w-full text-lg py-4 font-japanese"
							>
								送信する
							</button>
						</form>
					</div>

					{/* 連絡先情報 */}
					<div>
						{/* 各種連絡方法 */}
						<div className="space-y-6 mb-8">
							{contactInfo.map((info, index) => (
								<div key={`contact-${info.title}-${index}`} className="wa-card">
									<div className="flex items-start space-x-4">
										<div className="text-3xl">{info.icon}</div>
										<div>
											<h4 className="wa-heading-3 mb-2 font-japanese">
												{info.title}
											</h4>
											<p className="text-wood-dark font-bold text-lg mb-1">
												{info.content}
											</p>
											<p className="text-wood-medium text-sm">
												{info.description}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* 地図（プレースホルダー） */}
						<div className="wa-card">
							<h4 className="wa-heading-3 mb-4 font-japanese">アクセス</h4>
							<div className="bg-tatami-texture rounded-lg h-64 flex items-center justify-center">
								<div className="text-center text-washi-white">
									<div className="text-4xl mb-2">🗺️</div>
									<p className="font-japanese">神奈川県鎌倉市大船1-2-3</p>
									<p className="text-sm mt-2">JR大船駅より徒歩5分</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* フッター情報 */}
				<div className="bg-wood-texture rounded-xl p-8 text-center relative">
					{/* 背景オーバーレイ */}
					<div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl" />
					<div className="relative z-10">
						<h3 className="wa-heading-3 wa-text-light-contrast mb-4 font-japanese">
							見学会開催中
						</h3>
						<p className="wa-text-light-contrast mb-6 max-w-2xl mx-auto">
							実際の住まいをご覧いただける見学会を毎週末開催しています。
							<br className="hidden sm:block" />
							自然素材の温もりを直接体感してください。
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								type="button"
								className="wa-btn-primary bg-washi-white text-wood-dark hover:bg-washi-cream font-japanese shadow-lg"
							>
								見学会予約
							</button>
							<button
								type="button"
								className="text-washi-white hover:bg-washi-white hover:text-wood-dark font-japanese backdrop-blur-sm bg-black bg-opacity-50 px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
							>
								資料請求
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
