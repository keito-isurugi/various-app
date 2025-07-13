/**
 * src/utils/algorithms/exponentiation-by-squaring.ts
 *
 * 繰り返し二乗法（Exponentiation by Squaring）アルゴリズムの実装
 * 効率的なべき乗計算を行う分割統治法ベースのアルゴリズム
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 計算モードを表す型
 */
type ExponentiationMode = "basic" | "modular";

/**
 * 繰り返し二乗法の各ステップの状態を表す型
 */
interface ExponentiationStep {
	iteration: number; // 反復回数
	base: number; // 現在の基数
	exponent: number; // 現在の指数
	result: number; // 現在の結果
	binaryExp: string; // 指数の二進表現
	currentBit: string; // 現在処理中のビット
	operation: string; // 実行された操作
	explanation: string; // ステップの説明
	isNew?: boolean; // 新しく処理されたステップかどうか
}

/**
 * 繰り返し二乗法アルゴリズムクラス
 *
 * a^n を効率的に計算する分割統治法アルゴリズム
 * 時間計算量: O(log n)（ナイーブ法はO(n)）
 * 空間計算量: O(log n)（再帰による）または O(1)（反復による）
 */
export class ExponentiationBySquaringAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "exponentiation-by-squaring",
		name: "繰り返し二乗法",
		description:
			"効率的なべき乗計算を行う分割統治法ベースのアルゴリズム。指数を二進法で分解して計算量を劇的に削減",
		category: "divide",
		timeComplexity: {
			best: "O(log n)", // n は指数
			average: "O(log n)",
			worst: "O(log n)",
		},
		difficulty: 3, // 中級（分割統治と二進法の理解が必要）
		spaceComplexity: "O(log n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private exponentiationSteps: ExponentiationStep[] = [];

	/**
	 * 繰り返し二乗法を実行
	 * @param input 基数、指数、モジュラス（オプション）
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証と値の取得
		const base = input.parameters?.base as number;
		const exponent = input.parameters?.exponent as number;
		const modulus = input.parameters?.modulus as number;
		const mode = (input.parameters?.mode as ExponentiationMode) || "basic";

		if (!this.validateInputs(base, exponent, modulus, mode)) {
			throw new Error("有効な入力パラメータが必要です");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.exponentiationSteps = [];

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `繰り返し二乗法開始：${base}^${exponent}${mode === "modular" ? ` mod ${modulus}` : ""} を効率的に計算`,
			array: [],
			operation: "初期化",
			variables: {
				base: base,
				exponent: exponent,
				modulus: mode === "modular" ? modulus : "未使用",
				method: "繰り返し二乗法（分割統治法）",
				binaryExponent: exponent.toString(2),
				naiveComplexity: `ナイーブ法：O(${exponent})回の乗算`,
				optimizedComplexity: `最適化法：O(${Math.ceil(Math.log2(exponent + 1))})回の乗算`,
			},
		});

		let result: number;

		// 計算モードに応じて実行
		if (mode === "modular") {
			result = this.performModularExponentiation(base, exponent, modulus);
		} else {
			result = this.performBasicExponentiation(base, exponent);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: `🎉 繰り返し二乗法完了！${base}^${exponent}${mode === "modular" ? ` mod ${modulus}` : ""} = ${result}`,
			array: [],
			operation: "完了",
			variables: {
				result: result,
				originalProblem: `${base}^${exponent}${mode === "modular" ? ` mod ${modulus}` : ""}`,
				efficiency: `O(log ${exponent}) = O(${Math.ceil(Math.log2(exponent + 1))})回の反復で完了`,
				speedup: `ナイーブ法と比較して約${Math.max(1, Math.floor(exponent / Math.ceil(Math.log2(exponent + 1))))}倍高速`,
				timeComplexity: "O(log n)",
				spaceComplexity: "O(log n)",
			},
		});

		return {
			success: true,
			result: result,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
			summary: {
				result: result,
				base: base,
				exponent: exponent,
				modulus: mode === "modular" ? modulus : undefined,
				iterations: this.exponentiationSteps.length,
				efficiency: Math.ceil(Math.log2(exponent + 1)),
			},
		};
	}

	/**
	 * 入力値の検証
	 */
	private validateInputs(
		base: number,
		exponent: number,
		modulus: number,
		mode: ExponentiationMode,
	): boolean {
		// 基本的な数値チェック
		if (!Number.isInteger(base) || !Number.isInteger(exponent)) {
			throw new Error("基数と指数は整数である必要があります");
		}

		if (exponent < 0) {
			throw new Error("指数は非負整数である必要があります");
		}

		if (base === 0 && exponent === 0) {
			throw new Error("0^0は数学的に定義が曖昧です");
		}

		// 教育目的の制限
		if (exponent > 30) {
			throw new Error("教育目的のため、指数は30以下に制限されています");
		}

		if (Math.abs(base) > 100) {
			throw new Error(
				"教育目的のため、基数は-100から100の範囲に制限されています",
			);
		}

		// モジュラー演算の検証
		if (mode === "modular") {
			if (!Number.isInteger(modulus) || modulus <= 0) {
				throw new Error("モジュラー演算では、法は正の整数である必要があります");
			}
			if (modulus > 1000) {
				throw new Error("教育目的のため、法は1000以下に制限されています");
			}
		}

		return true;
	}

	/**
	 * 基本的な繰り返し二乗法を実行
	 */
	private performBasicExponentiation(base: number, exponent: number): number {
		if (exponent === 0) {
			this.steps.push({
				id: this.stepId++,
				description: `${base}^0 = 1（任意の数の0乗は1）`,
				array: [],
				operation: "特別ケース",
				variables: {
					result: 1,
					explanation: "数学的定義により、0乗は常に1",
				},
			});
			return 1;
		}

		this.steps.push({
			id: this.stepId++,
			description: `二進法による分解：${exponent} = ${exponent.toString(2)}₂`,
			array: [],
			operation: "二進分解",
			variables: {
				decimal: exponent,
				binary: exponent.toString(2),
				explanation: "指数を二進法で表現し、各ビットに対して処理",
				bitLength: exponent.toString(2).length,
			},
		});

		return this.exponentiationBySquaring(base, exponent);
	}

	/**
	 * モジュラー繰り返し二乗法を実行
	 */
	private performModularExponentiation(
		base: number,
		exponent: number,
		modulus: number,
	): number {
		if (exponent === 0) {
			this.steps.push({
				id: this.stepId++,
				description: `${base}^0 mod ${modulus} = 1（任意の数の0乗は1）`,
				array: [],
				operation: "特別ケース",
				variables: {
					result: 1,
					explanation: "数学的定義により、0乗は常に1",
				},
			});
			return 1;
		}

		this.steps.push({
			id: this.stepId++,
			description: `モジュラー演算：${base}^${exponent} mod ${modulus} を計算`,
			array: [],
			operation: "モジュラー初期化",
			variables: {
				base: base,
				exponent: exponent,
				modulus: modulus,
				binaryExponent: exponent.toString(2),
				advantage: "大きな数でもオーバーフローを防止",
			},
		});

		return this.modularExponentiationBySquaring(base, exponent, modulus);
	}

	/**
	 * 繰り返し二乗法の核心実装（基本版）
	 */
	private exponentiationBySquaring(base: number, exponent: number): number {
		let result = 1;
		let currentBase = base;
		let currentExp = exponent;
		let iteration = 0;

		this.steps.push({
			id: this.stepId++,
			description: `繰り返し二乗法開始：result = 1, base = ${base}`,
			array: [],
			operation: "初期設定",
			variables: {
				result: result,
				base: currentBase,
				exponent: currentExp,
				binaryExp: currentExp.toString(2),
			},
		});

		while (currentExp > 0) {
			iteration++;
			const isOdd = currentExp % 2 === 1;
			const currentBit = isOdd ? "1" : "0";

			if (isOdd) {
				result *= currentBase;
				this.steps.push({
					id: this.stepId++,
					description: `指数が奇数：result = result × base = ${result}`,
					array: [],
					operation: "奇数処理",
					variables: {
						iteration: iteration,
						currentBit: currentBit,
						beforeResult: Math.floor(result / currentBase),
						afterResult: result,
						currentBase: currentBase,
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
						iteration: iteration,
						currentBit: currentBit,
						explanation: "指数の最下位ビットが0の時、結果は変更せず",
					},
				});
			}

			currentBase *= currentBase;
			currentExp = Math.floor(currentExp / 2);

			if (currentExp > 0) {
				this.steps.push({
					id: this.stepId++,
					description: `基数を二乗：base = ${Math.sqrt(currentBase)}² = ${currentBase}, 指数を半分：${currentExp}`,
					array: [],
					operation: "基数・指数更新",
					variables: {
						newBase: currentBase,
						newExponent: currentExp,
						binaryExp: currentExp.toString(2),
						explanation: "基数を二乗し、指数を半分にして次の反復へ",
					},
				});
			}

			// 計算が大きくなりすぎる場合の制限
			if (
				result > Number.MAX_SAFE_INTEGER / 2 ||
				currentBase > Number.MAX_SAFE_INTEGER / 2
			) {
				throw new Error(
					"計算結果が大きすぎます。モジュラー演算を使用してください",
				);
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `繰り返し二乗法完了：${base}^${exponent} = ${result}`,
			array: [],
			operation: "計算完了",
			variables: {
				finalResult: result,
				totalIterations: iteration,
				efficiency: `${iteration}回の反復で完了（ナイーブ法は${exponent}回）`,
				speedup: `約${Math.floor(exponent / iteration)}倍高速`,
			},
		});

		return result;
	}

	/**
	 * 繰り返し二乗法の核心実装（モジュラー版）
	 */
	private modularExponentiationBySquaring(
		base: number,
		exponent: number,
		modulus: number,
	): number {
		let result = 1;
		let currentBase = base % modulus;
		let currentExp = exponent;
		let iteration = 0;

		this.steps.push({
			id: this.stepId++,
			description: `初期化：result = 1, base = ${base} mod ${modulus} = ${currentBase}`,
			array: [],
			operation: "モジュラー初期設定",
			variables: {
				result: result,
				base: currentBase,
				exponent: currentExp,
				modulus: modulus,
				binaryExp: currentExp.toString(2),
			},
		});

		while (currentExp > 0) {
			iteration++;
			const isOdd = currentExp % 2 === 1;
			const currentBit = isOdd ? "1" : "0";

			if (isOdd) {
				result = (result * currentBase) % modulus;
				this.steps.push({
					id: this.stepId++,
					description: `指数が奇数：result = (result × base) mod ${modulus} = ${result}`,
					array: [],
					operation: "モジュラー奇数処理",
					variables: {
						iteration: iteration,
						currentBit: currentBit,
						afterResult: result,
						currentBase: currentBase,
						modulus: modulus,
						explanation:
							"指数の最下位ビットが1の時、現在の基数を結果に乗算してmod",
					},
				});
			} else {
				this.steps.push({
					id: this.stepId++,
					description: "指数が偶数：基数のみ更新",
					array: [],
					operation: "モジュラー偶数処理",
					variables: {
						iteration: iteration,
						currentBit: currentBit,
						explanation: "指数の最下位ビットが0の時、結果は変更せず",
					},
				});
			}

			currentBase = (currentBase * currentBase) % modulus;
			currentExp = Math.floor(currentExp / 2);

			if (currentExp > 0) {
				this.steps.push({
					id: this.stepId++,
					description: `基数を二乗：base = base² mod ${modulus} = ${currentBase}, 指数を半分：${currentExp}`,
					array: [],
					operation: "モジュラー基数・指数更新",
					variables: {
						newBase: currentBase,
						newExponent: currentExp,
						modulus: modulus,
						binaryExp: currentExp.toString(2),
						explanation: "基数を二乗してmodを取り、指数を半分にして次の反復へ",
					},
				});
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `モジュラー繰り返し二乗法完了：${base}^${exponent} mod ${modulus} = ${result}`,
			array: [],
			operation: "モジュラー計算完了",
			variables: {
				finalResult: result,
				totalIterations: iteration,
				efficiency: `${iteration}回の反復で完了（ナイーブ法は${exponent}回）`,
				advantage: "大きな数でもオーバーフローなし",
			},
		});

		return result;
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				base: 3,
				exponent: 10,
				mode: "basic",
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
繰り返し二乗法（Exponentiation by Squaring）は、a^n を効率的に計算する分割統治法ベースのアルゴリズムです。指数を二進法で表現し、「二乗して削減」の原理により計算量をO(n)からO(log n)に劇的に削減します。

🎯 **基本原理**
- a^n の計算で、nが偶数なら a^n = (a^(n/2))^2
- nが奇数なら a^n = a × a^(n-1)
- この性質を再帰的に適用して効率化

📊 **分割統治のアプローチ**
- 指数を二進法で表現：n = b_k×2^k + ... + b_1×2 + b_0
- 各ビットに対して「二乗」操作を適用
- ビットが1の位置でのみ基数を結果に乗算

🔄 **反復的実装の流れ**
1. result = 1, base = a, exp = n で初期化
2. exp が奇数なら result *= base
3. base = base^2, exp = exp/2
4. exp > 0 の間、手順2-3を繰り返し

⚡ **計算量の特徴**
- 時間計算量: O(log n) - 指数のビット数に比例
- 空間計算量: O(log n) - 再帰版、O(1) - 反復版
- ナイーブ法のO(n)と比較して指数的改善

🌟 **実用的な応用**
- RSA暗号でのモジュラー冪乗計算
- 離散対数問題と楕円曲線暗号
- 大きな数の高速べき乗計算
- 数学的計算ライブラリの基盤

💡 **学習価値**
- 分割統治法の美しい応用例
- 二進法と効率的アルゴリズムの関係
- 再帰と反復の相互変換
- 暗号学への入門

🔍 **具体例（3^10）**
- ナイーブ法: 3×3×3×3×3×3×3×3×3×3 (9回の乗算)
- 繰り返し二乗法: 10₂ = 1010₂ → 4回の反復で完了
- 計算過程: 3¹ → 3² → 3⁴ → 3⁸ → 3¹⁰

💭 **重要なポイント**
- 指数の二進表現が計算効率を決定
- モジュラー演算により大きな数でも計算可能
- 再帰と反復の両方の実装が可能
- 数学とコンピュータサイエンスの優雅な融合
		`.trim();
	}

	/**
	 * 推奨する入力例を取得
	 */
	static getRecommendedInputs(): {
		base: number;
		exponent: number;
		modulus?: number;
		mode: ExponentiationMode;
		description: string;
		expectedResult: number;
	}[] {
		return [
			{
				base: 3,
				exponent: 10,
				mode: "basic",
				description: "基本例：3^10",
				expectedResult: 59049,
			},
			{
				base: 2,
				exponent: 16,
				mode: "basic",
				description: "2の冪：2^16",
				expectedResult: 65536,
			},
			{
				base: 5,
				exponent: 6,
				mode: "basic",
				description: "小規模例：5^6",
				expectedResult: 15625,
			},
			{
				base: 3,
				exponent: 13,
				modulus: 7,
				mode: "modular",
				description: "モジュラー例：3^13 mod 7",
				expectedResult: 6,
			},
			{
				base: 2,
				exponent: 10,
				modulus: 1000,
				mode: "modular",
				description: "大きなmod：2^10 mod 1000",
				expectedResult: 24,
			},
			{
				base: 7,
				exponent: 8,
				mode: "basic",
				description: "効率確認：7^8",
				expectedResult: 5764801,
			},
		];
	}

	/**
	 * 指定した繰り返し二乗法を解く（検証用）
	 * @param base 基数
	 * @param exponent 指数
	 * @param modulus 法（オプション）
	 * @returns 計算結果
	 */
	static solve(base: number, exponent: number, modulus?: number): number {
		if (exponent === 0) return 1;

		if (modulus) {
			return ExponentiationBySquaringAlgorithm.fastPowerMod(
				base,
				exponent,
				modulus,
			);
		}

		return ExponentiationBySquaringAlgorithm.fastPower(base, exponent);
	}

	/**
	 * 高速べき乗の静的実装（基本版）
	 */
	private static fastPower(base: number, exponent: number): number {
		let result = 1;
		let currentBase = base;
		let currentExp = exponent;

		while (currentExp > 0) {
			if (currentExp % 2 === 1) {
				result *= currentBase;
			}
			currentBase *= currentBase;
			currentExp = Math.floor(currentExp / 2);
		}

		return result;
	}

	/**
	 * 高速べき乗の静的実装（モジュラー版）
	 */
	private static fastPowerMod(
		base: number,
		exponent: number,
		modulus: number,
	): number {
		let result = 1;
		let currentBase = base % modulus;
		let currentExp = exponent;

		while (currentExp > 0) {
			if (currentExp % 2 === 1) {
				result = (result * currentBase) % modulus;
			}
			currentBase = (currentBase * currentBase) % modulus;
			currentExp = Math.floor(currentExp / 2);
		}

		return result;
	}

	/**
	 * 効率性を分析
	 * @param exponent 指数
	 * @returns 効率性の分析結果
	 */
	static analyzeEfficiency(exponent: number): {
		naiveMultiplications: number;
		optimizedMultiplications: number;
		speedup: number;
		binaryRepresentation: string;
	} {
		const naiveMultiplications = exponent;
		const optimizedMultiplications = Math.ceil(Math.log2(exponent + 1));
		const speedup = naiveMultiplications / optimizedMultiplications;
		const binaryRepresentation = exponent.toString(2);

		return {
			naiveMultiplications,
			optimizedMultiplications,
			speedup,
			binaryRepresentation,
		};
	}
}
