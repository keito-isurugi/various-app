import type React from "react";
import type { CalculationResult } from "../../types/calculator";

interface ResultDisplayProps {
	/** 表示する計算結果 */
	result: CalculationResult;
	/** 追加のCSSクラス */
	className?: string;
}

/**
 * 計算結果の表示コンポーネント
 * 結果の値、単位、説明を美しく表示
 */
export const ResultDisplay: React.FC<ResultDisplayProps> = ({
	result,
	className = "",
}) => {
	return (
		<div
			role="region"
			aria-labelledby={`result-${result.id}`}
			className={`p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3 ${className}`}
		>
			{/* 結果名 */}
			<h3 id={`result-${result.id}`} className="text-lg font-semibold text-blue-900">
				{result.name}
			</h3>

			{/* メインの値（フォーマット済み） */}
			<div className="text-center">
				<div className="text-3xl font-bold text-blue-700 mb-1">
					{result.formattedValue}
				</div>
				
				{/* 生の値と単位 */}
				<div className="text-sm text-gray-600">
					({result.value} {result.unit})
				</div>
			</div>

			{/* 説明 */}
			{result.description && (
				<p className="text-sm text-gray-700 leading-relaxed">
					{result.description}
				</p>
			)}

			{/* 科学的記法での表示（非常に大きいまたは小さい値の場合） */}
			{(Math.abs(result.value) < 1e-6 || Math.abs(result.value) > 1e6) && (
				<div className="text-xs text-gray-500 font-mono">
					科学的記法: {result.value.toExponential(3)} {result.unit}
				</div>
			)}
		</div>
	);
};