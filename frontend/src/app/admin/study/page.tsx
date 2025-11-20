"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react";
import { useState } from "react";

type ImportStatus = "idle" | "loading" | "success" | "error";

export default function AdminStudyPage() {
	const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
	const [message, setMessage] = useState("");
	const [stats, setStats] = useState<{
		total: number;
		success: number;
		failed: number;
	} | null>(null);

	const handleImport = async () => {
		setImportStatus("loading");
		setMessage("");
		setStats(null);

		try {
			const response = await fetch("/api/study/import", {
				method: "POST",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "インポートに失敗しました");
			}

			setImportStatus("success");
			setMessage(data.message);
			setStats(data.stats);
		} catch (error) {
			setImportStatus("error");
			setMessage(
				error instanceof Error ? error.message : "不明なエラーが発生しました",
			);
		}
	};

	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">技術問題管理</h1>
				<p className="text-muted-foreground mt-2">
					技術問題データのインポートと管理
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>問題データのインポート</CardTitle>
					<CardDescription>
						tech-test.json から Firestore
						に問題データをインポートします。既存のデータは上書きされます。
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						onClick={handleImport}
						disabled={importStatus === "loading"}
						className="w-full sm:w-auto"
						size="lg"
					>
						{importStatus === "loading" ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								インポート中...
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								データをインポート
							</>
						)}
					</Button>

					{importStatus === "success" && (
						<Alert className="bg-green-50 border-green-200">
							<CheckCircle2 className="h-4 w-4 text-green-600" />
							<AlertTitle className="text-green-800">成功</AlertTitle>
							<AlertDescription className="text-green-700">
								<p>{message}</p>
								{stats && (
									<div className="mt-2 space-y-1">
										<p>総数: {stats.total}</p>
										<p>成功: {stats.success}</p>
										<p>失敗: {stats.failed}</p>
									</div>
								)}
							</AlertDescription>
						</Alert>
					)}

					{importStatus === "error" && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>エラー</AlertTitle>
							<AlertDescription>{message}</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
