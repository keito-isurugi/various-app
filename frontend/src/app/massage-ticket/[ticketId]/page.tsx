/**
 * 肩たたき券表示ページ
 * Web上で肩たたき券を見られるページ
 */

"use client";

import { Button } from "@/components/ui/button";
import {
	getMassageTicket,
	verifyTicketHash,
} from "@/lib/massage-ticket/massageTicketService";
import type { MassageTicket } from "@/types/massage-ticket";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function ViewMassageTicketPage() {
	const params = useParams();
	const ticketId = params.ticketId as string;
	const [ticket, setTicket] = useState<MassageTicket | null>(null);
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadTicket = async () => {
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

				// QRコードを生成
				const qrDataUrl = await QRCode.toDataURL(ticketId, {
					width: 300,
					margin: 2,
				});
				setQrCodeDataUrl(qrDataUrl);
			} catch (err) {
				console.error("チケットの読み込みに失敗しました:", err);
				setError("チケットの読み込みに失敗しました");
			} finally {
				setIsLoading(false);
			}
		};

		loadTicket();
	}, [ticketId]);

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				<div className="text-center">
					<p className="text-muted-foreground">読み込み中...</p>
				</div>
			</div>
		);
	}

	if (error || !ticket) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				<div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
					<p className="text-destructive">
						{error || "肩たたき券が見つかりません"}
					</p>
					<Button
						onClick={() => {
							window.location.href = "/massage-ticket/create";
						}}
						className="mt-4"
					>
						新しい肩たたき券を作成
					</Button>
				</div>
			</div>
		);
	}

	// 有効期限チェック
	const isExpired = new Date() > ticket.expiresAt;
	const isFullyUsed = ticket.isUsed;

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<div className="bg-card rounded-lg shadow-lg border border-border p-6 md:p-8">
				{/* ヘッダー */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						肩たたき券
					</h1>
					{(isExpired || isFullyUsed) && (
						<div
							className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
								isExpired
									? "bg-destructive/10 text-destructive"
									: "bg-orange-500/10 text-orange-600"
							}`}
						>
							{isExpired ? "有効期限切れ" : "使用済み"}
						</div>
					)}
				</div>

				{/* チケット情報 */}
				<div className="space-y-4 mb-8">
					<div className="bg-secondary rounded-lg p-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<span className="text-sm text-muted-foreground block">
									利用者名
								</span>
								<p className="text-lg font-semibold text-foreground">
									{ticket.userName}
								</p>
							</div>
							<div>
								<span className="text-sm text-muted-foreground block">
									有効期限
								</span>
								<p
									className={`text-lg font-semibold ${
										isExpired
											? "text-destructive"
											: "text-foreground"
									}`}
								>
									{ticket.expiresAt.toLocaleDateString("ja-JP")}
								</p>
							</div>
							<div>
								<span className="text-sm text-muted-foreground block">
									チケットID
								</span>
								<p className="text-sm font-mono text-muted-foreground break-all">
									{ticket.id}
								</p>
							</div>
							<div>
								<span className="text-sm text-muted-foreground block">
									利用単位
								</span>
								<p className="text-lg font-semibold text-foreground">
									{ticket.usageUnit === "count" ? "回数" : "時間"}
								</p>
							</div>
						</div>
					</div>

					{/* 残り回数/時間 */}
					<div className="bg-primary/5 rounded-lg p-4 sm:p-6 text-center">
						<span className="text-sm text-muted-foreground mb-2 block">
							残り
						</span>
						<div className="overflow-x-auto -mx-2 sm:mx-0">
							<div className="px-2 sm:px-0">
								{ticket.usageUnit === "count" ? (
									<p
										className={`text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap inline-block ${
											(ticket.remainingCount || 0) === 0
												? "text-destructive"
												: "text-primary"
										}`}
									>
										{(ticket.remainingCount || 0).toLocaleString()}回
									</p>
								) : (
									<p
										className={`text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap inline-block ${
											(ticket.remainingTimeMinutes || 0) === 0
												? "text-destructive"
												: "text-primary"
										}`}
									>
										{(ticket.remainingTimeMinutes || 0).toLocaleString()}分
									</p>
								)}
							</div>
						</div>
						{ticket.usageUnit === "count" && ticket.totalCount && (
							<p className="text-sm text-muted-foreground mt-2">
								総回数: {(ticket.totalCount || 0).toLocaleString()}回
							</p>
						)}
						{ticket.usageUnit === "time" && ticket.totalTimeMinutes && (
							<p className="text-sm text-muted-foreground mt-2">
								総時間: {ticket.totalTimeMinutes}分
							</p>
						)}
					</div>

					{/* QRコード */}
					{qrCodeDataUrl && (
						<div className="flex flex-col items-center space-y-4">
							<div className="bg-card p-4 rounded-lg border border-border">
								<img
									src={qrCodeDataUrl}
									alt="QRコード"
									className="w-64 h-64 md:w-80 md:h-80"
								/>
							</div>
							<p className="text-sm text-muted-foreground text-center">
								このQRコードを管理者に提示してください
							</p>
						</div>
					)}
				</div>

				{/* アクション */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						onClick={() => {
							const url = window.location.href;
							navigator.clipboard.writeText(url);
							alert("URLをクリップボードにコピーしました");
						}}
						variant="outline"
					>
						URLをコピー
					</Button>
					<Button
						onClick={() => {
							window.location.href = `/massage-ticket/admin/scan?ticketId=${ticket.id}`;
						}}
					>
						管理者が読み込む
					</Button>
				</div>
			</div>
		</div>
	);
}
