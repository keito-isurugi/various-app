/**
 * 改ざん防止用のハッシュ生成ユーティリティ
 */

/**
 * ハッシュ生成用のシークレットキー
 * 本番環境では環境変数から取得すべき
 */
const SECRET_KEY =
	process.env.NEXT_PUBLIC_MASSAGE_TICKET_SECRET_KEY ||
	"massage-ticket-secret-key-change-in-production";

/**
 * ハッシュ生成用のデータ型
 */
interface HashData {
	id: string;
	userName: string;
	createdAt: string;
	expiresAt: string;
	usageUnit: string;
	totalCount: number;
	totalTimeMinutes: number;
}

/**
 * シンプルなハッシュ関数（本番ではcrypto.subtleを使用すべき）
 * 今回はクライアント側でも動作するようにシンプルな実装
 */
export function generateHash(data: HashData): string {
	const dataString = JSON.stringify(data) + SECRET_KEY;

	// シンプルなハッシュ関数
	let hash = 0;
	for (let i = 0; i < dataString.length; i++) {
		const char = dataString.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}

	// 16進数文字列に変換
	return Math.abs(hash).toString(16);
}
