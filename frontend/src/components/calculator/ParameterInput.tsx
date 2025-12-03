"use client";

import type React from "react";
import { useId, useState } from "react";
import type { CalculationParameter } from "../../types/calculator";

interface ParameterInputProps {
	/** 入力するパラメータ */
	parameter: CalculationParameter;
	/** 値変更時のコールバック */
	onChange: (parameter: CalculationParameter) => void;
	/** 無効化フラグ */
	disabled?: boolean;
	/** エラーメッセージ */
	error?: string;
}

/**
 * 計算パラメータの入力コンポーネント
 * 数値入力、バリデーション、エラー表示を提供
 */
export const ParameterInput: React.FC<ParameterInputProps> = ({
	parameter,
	onChange,
	disabled = false,
	error: externalError,
}) => {
	const [inputValue, setInputValue] = useState(() => {
		if (typeof parameter.value === "number" && !Number.isNaN(parameter.value)) {
			return parameter.value.toExponential();
		}
		return parameter.value.toString();
	});
	const [localError, setLocalError] = useState<string>("");
	const inputId = useId();
	const errorId = useId();

	const hasError = !!(localError || externalError);
	const errorMessage = localError || externalError;

	/**
	 * 入力値の変更処理
	 */
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;
		setInputValue(rawValue);

		// 数値変換とバリデーション
		const numericValue = Number.parseFloat(rawValue);

		if (Number.isNaN(numericValue)) {
			setLocalError("有効な数値を入力してください");
			return;
		}

		// 範囲チェック
		if (parameter.min !== undefined && numericValue < parameter.min) {
			setLocalError(`値は${parameter.min}以上である必要があります`);
			return;
		}

		if (parameter.max !== undefined && numericValue > parameter.max) {
			setLocalError(`値は${parameter.max}以下である必要があります`);
			return;
		}

		// バリデーション成功
		setLocalError("");
		onChange({
			...parameter,
			value: numericValue,
		});
	};

	/**
	 * フォーカス時の処理（指数表記をそのまま表示）
	 */
	const handleFocus = () => {
		if (typeof parameter.value === "number" && !Number.isNaN(parameter.value)) {
			setInputValue(parameter.value.toString());
		}
	};

	/**
	 * ブラー時の処理（指数表記に戻す）
	 */
	const handleBlur = () => {
		if (
			!hasError &&
			typeof parameter.value === "number" &&
			!Number.isNaN(parameter.value)
		) {
			setInputValue(parameter.value.toExponential());
		}
	};

	return (
		<div className="space-y-2">
			{/* ラベル */}
			<label
				htmlFor={inputId}
				className="block text-sm font-medium text-foreground"
			>
				{parameter.name}
				{parameter.required && <span className="text-destructive ml-1">*</span>}
				<span className="text-muted-foreground ml-2">({parameter.unit})</span>
			</label>

			{/* 説明 */}
			{parameter.description && (
				<p className="text-sm text-muted-foreground">{parameter.description}</p>
			)}

			{/* 入力フィールド */}
			<div className="relative">
				<input
					id={inputId}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					disabled={disabled}
					aria-label={`${parameter.name} (${parameter.unit})`}
					aria-describedby={hasError ? errorId : undefined}
					aria-invalid={hasError}
					className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
						hasError ? "border-destructive" : "border-input"
					} ${
						disabled
							? "bg-secondary text-muted-foreground cursor-not-allowed"
							: "bg-background text-foreground"
					}`}
					placeholder={`例: ${typeof parameter.value === "number" && !Number.isNaN(parameter.value) ? parameter.value.toExponential() : parameter.value}`}
				/>

				{/* 単位表示 */}
				<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
					<span className="text-muted-foreground text-sm">
						{parameter.unit}
					</span>
				</div>
			</div>

			{/* エラーメッセージ */}
			{hasError && (
				<p id={errorId} className="text-sm text-destructive flex items-center">
					<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
						<title>エラー</title>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
					{errorMessage}
				</p>
			)}

			{/* 範囲情報 */}
			{(parameter.min !== undefined || parameter.max !== undefined) && (
				<p className="text-xs text-muted-foreground">
					範囲: {parameter.min ?? "無制限"} ～ {parameter.max ?? "無制限"}
				</p>
			)}
		</div>
	);
};
