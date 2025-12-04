import { AlertCircle } from "lucide-react";
import type React from "react";
import type { Gender } from "../../types/big3";
import { getWeightRangeMessageByGender } from "../../utils/big3-calculator-gender";

interface WeightInputProps {
	value: number | "";
	onChange: (value: number | "") => void;
	gender: Gender;
	errorMessage?: string;
	disabled?: boolean;
	className?: string;
}

export const WeightInput: React.FC<WeightInputProps> = ({
	value,
	onChange,
	gender,
	errorMessage,
	disabled = false,
	className = "",
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;

		if (inputValue === "") {
			onChange("");
			return;
		}

		const numericValue = Number.parseFloat(inputValue);

		if (!Number.isNaN(numericValue)) {
			onChange(numericValue);
		} else {
			onChange("");
		}
	};

	const hasError = !!errorMessage;
	const inputValue = value === "" ? "" : value.toString();

	return (
		<div className={className}>
			<label
				htmlFor="bodyWeight"
				className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
			>
				体重 (kg)
			</label>
			<div className="relative">
				<input
					type="number"
					id="bodyWeight"
					value={inputValue}
					onChange={handleChange}
					disabled={disabled}
					placeholder={getWeightRangeMessageByGender(gender)}
					min="0"
					step="0.1"
					className={`
						w-full px-4 py-2.5 pr-12 rounded-lg border transition-colors
						bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
						placeholder:text-gray-400 dark:placeholder:text-gray-500
						focus:outline-none focus:ring-2
						${
							hasError
								? "border-red-500 dark:border-red-400 focus:ring-red-500/20"
								: "border-gray-300 dark:border-gray-600 focus:ring-blue-500/20 focus:border-blue-500"
						}
						${disabled ? "opacity-50 cursor-not-allowed" : ""}
					`}
					aria-invalid={hasError}
					aria-describedby={hasError ? "bodyWeight-error" : undefined}
				/>
				<span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
					kg
				</span>
			</div>

			{hasError && (
				<div
					id="bodyWeight-error"
					className="flex items-center gap-1.5 mt-2 text-sm text-red-600 dark:text-red-400"
				>
					<AlertCircle className="w-4 h-4 shrink-0" />
					<span>{errorMessage}</span>
				</div>
			)}
		</div>
	);
};
