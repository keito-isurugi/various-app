"use client";

import React, { useState } from "react";

/**
 * TLS/SSL入門ページ
 * Webエンジニア向けのTLS/SSLの基礎知識、仕組み、実装例を解説
 */
export default function TLSPage() {
	// アクティブなタブの管理
	const [activeTab, setActiveTab] = useState("basics");

	// コードサンプルのコピー機能
	const [copiedCode, setCopiedCode] = useState<string | null>(null);

	const copyToClipboard = (code: string, id: string) => {
		navigator.clipboard.writeText(code);
		setCopiedCode(id);
		setTimeout(() => setCopiedCode(null), 2000);
	};

	// タブコンテンツの定義
	const tabContents = {
		basics: {
			title: "基本概念",
			icon: "🔐",
		},
		mechanism: {
			title: "TLSの仕組み",
			icon: "⚙️",
		},
		implementation: {
			title: "実装例",
			icon: "💻",
		},
		bestPractices: {
			title: "ベストプラクティス",
			icon: "✨",
		},
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto px-4 py-8 max-w-5xl">
				{/* ページヘッダー */}
				<header className="mb-12">
					<h1 className="text-4xl font-bold mb-4 gradient-text-primary">
						TLS/SSL入門
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300">
						Webエンジニアが知っておくべきTLS/SSLの基礎知識を解説します
					</p>
				</header>

				{/* タブナビゲーション */}
				<nav className="mb-8">
					<div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
						{Object.entries(tabContents).map(([key, content]) => (
							<button
								type="button"
								key={key}
								onClick={() => setActiveTab(key)}
								className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
									activeTab === key
										? "bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
								}`}
							>
								<span>{content.icon}</span>
								<span className="font-medium">{content.title}</span>
							</button>
						))}
					</div>
				</nav>

				{/* タブコンテンツ */}
				<main className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
					{/* 基本概念タブ */}
					{activeTab === "basics" && (
						<div className="space-y-8">
							<section>
								<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
									TLS/SSLとは？
								</h2>
								<div className="space-y-4 text-gray-700 dark:text-gray-300">
									<p>
										<strong>TLS (Transport Layer Security)</strong>
										は、インターネット上でデータを安全に送受信するための暗号化プロトコルです。
										SSLの後継プロトコルですが、現在でも「SSL/TLS」や単に「SSL」と呼ばれることがあります。
									</p>
									<div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
										<p className="font-semibold mb-2">📌 重要ポイント</p>
										<ul className="list-disc list-inside space-y-1">
											<li>
												SSL 3.0は2015年に非推奨となり、現在はTLS 1.2以上を使用
											</li>
											<li>TLS 1.3が最新バージョン（2018年標準化）</li>
											<li>HTTPSは「HTTP over TLS」の略</li>
										</ul>
									</div>
								</div>
							</section>

							<section>
								<h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
									TLSが提供する3つの機能
								</h3>
								<div className="grid md:grid-cols-3 gap-4">
									<div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
										<div className="text-3xl mb-3">🔒</div>
										<h4 className="font-bold text-green-900 dark:text-green-100 mb-2">
											暗号化
										</h4>
										<p className="text-green-700 dark:text-green-300 text-sm">
											通信内容を第三者に読まれないよう暗号化。対称鍵暗号と公開鍵暗号を組み合わせて使用。
										</p>
									</div>
									<div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
										<div className="text-3xl mb-3">🔐</div>
										<h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">
											認証
										</h4>
										<p className="text-yellow-700 dark:text-yellow-300 text-sm">
											通信相手が本物であることを証明。デジタル証明書により、なりすましを防止。
										</p>
									</div>
									<div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
										<div className="text-3xl mb-3">✓</div>
										<h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
											完全性
										</h4>
										<p className="text-purple-700 dark:text-purple-300 text-sm">
											データが改ざんされていないことを保証。メッセージ認証コード（MAC）を使用。
										</p>
									</div>
								</div>
							</section>

							<section>
								<h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
									用語解説
								</h3>
								<div className="space-y-3">
									{[
										{
											term: "証明書（Certificate）",
											description:
												"ウェブサイトの身元を証明するデジタル文書。認証局（CA）が発行。",
										},
										{
											term: "認証局（CA: Certificate Authority）",
											description:
												"証明書を発行する信頼できる第三者機関。Let's Encrypt、DigiCertなど。",
										},
										{
											term: "公開鍵・秘密鍵",
											description:
												"非対称暗号で使用される鍵のペア。公開鍵は公開、秘密鍵は厳重に保管。",
										},
										{
											term: "ハンドシェイク",
											description:
												"TLS接続の確立プロセス。暗号スイートの選択、鍵交換、認証を行う。",
										},
									].map((item) => (
										<div
											key={item.term}
											className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
										>
											<dt className="font-semibold text-gray-900 dark:text-white mb-1">
												{item.term}
											</dt>
											<dd className="text-gray-600 dark:text-gray-400 text-sm">
												{item.description}
											</dd>
										</div>
									))}
								</div>
							</section>
						</div>
					)}

					{/* TLSの仕組みタブ */}
					{activeTab === "mechanism" && (
						<div className="space-y-8">
							<section>
								<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
									TLSハンドシェイクの流れ
								</h2>
								<div className="space-y-6">
									{[
										{
											step: 1,
											title: "Client Hello",
											description:
												"クライアントがサーバーに接続要求を送信。対応するTLSバージョンや暗号スイートのリストを含む。",
											detail:
												"送信内容: TLSバージョン、乱数、暗号スイートリスト、圧縮方式",
										},
										{
											step: 2,
											title: "Server Hello",
											description:
												"サーバーが使用するTLSバージョンと暗号スイートを選択して返答。",
											detail:
												"送信内容: 選択したTLSバージョン、乱数、選択した暗号スイート",
										},
										{
											step: 3,
											title: "Certificate",
											description:
												"サーバーが自身の証明書をクライアントに送信。",
											detail: "証明書にはサーバーの公開鍵とCA署名が含まれる",
										},
										{
											step: 4,
											title: "Key Exchange",
											description:
												"クライアントとサーバーが共通の秘密鍵（セッション鍵）を生成。",
											detail:
												"DH（Diffie-Hellman）やECDH（楕円曲線DH）などのアルゴリズムを使用",
										},
										{
											step: 5,
											title: "Finished",
											description:
												"ハンドシェイクが完了し、以降の通信は生成されたセッション鍵で暗号化。",
											detail:
												"ハンドシェイクメッセージのハッシュ値を交換して確認",
										},
									].map((item) => (
										<div
											key={item.step}
											className="flex gap-4 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg"
										>
											<div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
												{item.step}
											</div>
											<div className="flex-grow">
												<h3 className="font-bold text-gray-900 dark:text-white mb-2">
													{item.title}
												</h3>
												<p className="text-gray-700 dark:text-gray-300 mb-2">
													{item.description}
												</p>
												<p className="text-sm text-gray-600 dark:text-gray-400 italic">
													{item.detail}
												</p>
											</div>
										</div>
									))}
								</div>
							</section>

							<section>
								<h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
									暗号スイート
								</h3>
								<div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
									<p className="mb-4 text-gray-700 dark:text-gray-300">
										暗号スイートは、TLS接続で使用される暗号アルゴリズムの組み合わせです。
									</p>
									<div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
										<p>TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384</p>
										<p className="mt-2 text-gray-400">
											↑鍵交換 ↑認証 ↑暗号化 ↑ハッシュ
										</p>
									</div>
									<ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
										<li>
											• ECDHE: 楕円曲線Diffie-Hellman鍵交換（前方秘匿性あり）
										</li>
										<li>• RSA: RSA署名による認証</li>
										<li>• AES_256_GCM: 256ビットAES暗号化（GCMモード）</li>
										<li>• SHA384: SHA-384ハッシュ関数</li>
									</ul>
								</div>
							</section>
						</div>
					)}

					{/* 実装例タブ */}
					{activeTab === "implementation" && (
						<div className="space-y-8">
							<section>
								<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
									Node.js での HTTPS サーバー実装
								</h2>
								<div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
									<div className="flex justify-between items-center mb-4">
										<span className="text-gray-400 text-sm">server.js</span>
										<button
											type="button"
											onClick={() =>
												copyToClipboard(
													`const https = require('https');
const fs = require('fs');

// SSL証明書の読み込み
const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  // 中間証明書がある場合
  ca: fs.readFileSync('intermediate-cert.pem'),
  
  // セキュリティ設定
  secureOptions: 'SSL_OP_NO_SSLv3 | SSL_OP_NO_TLSv1 | SSL_OP_NO_TLSv1_1',
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-SHA256',
    'ECDHE-RSA-AES256-SHA384'
  ].join(':'),
  honorCipherOrder: true
};

// HTTPSサーバーの作成
const server = https.createServer(options, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  });
  res.end('Hello TLS!\\n');
});

server.listen(443, () => {
  console.log('HTTPS Server running on https://localhost:443');
});`,
													"nodejs-https",
												)
											}
											className={`px-3 py-1 rounded text-sm ${
												copiedCode === "nodejs-https"
													? "bg-green-600 text-white"
													: "bg-gray-700 text-gray-300 hover:bg-gray-600"
											}`}
										>
											{copiedCode === "nodejs-https" ? "Copied!" : "Copy"}
										</button>
									</div>
									<pre className="text-gray-300 text-sm">
										<code>{`const https = require('https');
const fs = require('fs');

// SSL証明書の読み込み
const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  // 中間証明書がある場合
  ca: fs.readFileSync('intermediate-cert.pem'),
  
  // セキュリティ設定
  secureOptions: 'SSL_OP_NO_SSLv3 | SSL_OP_NO_TLSv1 | SSL_OP_NO_TLSv1_1',
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-SHA256',
    'ECDHE-RSA-AES256-SHA384'
  ].join(':'),
  honorCipherOrder: true
};

// HTTPSサーバーの作成
const server = https.createServer(options, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  });
  res.end('Hello TLS!\\n');
});

server.listen(443, () => {
  console.log('HTTPS Server running on https://localhost:443');
});`}</code>
									</pre>
								</div>
							</section>

							<section>
								<h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
									Nginx での TLS 設定
								</h3>
								<div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
									<div className="flex justify-between items-center mb-4">
										<span className="text-gray-400 text-sm">nginx.conf</span>
										<button
											type="button"
											onClick={() =>
												copyToClipboard(
													`server {
    listen 443 ssl http2;
    server_name example.com;

    # SSL証明書
    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private-key.pem;

    # TLSバージョン（1.2以上のみ許可）
    ssl_protocols TLSv1.2 TLSv1.3;

    # 暗号スイートの設定
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;

    # DH鍵交換パラメータ
    ssl_dhparam /path/to/dhparam.pem;

    # セッション設定
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/intermediate-cert.pem;

    # セキュリティヘッダー
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}`,
													"nginx-tls",
												)
											}
											className={`px-3 py-1 rounded text-sm ${
												copiedCode === "nginx-tls"
													? "bg-green-600 text-white"
													: "bg-gray-700 text-gray-300 hover:bg-gray-600"
											}`}
										>
											{copiedCode === "nginx-tls" ? "Copied!" : "Copy"}
										</button>
									</div>
									<pre className="text-gray-300 text-sm">
										<code>{`server {
    listen 443 ssl http2;
    server_name example.com;

    # SSL証明書
    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private-key.pem;

    # TLSバージョン（1.2以上のみ許可）
    ssl_protocols TLSv1.2 TLSv1.3;

    # 暗号スイートの設定
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;

    # DH鍵交換パラメータ
    ssl_dhparam /path/to/dhparam.pem;

    # セッション設定
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/intermediate-cert.pem;

    # セキュリティヘッダー
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}`}</code>
									</pre>
								</div>
							</section>

							<section>
								<h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
									Let's Encrypt で無料証明書を取得
								</h3>
								<div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
									<div className="flex justify-between items-center mb-4">
										<span className="text-gray-400 text-sm">bash</span>
										<button
											type="button"
											onClick={() =>
												copyToClipboard(
													`# Certbotのインストール（Ubuntu/Debian）
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 証明書の取得（Nginx使用時）
sudo certbot --nginx -d example.com -d www.example.com

# 証明書の取得（スタンドアロン）
sudo certbot certonly --standalone -d example.com

# 証明書の自動更新テスト
sudo certbot renew --dry-run

# cronで自動更新を設定
echo "0 0,12 * * * root certbot renew --quiet" | sudo tee -a /etc/crontab`,
													"letsencrypt",
												)
											}
											className={`px-3 py-1 rounded text-sm ${
												copiedCode === "letsencrypt"
													? "bg-green-600 text-white"
													: "bg-gray-700 text-gray-300 hover:bg-gray-600"
											}`}
										>
											{copiedCode === "letsencrypt" ? "Copied!" : "Copy"}
										</button>
									</div>
									<pre className="text-gray-300 text-sm">
										<code>{`# Certbotのインストール（Ubuntu/Debian）
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 証明書の取得（Nginx使用時）
sudo certbot --nginx -d example.com -d www.example.com

# 証明書の取得（スタンドアロン）
sudo certbot certonly --standalone -d example.com

# 証明書の自動更新テスト
sudo certbot renew --dry-run

# cronで自動更新を設定
echo "0 0,12 * * * root certbot renew --quiet" | sudo tee -a /etc/crontab`}</code>
									</pre>
								</div>
							</section>
						</div>
					)}

					{/* ベストプラクティスタブ */}
					{activeTab === "bestPractices" && (
						<div className="space-y-8">
							<section>
								<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
									TLS実装のベストプラクティス
								</h2>

								<div className="space-y-6">
									<div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
										<h3 className="font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
											<span className="text-2xl">✅</span>
											推奨設定
										</h3>
										<ul className="space-y-2 text-green-800 dark:text-green-200">
											<li className="flex items-start gap-2">
												<span>•</span>
												<span>TLS 1.2以上のみを許可（TLS 1.3推奨）</span>
											</li>
											<li className="flex items-start gap-2">
												<span>•</span>
												<span>
													強力な暗号スイートのみ使用（AEAD暗号、PFS対応）
												</span>
											</li>
											<li className="flex items-start gap-2">
												<span>•</span>
												<span>
													HSTS（Strict-Transport-Security）ヘッダーの設定
												</span>
											</li>
											<li className="flex items-start gap-2">
												<span>•</span>
												<span>証明書の有効期限を監視し、自動更新を設定</span>
											</li>
											<li className="flex items-start gap-2">
												<span>•</span>
												<span>OCSP Staplingを有効化</span>
											</li>
										</ul>
									</div>

									<div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700">
										<h3 className="font-bold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
											<span className="text-2xl">❌</span>
											避けるべき設定
										</h3>
										<ul className="space-y-2 text-red-800 dark:text-red-200">
											<li className="flex items-start gap-2">
												<span>•</span>
												<span>TLS 1.0、1.1の使用（脆弱性あり）</span>
											</li>
											<li className="flex items-start gap-2">
												<span>•</span>
												<span>弱い暗号スイート（RC4、3DES、MD5など）</span>
											</li>
											<li className="flex items-start gap-2">
												<span>•</span>
												<span>自己署名証明書の本番環境での使用</span>
											</li>
											<li className="flex items-start gap-2">
												<span>•</span>
												<span>証明書チェーンの不完全な設定</span>
											</li>
											<li className="flex items-start gap-2">
												<span>•</span>
												<span>HTTPとHTTPSの混在コンテンツ</span>
											</li>
										</ul>
									</div>
								</div>
							</section>

							<section>
								<h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
									パフォーマンス最適化
								</h3>
								<div className="grid md:grid-cols-2 gap-4">
									<div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
										<h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
											セッション再利用
										</h4>
										<p className="text-blue-700 dark:text-blue-300 text-sm">
											TLSセッションをキャッシュして、ハンドシェイクのオーバーヘッドを削減
										</p>
									</div>
									<div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
										<h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
											HTTP/2の活用
										</h4>
										<p className="text-purple-700 dark:text-purple-300 text-sm">
											TLS上でHTTP/2を使用し、多重化による高速化を実現
										</p>
									</div>
									<div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
										<h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
											TLS False Start
										</h4>
										<p className="text-orange-700 dark:text-orange-300 text-sm">
											ハンドシェイク完了前にデータ送信を開始し、レイテンシを削減
										</p>
									</div>
									<div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
										<h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
											CDNの活用
										</h4>
										<p className="text-indigo-700 dark:text-indigo-300 text-sm">
											エッジサーバーでTLS終端を行い、レスポンス時間を短縮
										</p>
									</div>
								</div>
							</section>

							<section>
								<h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
									セキュリティチェックリスト
								</h3>
								<div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
									<ul className="space-y-3">
										{[
											{
												id: "cert-expiry",
												text: "証明書の有効期限を90日以内に設定（Let's Encrypt推奨）",
											},
											{
												id: "caa-record",
												text: "CAA（Certificate Authority Authorization）レコードの設定",
											},
											{
												id: "cert-transparency",
												text: "証明書の透明性（Certificate Transparency）ログへの登録",
											},
											{
												id: "vuln-scan",
												text: "定期的な脆弱性スキャン（SSL Labs、testssl.sh）",
											},
											{
												id: "sec-headers",
												text: "セキュリティヘッダーの適切な設定",
											},
											{
												id: "tls-review",
												text: "TLSバージョンとサポート暗号スイートの定期的な見直し",
											},
											{
												id: "cert-pinning",
												text: "証明書ピンニングの検討（モバイルアプリの場合）",
											},
										].map((item) => (
											<li
												key={item.id}
												className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
											>
												<input
													type="checkbox"
													className="mt-1 rounded text-blue-600"
													id={`check-${item.id}`}
												/>
												<label htmlFor={`check-${item.id}`} className="flex-1">
													{item.text}
												</label>
											</li>
										))}
									</ul>
								</div>
							</section>

							<section>
								<h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
									便利なツール
								</h3>
								<div className="grid md:grid-cols-2 gap-4">
									<a
										href="https://www.ssllabs.com/ssltest/"
										target="_blank"
										rel="noopener noreferrer"
										className="block bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
									>
										<h4 className="font-semibold text-gray-900 dark:text-white mb-1">
											SSL Labs Server Test
										</h4>
										<p className="text-gray-600 dark:text-gray-400 text-sm">
											TLS設定の包括的な診断ツール
										</p>
									</a>
									<a
										href="https://mozilla.github.io/server-side-tls/ssl-config-generator/"
										target="_blank"
										rel="noopener noreferrer"
										className="block bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
									>
										<h4 className="font-semibold text-gray-900 dark:text-white mb-1">
											Mozilla SSL Config Generator
										</h4>
										<p className="text-gray-600 dark:text-gray-400 text-sm">
											各種サーバーのTLS設定生成ツール
										</p>
									</a>
								</div>
							</section>
						</div>
					)}
				</main>

				{/* フッター */}
				<footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
					<p className="text-sm">
						🔐
						TLSは常に進化しています。最新のセキュリティ動向を追い、定期的に設定を見直しましょう。
					</p>
				</footer>
			</div>
		</div>
	);
}
