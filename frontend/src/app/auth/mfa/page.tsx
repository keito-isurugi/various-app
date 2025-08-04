"use client";

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	Clock,
	CreditCard,
	Eye,
	Fingerprint,
	Globe,
	Key,
	Lock,
	Mail,
	MessageSquare,
	Phone,
	QrCode,
	Shield,
	Smartphone,
	Star,
	User,
	UserCheck,
	Wifi,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/**
 * 3要素認証の基本概念を説明するカード
 */
const AuthFactorCard = ({
	title,
	subtitle,
	description,
	examples,
	icon: Icon,
	bgColor,
}: {
	title: string;
	subtitle: string;
	description: string;
	examples: string[];
	icon: React.ElementType;
	bgColor: string;
}) => {
	return (
		<div
			className={`rounded-lg p-6 ${bgColor} border border-gray-200 hover:shadow-md transition-shadow`}
		>
			<div className="flex items-start gap-4">
				<div className="p-3 rounded-full bg-white shadow-sm">
					<Icon className="w-6 h-6 text-gray-700" />
				</div>
				<div className="flex-1">
					<h3 className="text-lg font-bold mb-2 text-gray-800">{title}</h3>
					<p className="text-sm text-blue-600 font-medium mb-3">{subtitle}</p>
					<p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
					<div className="space-y-2">
						<p className="text-sm font-semibold text-gray-700">例：</p>
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

/**
 * 日常生活でのMFA例を説明するカード
 */
const DailyExampleCard = ({
	title,
	scenario,
	factors,
	icon: Icon,
	bgColor,
}: {
	title: string;
	scenario: string;
	factors: { factor: string; example: string }[];
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
					<div className="space-y-4">
						<div className="p-3 bg-white/70 rounded-md">
							<p className="text-sm text-gray-700">
								<span className="font-semibold">シナリオ：</span>
								<br />
								{scenario}
							</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-semibold text-gray-700">
								使われている要素：
							</p>
							{factors.map((item) => (
								<div
									key={item.factor}
									className="flex items-start gap-3 p-2 bg-white/50 rounded"
								>
									<span className="text-sm font-medium text-blue-600 min-w-20">
										{item.factor}
									</span>
									<span className="text-sm text-gray-600">{item.example}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * MFAツールの比較カード
 */
const MFAToolCard = ({
	name,
	type,
	security,
	convenience,
	pros,
	cons,
	icon: Icon,
	cost,
}: {
	name: string;
	type: string;
	security: number; // 1-5
	convenience: number; // 1-5
	pros: string[];
	cons: string[];
	icon: React.ElementType;
	cost: string;
}) => {
	const SecurityRating = ({ rating }: { rating: number }) => {
		const stars = Array.from({ length: 5 }, (_, i) => i + 1);
		return (
			<div className="flex gap-1">
				{stars.map((starNumber) => (
					<Star
						key={starNumber}
						className={`w-4 h-4 ${
							starNumber <= rating
								? "fill-yellow-400 text-yellow-400"
								: "text-gray-300"
						}`}
					/>
				))}
			</div>
		);
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
			<div className="flex items-center gap-3 mb-4">
				<Icon className="w-6 h-6 text-blue-600" />
				<div>
					<h4 className="font-semibold text-gray-800">{name}</h4>
					<p className="text-sm text-gray-500">{type}</p>
				</div>
			</div>

			<div className="space-y-3 mb-4">
				<div className="flex justify-between items-center">
					<span className="text-sm font-medium text-gray-600">
						セキュリティ
					</span>
					<SecurityRating rating={security} />
				</div>
				<div className="flex justify-between items-center">
					<span className="text-sm font-medium text-gray-600">使いやすさ</span>
					<SecurityRating rating={convenience} />
				</div>
				<div className="flex justify-between items-center">
					<span className="text-sm font-medium text-gray-600">コスト</span>
					<span className="text-sm text-gray-600">{cost}</span>
				</div>
			</div>

			<div className="space-y-3">
				<div>
					<p className="text-xs font-semibold text-green-700 mb-1">メリット</p>
					{pros.map((pro) => (
						<div key={pro} className="flex items-start gap-1 mb-1">
							<CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
							<span className="text-xs text-gray-600">{pro}</span>
						</div>
					))}
				</div>
				<div>
					<p className="text-xs font-semibold text-red-700 mb-1">デメリット</p>
					{cons.map((con) => (
						<div key={con} className="flex items-start gap-1 mb-1">
							<XCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
							<span className="text-xs text-gray-600">{con}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/**
 * セキュリティ比較表
 */
const SecurityComparisonTable = () => {
	const comparisons = [
		{
			attack: "パスワード漏洩",
			passwordOnly: "❌ 簡単に侵入される",
			withMFA: "✅ 第2要素で防御",
		},
		{
			attack: "フィッシング攻撃",
			passwordOnly: "❌ だまされやすい",
			withMFA: "⚠️ 高度な攻撃では注意が必要",
		},
		{
			attack: "辞書攻撃・総当たり攻撃",
			passwordOnly: "❌ 弱いパスワードは突破される",
			withMFA: "✅ パスワードが突破されても安全",
		},
		{
			attack: "パスワードの使い回し",
			passwordOnly: "❌ 他のサイト侵入のリスク",
			withMFA: "✅ 他サイトの被害を軽減",
		},
		{
			attack: "内部犯行・管理者による攻撃",
			passwordOnly: "❌ 管理者権限で簡単にアクセス",
			withMFA: "⚠️ 物理的デバイスがあれば突破可能",
		},
	];

	return (
		<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
			<div className="bg-gradient-to-r from-red-50 to-green-50 p-4">
				<h4 className="font-semibold text-gray-800">
					パスワードのみ vs MFA のセキュリティ比較
				</h4>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
								攻撃手法
							</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
								パスワードのみ
							</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
								MFA有効
							</th>
						</tr>
					</thead>
					<tbody>
						{comparisons.map((item, index) => (
							<tr
								key={item.attack}
								className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
							>
								<td className="px-4 py-3 text-sm font-medium text-gray-800">
									{item.attack}
								</td>
								<td className="px-4 py-3 text-sm text-gray-600">
									{item.passwordOnly}
								</td>
								<td className="px-4 py-3 text-sm text-gray-600">
									{item.withMFA}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

/**
 * サービス設定ガイドカード
 */
const ServiceGuideCard = ({
	service,
	logo,
	importance,
	reason,
	setupSteps,
}: {
	service: string;
	logo: string;
	importance: "必須" | "強く推奨" | "推奨";
	reason: string;
	setupSteps: string[];
}) => {
	const importanceColors = {
		必須: "bg-red-100 text-red-800 border-red-200",
		強く推奨: "bg-orange-100 text-orange-800 border-orange-200",
		推奨: "bg-blue-100 text-blue-800 border-blue-200",
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-5">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-3">
					<div className="text-2xl">{logo}</div>
					<h4 className="font-semibold text-gray-800">{service}</h4>
				</div>
				<span
					className={`px-2 py-1 text-xs font-semibold rounded ${importanceColors[importance]}`}
				>
					{importance}
				</span>
			</div>

			<p className="text-sm text-gray-600 mb-4">{reason}</p>

			<div>
				<p className="text-sm font-semibold text-gray-700 mb-2">設定手順：</p>
				<ol className="text-xs text-gray-600 space-y-1">
					{setupSteps.map((step, index) => (
						<li key={step} className="flex gap-2">
							<span className="font-medium min-w-4">{index + 1}.</span>
							<span>{step}</span>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
};

export default function MFAPage() {
	// ツールの詳細表示状態管理
	const [expandedTool, setExpandedTool] = useState<string | null>(null);

	const mfaTools = [
		{
			name: "認証アプリ (TOTP)",
			type: "時間ベース",
			security: 4,
			convenience: 4,
			pros: ["オフラインで動作", "多くのサービスで対応", "無料"],
			cons: ["スマホ紛失時の復旧が困難", "時刻同期が必要"],
			icon: Smartphone,
			cost: "無料",
		},
		{
			name: "SMS認証",
			type: "テキストメッセージ",
			security: 2,
			convenience: 5,
			pros: ["設定が簡単", "多くの人が使える", "追加アプリ不要"],
			cons: [
				"SIMスワップ攻撃のリスク",
				"電波がないと使えない",
				"通信費がかかることがある",
			],
			icon: MessageSquare,
			cost: "通信料",
		},
		{
			name: "ハードウェアキー",
			type: "物理デバイス",
			security: 5,
			convenience: 3,
			pros: ["最高レベルの安全性", "フィッシング耐性", "バッテリー不要"],
			cons: ["デバイス購入費用", "紛失リスク", "対応サービスが限定的"],
			icon: Key,
			cost: "3,000〜10,000円",
		},
		{
			name: "生体認証",
			type: "指紋・顔・虹彩",
			security: 4,
			convenience: 5,
			pros: ["使いやすい", "忘れることがない", "高速認証"],
			cons: ["デバイス依存", "怪我で使えないことがある", "複製リスク"],
			icon: Fingerprint,
			cost: "デバイス価格に含まれる",
		},
		{
			name: "音声通話認証",
			type: "電話",
			security: 2,
			convenience: 3,
			pros: ["スマートフォン不要", "高齢者でも使いやすい"],
			cons: ["時間がかかる", "通話料", "盗聴リスク"],
			icon: Phone,
			cost: "通話料",
		},
		{
			name: "メール認証",
			type: "電子メール",
			security: 1,
			convenience: 4,
			pros: ["設定簡単", "普及率が高い"],
			cons: [
				"メールアカウント乗っ取りで突破",
				"遅延がある",
				"スパムに紛れやすい",
			],
			icon: Mail,
			cost: "無料",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-yellow-50">
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
							<div className="p-4 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full">
								<Shield className="w-12 h-12 text-green-600" />
							</div>
						</div>
						<h1 className="text-4xl font-bold text-gray-800 mb-4">
							多要素認証 (MFA)
						</h1>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto">
							パスワードだけでは不十分な現代のセキュリティ対策
							<br />
							「知識」「所有」「生体」の組み合わせで、あなたのアカウントを守る
						</p>
					</div>
				</div>

				{/* MFAの基本概念 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Lock className="w-6 h-6 text-green-600" />
						多要素認証（MFA）とは？
					</h2>

					<div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-8 mb-8">
						<p className="text-gray-700 leading-relaxed mb-4">
							<strong className="text-green-700">
								多要素認証（MFA：Multi-Factor Authentication）
							</strong>
							とは、複数の「認証要素」を組み合わせて本人確認を行う仕組みです。
						</p>
						<p className="text-gray-700 leading-relaxed">
							パスワード（知識）だけでなく、
							<span className="bg-yellow-200 px-2 py-1 rounded">
								スマートフォン（所有物）や指紋（生体情報）
							</span>
							なども使って、より強固なセキュリティを実現します。
						</p>
					</div>

					{/* 3つの認証要素 */}
					<div className="grid md:grid-cols-3 gap-6">
						<AuthFactorCard
							title="何かを知っている"
							subtitle="Knowledge Factor"
							description="記憶に基づく情報。最も一般的な認証方法です。"
							examples={[
								"パスワード",
								"PIN番号",
								"秘密の質問の答え",
								"パスフレーズ",
							]}
							icon={User}
							bgColor="bg-blue-50"
						/>

						<AuthFactorCard
							title="何かを持っている"
							subtitle="Possession Factor"
							description="物理的に所有している物や、あなたのデバイスに送信される情報。"
							examples={[
								"スマートフォン",
								"認証アプリ",
								"SMSコード",
								"ハードウェアキー",
							]}
							icon={Smartphone}
							bgColor="bg-green-50"
						/>

						<AuthFactorCard
							title="何かである"
							subtitle="Inherence Factor"
							description="あなた自身の身体的・行動的特徴。変更や複製が困難です。"
							examples={["指紋", "顔認証", "虹彩認証", "声紋認証"]}
							icon={Fingerprint}
							bgColor="bg-purple-50"
						/>
					</div>
				</div>

				{/* 日常生活でのMFA例 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<UserCheck className="w-6 h-6 text-green-600" />
						身近なMFAの例
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<DailyExampleCard
							title="🏧 銀行のATM"
							scenario="ATMでお金を引き出す時、キャッシュカードを挿入して、4桁の暗証番号を入力します。"
							factors={[
								{
									factor: "持っている",
									example: "キャッシュカード（磁気カード）",
								},
								{ factor: "知っている", example: "4桁の暗証番号" },
							]}
							icon={CreditCard}
							bgColor="bg-blue-50"
						/>

						<DailyExampleCard
							title="📱 スマートフォン"
							scenario="iPhoneやAndroidの画面ロック解除で、パスコード入力後に指紋認証や顔認証を行います。"
							factors={[
								{ factor: "持っている", example: "スマートフォン本体" },
								{ factor: "知っている", example: "パスコード・パターン" },
								{ factor: "である", example: "指紋・顔・虹彩" },
							]}
							icon={Smartphone}
							bgColor="bg-green-50"
						/>

						<DailyExampleCard
							title="🚗 車のスマートキー"
							scenario="最新の車では、スマートキーを持っているだけでなく、エンジン始動時にブレーキを踏む必要があります。"
							factors={[
								{ factor: "持っている", example: "スマートキー（電子キー）" },
								{ factor: "している", example: "ブレーキペダルを踏む動作" },
							]}
							icon={Key}
							bgColor="bg-yellow-50"
						/>

						<DailyExampleCard
							title="💳 クレジットカード決済"
							scenario="店舗でのクレジットカード決済で、カードを提示し、サインや暗証番号を入力します。"
							factors={[
								{ factor: "持っている", example: "クレジットカード" },
								{ factor: "知っている", example: "暗証番号" },
								{ factor: "できる", example: "署名（筆跡認証）" },
							]}
							icon={CreditCard}
							bgColor="bg-purple-50"
						/>
					</div>
				</div>

				{/* セキュリティ比較表 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Shield className="w-6 h-6 text-green-600" />
						MFAのセキュリティ効果
					</h2>

					<SecurityComparisonTable />

					<div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
						<h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-600" />
							MFAの劇的な効果
						</h3>
						<div className="grid md:grid-cols-3 gap-4 text-center">
							<div className="bg-white rounded-lg p-4">
								<p className="text-2xl font-bold text-green-600 mb-1">99.9%</p>
								<p className="text-sm text-gray-600">自動攻撃をブロック</p>
							</div>
							<div className="bg-white rounded-lg p-4">
								<p className="text-2xl font-bold text-blue-600 mb-1">100倍</p>
								<p className="text-sm text-gray-600">セキュリティ向上効果</p>
							</div>
							<div className="bg-white rounded-lg p-4">
								<p className="text-2xl font-bold text-purple-600 mb-1">95%</p>
								<p className="text-sm text-gray-600">フィッシング攻撃を防御</p>
							</div>
						</div>
					</div>
				</div>

				{/* MFAツールの比較 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Globe className="w-6 h-6 text-green-600" />
						MFAツールの比較
					</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{mfaTools.map((tool) => (
							<MFAToolCard key={tool.name} {...tool} />
						))}
					</div>

					<div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
						<h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
							<AlertCircle className="w-5 h-5 text-yellow-600" />
							推奨の組み合わせ
						</h3>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-white rounded p-4">
								<h4 className="font-medium text-gray-800 mb-2">
									🥇 最強セキュリティ
								</h4>
								<p className="text-sm text-gray-600">
									<strong>認証アプリ + ハードウェアキー</strong>
									<br />
									重要なアカウント（銀行、仕事）に推奨
								</p>
							</div>
							<div className="bg-white rounded p-4">
								<h4 className="font-medium text-gray-800 mb-2">
									🥈 バランス重視
								</h4>
								<p className="text-sm text-gray-600">
									<strong>認証アプリ + 生体認証</strong>
									<br />
									日常使いのアカウントに推奨
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* サービス別設定ガイド */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Star className="w-6 h-6 text-green-600" />
						主要サービスでのMFA設定
					</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<ServiceGuideCard
							service="Google アカウント"
							logo="🔍"
							importance="必須"
							reason="Gmail、YouTube、Google Driveなど重要なサービスの基盤"
							setupSteps={[
								"Google アカウントにログイン",
								"「セキュリティ」→「2段階認証プロセス」",
								"電話番号を追加",
								"認証アプリを設定（推奨）",
								"バックアップコードを保存",
							]}
						/>

						<ServiceGuideCard
							service="Apple ID"
							logo="🍎"
							importance="必須"
							reason="iPhone、Mac、iCloudの基盤。デバイス紛失時に重要"
							setupSteps={[
								"「設定」→「Apple ID」",
								"「サインインとセキュリティ」",
								"「2ファクタ認証」をオン",
								"信頼できる電話番号を追加",
								"信頼できるデバイスを確認",
							]}
						/>

						<ServiceGuideCard
							service="Microsoft アカウント"
							logo="🏢"
							importance="強く推奨"
							reason="Outlook、OneDrive、Office 365を保護"
							setupSteps={[
								"Microsoft アカウントにログイン",
								"「セキュリティ」タブを選択",
								"「高度なセキュリティオプション」",
								"「2段階認証の設定」",
								"認証アプリまたはSMSを選択",
							]}
						/>

						<ServiceGuideCard
							service="銀行・金融機関"
							logo="🏦"
							importance="必須"
							reason="金融資産を保護する最重要アカウント"
							setupSteps={[
								"インターネットバンキングにログイン",
								"「セキュリティ設定」を探す",
								"「ワンタイムパスワード」を有効化",
								"専用アプリをダウンロード",
								"初期設定とテスト実行",
							]}
						/>

						<ServiceGuideCard
							service="Amazon"
							logo="📦"
							importance="強く推奨"
							reason="決済情報や購入履歴の保護"
							setupSteps={[
								"Amazonアカウントにログイン",
								"「アカウント&ログイン情報」",
								"「2段階認証の設定」",
								"認証アプリまたはSMSを選択",
								"バックアップ方法を設定",
							]}
						/>

						<ServiceGuideCard
							service="SNS (X, Facebook)"
							logo="💬"
							importance="推奨"
							reason="アカウント乗っ取りによる被害防止"
							setupSteps={[
								"各サービスの設定画面を開く",
								"「セキュリティ」または「プライバシー」",
								"「2要素認証」を有効化",
								"認証方法を選択",
								"ログイン通知を有効化",
							]}
						/>
					</div>
				</div>

				{/* MFAの制限事項と注意点 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<AlertCircle className="w-6 h-6 text-green-600" />
						MFAの注意点と限界
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-red-50 border border-red-200 rounded-lg p-6">
							<h3 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
								<XCircle className="w-5 h-5" />
								MFAでも防げない攻撃
							</h3>
							<ul className="space-y-2 text-sm text-red-700">
								<li className="flex items-start gap-2">
									<span className="mt-1">•</span>
									<span>高度なフィッシング攻撃（リアルタイムプロキシ）</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1">•</span>
									<span>SIMスワップ攻撃（SMS認証の場合）</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1">•</span>
									<span>マルウェアによるセッション乗っ取り</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1">•</span>
									<span>内部犯行（物理的アクセス）</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1">•</span>
									<span>ソーシャルエンジニアリング</span>
								</li>
							</ul>
						</div>

						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
							<h3 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
								<AlertCircle className="w-5 h-5" />
								使用時の注意点
							</h3>
							<ul className="space-y-2 text-sm text-yellow-700">
								<li className="flex items-start gap-2">
									<span className="mt-1">•</span>
									<span>バックアップ認証方法を必ず設定</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1">•</span>
									<span>デバイス紛失時の復旧手順を確認</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1">•</span>
									<span>認証コードは第三者に絶対教えない</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1">•</span>
									<span>公共Wi-Fiでの認証は避ける</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1">•</span>
									<span>定期的な設定見直しと更新</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* MFAのベストプラクティス */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<CheckCircle className="w-6 h-6 text-green-600" />
						MFA活用のベストプラクティス
					</h2>

					<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
						<div className="grid md:grid-cols-2 gap-8">
							<div>
								<h3 className="font-semibold text-gray-800 mb-4">
									🔐 セキュリティ重視
								</h3>
								<ul className="space-y-2 text-sm text-gray-700">
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<span>重要なアカウントは認証アプリ＋ハードウェアキー</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<span>SMS認証よりも認証アプリを優先</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<span>バックアップコードを安全な場所に保存</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<span>定期的なアクセスログの確認</span>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="font-semibold text-gray-800 mb-4">
									⚡ 利便性重視
								</h3>
								<ul className="space-y-2 text-sm text-gray-700">
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
										<span>生体認証で日常的なアクセスを簡単に</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
										<span>信頼できるデバイスの設定を活用</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
										<span>パスワードマネージャーとの連携</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
										<span>複数認証方法の併用で冗長性確保</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* まとめ */}
				<div className="bg-gradient-to-r from-green-100 to-yellow-100 rounded-lg p-8 text-center mb-8">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 まとめ</h2>
					<div className="max-w-3xl mx-auto space-y-3">
						<p className="text-gray-700 leading-relaxed">
							多要素認証（MFA）は、
							<span className="font-semibold">
								現代のデジタルセキュリティの必需品
							</span>
							です。
						</p>
						<p className="text-gray-700 leading-relaxed">
							パスワードだけでは不十分な時代に、
							<span className="font-semibold">
								「知識」「所有」「生体」の組み合わせ
							</span>
							で
							<br />
							あなたの大切な情報とプライバシーを守ります。
						</p>
						<p className="text-gray-700 leading-relaxed">
							少しの手間で劇的にセキュリティが向上するMFA。
							<br />
							まずは重要なアカウントから設定を始めてみましょう。
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
					<Link
						href="/auth/oidc"
						className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<span>OIDC（OpenID Connect）</span>
					</Link>
					<button
						type="button"
						className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
						disabled
					>
						<span>生体認証（作成中）</span>
						<ArrowRight className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
