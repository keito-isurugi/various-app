import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * ミドルウェア設定
 * 特定のパスに対してセキュリティヘッダーを設定
 */
export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// /demo/embed-target パスに対してのみX-Frame-Optionsを削除
	// これにより他ドメインからのiframe埋め込みを許可
	if (request.nextUrl.pathname === "/demo/embed-target") {
		// X-Frame-Optionsヘッダーを削除（デフォルトのDENYを無効化）
		response.headers.delete("X-Frame-Options");

		// Content Security Policyでframe-ancestorsを設定
		// すべてのドメインからの埋め込みを許可
		response.headers.set("Content-Security-Policy", "frame-ancestors *;");
	}

	return response;
}

// ミドルウェアを適用するパスの設定
export const config = {
	matcher: "/demo/embed-target",
};
