import type React from "react";
import type { BIG3TotalData, WeightLevel } from "../../types/big3";
import {
	getLevelBgColor,
	getLevelColor,
	validateBodyWeight,
} from "../../utils/big3-calculator";
import { calculateBIG3Total } from "../../utils/big3-total-calculator";

interface BIG3TotalProps {
	/** 体重 (kg) */
	bodyWeight: number | "";
}

/**
 * BIG3合計値表示コンポーネント
 * レベル別のBIG3合計値とその内訳を表示する
 */
export const BIG3Total: React.FC<BIG3TotalProps> = ({ bodyWeight }) => {
	// 体重が未入力の場合
	if (bodyWeight === "") {
		return (
			<div className="card text-center">
				<div className="p-12">
					<div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<span className="text-2xl">⚖️</span>
					</div>
					<p className="text-muted-foreground text-lg mb-2">
						体重を入力してください
					</p>
					<p className="text-muted-foreground/70 text-sm">
						各レベルのBIG3合計値を確認できます
					</p>
				</div>
			</div>
		);
	}

	// 体重のバリデーション
	const validation = validateBodyWeight(bodyWeight);
	if (!validation.isValid) {
		return (
			<div className="card text-center border-error-500/20 bg-error-50/50 dark:bg-error-950/20">
				<div className="p-8">
					<div className="w-16 h-16 bg-error-100 dark:bg-error-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<span className="text-2xl">⚠️</span>
					</div>
					<p className="text-error-600 dark:text-error-400 text-lg font-medium mb-2">
						{validation.errorMessage}
					</p>
					<p className="text-muted-foreground text-sm">
						50kg〜140kgの範囲で入力してください
					</p>
				</div>
			</div>
		);
	}

	// BIG3合計値を計算
	const totalData = calculateBIG3Total(bodyWeight);
	if (!totalData) {
		return (
			<div className="card text-center border-error-500/20 bg-error-50/50 dark:bg-error-950/20">
				<div className="p-8">
					<div className="w-16 h-16 bg-error-100 dark:bg-error-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<span className="text-2xl">❌</span>
					</div>
					<p className="text-error-600 dark:text-error-400 text-lg font-medium">
						データの計算に失敗しました
					</p>
				</div>
			</div>
		);
	}

	/**
	 * レベル別データカードをレンダリング
	 */
	const renderLevelCard = (level: WeightLevel, data: BIG3TotalData) => {
		const getLevelEmoji = (level: WeightLevel): string => {
			switch (level) {
				case "初心者":
					return "🌱";
				case "初級者":
					return "💪";
				case "中級者":
					return "🔥";
				case "上級者":
					return "⚡";
				case "エリート":
					return "👑";
				default:
					return "💪";
			}
		};

		const getLevelGradient = (level: WeightLevel): string => {
			switch (level) {
				case "初心者":
					return "from-green-500 to-emerald-500";
				case "初級者":
					return "from-blue-500 to-cyan-500";
				case "中級者":
					return "from-orange-500 to-amber-500";
				case "上級者":
					return "from-purple-500 to-violet-500";
				case "エリート":
					return "from-yellow-500 to-orange-500";
				default:
					return "from-gray-500 to-gray-600";
			}
		};

		return (
			<div key={level} className="card-hover group">
				<div className="p-6">
					{/* レベルヘッダー */}
					<div className="text-center mb-6">
						<div
							className={`w-16 h-16 bg-gradient-to-br ${getLevelGradient(level)} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-soft group-hover:shadow-glow`}
						>
							<span className="text-2xl">{getLevelEmoji(level)}</span>
						</div>
						<h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
							{level}
						</h3>
					</div>

					{/* 種目別重量 */}
					<div className="space-y-3 mb-6">
						<div className="flex justify-between items-center py-2 px-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
							<span className="text-sm font-medium text-muted-foreground">
								🏋️ ベンチプレス
							</span>
							<span className="text-sm font-bold text-foreground">
								{data.benchPress}kg
							</span>
						</div>
						<div className="flex justify-between items-center py-2 px-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
							<span className="text-sm font-medium text-muted-foreground">
								🦵 スクワット
							</span>
							<span className="text-sm font-bold text-foreground">
								{data.squat}kg
							</span>
						</div>
						<div className="flex justify-between items-center py-2 px-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
							<span className="text-sm font-medium text-muted-foreground">
								🏗️ デッドリフト
							</span>
							<span className="text-sm font-bold text-foreground">
								{data.deadlift}kg
							</span>
						</div>
					</div>

					{/* 合計値 */}
					<div className="border-t border-border pt-4">
						<div className="flex justify-between items-center">
							<span className="text-lg font-bold text-foreground">合計</span>
							<span
								className={`text-2xl font-bold bg-gradient-to-r ${getLevelGradient(level)} bg-clip-text text-transparent`}
							>
								{data.total}kg
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-8">
			{/* ヘッダー */}
			<div className="text-center">
				<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
					<span className="gradient-text-primary">BIG3</span>合計値
				</h2>
				<p className="text-xl text-muted-foreground">
					体重 <span className="font-bold text-primary">{bodyWeight}kg</span>{" "}
					における各レベルの目標重量と合計値
				</p>
			</div>

			{/* レベル別カード */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{Object.entries(totalData).map(([level, data]) =>
					renderLevelCard(level as WeightLevel, data),
				)}
			</div>

			{/* 説明文 */}
			<div className="card bg-primary-50/50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800">
				<div className="p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
							<span className="text-white text-lg">💡</span>
						</div>
						<h4 className="text-lg font-bold text-foreground">
							BIG3合計値について
						</h4>
					</div>
					<ul className="text-muted-foreground space-y-2">
						<li className="flex items-start gap-2">
							<span className="text-primary mt-1">•</span>
							<span>
								BIG3合計値は、ベンチプレス + スクワット +
								デッドリフトの合計重量です
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-1">•</span>
							<span>
								この数値は体重別の一般的な指標であり、個人差があります
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-1">•</span>
							<span>
								次のレベルの合計値を目標にトレーニング計画を立てましょう
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-1">•</span>
							<span>
								無理な重量への挑戦は避け、段階的に向上を目指してください
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};
