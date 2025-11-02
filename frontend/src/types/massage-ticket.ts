/**
 * 肩たたき券の型定義
 */

/**
 * 肩たたき券の利用単位（回数 or 時間）
 */
export type UsageUnit = "count" | "time";

/**
 * 肩たたき券の利用履歴
 */
export interface MassageTicketUsage {
	id: string;
	ticketId: string;
	usedAt: Date;
	usedCount?: number; // 回数制の場合
	usedTimeMinutes?: number; // 時間制の場合
	managerId?: string; // 管理者ID（将来的に拡張可能）
}

/**
 * 肩たたき券の基本情報
 */
export interface MassageTicket {
	id: string;
	userId: string; // 作成者のID（将来の認証機能拡張用）
	userName: string; // 利用者の名前
	createdAt: Date;
	expiresAt: Date;
	usageUnit: UsageUnit;
	totalCount?: number; // 回数制の場合の総回数
	totalTimeMinutes?: number; // 時間制の場合の総時間（分）
	remainingCount?: number; // 回数制の場合の残り回数
	remainingTimeMinutes?: number; // 時間制の場合の残り時間（分）
	usages: MassageTicketUsage[]; // 利用履歴
	hash: string; // 改ざん防止用ハッシュ
	isUsed: boolean; // 使用済みかどうか
}

/**
 * 肩たたき券作成時の入力データ
 */
export interface CreateMassageTicketInput {
	userName: string;
	expiresAt: Date;
	usageUnit: UsageUnit;
	totalCount?: number;
	totalTimeMinutes?: number;
}
