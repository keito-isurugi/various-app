/**
 * src/utils/algorithms/gcd-euclidean.ts
 *
 * ユークリッドの互除法による最大公約数（GCD）アルゴリズムの実装
 * 二つの整数の最大公約数を効率的に求める古典的なアルゴリズムをステップバイステップで可視化
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * ユークリッドの互除法による最大公約数アルゴリズムクラス
 *
 * 二つの整数 a, b の最大公約数を求める効率的なアルゴリズム
 * 時間計算量: O(log(min(a, b)))
 * 空間計算量: O(1)
 */
export class GcdEuclideanAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "gcd-euclidean",
		name: "最大公約数（ユークリッドの互除法）",
		description:
			"ユークリッドの互除法を使って二つの整数の最大公約数を効率的に求める古典的なアルゴリズム",
		category: "other",
		timeComplexity: {
			best: "O(1)", // a % b = 0 の場合
			average: "O(log(min(a, b)))",
			worst: "O(log(min(a, b)))",
		},
		difficulty: 2, // 中級（数学的理解が必要）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;

	/**
	 * ユークリッドの互除法を実行
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

		if (a === 0 && b === 0) {
			throw new Error("両方の数値が0の場合、最大公約数は定義されません");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 入力値の正規化（a >= b になるよう調整）
		let numA = Math.max(a, b);
		let numB = Math.min(a, b);
		const originalA = a;
		const originalB = b;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `最大公約数を求める: gcd(${originalA}, ${originalB})`,
			array: [], // 配列は使用しないが、可視化のため空配列
			operation: "初期化",
			variables: {
				originalA: originalA,
				originalB: originalB,
				currentA: numA,
				currentB: numB,
				algorithm: "ユークリッドの互除法",
				principle: "gcd(a, b) = gcd(b, a mod b)",
			},
		});

		// 正規化が発生した場合のステップ
		if (numA !== a || numB !== b) {
			this.steps.push({
				id: this.stepId++,
				description: `値を正規化: a=${numA}, b=${numB} (a ≥ b になるよう調整)`,
				array: [],
				operation: "正規化",
				variables: {
					beforeA: a,
					beforeB: b,
					afterA: numA,
					afterB: numB,
					reason: "大きい数を最初に配置して計算を効率化",
				},
			});
		}

		// 特殊ケースの処理
		if (numB === 0) {
			this.steps.push({
				id: this.stepId++,
				description: `特殊ケース: b = 0 のため、gcd(${numA}, 0) = ${numA}`,
				array: [],
				operation: "特殊ケース",
				variables: {
					result: numA,
					rule: "gcd(a, 0) = a",
					explanation: "0でない数と0の最大公約数は、その数自身",
				},
			});

			return {
				success: true,
				result: numA,
				steps: this.steps,
				executionSteps: this.steps,
				timeComplexity: this.info.timeComplexity.best,
			};
		}

		// ユークリッドの互除法の実行
		let iterationCount = 0;
		while (numB !== 0) {
			iterationCount++;
			const quotient = Math.floor(numA / numB);
			const remainder = numA % numB;

			this.steps.push({
				id: this.stepId++,
				description: `ステップ${iterationCount}: ${numA} ÷ ${numB} = ${quotient} あまり ${remainder}`,
				array: [],
				operation: "除算",
				variables: {
					iteration: iterationCount,
					dividend: numA, // 被除数
					divisor: numB, // 除数
					quotient: quotient, // 商
					remainder: remainder, // 余り
					formula: `${numA} = ${numB} × ${quotient} + ${remainder}`,
				},
			});

			// gcd(a, b) = gcd(b, remainder) の説明
			this.steps.push({
				id: this.stepId++,
				description: `置き換え: gcd(${numA}, ${numB}) = gcd(${numB}, ${remainder})`,
				array: [],
				operation: "置き換え",
				variables: {
					beforeA: numA,
					beforeB: numB,
					afterA: numB,
					afterB: remainder,
					principle: "ユークリッドの互除法の核心原理",
					explanation: "最大公約数は余りとの関係で保たれる",
				},
			});

			// 値の更新
			numA = numB;
			numB = remainder;

			// 収束チェック
			if (numB === 0) {
				this.steps.push({
					id: this.stepId++,
					description: `🎉 余りが0になりました: gcd(${originalA}, ${originalB}) = ${numA}`,
					array: [],
					operation: "完了",
					variables: {
						finalResult: numA,
						totalIterations: iterationCount,
						originalA: originalA,
						originalB: originalB,
						explanation: "余りが0になった時の除数が最大公約数",
					},
				});
			} else {
				this.steps.push({
					id: this.stepId++,
					description: `継続: 次は gcd(${numA}, ${numB}) を計算`,
					array: [],
					operation: "継続",
					variables: {
						currentA: numA,
						currentB: numB,
						remainingSteps: "余りが0になるまで繰り返し",
					},
				});
			}
		}

		// 計算量の解説
		this.steps.push({
			id: this.stepId++,
			description: `計算完了: ${iterationCount}回の反復で解を発見`,
			array: [],
			operation: "分析",
			variables: {
				result: numA,
				iterations: iterationCount,
				timeComplexity: "O(log(min(a, b)))",
				efficiency:
					iterationCount <= Math.log2(Math.min(originalA, originalB)) * 5
						? "効率的"
						: "標準的",
				note: "ユークリッドの互除法は非常に効率的なアルゴリズム",
			},
		});

		return {
			success: true,
			result: numA,
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
			parameters: { a: 48, b: 18 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
最大公約数（Greatest Common Divisor, GCD）をユークリッドの互除法で求めるアルゴリズムです。

🏛️ **歴史的背景**
- 紀元前300年頃、古代ギリシャの数学者ユークリッドが考案
- 現存する最古のアルゴリズムの一つ
- 2000年以上経った現在でも最も効率的な手法

📐 **基本原理**
- gcd(a, b) = gcd(b, a mod b)
- 二つの数の最大公約数は、小さい数と大きい数を小さい数で割った余りの最大公約数と等しい
- 余りが0になったとき、その時の除数が最大公約数

🔢 **アルゴリズムの流れ**
1. 二つの数 a, b を用意（a ≥ b とする）
2. a を b で割り、商 q と余り r を求める（a = b × q + r）
3. gcd(a, b) = gcd(b, r) として問題を縮小
4. 余り r が 0 になるまで手順2-3を繰り返す
5. 余りが0になったとき、その時の除数が答え

⚡ **計算量の特徴**
- 時間計算量: O(log(min(a, b)))
- 空間計算量: O(1)
- フィボナッチ数列が最悪ケース（最も多くの反復が必要）

🎯 **実世界での応用**
- 分数の約分（通分の逆操作）
- 暗号学（RSA暗号の鍵生成）
- コンピュータグラフィックス（ピクセル比率の計算）
- 音楽理論（和音の周期計算）
- 数論・整数論の基礎

💡 **学習価値**
- 再帰的思考の理解
- 数学的証明の基礎
- 効率的なアルゴリズム設計の例
- 古典と現代を結ぶ普遍的な知識

🧮 **実装のポイント**
- 入力値の検証（負数、非整数の処理）
- オーバーフローの回避
- 特殊ケース（0, 1との組み合わせ）の適切な処理
		`.trim();
	}

	/**
	 * 推奨する入力例を取得
	 */
	static getRecommendedInputs(): {
		a: number;
		b: number;
		description: string;
		expectedGcd: number;
	}[] {
		return [
			{
				a: 48,
				b: 18,
				description: "基本例：中程度の数値",
				expectedGcd: 6,
			},
			{
				a: 17,
				b: 13,
				description: "互いに素な数（gcd = 1）",
				expectedGcd: 1,
			},
			{
				a: 100,
				b: 25,
				description: "一方が他方の倍数",
				expectedGcd: 25,
			},
			{
				a: 144,
				b: 89,
				description: "フィボナッチ数（最悪ケース）",
				expectedGcd: 1,
			},
			{
				a: 1071,
				b: 462,
				description: "大きな数値での効率性確認",
				expectedGcd: 21,
			},
			{
				a: 15,
				b: 0,
				description: "特殊ケース：片方が0",
				expectedGcd: 15,
			},
		];
	}
}
