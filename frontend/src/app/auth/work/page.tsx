"use client";

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	Building,
	CheckCircle,
	Clock,
	Code,
	Globe,
	Heart,
	Key,
	Lock,
	Monitor,
	Shield,
	Star,
	Target,
	TestTube,
	Truck,
	UserCheck,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import type React from "react";

/**
 * 仕事の価値を説明するカード
 */
const ValueCard = ({
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
			className={`rounded-lg p-6 ${bgColor} border border-gray-200 shadow-sm`}
		>
			<div className="flex items-start gap-4">
				<div className="p-3 rounded-full bg-white shadow-sm">
					<Icon className="w-6 h-6 text-gray-700" />
				</div>
				<div className="flex-1">
					<h3 className="text-lg font-bold mb-3 text-gray-800">{title}</h3>
					<p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
					<div className="space-y-2">
						<p className="text-sm font-semibold text-gray-700">具体例：</p>
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
 * 日々の作業内容を説明するカード
 */
const DailyWorkCard = ({
	title,
	description,
	realWorldAnalogy,
	icon: Icon,
	bgColor,
}: {
	title: string;
	description: string;
	realWorldAnalogy: string;
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
								<span className="font-semibold">技術的な内容：</span>
								<br />
								{description}
							</p>
						</div>
						<div className="p-3 bg-white/50 rounded-md">
							<p className="text-sm text-gray-600">
								<span className="font-semibold">身近な例で言うと：</span>
								<br />
								{realWorldAnalogy}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * 誤解を解くカード
 */
const MisconceptionCard = ({
	misconception,
	reality,
}: {
	misconception: string;
	reality: string;
}) => {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-5">
			<div className="space-y-4">
				<div className="p-3 bg-red-50 border border-red-200 rounded">
					<div className="flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-semibold text-red-700 mb-1">
								よくある誤解
							</p>
							<p className="text-sm text-gray-700">{misconception}</p>
						</div>
					</div>
				</div>
				<div className="p-3 bg-green-50 border border-green-200 rounded">
					<div className="flex items-start gap-3">
						<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-semibold text-green-700 mb-1">
								実際はこう
							</p>
							<p className="text-sm text-gray-700">{reality}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * キャリア段階カード
 */
const CareerStageCard = ({
	stage,
	period,
	description,
	skills,
	icon: Icon,
}: {
	stage: string;
	period: string;
	description: string;
	skills: string[];
	icon: React.ElementType;
}) => {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-5">
			<div className="flex items-start gap-4 mb-4">
				<div className="p-3 bg-blue-100 rounded-full">
					<Icon className="w-6 h-6 text-blue-600" />
				</div>
				<div className="flex-1">
					<h4 className="font-bold text-gray-800">{stage}</h4>
					<p className="text-sm text-gray-500">{period}</p>
				</div>
			</div>
			<p className="text-sm text-gray-600 mb-3">{description}</p>
			<div className="space-y-1">
				<p className="text-xs font-semibold text-gray-500">主なスキル：</p>
				{skills.map((skill) => (
					<div key={skill} className="flex items-center gap-2">
						<Star className="w-3 h-3 text-yellow-500" />
						<span className="text-xs text-gray-600">{skill}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default function WorkPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
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
							<div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
								<Shield className="w-12 h-12 text-indigo-600" />
							</div>
						</div>
						<h1 className="text-4xl font-bold text-gray-800 mb-4">
							私の仕事について
						</h1>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto">
							OIDCに準拠した認証・認可サーバーを開発する
							<br />
							「デジタルセキュリティガード」の日常をご紹介
						</p>
					</div>
				</div>

				{/* 仕事の概要 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<UserCheck className="w-6 h-6 text-indigo-600" />
						私は「デジタルセキュリティガード」です
					</h2>

					<div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-8">
						<div className="grid md:grid-cols-2 gap-8 items-center">
							<div>
								<h3 className="text-lg font-bold text-gray-800 mb-4">
									🛡️ どんな仕事？
								</h3>
								<p className="text-gray-700 leading-relaxed mb-4">
									私の仕事は、デジタル世界の「セキュリティガード」のようなもの。
									<br />
									<strong>「誰がアクセスしているか」</strong>を確認し、
									<strong>「何をする権限があるか」</strong>
									を管理するシステムを作っています。
								</p>
								<p className="text-gray-700 leading-relaxed">
									具体的には、<strong>OIDC準拠の認証・認可サーバー</strong>
									を開発して、様々なアプリケーションが安全にユーザー情報をやり取りできるようにしています。
								</p>
							</div>
							<div className="text-center">
								<div className="relative">
									<div className="bg-blue-100 rounded-lg p-6 mb-4">
										<h4 className="font-semibold text-blue-800 mb-2">
											従来のシステム
										</h4>
										<p className="text-sm text-blue-600">個別認証</p>
									</div>
									<div className="absolute -top-2 -right-2 bg-indigo-100 rounded-lg p-6 shadow-lg">
										<h4 className="font-semibold text-indigo-800 mb-2">
											私が作るシステム
										</h4>
										<p className="text-sm text-indigo-600">統一認証</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 身近な例での説明 */}
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
						<div className="flex items-start gap-3">
							<Building className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
							<div>
								<h3 className="font-semibold text-gray-800 mb-2">
									🏢 大型商業施設のセキュリティシステムで例えると...
								</h3>
								<p className="text-gray-700 leading-relaxed">
									<strong>従来</strong>
									：各店舗が独自に会員カードを発行。お客さんは店舗ごとにカードを持つ必要がある
									<br />
									<strong>私のシステム</strong>：
									一枚の統一カードで全ての店舗を利用可能。セキュリティも統一管理で安全性向上
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* OIDC準拠認証サーバーの説明 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Key className="w-6 h-6 text-indigo-600" />
						OIDC準拠認証サーバーとは？
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<ValueCard
							title="🔐 デジタル身分証明書の発行所"
							description="私が開発するシステムは、デジタル世界の「身分証明書発行所」のような役割を果たします。"
							icon={UserCheck}
							examples={[
								"運転免許証のように、本人確認ができる",
								"健康保険証のように、利用できるサービスが分かる",
								"学生証のように、有効期限がある",
								"社員証のように、アクセスできる場所が決まっている",
							]}
							bgColor="bg-blue-50"
						/>

						<ValueCard
							title="🌐 統一パス管理システム"
							description="複数のサービスで同じ身元確認情報を使えるようにし、ユーザーの利便性とセキュリティを向上させます。"
							icon={Globe}
							examples={[
								"一つのIDで複数のアプリにログイン可能",
								"パスワードの使い回しリスクを削減",
								"個人情報の管理を一元化",
								"不正アクセスの検知・防止が容易",
							]}
							bgColor="bg-green-50"
						/>

						<ValueCard
							title="🏥 安全な情報共有の仲介役"
							description="病院の紹介状のように、必要な情報だけを安全に他のサービスと共有する仕組みを提供します。"
							icon={Shield}
							examples={[
								"医師から薬剤師への処方箋のような安全な情報伝達",
								"銀行の本人確認のような厳格な認証",
								"会社の入退室管理のような権限制御",
								"図書館カードのような期限管理",
							]}
							bgColor="bg-purple-50"
						/>

						<ValueCard
							title="⚡ 開発効率向上ツール"
							description="他の開発者が認証機能を一から作らずに済むよう、標準化された仕組みを提供します。"
							icon={Zap}
							examples={[
								"車輪の再発明をせずに済む",
								"セキュリティ専門知識がなくても安全なシステムが作れる",
								"国際標準に準拠した信頼性の高いシステム",
								"メンテナンスコストの削減",
							]}
							bgColor="bg-yellow-50"
						/>
					</div>
				</div>

				{/* 社会への価値と影響 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Heart className="w-6 h-6 text-indigo-600" />
						この仕事が社会に与える価値
					</h2>

					<div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 mb-6">
						<h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
							<Target className="w-5 h-5 text-red-600" />
							私たちが目指している未来
						</h3>

						<div className="grid md:grid-cols-3 gap-6">
							<div className="bg-white rounded-lg p-4">
								<h4 className="font-semibold text-red-700 mb-2">
									🔒 セキュリティ向上
								</h4>
								<p className="text-sm text-gray-600">
									個人情報漏洩やなりすましの被害を減らし、安心してデジタルサービスを利用できる社会を実現
								</p>
							</div>
							<div className="bg-white rounded-lg p-4">
								<h4 className="font-semibold text-blue-700 mb-2">
									⚡ 利便性向上
								</h4>
								<p className="text-sm text-gray-600">
									パスワード管理の負担を軽減し、様々なサービスをスムーズに利用できる環境を提供
								</p>
							</div>
							<div className="bg-white rounded-lg p-4">
								<h4 className="font-semibold text-green-700 mb-2">
									💰 効率化推進
								</h4>
								<p className="text-sm text-gray-600">
									企業の開発コスト削減と、ユーザーサポート業務の効率化に貢献
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h4 className="font-semibold text-gray-800 mb-4">
							🌍 実際の社会への影響
						</h4>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="flex items-start gap-3">
								<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-semibold text-gray-700 text-sm mb-1">
										医療現場での効率化
									</p>
									<p className="text-xs text-gray-600">
										医師・看護師・薬剤師の連携がスムーズになり、患者の待ち時間短縮
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-semibold text-gray-700 text-sm mb-1">
										教育現場での活用
									</p>
									<p className="text-xs text-gray-600">
										学習管理システム、図書館、食堂など学校内サービスの統合利用
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-semibold text-gray-700 text-sm mb-1">
										企業の生産性向上
									</p>
									<p className="text-xs text-gray-600">
										社内システムへの統一アクセスで、従業員の作業効率大幅改善
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-semibold text-gray-700 text-sm mb-1">
										高齢者のデジタル参加促進
									</p>
									<p className="text-xs text-gray-600">
										複雑な認証手順の簡素化で、より多くの方がデジタルサービスを利用可能
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 日々の作業内容 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Clock className="w-6 h-6 text-indigo-600" />
						日々の作業内容
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<DailyWorkCard
							title="💻 システム設計・コーディング"
							description="OIDC仕様に準拠した認証フローの実装、セキュアなAPI設計、データベース最適化、パフォーマンス改善など"
							realWorldAnalogy="建築士が安全で使いやすい建物を設計し、職人が丁寧に組み上げていくような作業。一つ一つの部品（コード）が正しく動作するよう、細心の注意を払って作ります。"
							icon={Code}
							bgColor="bg-blue-50"
						/>

						<DailyWorkCard
							title="🔍 テスト・品質保証"
							description="セキュリティテスト、ペネトレーションテスト、負荷テスト、自動テストの作成・実行、バグの発見・修正など"
							realWorldAnalogy="新車の品質管理のような作業。様々な条件下で問題がないか徹底的に検査し、お客様に安心して使っていただけるよう品質を保証します。"
							icon={TestTube}
							bgColor="bg-green-50"
						/>

						<DailyWorkCard
							title="🛡️ セキュリティ強化"
							description="脆弱性診断、セキュリティパッチ適用、侵入検知システムの設定、セキュリティ監査対応など"
							realWorldAnalogy="警備会社のスタッフのような役割。24時間システムを監視し、怪しい動きがないか確認。新しい脅威に対しても対策を講じて、大切な情報を守ります。"
							icon={Shield}
							bgColor="bg-red-50"
						/>

						<DailyWorkCard
							title="📊 運用・監視"
							description="システムログ分析、パフォーマンス監視、障害対応、容量計画、アラート設定など"
							realWorldAnalogy="交通管制センターのオペレーターのような仕事。システムの健康状態を常に監視し、問題が起きる前に対策を取る。トラブル時は迅速に原因を特定し解決します。"
							icon={Monitor}
							bgColor="bg-purple-50"
						/>

						<DailyWorkCard
							title="📚 技術研究・学習"
							description="最新のOIDC仕様調査、セキュリティ動向分析、新技術の検証、技術文書の作成・更新など"
							realWorldAnalogy="医師が最新の治療法を学ぶのと同じ。技術の進歩は早いので、常に最新の知識を身につけ、より良いシステムを作れるよう研鑽を積みます。"
							icon={Target}
							bgColor="bg-yellow-50"
						/>

						<DailyWorkCard
							title="🤝 チーム連携・相談"
							description="設計レビュー、コードレビュー、技術相談、進捗共有、ドキュメンテーション作成など"
							realWorldAnalogy="オーケストラの演奏のような協調作業。一人では作れない大きなシステムを、チーム全員で協力して作り上げます。お互いの専門知識を共有し、より良い成果を目指します。"
							icon={Users}
							bgColor="bg-indigo-50"
						/>
					</div>
				</div>

				{/* 仕事のやりがいと苦労 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Heart className="w-6 h-6 text-indigo-600" />
						仕事のやりがいと正直な気持ち
					</h2>

					<div className="grid md:grid-cols-2 gap-6 mb-6">
						{/* やりがい */}
						<div className="bg-green-50 rounded-lg p-6 border border-green-200">
							<h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
								<Star className="w-5 h-5 text-green-600" />
								やりがいを感じる瞬間
							</h3>
							<div className="space-y-3">
								<div className="flex items-start gap-2">
									<CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">
										「ログインが簡単になった」というユーザーの声を聞いた時
									</p>
								</div>
								<div className="flex items-start gap-2">
									<CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">
										複雑な問題を解決できた時の達成感
									</p>
								</div>
								<div className="flex items-start gap-2">
									<CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">
										チームメンバーと協力して大きな機能を完成させた時
									</p>
								</div>
								<div className="flex items-start gap-2">
									<CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">
										セキュリティ攻撃を未然に防げた時の安堵感
									</p>
								</div>
								<div className="flex items-start gap-2">
									<CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">
										新しい技術を習得して、より良いシステムが作れるようになった時
									</p>
								</div>
							</div>
						</div>

						{/* 苦労 */}
						<div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
							<h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
								<AlertCircle className="w-5 h-5 text-orange-600" />
								正直に言うと、大変なこと
							</h3>
							<div className="space-y-3">
								<div className="flex items-start gap-2">
									<AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">
										セキュリティ問題が発生した時の緊張感とプレッシャー
									</p>
								</div>
								<div className="flex items-start gap-2">
									<AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">
										技術の進歩が早く、常に学習し続けなければならない
									</p>
								</div>
								<div className="flex items-start gap-2">
									<AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">
										原因不明のバグを深夜まで調査することがある
									</p>
								</div>
								<div className="flex items-start gap-2">
									<AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">
										複雑な技術を非技術者に説明するのが難しい時がある
									</p>
								</div>
								<div className="flex items-start gap-2">
									<AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">
										完璧なシステムは存在しないという現実と向き合うこと
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
						<h3 className="font-bold text-gray-800 mb-3">
							💭 それでもこの仕事を続ける理由
						</h3>
						<p className="text-gray-700 leading-relaxed">
							大変なことも多いですが、私たちが作るシステムが多くの人の日常を便利で安全にしていると実感できる時、すべての苦労が報われます。
							また、技術的な課題を解決する過程で得られる学びや成長、チームメンバーとの協力関係も、この仕事の大きな魅力です。
							何より、デジタル社会の基盤を支えているという責任感と誇りが、私を前向きにしてくれます。
						</p>
					</div>
				</div>

				{/* キャリアパスと将来展望 */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<ArrowRight className="w-6 h-6 text-indigo-600" />
						キャリアパスと将来の展望
					</h2>

					<div className="grid md:grid-cols-3 gap-6 mb-6">
						<CareerStageCard
							stage="ジュニアエンジニア"
							period="入社〜3年目"
							description="基本的なプログラミングスキルを身につけ、チームの指導のもと機能開発を担当"
							skills={[
								"プログラミング言語の習得",
								"基本的なWeb技術の理解",
								"チーム開発の進め方",
								"テスト手法の基礎",
							]}
							icon={Code}
						/>

						<CareerStageCard
							stage="シニアエンジニア（現在）"
							period="4年目〜現在"
							description="複雑なシステム設計を担当し、セキュリティ専門知識を活かしてOIDC準拠システムを開発"
							skills={[
								"システムアーキテクチャ設計",
								"OIDC・OAuth2.0の深い理解",
								"セキュリティ脆弱性対策",
								"パフォーマンス最適化",
							]}
							icon={Shield}
						/>

						<CareerStageCard
							stage="テックリード・アーキテクト"
							period="将来目標"
							description="チーム全体の技術方針を決定し、より大規模で複雑なシステムの設計・開発を主導"
							skills={[
								"技術戦略の策定",
								"チームメンバーの育成",
								"ビジネス要件と技術の橋渡し",
								"新技術の評価・導入",
							]}
							icon={Target}
						/>
					</div>

					<div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6">
						<h3 className="font-bold text-gray-800 mb-4">
							🚀 これからチャレンジしたいこと
						</h3>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<h4 className="font-semibold text-gray-700">技術面</h4>
								<ul className="text-sm text-gray-600 space-y-1">
									<li>• AI/機械学習を活用した不正検知システム</li>
									<li>• ゼロトラストセキュリティアーキテクチャ</li>
									<li>• 分散認証システムの研究</li>
									<li>• ブロックチェーン技術のID管理への応用</li>
								</ul>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-gray-700">社会貢献</h4>
								<ul className="text-sm text-gray-600 space-y-1">
									<li>• 高齢者向けの簡単認証システム</li>
									<li>• 発展途上国でも使える軽量認証システム</li>
									<li>• 技術教育・啓蒙活動</li>
									<li>• オープンソースプロジェクトへの貢献</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* ITエンジニアの誤解を解く */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Users className="w-6 h-6 text-indigo-600" />
						ITエンジニアのよくある誤解を解きたい
					</h2>

					<div className="grid md:grid-cols-2 gap-4">
						<MisconceptionCard
							misconception="一日中パソコンに向かって黙々と作業している"
							reality="実際は人との関わりが多く、チームメンバーとの相談や、お客様との要件確認など、コミュニケーションが重要な仕事です。"
						/>

						<MisconceptionCard
							misconception="理系じゃないとできない、数学が得意じゃないとダメ"
							reality="論理的思考は重要ですが、文系出身者も多く活躍しています。むしろ文章力や人とのコミュニケーション能力の方が重要な場面も多いです。"
						/>

						<MisconceptionCard
							misconception="毎日残業で、プライベートの時間がない"
							reality="会社や プロジェクトによりますが、働き方改革が進んでおり、ワークライフバランスを重視する企業が増えています。"
						/>

						<MisconceptionCard
							misconception="ゲームばかりしていて、社会性がない"
							reality="確かにゲーム好きも多いですが、チームワークを大切にし、社会問題の解決に技術で貢献したいと考えている人がほとんどです。"
						/>

						<MisconceptionCard
							misconception="常に最新技術を追いかけて大変そう"
							reality="新しい技術に興味を持つのは確かですが、基礎をしっかり身につければ、新しい技術も理解しやすくなります。学ぶこと自体を楽しんでいる人が多いです。"
						/>

						<MisconceptionCard
							misconception="お客さんと接することがない、内向的な仕事"
							reality="システムの要件をお客さんから聞いたり、使い方を説明したり、意外とお客さんとの接点は多いです。人の役に立っている実感も得やすい仕事です。"
						/>
					</div>
				</div>

				{/* まとめ */}
				<div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-8 text-center mb-8">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 最後に</h2>
					<div className="max-w-4xl mx-auto space-y-4">
						<p className="text-gray-700 leading-relaxed">
							私の仕事は、
							<span className="font-semibold">
								デジタル社会の基盤を支える「縁の下の力持ち」
							</span>
							のような役割です。
						</p>
						<p className="text-gray-700 leading-relaxed">
							普段は目に見えませんが、皆さんが安心してスマホやPCを使えるのも、
							<br />
							私たちのようなエンジニアが作ったセキュリティシステムのおかげです。
						</p>
						<p className="text-gray-700 leading-relaxed">
							技術的には複雑で難しい仕事ですが、
							<br />
							<strong>「人々の生活をより便利で安全にしたい」</strong>
							という想いで日々取り組んでいます。
						</p>
						<p className="text-gray-700 leading-relaxed">
							少しでも私の仕事について理解していただけたら嬉しいです。
							<br />
							ご質問がございましたら、いつでもお気軽にお聞かせください。
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
				</div>
			</div>
		</div>
	);
}
