/**
 * 肩たたき券一覧ページ（管理者用）
 */

"use client";

import { Button } from "@/components/ui/button";
import { getAllMassageTickets } from "@/lib/massage-ticket/massageTicketService";
import type { MassageTicket } from "@/types/massage-ticket";
import { Plus, QrCode, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MassageTicketListPage() {
	const [tickets, setTickets] = useState<MassageTicket[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div className="text-center">
					<p className="text-muted-foreground">読み込み中...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-4">肩たたき券管理</h1>

				{/* ナビゲーションボタン */}
				<div className="flex flex-wrap gap-3">
					<Link href="/massage-ticket/admin/create">
						<Button className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							新規作成
						</Button>
					</Link>
					<Link href="/massage-ticket/admin/scan">
						<Button variant="outline" className="flex items-center gap-2">
							<QrCode className="h-4 w-4" />
							QR読み込み
						</Button>
					</Link>
					<Button
						variant="outline"
						onClick={loadTickets}
						className="flex items-center gap-2"
					>
						<RefreshCcw className="h-4 w-4" />
						更新
					</Button>
				</div>
			</div>

			{error && (
				<div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 text-destructive">
					{error}
				</div>
			)}

			{tickets.length === 0 ? (
				<div className="bg-secondary rounded-lg p-8 text-center">
					<p className="text-muted-foreground mb-4">
						肩たたき券がまだ作成されていません
					</p>
					<Link href="/massage-ticket/admin/create">
						<Button>最初の肩たたき券を作成</Button>
					</Link>
				</div>
			) : (
				<div className="bg-card shadow-lg border border-border rounded-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-secondary border-b border-border">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										利用者名
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										作成日
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										有効期限
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										利用単位
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										残り
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										状態
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
										操作
									</th>
								</tr>
							</thead>
							<tbody className="bg-card divide-y divide-border">
								{tickets.map((ticket) => {
									const isExpired = new Date() > ticket.expiresAt;
									const isFullyUsed = ticket.isUsed;

									return (
										<tr
											key={ticket.id}
											className="hover:bg-secondary transition-colors"
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<Link
													href={`/massage-ticket/admin/list/${ticket.id}`}
													className="text-lg font-semibold text-foreground hover:text-primary"
												>
													{ticket.userName}
												</Link>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
												{ticket.createdAt.toLocaleDateString("ja-JP")}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<span
													className={
														isExpired
															? "text-destructive"
															: "text-muted-foreground"
													}
												>
													{ticket.expiresAt.toLocaleDateString("ja-JP")}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
												{ticket.usageUnit === "count" ? "回数" : "時間"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
												{ticket.usageUnit === "count" ? (
													<span
														className={
															(ticket.remainingCount || 0) === 0
																? "text-destructive"
																: "text-primary"
														}
													>
														{(ticket.remainingCount || 0).toLocaleString()}回
													</span>
												) : (
													<span
														className={
															(ticket.remainingTimeMinutes || 0) === 0
																? "text-destructive"
																: "text-primary"
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
													<span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive">
														使用済み
													</span>
												) : isExpired ? (
													<span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600">
														期限切れ
													</span>
												) : (
													<span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600">
														利用可能
													</span>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
												<Link
													href={`/massage-ticket/admin/list/${ticket.id}`}
													className="text-primary hover:text-primary/80"
												>
													詳細
												</Link>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
