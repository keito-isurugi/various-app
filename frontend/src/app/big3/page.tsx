"use client";

import {
	Calculator,
	ChevronRight,
	ClipboardList,
	Dumbbell,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";

const features = [
	{
		href: "/big3/level",
		icon: TrendingUp,
		title: "レベル判定",
		description: "体重からBIG3のレベルを判定。目標重量も確認できます",
		gradient: "from-emerald-500 to-teal-500",
		bgGradient:
			"from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
		borderColor: "border-emerald-200 dark:border-emerald-800",
	},
	{
		href: "/big3/menu",
		icon: ClipboardList,
		title: "メニュー提案",
		description: "1RMからMAXアップ・筋肥大メニューを自動計算",
		gradient: "from-orange-500 to-red-500",
		bgGradient:
			"from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
		borderColor: "border-orange-200 dark:border-orange-800",
	},
	{
		href: "/big3/one-rm-estimator",
		icon: Calculator,
		title: "1RM推定",
		description: "挙げた重量と回数から1RM（最大挙上重量）を推定",
		gradient: "from-purple-500 to-indigo-500",
		bgGradient:
			"from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20",
		borderColor: "border-purple-200 dark:border-purple-800",
	},
];

export default function Big3TopPage() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-2xl mx-auto px-4 py-8">
				{/* Header */}
				<header className="text-center mb-8">
					<div className="flex items-center justify-center gap-3 mb-4">
						<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
							<Dumbbell className="w-8 h-8 text-white" />
						</div>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
						BIG3ツール
					</h1>
					<p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
						ベンチプレス・スクワット・デッドリフトのトレーニングをサポートする各種ツール
					</p>
				</header>

				{/* What is BIG3 */}
				<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
						BIG3とは？
					</h2>
					<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
						BIG3は筋力トレーニングの基本となる3つの複合種目です。
						<strong className="text-gray-900 dark:text-gray-100">
							ベンチプレス
						</strong>
						（胸・肩・三頭筋）、
						<strong className="text-gray-900 dark:text-gray-100">
							スクワット
						</strong>
						（脚・臀部・体幹）、
						<strong className="text-gray-900 dark:text-gray-100">
							デッドリフト
						</strong>
						（背中・脚・体幹）の3種目で、全身の主要な筋肉を効率的に鍛えることができます。
						これらの種目の合計重量（BIG3トータル）は筋力の指標として広く使われています。
					</p>
				</div>

				{/* Feature Links */}
				<div className="space-y-4">
					{features.map((feature) => (
						<Link
							key={feature.href}
							href={feature.href}
							className={`flex items-center gap-4 p-4 bg-gradient-to-r ${feature.bgGradient} border ${feature.borderColor} rounded-xl hover:shadow-md transition-shadow group`}
						>
							<div
								className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shrink-0`}
							>
								<feature.icon className="w-6 h-6 text-white" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-semibold text-gray-900 dark:text-gray-100">
									{feature.title}
								</p>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{feature.description}
								</p>
							</div>
							<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors shrink-0" />
						</Link>
					))}
				</div>

				{/* Recommended Flow */}
				<div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
					<h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
						おすすめの使い方
					</h3>
					<ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
						<li>
							<strong>1RM推定</strong>で現在の最大挙上重量を計算
						</li>
						<li>
							<strong>レベル判定</strong>で自分のレベルと目標を確認
						</li>
						<li>
							<strong>メニュー提案</strong>でトレーニングプログラムを作成
						</li>
					</ol>
				</div>
			</div>
		</div>
	);
}
