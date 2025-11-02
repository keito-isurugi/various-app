/**
 * 肩たたき券一覧ページ（管理者用）
 */

"use client";

import { DeleteConfirmDialog } from "@/components/massage-ticket/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import {
	deleteMassageTicket,
	getAllMassageTickets,
} from "@/lib/massage-ticket/massageTicketService";
import type { MassageTicket } from "@/types/massage-ticket";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MassageTicketListPage() {
	const [tickets, setTickets] = useState<MassageTicket[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState<MassageTicket | null>(
		null,
	);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		loadTickets();
	}, []);

	const loadTickets = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const loadedTickets = await getAllMassageTickets();
			setTickets(loadedTickets);
		} catch (err) {
			console.error("チケット一覧の読み込みに失敗しました:", err);
			setError("チケット一覧の読み込みに失敗しました");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteClick = (ticket: MassageTicket) => {
		setSelectedTicket(ticket);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedTicket) return;

		setIsDeleting(true);
		try {
			await deleteMassageTicket(selectedTicket.id);
			await loadTickets();
			setDeleteDialogOpen(false);
			setSelectedTicket(null);
		} catch (err) {
			console.error("削除に失敗しました:", err);
			alert("削除に失敗しました");
		} finally {
			setIsDeleting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div className="text-center">
					<p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">肩たたき券一覧</h1>
				<div className="flex gap-2">
					<Link href="/massage-ticket/create">
						<Button>新規作成</Button>
					</Link>
					<Button variant="outline" onClick={loadTickets}>
						更新
					</Button>
				</div>
			</div>

			{error && (
				<div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 text-red-800 dark:text-red-200">
					{error}
				</div>
			)}

			{tickets.length === 0 ? (
				<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						肩たたき券がまだ作成されていません
					</p>
					<Link href="/massage-ticket/create">
						<Button>最初の肩たたき券を作成</Button>
					</Link>
				</div>
			) : (
				<div className="bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										利用者名
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										作成日
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										有効期限
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										利用単位
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										残り
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										状態
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										操作
									</th>
								</tr>
							</thead>
							<tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
								{tickets.map((ticket) => {
									const isExpired = new Date() > ticket.expiresAt;
									const isFullyUsed = ticket.isUsed;

									return (
										<tr
											key={ticket.id}
											className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<Link
													href={`/massage-ticket/admin/list/${ticket.id}`}
													className="text-lg font-semibold text-gray-900 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400"
												>
													{ticket.userName}
												</Link>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
												{ticket.createdAt.toLocaleDateString("ja-JP")}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<span
													className={
														isExpired
															? "text-red-600 dark:text-red-400"
															: "text-gray-600 dark:text-gray-300"
													}
												>
													{ticket.expiresAt.toLocaleDateString("ja-JP")}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
												{ticket.usageUnit === "count" ? "回数" : "時間"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
												{ticket.usageUnit === "count" ? (
													<span
														className={
															(ticket.remainingCount || 0) === 0
																? "text-red-600 dark:text-red-400"
																: "text-blue-600 dark:text-blue-400"
														}
													>
														{(ticket.remainingCount || 0).toLocaleString()}回
													</span>
												) : (
													<span
														className={
															(ticket.remainingTimeMinutes || 0) === 0
																? "text-red-600 dark:text-red-400"
																: "text-blue-600 dark:text-blue-400"
														}
													>
														{(
															ticket.remainingTimeMinutes || 0
														).toLocaleString()}
														分
													</span>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{isFullyUsed ? (
													<span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
														使用済み
													</span>
												) : isExpired ? (
													<span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
														期限切れ
													</span>
												) : (
													<span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
														利用可能
													</span>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
												<Link
													href={`/massage-ticket/admin/list/${ticket.id}`}
													className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
												>
													詳細
												</Link>
												<button
													type="button"
													onClick={() => handleDeleteClick(ticket)}
													className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
												>
													削除
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<DeleteConfirmDialog
				isOpen={deleteDialogOpen}
				onClose={() => {
					setDeleteDialogOpen(false);
					setSelectedTicket(null);
				}}
				onConfirm={handleDeleteConfirm}
				ticketName={selectedTicket?.userName}
				isDeleting={isDeleting}
			/>
		</div>
	);
}
