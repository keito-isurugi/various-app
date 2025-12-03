import type React from "react";
import type { Gender } from "../../types/big3";

interface GenderSelectorProps {
	/** 選択された性別 */
	selectedGender: Gender;
	/** 性別が変更された時のコールバック */
	onChange: (gender: Gender) => void;
	/** 無効化フラグ */
	disabled?: boolean;
	/** 追加のCSSクラス */
	className?: string;
}

/**
 * 性別選択コンポーネント
 * 男性・女性の選択UIを提供
 */
export const GenderSelector: React.FC<GenderSelectorProps> = ({
	selectedGender,
	onChange,
	disabled = false,
	className = "",
}) => {
	return (
		<div className={`space-y-3 ${className}`}>
			{/* ラベル */}
			<div className="block text-sm font-semibold text-foreground flex items-center gap-2">
				<span className="text-lg">👤</span>
				性別選択
			</div>

			{/* 性別選択ボタン */}
			<fieldset className="inline-flex bg-secondary p-1.5 rounded-xl border-2 border-border shadow-sm">
				<legend className="sr-only">性別選択</legend>
				{/* 男性ボタン */}
				<button
					type="button"
					onClick={() => onChange("male")}
					disabled={disabled}
					className={`
						px-5 py-3 text-sm font-bold rounded-lg transition-all duration-300 transform relative
						${
							selectedGender === "male"
								? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-500 ring-opacity-50 scale-105"
								: "text-foreground bg-card hover:scale-110 active:scale-95 shadow-sm"
						}
						${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
					`}
					role="radio"
					aria-checked={selectedGender === "male"}
					aria-label="男性"
				>
					<span className="flex items-center gap-2.5">
						<span className="text-lg">
							{selectedGender === "male" ? "👨" : "👤"}
						</span>
						<span>男性</span>
						{selectedGender === "male" && (
							<span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
						)}
					</span>
				</button>

				{/* 女性ボタン */}
				<button
					type="button"
					onClick={() => onChange("female")}
					disabled={disabled}
					className={`
						px-5 py-3 text-sm font-bold rounded-lg transition-all duration-300 transform relative
						${
							selectedGender === "female"
								? "bg-pink-600 text-white shadow-lg ring-2 ring-pink-500 ring-opacity-50 scale-105"
								: "text-foreground bg-card hover:scale-110 active:scale-95 shadow-sm"
						}
						${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
					`}
					role="radio"
					aria-checked={selectedGender === "female"}
					aria-label="女性"
				>
					<span className="flex items-center gap-2.5">
						<span className="text-lg">
							{selectedGender === "female" ? "👩" : "👤"}
						</span>
						<span>女性</span>
						{selectedGender === "female" && (
							<span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
						)}
					</span>
				</button>
			</fieldset>

			{/* 選択状態表示と説明テキスト */}
			<div className="space-y-2">
				{/* 現在の選択状態 */}
				<div className="flex items-center justify-center gap-2 p-2 bg-secondary rounded-lg border border-border">
					<span className="text-sm font-medium text-muted-foreground">
						選択中:
					</span>
					<span
						className={`
						text-sm font-bold px-2 py-1 rounded-md
						${
							selectedGender === "male"
								? "text-blue-600 bg-blue-100"
								: "text-pink-600 bg-pink-100"
						}
					`}
					>
						{selectedGender === "male" ? "👨 男性" : "👩 女性"}
					</span>
				</div>

				{/* 説明テキスト */}
				<div className="flex items-center gap-2 p-3 bg-secondary border border-border rounded-lg">
					<span className="text-muted-foreground">💡</span>
					<p className="text-sm text-muted-foreground">
						性別によって適用される基準値が異なります
					</p>
				</div>
			</div>
		</div>
	);
};
