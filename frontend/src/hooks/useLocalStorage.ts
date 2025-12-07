import { useEffect, useState } from "react";

interface UseLocalStorageOptions<T> {
	/** LocalStorageのキー */
	key: string;
	/** デフォルト値 */
	defaultValue: T;
}

interface UseLocalStorageReturn<T> {
	/** 現在のデータ */
	data: T;
	/** データを更新する関数 */
	setData: React.Dispatch<React.SetStateAction<T>>;
	/** 保存済みデータがあるかどうか */
	hasSavedData: boolean;
	/** 保存処理中/完了状態 */
	isSaved: boolean;
	/** データをLocalStorageに保存 */
	save: () => void;
	/** データをクリア（LocalStorage + state） */
	clear: () => void;
}

/**
 * LocalStorageへの保存・読み込みを管理するカスタムフック
 */
export function useLocalStorage<T>({
	key,
	defaultValue,
}: UseLocalStorageOptions<T>): UseLocalStorageReturn<T> {
	const [data, setData] = useState<T>(defaultValue);
	const [hasSavedData, setHasSavedData] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	// Load from localStorage on mount
	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			const stored = localStorage.getItem(key);
			if (stored) {
				setData(JSON.parse(stored) as T);
				setHasSavedData(true);
			}
		} catch {
			// Ignore parse errors
		}
	}, [key]);

	const save = () => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(key, JSON.stringify(data));
			setHasSavedData(true);
			setIsSaved(true);
			setTimeout(() => setIsSaved(false), 2000);
		} catch {
			// Ignore storage errors
		}
	};

	const clear = () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem(key);
		}
		setData(defaultValue);
		setHasSavedData(false);
	};

	return {
		data,
		setData,
		hasSavedData,
		isSaved,
		save,
		clear,
	};
}
