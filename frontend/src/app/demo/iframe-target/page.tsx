"use client";

import { useEffect, useState } from "react";

/**
 * iframe埋め込み禁止デモページ
 * X-Frame-Optionsにより他のサイトからiframeで埋め込むことができない
 */
export default function IframeTargetPage() {
	const [currentDate, setCurrentDate] = useState<string>("");

	useEffect(() => {
		// クライアントサイドでのみ日時を設定
		setCurrentDate(
			new Date().toLocaleString("ja-JP", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			}),
		);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-8">
			<div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
				<h1 className="text-3xl font-bold text-gray-800 mb-4">
					埋め込み禁止ページ
				</h1>
				<p className="text-gray-600 mb-6">
					このページはセキュリティ設定により、他のサイトからiframeで埋め込むことができません。
				</p>

				<div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
					<p className="text-red-700">
						<strong>セキュリティ:</strong> X-Frame-Options:
						DENYが設定されています。
					</p>
				</div>

				<div className="space-y-4">
					<div className="p-4 bg-gray-50 rounded">
						<h2 className="text-xl font-semibold text-gray-700 mb-2">
							セキュリティ機能
						</h2>
						<ul className="list-disc list-inside text-gray-600 space-y-1">
							<li>クリックジャッキング攻撃の防止</li>
							<li>他ドメインからの埋め込み拒否</li>
							<li>コンテンツの保護</li>
						</ul>
					</div>

					<div className="p-4 bg-orange-50 rounded">
						<h2 className="text-xl font-semibold text-gray-700 mb-2">
							現在の日時
						</h2>
						<p className="text-gray-600">{currentDate || "読み込み中..."}</p>
					</div>

					<div className="p-4 bg-yellow-50 rounded">
						<h2 className="text-xl font-semibold text-gray-700 mb-2">
							埋め込みエラーの確認方法
						</h2>
						<p className="text-gray-600 text-sm">
							このページを他のページからiframeで読み込もうとすると、
							ブラウザのコンソールにエラーメッセージが表示されます。
						</p>
					</div>
				</div>

				<div className="mt-6 text-center text-sm text-gray-500">
					© 2024 iframe Demo - Protected Content
				</div>
			</div>
		</div>
	);
}
