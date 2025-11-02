/**
 * 肩たたき券詳細ページ（管理者用）
 */

"use client";

import { DeleteConfirmDialog } from "@/components/massage-ticket/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import {
	deleteMassageTicket,
	getMassageTicket,
	verifyTicketHash,
} from "@/lib/massage-ticket/massageTicketService";
import type { MassageTicket } from "@/types/massage-ticket";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function MassageTicketDetailPage() {
	const params = useParams();
	const router = useRouter();
	const ticketId = params.ticketId as string;
	const [ticket, setTicket] = useState<MassageTicket | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const loadTicket = useCallback(async () => {
		if (!ticketId) return;

		setIsLoading(true);
		setError(null);

		try {
			const loadedTicket = await getMassageTicket(ticketId);
			if (!loadedTicket) {
				setError("肩たたき券が見つかりません");
				setIsLoading(false);
				return;
			}

			// 改ざんチェック
			const isValid = verifyTicketHash(loadedTicket);
			if (!isValid) {
				setError("肩たたき券が改ざんされている可能性があります");
				setIsLoading(false);
				return;
			}

			setTicket(loadedTicket);
		} catch (err) {
			console.error("チケットの読み込みに失敗しました:", err);
			setError("チケットの読み込みに失敗しました");
		} finally {
			setIsLoading(false);
		}
	}, [ticketId]);

	useEffect(() => {
		loadTicket();
	}, [loadTicket]);

	const handleDeleteClick = () => {
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!ticket) return;

		setIsDeleting(true);
		try {
			await deleteMassageTicket(ticket.id);
			router.push("/massage-ticket/admin/list");
		} catch (err) {
			console.error("削除に失敗しました:", err);
			alert("削除に失敗しました");
		} finally {
			setIsDeleting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="text-center">
					<p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
				</div>
			</div>
		);
	}

	if (error || !ticket) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
					<p className="text-red-800 dark:text-red-200 mb-4">
						{error || "肩たたき券が見つかりません"}
					</p>
					<Link href="/massage-ticket/admin/list">
						<Button variant="outline">一覧に戻る</Button>
					</Link>
				</div>
			</div>
		);
	}

	const isExpired = new Date() > ticket.expiresAt;
	const isFullyUsed = ticket.isUsed;

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			{/* ヘッダー */}
			<div className="flex items-center justify-between mb-8">
				<Link
					href="/massage-ticket/admin/list"
					className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
				>
					← 一覧に戻る
				</Link>
				<div className="flex gap-2">
					<Link href={`/massage-ticket/${ticket.id}`}>
						<Button variant="outline">表示ページを見る</Button>
					</Link>
					<Link href={`/massage-ticket/admin/scan?ticketId=${ticket.id}`}>
						<Button variant="outline">読み込みページ</Button>
					</Link>
					<Button variant="destructive" onClick={handleDeleteClick}>
						削除
					</Button>
				</div>
			</div>

			{/* チケット情報 */}
			<div className="bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg p-8 mb-6">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">
					チケット情報
				</h2>

				{/* 状態バッジ */}
				<div className="mb-6">
					{(isExpired || isFullyUsed) && (
						<div
							className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
								isExpired
									? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
									: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
							}`}
						>
							{isExpired ? "有効期限切れ" : "使用済み"}
						</div>
					)}
				</div>

				{/* 残り回数/時間 - 最も重要な情報を大きく表示 */}
				<div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950/40 rounded-xl border-2 border-blue-200 dark:border-blue-800">
					<div className="text-center">
						<span className="text-base text-gray-700 dark:text-blue-200 block mb-3">
							残り
							{ticket.usageUnit === "count" ? "回数" : "時間"}
						</span>
						{ticket.usageUnit === "count" ? (
							<p
								className={`text-5xl font-bold mb-2 ${
									(ticket.remainingCount || 0) === 0
										? "text-red-600 dark:text-red-400"
										: "text-blue-600 dark:text-blue-400"
								}`}
							>
								{(ticket.remainingCount || 0).toLocaleString()}回
							</p>
						) : (
							<p
								className={`text-5xl font-bold mb-2 ${
									(ticket.remainingTimeMinutes || 0) === 0
										? "text-red-600 dark:text-red-400"
										: "text-blue-600 dark:text-blue-400"
								}`}
							>
								{(ticket.remainingTimeMinutes || 0).toLocaleString()}分
							</p>
						)}
						{ticket.usageUnit === "count" && ticket.totalCount && (
							<p className="text-lg text-gray-600 dark:text-gray-300">
								総回数: {(ticket.totalCount || 0).toLocaleString()}回
							</p>
						)}
						{ticket.usageUnit === "time" && ticket.totalTimeMinutes && (
							<p className="text-lg text-gray-600 dark:text-gray-300">
								総時間: {ticket.totalTimeMinutes}分
							</p>
						)}
					</div>
				</div>

				{/* 基本情報 */}
				<div className="space-y-4 mb-6">
					<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
						<span className="text-base text-gray-600 dark:text-gray-300 font-medium">
							利用者名
						</span>
						<span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
							{ticket.userName}
						</span>
					</div>
					<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
						<span className="text-base text-gray-600 dark:text-gray-300 font-medium">
							チケットID
						</span>
						<span className="text-sm font-mono text-gray-700 dark:text-gray-200 break-all">
							{ticket.id}
						</span>
					</div>
					<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
						<span className="text-base text-gray-600 dark:text-gray-300 font-medium">
							作成日
						</span>
						<span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
							{ticket.createdAt.toLocaleDateString("ja-JP")}{" "}
							{ticket.createdAt.toLocaleTimeString("ja-JP", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					</div>
					<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
						<span className="text-base text-gray-600 dark:text-gray-300 font-medium">
							有効期限
						</span>
						<span
							className={`text-lg font-semibold ${
								isExpired
									? "text-red-600 dark:text-red-400"
									: "text-gray-900 dark:text-gray-50"
							}`}
						>
							{ticket.expiresAt.toLocaleDateString("ja-JP")}
						</span>
					</div>
					<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
						<span className="text-base text-gray-600 dark:text-gray-300 font-medium">
							利用単位
						</span>
						<span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
							{ticket.usageUnit === "count" ? "回数" : "時間"}
						</span>
					</div>
					<div className="flex items-center justify-between py-3">
						<span className="text-base text-gray-600 dark:text-gray-300 font-medium">
							状態
						</span>
						{isFullyUsed ? (
							<span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
								使用済み
							</span>
						) : (
							<span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
								利用可能
							</span>
						)}
					</div>
				</div>
			</div>

			{/* 利用履歴 */}
			<div className="bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg p-8">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">
					利用履歴
				</h2>

				{ticket.usages.length === 0 ? (
					<p className="text-gray-600 dark:text-gray-400 text-center py-8">
						まだ利用されていません
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										利用日時
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										利用量
									</th>
								</tr>
							</thead>
							<tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
								{ticket.usages.map((usage) => (
									<tr
										key={usage.id}
										className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
											{usage.usedAt.toLocaleDateString("ja-JP")}{" "}
											{usage.usedAt.toLocaleTimeString("ja-JP", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-50">
											{ticket.usageUnit === "count"
												? `${usage.usedCount || 0}回`
												: `${usage.usedTimeMinutes || 0}分`}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<DeleteConfirmDialog
				isOpen={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
				onConfirm={handleDeleteConfirm}
				ticketName={ticket.userName}
				isDeleting={isDeleting}
			/>
		</div>
	);
}
