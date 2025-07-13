"use client";

import { useState } from "react";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitMessage("");

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				setSubmitMessage(
					"お問い合わせを受け付けました。返信までしばらくお待ちください。",
				);
				setFormData({
					name: "",
					email: "",
					subject: "",
					message: "",
				});
			} else {
				setSubmitMessage(
					data.error ||
						"送信中にエラーが発生しました。もう一度お試しください。",
				);
			}
		} catch (error) {
			console.error("送信エラー:", error);
			setSubmitMessage(
				"送信中にエラーが発生しました。もう一度お試しください。",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen py-12 px-4">
			<div className="container mx-auto max-w-2xl">
				<h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
					お問い合わせ
				</h1>

				<p className="text-center text-gray-600 mb-12">
					ご質問、ご相談、プロジェクトのご依頼など、お気軽にお問い合わせください。
				</p>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* お名前 */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							お名前 <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
							placeholder="山田 太郎"
						/>
					</div>

					{/* メールアドレス */}
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							メールアドレス <span className="text-red-500">*</span>
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
							placeholder="example@email.com"
						/>
					</div>

					{/* 件名 */}
					<div>
						<label
							htmlFor="subject"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							件名 <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="subject"
							name="subject"
							value={formData.subject}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
							placeholder="お問い合わせの件名"
						/>
					</div>

					{/* お問い合わせ内容 */}
					<div>
						<label
							htmlFor="message"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							お問い合わせ内容 <span className="text-red-500">*</span>
						</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleChange}
							required
							rows={6}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
							placeholder="お問い合わせ内容をご記入ください"
						/>
					</div>

					{/* 送信ボタン */}
					<div className="text-center">
						<button
							type="submit"
							disabled={isSubmitting}
							className={`px-8 py-3 rounded-lg font-medium transition-colors ${
								isSubmitting
									? "bg-gray-400 text-white cursor-not-allowed"
									: "bg-blue-600 text-white hover:bg-blue-700"
							}`}
						>
							{isSubmitting ? "送信中..." : "送信する"}
						</button>
					</div>

					{/* 送信メッセージ */}
					{submitMessage && (
						<div
							className={`mt-4 p-4 rounded-lg text-center ${
								submitMessage.includes("エラー")
									? "bg-red-50 text-red-700"
									: "bg-green-50 text-green-700"
							}`}
						>
							{submitMessage}
						</div>
					)}
				</form>

				{/* 注意事項 */}
				<div className="mt-12 p-6 bg-gray-50 rounded-lg">
					<h2 className="text-lg font-semibold mb-2">ご注意事項</h2>
					<ul className="text-sm text-gray-600 space-y-1">
						<li>• 返信までに数日お時間をいただく場合があります</li>
						<li>• 営業目的のお問い合わせはご遠慮ください</li>
						<li>
							• 個人情報は適切に管理し、お問い合わせ対応以外には使用しません
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
