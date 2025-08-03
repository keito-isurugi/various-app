"use client";

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	Building,
	CheckCircle,
	ChevronRight,
	Cloud,
	CreditCard,
	Eye,
	Globe,
	Key,
	Link as LinkIcon,
	Lock,
	LogIn,
	Shield,
	User,
	UserCheck,
	Users,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/**
 * 日常生活の例でOIDCの価値を説明するカード
 */
const ValueCard = ({
	title,
	scenario,
	benefit,
	icon: Icon,
	bgColor,
}: {
	title: string;
	scenario: string;
	benefit: string;
	icon: React.ElementType;
	bgColor: string;
}) => {
	return (
		<div className={`rounded-lg p-6 ${bgColor} border border-gray-200`}>
			<div className="flex items-start gap-4">
				<div className="p-3 rounded-full bg-white shadow-sm">
					<Icon className="w-6 h-6 text-gray-700" />
				</div>
				<div className="flex-1">
					<h3 className="text-lg font-bold mb-3 text-gray-800">{title}</h3>
					<div className="space-y-3">
						<div className="p-3 bg-white/70 rounded-md">
							<p className="text-sm text-gray-700">
								<span className="font-semibold">シナリオ：</span>
								<br />
								{scenario}
							</p>
						</div>
						<div className="p-3 bg-white/50 rounded-md">
							<p className="text-sm text-gray-600">
								<span className="font-semibold">OIDCの価値：</span>
								<br />
								{benefit}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * OAuth 2.0とOIDCの比較表コンポーネント
 */
const ComparisonTable = () => {
	const comparisons = [
		{
			aspect: "目的",
			oauth2: "権限の委譲（認可）",
			oidc: "身元確認 + 権限の委譲（認証 + 認可）",
		},
		{
			aspect: "取得する情報",
			oauth2: "アクセストークンのみ",
			oidc: "IDトークン + アクセストークン",
		},
		{
			aspect: "身元確認",
			oauth2: "✗ 「誰か」は分からない",
			oidc: "✓ 「誰か」が分かる",
		},
		{
			aspect: "標準化レベル",
			oauth2: "フレームワーク（実装に幅がある）",
			oidc: "厳格な仕様（統一された実装）",
		},
		{
			aspect: "適用例",
			oauth2: "API連携、権限付与",
			oidc: "ログイン、SSO、身元確認",
		},
	];

	return (
		<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
			<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4">
				<h4 className="font-semibold text-gray-800">OAuth 2.0 vs OIDC</h4>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
								比較項目
							</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
								OAuth 2.0
							</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
								OIDC
							</th>
						</tr>
					</thead>
					<tbody>
						{comparisons.map((item, index) => (
							<tr
								key={item.aspect}
								className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
							>
								<td className="px-4 py-3 text-sm font-medium text-gray-800">
									{item.aspect}
								</td>
								<td className="px-4 py-3 text-sm text-gray-600">
									{item.oauth2}
								</td>
								<td className="px-4 py-3 text-sm text-gray-600">{item.oidc}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

/**
 * IDトークンの中身を視覚的に表示するコンポーネント
 */
const TokenVisualization = ({
	isExpanded,
	onToggle,
}: { isExpanded: boolean; onToggle: () => void }) => {
	const tokenClaims = [
		{ key: "sub", value: "248289761001", description: "ユーザーの一意ID" },
		{ key: "name", value: "山田太郎", description: "ユーザーの名前" },
		{
			key: "email",
			value: "yamada@example.com",
			description: "メールアドレス",
		},
		{
			key: "picture",
			value: "https://...",
			description: "プロフィール写真のURL",
		},
		{
			key: "iss",
			value: "https://accounts.google.com",
			description: "トークン発行者",
		},
		{
			key: "aud",
			value: "your-app-client-id",
			description: "トークンの対象アプリ",
		},
		{ key: "exp", value: "1640995200", description: "有効期限" },
	];

	return (
		<div className="bg-white rounded-lg border border-gray-200">
			<div className="p-4 border-b border-gray-200">
				<button
					type="button"
					onClick={onToggle}
					className="flex items-center justify-between w-full text-left"
				>
					<h4 className="font-semibold text-gray-800 flex items-center gap-2">
						<Eye className="w-5 h-5 text-blue-600" />
						IDトークンの中身を見てみよう
					</h4>
					<ChevronRight
						className={`w-5 h-5 text-gray-400 transition-transform ${
							isExpanded ? "rotate-90" : ""
						}`}
					/>
				</button>
			</div>

			<div
				className={`overflow-hidden transition-all duration-300 ${
					isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="p-4">
					<p className="text-sm text-gray-600 mb-4">
						IDトークンには、以下のようなユーザー情報が含まれています：
					</p>
					<div className="space-y-3">
						{tokenClaims.map((claim) => (
							<div
								key={claim.key}
								className="flex items-start gap-3 p-3 bg-gray-50 rounded"
							>
								<code className="text-sm text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded min-w-16">
									{claim.key}
								</code>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-800 mb-1">
										{claim.value}
									</p>
									<p className="text-xs text-gray-500">{claim.description}</p>
								</div>
							</div>
						))}
					</div>
					<div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
						<p className="text-xs text-gray-600">
							💡
							実際のIDトークンは暗号化されており、アプリが安全に検証・利用できます
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * SSOの価値を説明するカード
 */
const SSOCard = ({
	scenario,
	without,
	with: withSSO,
}: {
	scenario: string;
	without: string;
	with: string;
}) => {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-5">
			<h4 className="font-semibold text-gray-800 mb-3">{scenario}</h4>
			<div className="space-y-4">
				<div className="p-3 bg-red-50 border border-red-200 rounded">
					<div className="flex items-start gap-2">
						<XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
						<div>
							<p className="text-sm font-semibold text-red-700">
								SSOなしの場合
							</p>
							<p className="text-sm text-gray-600">{without}</p>
						</div>
					</div>
				</div>
				<div className="p-3 bg-green-50 border border-green-200 rounded">
					<div className="flex items-start gap-2">
						<CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
						<div>
							<p className="text-sm font-semibold text-green-700">
								SSOありの場合
							</p>
							<p className="text-sm text-gray-600">{withSSO}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * サービス例カード
 */
const ServiceCard = ({
	service,
	logo,
	description,
	oidcFeatures,
}: {
	service: string;
	logo: string;
	description: string;
	oidcFeatures: string[];
}) => {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
			<div className="flex items-center gap-3 mb-4">
				<div className="text-2xl">{logo}</div>
				<h4 className="font-semibold text-gray-800">{service}</h4>
			</div>
			<p className="text-sm text-gray-600 mb-3">{description}</p>
			<div className="space-y-2">
				<p className="text-xs font-semibold text-gray-500">OIDCの特徴：</p>
				{oidcFeatures.map((feature) => (
					<div key={feature} className="flex items-start gap-2">
						<CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
						<span className="text-xs text-gray-600">{feature}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default function OIDCPage() {
	// IDトークン表示の状態管理
	const [isTokenExpanded, setIsTokenExpanded] = useState(false);

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* ヘッダー */}
				<div className="mb-8">
					<Link
						href="/auth"
						className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>認証・認可の基礎に戻る</span>
					</Link>

					<div className="text-center mb-12">
						<div className="flex justify-center mb-4">
							<div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full">
								<Cloud className="w-12 h-12 text-purple-600" />
							</div>
						</div>
						<h1 className="text-4xl font-bold text-gray-800 mb-4">
							OpenID Connect (OIDC)
						</h1>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto">
							OAuth 2.0に「身元確認」機能を追加した現代的な認証標準
							<br />
							シングルサインオン（SSO）を実現し、安全で便利なログイン体験を提供
						</p>
					</div>
				</div>

				{/* OIDCとOAuth 2.0の関係 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<LinkIcon className="w-6 h-6 text-purple-600" />
						OIDCとOAuth 2.0の関係
					</h2>

					<div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-8">
						<div className="grid md:grid-cols-2 gap-8 items-center">
							<div>
								<h3 className="text-lg font-bold text-gray-800 mb-4">
									🏗️ OIDCは「OAuth 2.0の拡張版」
								</h3>
								<p className="text-gray-700 leading-relaxed mb-4">
									OpenID Connect（OIDC）は、OAuth 2.0の
									<strong>上に構築された</strong>
									認証レイヤーです。OAuth 2.0の「権限委譲」機能に加えて、
									<span className="bg-yellow-200 px-2 py-1 rounded">
										「誰がログインしたか」
									</span>
									を確実に知ることができます。
								</p>
							</div>
							<div className="text-center">
								<div className="relative">
									<div className="bg-blue-100 rounded-lg p-6 mb-4">
										<h4 className="font-semibold text-blue-800 mb-2">
											OAuth 2.0
										</h4>
										<p className="text-sm text-blue-600">権限の委譲</p>
									</div>
									<div className="absolute -top-2 -left-2 bg-purple-100 rounded-lg p-6 shadow-lg">
										<h4 className="font-semibold text-purple-800 mb-2">OIDC</h4>
										<p className="text-sm text-purple-600">認証 + 認可</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 比較表 */}
					<ComparisonTable />
				</div>

				{/* OIDCの価値を日常例で説明 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Users className="w-6 h-6 text-purple-600" />
						OIDCが解決する問題
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<ValueCard
							title="🏢 会社の統一ID管理"
							scenario="大企業で、社員が複数のツール（メール、勤怠管理、経費精算など）を使う時、それぞれでログインが必要でした。"
							benefit="OIDCのSSO機能により、一度ログインすれば全てのツールが使えるようになりました。しかも「誰がログインしたか」も確実に分かります。"
							icon={Building}
							bgColor="bg-purple-50"
						/>

						<ValueCard
							title="🎓 大学のポータルサイト"
							scenario="学生が履修登録、成績確認、図書館予約、食堂決済など、様々なサービスを利用する時、毎回ログインが必要でした。"
							benefit="OIDCにより、一度の学生証認証で全サービスが利用可能。どのサービスを誰が使ったかの記録も正確に残ります。"
							icon={User}
							bgColor="bg-blue-50"
						/>

						<ValueCard
							title="🏥 医療システム"
							scenario="病院で、医師・看護師・薬剤師がそれぞれ異なるシステムを使う際、毎回ログインが必要で時間がかかっていました。"
							benefit="OIDCにより、医療従事者の身元を確実に識別しながら、必要なシステムにスムーズにアクセス。患者の安全性も向上。"
							icon={Shield}
							bgColor="bg-green-50"
						/>

						<ValueCard
							title="🛒 Eコマースプラットフォーム"
							scenario="ユーザーが複数のショップを利用する際、各ショップで会員登録とログインが必要でした。"
							benefit="OIDCにより、一つのアカウントで複数ショップを利用可能。購入履歴の管理も統一され、ユーザー体験が大幅改善。"
							icon={CreditCard}
							bgColor="bg-yellow-50"
						/>
					</div>
				</div>

				{/* SSOの価値説明 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<LogIn className="w-6 h-6 text-purple-600" />
						シングルサインオン（SSO）の価値
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<SSOCard
							scenario="📧 オフィス業務"
							without="メール、カレンダー、ファイル共有、チャット、プロジェクト管理ツールなど、それぞれでログイン。パスワードを複数覚える必要。"
							with="一度のログインで全てのツールにアクセス。パスワードは一つだけ覚えればOK。作業効率が大幅アップ。"
						/>

						<SSOCard
							scenario="🎮 ゲーム・エンタメ"
							without="ゲーム、動画配信、音楽配信、SNSなど、サービスごとにアカウント作成とログインが必要。"
							with="一つのアカウントで複数のエンタメサービスを利用。友達とのつながりやプロフィールも統一管理。"
						/>

						<SSOCard
							scenario="🏪 ショッピング"
							without="各ECサイトで会員登録、住所・決済情報を毎回入力。購入履歴も分散して管理が大変。"
							with="一度の登録で複数ショップを利用。配送先・決済情報は自動入力。ポイントも統合管理。"
						/>

						<SSOCard
							scenario="🏥 医療・行政"
							without="病院の予約、健康保険の手続き、薬局での薬の受け取りなど、それぞれで本人確認が必要。"
							with="一度の認証で全ての医療・行政サービスを利用。本人確認の手間が省け、サービスの連携も可能。"
						/>
					</div>
				</div>

				{/* IDトークンの解説 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Key className="w-6 h-6 text-purple-600" />
						IDトークン：「誰か」を証明する情報
					</h2>

					<div className="mb-6">
						<div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
							<h3 className="font-semibold text-gray-800 mb-3">
								🆔 IDトークンとは？
							</h3>
							<p className="text-gray-700 leading-relaxed">
								IDトークンは、<strong>「ログインしたユーザーが誰か」</strong>
								を証明するデジタル身分証明書です。 OAuth
								2.0のアクセストークンが「何ができるか」を示すのに対し、
								IDトークンは「誰がログインしたか」を示します。
							</p>
						</div>

						<TokenVisualization
							isExpanded={isTokenExpanded}
							onToggle={() => setIsTokenExpanded(!isTokenExpanded)}
						/>
					</div>
				</div>

				{/* 実際のサービス例 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Globe className="w-6 h-6 text-purple-600" />
						実際のOIDCサービス例
					</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<ServiceCard
							service="Google"
							logo="🔍"
							description="最も広く使われているOIDCプロバイダー"
							oidcFeatures={[
								"Gmail、YouTube、Drive等でのSSO",
								"詳細なユーザープロフィール情報",
								"厳格なセキュリティ基準",
								"豊富な開発者ドキュメント",
							]}
						/>

						<ServiceCard
							service="Microsoft"
							logo="🏢"
							description="企業向けOIDCソリューションの代表格"
							oidcFeatures={[
								"Office 365、Teams、OneDrive等の統合",
								"Active Directoryとの連携",
								"エンタープライズ向けセキュリティ",
								"多要素認証の標準サポート",
							]}
						/>

						<ServiceCard
							service="Auth0"
							logo="🔐"
							description="開発者向けOIDC専門サービス"
							oidcFeatures={[
								"複数プロバイダーの統合管理",
								"カスタマイズ可能な認証フロー",
								"詳細な認証ログとアナリティクス",
								"開発者フレンドリーなAPI",
							]}
						/>

						<ServiceCard
							service="Okta"
							logo="🏢"
							description="エンタープライズ向けOIDCプラットフォーム"
							oidcFeatures={[
								"大規模組織向けSSO",
								"高度なアクセス制御",
								"コンプライアンス対応",
								"ゼロトラストセキュリティ",
							]}
						/>

						<ServiceCard
							service="Amazon Cognito"
							logo="☁️"
							description="AWSクラウドのOIDCサービス"
							oidcFeatures={[
								"AWSサービスとの深い統合",
								"スケーラブルな認証基盤",
								"ソーシャルログイン対応",
								"モバイルアプリ最適化",
							]}
						/>

						<ServiceCard
							service="Firebase Auth"
							logo="🔥"
							description="Google提供の開発者向けOIDC"
							oidcFeatures={[
								"モバイル・Web両対応",
								"リアルタイムデータベース連携",
								"匿名認証からアップグレード可能",
								"簡単な実装とセットアップ",
							]}
						/>
					</div>
				</div>

				{/* セキュリティのポイント */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Lock className="w-6 h-6 text-purple-600" />
						OIDCのセキュリティポイント
					</h2>

					<div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8">
						<h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
							<Shield className="w-5 h-5 text-red-600" />
							安全に使うための重要なポイント
						</h3>

						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm mb-1">
											IDトークンの検証
										</p>
										<p className="text-xs text-gray-600">
											受け取ったIDトークンが本物か、署名を確認して検証する
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm mb-1">
											HTTPS通信の徹底
										</p>
										<p className="text-xs text-gray-600">
											全ての通信を暗号化し、トークンの盗聴を防ぐ
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm mb-1">
											適切なスコープ設定
										</p>
										<p className="text-xs text-gray-600">
											必要最小限の情報のみを要求し、プライバシーを保護
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm mb-1">
											リダイレクトURIの検証
										</p>
										<p className="text-xs text-gray-600">
											事前に登録したURIのみを許可し、悪意あるリダイレクトを防ぐ
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm mb-1">
											トークンの適切な保存
										</p>
										<p className="text-xs text-gray-600">
											IDトークンを安全に保存し、不要になったら削除する
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm mb-1">
											定期的なトークン更新
										</p>
										<p className="text-xs text-gray-600">
											有効期限を適切に設定し、定期的に新しいトークンを取得
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm mb-1">
											信頼できるプロバイダー選択
										</p>
										<p className="text-xs text-gray-600">
											実績のある信頼できるOIDCプロバイダーを選択する
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm mb-1">
											監査ログの記録
										</p>
										<p className="text-xs text-gray-600">
											認証・認可の履歴を記録し、セキュリティインシデントに備える
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* OIDCのメリットまとめ */}
				<div className="mb-12">
					<div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8 text-center">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							🎯 OIDCが実現する未来
						</h2>
						<div className="max-w-4xl mx-auto space-y-4">
							<div className="grid md:grid-cols-3 gap-6 text-left">
								<div className="bg-white rounded-lg p-4">
									<h4 className="font-semibold text-purple-700 mb-2">
										🔐 セキュリティ向上
									</h4>
									<p className="text-sm text-gray-600">
										統一された認証により、パスワードの使い回しや弱いパスワードのリスクを削減
									</p>
								</div>
								<div className="bg-white rounded-lg p-4">
									<h4 className="font-semibold text-blue-700 mb-2">
										⚡ 利便性向上
									</h4>
									<p className="text-sm text-gray-600">
										一度のログインで複数サービス利用可能。ユーザー体験が大幅に改善
									</p>
								</div>
								<div className="bg-white rounded-lg p-4">
									<h4 className="font-semibold text-green-700 mb-2">
										💰 コスト削減
									</h4>
									<p className="text-sm text-gray-600">
										開発・運用コストを削減し、セキュリティ専門知識も集約化
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* まとめ */}
				<div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8 text-center mb-8">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 まとめ</h2>
					<div className="max-w-3xl mx-auto space-y-3">
						<p className="text-gray-700 leading-relaxed">
							OpenID Connect（OIDC）は、OAuth 2.0に
							<span className="font-semibold">「身元確認」機能を追加</span>
							した現代的な認証標準です。
						</p>
						<p className="text-gray-700 leading-relaxed">
							シングルサインオン（SSO）により
							<span className="font-semibold">
								「一度のログインで複数サービス利用」
							</span>
							を実現し、
							<br />
							セキュリティと利便性を両立させています。
						</p>
						<p className="text-gray-700 leading-relaxed">
							現在多くのサービスがOIDCを採用しており、
							<br />
							私たちの日常的なデジタル体験を支える重要な技術となっています。
						</p>
					</div>
				</div>

				{/* 関連リンク */}
				<div className="flex justify-center gap-4">
					<Link
						href="/auth/oauth2"
						className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>OAuth 2.0を学ぶ</span>
					</Link>
					<Link
						href="/auth"
						className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<span>認証・認可の基礎に戻る</span>
					</Link>
					<button
						type="button"
						className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
						disabled
					>
						<span>多要素認証（作成中）</span>
						<ArrowRight className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
