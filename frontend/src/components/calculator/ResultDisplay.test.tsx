import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import { ResultDisplay } from "./ResultDisplay";
import type { CalculationResult } from "../../types/calculator";

describe("ResultDisplay", () => {
	const mockResult: CalculationResult = {
		id: "schwarzschild_radius",
		name: "シュワルツシルト半径",
		value: 2954.123,
		unit: "m",
		formattedValue: "2.95 km",
		description: "この質量の物体がブラックホールになった場合の事象の地平面の半径です。",
	};

	describe("表示", () => {
		it("結果名が表示される", () => {
			render(<ResultDisplay result={mockResult} />);
			expect(screen.getByText("シュワルツシルト半径")).toBeInTheDocument();
		});

		it("フォーマット済みの値が表示される", () => {
			render(<ResultDisplay result={mockResult} />);
			expect(screen.getByText("2.95 km")).toBeInTheDocument();
		});

		it("説明が表示される", () => {
			render(<ResultDisplay result={mockResult} />);
			expect(screen.getByText(/この質量の物体がブラックホールになった場合の/)).toBeInTheDocument();
		});

		it("生の値と単位も表示される", () => {
			render(<ResultDisplay result={mockResult} />);
			expect(screen.getByText("(2954.123 m)")).toBeInTheDocument();
		});
	});

	describe("スタイリング", () => {
		it("正しいCSSクラスが適用される", () => {
			render(<ResultDisplay result={mockResult} />);
			const container = screen.getByRole("region");
			expect(container).toHaveClass("bg-blue-50", "border-blue-200");
		});
	});

	describe("複数の結果", () => {
		it("複数の結果を表示できる", () => {
			const results = [
				mockResult,
				{
					id: "escape_velocity",
					name: "脱出速度",
					value: 299792458,
					unit: "m/s",
					formattedValue: "光速",
					description: "この重力場から脱出するのに必要な速度です。",
				},
			];

			render(
				<div>
					{results.map(result => (
						<ResultDisplay key={result.id} result={result} />
					))}
				</div>
			);

			expect(screen.getByText("シュワルツシルト半径")).toBeInTheDocument();
			expect(screen.getByText("脱出速度")).toBeInTheDocument();
		});
	});
});