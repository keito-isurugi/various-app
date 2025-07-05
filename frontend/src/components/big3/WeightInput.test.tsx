import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { WeightInput } from "./WeightInput";

describe("WeightInput", () => {
	const mockOnChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("初期値が正しく表示される", () => {
		render(<WeightInput value={70} onChange={mockOnChange} />);

		const input = screen.getByLabelText(/体重/i);
		expect(input).toHaveValue(70);
	});

	it("空の値でも正しく表示される", () => {
		render(<WeightInput value={""} onChange={mockOnChange} />);

		const input = screen.getByLabelText(/体重/i);
		expect(input).toHaveValue("");
	});

	it("数値入力時にonChangeが正しく呼ばれる", () => {
		render(<WeightInput value={""} onChange={mockOnChange} />);

		const input = screen.getByLabelText(/体重/i);
		fireEvent.change(input, { target: { value: "75" } });

		expect(mockOnChange).toHaveBeenCalledWith(75);
	});

	it("非数値入力時にonChangeが空文字で呼ばれる", () => {
		render(<WeightInput value={""} onChange={mockOnChange} />);

		const input = screen.getByLabelText(/体重/i);
		fireEvent.change(input, { target: { value: "abc" } });

		expect(mockOnChange).toHaveBeenCalledWith("");
	});

	it("小数点入力が正しく処理される", () => {
		render(<WeightInput value={""} onChange={mockOnChange} />);

		const input = screen.getByLabelText(/体重/i);
		fireEvent.change(input, { target: { value: "72.5" } });

		expect(mockOnChange).toHaveBeenCalledWith(72.5);
	});

	it("エラーメッセージが表示される", () => {
		render(
			<WeightInput
				value={40}
				onChange={mockOnChange}
				errorMessage="体重は50kg以上で入力してください"
			/>,
		);

		expect(
			screen.getByText("体重は50kg以上で入力してください"),
		).toBeInTheDocument();
	});

	it("エラー時に入力フィールドが赤くなる", () => {
		render(
			<WeightInput
				value={40}
				onChange={mockOnChange}
				errorMessage="体重は50kg以上で入力してください"
			/>,
		);

		const input = screen.getByLabelText(/体重/i);
		expect(input).toHaveClass("border-red-300");
	});

	it("プレースホルダーが表示される", () => {
		render(<WeightInput value={""} onChange={mockOnChange} />);

		const input = screen.getByLabelText(/体重/i);
		expect(input).toHaveAttribute("placeholder", "例: 70");
	});

	it("必須マークが表示される", () => {
		render(<WeightInput value={""} onChange={mockOnChange} />);

		expect(screen.getByText("*")).toBeInTheDocument();
		expect(screen.getByText("*")).toHaveClass("text-red-500");
	});

	it("単位（kg）が表示される", () => {
		render(<WeightInput value={""} onChange={mockOnChange} />);

		expect(screen.getByText("kg")).toBeInTheDocument();
	});

	it("無効化された状態で正しく動作する", () => {
		render(<WeightInput value={70} onChange={mockOnChange} disabled={true} />);

		const input = screen.getByLabelText(/体重/i);
		expect(input).toBeDisabled();
		expect(input).toHaveClass("bg-gray-100");
	});

	it("負の数値が正しく処理される", () => {
		render(<WeightInput value={""} onChange={mockOnChange} />);

		const input = screen.getByLabelText(/体重/i);
		fireEvent.change(input, { target: { value: "-10" } });

		// 負の数値も数値として認識されることを確認
		expect(mockOnChange).toHaveBeenCalledWith(-10);
	});

	it("ゼロが正しく処理される", () => {
		render(<WeightInput value={""} onChange={mockOnChange} />);

		const input = screen.getByLabelText(/体重/i);
		fireEvent.change(input, { target: { value: "0" } });

		expect(mockOnChange).toHaveBeenCalledWith(0);
	});
});
