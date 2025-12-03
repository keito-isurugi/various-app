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
import type { MassageTicket, UsageUnit } from "@/types/massage-ticket";
import jsPDF from "jspdf";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
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
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

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

			// QRコードを生成
			const qrDataUrl = await QRCode.toDataURL(loadedTicket.id, {
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

	// Canvasを使って日本語テキストを画像に変換（アスペクト比を保持）
	const textToImage = (
		text: string,
		fontSizePt: number,
		fontFamily = '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", "MS PGothic", sans-serif',
	): Promise<{ dataUrl: string; width: number; height: number }> => {
		return new Promise((resolve) => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				resolve({ dataUrl: "", width: 0, height: 0 });
				return;
			}

			const dpi = 300;
			const mmToPx = dpi / 25.4;
			const fontSizeMm = (fontSizePt * 25.4) / 72;
			const fontSizePx = fontSizeMm * mmToPx;
			const paddingPx = 5 * mmToPx;

			ctx.font = `${fontSizePx}px ${fontFamily}`;
			ctx.textBaseline = "top";

			const metrics = ctx.measureText(text);
			const textWidthPx = metrics.width;
			const textHeightPx = fontSizePx * 1.5;

			canvas.width = Math.ceil(textWidthPx + paddingPx * 2);
			canvas.height = Math.ceil(textHeightPx + paddingPx * 2);

			const scaledCtx = canvas.getContext("2d");
			if (!scaledCtx) {
				resolve({ dataUrl: "", width: 0, height: 0 });
				return;
			}

			scaledCtx.font = `${fontSizePx}px ${fontFamily}`;
			scaledCtx.textBaseline = "top";
			scaledCtx.fillStyle = "#000000";
			scaledCtx.fillText(text, paddingPx, paddingPx);

			const widthMm = canvas.width / mmToPx;
			const heightMm = canvas.height / mmToPx;

			resolve({
				dataUrl: canvas.toDataURL("image/png"),
				width: widthMm,
				height: heightMm,
			});
		});
	};

	const generatePDF = async () => {
		if (!ticket) return;

		// QRコードを生成
		const qrCodeDataUrl = await QRCode.toDataURL(ticket.id, {
			width: 200,
			margin: 2,
		});

		// PDFを作成
		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "a4",
		});

		const pageWidth = pdf.internal.pageSize.getWidth();

		// 日本語テキストを画像に変換
		const titleImage = await textToImage("肩たたき券", 32);
		const userNameImage = await textToImage(`利用者: ${ticket.userName}`, 16);
		const ticketIdImage = await textToImage(`チケットID: ${ticket.id}`, 14);
		const expiresAtImage = await textToImage(
			`有効期限: ${ticket.expiresAt.toLocaleDateString("ja-JP")}`,
			14,
		);
		const usageImage = await textToImage(
			ticket.usageUnit === "count"
				? `利用回数: ${(ticket.totalCount || 0).toLocaleString()}回`
				: `利用時間: ${ticket.totalTimeMinutes}分`,
			14,
		);
		const instructionImage = await textToImage(
			"このQRコードを管理者に提示してください",
			11,
		);
		const usageGuide1 = await textToImage("【使い方】", 12);
		const usageGuide2 = await textToImage(
			"1. この肩たたき券を管理者に渡してください",
			10,
		);
		const usageGuide3 = await textToImage(
			"2. 管理者がQRコードをスキャンして利用開始します",
			10,
		);
		const usageGuide4 = await textToImage(
			"3. 回数または時間が減算され、利用が記録されます",
			10,
		);

		// レイアウト用の変数
		let currentY = 20;
		const leftMargin = 25;
		const sectionSpacing = 10;
		const itemSpacing = 4;
		const smallItemSpacing = 3;

		// タイトル
		if (titleImage.dataUrl) {
			pdf.addImage(
				titleImage.dataUrl,
				"PNG",
				(pageWidth - titleImage.width) / 2,
				currentY,
				titleImage.width,
				titleImage.height,
			);
			currentY += titleImage.height + sectionSpacing;
		}

		// 利用者名
		if (userNameImage.dataUrl) {
			pdf.addImage(
				userNameImage.dataUrl,
				"PNG",
				leftMargin,
				currentY,
				userNameImage.width,
				userNameImage.height,
			);
			currentY += userNameImage.height + itemSpacing;
		}

		// 有効期限
		if (expiresAtImage.dataUrl) {
			pdf.addImage(
				expiresAtImage.dataUrl,
				"PNG",
				leftMargin,
				currentY,
				expiresAtImage.width,
				expiresAtImage.height,
			);
			currentY += expiresAtImage.height + itemSpacing;
		}

		// 利用単位と数量
		if (usageImage.dataUrl) {
			pdf.addImage(
				usageImage.dataUrl,
				"PNG",
				leftMargin,
				currentY,
				usageImage.width,
				usageImage.height,
			);
			currentY += usageImage.height + itemSpacing;
		}

		// チケットID
		if (ticketIdImage.dataUrl) {
			pdf.addImage(
				ticketIdImage.dataUrl,
				"PNG",
				leftMargin,
				currentY,
				ticketIdImage.width,
				ticketIdImage.height,
			);
			currentY += ticketIdImage.height + sectionSpacing;
		}

		// QRコードを中央に配置
		const qrSize = 60;
		const qrX = (pageWidth - qrSize) / 2;
		const qrY = currentY;
		pdf.addImage(qrCodeDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

		// QRコード下の説明文
		let instructionY = qrY + qrSize + 6;
		if (instructionImage.dataUrl) {
			pdf.addImage(
				instructionImage.dataUrl,
				"PNG",
				(pageWidth - instructionImage.width) / 2,
				instructionY,
				instructionImage.width,
				instructionImage.height,
			);
			instructionY += instructionImage.height;
		}

		// 使い方の説明
		let guideY = instructionY + sectionSpacing;
		if (usageGuide1.dataUrl) {
			pdf.addImage(
				usageGuide1.dataUrl,
				"PNG",
				(pageWidth - usageGuide1.width) / 2,
				guideY,
				usageGuide1.width,
				usageGuide1.height,
			);
			guideY += usageGuide1.height + smallItemSpacing;
		}
		if (usageGuide2.dataUrl) {
			pdf.addImage(
				usageGuide2.dataUrl,
				"PNG",
				(pageWidth - usageGuide2.width) / 2,
				guideY,
				usageGuide2.width,
				usageGuide2.height,
			);
			guideY += usageGuide2.height + smallItemSpacing;
		}
		if (usageGuide3.dataUrl) {
			pdf.addImage(
				usageGuide3.dataUrl,
				"PNG",
				(pageWidth - usageGuide3.width) / 2,
				guideY,
				usageGuide3.width,
				usageGuide3.height,
			);
			guideY += usageGuide3.height + smallItemSpacing;
		}
		if (usageGuide4.dataUrl) {
			pdf.addImage(
				usageGuide4.dataUrl,
				"PNG",
				(pageWidth - usageGuide4.width) / 2,
				guideY,
				usageGuide4.width,
				usageGuide4.height,
			);
		}

		// PDFをダウンロード
		pdf.save(`肩たたき券_${ticket.id}.pdf`);
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="text-center">
					<p className="text-muted-foreground">読み込み中...</p>
				</div>
			</div>
		);
	}

	if (error || !ticket) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
					<p className="text-destructive mb-4">
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
					className="text-primary hover:text-primary/80"
				>
					← 一覧に戻る
				</Link>
				<div className="flex gap-2">
					<Button onClick={generatePDF} variant="outline">
						PDFダウンロード
					</Button>
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
			<div className="bg-card shadow-lg border border-border rounded-lg p-8 mb-6">
				<h2 className="text-2xl font-bold mb-6 text-foreground">
					チケット情報
				</h2>

				{/* 状態バッジ */}
				<div className="mb-6">
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

				{/* 残り回数/時間 - 最も重要な情報を大きく表示 */}
				<div className="mb-8 p-4 sm:p-6 bg-primary/5 rounded-xl border-2 border-primary/20">
					<div className="text-center overflow-x-auto -mx-2 sm:mx-0">
						<span className="text-base text-muted-foreground block mb-3">
							残り
							{ticket.usageUnit === "count" ? "回数" : "時間"}
						</span>
						<div className="px-2 sm:px-0">
							{ticket.usageUnit === "count" ? (
								<p
									className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 whitespace-nowrap inline-block ${
										(ticket.remainingCount || 0) === 0
											? "text-destructive"
											: "text-primary"
									}`}
								>
									{(ticket.remainingCount || 0).toLocaleString()}回
								</p>
							) : (
								<p
									className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 whitespace-nowrap inline-block ${
										(ticket.remainingTimeMinutes || 0) === 0
											? "text-destructive"
											: "text-primary"
									}`}
								>
									{(ticket.remainingTimeMinutes || 0).toLocaleString()}分
								</p>
							)}
						</div>
						{ticket.usageUnit === "count" && ticket.totalCount && (
							<p className="text-lg text-muted-foreground mt-2">
								総回数: {(ticket.totalCount || 0).toLocaleString()}回
							</p>
						)}
						{ticket.usageUnit === "time" && ticket.totalTimeMinutes && (
							<p className="text-lg text-muted-foreground mt-2">
								総時間: {ticket.totalTimeMinutes}分
							</p>
						)}
					</div>
				</div>

				{/* 基本情報 */}
				<div className="space-y-4 mb-6">
					<div className="flex items-center justify-between py-3 border-b border-border">
						<span className="text-base text-muted-foreground font-medium">
							利用者名
						</span>
						<span className="text-lg font-semibold text-foreground">
							{ticket.userName}
						</span>
					</div>
					<div className="flex items-center justify-between py-3 border-b border-border">
						<span className="text-base text-muted-foreground font-medium">
							チケットID
						</span>
						<span className="text-sm font-mono text-muted-foreground break-all">
							{ticket.id}
						</span>
					</div>
					<div className="flex items-center justify-between py-3 border-b border-border">
						<span className="text-base text-muted-foreground font-medium">
							作成日
						</span>
						<span className="text-lg font-semibold text-foreground">
							{ticket.createdAt.toLocaleDateString("ja-JP")}{" "}
							{ticket.createdAt.toLocaleTimeString("ja-JP", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					</div>
					<div className="flex items-center justify-between py-3 border-b border-border">
						<span className="text-base text-muted-foreground font-medium">
							有効期限
						</span>
						<span
							className={`text-lg font-semibold ${
								isExpired
									? "text-destructive"
									: "text-foreground"
							}`}
						>
							{ticket.expiresAt.toLocaleDateString("ja-JP")}
						</span>
					</div>
					<div className="flex items-center justify-between py-3 border-b border-border">
						<span className="text-base text-muted-foreground font-medium">
							利用単位
						</span>
						<span className="text-lg font-semibold text-foreground">
							{ticket.usageUnit === "count" ? "回数" : "時間"}
						</span>
					</div>
					<div className="flex items-center justify-between py-3">
						<span className="text-base text-muted-foreground font-medium">
							状態
						</span>
						{isFullyUsed ? (
							<span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-destructive/10 text-destructive">
								使用済み
							</span>
						) : (
							<span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-500/10 text-green-600">
								利用可能
							</span>
						)}
					</div>
				</div>
			</div>

			{/* 利用履歴 */}
			<div className="bg-card shadow-lg border border-border rounded-lg p-8">
				<h2 className="text-2xl font-bold mb-6 text-foreground">
					利用履歴
				</h2>

				{ticket.usages.length === 0 ? (
					<p className="text-muted-foreground text-center py-8">
						まだ利用されていません
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-secondary border-b border-border">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										利用日時
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										利用量
									</th>
								</tr>
							</thead>
							<tbody className="bg-card divide-y divide-border">
								{ticket.usages.map((usage) => (
									<tr
										key={usage.id}
										className="hover:bg-secondary transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
											{usage.usedAt.toLocaleDateString("ja-JP")}{" "}
											{usage.usedAt.toLocaleTimeString("ja-JP", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
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

			{/* QRコード表示 */}
			<div className="bg-card shadow-lg border border-border rounded-lg p-8">
				<h2 className="text-2xl font-bold mb-6 text-foreground">
					QRコード
				</h2>
				{qrCodeDataUrl ? (
					<div className="flex flex-col items-center space-y-4">
						<div className="bg-card p-4 rounded-lg border border-border">
							<img
								src={qrCodeDataUrl}
								alt="QRコード"
								className="w-64 h-64 md:w-80 md:h-80"
							/>
						</div>
						<p className="text-sm text-muted-foreground text-center">
							このQRコードをスキャンして利用開始できます
						</p>
						<div className="flex gap-2">
							<Button
								onClick={async () => {
									if (ticket && qrCodeDataUrl) {
										// QRコードを再生成
										const qrDataUrl = await QRCode.toDataURL(ticket.id, {
											width: 300,
											margin: 2,
										});
										setQrCodeDataUrl(qrDataUrl);
									}
								}}
								variant="outline"
							>
								QRコードを再生成
							</Button>
							<Button
								onClick={() => {
									if (qrCodeDataUrl) {
										// QRコード画像をダウンロード
										const link = document.createElement("a");
										link.href = qrCodeDataUrl;
										link.download = `qr-code-${ticket?.id}.png`;
										link.click();
									}
								}}
								variant="outline"
							>
								QRコードをダウンロード
							</Button>
						</div>
					</div>
				) : (
					<div className="text-center py-8">
						<p className="text-muted-foreground mb-4">
							QRコードを生成中...
						</p>
						<Button
							onClick={async () => {
								if (ticket) {
									const qrDataUrl = await QRCode.toDataURL(ticket.id, {
										width: 300,
										margin: 2,
									});
									setQrCodeDataUrl(qrDataUrl);
								}
							}}
						>
							QRコードを生成
						</Button>
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
