/**
 * src/utils/algorithms/fibonacci-recursive.ts
 *
 * フィボナッチ数列（再帰）アルゴリズムの実装
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
interface FibonacciCall {
	n: number;
	depth: number;
	callId: string;
	parentCallId?: string;
	result?: number;
	isComplete: boolean;
}

/**
 * フィボナッチ数列（再帰）アルゴリズムクラス
 *
 * 再帰的な実装による純粋なフィボナッチ数列計算
 * 時間計算量: O(2^n)（指数的）
 * 空間計算量: O(n)（再帰の深さ）
 */
export class FibonacciRecursiveAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "fibonacci-recursive",
		name: "フィボナッチ数列（再帰）",
		description:
			"再帰関数を使用したフィボナッチ数列の計算。再帰アルゴリズムの基本概念と指数的計算量の問題を学習",
		category: "other",
		timeComplexity: {
			best: "O(2^n)", // 常に指数的
			average: "O(2^n)", // 常に指数的
			worst: "O(2^n)", // 常に指数的
		},
		difficulty: 3, // 中級（概念は簡単だが、計算量の理解が重要）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private callStack: FibonacciCall[] = [];
	private callCounter = 0;
	private maxDepth = 0;
	private totalCalls = 0;

	/**
	 * フィボナッチ数列（再帰）を実行
	 * @param input n番目のフィボナッチ数を求める
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
			throw new Error("フィボナッチ数列の計算対象（n）が指定されていません");
		}

		// 入力値の検証
		if (!Number.isInteger(n) || n < 0) {
			throw new Error("nは0以上の整数である必要があります");
		}

		if (n > 25) {
			throw new Error(
				"教育目的のため、nは25以下に制限されています（計算時間とメモリ使用量のため）",
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
			description: `フィボナッチ数列（再帰）開始：F(${n}) を計算します`,
			array: [], // フィボナッチ数列では配列は使用しない
			operation: "初期化",
			variables: {
				n: n,
				definition: "F(n) = F(n-1) + F(n-2), F(0)=0, F(1)=1",
				warning:
					n > 10 ? "n > 10のため実行に時間がかかる可能性があります" : undefined,
			},
		});

		// フィボナッチ数列の再帰計算を実行
		const result = this.fibonacci(n);

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` 計算完了！F(${n}) = ${result}`,
			array: [],
			operation: "完了",
			variables: {
				n: n,
				result: result,
				totalCalls: this.totalCalls,
				maxDepth: this.maxDepth,
				efficiency: `${this.totalCalls}回の関数呼び出し、最大再帰深度${this.maxDepth}`,
				timeComplexity: this.info.timeComplexity.average,
				note:
					this.totalCalls > 100
						? "非効率的な重複計算が多数発生しました"
						: undefined,
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
	 * フィボナッチ数列の再帰計算（可視化付き）
	 * @param n 計算する数列の位置
	 * @param depth 現在の再帰の深さ（デフォルト: 0）
	 * @param parentCallId 親の呼び出しID（デフォルト: undefined）
	 * @returns フィボナッチ数
	 */
	private fibonacci(n: number, depth = 0, parentCallId?: string): number {
		// 再帰呼び出し情報を記録
		const callId = `call_${this.callCounter++}`;
		this.totalCalls++;
		this.maxDepth = Math.max(this.maxDepth, depth);

		const currentCall: FibonacciCall = {
			n: n,
			depth: depth,
			callId: callId,
			parentCallId: parentCallId,
			isComplete: false,
		};

		// 関数呼び出し開始のステップ
		this.steps.push({
			id: this.stepId++,
			description: `F(${n}) の計算開始（深度: ${depth}）`,
			array: [],
			operation: "関数呼び出し",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				parentCallId: parentCallId || "なし",
				callStack: this.callStack.map((call) => `F(${call.n})`).join(" → "),
			},
		});

		// コールスタックに追加
		this.callStack.push(currentCall);

		// ベースケースの確認
		if (n <= 1) {
			const result = n;
			currentCall.result = result;
			currentCall.isComplete = true;

			this.steps.push({
				id: this.stepId++,
				description: `ベースケース：F(${n}) = ${result}（計算不要）`,
				array: [],
				operation: "ベースケース",
				variables: {
					n: n,
					result: result,
					depth: depth,
					callId: callId,
					reason: n === 0 ? "F(0) = 0 by definition" : "F(1) = 1 by definition",
				},
			});

			// コールスタックから削除
			this.callStack.pop();

			this.steps.push({
				id: this.stepId++,
				description: `F(${n}) = ${result} を返す（深度: ${depth}）`,
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

		// 再帰ケース：F(n) = F(n-1) + F(n-2)
		this.steps.push({
			id: this.stepId++,
			description: `再帰ケース：F(${n}) = F(${n - 1}) + F(${n - 2}) を計算`,
			array: [],
			operation: "再帰分解",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				recursiveFormula: `F(${n}) = F(${n - 1}) + F(${n - 2})`,
				nextCalls: [`F(${n - 1})`, `F(${n - 2})`],
			},
		});

		// F(n-1)の計算
		this.steps.push({
			id: this.stepId++,
			description: `F(${n - 1}) の計算を開始（F(${n})の第1項）`,
			array: [],
			operation: "第1項計算開始",
			variables: {
				n: n,
				depth: depth,
				calculating: `F(${n - 1})`,
				purpose: `F(${n}) の第1項`,
			},
		});

		const fib1 = this.fibonacci(n - 1, depth + 1, callId);

		this.steps.push({
			id: this.stepId++,
			description: `F(${n - 1}) = ${fib1} が完了（F(${n})の第1項）`,
			array: [],
			operation: "第1項計算完了",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				fib1: fib1,
				calculated: `F(${n - 1}) = ${fib1}`,
			},
		});

		// F(n-2)の計算
		this.steps.push({
			id: this.stepId++,
			description: `F(${n - 2}) の計算を開始（F(${n})の第2項）`,
			array: [],
			operation: "第2項計算開始",
			variables: {
				n: n,
				depth: depth,
				calculating: `F(${n - 2})`,
				purpose: `F(${n}) の第2項`,
				fib1: fib1,
			},
		});

		const fib2 = this.fibonacci(n - 2, depth + 1, callId);

		this.steps.push({
			id: this.stepId++,
			description: `F(${n - 2}) = ${fib2} が完了（F(${n})の第2項）`,
			array: [],
			operation: "第2項計算完了",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				fib1: fib1,
				fib2: fib2,
				calculated: `F(${n - 2}) = ${fib2}`,
			},
		});

		// 結果の計算
		const result = fib1 + fib2;
		currentCall.result = result;
		currentCall.isComplete = true;

		this.steps.push({
			id: this.stepId++,
			description: `F(${n}) = ${fib1} + ${fib2} = ${result} を計算`,
			array: [],
			operation: "加算計算",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				fib1: fib1,
				fib2: fib2,
				result: result,
				calculation: `${fib1} + ${fib2} = ${result}`,
			},
		});

		// コールスタックから削除
		this.callStack.pop();

		this.steps.push({
			id: this.stepId++,
			description: `F(${n}) = ${result} を返す（深度: ${depth}）`,
			array: [],
			operation: "戻り値",
			variables: {
				n: n,
				result: result,
				depth: depth,
				callId: callId,
				returning: true,
				completedCalculation: `F(${n}) = ${result}`,
			},
		});

		return result;
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [], // フィボナッチ数列では配列は使用しない
			target: 5, // F(5) を計算
			parameters: { n: 5 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
フィボナッチ数列（再帰）は、関数が自分自身を呼び出す再帰アルゴリズムの代表例です。

【数値】**フィボナッチ数列の定義**
- F(0) = 0, F(1) = 1
- F(n) = F(n-1) + F(n-2) （n ≥ 2）
- 数列: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...

 **再帰的思考**
- 大きな問題を小さな同種の問題に分解
- ベースケース（停止条件）が必須
- 関数が自分自身を呼び出して解決

【基礎】**実行メカニズム**
- コールスタックに関数呼び出しが積まれる
- ベースケースまで分解→逆順に結果を計算
- メモリ使用量は再帰の深さに比例

【注意】**計算量の問題**
- 時間計算量: O(2^n) - 指数的に増加
- 同じ計算を何度も繰り返す
- F(40)で約10億回の関数呼び出し

【ポイント】**学習価値**
- 再帰的思考法の理解
- スタックとメモリ管理
- アルゴリズムの効率性の重要性
- 最適化（メモ化）の必要性

【ヒント】**実用的な改善策**
- メモ化（計算済み結果をキャッシュ）
- 動的プログラミング（ボトムアップ）
- 反復的実装（ループ使用）
		`.trim();
	}

	/**
	 * 指定した位置のフィボナッチ数を直接計算（検証用）
	 * @param n フィボナッチ数列の位置
	 * @returns フィボナッチ数
	 */
	static calculateFibonacci(n: number): number {
		if (n <= 1) return n;
		return (
			FibonacciRecursiveAlgorithm.calculateFibonacci(n - 1) +
			FibonacciRecursiveAlgorithm.calculateFibonacci(n - 2)
		);
	}

	/**
	 * フィボナッチ数列を指定個数分生成
	 * @param count 生成する個数
	 * @returns フィボナッチ数列の配列
	 */
	static generateSequence(count: number): number[] {
		const sequence: number[] = [];
		for (let i = 0; i < count; i++) {
			sequence.push(FibonacciRecursiveAlgorithm.calculateFibonacci(i));
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
		executionTime: string;
	}[] {
		return [
			{ n: 0, description: "ベースケース", executionTime: "即座" },
			{ n: 1, description: "ベースケース", executionTime: "即座" },
			{ n: 3, description: "基本的な再帰", executionTime: "< 1ms" },
			{ n: 5, description: "再帰構造の理解", executionTime: "< 1ms" },
			{ n: 8, description: "計算量の体感", executionTime: "< 10ms" },
			{ n: 10, description: "効率性の問題を実感", executionTime: "< 100ms" },
			{ n: 15, description: "非効率性が顕著", executionTime: "< 1s" },
			{ n: 20, description: "実用性の限界", executionTime: "数秒" },
			{ n: 25, description: "最適化の必要性", executionTime: "十数秒" },
		];
	}

	/**
	 * 指定したnでの予想計算回数を算出
	 * @param n フィボナッチ数列の位置
	 * @returns 予想される関数呼び出し回数
	 */
	static estimateCallCount(n: number): number {
		if (n <= 1) return 1;
		// フィボナッチ数列の呼び出し回数もフィボナッチ数列に従う
		// 正確には：calls(n) = calls(n-1) + calls(n-2) + 1
		// 近似的に：約 2^n に比例
		return Math.floor((1.618 ** n / Math.sqrt(5)) * 2); // 黄金比を使った近似
	}
}
