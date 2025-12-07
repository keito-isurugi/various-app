"use client";

import { Check, Save, Trash2 } from "lucide-react";

interface SaveClearButtonsProps {
	/** 保存ボタンが押せるかどうか */
	canSave: boolean;
	/** クリアボタンが押せるかどうか */
	canClear: boolean;
	/** 保存処理が完了した状態 */
	isSaved: boolean;
	/** 保存済みデータがあるかどうか */
	hasSavedData: boolean;
	/** 保存ボタン押下時のコールバック */
	onSave: () => void;
	/** クリアボタン押下時のコールバック */
	onClear: () => void;
}

export function SaveClearButtons({
	canSave,
	canClear,
	isSaved,
	hasSavedData,
	onSave,
	onClear,
}: SaveClearButtonsProps) {
	return (
		<div className="flex items-center gap-2">
			{hasSavedData && (
				<span className="text-xs text-gray-500 dark:text-gray-400">
					保存済み
				</span>
			)}
			<button
				type="button"
				onClick={onSave}
				disabled={!canSave}
				title="入力値をブラウザに保存します（次回アクセス時に復元されます）"
				className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
					isSaved
						? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
						: canSave
							? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
							: "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
				}`}
			>
				{isSaved ? (
					<>
						<Check className="w-4 h-4" />
						保存しました
					</>
				) : (
					<>
						<Save className="w-4 h-4" />
						ブラウザに保存
					</>
				)}
			</button>
			<button
				type="button"
				onClick={onClear}
				disabled={!canClear}
				title="入力値と保存データをクリアします"
				className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
					canClear
						? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
						: "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
				}`}
			>
				<Trash2 className="w-4 h-4" />
				クリア
			</button>
		</div>
	);
}
