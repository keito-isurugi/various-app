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
			<div className="text-center py-8">
				<p className="text-gray-500 text-lg">体重を入力してください</p>
				<p className="text-gray-400 text-sm mt-2">
					各レベルのBIG3合計値を確認できます
				</p>
			</div>
		);
	}

	// 体重のバリデーション
	const validation = validateBodyWeight(bodyWeight);
	if (!validation.isValid) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600 text-lg font-medium">
					{validation.errorMessage}
				</p>
				<p className="text-gray-500 text-sm mt-2">
					50kg〜140kgの範囲で入力してください
				</p>
			</div>
		);
	}

	// BIG3合計値を計算
	const totalData = calculateBIG3Total(bodyWeight);
	if (!totalData) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600 text-lg font-medium">
					データの計算に失敗しました
				</p>
			</div>
		);
	}

	/**
	 * レベル別データカードをレンダリング
	 */
	const renderLevelCard = (level: WeightLevel, data: BIG3TotalData) => {
		return (
			<div
				key={level}
				className={`${getLevelBgColor(level)} border border-gray-200 rounded-lg p-4 shadow-sm`}
			>
				{/* レベルヘッダー */}
				<div className="text-center mb-4">
					<h3 className={`text-lg font-bold ${getLevelColor(level)}`}>
						{level}
					</h3>
				</div>

				{/* 種目別重量 */}
				<div className="space-y-3 mb-4">
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-gray-700">
							ベンチプレス
						</span>
						<span className="text-sm font-semibold text-gray-900">
							{data.benchPress}kg
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-gray-700">
							スクワット
						</span>
						<span className="text-sm font-semibold text-gray-900">
							{data.squat}kg
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-gray-700">
							デッドリフト
						</span>
						<span className="text-sm font-semibold text-gray-900">
							{data.deadlift}kg
						</span>
					</div>
				</div>

				{/* 合計値 */}
				<div className="border-t border-gray-300 pt-3">
					<div className="flex justify-between items-center">
						<span className="text-base font-bold text-gray-900">合計</span>
						<span className={`text-xl font-bold ${getLevelColor(level)}`}>
							{data.total}kg
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-6">
			{/* ヘッダー */}
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">BIG3合計値</h2>
				<p className="text-gray-600">
					体重 {bodyWeight}kg における各レベルの目標重量と合計値
				</p>
			</div>

			{/* レベル別カード */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{Object.entries(totalData).map(([level, data]) =>
					renderLevelCard(level as WeightLevel, data),
				)}
			</div>

			{/* 説明文 */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
				<h4 className="text-sm font-semibold text-blue-900 mb-2">
					BIG3合計値について
				</h4>
				<ul className="text-sm text-blue-800 space-y-1">
					<li>
						• BIG3合計値は、ベンチプレス + スクワット +
						デッドリフトの合計重量です
					</li>
					<li>• この数値は体重別の一般的な指標であり、個人差があります</li>
					<li>• 次のレベルの合計値を目標にトレーニング計画を立てましょう</li>
					<li>• 無理な重量への挑戦は避け、段階的に向上を目指してください</li>
				</ul>
			</div>
		</div>
	);
};
