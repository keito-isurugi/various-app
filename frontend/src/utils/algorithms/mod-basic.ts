/**
 * src/utils/algorithms/mod-basic.ts
 *
 * mod計算の基本アルゴリズムの実装
 * 剰余演算の基本的な性質と高速べき乗計算を含む数学的アルゴリズム
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * mod計算の操作種別を表す型
 */
type ModOperation = "basic" | "power" | "inverse" | "properties";

/**
 * mod計算の各ステップの状態を表す型
 */
interface ModCalculationStep {
	operation: string; // 実行中の操作
	dividend: number; // 被除数
	divisor: number; // 除数（modulus）
	quotient?: number; // 商
	remainder: number; // 余り（結果）
	formula: string; // 計算式
	explanation: string; // 説明
	isNew?: boolean; // 新しく計算されたステップかどうか
}

/**
 * mod計算の基本アルゴリズムクラス
 *
 * 剰余演算の基本的な性質と応用を学習するためのアルゴリズム
 * 基本的な剰余、高速べき乗、逆元計算、演算の性質を包含
 * 時間計算量: O(1)〜O(log n)（操作により異なる）
 * 空間計算量: O(1)
 */
export class ModBasicAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "mod-basic",
		name: "mod計算の基本",
		description:
			"剰余演算の基本的な性質と高速べき乗計算を学習する数学的アルゴリズム",
		category: "other",
		timeComplexity: {
			best: "O(1)", // 基本的なmod計算
			average: "O(log n)", // べき乗計算
			worst: "O(log n)", // べき乗計算
		},
		difficulty: 2, // 初中級（数学的理解が必要）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private calculationSteps: ModCalculationStep[] = [];

	/**
	 * mod計算を実行
	 * @param input 操作パラメータ（a, b, m, operation）
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証と値の取得
		const a = input.parameters?.a as number;
		const b = input.parameters?.b as number;
		const m = input.parameters?.m as number;
		const operation = (input.parameters?.operation as ModOperation) || "basic";

		if (!this.validateInputs(a, b, m, operation)) {
			throw new Error("有効な入力パラメータが必要です");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.calculationSteps = [];

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `mod計算開始：${this.getOperationDescription(operation, a, b, m)}`,
			array: [],
			operation: "初期化",
			variables: {
				a: a,
				b: b ?? "未使用",
				modulus: m,
				operationType: operation,
				purpose: "剰余演算とその性質の理解",
				applications: "暗号学、ハッシュ関数、数論アルゴリズム",
			},
		});

		let result: number;

		// 操作種別に応じて実行
		switch (operation) {
			case "basic":
				result = this.performBasicMod(a, m);
				break;
			case "power":
				if (b === undefined) throw new Error("べき乗計算には指数bが必要です");
				result = this.performModularExponentiation(a, b, m);
				break;
			case "inverse":
				result = this.performModularInverse(a, m);
				break;
			case "properties":
				if (b === undefined) throw new Error("性質確認には第二数bが必要です");
				result = this.demonstrateModProperties(a, b, m);
				break;
			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` mod計算完了！結果：${result}`,
			array: [],
			operation: "完了",
			variables: {
				result: result,
				operation: operation,
				timeComplexity: this.getTimeComplexity(operation),
				spaceComplexity: "O(1)",
				mathematicalSignificance: "数論とコンピュータサイエンスの基盤",
			},
		});

		return {
			success: true,
			result: result,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.getTimeComplexity(operation),
			summary: {
				operation: operation,
				result: result,
				modulus: m,
				inputA: a,
				inputB: b ?? "未使用",
			},
		};
	}

	/**
	 * 入力値の検証
	 */
	private validateInputs(
		a: number,
		b: number,
		m: number,
		operation: ModOperation,
	): boolean {
		// 基本的な数値チェック
		if (!Number.isInteger(a) || !Number.isInteger(m)) {
			throw new Error("aとmは整数である必要があります");
		}

		if (m <= 0) {
			throw new Error("法mは正の整数である必要があります");
		}

		if (m > 1000) {
			throw new Error("教育目的のため、法mは1000以下に制限されています");
		}

		if (a < 0 || a > 10000) {
			throw new Error("aは0から10000の範囲で設定してください");
		}

		// 操作固有のチェック
		if (
			(operation === "power" || operation === "properties") &&
			(!Number.isInteger(b) || b < 0)
		) {
			throw new Error("べき乗操作では、bは非負整数である必要があります");
		}

		if (operation === "power" && b > 20) {
			throw new Error("教育目的のため、指数bは20以下に制限されています");
		}

		if (operation === "inverse" && this.gcd(a, m) !== 1) {
			throw new Error("逆元計算では、aとmが互いに素である必要があります");
		}

		return true;
	}

	/**
	 * 基本的なmod計算を実行
	 */
	private performBasicMod(a: number, m: number): number {
		this.steps.push({
			id: this.stepId++,
			description: `基本mod計算：${a} mod ${m} を計算`,
			array: [],
			operation: "基本mod計算",
			variables: {
				dividend: a,
				divisor: m,
				definition: "a mod m = a - (floor(a/m) × m)",
			},
		});

		const quotient = Math.floor(a / m);
		const remainder = a - quotient * m;

		this.steps.push({
			id: this.stepId++,
			description: `商の計算：floor(${a}/${m}) = ${quotient}`,
			array: [],
			operation: "商計算",
			variables: {
				calculation: `floor(${a}/${m})`,
				quotient: quotient,
				explanation: "除算の整数部分（商）を求める",
			},
		});

		this.steps.push({
			id: this.stepId++,
			description: `余りの計算：${a} - (${quotient} × ${m}) = ${remainder}`,
			array: [],
			operation: "余り計算",
			variables: {
				formula: `${a} - (${quotient} × ${m})`,
				calculation: `${a} - ${quotient * m}`,
				remainder: remainder,
				verification: `${quotient} × ${m} + ${remainder} = ${quotient * m + remainder} = ${a}`,
			},
		});

		return remainder;
	}

	/**
	 * 高速べき乗計算（modular exponentiation）を実行
	 */
	private performModularExponentiation(
		a: number,
		b: number,
		m: number,
	): number {
		this.steps.push({
			id: this.stepId++,
			description: `高速べき乗計算：${a}^${b} mod ${m} を効率的に計算`,
			array: [],
			operation: "べき乗mod開始",
			variables: {
				base: a,
				exponent: b,
				modulus: m,
				method: "二進法による高速べき乗",
				complexity: "O(log b)",
				naiveComplexity: `ナイーブ法：O(b) = O(${b})回の乗算`,
			},
		});

		if (b === 0) {
			this.steps.push({
				id: this.stepId++,
				description: `${a}^0 = 1（任意の数の0乗は1）`,
				array: [],
				operation: "特別ケース",
				variables: {
					result: 1,
					explanation: "数学的定義により、0乗は常に1",
				},
			});
			return 1;
		}

		let result = 1;
		let base = a % m;
		let exp = b;

		this.steps.push({
			id: this.stepId++,
			description: `初期化：result = 1, base = ${a} mod ${m} = ${base}`,
			array: [],
			operation: "初期化",
			variables: {
				result: result,
				base: base,
				exponent: exp,
				binaryExp: exp.toString(2),
			},
		});

		while (exp > 0) {
			if (exp % 2 === 1) {
				// 指数が奇数の場合
				result = (result * base) % m;
				this.steps.push({
					id: this.stepId++,
					description: `指数が奇数：result = (result × base) mod ${m} = ${result}`,
					array: [],
					operation: "奇数処理",
					variables: {
						exponentBit: "1",
						beforeResult:
							Math.floor((result * base) / m) !== 0
								? `(${Math.floor(result / base)} × ${base}) mod ${m}`
								: `${Math.floor(result / base)} × ${base}`,
						afterResult: result,
						explanation: "指数の最下位ビットが1の時、現在の基数を結果に乗算",
					},
				});
			} else {
				this.steps.push({
					id: this.stepId++,
					description: "指数が偶数：基数のみ更新",
					array: [],
					operation: "偶数処理",
					variables: {
						exponentBit: "0",
						explanation: "指数の最下位ビットが0の時、結果は変更せず",
					},
				});
			}

			base = (base * base) % m;
			exp = Math.floor(exp / 2);

			if (exp > 0) {
				this.steps.push({
					id: this.stepId++,
					description: `基数を二乗：base = base² mod ${m} = ${base}, 指数を半分：${exp}`,
					array: [],
					operation: "基数・指数更新",
					variables: {
						newBase: base,
						newExponent: exp,
						binaryExp: exp.toString(2),
						explanation: "基数を二乗し、指数を半分にして次の反復へ",
					},
				});
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `高速べき乗完了：${a}^${b} mod ${m} = ${result}`,
			array: [],
			operation: "べき乗完了",
			variables: {
				finalResult: result,
				efficiency: `O(log ${b}) = O(${Math.ceil(Math.log2(b + 1))})回の反復`,
				verification: `${a}^${b} mod ${m} = ${result}`,
			},
		});

		return result;
	}

	/**
	 * モジュラ逆元を計算（拡張ユークリッドの互除法）
	 */
	private performModularInverse(a: number, m: number): number {
		this.steps.push({
			id: this.stepId++,
			description: `モジュラ逆元計算：${a}の${m}を法とする逆元を求める`,
			array: [],
			operation: "逆元計算開始",
			variables: {
				target: a,
				modulus: m,
				definition: `${a} × x ≡ 1 (mod ${m}) となるxを求める`,
				method: "拡張ユークリッドの互除法",
				condition: `gcd(${a}, ${m}) = 1（互いに素）`,
			},
		});

		const extGcdResult = this.extendedGcd(a, m);
		const inverse = ((extGcdResult.x % m) + m) % m;

		this.steps.push({
			id: this.stepId++,
			description: `逆元発見：${a} × ${inverse} ≡ 1 (mod ${m})`,
			array: [],
			operation: "逆元確定",
			variables: {
				inverse: inverse,
				verification: `${a} × ${inverse} mod ${m} = ${(a * inverse) % m}`,
				uniqueness: `0 ≤ x < ${m} の範囲で唯一の解`,
			},
		});

		return inverse;
	}

	/**
	 * mod演算の性質を実証
	 */
	private demonstrateModProperties(a: number, b: number, m: number): number {
		this.steps.push({
			id: this.stepId++,
			description: `mod演算の性質実証：${a}と${b}を使って法${m}での性質を確認`,
			array: [],
			operation: "性質実証開始",
			variables: {
				a: a,
				b: b,
				m: m,
				properties: "加法・乗法・分配法則の成立確認",
			},
		});

		// 加法の性質
		const addMod = ((a % m) + (b % m)) % m;
		const directAddMod = (a + b) % m;

		this.steps.push({
			id: this.stepId++,
			description: "加法の性質：(a + b) mod m = ((a mod m) + (b mod m)) mod m",
			array: [],
			operation: "加法性質",
			variables: {
				leftSide: `(${a} + ${b}) mod ${m} = ${directAddMod}`,
				rightSide: `((${a} mod ${m}) + (${b} mod ${m})) mod ${m} = ${addMod}`,
				equal: addMod === directAddMod,
				explanation: "mod演算は加法に対して分配的",
			},
		});

		// 乗法の性質
		const mulMod = ((a % m) * (b % m)) % m;
		const directMulMod = (a * b) % m;

		this.steps.push({
			id: this.stepId++,
			description: "乗法の性質：(a × b) mod m = ((a mod m) × (b mod m)) mod m",
			array: [],
			operation: "乗法性質",
			variables: {
				leftSide: `(${a} × ${b}) mod ${m} = ${directMulMod}`,
				rightSide: `((${a} mod ${m}) × (${b} mod ${m})) mod ${m} = ${mulMod}`,
				equal: mulMod === directMulMod,
				explanation: "mod演算は乗法に対しても分配的",
			},
		});

		return addMod; // 加法結果を代表として返す
	}

	/**
	 * 拡張ユークリッドの互除法
	 */
	private extendedGcd(
		a: number,
		b: number,
	): { gcd: number; x: number; y: number } {
		if (b === 0) {
			return { gcd: a, x: 1, y: 0 };
		}

		const result = this.extendedGcd(b, a % b);
		const x = result.y;
		const y = result.x - Math.floor(a / b) * result.y;

		return { gcd: result.gcd, x: x, y: y };
	}

	/**
	 * 最大公約数を計算
	 */
	private gcd(x: number, y: number): number {
		let a = x;
		let b = y;
		while (b !== 0) {
			const temp = b;
			b = a % b;
			a = temp;
		}
		return a;
	}

	/**
	 * 操作の説明を取得
	 */
	private getOperationDescription(
		operation: ModOperation,
		a: number,
		b?: number,
		m?: number,
	): string {
		switch (operation) {
			case "basic":
				return `基本mod計算 ${a} mod ${m}`;
			case "power":
				return `高速べき乗 ${a}^${b} mod ${m}`;
			case "inverse":
				return `モジュラ逆元 ${a}^(-1) mod ${m}`;
			case "properties":
				return `mod演算の性質確認（a=${a}, b=${b}, m=${m}）`;
			default:
				return "mod計算";
		}
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getTimeComplexity(operation: ModOperation): string {
		switch (operation) {
			case "basic":
				return "O(1)";
			case "power":
				return "O(log n)";
			case "inverse":
				return "O(log n)";
			case "properties":
				return "O(1)";
			default:
				return "O(1)";
		}
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				a: 17,
				b: 5,
				m: 13,
				operation: "basic",
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
mod計算（剰余演算）は、数学とコンピュータサイエンスの基盤となる重要な演算です。特に暗号学、ハッシュ関数、数論アルゴリズムにおいて中核的な役割を果たしています。

【ポイント】**基本的な定義**
- a mod m = a を m で割った余り
- 0 ≤ (a mod m) < m の範囲の値
- a = q×m + r の形で表現（q:商、r:余り）

【解析】**重要な性質**
- 加法: (a + b) mod m = ((a mod m) + (b mod m)) mod m
- 乗法: (a × b) mod m = ((a mod m) × (b mod m)) mod m
- 分配法則: (a × (b + c)) mod m = ((a × b) + (a × c)) mod m

【計算量】**高速べき乗計算**
- a^n mod m を効率的に計算
- 時間計算量: O(log n)（ナイーブ法はO(n)）
- 二進法による指数分解を活用

【詳細】**モジュラ逆元**
- a × x ≡ 1 (mod m) となる x を求める
- gcd(a, m) = 1 の条件が必要（互いに素）
- 拡張ユークリッドの互除法で計算

 **実用的な応用**
- RSA暗号での鍵生成と暗号化
- ハッシュ関数の設計
- 分散システムでの一意ID生成
- ランダム数生成アルゴリズム
- 競技プログラミングでの大数計算

【ヒント】**学習価値**
- 数論の基礎概念
- 効率的アルゴリズム設計の考え方
- 暗号学への入門
- 数学とプログラミングの融合

【数値】**計算例**
- 17 mod 5 = 2（17 = 3×5 + 2）
- 3^5 mod 7 = 5（243 mod 7 = 5）
- 3の7を法とする逆元は5（3×5 = 15 ≡ 1 (mod 7)）

**重要なポイント**
- 負数のmod演算は注意が必要
- 大きな数の計算では overflow に注意
- 暗号学的応用では法の選び方が重要
- 効率的な実装が実用性を左右
		`.trim();
	}

	/**
	 * 推奨する入力例を取得
	 */
	static getRecommendedInputs(): {
		a: number;
		b?: number;
		m: number;
		operation: ModOperation;
		description: string;
		expectedResult: number;
	}[] {
		return [
			{
				a: 17,
				m: 5,
				operation: "basic",
				description: "基本例：17 mod 5",
				expectedResult: 2,
			},
			{
				a: 3,
				b: 5,
				m: 7,
				operation: "power",
				description: "べき乗例：3^5 mod 7",
				expectedResult: 5,
			},
			{
				a: 3,
				m: 7,
				operation: "inverse",
				description: "逆元例：3の逆元 mod 7",
				expectedResult: 5,
			},
			{
				a: 15,
				b: 8,
				m: 11,
				operation: "properties",
				description: "性質確認：mod演算の法則",
				expectedResult: 1, // (15 + 8) mod 11 の例
			},
			{
				a: 2,
				b: 10,
				m: 1000,
				operation: "power",
				description: "大きなべき乗：2^10 mod 1000",
				expectedResult: 24,
			},
			{
				a: 123,
				m: 456,
				operation: "basic",
				description: "大きな数：123 mod 456",
				expectedResult: 123,
			},
		];
	}

	/**
	 * 指定したmod計算を解く（検証用）
	 * @param a 被演算数
	 * @param b 指数（べき乗の場合）
	 * @param m 法
	 * @param operation 操作種別
	 * @returns 計算結果
	 */
	static solve(
		a: number,
		b: number | undefined,
		m: number,
		operation: ModOperation,
	): number {
		switch (operation) {
			case "basic":
				return a % m;
			case "power":
				if (b === undefined) throw new Error("べき乗計算には指数bが必要です");
				return ModBasicAlgorithm.fastPower(a, b, m);
			case "inverse":
				return ModBasicAlgorithm.modularInverse(a, m);
			case "properties":
				if (b === undefined) throw new Error("性質確認には第二数bが必要です");
				return (a + b) % m; // 加法の結果を代表として返す
			default:
				throw new Error(`未対応の操作: ${operation}`);
		}
	}

	/**
	 * 高速べき乗の静的実装
	 */
	private static fastPower(base: number, exp: number, mod: number): number {
		let result = 1;
		let currentBase = base % mod;
		let currentExp = exp;
		while (currentExp > 0) {
			if (currentExp % 2 === 1) {
				result = (result * currentBase) % mod;
			}
			currentExp = Math.floor(currentExp / 2);
			currentBase = (currentBase * currentBase) % mod;
		}
		return result;
	}

	/**
	 * モジュラ逆元の静的実装
	 */
	private static modularInverse(a: number, m: number): number {
		const extGcd = (
			a: number,
			b: number,
		): { gcd: number; x: number; y: number } => {
			if (b === 0) return { gcd: a, x: 1, y: 0 };
			const result = extGcd(b, a % b);
			return {
				gcd: result.gcd,
				x: result.y,
				y: result.x - Math.floor(a / b) * result.y,
			};
		};

		const result = extGcd(a, m);
		if (result.gcd !== 1) {
			throw new Error("モジュラ逆元が存在しません（互いに素でない）");
		}
		return ((result.x % m) + m) % m;
	}
}
