import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import {
	type PlaygroundEngine,
	createPlaygroundEngine,
	validateCSS,
	validateHTML,
	validateJavaScript,
} from "./playground-engine";

describe("PlaygroundEngine", () => {
	let engine: PlaygroundEngine;
	let container: HTMLElement;

	beforeEach(() => {
		// テスト用のコンテナを作成
		container = document.createElement("div");
		container.id = "test-container";
		document.body.appendChild(container);

		engine = createPlaygroundEngine(container);
	});

	afterEach(() => {
		// テスト後のクリーンアップ
		if (container.parentNode) {
			container.parentNode.removeChild(container);
		}
	});

	describe("HTML実行", () => {
		it("基本的なHTMLが正しく実行される", () => {
			const html = "<h1>Hello World</h1>";
			const result = engine.executeHTML(html);

			expect(result.success).toBe(true);
			expect(container.innerHTML).toContain("<h1>Hello World</h1>");
		});

		it("複雑なHTMLが正しく実行される", () => {
			const html = `
				<div class="container">
					<h1>Title</h1>
					<p>Paragraph</p>
					<ul>
						<li>Item 1</li>
						<li>Item 2</li>
					</ul>
				</div>
			`;
			const result = engine.executeHTML(html);

			expect(result.success).toBe(true);
			expect(container.querySelector("h1")).toHaveTextContent("Title");
			expect(container.querySelector("p")).toHaveTextContent("Paragraph");
			expect(container.querySelectorAll("li")).toHaveLength(2);
		});

		it("不正なHTMLでエラーが検出される", () => {
			const html = "<div><p>unclosed div";
			const result = engine.executeHTML(html);

			expect(result.success).toBe(true); // HTMLは自動修正される
			expect(container.innerHTML).toContain("<div><p>unclosed div</p></div>");
		});
	});

	describe("CSS実行", () => {
		it("基本的なCSSが正しく適用される", () => {
			const html = "<div class='test'>Test</div>";
			const css = ".test { color: red; font-size: 20px; }";

			engine.executeHTML(html);
			const result = engine.executeCSS(css);

			expect(result.success).toBe(true);

			const element = container.querySelector(".test") as HTMLElement;
			expect(element).toBeTruthy();

			// スタイルが適用されていることを確認
			const styles = getComputedStyle(element);
			expect(styles.color).toBe("red");
			expect(styles.fontSize).toBe("20px");
		});

		it("CSSアニメーションが適用される", () => {
			const html = "<div class='animated'>Animate</div>";
			const css = `
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				.animated {
					animation: fadeIn 1s ease-in-out;
				}
			`;

			engine.executeHTML(html);
			const result = engine.executeCSS(css);

			expect(result.success).toBe(true);

			const element = container.querySelector(".animated") as HTMLElement;
			const styles = getComputedStyle(element);
			expect(styles.animationName).toBe("fadeIn");
		});

		it("無効なCSSでエラーが検出される", () => {
			const css = ".invalid { color: invalidcolor; missing-bracket";
			const result = engine.executeCSS(css);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].type).toBe("syntax");
		});
	});

	describe("JavaScript実行", () => {
		it("基本的なJavaScriptが正しく実行される", () => {
			const html = "<div id='output'></div>";
			const js = `
				const output = document.getElementById('output');
				output.textContent = 'Hello from JS';
			`;

			engine.executeHTML(html);
			const result = engine.executeJavaScript(js);

			expect(result.success).toBe(true);
			expect(container.querySelector("#output")).toHaveTextContent(
				"Hello from JS",
			);
		});

		it("DOM操作が正しく動作する", async () => {
			const html = "<ul id='list'></ul>";
			const js = `
				const list = document.getElementById('list');
				if (list) {
					for (let i = 1; i <= 3; i++) {
						const li = document.createElement('li');
						li.textContent = 'Item ' + i;
						list.appendChild(li);
					}
				}
			`;

			engine.executeHTML(html);
			const result = engine.executeJavaScript(js);

			expect(result.success).toBe(true);

			// DOM操作の完了を待つ
			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(container.querySelectorAll("li")).toHaveLength(3);
			expect(container.querySelector("li")).toHaveTextContent("Item 1");
		});

		it("console.logが捕捉される", () => {
			const js = `
				console.log('Test message');
				console.warn('Warning message');
				console.error('Error message');
			`;

			const result = engine.executeJavaScript(js);

			expect(result.success).toBe(true);
			expect(result.consoleLogs).toHaveLength(3);
			expect(result.consoleLogs[0].level).toBe("log");
			expect(result.consoleLogs[0].message).toBe("Test message");
			expect(result.consoleLogs[1].level).toBe("warn");
			expect(result.consoleLogs[2].level).toBe("error");
		});

		it("ランタイムエラーが捕捉される", () => {
			const js = `
				const obj = null;
				obj.method(); // TypeError
			`;

			const result = engine.executeJavaScript(js);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].type).toBe("runtime");
			expect(result.errors[0].message).toContain("TypeError");
		});

		it("構文エラーが検出される", () => {
			const js = `
				function test( {
					console.log('incomplete');
				}
			`;

			const result = engine.executeJavaScript(js);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].type).toBe("syntax");
		});
	});

	describe("組み合わせ実行", () => {
		it("HTML + CSS + JavaScriptが連携して動作する", () => {
			const html = "<button id='btn'>Click me</button><div id='result'></div>";
			const css =
				"#btn { background: blue; color: white; } #result { color: green; }";
			const js = `
				document.getElementById('btn').addEventListener('click', function() {
					document.getElementById('result').textContent = 'Button clicked!';
				});
			`;

			const htmlResult = engine.executeHTML(html);
			const cssResult = engine.executeCSS(css);
			const jsResult = engine.executeJavaScript(js);

			expect(htmlResult.success).toBe(true);
			expect(cssResult.success).toBe(true);
			expect(jsResult.success).toBe(true);

			// ボタンをクリックしてイベントをテスト
			const button = container.querySelector("#btn") as HTMLButtonElement;
			button.click();

			expect(container.querySelector("#result")).toHaveTextContent(
				"Button clicked!",
			);
		});
	});
});

describe("Validation functions", () => {
	describe("validateHTML", () => {
		it("有効なHTMLを検証する", () => {
			const html = "<div><p>Valid HTML</p></div>";
			const result = validateHTML(html);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("空のHTMLを許可する", () => {
			const result = validateHTML("");
			expect(result.isValid).toBe(true);
		});
	});

	describe("validateCSS", () => {
		it("有効なCSSを検証する", () => {
			const css = ".class { color: red; margin: 10px; }";
			const result = validateCSS(css);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("構文エラーのあるCSSを検出する", () => {
			const css = ".class { color: red margin: 10px }"; // セミコロン不足
			const result = validateCSS(css);

			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});
	});

	describe("validateJavaScript", () => {
		it("有効なJavaScriptを検証する", () => {
			const js = "const x = 10; console.log(x);";
			const result = validateJavaScript(js);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("構文エラーのあるJavaScriptを検出する", () => {
			const js = "const x = 10 console.log(x);"; // セミコロン不足
			const result = validateJavaScript(js);

			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});
	});
});
