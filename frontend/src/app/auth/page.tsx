"use client";

import {
	AlertCircle,
	ArrowRight,
	Building,
	CheckCircle,
	Cloud,
	CreditCard,
	FileText,
	Key,
	Lock,
	Settings,
	Shield,
	Smartphone,
	UserCheck,
	Users,
} from "lucide-react";
import Link from "next/link";
import type React from "react";

// 認証と認可の基本概念を説明するコンポーネント
const AuthBasicsCard = ({
	title,
	description,
	icon: Icon,
	examples,
	bgColor,
}: {
	title: string;
	description: string;
	icon: React.ElementType;
	examples: string[];
	bgColor: string;
}) => {
	return (
		<div
			className={`rounded-lg p-6 ${bgColor} border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
		>
			<div className="flex items-start gap-4">
				<div className="p-3 rounded-full bg-white shadow-sm">
					<Icon className="w-6 h-6 text-gray-700" />
				</div>
				<div className="flex-1">
					<h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
					<p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
					<div className="space-y-2">
						<p className="text-sm font-semibold text-gray-700">日常の例：</p>
						{examples.map((example) => (
							<div key={example} className="flex items-start gap-2">
								<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
								<span className="text-sm text-gray-600">{example}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

// トピックカードコンポーネント（OAuth2.0, OIDC, MFA等）
const TopicCard = ({
	title,
	subtitle,
	description,
	icon: Icon,
	status = "coming-soon",
	link,
}: {
	title: string;
	subtitle: string;
	description: string;
	icon: React.ElementType;
	status?: "available" | "coming-soon";
	link?: string;
}) => {
	const isComingSoon = status === "coming-soon";

	const cardContent = (
		<div
			className={`
				relative overflow-hidden rounded-lg border transition-all duration-300
				${isComingSoon ? "border-gray-300 bg-gray-50" : "border-blue-300 bg-white hover:shadow-lg cursor-pointer"}
			`}
		>
			{isComingSoon && (
				<div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
					作成中
				</div>
			)}
			<div className="p-6">
				<div className="flex items-start gap-4">
					<div
						className={`p-3 rounded-lg ${isComingSoon ? "bg-gray-200" : "bg-blue-100"}`}
					>
						<Icon
							className={`w-6 h-6 ${isComingSoon ? "text-gray-500" : "text-blue-600"}`}
						/>
					</div>
					<div className="flex-1">
						<h3
							className={`text-lg font-bold mb-1 ${isComingSoon ? "text-gray-600" : "text-gray-800"}`}
						>
							{title}
						</h3>
						<p className="text-sm text-gray-500 mb-2">{subtitle}</p>
						<p
							className={`text-sm ${isComingSoon ? "text-gray-500" : "text-gray-600"} leading-relaxed`}
						>
							{description}
						</p>
						{!isComingSoon && (
							<div className="mt-4 flex items-center gap-2 text-blue-600 font-medium text-sm">
								<span>詳しく学ぶ</span>
								<ArrowRight className="w-4 h-4" />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);

	// リンクがある場合はLinkコンポーネントで囲む
	if (!isComingSoon && link) {
		return <Link href={link}>{cardContent}</Link>;
	}

	return cardContent;
};

// セキュリティ基礎知識カード
const SecurityBasicsCard = ({
	title,
	points,
	icon: Icon,
	color,
}: {
	title: string;
	points: string[];
	icon: React.ElementType;
	color: string;
}) => {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
			<div className={`flex items-center gap-3 mb-4 pb-3 border-b ${color}`}>
				<Icon className="w-5 h-5" />
				<h4 className="font-semibold text-gray-800">{title}</h4>
			</div>
			<ul className="space-y-2">
				{points.map((point) => (
					<li key={point} className="flex items-start gap-2">
						<span className="text-gray-400 mt-1">•</span>
						<span className="text-sm text-gray-600">{point}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default function AuthPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* ヘッダー */}
				<div className="text-center mb-12">
					<div className="flex justify-center mb-4">
						<div className="p-4 bg-blue-100 rounded-full">
							<Shield className="w-12 h-12 text-blue-600" />
						</div>
					</div>
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						認証と認可の基礎
					</h1>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						Webサービスのセキュリティの要である「認証」と「認可」について、
						日常生活の例を交えながら分かりやすく解説します。
					</p>
				</div>

				{/* 認証と認可の違いを説明 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Key className="w-6 h-6 text-blue-600" />
						まず理解しよう：認証と認可の違い
					</h2>

					<div className="grid md:grid-cols-2 gap-6 mb-8">
						<AuthBasicsCard
							title="認証（Authentication）"
							description="「あなたは誰ですか？」を確認するプロセス。本人確認のようなもので、IDとパスワードなどで身元を証明します。"
							icon={UserCheck}
							examples={[
								"銀行ATMでキャッシュカードと暗証番号を入力",
								"スマホの指紋認証や顔認証でロック解除",
								"会社の入館証をカードリーダーにかざす",
							]}
							bgColor="bg-blue-50"
						/>

						<AuthBasicsCard
							title="認可（Authorization）"
							description="「何ができますか？」を決めるプロセス。認証された後、その人に何を許可するかを判断します。"
							icon={Lock}
							examples={[
								"社員証で入れるエリアが部署によって違う",
								"動画配信サービスの無料会員と有料会員の違い",
								"ファイルの読み取り専用と編集可能の権限",
							]}
							bgColor="bg-green-50"
						/>
					</div>

					{/* わかりやすい例 */}
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
						<div className="flex items-start gap-3">
							<AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
							<div>
								<h3 className="font-semibold text-gray-800 mb-2">
									🏨 ホテルで例えると...
								</h3>
								<p className="text-gray-700 leading-relaxed">
									<strong>認証</strong>
									：フロントでチェックイン時に身分証明書を見せて本人確認
									<br />
									<strong>認可</strong>：
									渡されたルームキーで入れる部屋が決まる（他の部屋には入れない）
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* 認証・認可の技術トピック */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Settings className="w-6 h-6 text-blue-600" />
						認証・認可の主要技術
					</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<TopicCard
							title="OAuth 2.0"
							subtitle="認可フレームワーク"
							description="「Googleでログイン」のような、他サービスのアカウントで認証・認可を行う仕組み。安全に権限を委譲できます。"
							icon={Users}
							status="available"
							link="/auth/oauth2"
						/>

						<TopicCard
							title="OpenID Connect (OIDC)"
							subtitle="認証レイヤー"
							description="OAuth 2.0の上に構築された認証の仕組み。ユーザー情報を安全に取得でき、シングルサインオンを実現します。"
							icon={Cloud}
							status="coming-soon"
						/>

						<TopicCard
							title="多要素認証 (MFA)"
							subtitle="セキュリティ強化"
							description="パスワードだけでなく、SMSコードや認証アプリなど複数の要素で本人確認を行い、セキュリティを高めます。"
							icon={Smartphone}
							status="coming-soon"
						/>

						<TopicCard
							title="JWT (JSON Web Token)"
							subtitle="トークンベース認証"
							description="ユーザー情報を含む暗号化されたトークン。サーバー間で安全に情報をやり取りできます。"
							icon={FileText}
							status="coming-soon"
						/>

						<TopicCard
							title="SAML"
							subtitle="企業向けSSO"
							description="企業環境でよく使われるシングルサインオンの標準規格。一度のログインで複数のサービスを利用できます。"
							icon={Building}
							status="coming-soon"
						/>

						<TopicCard
							title="生体認証"
							subtitle="バイオメトリクス"
							description="指紋、顔、虹彩などの身体的特徴を使った認証方法。なりすましが困難で高いセキュリティを実現します。"
							icon={UserCheck}
							status="coming-soon"
						/>
					</div>
				</div>

				{/* セキュリティ基礎知識 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Lock className="w-6 h-6 text-blue-600" />
						知っておきたいセキュリティの基礎
					</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<SecurityBasicsCard
							title="パスワード管理"
							icon={Key}
							color="text-purple-600"
							points={[
								"8文字以上で大小英数字と記号を混ぜる",
								"サービスごとに異なるパスワードを使用",
								"パスワードマネージャーの活用を推奨",
								"定期的な変更より強固なパスワードが重要",
							]}
						/>

						<SecurityBasicsCard
							title="セッション管理"
							icon={Settings}
							color="text-blue-600"
							points={[
								"ログイン状態を保持する仕組み",
								"一定時間操作がないと自動ログアウト",
								"共有PCでは必ずログアウトする",
								"HTTPSでの通信で盗聴を防ぐ",
							]}
						/>

						<SecurityBasicsCard
							title="フィッシング対策"
							icon={AlertCircle}
							color="text-red-600"
							points={[
								"URLが正しいか必ず確認",
								"不審なメールのリンクはクリックしない",
								"HTTPSと鍵マークを確認",
								"二要素認証を有効にする",
							]}
						/>

						<SecurityBasicsCard
							title="Cookie とトークン"
							icon={CreditCard}
							color="text-green-600"
							points={[
								"Cookieはブラウザに保存される小さなデータ",
								"セッションCookieとパーシステントCookie",
								"トークンは認証情報を含む文字列",
								"適切な有効期限の設定が重要",
							]}
						/>

						<SecurityBasicsCard
							title="アクセス制御"
							icon={Shield}
							color="text-indigo-600"
							points={[
								"最小権限の原則を守る",
								"役割ベースのアクセス制御（RBAC）",
								"定期的な権限の見直し",
								"監査ログの記録と確認",
							]}
						/>

						<SecurityBasicsCard
							title="暗号化"
							icon={Lock}
							color="text-orange-600"
							points={[
								"通信の暗号化（HTTPS/TLS）",
								"パスワードのハッシュ化保存",
								"重要データの暗号化",
								"エンドツーエンド暗号化の理解",
							]}
						/>
					</div>
				</div>

				{/* まとめ */}
				<div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8 text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 まとめ</h2>
					<p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
						認証と認可は、デジタル世界の安全を守る重要な仕組みです。
						<br />
						認証で「誰か」を確認し、認可で「何ができるか」を制御することで、
						<br />
						安全で使いやすいサービスが実現されています。
						<br />
						<br />
						日々利用するサービスでも、これらの技術が私たちの情報を守っています。
					</p>
				</div>
			</div>
		</div>
	);
}
