"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type CSVFormat, csvImportService } from "@/lib/todo/csvImportService";
import { todoService } from "@/lib/todo/todoService";
import { Download, Settings, Upload } from "lucide-react";
import { useState } from "react";

interface CSVImportModalProps {
	isOpen: boolean;
	onClose: () => void;
	onImportComplete: () => void;
}

export function CSVImportModal({
	isOpen,
	onClose,
	onImportComplete,
}: CSVImportModalProps) {
	const [csvText, setCsvText] = useState("");
	const [isImporting, setIsImporting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [showFormatSettings, setShowFormatSettings] = useState(false);
	const [format, setFormat] = useState<CSVFormat>(
		csvImportService.loadFormat(),
	);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const text = e.target?.result as string;
				setCsvText(text);
				setError(null);
			};
			reader.readAsText(file);
		}
	};

	const handleImport = async () => {
		if (!csvText.trim()) {
			setError("CSVデータを入力してください");
			return;
		}

		setIsImporting(true);
		setError(null);
		setSuccess(null);

		try {
			const todos = await csvImportService.parseCSV(csvText, format);

			let successCount = 0;
			let failedCount = 0;
			const errors: string[] = [];

			for (const todo of todos) {
				try {
					await todoService.createTodo(todo);
					successCount++;
				} catch (err) {
					failedCount++;
					errors.push(`${todo.title}: ${err}`);
				}
			}

			if (failedCount === 0) {
				setSuccess(`${successCount}件のTODOをインポートしました`);
				setTimeout(() => {
					onImportComplete();
					onClose();
					setCsvText("");
					setSuccess(null);
				}, 1500);
			} else {
				setError(
					`${successCount}件成功、${failedCount}件失敗\n${errors.join("\n")}`,
				);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "インポートに失敗しました");
		} finally {
			setIsImporting(false);
		}
	};

	const handleDownloadSample = () => {
		const sample = csvImportService.generateSampleCSV();
		const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "todo_sample.csv";
		link.click();
	};

	const handleSaveFormat = () => {
		csvImportService.saveFormat(format);
		setShowFormatSettings(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>CSVインポート</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{!showFormatSettings ? (
						<>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleDownloadSample}
									className="flex items-center gap-2"
								>
									<Download className="h-4 w-4" />
									サンプルCSVダウンロード
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setShowFormatSettings(true)}
									className="flex items-center gap-2"
								>
									<Settings className="h-4 w-4" />
									フォーマット設定
								</Button>
							</div>

							<div>
								<Label htmlFor="csv-file">CSVファイルを選択</Label>
								<Input
									id="csv-file"
									type="file"
									accept=".csv"
									onChange={handleFileUpload}
									className="mt-1"
								/>
							</div>

							<div>
								<Label htmlFor="csv-text">または、CSVテキストを貼り付け</Label>
								<Textarea
									id="csv-text"
									value={csvText}
									onChange={(e) => setCsvText(e.target.value)}
									placeholder="タイトル,説明,日付,時間(分),カテゴリID&#10;レポート作成,月次レポートの作成,2024-01-15,120,"
									className="mt-1 font-mono text-sm min-h-[200px]"
								/>
							</div>

							<Alert>
								<AlertDescription>
									<strong>CSVフォーマット:</strong>
									<br />
									デフォルト: タイトル,説明,日付,時間(分),カテゴリID
									<br />
									日付フォーマット: YYYY-MM-DD (例: 2024-01-15)
								</AlertDescription>
							</Alert>

							{error && (
								<Alert variant="destructive">
									<AlertDescription className="whitespace-pre-wrap">
										{error}
									</AlertDescription>
								</Alert>
							)}

							{success && (
								<Alert>
									<AlertDescription>{success}</AlertDescription>
								</Alert>
							)}
						</>
					) : (
						<div className="space-y-4">
							<div>
								<Label>フォーマット名</Label>
								<Input
									value={format.name}
									onChange={(e) =>
										setFormat({ ...format, name: e.target.value })
									}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label>タイトル列番号 (0始まり)</Label>
									<Input
										type="number"
										min="0"
										value={format.columns.title}
										onChange={(e) =>
											setFormat({
												...format,
												columns: {
													...format.columns,
													title: Number.parseInt(e.target.value),
												},
											})
										}
									/>
								</div>
								<div>
									<Label>説明列番号</Label>
									<Input
										type="number"
										min="0"
										value={format.columns.description}
										onChange={(e) =>
											setFormat({
												...format,
												columns: {
													...format.columns,
													description: Number.parseInt(e.target.value),
												},
											})
										}
									/>
								</div>
								<div>
									<Label>日付列番号</Label>
									<Input
										type="number"
										min="0"
										value={format.columns.date}
										onChange={(e) =>
											setFormat({
												...format,
												columns: {
													...format.columns,
													date: Number.parseInt(e.target.value),
												},
											})
										}
									/>
								</div>
								<div>
									<Label>時間(分)列番号</Label>
									<Input
										type="number"
										min="0"
										value={format.columns.duration}
										onChange={(e) =>
											setFormat({
												...format,
												columns: {
													...format.columns,
													duration: Number.parseInt(e.target.value),
												},
											})
										}
									/>
								</div>
							</div>

							<div>
								<Label>日付フォーマット</Label>
								<Input
									value={format.dateFormat}
									onChange={(e) =>
										setFormat({ ...format, dateFormat: e.target.value })
									}
									placeholder="YYYY-MM-DD"
								/>
							</div>

							<Button onClick={handleSaveFormat} className="w-full">
								フォーマットを保存
							</Button>

							<Button
								variant="outline"
								onClick={() => setShowFormatSettings(false)}
								className="w-full"
							>
								戻る
							</Button>
						</div>
					)}
				</div>

				{!showFormatSettings && (
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							キャンセル
						</Button>
						<Button
							type="button"
							onClick={handleImport}
							disabled={isImporting || !csvText.trim()}
						>
							<Upload className="h-4 w-4 mr-2" />
							{isImporting ? "インポート中..." : "インポート"}
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
