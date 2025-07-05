import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { TargetWeights } from "./TargetWeights";

describe("TargetWeights", () => {
	it("有効な体重で全ての種目の目標重量を表示する", () => {
		render(<TargetWeights bodyWeight={70} />);

		// 種目名が表示されている
		expect(screen.getByText("ベンチプレス")).toBeInTheDocument();
		expect(screen.getByText("スクワット")).toBeInTheDocument();
		expect(screen.getByText("デッドリフト")).toBeInTheDocument();

		// レベル名が表示されている
		expect(screen.getAllByText("初心者")).toHaveLength(3);
		expect(screen.getAllByText("初級者")).toHaveLength(3);
		expect(screen.getAllByText("中級者")).toHaveLength(3);
		expect(screen.getAllByText("上級者")).toHaveLength(3);
		expect(screen.getAllByText("エリート")).toHaveLength(3);
	});

	it("70kgの正確な重量が表示される", () => {
		render(<TargetWeights bodyWeight={70} />);

		// ベンチプレス70kgの重量（44, 62, 85, 112, 141）
		expect(screen.getByText("44kg")).toBeInTheDocument();
		expect(screen.getByText("62kg")).toBeInTheDocument();
		expect(screen.getByText("85kg")).toBeInTheDocument();
		expect(screen.getByText("112kg")).toBeInTheDocument();
		expect(screen.getByText("141kg")).toBeInTheDocument();
	});

	it("無効な体重でエラーメッセージを表示する", () => {
		render(<TargetWeights bodyWeight={40} />);

		expect(
			screen.getByText("有効な体重データがありません"),
		).toBeInTheDocument();
		expect(
			screen.getByText("体重は50kg〜140kgの範囲で入力してください"),
		).toBeInTheDocument();
	});

	it("体重未入力時にプレースホルダーメッセージを表示する", () => {
		render(<TargetWeights bodyWeight={""} />);

		expect(screen.getByText("体重を入力してください")).toBeInTheDocument();
		expect(
			screen.getByText("体重を入力すると、各レベルの目標重量が表示されます"),
		).toBeInTheDocument();
	});

	it("補間計算が必要な体重で正しい値を表示する", () => {
		render(<TargetWeights bodyWeight={72.5} />);

		// 70kgと75kgの中間値が表示されることを確認
		// ベンチプレス初心者: (44 + 49) / 2 = 46.5
		expect(screen.getByText("46.5kg")).toBeInTheDocument();
	});

	it("レベル別の色分けが適用されている", () => {
		render(<TargetWeights bodyWeight={70} />);

		// 各レベルの色クラスを確認
		const beginnerElements = screen.getAllByText("初心者");
		const eliteElements = screen.getAllByText("エリート");

		beginnerElements.forEach((element) => {
			expect(element).toHaveClass("text-gray-600");
		});

		eliteElements.forEach((element) => {
			expect(element).toHaveClass("text-red-600");
		});
	});

	it("コンパクトモードで正しく表示される", () => {
		const { container } = render(
			<TargetWeights bodyWeight={70} compact={true} />,
		);

		expect(container.firstChild).toHaveClass("text-sm");
	});

	it("カスタムクラスが適用される", () => {
		const { container } = render(
			<TargetWeights bodyWeight={70} className="custom-class" />,
		);

		expect(container.firstChild).toHaveClass("custom-class");
	});

	it("アクセシビリティ属性が正しく設定されている", () => {
		render(<TargetWeights bodyWeight={70} />);

		// セクション要素にaria-labelが設定されている
		const section = screen.getByRole("region", { name: "目標重量一覧" });
		expect(section).toBeInTheDocument();

		// 各種目のグループが正しくマークアップされている
		const benchPressGroup = screen.getByRole("group", {
			name: "ベンチプレス目標重量",
		});
		expect(benchPressGroup).toBeInTheDocument();
	});

	it("レスポンシブグリッドレイアウトが適用されている", () => {
		const { container } = render(<TargetWeights bodyWeight={70} />);

		const gridContainer = container.querySelector(".grid");
		expect(gridContainer).toHaveClass("md:grid-cols-3");
	});

	it("体重表示が正しくフォーマットされている", () => {
		render(<TargetWeights bodyWeight={72.5} />);

		// 体重が正しく表示されている
		expect(screen.getByText("体重: 72.5kg")).toBeInTheDocument();
	});

	it("小数点を含む重量が正しく表示される", () => {
		render(<TargetWeights bodyWeight={67.5} />);

		// 小数点を含む重量値が存在することを確認
		const weightElements = screen.getAllByText(/\d+(\.\d+)?kg/);
		expect(weightElements.length).toBeGreaterThan(0);
	});
});
