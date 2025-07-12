/**
 * src/utils/algorithms/factorial-recursive.ts
 *
 * 階乗の計算（再帰）アルゴリズムの実装
 * 教育目的でステップバイステップの再帰呼び出しをサポート
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 再帰呼び出しの詳細情報
 */
interface FactorialCall {
	n: number;
	depth: number;
	callId: string;
	parentCallId?: string;
	result?: number;
	isComplete: boolean;
}

/**
 * 階乗の計算（再帰）アルゴリズムクラス
 *
 * 単純な線形再帰による階乗計算
 * 時間計算量: O(n)
 * 空間計算量: O(n)（再帰の深さ）
 */
export class FactorialRecursiveAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "factorial-recursive",
		name: "階乗の計算（再帰）",
		description:
			"再帰関数を使用した階乗の計算。線形再帰構造で再帰アルゴリズムの基本概念を学習",
		category: "other",
		timeComplexity: {
			best: "O(n)", // 常に線形
			average: "O(n)", // 常に線形
			worst: "O(n)", // 常に線形
		},
		difficulty: 2, // 初級〜中級（フィボナッチより簡単）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private callStack: FactorialCall[] = [];
	private callCounter = 0;
	private maxDepth = 0;
	private totalCalls = 0;

	/**
	 * 階乗の計算（再帰）を実行
	 * @param input n! を求める
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証とnの取得
		let n: number;
		if (input.array && input.array.length > 0) {
			n = input.array[0];
		} else if (input.target !== undefined) {
			n = input.target;
		} else if (input.parameters?.n !== undefined) {
			n = input.parameters.n;
		} else {
			throw new Error("階乗の計算対象（n）が指定されていません");
		}

		// 入力値の検証
		if (!Number.isInteger(n) || n < 0) {
			throw new Error("nは0以上の整数である必要があります");
		}

		if (n > 20) {
			throw new Error(
				"教育目的のため、nは20以下に制限されています（数値オーバーフローとスタック使用量のため）",
			);
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.callStack = [];
		this.callCounter = 0;
		this.maxDepth = 0;
		this.totalCalls = 0;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `階乗の計算（再帰）開始：${n}! を計算します`,
			array: [], // 階乗計算では配列は使用しない
			operation: "初期化",
			variables: {
				n: n,
				definition: "n! = n × (n-1)!, 0! = 1",
				expectedResult:
					n <= 10 ? this.calculateFactorialDirect(n) : "計算結果をお楽しみに",
			},
		});

		// 階乗の再帰計算を実行
		const result = this.factorial(n);

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: `🎉 計算完了！${n}! = ${result}`,
			array: [],
			operation: "完了",
			variables: {
				n: n,
				result: result,
				totalCalls: this.totalCalls,
				maxDepth: this.maxDepth,
				efficiency: `${this.totalCalls}回の関数呼び出し、最大再帰深度${this.maxDepth}`,
				timeComplexity: this.info.timeComplexity.average,
				note: n > 15 ? "大きな値では数値の精度に注意が必要です" : undefined,
			},
		});

		return {
			success: true,
			result: result,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
		};
	}

	/**
	 * 階乗の再帰計算（可視化付き）
	 * @param n 計算する階乗の値
	 * @param depth 現在の再帰の深さ（デフォルト: 0）
	 * @param parentCallId 親の呼び出しID（デフォルト: undefined）
	 * @returns 階乗の値
	 */
	private factorial(n: number, depth = 0, parentCallId?: string): number {
		// 再帰呼び出し情報を記録
		const callId = `call_${this.callCounter++}`;
		this.totalCalls++;
		this.maxDepth = Math.max(this.maxDepth, depth);

		const currentCall: FactorialCall = {
			n: n,
			depth: depth,
			callId: callId,
			parentCallId: parentCallId,
			isComplete: false,
		};

		// 関数呼び出し開始のステップ
		this.steps.push({
			id: this.stepId++,
			description: `factorial(${n}) の計算開始（深度: ${depth}）`,
			array: [],
			operation: "関数呼び出し",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				parentCallId: parentCallId || "なし",
				callStack: this.callStack
					.map((call) => `factorial(${call.n})`)
					.join(" → "),
			},
		});

		// コールスタックに追加
		this.callStack.push(currentCall);

		// ベースケースの確認
		if (n <= 1) {
			const result = 1;
			currentCall.result = result;
			currentCall.isComplete = true;

			this.steps.push({
				id: this.stepId++,
				description: `✅ ベースケース：${n}! = ${result}（定義による）`,
				array: [],
				operation: "ベースケース",
				variables: {
					n: n,
					result: result,
					depth: depth,
					callId: callId,
					reason: n === 0 ? "0! = 1 by definition" : "1! = 1 by definition",
				},
			});

			// コールスタックから削除
			this.callStack.pop();

			this.steps.push({
				id: this.stepId++,
				description: `factorial(${n}) = ${result} を返す（深度: ${depth}）`,
				array: [],
				operation: "戻り値",
				variables: {
					n: n,
					result: result,
					depth: depth,
					callId: callId,
					returning: true,
				},
			});

			return result;
		}

		// 再帰ケース：n! = n × (n-1)!
		this.steps.push({
			id: this.stepId++,
			description: `再帰ケース：${n}! = ${n} × ${n - 1}! を計算`,
			array: [],
			operation: "再帰分解",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				recursiveFormula: `${n}! = ${n} × ${n - 1}!`,
				nextCall: `factorial(${n - 1})`,
			},
		});

		// (n-1)!の計算
		this.steps.push({
			id: this.stepId++,
			description: `factorial(${n - 1}) の計算を開始`,
			array: [],
			operation: "再帰呼び出し開始",
			variables: {
				n: n,
				depth: depth,
				calculating: `factorial(${n - 1})`,
				purpose: `${n}! の計算のため`,
			},
		});

		const factorialNMinus1 = this.factorial(n - 1, depth + 1, callId);

		this.steps.push({
			id: this.stepId++,
			description: `factorial(${n - 1}) = ${factorialNMinus1} が完了`,
			array: [],
			operation: "再帰呼び出し完了",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				factorialNMinus1: factorialNMinus1,
				calculated: `${n - 1}! = ${factorialNMinus1}`,
			},
		});

		// 結果の計算
		const result = n * factorialNMinus1;
		currentCall.result = result;
		currentCall.isComplete = true;

		this.steps.push({
			id: this.stepId++,
			description: `${n}! = ${n} × ${factorialNMinus1} = ${result} を計算`,
			array: [],
			operation: "乗算計算",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				factor: n,
				factorialNMinus1: factorialNMinus1,
				result: result,
				calculation: `${n} × ${factorialNMinus1} = ${result}`,
			},
		});

		// コールスタックから削除
		this.callStack.pop();

		this.steps.push({
			id: this.stepId++,
			description: `factorial(${n}) = ${result} を返す（深度: ${depth}）`,
			array: [],
			operation: "戻り値",
			variables: {
				n: n,
				result: result,
				depth: depth,
				callId: callId,
				returning: true,
				completedCalculation: `${n}! = ${result}`,
			},
		});

		return result;
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [], // 階乗計算では配列は使用しない
			target: 5, // 5! を計算
			parameters: { n: 5 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
階乗の計算（再帰）は、線形再帰アルゴリズムの代表例です。

🔢 **階乗の定義**
- 0! = 1, 1! = 1 （ベースケース）
- n! = n × (n-1)! （n ≥ 2）
- 例: 5! = 5 × 4 × 3 × 2 × 1 = 120

🔄 **線形再帰構造**
- 単純な再帰関係：各ステップで1つの再帰呼び出し
- フィボナッチ数列より理解しやすい構造
- 問題サイズが1ずつ減少

📚 **実行メカニズム**
- コールスタックに関数呼び出しが線形に積まれる
- ベースケースから逆順に結果を計算
- メモリ使用量は再帰の深さに比例

⏱️ **効率的な計算量**
- 時間計算量: O(n) - 線形時間
- 空間計算量: O(n) - 再帰の深さ
- フィボナッチのO(2^n)より格段に効率的

🎯 **学習価値**
- 再帰プログラミングの基礎
- 数学的定義の直接的な実装
- スタックとメモリ管理の理解
- より複雑な再帰アルゴリズムへの足がかり

⚠️ **実用的な注意点**
- 20!以上では数値オーバーフローのリスク
- 大きなnではスタックオーバーフローの可能性
- 実用面では反復実装の方が効率的
		`.trim();
	}

	/**
	 * 指定した値の階乗を直接計算（検証用）
	 * @param n 階乗を計算する値
	 * @returns 階乗の値
	 */
	private calculateFactorialDirect(n: number): number {
		if (n <= 1) return 1;
		return n * this.calculateFactorialDirect(n - 1);
	}

	/**
	 * 指定した値の階乗を反復的に計算（比較用）
	 * @param n 階乗を計算する値
	 * @returns 階乗の値
	 */
	static calculateFactorialIterative(n: number): number {
		if (n < 0) throw new Error("階乗は負数に対して定義されていません");
		let result = 1;
		for (let i = 1; i <= n; i++) {
			result *= i;
		}
		return result;
	}

	/**
	 * 階乗の値を指定個数分生成
	 * @param count 生成する個数
	 * @returns 階乗の値の配列
	 */
	static generateFactorialSequence(count: number): number[] {
		const sequence: number[] = [];
		for (let i = 0; i < count; i++) {
			sequence.push(FactorialRecursiveAlgorithm.calculateFactorialIterative(i));
		}
		return sequence;
	}

	/**
	 * 教育目的の適切なnの値を提案
	 * @returns 推奨値の配列
	 */
	static getRecommendedValues(): {
		n: number;
		description: string;
		result: number;
	}[] {
		return [
			{ n: 0, description: "ベースケース", result: 1 },
			{ n: 1, description: "ベースケース", result: 1 },
			{ n: 3, description: "基本的な再帰", result: 6 },
			{ n: 4, description: "再帰構造の理解", result: 24 },
			{ n: 5, description: "実用的なサイズ", result: 120 },
			{ n: 6, description: "中程度の計算", result: 720 },
			{ n: 7, description: "大きめの値", result: 5040 },
			{ n: 10, description: "十分大きな値", result: 3628800 },
			{ n: 12, description: "精度の確認", result: 479001600 },
			{ n: 15, description: "大きな値での実行", result: 1307674368000 },
		];
	}

	/**
	 * 指定したnでの予想計算時間を算出
	 * @param n 階乗を計算する値
	 * @returns 予想実行時間の説明
	 */
	static estimateExecutionTime(n: number): string {
		if (n <= 5) return "瞬時";
		if (n <= 10) return "< 1ms";
		if (n <= 15) return "< 10ms";
		if (n <= 20) return "< 100ms";
		return "大きな値では時間がかかります";
	}

	/**
	 * 階乗の近似値をスターリングの公式で計算
	 * @param n 階乗を計算する値
	 * @returns スターリングの公式による近似値
	 */
	static stirlingApproximation(n: number): number {
		if (n <= 1) return 1;
		// スターリングの公式: n! ≈ √(2πn) * (n/e)^n
		return Math.sqrt(2 * Math.PI * n) * (n / Math.E) ** n;
	}
}
