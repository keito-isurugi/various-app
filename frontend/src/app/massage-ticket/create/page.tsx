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

		// タイトル
		pdf.setFontSize(24);
		pdf.text("肩たたき券", pageWidth / 2, 30, { align: "center" });

		// 利用者名
		pdf.setFontSize(16);
		pdf.text(`利用者: ${ticket.userName}`, 20, 50);

		// チケットID
		pdf.setFontSize(12);
		pdf.text(`チケットID: ${ticket.id}`, 20, 60);

		// 有効期限
		pdf.text(
			`有効期限: ${ticket.expiresAt.toLocaleDateString("ja-JP")}`,
			20,
			70,
		);

		// 利用単位と数量
		if (ticket.usageUnit === "count") {
			pdf.text(`利用回数: ${ticket.totalCount}回`, 20, 80);
		} else {
			pdf.text(`利用時間: ${ticket.totalTimeMinutes}分`, 20, 80);
		}

		// QRコードを中央に配置
		const qrSize = 60;
		const qrX = (pageWidth - qrSize) / 2;
		const qrY = 100;
		pdf.addImage(qrCodeDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

		// 使用方法
		pdf.setFontSize(10);
		pdf.text(
			"このQRコードを管理者に提示してください",
			pageWidth / 2,
			qrY + qrSize + 15,
			{ align: "center" },
		);

		// PDFをダウンロード
		pdf.save(`肩たたき券_${ticket.id}.pdf`);
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<h1 className="text-3xl font-bold mb-8">肩たたき券を作成</h1>

			{ticketId ? (
				<div className="space-y-6">
					{/* 成功メッセージ */}
					<div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-200">
							✨ 肩たたき券を作成しました！
						</h2>
						<p className="mb-2 text-green-700 dark:text-green-300">
							チケットID: <span className="font-mono text-sm">{ticketId}</span>
						</p>
						<p className="text-green-700 dark:text-green-300 mb-4">
							PDFがダウンロードされました。印刷してお使いください。
						</p>

						{/* URL表示とコピー */}
						{ticketUrl && (
							<div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
								<span className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
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
							<div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
								<span className="text-sm text-gray-600 dark:text-gray-400 mb-4 block">
									QRコード（管理者がスキャンできます）
								</span>
								<div className="flex justify-center mb-4">
									<img
										src={qrCodeDataUrl}
										alt="QRコード"
										className="w-64 h-64 md:w-80 md:h-80"
									/>
								</div>
								<p className="text-xs text-gray-500 dark:text-gray-400">
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
