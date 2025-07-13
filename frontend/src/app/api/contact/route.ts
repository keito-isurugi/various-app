import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, subject, message } = body;

		// バリデーション
		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ error: "必須項目が不足しています" },
				{ status: 400 },
			);
		}

		// ログに出力
		console.log("=== お問い合わせを受信しました ===");
		console.log("名前:", name);
		console.log("メールアドレス:", email);
		console.log("件名:", subject);
		console.log("お問い合わせ内容:", message);
		console.log("受信日時:", new Date().toISOString());
		console.log("================================");

		// 実際の実装では、ここでデータベースに保存したり、
		// メール送信サービスに送信したりします

		return NextResponse.json(
			{ message: "お問い合わせを受け付けました" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("お問い合わせ処理中にエラーが発生しました:", error);
		return NextResponse.json(
			{ error: "サーバーエラーが発生しました" },
			{ status: 500 },
		);
	}
}
