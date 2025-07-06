import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import type { CalculationParameter } from "../../types/calculator";
import { ParameterInput } from "./ParameterInput";

describe("ParameterInput", () => {
	const mockOnChange = jest.fn<(parameter: CalculationParameter) => void>();

	const defaultParameter: CalculationParameter = {
		id: "mass",
		name: "質量",
		value: 1.989e30,
		unit: "kg",
		description: "物体の質量",
		min: 0,
		max: 1e50,
		required: true,
	};

	beforeEach(() => {
		mockOnChange.mockClear();
	});

	describe("表示", () => {
		it("パラメータ名が表示される", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			expect(screen.getByText("質量")).toBeInTheDocument();
		});

		it("単位が表示される", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			expect(screen.getByText("kg")).toBeInTheDocument();
		});

		it("説明が表示される", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			expect(screen.getByText("物体の質量")).toBeInTheDocument();
		});

		it("必須マークが表示される", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			expect(screen.getByText("*")).toBeInTheDocument();
		});

		it("必須でない場合は必須マークが表示されない", () => {
			const optionalParameter = { ...defaultParameter, required: false };
			render(
				<ParameterInput
					parameter={optionalParameter}
					onChange={mockOnChange}
				/>,
			);
			expect(screen.queryByText("*")).not.toBeInTheDocument();
		});

		it("初期値が入力フィールドに表示される", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			const input = screen.getByDisplayValue("1.989e+30");
			expect(input).toBeInTheDocument();
		});
	});

	describe("入力操作", () => {
		it("値を変更するとonChangeが呼ばれる", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			const input = screen.getByRole("textbox");

			fireEvent.change(input, { target: { value: "5.972e24" } });

			expect(mockOnChange).toHaveBeenCalledWith({
				...defaultParameter,
				value: 5.972e24,
			});
		});

		it("無効な数値入力でエラーが表示される", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			const input = screen.getByRole("textbox");

			fireEvent.change(input, { target: { value: "invalid" } });

			expect(
				screen.getByText("有効な数値を入力してください"),
			).toBeInTheDocument();
			expect(mockOnChange).not.toHaveBeenCalled();
		});

		it("最小値未満の入力でエラーが表示される", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			const input = screen.getByRole("textbox");

			fireEvent.change(input, { target: { value: "-1" } });

			expect(
				screen.getByText("値は0以上である必要があります"),
			).toBeInTheDocument();
		});

		it("最大値超過の入力でエラーが表示される", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			const input = screen.getByRole("textbox");

			fireEvent.change(input, { target: { value: "1e51" } });

			expect(
				screen.getByText("値は1e+50以下である必要があります"),
			).toBeInTheDocument();
		});
	});

	describe("アクセシビリティ", () => {
		it("適切なaria-labelが設定される", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("aria-label", "質量 (kg)");
		});

		it("エラー時にaria-describedbyが設定される", () => {
			render(
				<ParameterInput parameter={defaultParameter} onChange={mockOnChange} />,
			);
			const input = screen.getByRole("textbox");

			fireEvent.change(input, { target: { value: "invalid" } });

			expect(input).toHaveAttribute("aria-describedby");
			expect(input).toHaveAttribute("aria-invalid", "true");
		});
	});
});
