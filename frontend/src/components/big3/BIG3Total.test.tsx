import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { BIG3Total } from "./BIG3Total";

describe("BIG3Total", () => {
	it("体重が未入力の場合は体重入力メッセージを表示する", () => {
		render(<BIG3Total bodyWeight="" />);

		expect(screen.getByText("体重を入力してください")).toBeInTheDocument();
	});

	it("有効な体重で合計値が表示される", () => {
		render(<BIG3Total bodyWeight={70} />);

		// タイトルが表示されることを確認
		expect(screen.getByText("BIG3合計値")).toBeInTheDocument();

		// 各レベルのセクションが表示されることを確認
		expect(screen.getByText("初心者")).toBeInTheDocument();
		expect(screen.getByText("初級者")).toBeInTheDocument();
		expect(screen.getByText("中級者")).toBeInTheDocument();
		expect(screen.getByText("上級者")).toBeInTheDocument();
		expect(screen.getByText("エリート")).toBeInTheDocument();

		// 種目名が表示されることを確認
		expect(screen.getAllByText("ベンチプレス").length).toBeGreaterThan(0);
		expect(screen.getAllByText("スクワット").length).toBeGreaterThan(0);
		expect(screen.getAllByText("デッドリフト").length).toBeGreaterThan(0);

		// 合計の表示確認
		expect(screen.getAllByText(/合計/)).toHaveLength(5); // 各レベルごとに合計表示
	});

	it("無効な体重でエラーメッセージを表示する", () => {
		render(<BIG3Total bodyWeight={30} />);

		expect(
			screen.getByText(/体重は50kg以上で入力してください/),
		).toBeInTheDocument();
	});

	it("範囲外の体重でエラーメッセージを表示する", () => {
		render(<BIG3Total bodyWeight={200} />);

		expect(
			screen.getByText(/体重は140kg以下で入力してください/),
		).toBeInTheDocument();
	});

	it("レスポンシブデザインのクラスが適用されている", () => {
		const { container } = render(<BIG3Total bodyWeight={70} />);

		// グリッドレイアウトのクラスが適用されていることを確認
		const gridElement = container.querySelector(".grid");
		expect(gridElement).toBeInTheDocument();
		expect(gridElement).toHaveClass("md:grid-cols-2", "lg:grid-cols-3");
	});
});
