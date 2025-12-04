import { User } from "lucide-react";
import type React from "react";
import type { Gender } from "../../types/big3";

interface GenderSelectorProps {
	selectedGender: Gender;
	onChange: (gender: Gender) => void;
	disabled?: boolean;
	className?: string;
}

export const GenderSelector: React.FC<GenderSelectorProps> = ({
	selectedGender,
	onChange,
	disabled = false,
	className = "",
}) => {
	return (
		<div className={className}>
			<span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				性別
			</span>
			<div className="flex gap-2" role="radiogroup" aria-label="性別選択">
				<button
					type="button"
					onClick={() => onChange("male")}
					disabled={disabled}
					className={`
						flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
						${
							selectedGender === "male"
								? "bg-blue-600 text-white shadow-sm"
								: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
						}
						${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
					`}
					aria-pressed={selectedGender === "male"}
				>
					<User className="w-4 h-4" />
					<span>男性</span>
				</button>

				<button
					type="button"
					onClick={() => onChange("female")}
					disabled={disabled}
					className={`
						flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
						${
							selectedGender === "female"
								? "bg-pink-600 text-white shadow-sm"
								: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
						}
						${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
					`}
					aria-pressed={selectedGender === "female"}
				>
					<User className="w-4 h-4" />
					<span>女性</span>
				</button>
			</div>
		</div>
	);
};
