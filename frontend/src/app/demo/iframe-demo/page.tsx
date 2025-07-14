"use client";

import { useState } from "react";

/**
 * iframe埋め込みデモページ
 * embed-targetページをiframeで表示し、
 * サイズ調整などの機能を提供
 */
export default function IframeDemoPage() {
	const [iframeWidth, setIframeWidth] = useState("100%");
	const [iframeHeight, setIframeHeight] = useState("600");

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-800 mb-8">
					iframe埋め込みデモ
				</h1>

				{/* コントロールパネル */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4">
						iframeコントロール
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* 幅の調整 */}
						<div>
							<div className="block text-sm font-medium text-gray-700 mb-2">
								幅の調整
							</div>
							<div className="space-y-2">
								<button
									type="button"
									onClick={() => setIframeWidth("100%")}
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
								>
									100%
								</button>
								<button
									type="button"
									onClick={() => setIframeWidth("800px")}
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
								>
									800px
								</button>
								<button
									type="button"
									onClick={() => setIframeWidth("600px")}
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									600px
								</button>
							</div>
						</div>

						{/* 高さの調整 */}
						<div>
							<div className="block text-sm font-medium text-gray-700 mb-2">
								高さの調整
							</div>
							<div className="space-y-2">
								<button
									type="button"
									onClick={() => setIframeHeight("400")}
									className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
								>
									400px
								</button>
								<button
									type="button"
									onClick={() => setIframeHeight("600")}
									className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
								>
									600px
								</button>
								<button
									type="button"
									onClick={() => setIframeHeight("800")}
									className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
								>
									800px
								</button>
							</div>
						</div>
					</div>

					{/* 現在の設定表示 */}
					<div className="mt-4 p-4 bg-gray-50 rounded">
						<p className="text-sm text-gray-600">
							現在の設定: 幅 {iframeWidth} × 高さ {iframeHeight}px
						</p>
					</div>
				</div>

				{/* iframe表示エリア */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4">
						埋め込みプレビュー
					</h2>

					<div className="border-2 border-gray-300 rounded overflow-hidden">
						<iframe
							src="/demo/embed-target"
							width={iframeWidth}
							height={`${iframeHeight}px`}
							className="mx-auto"
							title="埋め込みデモコンテンツ"
						/>
					</div>

					{/* 埋め込みコード例 */}
					<div className="mt-6">
						<h3 className="text-lg font-medium text-gray-700 mb-2">
							埋め込みコード例
						</h3>
						<pre className="p-4 bg-gray-900 text-gray-100 rounded overflow-x-auto">
							<code>{`<iframe
  src="${typeof window !== "undefined" ? window.location.origin : ""}/demo/embed-target"
  width="${iframeWidth}"
  height="${iframeHeight}"
  frameborder="0"
  title="埋め込みデモコンテンツ"
></iframe>`}</code>
						</pre>
					</div>
				</div>

				{/* 説明セクション */}
				<div className="mt-8 bg-white rounded-lg shadow-md p-6">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4">
						iframe埋め込みについて
					</h2>
					<div className="prose max-w-none text-gray-600">
						<p className="mb-4">
							このデモでは、Next.jsアプリケーション内でiframeを使用して
							別のページを埋め込む方法を示しています。
						</p>
						<ul className="list-disc list-inside space-y-2">
							<li>レスポンシブ対応の埋め込みコンテンツ</li>
							<li>動的なサイズ調整機能</li>
							<li>他ドメインからのアクセス許可設定（X-Frame-Options）</li>
							<li>埋め込みコードの自動生成</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
