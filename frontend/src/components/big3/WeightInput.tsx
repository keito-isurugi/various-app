import type React from "react";

interface WeightInputProps {
	/** 体重の値 (kg) */
	value: number | "";
	/** 値が変更された時のコールバック */
	onChange: (value: number | "") => void;
	/** エラーメッセージ */
	errorMessage?: string;
	/** 無効化フラグ */
	disabled?: boolean;
	/** 追加のCSSクラス */
	className?: string;
}

/**
 * 体重入力コンポーネント
 * 数値のみの入力を受け付け、バリデーションエラーを表示する
 */
export const WeightInput: React.FC<WeightInputProps> = ({
	value,
	onChange,
	errorMessage,
	disabled = false,
	className = "",
}) => {
	/**
	 * 入力値の変更処理
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;

		// 空文字の場合
		if (inputValue === "") {
			onChange("");
			return;
		}

		// 数値に変換を試行
		const numericValue = Number.parseFloat(inputValue);

		// 有効な数値の場合
		if (!Number.isNaN(numericValue)) {
			onChange(numericValue);
		} else {
			// 無効な入力の場合は空文字にする
			onChange("");
		}
	};

	const hasError = !!errorMessage;
	const inputValue = value === "" ? "" : value.toString();

	return (
		<div className={`space-y-2 ${className}`}>
			{/* ラベル */}
			<label
				htmlFor="bodyWeight"
				className="block text-sm font-medium text-gray-700"
			>
				体重 <span className="text-red-500">*</span>
			</label>

			{/* 入力フィールド */}
			<div className="relative">
				<input
					type="number"
					id="bodyWeight"
					value={inputValue}
					onChange={handleChange}
					disabled={disabled}
					placeholder="例: 70"
					min="0"
					step="0.1"
					className={`
						w-full px-3 py-2 pr-10 border rounded-lg 
						focus:ring-2 focus:ring-blue-500 focus:border-transparent 
						transition-colors
						${
							hasError ? "border-red-300 focus:ring-red-500" : "border-gray-300"
						}
						${
							disabled
								? "bg-gray-100 cursor-not-allowed text-gray-500"
								: "bg-white"
						}
					`}
					aria-invalid={hasError}
					aria-describedby={hasError ? "bodyWeight-error" : undefined}
				/>

				{/* 単位表示 */}
				<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<span
						className={`text-sm ${disabled ? "text-gray-400" : "text-gray-500"}`}
					>
						kg
					</span>
				</div>
			</div>

			{/* エラーメッセージ */}
			{hasError && (
				<p id="bodyWeight-error" className="text-sm text-red-600" role="alert">
					{errorMessage}
				</p>
			)}

			{/* ヘルプテキスト */}
			{!hasError && (
				<p className="text-sm text-gray-500">
					50kg〜140kgの範囲で入力してください
				</p>
			)}
		</div>
	);
};
