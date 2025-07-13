/**
 * src/utils/algorithms/lcm-basic.ts
 *
 * 最小公倍数（LCM: Least Common Multiple）アルゴリズムの実装
 * GCDを利用して二つの整数の最小公倍数を効率的に求めるアルゴリズムをステップバイステップで可視化
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";
import { GcdEuclideanAlgorithm } from "./gcd-euclidean";

/**
 * 最小公倍数（LCM）アルゴリズムクラス
 *
 * 二つの整数 a, b の最小公倍数を GCD を利用して効率的に求める
 * 数学的関係: LCM(a, b) = |a × b| / GCD(a, b)
 * 時間計算量: O(log(min(a, b))) - GCDに依存
 * 空間計算量: O(1)
 */
export class LcmBasicAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "lcm-basic",
		name: "最小公倍数（LCM）",
		description:
			"最大公約数（GCD）を利用して二つの整数の最小公倍数を効率的に求めるアルゴリズム",
		category: "other",
		timeComplexity: {
			best: "O(1)", // a % b = 0 の場合
			average: "O(log(min(a, b)))",
			worst: "O(log(min(a, b)))",
		},
		difficulty: 2, // 中級（GCDの理解が前提）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private gcdAlgorithm: GcdEuclideanAlgorithm;

	constructor() {
		this.gcdAlgorithm = new GcdEuclideanAlgorithm();
	}

	/**
	 * 最小公倍数を計算
	 * @param input 二つの整数 a, b
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証
		const a = input.parameters?.a as number;
		const b = input.parameters?.b as number;

		if (a === undefined || b === undefined) {
			throw new Error("二つの整数a, bが必要です");
		}

		if (!Number.isInteger(a) || !Number.isInteger(b)) {
			throw new Error("整数のみサポートされています");
		}

		if (a < 0 || b < 0) {
			throw new Error("正の整数のみサポートされています");
		}

		if (a === 0 || b === 0) {
			throw new Error("0との最小公倍数は定義されません（無限大）");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;

		const originalA = a;
		const originalB = b;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `最小公倍数を求める: lcm(${originalA}, ${originalB})`,
			array: [], // 配列は使用しないが、可視化のため空配列
			operation: "初期化",
			variables: {
				originalA: originalA,
				originalB: originalB,
				algorithm: "LCM = |a × b| / GCD(a, b)",
				principle: "最大公約数を利用した効率的な計算",
				note: "直接計算より遥かに高速",
			},
		});

		// 数学的関係の説明
		this.steps.push({
			id: this.stepId++,
			description: "数学的関係: LCM(a, b) × GCD(a, b) = a × b",
			array: [],
			operation: "理論解説",
			variables: {
				relationship: "LCM × GCD = a × b",
				rearranged: "LCM = (a × b) / GCD",
				reason: "互いに補完し合う関係性",
				example: `${originalA} × ${originalB} = LCM(${originalA}, ${originalB}) × GCD(${originalA}, ${originalB})`,
			},
		});

		// Step 1: GCDの計算
		this.steps.push({
			id: this.stepId++,
			description: `ステップ1: GCD(${originalA}, ${originalB}) を計算`,
			array: [],
			operation: "GCD計算開始",
			variables: {
				step: 1,
				task: "最大公約数の計算",
				method: "ユークリッドの互除法",
				why: "LCMの計算に必要",
			},
		});

		// GCDを計算（内部的に実行、詳細ステップは省略）
		const gcdResult = this.gcdAlgorithm.execute({
			parameters: { a: originalA, b: originalB },
		});
		const gcd = gcdResult.result as number;

		this.steps.push({
			id: this.stepId++,
			description: `✅ GCD計算完了: GCD(${originalA}, ${originalB}) = ${gcd}`,
			array: [],
			operation: "GCD計算完了",
			variables: {
				gcdResult: gcd,
				iterations: gcdResult.executionSteps?.length ?? 0,
				efficiency: "O(log(min(a, b)))",
				nextStep: "積の計算",
			},
		});

		// Step 2: 積の計算
		const product = originalA * originalB;
		this.steps.push({
			id: this.stepId++,
			description: `ステップ2: a × b = ${originalA} × ${originalB} = ${product}`,
			array: [],
			operation: "積計算",
			variables: {
				step: 2,
				multiplicand: originalA,
				multiplier: originalB,
				product: product,
				purpose: "LCMの分子を準備",
				warning:
					product > Number.MAX_SAFE_INTEGER ? "オーバーフロー注意" : "計算安全",
			},
		});

		// オーバーフロー警告
		if (product > Number.MAX_SAFE_INTEGER) {
			this.steps.push({
				id: this.stepId++,
				description:
					"⚠️ 警告: 積が大きすぎます。実際の実装では先にGCDで割ることを推奨",
				array: [],
				operation: "オーバーフロー警告",
				variables: {
					product: product,
					maxSafeInteger: Number.MAX_SAFE_INTEGER,
					recommendation: "LCM = (a / GCD) × b の順序で計算",
					reason: "中間結果のオーバーフローを防ぐため",
				},
			});
		}

		// Step 3: 除算によるLCMの計算
		const lcm = Math.floor(product / gcd);
		this.steps.push({
			id: this.stepId++,
			description: `ステップ3: LCM = (a × b) / GCD = ${product} / ${gcd} = ${lcm}`,
			array: [],
			operation: "LCM計算",
			variables: {
				step: 3,
				dividend: product,
				divisor: gcd,
				quotient: lcm,
				formula: `LCM(${originalA}, ${originalB}) = ${lcm}`,
				verification: `${lcm} は ${originalA} と ${originalB} の両方で割り切れる`,
			},
		});

		// 検証ステップ
		this.steps.push({
			id: this.stepId++,
			description: `🔍 検証: ${lcm} ÷ ${originalA} = ${lcm / originalA}, ${lcm} ÷ ${originalB} = ${lcm / originalB}`,
			array: [],
			operation: "検証",
			variables: {
				lcm: lcm,
				divisionA: lcm / originalA,
				divisionB: lcm / originalB,
				isValidA: Number.isInteger(lcm / originalA),
				isValidB: Number.isInteger(lcm / originalB),
				confirmation:
					Number.isInteger(lcm / originalA) && Number.isInteger(lcm / originalB)
						? "✅ 正しい"
						: "❌ エラー",
			},
		});

		// 最小性の確認
		this.steps.push({
			id: this.stepId++,
			description: `✨ 最小性確認: ${lcm} より小さい正の整数で両方を割り切るものは存在しない`,
			array: [],
			operation: "最小性確認",
			variables: {
				lcm: lcm,
				property: "最小公倍数",
				meaning: "共通の倍数の中で最も小さい正の整数",
				alternatives: `${originalA}の倍数: ${originalA}, ${originalA * 2}, ${originalA * 3}...`,
				intersection: "この中で最小の共通倍数",
			},
		});

		// 効率性の分析
		this.steps.push({
			id: this.stepId++,
			description: `🎉 計算完了: LCM(${originalA}, ${originalB}) = ${lcm}`,
			array: [],
			operation: "完了",
			variables: {
				result: lcm,
				originalA: originalA,
				originalB: originalB,
				gcdUsed: gcd,
				efficiency: "GCDを利用することで高速計算",
				timeComplexity: "O(log(min(a, b)))",
				spaceComplexity: "O(1)",
			},
		});

		return {
			success: true,
			result: lcm,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
		};
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: { a: 12, b: 8 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
最小公倍数（Least Common Multiple, LCM）を効率的に求めるアルゴリズムです。

🔢 **基本概念**
- 二つ以上の整数の共通する倍数のうち、最小の正の整数
- 最大公約数（GCD）と密接な関係がある
- 数学的関係: LCM(a, b) × GCD(a, b) = a × b

📐 **アルゴリズムの原理**
- 直接計算: 各数の倍数を列挙して最小共通倍数を見つける（非効率）
- GCD利用: LCM(a, b) = |a × b| / GCD(a, b)（効率的）
- ユークリッドの互除法でGCDを求め、数学的関係を利用

🔄 **計算手順**
1. 入力値 a, b の検証（正の整数）
2. GCD(a, b) をユークリッドの互除法で計算
3. a × b を計算
4. LCM = (a × b) / GCD で最終結果を得る
5. 結果の検証（両方の数で割り切れることを確認）

⚡ **計算量の特徴**
- 時間計算量: O(log(min(a, b))) - GCDの計算に依存
- 空間計算量: O(1) - 定数メモリ
- 直接計算 O(min(a, b)) より大幅に高速

🎯 **実世界での応用**
- 分数の通分（共通分母の計算）
- 周期的な現象の同期（信号処理）
- タスクスケジューリング（周期の調整）
- 音楽理論（リズムパターンの周期）
- プログラミング（配列サイズの調整）

💡 **重要な性質**
- LCM(a, b) ≥ max(a, b)
- GCD(a, b) ≤ min(a, b)
- LCM(a, b) × GCD(a, b) = a × b（基本定理）
- LCM(a, 1) = a, LCM(a, a) = a

🔧 **実装上の注意点**
- オーバーフロー対策: 大きな数では (a / GCD) × b の順序で計算
- 0の扱い: LCM(a, 0) は数学的に未定義（無限大）
- 負数の扱い: 通常は絶対値を使用
- 複数数への拡張: reduce を使って順次計算

🧮 **数学的背景**
- 整数論の基本概念
- 素因数分解との関係
- ベズー等式との関連
- 中国剰余定理への応用
		`.trim();
	}

	/**
	 * 推奨する入力例を取得
	 */
	static getRecommendedInputs(): {
		a: number;
		b: number;
		description: string;
		expectedLcm: number;
		expectedGcd: number;
	}[] {
		return [
			{
				a: 12,
				b: 8,
				description: "基本例：適度な大きさの数値",
				expectedLcm: 24,
				expectedGcd: 4,
			},
			{
				a: 17,
				b: 13,
				description: "互いに素な数（gcd = 1）",
				expectedLcm: 221,
				expectedGcd: 1,
			},
			{
				a: 6,
				b: 4,
				description: "小さな数での基本理解",
				expectedLcm: 12,
				expectedGcd: 2,
			},
			{
				a: 15,
				b: 25,
				description: "共通因数がある場合",
				expectedLcm: 75,
				expectedGcd: 5,
			},
			{
				a: 24,
				b: 36,
				description: "比較的大きな共通因数",
				expectedLcm: 72,
				expectedGcd: 12,
			},
			{
				a: 7,
				b: 21,
				description: "一方が他方の倍数",
				expectedLcm: 21,
				expectedGcd: 7,
			},
		];
	}

	/**
	 * オーバーフロー対策版のLCM計算
	 * 大きな数値でも安全に計算できる実装例
	 */
	static calculateLcmSafe(a: number, b: number): number {
		if (a === 0 || b === 0) {
			throw new Error("0との最小公倍数は定義されません");
		}

		const absA = Math.abs(a);
		const absB = Math.abs(b);

		// GCDを先に計算
		const gcdAlgorithm = new GcdEuclideanAlgorithm();
		const gcdResult = gcdAlgorithm.execute({
			parameters: { a: absA, b: absB },
		});
		const gcd = gcdResult.result as number;

		// オーバーフロー対策: (a / gcd) * b の順序で計算
		return (absA / gcd) * absB;
	}
}
