import type React from "react";
import { BIG3_DATA, LEVEL_ORDER } from "../../data/big3-data";
import type { ExerciseType, WeightLevel } from "../../types/big3";
import { getLevelColor } from "../../utils/big3-calculator";

interface DataTableProps {
	/** 表示する種目 */
	exercise: ExerciseType;
	/** ハイライトする体重 */
	highlightBodyWeight?: number;
	/** コンパクト表示モード */
	compact?: boolean;
	/** 追加のCSSクラス */
	className?: string;
}

/**
 * BIG3データ表示テーブルコンポーネント
 * 指定された種目のレベル別重量データを表形式で表示する
 */
export const DataTable: React.FC<DataTableProps> = ({
	exercise,
	highlightBodyWeight,
	compact = false,
	className = "",
}) => {
	const exerciseData = BIG3_DATA[exercise];

	/**
	 * 指定した体重がハイライト対象かチェック
	 */
	const isHighlighted = (bodyWeight: number): boolean => {
		if (!highlightBodyWeight) return false;
		return Math.abs(bodyWeight - highlightBodyWeight) < 2.5; // 2.5kg以内なら該当
	};

	/**
	 * レベルヘッダーのスタイルを取得
	 */
	const getLevelHeaderStyle = (level: WeightLevel): string => {
		return `${getLevelColor(level)} font-semibold`;
	};

	return (
		<div className={`${compact ? "text-sm" : ""} ${className}`}>
			<div className="overflow-x-auto">
				<table
					className="min-w-full border-collapse border border-gray-300"
					aria-label={`${exercise}のレベル別重量データ`}
				>
					<caption className="caption-top text-lg font-semibold text-gray-900 mb-4">
						{exercise}のレベル別重量表
					</caption>

					<thead>
						<tr className="bg-gray-50">
							<th
								scope="col"
								className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900"
							>
								体重 (kg)
							</th>
							{LEVEL_ORDER.map((level) => (
								<th
									key={level}
									scope="col"
									className={`
										border border-gray-300 px-4 py-2 text-center
										${getLevelHeaderStyle(level)}
									`}
								>
									{level}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{exerciseData.map((data) => {
							const highlighted = isHighlighted(data.bodyWeight);

							return (
								<tr
									key={data.bodyWeight}
									className={`
										${
											highlighted
												? "bg-blue-50 border-blue-200"
												: "hover:bg-gray-50"
										}
										transition-colors
									`}
								>
									{/* 体重セル */}
									<td
										className={`
										border border-gray-300 px-4 py-2 font-medium
										${highlighted ? "text-blue-900" : "text-gray-900"}
									`}
									>
										{data.bodyWeight}
									</td>

									{/* 各レベルの重量セル */}
									{LEVEL_ORDER.map((level) => (
										<td
											key={level}
											className={`
												border border-gray-300 px-4 py-2 text-center
												${highlighted ? "text-blue-900" : "text-gray-700"}
											`}
										>
											{data[level]}
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* テーブル下部の説明 */}
			<div className="mt-4 text-sm text-gray-600">
				<p>単位: kg</p>
				{highlightBodyWeight && (
					<p className="text-blue-600 font-medium">
						体重 {highlightBodyWeight}kg 付近の行がハイライトされています
					</p>
				)}
			</div>
		</div>
	);
};
