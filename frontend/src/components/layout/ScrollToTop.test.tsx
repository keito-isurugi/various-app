import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	jest,
} from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { ScrollToTop } from "./ScrollToTop";

describe("ScrollToTop", () => {
	// window.scrollToをモック
	const mockScrollTo = jest.fn();

	beforeEach(() => {
		// window.scrollToをモック
		Object.defineProperty(window, "scrollTo", {
			value: mockScrollTo,
			writable: true,
		});

		// window.pageYOffsetをモック
		Object.defineProperty(window, "pageYOffset", {
			value: 0,
			writable: true,
		});

		mockScrollTo.mockClear();
	});

	afterEach(() => {
		// イベントリスナーをクリア
		window.removeEventListener("scroll", jest.fn());
	});

	describe("表示・非表示の制御", () => {
		it("初期状態では非表示", () => {
			render(<ScrollToTop />);

			const button = screen.queryByLabelText("ページトップへ戻る");
			expect(button).not.toBeInTheDocument();
		});

		it("300px以下のスクロールでは非表示", () => {
			render(<ScrollToTop />);

			// スクロール位置を200pxに設定
			Object.defineProperty(window, "pageYOffset", {
				value: 200,
				writable: true,
			});

			// スクロールイベントを発火
			fireEvent.scroll(window);

			const button = screen.queryByLabelText("ページトップへ戻る");
			expect(button).not.toBeInTheDocument();
		});

		it("300pxを超えるスクロールで表示される", () => {
			render(<ScrollToTop />);

			// スクロール位置を400pxに設定
			Object.defineProperty(window, "pageYOffset", {
				value: 400,
				writable: true,
			});

			// スクロールイベントを発火
			fireEvent.scroll(window);

			const button = screen.getByLabelText("ページトップへ戻る");
			expect(button).toBeInTheDocument();
		});

		it("300pxを超えた後に300px以下に戻ると非表示になる", () => {
			render(<ScrollToTop />);

			// 一度400pxまでスクロール
			Object.defineProperty(window, "pageYOffset", {
				value: 400,
				writable: true,
			});
			fireEvent.scroll(window);

			// ボタンが表示されていることを確認
			let button = screen.getByLabelText("ページトップへ戻る");
			expect(button).toBeInTheDocument();

			// 100pxまで戻る
			Object.defineProperty(window, "pageYOffset", {
				value: 100,
				writable: true,
			});
			fireEvent.scroll(window);

			// ボタンが非表示になることを確認
			button = screen.queryByLabelText("ページトップへ戻る");
			expect(button).not.toBeInTheDocument();
		});
	});

	describe("スクロール機能", () => {
		it("ボタンをクリックするとページトップにスクロールする", () => {
			render(<ScrollToTop />);

			// スクロール位置を400pxに設定してボタンを表示
			Object.defineProperty(window, "pageYOffset", {
				value: 400,
				writable: true,
			});
			fireEvent.scroll(window);

			const button = screen.getByLabelText("ページトップへ戻る");
			fireEvent.click(button);

			// window.scrollToが正しい引数で呼ばれることを確認
			expect(mockScrollTo).toHaveBeenCalledWith({
				top: 0,
				behavior: "smooth",
			});
		});
	});

	describe("アクセシビリティ", () => {
		it("適切なaria-labelが設定されている", () => {
			render(<ScrollToTop />);

			// ボタンを表示
			Object.defineProperty(window, "pageYOffset", {
				value: 400,
				writable: true,
			});
			fireEvent.scroll(window);

			const button = screen.getByLabelText("ページトップへ戻る");
			expect(button).toHaveAttribute("aria-label", "ページトップへ戻る");
		});

		it("ボタンタイプが正しく設定されている", () => {
			render(<ScrollToTop />);

			// ボタンを表示
			Object.defineProperty(window, "pageYOffset", {
				value: 400,
				writable: true,
			});
			fireEvent.scroll(window);

			const button = screen.getByLabelText("ページトップへ戻る");
			expect(button).toHaveAttribute("type", "button");
		});
	});

	describe("スタイリング", () => {
		it("正しいCSSクラスが適用されている", () => {
			render(<ScrollToTop />);

			// ボタンを表示
			Object.defineProperty(window, "pageYOffset", {
				value: 400,
				writable: true,
			});
			fireEvent.scroll(window);

			const button = screen.getByLabelText("ページトップへ戻る");
			expect(button).toHaveClass(
				"fixed",
				"bottom-8",
				"right-8",
				"z-30",
				"p-3",
				"bg-blue-600",
				"hover:bg-blue-700",
				"text-white",
				"rounded-full",
				"shadow-lg",
			);
		});
	});
});
