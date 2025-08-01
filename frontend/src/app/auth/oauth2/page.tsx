"use client";

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	Building,
	CheckCircle,
	ChevronRight,
	Clock,
	ExternalLink,
	Globe,
	Key,
	Lock,
	LogIn,
	Mail,
	Shield,
	Smartphone,
	User,
	UserCheck,
	Users,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/**
 * OAuth 2.0の流れを表すステップコンポーネント
 */
const FlowStep = ({
	number,
	title,
	description,
	icon: Icon,
	isActive,
	onClick,
}: {
	number: number;
	title: string;
	description: string;
	icon: React.ElementType;
	isActive: boolean;
	onClick: () => void;
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`
				relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 w-full text-left
				${
					isActive
						? "border-blue-500 bg-blue-50 shadow-lg scale-105"
						: "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
				}
			`}
		>
			{/* ステップ番号 */}
			<div
				className={`
				absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
				${isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}
			`}
			>
				{number}
			</div>

			{/* アイコンとコンテンツ */}
			<div className="flex items-start gap-4">
				<div
					className={`
					p-3 rounded-lg
					${isActive ? "bg-blue-100" : "bg-gray-100"}
				`}
				>
					<Icon
						className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-600"}`}
					/>
				</div>
				<div className="flex-1">
					<h4
						className={`font-semibold mb-2 ${
							isActive ? "text-blue-900" : "text-gray-800"
						}`}
					>
						{title}
					</h4>
					<p
						className={`text-sm ${isActive ? "text-blue-700" : "text-gray-600"}`}
					>
						{description}
					</p>
				</div>
			</div>
		</button>
	);
};

/**
 * 日常生活の例で説明するカード
 */
const AnalogyCard = ({
	title,
	scenario,
	explanation,
	icon: Icon,
	bgColor,
}: {
	title: string;
	scenario: string;
	explanation: string;
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
								<span className="font-semibold">OAuth 2.0との関係：</span>
								<br />
								{explanation}
							</p>
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
const ServiceExampleCard = ({
	service,
	logo,
	description,
	uses,
}: {
	service: string;
	logo: string;
	description: string;
	uses: string[];
}) => {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
			<div className="flex items-center gap-3 mb-4">
				<div className="text-2xl">{logo}</div>
				<h4 className="font-semibold text-gray-800">{service}</h4>
			</div>
			<p className="text-sm text-gray-600 mb-3">{description}</p>
			<div className="space-y-2">
				<p className="text-xs font-semibold text-gray-500">利用例：</p>
				{uses.map((use) => (
					<div key={use} className="flex items-start gap-2">
						<ChevronRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
						<span className="text-xs text-gray-600">{use}</span>
					</div>
				))}
			</div>
		</div>
	);
};

/**
 * 誤解と正解カード
 */
const MisconceptionCard = ({
	misconception,
	truth,
	isRevealed,
	onReveal,
}: {
	misconception: string;
	truth: string;
	isRevealed: boolean;
	onReveal: () => void;
}) => {
	return (
		<button
			type="button"
			className="bg-white rounded-lg border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-all duration-300 w-full text-left"
			onClick={onReveal}
		>
			{/* 誤解部分 */}
			<div className="mb-4">
				<div className="flex items-start gap-3">
					<XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
					<div className="flex-1">
						<p className="text-sm font-semibold text-red-700 mb-1">
							よくある誤解
						</p>
						<p className="text-sm text-gray-700">{misconception}</p>
					</div>
				</div>
			</div>

			{/* 正解部分（クリックで表示） */}
			<div
				className={`
				overflow-hidden transition-all duration-500
				${isRevealed ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
			`}
			>
				<div className="pt-3 border-t border-gray-200">
					<div className="flex items-start gap-3">
						<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
						<div className="flex-1">
							<p className="text-sm font-semibold text-green-700 mb-1">
								正しい理解
							</p>
							<p className="text-sm text-gray-700">{truth}</p>
						</div>
					</div>
				</div>
			</div>

			{!isRevealed && (
				<p className="text-xs text-center text-gray-400 mt-3">
					クリックして正解を見る
				</p>
			)}
		</button>
	);
};

export default function OAuth2Page() {
	// OAuth 2.0フローのステップ管理
	const [activeStep, setActiveStep] = useState(1);

	// 誤解カードの表示状態管理
	const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());

	const handleRevealCard = (index: number) => {
		setRevealedCards((prev) => new Set(prev).add(index));
	};

	// OAuth 2.0のフローステップデータ
	const flowSteps = [
		{
			number: 1,
			title: "利用開始",
			description:
				"ユーザーがアプリで「Googleでログイン」などのボタンをクリック",
			icon: User,
			detail:
				"例：Instagram で「Facebookでログイン」を選択すると、このフローが始まります。",
		},
		{
			number: 2,
			title: "認証画面へ移動",
			description:
				"GoogleやFacebookなどの認証プロバイダーのページへリダイレクト",
			icon: ExternalLink,
			detail:
				"ブラウザが自動的にGoogleのログイン画面に移動します。URLを見ると google.com になっています。",
		},
		{
			number: 3,
			title: "ログインと許可",
			description: "ユーザーがログインし、アプリへの情報提供を許可",
			icon: UserCheck,
			detail:
				"「このアプリにプロフィール情報の読み取りを許可しますか？」という画面で「許可」をクリック。",
		},
		{
			number: 4,
			title: "認可コード発行",
			description: "許可が完了すると、一時的な認可コードが発行される",
			icon: Key,
			detail:
				"このコードは1回だけ使える特別なチケットのようなもの。有効期限も短い（通常10分程度）。",
		},
		{
			number: 5,
			title: "アクセストークン取得",
			description:
				"アプリが認可コードを使って、実際に使えるアクセストークンを取得",
			icon: Lock,
			detail:
				"アプリのサーバーが裏側でGoogleと通信して、長期間使えるアクセストークンと交換します。",
		},
		{
			number: 6,
			title: "情報取得・利用",
			description: "アクセストークンを使って、必要な情報を取得",
			icon: CheckCircle,
			detail:
				"アプリはこのトークンを使って、ユーザーの名前やメールアドレスなどを取得できます。",
		},
	];

	// 誤解と正解のデータ
	const misconceptions = [
		{
			misconception: "OAuth 2.0はパスワードを他のサービスに教える仕組み",
			truth:
				"OAuth 2.0の最大の特徴は、パスワードを一切共有しないこと。代わりに「許可証（トークン）」を使います。",
		},
		{
			misconception: "一度許可したら、アプリは永久に情報にアクセスできる",
			truth:
				"アクセストークンには有効期限があり、ユーザーはいつでも許可を取り消せます。GoogleやFacebookの設定画面から管理可能です。",
		},
		{
			misconception: "OAuth 2.0を使えば、どんな情報でも取得される",
			truth:
				"アプリは許可された範囲（スコープ）の情報しか取得できません。例：メールアドレスのみ、プロフィール写真のみなど。",
		},
		{
			misconception: "OAuthはGoogleやFacebookだけの技術",
			truth:
				"OAuth 2.0は国際標準規格。Twitter、GitHub、Microsoft、Spotifyなど、多くのサービスが採用しています。",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
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
							<div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
								<Users className="w-12 h-12 text-blue-600" />
							</div>
						</div>
						<h1 className="text-4xl font-bold text-gray-800 mb-4">OAuth 2.0</h1>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto">
							「Googleでログイン」「Facebookでログイン」の裏側の仕組み
							<br />
							パスワードを共有せずに、安全に情報をやり取りする技術を理解しよう
						</p>
					</div>
				</div>

				{/* 基本概念の説明 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Shield className="w-6 h-6 text-blue-600" />
						OAuth 2.0とは？
					</h2>

					<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
						<p className="text-gray-700 leading-relaxed mb-4">
							<strong className="text-blue-700">
								OAuth 2.0（オーオース2.0）
							</strong>
							は、あるサービスが別のサービスのユーザー情報や機能を
							<strong>安全に利用するための仕組み</strong>です。
						</p>
						<p className="text-gray-700 leading-relaxed">
							最大の特徴は、
							<span className="bg-yellow-200 px-2 py-1 rounded">
								パスワードを教えずに済む
							</span>
							こと。代わりに「許可証（アクセストークン）」を使って、必要な情報だけを共有します。
						</p>
					</div>

					{/* キーポイント */}
					<div className="grid md:grid-cols-3 gap-4 mb-8">
						<div className="bg-white rounded-lg p-4 border border-blue-200">
							<Lock className="w-8 h-8 text-blue-500 mb-2" />
							<h4 className="font-semibold text-gray-800 mb-1">安全性</h4>
							<p className="text-sm text-gray-600">
								パスワードを他のサービスに教える必要がない
							</p>
						</div>
						<div className="bg-white rounded-lg p-4 border border-green-200">
							<Shield className="w-8 h-8 text-green-500 mb-2" />
							<h4 className="font-semibold text-gray-800 mb-1">制御可能</h4>
							<p className="text-sm text-gray-600">
								どの情報を共有するか選択でき、いつでも取り消し可能
							</p>
						</div>
						<div className="bg-white rounded-lg p-4 border border-purple-200">
							<Clock className="w-8 h-8 text-purple-500 mb-2" />
							<h4 className="font-semibold text-gray-800 mb-1">期限付き</h4>
							<p className="text-sm text-gray-600">
								アクセス権限には有効期限があり、自動的に失効する
							</p>
						</div>
					</div>
				</div>

				{/* 日常生活での例え */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Building className="w-6 h-6 text-blue-600" />
						身近な例で理解しよう
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<AnalogyCard
							title="🏢 オフィスビルの入館証"
							scenario="大企業のオフィスビルで会議がある時、受付で「訪問者用の入館証」をもらいます。この入館証で特定のフロアだけ入れます。"
							explanation="OAuth 2.0のアクセストークンは、この入館証のようなもの。限定的なアクセス権限を持ち、時間が来たら無効になります。"
							icon={Building}
							bgColor="bg-blue-50"
						/>

						<AnalogyCard
							title="🚗 カーシェアリング"
							scenario="カーシェアで車を借りる時、スマホアプリで予約して、ICカードで車のドアを開けます。車の鍵は渡されません。"
							explanation="OAuth 2.0も同様に、マスターキー（パスワード）は渡さず、特定の期間・用途で使える権限だけを付与します。"
							icon={Smartphone}
							bgColor="bg-green-50"
						/>

						<AnalogyCard
							title="🏨 ホテルのコンシェルジュ"
							scenario="高級ホテルで、コンシェルジュにレストラン予約を頼む時、クレジットカード情報は教えず、「私の名前で予約して」と頼みます。"
							explanation="OAuth 2.0では、アプリがユーザーの代わりに動作しますが、パスワードなどの機密情報は知りません。"
							icon={UserCheck}
							bgColor="bg-purple-50"
						/>

						<AnalogyCard
							title="📮 郵便物の受け取り代行"
							scenario="不在時に、隣人に「荷物を代わりに受け取って」と頼む時、受領印の権限だけ与えて、家の鍵は渡しません。"
							explanation="OAuth 2.0も、必要最小限の権限（スコープ）だけを与えて、全権限は渡しません。"
							icon={Mail}
							bgColor="bg-yellow-50"
						/>
					</div>
				</div>

				{/* OAuth 2.0のフロー説明 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<ArrowRight className="w-6 h-6 text-blue-600" />
						OAuth 2.0の動作フロー
					</h2>

					<div className="bg-white rounded-xl p-6 mb-6">
						<p className="text-gray-600 mb-6">
							各ステップをクリックして詳細を確認してください
						</p>

						{/* フローステップ */}
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
							{flowSteps.map((step) => (
								<FlowStep
									key={step.number}
									{...step}
									isActive={activeStep === step.number}
									onClick={() => setActiveStep(step.number)}
								/>
							))}
						</div>

						{/* 選択されたステップの詳細 */}
						<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
							<h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<AlertCircle className="w-5 h-5 text-blue-600" />
								ステップ {activeStep} の詳細説明
							</h4>
							<p className="text-gray-700">
								{flowSteps[activeStep - 1].detail}
							</p>
						</div>
					</div>

					{/* フロー図（簡易版） */}
					<div className="bg-gray-50 rounded-lg p-6">
						<div className="flex items-center justify-between flex-wrap gap-4">
							<div className="text-center">
								<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
									<User className="w-8 h-8 text-blue-600" />
								</div>
								<p className="text-xs text-gray-600">ユーザー</p>
							</div>

							<ChevronRight className="w-6 h-6 text-gray-400" />

							<div className="text-center">
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
									<Globe className="w-8 h-8 text-green-600" />
								</div>
								<p className="text-xs text-gray-600">アプリ</p>
							</div>

							<ChevronRight className="w-6 h-6 text-gray-400" />

							<div className="text-center">
								<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
									<Shield className="w-8 h-8 text-purple-600" />
								</div>
								<p className="text-xs text-gray-600">認証プロバイダー</p>
								<p className="text-xs text-gray-500">(Google等)</p>
							</div>

							<ChevronRight className="w-6 h-6 text-gray-400" />

							<div className="text-center">
								<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
									<Key className="w-8 h-8 text-yellow-600" />
								</div>
								<p className="text-xs text-gray-600">トークン</p>
							</div>
						</div>
					</div>
				</div>

				{/* よくある誤解と正しい理解 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<AlertCircle className="w-6 h-6 text-blue-600" />
						よくある誤解を解消しよう
					</h2>

					<div className="grid md:grid-cols-2 gap-4">
						{misconceptions.map((item, index) => (
							<MisconceptionCard
								key={item.misconception}
								{...item}
								isRevealed={revealedCards.has(index)}
								onReveal={() => handleRevealCard(index)}
							/>
						))}
					</div>
				</div>

				{/* 実際のサービス例 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Globe className="w-6 h-6 text-blue-600" />
						実際のサービス例
					</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
						<ServiceExampleCard
							service="Google"
							logo="🔍"
							description="最も広く使われているOAuth 2.0プロバイダー"
							uses={[
								"YouTubeへのログイン",
								"Gmailとの連携",
								"Googleドライブへのアクセス",
								"カレンダー同期",
							]}
						/>

						<ServiceExampleCard
							service="Facebook"
							logo="👥"
							description="ソーシャルログインの代表例"
							uses={[
								"Instagramへのログイン",
								"ゲームアプリとの連携",
								"友達リストの共有",
								"写真の共有",
							]}
						/>

						<ServiceExampleCard
							service="GitHub"
							logo="🐙"
							description="開発者向けサービスの認証"
							uses={[
								"CI/CDツールとの連携",
								"コードエディタの認証",
								"プロジェクト管理ツール",
								"デプロイサービス",
							]}
						/>

						<ServiceExampleCard
							service="Twitter/X"
							logo="🐦"
							description="SNS連携の定番"
							uses={[
								"ニュースアプリへのログイン",
								"ツイートの自動投稿",
								"フォロワー分析ツール",
								"予約投稿サービス",
							]}
						/>
					</div>
				</div>

				{/* セキュリティのポイント */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Lock className="w-6 h-6 text-blue-600" />
						セキュリティのポイント
					</h2>

					<div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8">
						<h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
							<Shield className="w-5 h-5 text-red-600" />
							安全に使うための注意点
						</h3>

						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-3">
								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm">
											公式サイトか確認
										</p>
										<p className="text-xs text-gray-600">
											ログイン画面のURLが正しいか必ず確認（google.com、facebook.comなど）
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm">
											許可する権限を確認
										</p>
										<p className="text-xs text-gray-600">
											「このアプリが要求している権限」を必ず読んで、不要な権限は拒否
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm">
											HTTPSを確認
										</p>
										<p className="text-xs text-gray-600">
											URLバーに鍵マークがあることを確認（暗号化通信）
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm">
											定期的な確認
										</p>
										<p className="text-xs text-gray-600">
											Google/Facebookの設定で、連携済みアプリを定期的に確認・整理
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm">
											不要な連携は削除
										</p>
										<p className="text-xs text-gray-600">
											使わなくなったアプリの連携は、セキュリティ設定から削除
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-gray-700 text-sm">
											二要素認証を有効化
										</p>
										<p className="text-xs text-gray-600">
											Google/Facebookアカウント自体の二要素認証を必ず有効に
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* まとめ */}
				<div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8 text-center mb-8">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 まとめ</h2>
					<div className="max-w-3xl mx-auto space-y-3">
						<p className="text-gray-700 leading-relaxed">
							OAuth 2.0は、
							<span className="font-semibold">
								パスワードを共有せずに安全に情報をやり取りする
							</span>
							ための仕組みです。
						</p>
						<p className="text-gray-700 leading-relaxed">
							「Googleでログイン」などの便利な機能の裏側で、
							<br />
							あなたの大切な情報を守りながら、必要な権限だけを安全に共有しています。
						</p>
						<p className="text-gray-700 leading-relaxed">
							正しく理解して使えば、とても便利で安全な技術です。
							<br />
							定期的に連携アプリを確認し、不要なものは削除する習慣をつけましょう。
						</p>
					</div>
				</div>

				{/* 関連リンク */}
				<div className="flex justify-center gap-4">
					<Link
						href="/auth"
						className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>認証・認可の基礎に戻る</span>
					</Link>
					<button
						type="button"
						className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
						disabled
					>
						<span>OpenID Connect（作成中）</span>
						<ArrowRight className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
