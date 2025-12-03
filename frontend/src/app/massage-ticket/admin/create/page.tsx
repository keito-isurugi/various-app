/**
 * 肩たたき券作成ページ
 * PDF生成機能付き
 */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMassageTicket } from "@/lib/massage-ticket/massageTicketService";
import type {
	CreateMassageTicketInput,
	UsageUnit,
} from "@/types/massage-ticket";
import jsPDF from "jspdf";
import Link from "next/link";
import QRCode from "qrcode";
import { useState } from "react";

export default function CreateMassageTicketPage() {
	const [userName, setUserName] = useState("");
	const [expiresAt, setExpiresAt] = useState("");
	const [usageUnit, setUsageUnit] = useState<UsageUnit>("count");
	const [totalCount, setTotalCount] = useState<string>("1");
	const [totalTimeMinutes, setTotalTimeMinutes] = useState<string>("30");
	const [isLoading, setIsLoading] = useState(false);
	const [ticketId, setTicketId] = useState<string | null>(null);
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
	const [ticketUrl, setTicketUrl] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const input: CreateMassageTicketInput = {
				userName,
				expiresAt: new Date(expiresAt),
				usageUnit,
				totalCount:
					usageUnit === "count" ? Number.parseInt(totalCount, 10) : undefined,
				totalTimeMinutes:
					usageUnit === "time"
						? Number.parseInt(totalTimeMinutes, 10)
						: undefined,
			};

			const ticket = await createMassageTicket(input);
			setTicketId(ticket.id);

			// URLを生成
			const url = `${window.location.origin}/massage-ticket/${ticket.id}`;
			setTicketUrl(url);

			// QRコードを画面表示用に生成
			const qrDataUrl = await QRCode.toDataURL(ticket.id, {
				width: 300,
				margin: 2,
			});
			setQrCodeDataUrl(qrDataUrl);

			// PDFを生成
			await generatePDF(ticket);
		} catch (error) {
			console.error("肩たたき券の作成に失敗しました:", error);
			alert("肩たたき券の作成に失敗しました");
		} finally {
			setIsLoading(false);
		}
	};

	// Canvasを使って日本語テキストを画像に変換（アスペクト比を保持）
	const textToImage = (
		text: string,
		fontSizePt: number, // PDFのポイントサイズ
		fontFamily = '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", "MS PGothic", sans-serif',
	): Promise<{ dataUrl: string; width: number; height: number }> => {
		return new Promise((resolve) => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				resolve({ dataUrl: "", width: 0, height: 0 });
				return;
			}

			// 高解像度で描画（PDFの品質向上のため）
			const dpi = 300; // 高解像度（300 DPI）
			const mmToPx = dpi / 25.4; // mmからピクセルへの変換

			// ポイントからmmへの変換: 1pt = 25.4/72 mm
			const fontSizeMm = (fontSizePt * 25.4) / 72;
			const fontSizePx = fontSizeMm * mmToPx;
			const paddingPx = 5 * mmToPx; // 5mmのパディング

			// フォント設定
			ctx.font = `${fontSizePx}px ${fontFamily}`;
			ctx.textBaseline = "top";

			// テキストのサイズを測定
			const metrics = ctx.measureText(text);
			const textWidthPx = metrics.width;
			const textHeightPx = fontSizePx * 1.5; // 行の高さ

			// Canvasサイズを設定（高解像度）
			canvas.width = Math.ceil(textWidthPx + paddingPx * 2);
			canvas.height = Math.ceil(textHeightPx + paddingPx * 2);

			// Canvasサイズ変更後、コンテキストがリセットされるため再設定
			const scaledCtx = canvas.getContext("2d");
			if (!scaledCtx) {
				resolve({ dataUrl: "", width: 0, height: 0 });
				return;
			}

			// フォントとスタイルを再設定
			scaledCtx.font = `${fontSizePx}px ${fontFamily}`;
			scaledCtx.textBaseline = "top";
			scaledCtx.fillStyle = "#000000";
			scaledCtx.fillText(text, paddingPx, paddingPx);

			// ピクセルからmmへの変換（300 DPI基準）
			const widthMm = canvas.width / mmToPx;
			const heightMm = canvas.height / mmToPx;

			resolve({
				dataUrl: canvas.toDataURL("image/png"),
				width: widthMm,
				height: heightMm,
			});
		});
	};

	const generatePDF = async (ticket: {
		id: string;
		userName: string;
		expiresAt: Date;
		usageUnit: UsageUnit;
		totalCount?: number;
		totalTimeMinutes?: number;
	}) => {
		// QRコードを生成（チケットIDのみをエンコード）
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
		const pageHeight = pdf.internal.pageSize.getHeight();

		// 日本語テキストを画像に変換（統一されたフォントサイズ）
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

		// レイアウト用の変数（視認性と美しさを考慮した適切な間隔）
		let currentY = 20; // 上端からの位置
		const leftMargin = 25;
		const sectionSpacing = 10; // セクション間のスペーシング（mm）
		const itemSpacing = 4; // 項目間のスペーシング（mm）
		const smallItemSpacing = 3; // 小さな項目間のスペーシング（mm）

		// タイトル（中央揃え）
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

		// QRコード下の説明文（動的に位置を計算）
		let instructionY = qrY + qrSize + 6; // QRコードとの適切な間隔
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

		// 使い方の説明（説明文との適切な間隔を確保）
		let guideY = instructionY + sectionSpacing; // セクション間のスペーシング
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

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<h1 className="text-3xl font-bold mb-8">肩たたき券を作成</h1>

			{ticketId ? (
				<div className="space-y-6">
					{/* 成功メッセージ */}
					<div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-4 text-green-600">
							✨ 肩たたき券を作成しました！
						</h2>
						<p className="mb-2 text-green-600">
							チケットID: <span className="font-mono text-sm">{ticketId}</span>
						</p>
						<p className="text-green-600 mb-4">
							PDFがダウンロードされました。印刷してお使いください。
						</p>

						{/* URL表示とコピー */}
						{ticketUrl && (
							<div className="bg-card rounded-lg p-4 mb-4">
								<span className="text-sm text-muted-foreground mb-2 block">
									Webで表示するURL
								</span>
								<div className="flex gap-2">
									<Input
										value={ticketUrl}
										readOnly
										className="flex-1 font-mono text-sm"
									/>
									<Button
										onClick={async () => {
											if (ticketUrl) {
												await navigator.clipboard.writeText(ticketUrl);
												alert("URLをクリップボードにコピーしました");
											}
										}}
										variant="outline"
									>
										コピー
									</Button>
								</div>
							</div>
						)}

						{/* QRコード表示 */}
						{qrCodeDataUrl && (
							<div className="bg-card rounded-lg p-6 text-center">
								<span className="text-sm text-muted-foreground mb-4 block">
									QRコード（管理者がスキャンできます）
								</span>
								<div className="flex justify-center mb-4">
									<img
										src={qrCodeDataUrl}
										alt="QRコード"
										className="w-64 h-64 md:w-80 md:h-80"
									/>
								</div>
								<p className="text-xs text-muted-foreground">
									このQRコードを管理者に提示してください
								</p>
							</div>
						)}

						{/* アクションボタン */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Button
								onClick={() => {
									if (ticketUrl) {
										window.open(ticketUrl, "_blank");
									}
								}}
								className="flex-1"
							>
								Webで表示
							</Button>
							<Link href="/massage-ticket/admin/list" className="flex-1">
								<Button variant="outline" className="w-full">
									一覧を見る
								</Button>
							</Link>
							<Button
								onClick={() => {
									setTicketId(null);
									setQrCodeDataUrl(null);
									setTicketUrl(null);
									setUserName("");
									setExpiresAt("");
									setTotalCount("1");
									setTotalTimeMinutes("30");
								}}
								variant="outline"
								className="flex-1"
							>
								新しい肩たたき券を作成
							</Button>
						</div>
					</div>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<Label htmlFor="userName">利用者名 *</Label>
						<Input
							id="userName"
							type="text"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							required
							placeholder="例: 山田太郎"
						/>
					</div>

					<div>
						<Label htmlFor="expiresAt">有効期限 *</Label>
						<Input
							id="expiresAt"
							type="date"
							value={expiresAt}
							onChange={(e) => setExpiresAt(e.target.value)}
							required
							min={new Date().toISOString().split("T")[0]}
						/>
					</div>

					<div>
						<Label htmlFor="usageUnit">利用単位 *</Label>
						<select
							id="usageUnit"
							value={usageUnit}
							onChange={(e) => setUsageUnit(e.target.value as UsageUnit)}
							className="text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
							required
						>
							<option value="count">回数</option>
							<option value="time">時間（分）</option>
						</select>
					</div>

					{usageUnit === "count" ? (
						<div>
							<Label htmlFor="totalCount">利用回数 *</Label>
							<Input
								id="totalCount"
								type="number"
								min="1"
								value={totalCount}
								onChange={(e) => setTotalCount(e.target.value)}
								required
							/>
						</div>
					) : (
						<div>
							<Label htmlFor="totalTimeMinutes">利用時間（分） *</Label>
							<Input
								id="totalTimeMinutes"
								type="number"
								min="1"
								value={totalTimeMinutes}
								onChange={(e) => setTotalTimeMinutes(e.target.value)}
								required
							/>
						</div>
					)}

					<Button type="submit" disabled={isLoading} className="w-full">
						{isLoading ? "作成中..." : "肩たたき券を作成してPDFをダウンロード"}
					</Button>
				</form>
			)}
		</div>
	);
}
