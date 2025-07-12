/**
 * src/app/securities/basics/page.tsx
 *
 * セキュリティ基礎学習ページ
 * CIA、認証・認可、暗号化・ハッシュ化、脆弱性対策などの基礎知識を提供
 */

"use client";

import React, { useState } from "react";

/**
 * セキュリティ基礎学習ページ
 * 各セクションをタブで切り替えて学習できるインタラクティブなページ
 */
export default function SecurityBasicsPage() {
	const [activeTab, setActiveTab] = useState("overview");

	/**
	 * タブの定義
	 */
	const tabs = [
		{ id: "overview", name: "概要", icon: "🔐" },
		{ id: "cia", name: "CIA（3要素）", icon: "🛡️" },
		{ id: "auth", name: "認証・認可", icon: "🔑" },
		{ id: "crypto", name: "暗号化・ハッシュ", icon: "🔒" },
		{ id: "vulnerabilities", name: "脆弱性対策", icon: "⚠️" },
		{ id: "secure-coding", name: "セキュアコーディング", icon: "💻" },
	];

	/**
	 * タブコンテンツのレンダリング
	 */
	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return <OverviewSection />;
			case "cia":
				return <CIASection />;
			case "auth":
				return <AuthSection />;
			case "crypto":
				return <CryptoSection />;
			case "vulnerabilities":
				return <VulnerabilitiesSection />;
			case "secure-coding":
				return <SecureCodingSection />;
			default:
				return <OverviewSection />;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 dark:from-red-400 dark:via-orange-400 dark:to-yellow-400 bg-clip-text text-transparent mb-4">
						セキュリティ基礎
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						情報セキュリティの基本概念から実践的な対策手法まで、体系的に学習しましょう
					</p>
				</header>

				{/* タブナビゲーション */}
				<nav className="mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-2">
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									type="button"
									onClick={() => setActiveTab(tab.id)}
									className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
										activeTab === tab.id
											? "bg-red-500 text-white shadow-md"
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
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					🔐 セキュリティ基礎 概要
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
					現代のデジタル社会において、情報セキュリティは極めて重要な要素です。
					このコースでは、セキュリティの基本概念から実践的な対策まで、
					体系的に学習します。
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-8 mb-8">
				<div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						🎯 学習目標
					</h3>
					<ul className="space-y-2 text-gray-600 dark:text-gray-400">
						<li>• セキュリティの3大要素（CIA）を理解する</li>
						<li>• 認証と認可の仕組みを学ぶ</li>
						<li>• 暗号化とハッシュ化の違いを説明できる</li>
						<li>• 代表的な脆弱性と対策を習得する</li>
						<li>• セキュアコーディングの実践方法を身につける</li>
					</ul>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						📝 重要なポイント
					</h3>
					<div className="space-y-3">
						<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
							<p className="text-blue-800 dark:text-blue-200 text-sm">
								<strong>セキュリティは後付けできない</strong>
								<br />
								設計段階からセキュリティを考慮することが重要
							</p>
						</div>
						<div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
							<p className="text-yellow-800 dark:text-yellow-200 text-sm">
								<strong>攻撃者の視点を持つ</strong>
								<br />
								どのような攻撃が可能かを理解して対策を立てる
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
				<h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-3">
					💡 学習のコツ
				</h3>
				<p className="text-red-700 dark:text-red-300 mb-3">
					セキュリティ学習では、理論と実践の両方が重要です。
					各概念を学んだら、実際のシステムでどのように適用されるかを考えてみましょう。
				</p>
				<div className="grid md:grid-cols-2 gap-4 text-sm">
					<div>
						<h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
							理論学習
						</h4>
						<ul className="space-y-1 text-red-700 dark:text-red-300">
							<li>• 基本概念の理解</li>
							<li>• 攻撃手法の分類</li>
							<li>• 対策技術の原理</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
							実践学習
						</h4>
						<ul className="space-y-1 text-red-700 dark:text-red-300">
							<li>• セキュリティツールの使用</li>
							<li>• 脆弱性診断の実施</li>
							<li>• セキュアコードの実装</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * CIA（3要素）セクション
 */
function CIASection() {
	return (
		<div className="p-8">
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					🛡️ CIA - セキュリティの3大要素
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
					情報セキュリティの基本は、機密性（Confidentiality）、完全性（Integrity）、
					可用性（Availability）の3つの要素で構成されます。
				</p>
			</div>

			<div className="space-y-8">
				{/* 機密性 */}
				<div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
					<h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
						🔒 機密性（Confidentiality）
					</h3>
					<p className="text-blue-800 dark:text-blue-200 mb-4">
						許可された人だけが情報にアクセスできることを保証します。
					</p>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
								実現方法
							</h4>
							<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
								<li>• アクセス制御（認証・認可）</li>
								<li>• 暗号化技術</li>
								<li>• ネットワーク分離</li>
								<li>• 物理的セキュリティ</li>
							</ul>
						</div>
						<div>
							<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
								脅威例
							</h4>
							<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
								<li>• 不正アクセス</li>
								<li>• 盗聴・傍受</li>
								<li>• 内部犯行</li>
								<li>• ソーシャルエンジニアリング</li>
							</ul>
						</div>
					</div>
				</div>

				{/* 完全性 */}
				<div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
					<h3 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-4">
						✅ 完全性（Integrity）
					</h3>
					<p className="text-green-800 dark:text-green-200 mb-4">
						情報が改ざんされていないことを保証します。
					</p>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
								実現方法
							</h4>
							<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
								<li>• デジタル署名</li>
								<li>• ハッシュ値による検証</li>
								<li>• バージョン管理</li>
								<li>• 改ざん検知システム</li>
							</ul>
						</div>
						<div>
							<h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
								脅威例
							</h4>
							<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
								<li>• データ改ざん</li>
								<li>• SQLインジェクション</li>
								<li>• マルウェア感染</li>
								<li>• 中間者攻撃</li>
							</ul>
						</div>
					</div>
				</div>

				{/* 可用性 */}
				<div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
					<h3 className="text-2xl font-semibold text-orange-900 dark:text-orange-100 mb-4">
						⚡ 可用性（Availability）
					</h3>
					<p className="text-orange-800 dark:text-orange-200 mb-4">
						必要な時に情報やシステムが利用できることを保証します。
					</p>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
								実現方法
							</h4>
							<ul className="space-y-2 text-orange-700 dark:text-orange-300 text-sm">
								<li>• 冗長化（レプリケーション）</li>
								<li>• 負荷分散</li>
								<li>• バックアップ・復旧計画</li>
								<li>• DDoS攻撃対策</li>
							</ul>
						</div>
						<div>
							<h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
								脅威例
							</h4>
							<ul className="space-y-2 text-orange-700 dark:text-orange-300 text-sm">
								<li>• DDoS攻撃</li>
								<li>• システム障害</li>
								<li>• ランサムウェア</li>
								<li>• 自然災害</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
				<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
					📚 チェックリスト
				</h3>
				<div className="grid md:grid-cols-3 gap-4">
					<div>
						<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
							機密性
						</h4>
						<ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
							<li>□ アクセス制御を理解</li>
							<li>□ 暗号化の必要性を認識</li>
							<li>□ 情報分類ができる</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
							完全性
						</h4>
						<ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
							<li>□ ハッシュ値の意味を理解</li>
							<li>□ 改ざん検知方法を知る</li>
							<li>□ バックアップの重要性を認識</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
							可用性
						</h4>
						<ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
							<li>□ 冗長化の概念を理解</li>
							<li>□ 障害対応計画を立てられる</li>
							<li>□ SLAの意味を知る</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * 認証・認可セクション
 */
function AuthSection() {
	return (
		<div className="p-8">
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					🔑 認証・認可
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
					認証は「誰なのか」を確認し、認可は「何ができるか」を制限する仕組みです。
					この2つの違いを理解することは、セキュリティ設計の基本です。
				</p>
			</div>

			<div className="space-y-8">
				{/* 認証 */}
				<div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
					<h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
						👤 認証（Authentication）
					</h3>
					<p className="text-blue-800 dark:text-blue-200 mb-4">
						ユーザーが本人であることを確認するプロセスです。
					</p>

					<div className="space-y-6">
						<div>
							<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
								認証の3要素
							</h4>
							<div className="grid md:grid-cols-3 gap-4">
								<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
									<h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
										知識要素 (Something you know)
									</h5>
									<ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
										<li>• パスワード</li>
										<li>• PIN</li>
										<li>• 秘密の質問</li>
									</ul>
								</div>
								<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
									<h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
										所有要素 (Something you have)
									</h5>
									<ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
										<li>• ICカード</li>
										<li>• スマートフォン</li>
										<li>• ハードウェアトークン</li>
									</ul>
								</div>
								<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
									<h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
										生体要素 (Something you are)
									</h5>
									<ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
										<li>• 指紋</li>
										<li>• 顔認証</li>
										<li>• 虹彩</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
							<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
								多要素認証（MFA）
							</h4>
							<p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
								複数の認証要素を組み合わせることで、セキュリティを強化します。
							</p>
							<div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded text-blue-800 dark:text-blue-200 text-sm">
								<strong>例:</strong> パスワード（知識） + SMS認証（所有） =
								2要素認証
							</div>
						</div>
					</div>
				</div>

				{/* 認可 */}
				<div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
					<h3 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-4">
						🚪 認可（Authorization）
					</h3>
					<p className="text-green-800 dark:text-green-200 mb-4">
						認証されたユーザーがどのリソースにアクセスできるかを制御します。
					</p>

					<div className="space-y-6">
						<div>
							<h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
								アクセス制御モデル
							</h4>
							<div className="grid md:grid-cols-2 gap-4">
								<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
									<h5 className="font-medium text-green-900 dark:text-green-100 mb-2">
										ロールベースアクセス制御（RBAC）
									</h5>
									<p className="text-green-700 dark:text-green-300 text-sm mb-2">
										ユーザーに役割（ロール）を割り当て、ロールに基づいてアクセス権を管理
									</p>
									<div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-green-800 dark:text-green-200 text-xs">
										管理者、編集者、閲覧者など
									</div>
								</div>
								<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
									<h5 className="font-medium text-green-900 dark:text-green-100 mb-2">
										属性ベースアクセス制御（ABAC）
									</h5>
									<p className="text-green-700 dark:text-green-300 text-sm mb-2">
										ユーザー、リソース、環境の属性を基に動的にアクセス制御
									</p>
									<div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-green-800 dark:text-green-200 text-xs">
										時間、場所、デバイスなどを考慮
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
							<h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
								最小権限の原則
							</h4>
							<p className="text-green-700 dark:text-green-300 text-sm">
								ユーザーには業務に必要最小限の権限のみを付与し、
								定期的に権限の見直しを行うことが重要です。
							</p>
						</div>
					</div>
				</div>

				{/* 実装例 */}
				<div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						💻 実装例
					</h3>
					<div className="space-y-4">
						<div>
							<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
								JWT（JSON Web Token）を使った認証
							</h4>
							<pre className="bg-gray-900 dark:bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
								{`// JWT認証の例
const jwt = require('jsonwebtoken');

// トークン生成
const token = jwt.sign(
  { userId: 123, role: 'admin' },
  'secret-key',
  { expiresIn: '1h' }
);

// トークン検証
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, 'secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};`}
							</pre>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
				<h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
					📝 チェックリスト
				</h3>
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
							認証
						</h4>
						<ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
							<li>□ 認証の3要素を理解する</li>
							<li>□ 多要素認証の重要性を認識する</li>
							<li>□ パスワードポリシーを設定できる</li>
							<li>□ セッション管理を適切に実装できる</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
							認可
						</h4>
						<ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
							<li>□ 認証と認可の違いを説明できる</li>
							<li>□ RBACとABACの違いを理解する</li>
							<li>□ 最小権限の原則を実践できる</li>
							<li>□ アクセス制御リストを設計できる</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * 暗号化・ハッシュセクション
 */
function CryptoSection() {
	return (
		<div className="p-8">
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					🔒 暗号化・ハッシュ化
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
					暗号化は「元に戻せる」形でデータを保護し、ハッシュ化は「元に戻せない」形で
					データを変換します。この違いを理解することが重要です。
				</p>
			</div>

			<div className="space-y-8">
				{/* 暗号化 */}
				<div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
					<h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
						🔐 暗号化（Encryption）
					</h3>
					<p className="text-blue-800 dark:text-blue-200 mb-4">
						データを秘密鍵で変換し、同じ鍵（または対応する鍵）で元に戻すことができます。
					</p>

					<div className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
									対称暗号化
								</h4>
								<p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
									暗号化と復号化に同じ鍵を使用します。
								</p>
								<ul className="text-blue-600 dark:text-blue-400 text-sm space-y-1">
									<li>• 高速処理が可能</li>
									<li>• 大量データに適している</li>
									<li>• 鍵の共有が課題</li>
								</ul>
								<div className="mt-3 bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-blue-800 dark:text-blue-200 text-xs">
									<strong>例:</strong> AES、DES、3DES
								</div>
							</div>
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
									非対称暗号化（公開鍵暗号）
								</h4>
								<p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
									暗号化と復号化に異なる鍵を使用します。
								</p>
								<ul className="text-blue-600 dark:text-blue-400 text-sm space-y-1">
									<li>• 鍵交換が安全</li>
									<li>• デジタル署名に利用</li>
									<li>• 処理が重い</li>
								</ul>
								<div className="mt-3 bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-blue-800 dark:text-blue-200 text-xs">
									<strong>例:</strong> RSA、ECC、ElGamal
								</div>
							</div>
						</div>

						<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
							<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
								暗号化の実装例
							</h4>
							<pre className="bg-gray-900 dark:bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
								{`// Node.js での AES 暗号化例
const crypto = require('crypto');

// 暗号化
function encrypt(text, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// 復号化
function decrypt(encryptedText, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}`}
							</pre>
						</div>
					</div>
				</div>

				{/* ハッシュ化 */}
				<div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
					<h3 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-4">
						🔗 ハッシュ化（Hashing）
					</h3>
					<p className="text-green-800 dark:text-green-200 mb-4">
						データを固定長の値に変換し、元のデータを復元することができません。
					</p>

					<div className="space-y-6">
						<div>
							<h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
								ハッシュ関数の特徴
							</h4>
							<div className="grid md:grid-cols-2 gap-4">
								<ul className="text-green-700 dark:text-green-300 text-sm space-y-2">
									<li>
										• <strong>一方向性:</strong> 元データの復元は困難
									</li>
									<li>
										• <strong>決定性:</strong> 同じ入力は同じ出力
									</li>
									<li>
										• <strong>固定長:</strong> 出力サイズは一定
									</li>
								</ul>
								<ul className="text-green-700 dark:text-green-300 text-sm space-y-2">
									<li>
										• <strong>雪崩効果:</strong> 小さな変更で大きく変化
									</li>
									<li>
										• <strong>衝突耐性:</strong> 同じ出力になりにくい
									</li>
									<li>
										• <strong>高速計算:</strong> 効率的に計算可能
									</li>
								</ul>
							</div>
						</div>

						<div>
							<h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
								主要なハッシュアルゴリズム
							</h4>
							<div className="grid md:grid-cols-3 gap-4">
								<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
									<h5 className="font-medium text-green-900 dark:text-green-100 mb-1">
										MD5
									</h5>
									<p className="text-green-700 dark:text-green-300 text-xs">
										128bit、脆弱性あり、現在は非推奨
									</p>
								</div>
								<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
									<h5 className="font-medium text-green-900 dark:text-green-100 mb-1">
										SHA-256
									</h5>
									<p className="text-green-700 dark:text-green-300 text-xs">
										256bit、現在最も一般的
									</p>
								</div>
								<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
									<h5 className="font-medium text-green-900 dark:text-green-100 mb-1">
										bcrypt
									</h5>
									<p className="text-green-700 dark:text-green-300 text-xs">
										パスワード専用、ソルト内蔵
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
							<h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
								パスワードハッシュ化の実装例
							</h4>
							<pre className="bg-gray-900 dark:bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
								{`// bcrypt を使ったパスワードハッシュ化
const bcrypt = require('bcrypt');

// パスワードをハッシュ化
async function hashPassword(password) {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// パスワードを検証
async function verifyPassword(password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}`}
							</pre>
						</div>
					</div>
				</div>

				{/* 使い分け */}
				<div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
					<h3 className="text-2xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
						⚖️ 暗号化 vs ハッシュ化の使い分け
					</h3>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
							<h4 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
								暗号化を使う場面
							</h4>
							<ul className="text-purple-700 dark:text-purple-300 text-sm space-y-2">
								<li>• データベースの機密情報</li>
								<li>• 通信内容の保護（HTTPS）</li>
								<li>• ファイルの暗号化保存</li>
								<li>• 決済情報の保護</li>
								<li>• 個人情報の保存</li>
							</ul>
						</div>
						<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
							<h4 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
								ハッシュ化を使う場面
							</h4>
							<ul className="text-purple-700 dark:text-purple-300 text-sm space-y-2">
								<li>• パスワードの保存</li>
								<li>• データの完全性チェック</li>
								<li>• デジタル署名</li>
								<li>• ファイルの改ざん検知</li>
								<li>• セッション管理</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
				<h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
					📝 チェックリスト
				</h3>
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
							暗号化
						</h4>
						<ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
							<li>□ 対称暗号と非対称暗号の違いを理解する</li>
							<li>□ 適切な暗号化アルゴリズムを選択できる</li>
							<li>□ 鍵管理の重要性を認識する</li>
							<li>□ HTTPS通信の仕組みを説明できる</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
							ハッシュ化
						</h4>
						<ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
							<li>□ ハッシュ関数の特徴を理解する</li>
							<li>□ ソルト付きハッシュの必要性を認識する</li>
							<li>□ 適切なハッシュアルゴリズムを選択できる</li>
							<li>□ レインボーテーブル攻撃を理解する</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * 脆弱性対策セクション
 */
function VulnerabilitiesSection() {
	return (
		<div className="p-8">
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					⚠️ 脆弱性対策
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
					代表的な脆弱性とその対策方法を学び、安全なシステムを構築するための
					知識を身につけましょう。
				</p>
			</div>

			<div className="space-y-8">
				{/* OWASP Top 10 */}
				<div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
					<h3 className="text-2xl font-semibold text-red-900 dark:text-red-100 mb-4">
						🔝 OWASP Top 10（2021年版）
					</h3>
					<p className="text-red-800 dark:text-red-200 mb-4">
						最も重要なWebアプリケーションセキュリティリスクのトップ10
					</p>

					<div className="grid md:grid-cols-2 gap-4">
						<div className="space-y-3">
							<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
								<h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
									A01: アクセス制御の不備
								</h4>
								<p className="text-red-700 dark:text-red-300 text-xs">
									権限チェックの欠如や不適切な実装
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
								<h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
									A02: 暗号化の不備
								</h4>
								<p className="text-red-700 dark:text-red-300 text-xs">
									機密データの暗号化漏れや弱い暗号化
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
								<h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
									A03: インジェクション
								</h4>
								<p className="text-red-700 dark:text-red-300 text-xs">
									SQLインジェクション、NoSQLインジェクション
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
								<h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
									A04: セキュアでない設計
								</h4>
								<p className="text-red-700 dark:text-red-300 text-xs">
									設計段階でのセキュリティ考慮不足
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
								<h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
									A05: セキュリティ設定ミス
								</h4>
								<p className="text-red-700 dark:text-red-300 text-xs">
									デフォルト設定の使用や不適切な設定
								</p>
							</div>
						</div>
						<div className="space-y-3">
							<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
								<h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
									A06: 脆弱で古いコンポーネント
								</h4>
								<p className="text-red-700 dark:text-red-300 text-xs">
									脆弱性のあるライブラリやフレームワーク
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
								<h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
									A07: 認証と認可の不備
								</h4>
								<p className="text-red-700 dark:text-red-300 text-xs">
									弱い認証機能や認可の欠如
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
								<h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
									A08: ソフトウェアとデータの完全性の不備
								</h4>
								<p className="text-red-700 dark:text-red-300 text-xs">
									改ざん検知や検証機能の不備
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
								<h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
									A09: セキュリティログと監視の不備
								</h4>
								<p className="text-red-700 dark:text-red-300 text-xs">
									攻撃の検知や対応機能の不足
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
								<h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
									A10: サーバーサイドリクエストフォージェリ
								</h4>
								<p className="text-red-700 dark:text-red-300 text-xs">
									SSRF攻撃による内部リソースへの不正アクセス
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* 代表的な攻撃手法と対策 */}
				<div className="space-y-6">
					{/* XSS */}
					<div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
						<h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">
							🚨 クロスサイトスクリプティング（XSS）
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
									攻撃の概要
								</h4>
								<p className="text-orange-700 dark:text-orange-300 text-sm mb-3">
									悪意のあるスクリプトをWebページに注入し、他のユーザーのブラウザで実行させる攻撃
								</p>
								<ul className="text-orange-600 dark:text-orange-400 text-sm space-y-1">
									<li>• Cookie盗取</li>
									<li>• セッションハイジャック</li>
									<li>• フィッシング攻撃</li>
								</ul>
							</div>
							<div>
								<h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
									対策方法
								</h4>
								<ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
									<li>• 入力値のサニタイゼーション</li>
									<li>• 出力時のエスケープ処理</li>
									<li>• Content Security Policy（CSP）</li>
									<li>• HTTPOnlyクッキーの使用</li>
								</ul>
								<div className="mt-3 bg-orange-100 dark:bg-orange-900/30 p-2 rounded text-orange-800 dark:text-orange-200 text-xs">
									<code>&lt;script&gt;</code>タグや<code>javascript:</code>
									の無効化
								</div>
							</div>
						</div>
					</div>

					{/* CSRF */}
					<div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
						<h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
							🎭 クロスサイトリクエストフォージェリ（CSRF）
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
									攻撃の概要
								</h4>
								<p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
									ユーザーが意図しない操作を、ユーザーの権限で実行させる攻撃
								</p>
								<ul className="text-yellow-600 dark:text-yellow-400 text-sm space-y-1">
									<li>• 不正な送金処理</li>
									<li>• アカウント設定変更</li>
									<li>• 投稿・削除操作</li>
								</ul>
							</div>
							<div>
								<h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
									対策方法
								</h4>
								<ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
									<li>• CSRFトークンの実装</li>
									<li>• SameSiteクッキー属性</li>
									<li>• Refererヘッダーの検証</li>
									<li>• 重要操作での再認証</li>
								</ul>
								<div className="mt-3 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded text-yellow-800 dark:text-yellow-200 text-xs">
									各フォームに一意のトークンを埋め込み
								</div>
							</div>
						</div>
					</div>

					{/* SQLインジェクション */}
					<div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
						<h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
							💉 SQLインジェクション
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
									攻撃の概要
								</h4>
								<p className="text-purple-700 dark:text-purple-300 text-sm mb-3">
									SQLクエリに悪意のあるコードを注入し、データベースを不正操作する攻撃
								</p>
								<ul className="text-purple-600 dark:text-purple-400 text-sm space-y-1">
									<li>• 機密データの漏洩</li>
									<li>• データの改ざん・削除</li>
									<li>• 認証回避</li>
								</ul>
							</div>
							<div>
								<h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
									対策方法
								</h4>
								<ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
									<li>• プリペアドステートメント</li>
									<li>• パラメータ化クエリ</li>
									<li>• 入力値の検証・サニタイゼーション</li>
									<li>• 最小権限でのDB接続</li>
								</ul>
								<div className="mt-3 bg-purple-100 dark:bg-purple-900/30 p-2 rounded text-purple-800 dark:text-purple-200 text-xs">
									直接的な文字列結合を避け、バインド変数を使用
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
				<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
					📚 チェックリスト
				</h3>
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
							脆弱性の理解
						</h4>
						<ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
							<li>□ OWASP Top 10を理解する</li>
							<li>□ XSS攻撃の仕組みを説明できる</li>
							<li>□ CSRF攻撃の手法を理解する</li>
							<li>□ SQLインジェクションの危険性を認識する</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
							対策の実装
						</h4>
						<ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
							<li>□ 入力値検証を適切に実装できる</li>
							<li>□ CSRFトークンを実装できる</li>
							<li>□ プリペアドステートメントを使用できる</li>
							<li>□ セキュリティヘッダーを設定できる</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * セキュアコーディングセクション
 */
function SecureCodingSection() {
	return (
		<div className="p-8">
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					💻 セキュアコーディング
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
					セキュリティを考慮したコードの書き方と、開発プロセスに組み込むべき
					セキュリティ対策について学習します。
				</p>
			</div>

			<div className="space-y-8">
				{/* セキュアコーディングの原則 */}
				<div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
					<h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
						📋 セキュアコーディングの原則
					</h3>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
									1. 入力値の検証
								</h4>
								<p className="text-blue-700 dark:text-blue-300 text-sm">
									すべての入力に対して適切な検証を行い、想定外の値を排除する
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
									2. 最小権限の原則
								</h4>
								<p className="text-blue-700 dark:text-blue-300 text-sm">
									必要最小限の権限のみを付与し、不要な機能へのアクセスを制限する
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
									3. 多層防御
								</h4>
								<p className="text-blue-700 dark:text-blue-300 text-sm">
									複数のセキュリティ対策を組み合わせて、包括的な防御を構築する
								</p>
							</div>
						</div>
						<div className="space-y-4">
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
									4. 情報の最小化
								</h4>
								<p className="text-blue-700 dark:text-blue-300 text-sm">
									エラーメッセージや情報開示を最小限に抑え、攻撃の手がかりを与えない
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
									5. セキュアなデフォルト
								</h4>
								<p className="text-blue-700 dark:text-blue-300 text-sm">
									デフォルトでセキュアな設定を使用し、明示的に許可したもののみアクセスを許可
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
									6. 定期的な見直し
								</h4>
								<p className="text-blue-700 dark:text-blue-300 text-sm">
									セキュリティ対策の効果を定期的に評価し、必要に応じて改善する
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* 実装例 */}
				<div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
					<h3 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-4">
						🔧 実装例とベストプラクティス
					</h3>

					<div className="space-y-6">
						<div>
							<h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
								入力値検証の実装
							</h4>
							<pre className="bg-gray-900 dark:bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
								{`// Node.js + Express での入力値検証例
const { body, validationResult } = require('express-validator');

// バリデーションルール
const userValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('有効なメールアドレスを入力してください'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('パスワードは8文字以上で、大文字、小文字、数字、記号を含む必要があります'),
  body('age')
    .isInt({ min: 0, max: 120 })
    .withMessage('年齢は0-120の整数で入力してください')
];

// エンドポイント
app.post('/register', userValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // 処理続行
});`}
							</pre>
						</div>

						<div>
							<h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
								SQLインジェクション対策
							</h4>
							<pre className="bg-gray-900 dark:bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
								{`// プリペアドステートメントの使用例

// ❌ 危険: 文字列結合
const badQuery = \`SELECT * FROM users WHERE id = '\${userId}'\`;

// ✅ 安全: プリペアドステートメント
const safeQuery = 'SELECT * FROM users WHERE id = ?';
db.query(safeQuery, [userId], (err, results) => {
  // 処理
});

// ORMを使用する場合（Sequelize例）
const user = await User.findOne({
  where: { id: userId } // 自動的にパラメータ化される
});`}
							</pre>
						</div>

						<div>
							<h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
								XSS対策の実装
							</h4>
							<pre className="bg-gray-900 dark:bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
								{`// HTMLエスケープの実装
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// テンプレートエンジンでの自動エスケープ（Handlebars例）
// {{userInput}} - 自動エスケープ
// {{{userInput}}} - エスケープなし（危険）

// Content Security Policy ヘッダーの設定
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  next();
});`}
							</pre>
						</div>
					</div>
				</div>

				{/* セキュリティツール */}
				<div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
					<h3 className="text-2xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
						🛠️ セキュリティツールの活用
					</h3>

					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
								静的解析ツール（SAST）
							</h4>
							<ul className="text-purple-700 dark:text-purple-300 text-sm space-y-2">
								<li>
									• <strong>SonarQube:</strong>{" "}
									コード品質とセキュリティの総合的分析
								</li>
								<li>
									• <strong>ESLint Security:</strong>{" "}
									JavaScript用セキュリティルール
								</li>
								<li>
									• <strong>Bandit:</strong> Python用セキュリティ問題検出
								</li>
								<li>
									• <strong>Brakeman:</strong> Ruby on Rails用脆弱性スキャナー
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
								動的解析ツール（DAST）
							</h4>
							<ul className="text-purple-700 dark:text-purple-300 text-sm space-y-2">
								<li>
									• <strong>OWASP ZAP:</strong>{" "}
									Webアプリケーション脆弱性スキャナー
								</li>
								<li>
									• <strong>Burp Suite:</strong> Webセキュリティテストツール
								</li>
								<li>
									• <strong>Nikto:</strong> Webサーバー脆弱性スキャナー
								</li>
								<li>
									• <strong>SQLMap:</strong> SQLインジェクション検出ツール
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg">
						<h4 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
							CI/CDパイプラインへの統合例
						</h4>
						<pre className="bg-gray-900 dark:bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
							{`# GitHub Actions での例
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      # 依存関係の脆弱性チェック
      - name: Run npm audit
        run: npm audit --audit-level moderate
        
      # 静的解析
      - name: Run ESLint Security
        run: npx eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.security.js
        
      # OWASP ZAP による動的解析
      - name: ZAP Scan
        uses: zaproxy/action-full-scan@v0.4.0
        with:
          target: 'http://localhost:3000'`}
						</pre>
					</div>
				</div>

				{/* セキュリティ開発ライフサイクル */}
				<div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
					<h3 className="text-2xl font-semibold text-orange-900 dark:text-orange-100 mb-4">
						🔄 セキュリティ開発ライフサイクル（SDL）
					</h3>

					<div className="space-y-4">
						<div className="grid md:grid-cols-3 gap-4">
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
									設計段階
								</h4>
								<ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
									<li>• 脅威モデリング</li>
									<li>• セキュリティ要件定義</li>
									<li>• アーキテクチャレビュー</li>
								</ul>
							</div>
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
									開発段階
								</h4>
								<ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
									<li>• セキュアコーディング</li>
									<li>• コードレビュー</li>
									<li>• 静的解析</li>
								</ul>
							</div>
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
								<h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
									テスト段階
								</h4>
								<ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
									<li>• 脆弱性診断</li>
									<li>• ペネトレーションテスト</li>
									<li>• 動的解析</li>
								</ul>
							</div>
						</div>

						<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
							<h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
								運用・保守段階
							</h4>
							<div className="grid md:grid-cols-2 gap-4">
								<ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
									<li>• セキュリティ監視</li>
									<li>• インシデント対応</li>
									<li>• 定期的な脆弱性診断</li>
								</ul>
								<ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
									<li>• セキュリティパッチ適用</li>
									<li>• 脅威インテリジェンス活用</li>
									<li>• セキュリティ教育・訓練</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
				<h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
					📝 チェックリスト
				</h3>
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
							コーディング実践
						</h4>
						<ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
							<li>□ 入力値検証を適切に実装できる</li>
							<li>□ プリペアドステートメントを使用する</li>
							<li>□ 出力時のエスケープ処理を行う</li>
							<li>□ セキュリティヘッダーを設定する</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
							開発プロセス
						</h4>
						<ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
							<li>□ セキュリティツールを活用できる</li>
							<li>□ コードレビューでセキュリティを確認する</li>
							<li>□ CI/CDにセキュリティチェックを組み込む</li>
							<li>□ 脅威モデリングを実践する</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
