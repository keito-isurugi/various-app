/**
 * シンプルなインメモリキャッシュ
 * Tech Quiz用のデータキャッシュ機構
 */

interface CacheEntry<T> {
	data: T;
	timestamp: number;
	ttl: number; // Time to live in milliseconds
}

class DataCache {
	private cache: Map<string, CacheEntry<unknown>>;

	constructor() {
		this.cache = new Map();
	}

	/**
	 * キャッシュにデータを保存
	 */
	set<T>(key: string, data: T, ttl = 5 * 60 * 1000): void {
		// デフォルト5分間キャッシュ
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
			ttl,
		});
	}

	/**
	 * キャッシュからデータを取得
	 */
	get<T>(key: string): T | null {
		const entry = this.cache.get(key);

		if (!entry) {
			return null;
		}

		// TTL チェック
		if (Date.now() - entry.timestamp > entry.ttl) {
			this.cache.delete(key);
			return null;
		}

		return entry.data as T;
	}

	/**
	 * 特定のキーを削除
	 */
	delete(key: string): void {
		this.cache.delete(key);
	}

	/**
	 * パターンに一致するキーを削除
	 */
	deletePattern(pattern: RegExp): void {
		for (const key of this.cache.keys()) {
			if (pattern.test(key)) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * すべてのキャッシュをクリア
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * 期限切れのエントリを削除
	 */
	cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.cache.entries()) {
			if (now - entry.timestamp > entry.ttl) {
				this.cache.delete(key);
			}
		}
	}
}

// シングルトンインスタンス
export const dataCache = new DataCache();

// 定期的にクリーンアップ（5分ごと）
if (typeof window !== "undefined") {
	setInterval(
		() => {
			dataCache.cleanup();
		},
		5 * 60 * 1000,
	);
}

// キャッシュキーのヘルパー関数
export const cacheKeys = {
	allQuestions: () => "questions:all",
	questionById: (id: string) => `questions:${id}`,
	userProgress: (userId: string, questionId: string) =>
		`progress:${userId}:${questionId}`,
	allUserProgress: (userId: string) => `progress:${userId}:all`,
	userStats: (userId: string) => `stats:${userId}`,
	todayProgress: (userId: string, date: string) =>
		`dailyProgress:${userId}:${date}`,
	reviewQuestions: (userId: string) => `review:${userId}`,
	bookmarked: (userId: string) => `bookmarked:${userId}`,
};
