import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import BIG3Page from "./page";

describe("BIG3Page", () => {
	it("ページタイトルが表示される", () => {
		render(<BIG3Page />);

		expect(
			screen.getByRole("heading", { level: 1, name: /BIG3レベル判定/i }),
		).toBeInTheDocument();
	});

	it("説明文が表示される", () => {
		render(<BIG3Page />);

		expect(screen.getByText(/ウエイトトレーニングのBIG3/i)).toBeInTheDocument();
		expect(
			screen.getByText(/ベンチプレス、スクワット、デッドリフト/i),
		).toBeInTheDocument();
	});

	it("体重入力フィールドが表示される", () => {
		render(<BIG3Page />);

		const weightInput = screen.getByLabelText(/体重/i);
		expect(weightInput).toBeInTheDocument();
		expect(weightInput).toHaveAttribute("type", "number");
	});

	it("タブナビゲーションが表示される", () => {
		render(<BIG3Page />);

		expect(screen.getByRole("tab", { name: "目標重量" })).toBeInTheDocument();
		expect(
			screen.getByRole("tab", { name: "ベンチプレス" }),
		).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "スクワット" })).toBeInTheDocument();
		expect(
			screen.getByRole("tab", { name: "デッドリフト" }),
		).toBeInTheDocument();
	});

	it("初期状態では目標重量タブがアクティブ", () => {
		render(<BIG3Page />);

		const targetTab = screen.getByRole("tab", { name: "目標重量" });
		expect(targetTab).toHaveAttribute("aria-selected", "true");
	});

	it("体重を入力すると目標重量が表示される", async () => {
		render(<BIG3Page />);

		const weightInput = screen.getByLabelText(/体重/i);
		fireEvent.change(weightInput, { target: { value: "70" } });

		await waitFor(() => {
			expect(screen.getByText("体重: 70kg")).toBeInTheDocument();
		});

		// 目標重量の一部を確認
		expect(screen.getByText("ベンチプレス")).toBeInTheDocument();
		expect(screen.getByText("スクワット")).toBeInTheDocument();
		expect(screen.getByText("デッドリフト")).toBeInTheDocument();
	});

	it("タブを切り替えるとデータテーブルが表示される", async () => {
		render(<BIG3Page />);

		// ベンチプレスタブをクリック
		const benchPressTab = screen.getByRole("tab", { name: "ベンチプレス" });
		fireEvent.click(benchPressTab);

		await waitFor(() => {
			expect(benchPressTab).toHaveAttribute("aria-selected", "true");
		});

		// ベンチプレステーブルが表示される
		expect(
			screen.getByText("ベンチプレスのレベル別重量表"),
		).toBeInTheDocument();
	});

	it("無効な体重でエラーメッセージが表示される", async () => {
		render(<BIG3Page />);

		const weightInput = screen.getByLabelText(/体重/i);
		fireEvent.change(weightInput, { target: { value: "40" } });

		await waitFor(() => {
			expect(
				screen.getByText(/体重は50kg以上で入力してください/i),
			).toBeInTheDocument();
		});
	});

	it("体重が未入力時にプレースホルダーメッセージが表示される", () => {
		render(<BIG3Page />);

		// 目標重量タブが選択されている状態で未入力メッセージを確認
		expect(screen.getByText("体重を入力してください")).toBeInTheDocument();
	});

	it("体重入力時にテーブルがハイライトされる", async () => {
		render(<BIG3Page />);

		// 体重を入力
		const weightInput = screen.getByLabelText(/体重/i);
		fireEvent.change(weightInput, { target: { value: "70" } });

		// ベンチプレスタブに切り替え
		const benchPressTab = screen.getByRole("tab", { name: "ベンチプレス" });
		fireEvent.click(benchPressTab);

		await waitFor(() => {
			expect(
				screen.getByText("体重 70kg 付近の行がハイライトされています"),
			).toBeInTheDocument();
		});
	});

	it("全てのタブが正しく動作する", async () => {
		render(<BIG3Page />);

		const exercises = ["ベンチプレス", "スクワット", "デッドリフト"];

		for (const exercise of exercises) {
			const tab = screen.getByRole("tab", { name: exercise });
			fireEvent.click(tab);

			await waitFor(() => {
				expect(tab).toHaveAttribute("aria-selected", "true");
				expect(
					screen.getByText(`${exercise}のレベル別重量表`),
				).toBeInTheDocument();
			});
		}
	});

	it("アクセシビリティ属性が正しく設定されている", () => {
		render(<BIG3Page />);

		// タブリストが存在する
		const tablist = screen.getByRole("tablist");
		expect(tablist).toBeInTheDocument();

		// タブパネルが存在する
		const tabpanel = screen.getByRole("tabpanel");
		expect(tabpanel).toBeInTheDocument();
	});

	it("レスポンシブレイアウトが適用されている", () => {
		const { container } = render(<BIG3Page />);

		// コンテナにレスポンシブクラスが適用されている
		const mainContainer = container.querySelector(".container");
		expect(mainContainer).toBeInTheDocument();
	});

	it("小数点を含む体重が正しく処理される", async () => {
		render(<BIG3Page />);

		const weightInput = screen.getByLabelText(/体重/i);
		fireEvent.change(weightInput, { target: { value: "72.5" } });

		await waitFor(() => {
			expect(screen.getByText("体重: 72.5kg")).toBeInTheDocument();
		});
	});
});
