import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import type { ExerciseType } from "../../types/big3";
import { DataTable } from "./DataTable";

describe("DataTable", () => {
	const exercises: ExerciseType[] = [
		"ベンチプレス",
		"スクワット",
		"デッドリフト",
	];

	exercises.forEach((exercise) => {
		describe(`${exercise}のテーブル`, () => {
			it("正しいテーブル構造を持つ", () => {
				render(<DataTable exercise={exercise} />);

				// テーブルが存在することを確認
				const table = screen.getByRole("table");
				expect(table).toBeInTheDocument();

				// キャプションが正しく設定されている
				const caption = screen.getByText(`${exercise}のレベル別重量表`);
				expect(caption).toBeInTheDocument();
			});

			it("正しいヘッダーを持つ", () => {
				render(<DataTable exercise={exercise} />);

				// ヘッダー行の確認
				expect(screen.getByText("体重 (kg)")).toBeInTheDocument();
				expect(screen.getByText("初心者")).toBeInTheDocument();
				expect(screen.getByText("初級者")).toBeInTheDocument();
				expect(screen.getByText("中級者")).toBeInTheDocument();
				expect(screen.getByText("上級者")).toBeInTheDocument();
				expect(screen.getByText("エリート")).toBeInTheDocument();
			});

			it("正しい数のデータ行を持つ", () => {
				render(<DataTable exercise={exercise} />);

				// 19行のデータ行（50kg〜140kg、5kg刻み）+ 1行のヘッダー = 20行
				const rows = screen.getAllByRole("row");
				expect(rows).toHaveLength(20); // ヘッダー1行 + データ19行
			});

			it("50kgと140kgのデータが表示される", () => {
				render(<DataTable exercise={exercise} />);

				// 最小と最大の体重が表示されていることを確認
				expect(screen.getByText("50")).toBeInTheDocument();
				expect(screen.getByText("140")).toBeInTheDocument();
			});

			it("特定の体重データが正しく表示される", () => {
				render(<DataTable exercise={exercise} />);

				// 70kgの行が存在することを確認
				expect(screen.getByText("70")).toBeInTheDocument();

				// テーブル内の70kgのセルを取得
				const rows = screen.getAllByRole("row");
				const row70kg = rows.find(
					(row) => row.querySelector("td")?.textContent === "70",
				);
				expect(row70kg).toBeInTheDocument();
			});
		});
	});

	it("highlightBodyWeightプロパティが正しく動作する", () => {
		render(<DataTable exercise="ベンチプレス" highlightBodyWeight={70} />);

		// ハイライトされた行を見つける
		const rows = screen.getAllByRole("row");
		const highlightedRow = rows.find((row) =>
			row.classList.contains("bg-blue-50"),
		);

		expect(highlightedRow).toBeInTheDocument();
	});

	it("compactモードで正しく表示される", () => {
		render(<DataTable exercise="ベンチプレス" compact={true} />);

		const table = screen.getByRole("table");
		expect(table).toHaveClass("text-sm");
	});

	it("アクセシビリティ属性が正しく設定されている", () => {
		render(<DataTable exercise="ベンチプレス" />);

		const table = screen.getByRole("table");
		expect(table).toHaveAttribute(
			"aria-label",
			"ベンチプレスのレベル別重量データ",
		);

		// ヘッダーセルがth要素である
		const headerCells = screen.getAllByRole("columnheader");
		expect(headerCells).toHaveLength(6); // 体重 + 5レベル

		// データセルがtd要素である
		const dataCells = screen.getAllByRole("cell");
		expect(dataCells.length).toBeGreaterThan(0);
	});

	it("レスポンシブクラスが適用されている", () => {
		render(<DataTable exercise="ベンチプレス" />);

		const tableContainer = screen.getByRole("table").parentElement;
		expect(tableContainer).toHaveClass("overflow-x-auto");
	});

	it("レベル別の色分けが適用されている", () => {
		render(<DataTable exercise="ベンチプレス" />);

		// ヘッダーの色分けを確認
		const beginnerHeader = screen.getByText("初心者");
		const eliteHeader = screen.getByText("エリート");

		expect(beginnerHeader).toHaveClass("text-gray-600");
		expect(eliteHeader).toHaveClass("text-red-600");
	});
});
