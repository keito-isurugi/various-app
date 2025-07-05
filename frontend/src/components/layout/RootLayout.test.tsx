import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { AppLayout } from "./RootLayout";

// モックコンポーネント
jest.mock("../header/Header", () => ({
	Header: () => <div data-testid="header">Header</div>,
}));

jest.mock("../footer/Footer", () => ({
	Footer: () => <div data-testid="footer">Footer</div>,
}));

describe("AppLayout", () => {
	it("ヘッダー、コンテンツ、フッターを正しくレンダリングする", () => {
		render(
			<AppLayout>
				<div data-testid="content">Test Content</div>
			</AppLayout>,
		);

		// ヘッダーが存在することを確認
		expect(screen.getByTestId("header")).toBeInTheDocument();

		// コンテンツが存在することを確認
		expect(screen.getByTestId("content")).toBeInTheDocument();
		expect(screen.getByText("Test Content")).toBeInTheDocument();

		// フッターが存在することを確認
		expect(screen.getByTestId("footer")).toBeInTheDocument();
	});

	it("複数の子要素を正しくレンダリングする", () => {
		render(
			<AppLayout>
				<div>First Child</div>
				<div>Second Child</div>
			</AppLayout>,
		);

		expect(screen.getByText("First Child")).toBeInTheDocument();
		expect(screen.getByText("Second Child")).toBeInTheDocument();
	});

	it("適切なレイアウト構造を持つ", () => {
		const { container } = render(
			<AppLayout>
				<div>Content</div>
			</AppLayout>,
		);

		// flexレイアウトとmin-heightが適用されていることを確認
		const layoutDiv = container.firstChild;
		expect(layoutDiv).toHaveClass("flex", "flex-col", "min-h-screen");

		// mainタグが存在し、flex-growが適用されていることを確認
		const mainElement = container.querySelector("main");
		expect(mainElement).toBeInTheDocument();
		expect(mainElement).toHaveClass("flex-grow");
	});
});
