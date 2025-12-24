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
 * オブジェクトをディープマージする
 * 保存されたデータの欠落プロパティをデフォルト値で補完する
 */
function deepMerge<T>(defaultValue: T, storedValue: unknown): T {
	if (
		typeof defaultValue !== "object" ||
		defaultValue === null ||
		Array.isArray(defaultValue)
	) {
		return storedValue as T;
	}

	if (
		typeof storedValue !== "object" ||
		storedValue === null ||
		Array.isArray(storedValue)
	) {
		return defaultValue;
	}

	const result = { ...defaultValue } as Record<string, unknown>;
	const stored = storedValue as Record<string, unknown>;

	for (const key of Object.keys(defaultValue as Record<string, unknown>)) {
		if (key in stored) {
			result[key] = deepMerge(
				(defaultValue as Record<string, unknown>)[key],
				stored[key],
			);
		}
	}

	return result as T;
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
				const parsed = JSON.parse(stored);
				// デフォルト値とマージして欠落プロパティを補完
				setData(deepMerge(defaultValue, parsed));
				setHasSavedData(true);
			}
		} catch {
			// Ignore parse errors
		}
	}, [key, defaultValue]);

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
