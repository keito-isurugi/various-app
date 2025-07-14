/**
 * iframe埋め込み対象のデモページ
 * 他のサイトからiframeで埋め込まれることを想定
 */
export default function EmbedTargetPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
			<div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
				<h1 className="text-3xl font-bold text-gray-800 mb-4">
					埋め込み対象ページ
				</h1>
				<p className="text-gray-600 mb-6">
					このページは他のサイトからiframeで埋め込むことができます。
				</p>

				<div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
					<p className="text-blue-700">
						<strong>情報:</strong> このページはiframe内で表示されています。
					</p>
				</div>

				<div className="space-y-4">
					<div className="p-4 bg-gray-50 rounded">
						<h2 className="text-xl font-semibold text-gray-700 mb-2">
							機能デモ
						</h2>
						<ul className="list-disc list-inside text-gray-600 space-y-1">
							<li>レスポンシブデザイン対応</li>
							<li>他ドメインからの埋め込み許可</li>
							<li>スタイルの独立性確保</li>
						</ul>
					</div>

					<div className="p-4 bg-purple-50 rounded">
						<h2 className="text-xl font-semibold text-gray-700 mb-2">
							現在の日時
						</h2>
						<p className="text-gray-600">
							{new Date().toLocaleString("ja-JP", {
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</div>
				</div>

				<div className="mt-6 text-center text-sm text-gray-500">
					© 2024 iframe Demo - Embedded Content
				</div>
			</div>
		</div>
	);
}
