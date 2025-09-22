import type { TodoFormData } from "@/types/todo";
import { parse } from "csv-parse/browser/esm/sync";

export interface CSVImportResult {
	success: number;
	failed: number;
	errors: string[];
}

export interface CSVFormat {
	name: string;
	columns: {
		title: number;
		description: number;
		date: number;
		duration: number;
		categoryId?: number;
	};
	dateFormat: string;
}

const DEFAULT_FORMAT: CSVFormat = {
	name: "デフォルト",
	columns: {
		title: 0,
		description: 1,
		date: 2,
		duration: 3,
		categoryId: 4,
	},
	dateFormat: "YYYY-MM-DD",
};

export const csvImportService = {
	async parseCSV(
		csvText: string,
		format: CSVFormat = DEFAULT_FORMAT,
	): Promise<TodoFormData[]> {
		try {
			const records = parse(csvText, {
				skip_empty_lines: true,
				trim: true,
			}) as string[][];

			// Skip header row if present
			const firstCell = records[0]?.[0]?.toLowerCase() || "";
			const dataRows =
				firstCell.includes("title") || firstCell.includes("タイトル")
					? records.slice(1)
					: records;

			const todos: TodoFormData[] = [];

			for (const row of dataRows) {
				try {
					const title = row[format.columns.title]?.trim();
					if (!title) continue;

					const description =
						row[format.columns.description]?.trim() || undefined;
					const dateStr = row[format.columns.date]?.trim();
					const durationStr = row[format.columns.duration]?.trim();
					const categoryId =
						format.columns.categoryId !== undefined
							? row[format.columns.categoryId]?.trim() || undefined
							: undefined;

					if (!dateStr || !durationStr) {
						throw new Error(`必須項目が不足しています: ${title}`);
					}

					const date = this.parseDate(dateStr, format.dateFormat);
					const duration = Number.parseInt(durationStr);

					if (Number.isNaN(duration) || duration <= 0) {
						throw new Error(`無効な時間: ${durationStr}`);
					}

					todos.push({
						title,
						description,
						date,
						duration,
						categoryId,
					});
				} catch (error) {
					console.error("行のパースエラー:", row, error);
					throw error;
				}
			}

			return todos;
		} catch (error) {
			throw new Error(`CSVのパースに失敗しました: ${error}`);
		}
	},

	parseDate(dateStr: string, format: string): Date {
		// Support common date formats
		if (format === "YYYY-MM-DD" || format === "YYYY/MM/DD") {
			const parts = dateStr.split(/[-/]/);
			if (parts.length === 3) {
				const year = Number.parseInt(parts[0]);
				const month = Number.parseInt(parts[1]) - 1;
				const day = Number.parseInt(parts[2]);
				const date = new Date(year, month, day);
				if (!Number.isNaN(date.getTime())) {
					return date;
				}
			}
		}

		throw new Error(`無効な日付フォーマット: ${dateStr}`);
	},

	saveFormat(format: CSVFormat): void {
		if (typeof window === "undefined") return;
		localStorage.setItem("csvImportFormat", JSON.stringify(format));
	},

	loadFormat(): CSVFormat {
		if (typeof window === "undefined") return DEFAULT_FORMAT;
		const saved = localStorage.getItem("csvImportFormat");
		return saved ? JSON.parse(saved) : DEFAULT_FORMAT;
	},

	getDefaultFormat(): CSVFormat {
		return { ...DEFAULT_FORMAT };
	},

	generateSampleCSV(): string {
		return `タイトル,説明,日付,時間(分),カテゴリID
レポート作成,月次レポートの作成,2024-01-15,120,
会議準備,プレゼン資料の準備,2024-01-16,60,
メール返信,取引先への返信,2024-01-16,30,`;
	},
};
