import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import { SideNavigation } from "./SideNavigation";

// Next.js Linkのモック
jest.mock("next/link", () => {
	return function MockLink({
		children,
		href,
		onClick,
	}: {
		children: React.ReactNode;
		href: string;
		onClick?: () => void;
	}) {
		return (
			<a href={href} onClick={onClick}>
				{children}
			</a>
		);
	};
});

describe("SideNavigation", () => {
	const mockOnClose = jest.fn<() => void>();

	beforeEach(() => {
		mockOnClose.mockClear();
	});

	describe("表示・非表示の制御", () => {
		it("isOpen=trueのときにメニューが表示される", () => {
			render(<SideNavigation isOpen={true} onClose={mockOnClose} />);

			// サイドメニューが表示されている
			expect(screen.getByText("kei-talk")).toBeInTheDocument();
			expect(screen.getByText("ホーム")).toBeInTheDocument();
			expect(screen.getByText("ブログ")).toBeInTheDocument();
		});

		it("isOpen=falseのときにメニューが非表示になる", () => {
			render(<SideNavigation isOpen={false} onClose={mockOnClose} />);

			// メニューが非表示（transform: translateX(-100%)）
			const menu = screen.getByText("kei-talk").closest("div")?.parentElement;
			expect(menu).toHaveClass("-translate-x-full");
		});
	});

	describe("メニューの閉じ方", () => {
		it("閉じるボタンをクリックするとonCloseが呼ばれる", () => {
			render(<SideNavigation isOpen={true} onClose={mockOnClose} />);

			const closeButton = screen.getByLabelText("メニューを閉じる");
			fireEvent.click(closeButton);

			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it("オーバーレイをクリックするとonCloseが呼ばれる", () => {
			render(<SideNavigation isOpen={true} onClose={mockOnClose} />);

			const overlay = document.querySelector(".fixed.inset-0.bg-black");
			expect(overlay).toBeInTheDocument();

			if (overlay) {
				fireEvent.click(overlay);
				expect(mockOnClose).toHaveBeenCalledTimes(1);
			}
		});

		it("ナビゲーションリンクをクリックするとonCloseが呼ばれる", () => {
			render(<SideNavigation isOpen={true} onClose={mockOnClose} />);

			const homeLink = screen.getByText("ホーム");
			fireEvent.click(homeLink);

			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it("Escapeキーを押すとonCloseが呼ばれる", () => {
			render(<SideNavigation isOpen={true} onClose={mockOnClose} />);

			fireEvent.keyDown(document, { key: "Escape" });

			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});
	});

	describe("ナビゲーションメニュー", () => {
		it("すべてのナビゲーション項目が表示される", () => {
			render(<SideNavigation isOpen={true} onClose={mockOnClose} />);

			const expectedItems = [
				"ホーム",
				"ブログ",
				"BIG3計算",
				"Playground",
				"私について",
				"お問い合わせ",
			];

			for (const item of expectedItems) {
				expect(screen.getByText(item)).toBeInTheDocument();
			}
		});

		it("各ナビゲーション項目にアイコンが表示される", () => {
			render(<SideNavigation isOpen={true} onClose={mockOnClose} />);

			// アイコンの存在確認
			expect(screen.getByText("🏠")).toBeInTheDocument(); // ホーム
			expect(screen.getByText("📝")).toBeInTheDocument(); // ブログ
			expect(screen.getByText("💪")).toBeInTheDocument(); // BIG3
			expect(screen.getByText("🚀")).toBeInTheDocument(); // Playground
			expect(screen.getByText("👤")).toBeInTheDocument(); // About
			expect(screen.getByText("📧")).toBeInTheDocument(); // Contact
		});
	});

	describe("フッター情報", () => {
		it("フッター情報が表示される", () => {
			render(<SideNavigation isOpen={true} onClose={mockOnClose} />);

			expect(screen.getByText("© 2024 kei-talk")).toBeInTheDocument();
			expect(screen.getByText("技術ブログとポートフォリオ")).toBeInTheDocument();
		});
	});
});