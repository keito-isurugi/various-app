/**
 * 肩たたき券サービスの実装
 * Firestoreとのやり取りを管理
 */

import {
	Timestamp,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import type {
	CreateMassageTicketInput,
	MassageTicket,
	MassageTicketUsage,
	UsageUnit,
} from "../../types/massage-ticket";
import { db } from "../firebase";
import { generateHash } from "./hashUtils";

const COLLECTION_NAME = "massageTickets";
const USAGE_COLLECTION_NAME = "massageTicketUsages";

/**
 * 一意なIDを生成（UUID v4風）
 */
export function generateTicketId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * 肩たたき券を作成
 */
export async function createMassageTicket(
	input: CreateMassageTicketInput,
): Promise<MassageTicket> {
	const id = generateTicketId();
	const createdAt = new Date();
	const expiresAt = input.expiresAt;

	// 初期値を設定
	const remainingCount =
		input.usageUnit === "count" ? input.totalCount || 0 : undefined;
	const remainingTimeMinutes =
		input.usageUnit === "time" ? input.totalTimeMinutes || 0 : undefined;

	// ハッシュを生成（改ざん防止用）
	const hashData = {
		id,
		userName: input.userName,
		createdAt: createdAt.toISOString(),
		expiresAt: expiresAt.toISOString(),
		usageUnit: input.usageUnit,
		totalCount: input.totalCount || 0,
		totalTimeMinutes: input.totalTimeMinutes || 0,
	};
	const hash = generateHash(hashData);

	const ticket: MassageTicket = {
		id,
		userId: "", // 将来の認証機能拡張用
		userName: input.userName,
		createdAt,
		expiresAt,
		usageUnit: input.usageUnit,
		totalCount: input.totalCount,
		totalTimeMinutes: input.totalTimeMinutes,
		remainingCount,
		remainingTimeMinutes,
		usages: [],
		hash,
		isUsed: false,
	};

	// Firestoreに保存（undefinedのフィールドを除外）
	const docRef = doc(db, COLLECTION_NAME, id);
	const firestoreData: Record<string, unknown> = {
		id,
		userId: ticket.userId,
		userName: ticket.userName,
		createdAt: Timestamp.fromDate(ticket.createdAt),
		expiresAt: Timestamp.fromDate(ticket.expiresAt),
		usageUnit: ticket.usageUnit,
		hash: ticket.hash,
		isUsed: ticket.isUsed,
	};

	// 使用しないフィールドはundefinedでない場合のみ追加
	if (ticket.totalCount !== undefined) {
		firestoreData.totalCount = ticket.totalCount;
	}
	if (ticket.totalTimeMinutes !== undefined) {
		firestoreData.totalTimeMinutes = ticket.totalTimeMinutes;
	}
	if (ticket.remainingCount !== undefined) {
		firestoreData.remainingCount = ticket.remainingCount;
	}
	if (ticket.remainingTimeMinutes !== undefined) {
		firestoreData.remainingTimeMinutes = ticket.remainingTimeMinutes;
	}

	await setDoc(docRef, firestoreData);

	return ticket;
}

/**
 * 肩たたき券を取得
 */
export async function getMassageTicket(
	id: string,
): Promise<MassageTicket | null> {
	const docRef = doc(db, COLLECTION_NAME, id);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) {
		return null;
	}

	const data = docSnap.data();

	// 利用履歴を取得
	const usagesQuery = query(
		collection(db, USAGE_COLLECTION_NAME),
		where("ticketId", "==", id),
	);
	const usagesSnap = await getDocs(usagesQuery);
	const usages: MassageTicketUsage[] = usagesSnap.docs.map((doc) => {
		const usageData = doc.data();
		return {
			id: doc.id,
			ticketId: usageData.ticketId,
			usedAt: usageData.usedAt.toDate(),
			usedCount: usageData.usedCount,
			usedTimeMinutes: usageData.usedTimeMinutes,
			managerId: usageData.managerId,
		};
	});

	const ticket: MassageTicket = {
		id: data.id,
		userId: data.userId || "",
		userName: data.userName,
		createdAt: data.createdAt.toDate(),
		expiresAt: data.expiresAt.toDate(),
		usageUnit: data.usageUnit,
		totalCount: data.totalCount,
		totalTimeMinutes: data.totalTimeMinutes,
		remainingCount: data.remainingCount,
		remainingTimeMinutes: data.remainingTimeMinutes,
		usages,
		hash: data.hash,
		isUsed: data.isUsed,
	};

	return ticket;
}

/**
 * 肩たたき券の利用を記録
 */
export async function useMassageTicket(
	ticketId: string,
	usedCount?: number,
	usedTimeMinutes?: number,
): Promise<void> {
	const ticket = await getMassageTicket(ticketId);

	if (!ticket) {
		throw new Error("肩たたき券が見つかりません");
	}

	// 有効期限チェック
	if (new Date() > ticket.expiresAt) {
		throw new Error("肩たたき券の有効期限が切れています");
	}

	// 残り回数/時間チェック
	if (ticket.usageUnit === "count") {
		if (
			ticket.remainingCount === undefined ||
			ticket.remainingCount < (usedCount || 0)
		) {
			throw new Error("残り回数が不足しています");
		}
	} else if (ticket.usageUnit === "time") {
		if (
			ticket.remainingTimeMinutes === undefined ||
			ticket.remainingTimeMinutes < (usedTimeMinutes || 0)
		) {
			throw new Error("残り時間が不足しています");
		}
	}

	// 利用履歴を作成
	const usage: Omit<MassageTicketUsage, "id"> = {
		ticketId,
		usedAt: new Date(),
		usedCount,
		usedTimeMinutes,
	};

	// 利用履歴を保存（undefinedのフィールドを除外）
	const usageRef = doc(collection(db, USAGE_COLLECTION_NAME));
	const usageData: Record<string, unknown> = {
		ticketId: usage.ticketId,
		usedAt: Timestamp.fromDate(usage.usedAt),
	};

	if (usage.usedCount !== undefined) {
		usageData.usedCount = usage.usedCount;
	}
	if (usage.usedTimeMinutes !== undefined) {
		usageData.usedTimeMinutes = usage.usedTimeMinutes;
	}
	if (usage.managerId !== undefined) {
		usageData.managerId = usage.managerId;
	}

	await setDoc(usageRef, usageData);

	// 残り回数/時間を更新
	const updates: {
		remainingCount?: number;
		remainingTimeMinutes?: number;
		isUsed?: boolean;
	} = {};

	if (ticket.usageUnit === "count" && usedCount !== undefined) {
		const newRemainingCount = (ticket.remainingCount || 0) - usedCount;
		updates.remainingCount = Math.max(0, newRemainingCount);
		updates.isUsed = updates.remainingCount === 0;
	} else if (ticket.usageUnit === "time" && usedTimeMinutes !== undefined) {
		const newRemainingTimeMinutes =
			(ticket.remainingTimeMinutes || 0) - usedTimeMinutes;
		updates.remainingTimeMinutes = Math.max(0, newRemainingTimeMinutes);
		updates.isUsed = updates.remainingTimeMinutes === 0;
	}

	// チケット情報を更新
	const ticketRef = doc(db, COLLECTION_NAME, ticketId);
	await updateDoc(ticketRef, updates);
}

/**
 * ハッシュを検証（改ざんチェック）
 */
export function verifyTicketHash(ticket: MassageTicket): boolean {
	const hashData = {
		id: ticket.id,
		userName: ticket.userName,
		createdAt: ticket.createdAt.toISOString(),
		expiresAt: ticket.expiresAt.toISOString(),
		usageUnit: ticket.usageUnit,
		totalCount: ticket.totalCount || 0,
		totalTimeMinutes: ticket.totalTimeMinutes || 0,
	};
	const expectedHash = generateHash(hashData);
	return expectedHash === ticket.hash;
}

/**
 * すべての肩たたき券を取得（作成日時の降順）
 */
export async function getAllMassageTickets(): Promise<MassageTicket[]> {
	const q = query(
		collection(db, COLLECTION_NAME),
		orderBy("createdAt", "desc"),
	);
	const querySnapshot = await getDocs(q);

	const tickets: MassageTicket[] = [];

	for (const docSnap of querySnapshot.docs) {
		const data = docSnap.data();

		// 利用履歴を取得
		const usagesQuery = query(
			collection(db, USAGE_COLLECTION_NAME),
			where("ticketId", "==", data.id),
		);
		const usagesSnap = await getDocs(usagesQuery);
		const usages: MassageTicketUsage[] = usagesSnap.docs.map((usageDoc) => {
			const usageData = usageDoc.data();
			return {
				id: usageDoc.id,
				ticketId: usageData.ticketId,
				usedAt: usageData.usedAt.toDate(),
				usedCount: usageData.usedCount,
				usedTimeMinutes: usageData.usedTimeMinutes,
				managerId: usageData.managerId,
			};
		});

		const ticket: MassageTicket = {
			id: data.id,
			userId: data.userId || "",
			userName: data.userName,
			createdAt: data.createdAt.toDate(),
			expiresAt: data.expiresAt.toDate(),
			usageUnit: data.usageUnit,
			totalCount: data.totalCount,
			totalTimeMinutes: data.totalTimeMinutes,
			remainingCount: data.remainingCount,
			remainingTimeMinutes: data.remainingTimeMinutes,
			usages,
			hash: data.hash,
			isUsed: data.isUsed,
		};

		tickets.push(ticket);
	}

	return tickets;
}

/**
 * 肩たたき券を削除
 */
export async function deleteMassageTicket(ticketId: string): Promise<void> {
	// チケット自体を削除
	const ticketRef = doc(db, COLLECTION_NAME, ticketId);
	await deleteDoc(ticketRef);

	// 関連する利用履歴も削除
	const usagesQuery = query(
		collection(db, USAGE_COLLECTION_NAME),
		where("ticketId", "==", ticketId),
	);
	const usagesSnap = await getDocs(usagesQuery);

	const deletePromises = usagesSnap.docs.map((usageDoc) =>
		deleteDoc(usageDoc.ref),
	);
	await Promise.all(deletePromises);
}
