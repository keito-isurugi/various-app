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
			className={`p-6 bg-primary/5 border border-primary/20 rounded-xl shadow-sm space-y-4 backdrop-blur-sm ${className}`}
		>
			{/* 結果名 */}
			<h3 id={`result-${result.id}`} className="text-xl font-bold text-primary">
				{result.name}
			</h3>

			{/* メインの値（フォーマット済み） */}
			<div className="text-center">
				<div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
					{result.formattedValue}
				</div>

				{/* 生の値と単位 */}
				<div className="text-sm text-muted-foreground font-mono">
					({result.value} {result.unit})
				</div>
			</div>

			{/* 説明 */}
			{result.description && (
				<div className="bg-secondary/50 rounded-lg p-3 border border-border">
					<p className="text-sm text-muted-foreground leading-relaxed">
						{result.description}
					</p>
				</div>
			)}

			{/* 科学的記法での表示（非常に大きいまたは小さい値の場合） */}
			{(Math.abs(result.value) < 1e-6 || Math.abs(result.value) > 1e6) && (
				<div className="text-xs text-muted-foreground font-mono bg-secondary rounded px-2 py-1">
					科学的記法: {result.value.toExponential(3)} {result.unit}
				</div>
			)}
		</div>
	);
};
