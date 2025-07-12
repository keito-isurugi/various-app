/**
 * src/app/networks/basics/page.tsx
 *
 * ネットワーク基礎学習ページ
 * OSI参照モデル、TCP/IPモデル、IPアドレス、ポート番号などの基礎知識を提供
 */

"use client";

import React, { useState } from "react";

/**
 * ネットワーク基礎学習ページ
 * 各セクションをタブで切り替えて学習できるインタラクティブなページ
 */
export default function NetworkBasicsPage() {
	const [activeTab, setActiveTab] = useState("overview");

	/**
	 * タブの定義
	 */
	const tabs = [
		{ id: "overview", name: "概要", icon: "🌐" },
		{ id: "osi", name: "OSI参照モデル", icon: "📊" },
		{ id: "tcpip", name: "TCP/IPモデル", icon: "🔗" },
		{ id: "addressing", name: "アドレシング", icon: "📍" },
		{ id: "protocols", name: "プロトコル", icon: "📡" },
		{ id: "routing", name: "ルーティング", icon: "🛣️" },
	];

	/**
	 * タブコンテンツのレンダリング
	 */
	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return <OverviewSection />;
			case "osi":
				return <OSIModelSection />;
			case "tcpip":
				return <TCPIPModelSection />;
			case "addressing":
				return <AddressingSection />;
			case "protocols":
				return <ProtocolsSection />;
			case "routing":
				return <RoutingSection />;
			default:
				return <OverviewSection />;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 dark:from-blue-400 dark:via-purple-400 dark:to-green-400 bg-clip-text text-transparent mb-4">
						ネットワーク基礎
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						ネットワークの基本概念から実践的な応用まで、体系的に学習しましょう
					</p>
				</header>

				{/* タブナビゲーション */}
				<nav className="mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-2">
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
							{tabs.map((tab) => (
								<button
									type="button"
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
										activeTab === tab.id
											? "bg-blue-500 text-white shadow-md"
											: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
									}`}
								>
									<div className="text-lg mb-1">{tab.icon}</div>
									<div className="text-xs">{tab.name}</div>
								</button>
							))}
						</div>
					</div>
				</nav>

				{/* タブコンテンツ */}
				<main className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
					{renderTabContent()}
				</main>
			</div>
		</div>
	);
}

/**
 * 概要セクション
 */
function OverviewSection() {
	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				🌐 ネットワークとは何か
			</h2>

			<div className="grid md:grid-cols-2 gap-8">
				<div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						ネットワークの定義
					</h3>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
						コンピュータネットワークとは、複数のコンピュータやデバイスが相互に接続され、データやリソースを共有できるシステムのことです。
					</p>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
						現代社会では、インターネット、社内LAN、Wi-Fi、スマートフォンの通信など、あらゆる場面でネットワーク技術が使われています。
					</p>

					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						ネットワークの種類
					</h3>
					<ul className="space-y-2 text-gray-600 dark:text-gray-400">
						<li className="flex items-center">
							<span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
							<strong>LAN (Local Area Network):</strong>{" "}
							建物内や限られた範囲のネットワーク
						</li>
						<li className="flex items-center">
							<span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
							<strong>WAN (Wide Area Network):</strong>{" "}
							地理的に離れた地点を結ぶネットワーク
						</li>
						<li className="flex items-center">
							<span className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
							<strong>インターネット:</strong>{" "}
							世界中のネットワークを相互接続した巨大なネットワーク
						</li>
					</ul>
				</div>

				<div>
					<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
						<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
							📚 この学習で身につくスキル
						</h3>
						<ul className="space-y-2 text-blue-700 dark:text-blue-300">
							<li>• ネットワークの基本的な仕組みの理解</li>
							<li>• OSI参照モデルとTCP/IPモデルの違い</li>
							<li>• IPアドレスとサブネットの計算方法</li>
							<li>• 各種プロトコルの役割と特徴</li>
							<li>• ルーティングの基本概念</li>
							<li>• ネットワークトラブルシューティングの基礎</li>
						</ul>
					</div>

					<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700 mt-6">
						<h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
							🎯 学習の目標
						</h3>
						<p className="text-green-700 dark:text-green-300 text-sm">
							この基礎学習を修了すると、ネットワークエンジニアとしての第一歩を踏み出すことができます。
							また、システム開発やインフラ構築において、適切なネットワーク設計ができるようになります。
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * OSI参照モデルセクション
 */
function OSIModelSection() {
	const osiLayers = [
		{
			layer: 7,
			name: "アプリケーション層",
			description: "ユーザーが直接操作するアプリケーションレベルの処理",
			examples: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS"],
			color: "bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-700",
		},
		{
			layer: 6,
			name: "プレゼンテーション層",
			description: "データの暗号化、圧縮、文字コード変換",
			examples: ["SSL/TLS", "JPEG", "MP3", "ZIP"],
			color:
				"bg-orange-100 border-orange-300 dark:bg-orange-900/20 dark:border-orange-700",
		},
		{
			layer: 5,
			name: "セッション層",
			description: "アプリケーション間の通信セッションの管理",
			examples: ["NetBIOS", "RPC", "SQL Sessions"],
			color:
				"bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700",
		},
		{
			layer: 4,
			name: "トランスポート層",
			description: "エンドツーエンドの通信の信頼性保証",
			examples: ["TCP", "UDP", "SCTP"],
			color:
				"bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700",
		},
		{
			layer: 3,
			name: "ネットワーク層",
			description: "パケットのルーティングとアドレッシング",
			examples: ["IP", "ICMP", "ARP", "OSPF", "BGP"],
			color:
				"bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700",
		},
		{
			layer: 2,
			name: "データリンク層",
			description: "同一ネットワーク内でのフレーム転送",
			examples: ["Ethernet", "Wi-Fi", "PPP", "Frame Relay"],
			color:
				"bg-indigo-100 border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-700",
		},
		{
			layer: 1,
			name: "物理層",
			description: "電気信号やビットストリームの物理的な伝送",
			examples: ["ケーブル", "光ファイバー", "無線電波"],
			color:
				"bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700",
		},
	];

	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				📊 OSI参照モデルの7階層
			</h2>

			<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
				OSI参照モデルは、ネットワーク通信を7つの階層に分けて整理した概念モデルです。
				各階層は独立した機能を持ち、上位層は下位層のサービスを利用して動作します。
			</p>

			<div className="space-y-4">
				{osiLayers.map((layer) => (
					<div
						key={layer.layer}
						className={`${layer.color} rounded-lg p-6 border-l-4`}
					>
						<div className="flex items-start justify-between mb-4">
							<div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
									第{layer.layer}層: {layer.name}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mt-2">
									{layer.description}
								</p>
							</div>
							<span className="text-3xl font-bold text-gray-400 dark:text-gray-600">
								{layer.layer}
							</span>
						</div>
						<div>
							<h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
								主な技術・プロトコル:
							</h4>
							<div className="flex flex-wrap gap-2">
								{layer.examples.map((example) => (
									<span
										key={example}
										className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
									>
										{example}
									</span>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
				<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
					💡 OSI参照モデルの意義
				</h3>
				<p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
					OSI参照モデルは、異なるベンダーの機器やソフトウェアが相互に通信できるよう、
					標準化された枠組みを提供します。また、ネットワークトラブルが発生した際に、
					どの層に問題があるかを特定しやすくする効果もあります。
				</p>
			</div>
		</div>
	);
}

/**
 * TCP/IPモデルセクション
 */
function TCPIPModelSection() {
	const tcpipLayers = [
		{
			layer: 4,
			name: "アプリケーション層",
			description: "アプリケーション固有の処理とユーザーインターフェース",
			osiEquivalent: "OSI第5-7層に相当",
			examples: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS", "SSH"],
			color: "bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-700",
		},
		{
			layer: 3,
			name: "トランスポート層",
			description: "エンドツーエンドの通信制御と信頼性保証",
			osiEquivalent: "OSI第4層に相当",
			examples: ["TCP", "UDP"],
			color:
				"bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700",
		},
		{
			layer: 2,
			name: "インターネット層",
			description: "ネットワーク間のルーティングとアドレッシング",
			osiEquivalent: "OSI第3層に相当",
			examples: ["IP", "ICMP", "ARP", "IGMP"],
			color:
				"bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700",
		},
		{
			layer: 1,
			name: "ネットワークアクセス層",
			description: "物理的なネットワークへのアクセスとデータリンク",
			osiEquivalent: "OSI第1-2層に相当",
			examples: ["Ethernet", "Wi-Fi", "PPP", "ARP"],
			color:
				"bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700",
		},
	];

	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				🔗 TCP/IPモデルの4階層
			</h2>

			<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
				TCP/IPモデルは、実際のインターネット通信で使用されている実用的なネットワークモデルです。
				OSI参照モデルよりもシンプルな4階層構造で、現実のネットワーク実装により即しています。
			</p>

			<div className="space-y-4">
				{tcpipLayers.map((layer) => (
					<div
						key={layer.layer}
						className={`${layer.color} rounded-lg p-6 border-l-4`}
					>
						<div className="flex items-start justify-between mb-4">
							<div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
									第{layer.layer}層: {layer.name}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mt-2">
									{layer.description}
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
									{layer.osiEquivalent}
								</p>
							</div>
							<span className="text-3xl font-bold text-gray-400 dark:text-gray-600">
								{layer.layer}
							</span>
						</div>
						<div>
							<h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
								主な技術・プロトコル:
							</h4>
							<div className="flex flex-wrap gap-2">
								{layer.examples.map((example) => (
									<span
										key={example}
										className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
									>
										{example}
									</span>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="grid md:grid-cols-2 gap-6 mt-8">
				<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
					<h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
						🎯 TCP/IPモデルの特徴
					</h3>
					<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
						<li>• 実用性重視のシンプルな4階層構造</li>
						<li>• インターネットで実際に使用されている</li>
						<li>• 各層が独立して進化可能</li>
						<li>• プロトコルスイートとして統合設計</li>
					</ul>
				</div>

				<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
					<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
						📊 OSIモデルとの違い
					</h3>
					<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
						<li>• 階層数: OSI 7層 vs TCP/IP 4層</li>
						<li>• 設計思想: 理論的 vs 実用的</li>
						<li>• 普及度: 教育用 vs 実装標準</li>
						<li>• 柔軟性: 厳密 vs 実践的</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

/**
 * アドレシングセクション
 */
function AddressingSection() {
	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				📍 IPアドレス・サブネット・ポート番号
			</h2>

			<div className="space-y-8">
				{/* IPアドレス */}
				<section>
					<h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						🏠 IPアドレス
					</h3>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
						IPアドレスは、ネットワーク上の各デバイスに割り当てられる一意の識別番号です。
						インターネット上の住所のような役割を果たします。
					</p>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
							<h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
								IPv4アドレス
							</h4>
							<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
								<li>• 32ビットのアドレス空間</li>
								<li>• ドット記法: 192.168.1.1</li>
								<li>• 約43億個のアドレス</li>
								<li>• クラスA/B/C/D/Eに分類</li>
							</ul>
							<div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded font-mono text-sm">
								例: 192.168.1.100
							</div>
						</div>

						<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
							<h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
								IPv6アドレス
							</h4>
							<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
								<li>• 128ビットのアドレス空間</li>
								<li>• コロン記法: 16進数表記</li>
								<li>• 約340澗個のアドレス</li>
								<li>• IPv4の後継規格</li>
							</ul>
							<div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded font-mono text-sm">
								例: 2001:0db8:85a3::8a2e:0370:7334
							</div>
						</div>
					</div>
				</section>

				{/* サブネット */}
				<section>
					<h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						🗂️ サブネット
					</h3>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
						サブネットは、大きなネットワークを小さなセグメントに分割する技術です。
						効率的なアドレス管理とセキュリティの向上に役立ちます。
					</p>

					<div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
						<h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
							サブネットマスクの例
						</h4>
						<div className="grid md:grid-cols-3 gap-4 text-sm">
							<div>
								<div className="font-mono bg-white dark:bg-gray-700 p-3 rounded mb-2">
									192.168.1.0/24
								</div>
								<p className="text-yellow-700 dark:text-yellow-300">
									クラスCサイズ
									<br />
									（256アドレス）
								</p>
							</div>
							<div>
								<div className="font-mono bg-white dark:bg-gray-700 p-3 rounded mb-2">
									192.168.0.0/16
								</div>
								<p className="text-yellow-700 dark:text-yellow-300">
									クラスBサイズ
									<br />
									（65,536アドレス）
								</p>
							</div>
							<div>
								<div className="font-mono bg-white dark:bg-gray-700 p-3 rounded mb-2">
									10.0.0.0/8
								</div>
								<p className="text-yellow-700 dark:text-yellow-300">
									クラスAサイズ
									<br />
									（16,777,216アドレス）
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* ポート番号 */}
				<section>
					<h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						🚪 ポート番号
					</h3>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
						ポート番号は、同一のコンピュータ上で実行される複数のアプリケーションを識別するための番号です。
						0から65535までの16ビットの数値で表現されます。
					</p>

					<div className="grid md:grid-cols-3 gap-4">
						<div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
							<h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">
								ウェルノウンポート (0-1023)
							</h4>
							<ul className="space-y-1 text-red-700 dark:text-red-300 text-sm">
								<li>HTTP: 80</li>
								<li>HTTPS: 443</li>
								<li>FTP: 21</li>
								<li>SSH: 22</li>
								<li>DNS: 53</li>
							</ul>
						</div>

						<div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
							<h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">
								登録ポート (1024-49151)
							</h4>
							<ul className="space-y-1 text-orange-700 dark:text-orange-300 text-sm">
								<li>MySQL: 3306</li>
								<li>PostgreSQL: 5432</li>
								<li>Redis: 6379</li>
								<li>MongoDB: 27017</li>
							</ul>
						</div>

						<div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
							<h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
								動的ポート (49152-65535)
							</h4>
							<p className="text-purple-700 dark:text-purple-300 text-sm">
								クライアントアプリケーションが一時的に使用するポート範囲
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

/**
 * プロトコルセクション
 */
function ProtocolsSection() {
	const protocols = [
		{
			name: "HTTP/HTTPS",
			category: "Web",
			description: "Webページの表示に使用される通信プロトコル",
			features: ["ステートレス", "リクエスト・レスポンス型", "暗号化（HTTPS）"],
			color:
				"bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700",
		},
		{
			name: "TCP",
			category: "トランスポート",
			description: "信頼性の高いデータ転送を保証するプロトコル",
			features: ["接続指向", "エラー検出・訂正", "フロー制御"],
			color:
				"bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700",
		},
		{
			name: "UDP",
			category: "トランスポート",
			description: "高速だが信頼性を保証しないプロトコル",
			features: ["コネクションレス", "低遅延", "リアルタイム通信"],
			color:
				"bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700",
		},
		{
			name: "DNS",
			category: "ネットワーク",
			description: "ドメイン名をIPアドレスに変換するプロトコル",
			features: ["階層構造", "キャッシュ機能", "負荷分散"],
			color:
				"bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700",
		},
	];

	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				📡 主要なプロトコル
			</h2>

			<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
				ネットワークプロトコルは、異なるデバイス間での通信を可能にするルールと手順のセットです。
				それぞれが特定の役割を持ち、協力して複雑なネットワーク通信を実現しています。
			</p>

			<div className="grid md:grid-cols-2 gap-6">
				{protocols.map((protocol) => (
					<div
						key={protocol.name}
						className={`${protocol.color} rounded-lg p-6 border-l-4`}
					>
						<div className="flex items-start justify-between mb-4">
							<div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
									{protocol.name}
								</h3>
								<span className="text-sm text-gray-500 dark:text-gray-500">
									{protocol.category}
								</span>
							</div>
						</div>
						<p className="text-gray-600 dark:text-gray-400 mb-4">
							{protocol.description}
						</p>
						<div>
							<h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
								主な特徴:
							</h4>
							<ul className="space-y-1">
								{protocol.features.map((feature) => (
									<li
										key={feature}
										className="text-gray-600 dark:text-gray-400 text-sm flex items-center"
									>
										<span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
										{feature}
									</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>

			<div className="mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
				<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
					🔄 プロトコルの協調動作
				</h3>
				<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
					実際のネットワーク通信では、複数のプロトコルが階層的に協力して動作します。
					例えば、WebブラウザでHTTPSサイトを閲覧する際は、HTTP → TCP → IP →
					Ethernet
					の順でプロトコルが重ねられ、各層が独立した機能を提供しています。
				</p>
			</div>
		</div>
	);
}

/**
 * ルーティングセクション
 */
function RoutingSection() {
	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				🛣️ ルーティングとDNS
			</h2>

			<div className="space-y-8">
				{/* ルーティング */}
				<section>
					<h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						🗺️ ルーティングの基礎
					</h3>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
						ルーティングは、パケットが送信元から宛先まで最適な経路を選択して配送される仕組みです。
						インターネット上の道路網と交通案内システムのような役割を果たします。
					</p>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
							<h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
								🏠 スタティックルーティング
							</h4>
							<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
								<li>• 管理者が手動で経路を設定</li>
								<li>• 小規模ネットワークに適している</li>
								<li>• 設定が簡単で動作が安定</li>
								<li>• 障害時は手動での復旧が必要</li>
							</ul>
						</div>

						<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
							<h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
								🤖 ダイナミックルーティング
							</h4>
							<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
								<li>• ルーティングプロトコルによる自動設定</li>
								<li>• 大規模ネットワークに適している</li>
								<li>• 障害時の自動迂回が可能</li>
								<li>• 設定が複雑だが運用は楽</li>
							</ul>
						</div>
					</div>

					<div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
						<h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
							主要なルーティングプロトコル
						</h4>
						<div className="grid md:grid-cols-3 gap-4">
							<div>
								<h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
									RIP
								</h5>
								<p className="text-yellow-700 dark:text-yellow-300 text-sm">
									距離ベクトル型。ホップ数で経路選択。シンプルだが制限あり。
								</p>
							</div>
							<div>
								<h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
									OSPF
								</h5>
								<p className="text-yellow-700 dark:text-yellow-300 text-sm">
									リンクステート型。帯域幅も考慮した最適経路選択。
								</p>
							</div>
							<div>
								<h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
									BGP
								</h5>
								<p className="text-yellow-700 dark:text-yellow-300 text-sm">
									インターネット間のルーティング。AS間の経路制御。
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* DNS */}
				<section>
					<h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						🌐 DNS（Domain Name System）
					</h3>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
						DNSは、人間が覚えやすいドメイン名（www.example.com）を、
						コンピュータが理解できるIPアドレス（192.0.2.1）に変換するシステムです。
					</p>

					<div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
						<h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-4">
							DNS名前解決の流れ
						</h4>
						<div className="space-y-3">
							<div className="flex items-center">
								<span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
									1
								</span>
								<p className="text-purple-700 dark:text-purple-300 text-sm">
									ユーザーがブラウザにドメイン名を入力
								</p>
							</div>
							<div className="flex items-center">
								<span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
									2
								</span>
								<p className="text-purple-700 dark:text-purple-300 text-sm">
									DNSリゾルバがキャッシュを確認
								</p>
							</div>
							<div className="flex items-center">
								<span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
									3
								</span>
								<p className="text-purple-700 dark:text-purple-300 text-sm">
									ルートDNSサーバーに問い合わせ
								</p>
							</div>
							<div className="flex items-center">
								<span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
									4
								</span>
								<p className="text-purple-700 dark:text-purple-300 text-sm">
									TLDサーバー、権威サーバーと順次問い合わせ
								</p>
							</div>
							<div className="flex items-center">
								<span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
									5
								</span>
								<p className="text-purple-700 dark:text-purple-300 text-sm">
									IPアドレスを取得してユーザーに返答
								</p>
							</div>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-6 mt-6">
						<div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-700">
							<h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">
								DNSレコードの種類
							</h4>
							<ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
								<li>
									<strong>A:</strong> ドメイン名 → IPv4アドレス
								</li>
								<li>
									<strong>AAAA:</strong> ドメイン名 → IPv6アドレス
								</li>
								<li>
									<strong>CNAME:</strong> ドメイン名の別名
								</li>
								<li>
									<strong>MX:</strong> メールサーバーの指定
								</li>
								<li>
									<strong>NS:</strong> 権威DNSサーバーの指定
								</li>
							</ul>
						</div>

						<div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
							<h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">
								DNSの利点
							</h4>
							<ul className="space-y-2 text-orange-700 dark:text-orange-300 text-sm">
								<li>• 覚えやすいドメイン名の使用</li>
								<li>• サーバー移転時のIPアドレス変更に対応</li>
								<li>• 負荷分散とフェイルオーバー</li>
								<li>• 階層構造による効率的な管理</li>
								<li>• キャッシュによる高速化</li>
							</ul>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
