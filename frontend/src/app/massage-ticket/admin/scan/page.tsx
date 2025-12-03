/**
 * 肩たたき券QRコード読み込みページ（管理者用）
 */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	getMassageTicket,
	useMassageTicket,
	verifyTicketHash,
} from "@/lib/massage-ticket/massageTicketService";
import type { MassageTicket } from "@/types/massage-ticket";
import { Html5Qrcode } from "html5-qrcode";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

function ScanMassageTicketContent() {
	const searchParams = useSearchParams();
	const qrCodeRef = useRef<Html5Qrcode | null>(null);
	const [isScanning, setIsScanning] = useState(false);
	const [ticket, setTicket] = useState<MassageTicket | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [usageCount, setUsageCount] = useState<string>("1");
	const [usageTimeMinutes, setUsageTimeMinutes] = useState<string>("30");
	const [isUsing, setIsUsing] = useState(false);

	// URLパラメータからticketIdを取得（QRコード経由）
	const ticketIdFromUrl = searchParams.get("ticketId");

	// QRコードスキャンを停止
	const stopScanning = useCallback(async () => {
		if (qrCodeRef.current) {
			try {
				await qrCodeRef.current.stop();
				await qrCodeRef.current.clear();
			} catch (error) {
				console.error("QRコードスキャンの停止に失敗しました:", error);
			}
			qrCodeRef.current = null;
			setIsScanning(false);
		}
	}, []);

	// チケットを読み込む
	const loadTicket = useCallback(async (id: string) => {
		setError(null);
		try {
			const loadedTicket = await getMassageTicket(id);
			if (!loadedTicket) {
				setError("肩たたき券が見つかりません");
				return;
			}

			// 改ざんチェック
			const isValid = verifyTicketHash(loadedTicket);
			if (!isValid) {
				setError("肩たたき券が改ざんされている可能性があります");
				return;
			}

			setTicket(loadedTicket);
		} catch (error) {
			console.error("チケットの読み込みに失敗しました:", error);
			setError("チケットの読み込みに失敗しました");
		}
	}, []);

	useEffect(() => {
		// URLパラメータがある場合は自動的にチケットを読み込む
		if (ticketIdFromUrl && !ticket) {
			loadTicket(ticketIdFromUrl);
		}
	}, [ticketIdFromUrl, ticket, loadTicket]);

	// QRコードスキャンを開始
	const startScanning = async () => {
		try {
			const html5QrCode = new Html5Qrcode("reader");
			qrCodeRef.current = html5QrCode;

			await html5QrCode.start(
				{ facingMode: "environment" }, // カメラ設定（バックカメラ優先）
				{
					fps: 10,
					qrbox: { width: 250, height: 250 },
				},
				async (decodedText) => {
					// QRコードを読み取ったらスキャンを停止
					await stopScanning();
					// URLの場合はticketIdパラメータを抽出、そうでなければそのままチケットIDとして使用
					const ticketId = decodedText.includes("ticketId=")
						? decodedText.split("ticketId=")[1]?.split("&")[0] || decodedText
						: decodedText;
					loadTicket(ticketId);
				},
				(errorMessage) => {
					// エラーハンドリング（無視してもOK）
				},
			);

			setIsScanning(true);
		} catch (error) {
			console.error("QRコードスキャンの開始に失敗しました:", error);
			setError("カメラへのアクセスに失敗しました");
		}
	};

	// チケットを使用
	const handleUseTicket = async () => {
		if (!ticket) return;

		setIsUsing(true);
		setError(null);

		try {
			const count =
				ticket.usageUnit === "count"
					? Number.parseInt(usageCount, 10)
					: undefined;
			const timeMinutes =
				ticket.usageUnit === "time"
					? Number.parseInt(usageTimeMinutes, 10)
					: undefined;

			await useMassageTicket(ticket.id, count, timeMinutes);

			// チケット情報を再読み込み
			await loadTicket(ticket.id);

			alert("肩たたき券を使用しました");
		} catch (error) {
			console.error("チケットの使用に失敗しました:", error);
			setError(
				error instanceof Error ? error.message : "チケットの使用に失敗しました",
			);
		} finally {
			setIsUsing(false);
		}
	};

	// クリーンアップ
	useEffect(() => {
		return () => {
			stopScanning();
		};
	}, [stopScanning]);

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">肩たたき券読み込み</h1>
				<Link href="/massage-ticket/admin/list">
					<Button variant="outline">一覧を見る</Button>
				</Link>
			</div>

			{!ticket ? (
				<div className="space-y-4">
					{/* QRコードスキャナー */}
					<div>
						<div id="reader" className="w-full mb-4" />
						{!isScanning && (
							<Button onClick={startScanning} className="w-full">
								QRコードをスキャン
							</Button>
						)}
						{isScanning && (
							<Button
								onClick={stopScanning}
								variant="destructive"
								className="w-full"
							>
								スキャンを停止
							</Button>
						)}
					</div>

					{/* または手動入力 */}
					<div className="border-t pt-4">
						<Label htmlFor="ticketId">または、チケットIDを直接入力</Label>
						<div className="flex gap-2 mt-2">
							<Input
								id="ticketId"
								type="text"
								placeholder="チケットIDを入力"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										const input = e.currentTarget as HTMLInputElement;
										if (input.value) {
											loadTicket(input.value);
										}
									}
								}}
							/>
							<Button
								onClick={(e) => {
									const input = document.getElementById(
										"ticketId",
									) as HTMLInputElement;
									if (input?.value) {
										loadTicket(input.value);
									}
								}}
							>
								読み込む
							</Button>
						</div>
					</div>

					{error && (
						<div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
							{error}
						</div>
					)}
				</div>
			) : (
				<div className="space-y-6">
					{/* チケット情報 */}
					<div className="bg-card shadow-lg border border-border rounded-lg p-8">
						<h2 className="text-2xl font-bold mb-8 text-foreground">
							チケット情報
						</h2>

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

						{/* 基本情報 - リスト形式 */}
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
									有効期限
								</span>
								<span className="text-lg font-semibold text-foreground">
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
							<div className="flex items-center justify-between py-3 border-b border-border">
								<span className="text-base text-muted-foreground font-medium">
									状態
								</span>
								{ticket.isUsed ? (
									<span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-destructive/10 text-destructive">
										使用済み
									</span>
								) : (
									<span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-500/10 text-green-600">
										利用可能
									</span>
								)}
							</div>
							<div className="py-3">
								<span className="text-base text-muted-foreground font-medium block mb-2">
									チケットID
								</span>
								<p className="text-sm font-mono text-muted-foreground break-all bg-secondary p-3 rounded">
									{ticket.id}
								</p>
							</div>
						</div>
					</div>

					{/* 利用入力フォーム */}
					{!ticket.isUsed && (
						<div className="bg-card shadow-lg border border-border rounded-lg p-6">
							<h2 className="text-xl font-semibold mb-4 text-foreground">
								利用開始
							</h2>
							<div className="space-y-4">
								{ticket.usageUnit === "count" ? (
									<div>
										<Label
											htmlFor="usageCount"
											className="text-foreground"
										>
											使用回数 *
										</Label>
										<Input
											id="usageCount"
											type="number"
											min="1"
											max={ticket.remainingCount}
											value={usageCount}
											onChange={(e) => setUsageCount(e.target.value)}
											required
										/>
									</div>
								) : (
									<div>
										<Label
											htmlFor="usageTimeMinutes"
											className="text-foreground"
										>
											使用時間（分） *
										</Label>
										<Input
											id="usageTimeMinutes"
											type="number"
											min="1"
											max={ticket.remainingTimeMinutes}
											value={usageTimeMinutes}
											onChange={(e) => setUsageTimeMinutes(e.target.value)}
											required
										/>
									</div>
								)}

								<Button
									onClick={handleUseTicket}
									disabled={isUsing}
									className="w-full"
								>
									{isUsing ? "処理中..." : "利用開始"}
								</Button>
							</div>
						</div>
					)}

					{error && (
						<div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
							{error}
						</div>
					)}

					<Button
						onClick={() => {
							setTicket(null);
							setError(null);
						}}
						variant="outline"
						className="w-full"
					>
						新しいチケットを読み込む
					</Button>
				</div>
			)}
		</div>
	);
}

export default function ScanMassageTicketPage() {
	return (
		<Suspense
			fallback={
				<div className="container mx-auto px-4 py-8 max-w-2xl">
					<div className="text-center">
						<p className="text-muted-foreground">読み込み中...</p>
					</div>
				</div>
			}
		>
			<ScanMassageTicketContent />
		</Suspense>
	);
}
