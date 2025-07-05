import type React from "react";
import { LEVEL_ORDER } from "../../data/big3-data";
import type { ExerciseType } from "../../types/big3";
import {
	calculateLevelWeights,
	getLevelBgColor,
	getLevelColor,
	validateBodyWeight,
} from "../../utils/big3-calculator";
import { BIG3Total } from "./BIG3Total";

interface TargetWeightsProps {
	/** 体重 (kg) */
	bodyWeight: number | "";
	/** コンパクト表示モード */
	compact?: boolean;
	/** 追加のCSSクラス */
	className?: string;
}

/**
 * 体重に基づく目標重量表示コンポーネント
 * 入力された体重から各種目・各レベルの目標重量を計算して表示する
 */
export const TargetWeights: React.FC<TargetWeightsProps> = ({
	bodyWeight,
	compact = false,
	className = "",
}) => {
	const exercises: ExerciseType[] = [
		"ベンチプレス",
		"スクワット",
		"デッドリフト",
	];

	// 体重が空の場合
	if (bodyWeight === "") {
		return (
			<div
				className={`text-center py-8 ${compact ? "text-sm" : ""} ${className}`}
			>
				<div className="text-gray-500">
					<div className="text-lg font-medium mb-2">体重を入力してください</div>
					<p>体重を入力すると、各レベルの目標重量が表示されます</p>
				</div>
			</div>
		);
	}

	// 体重バリデーション
	const validation = validateBodyWeight(bodyWeight);
	if (!validation.isValid) {
		return (
			<div
				className={`text-center py-8 ${compact ? "text-sm" : ""} ${className}`}
			>
				<div className="text-red-600">
					<div className="text-lg font-medium mb-2">
						有効な体重データがありません
					</div>
					<p>{validation.errorMessage}</p>
					<p className="mt-1 text-sm">
						体重は50kg〜140kgの範囲で入力してください
					</p>
				</div>
			</div>
		);
	}

	return (
		<section
			className={`${compact ? "text-sm" : ""} ${className}`}
			aria-label="目標重量一覧"
		>
			{/* ヘッダー */}
			<div className="text-center mb-6">
				<h2
					className={`font-bold text-gray-900 mb-2 ${compact ? "text-lg" : "text-2xl"}`}
				>
					目標重量
				</h2>
				<p className="text-gray-600">
					体重:{" "}
					<span className="font-semibold text-blue-600">{bodyWeight}kg</span>
				</p>
			</div>

			{/* 種目別目標重量カード */}
			<div className="grid gap-6 md:grid-cols-3">
				{exercises.map((exercise) => {
					const levelWeights = calculateLevelWeights(bodyWeight, exercise);

					if (!levelWeights) {
						return (
							<div
								key={exercise}
								className="p-4 bg-red-50 border border-red-200 rounded-lg"
							>
								<h3 className="font-semibold text-red-800 mb-2">{exercise}</h3>
								<p className="text-red-600 text-sm">
									データを取得できませんでした
								</p>
							</div>
						);
					}

					return (
						<div
							key={exercise}
							className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
							role="group"
							aria-label={`${exercise}目標重量`}
						>
							{/* 種目名 */}
							<h3
								className={`font-bold text-gray-900 mb-4 text-center ${compact ? "text-base" : "text-lg"}`}
							>
								{exercise}
							</h3>

							{/* レベル別重量リスト */}
							<div className="space-y-3">
								{LEVEL_ORDER.map((level) => {
									const weight = levelWeights[level];
									const displayWeight = Number.isInteger(weight)
										? weight
										: weight.toFixed(1);

									return (
										<div
											key={level}
											className={`
												flex justify-between items-center p-3 rounded-lg
												${getLevelBgColor(level)}
												transition-colors hover:opacity-80
											`}
										>
											<span className={`font-medium ${getLevelColor(level)}`}>
												{level}
											</span>
											<span
												className={`font-bold ${getLevelColor(level)} ${compact ? "text-sm" : "text-base"}`}
											>
												{displayWeight}kg
											</span>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>

			{/* 説明文 */}
			<div className="mt-6 text-center">
				<p className="text-sm text-gray-500">
					※
					目標重量は一般的な指標です。個人差やトレーニング経験を考慮してください
				</p>
			</div>

			{/* BIG3合計値セクション */}
			<div className="mt-12">
				<BIG3Total bodyWeight={bodyWeight} />
			</div>
		</section>
	);
};
