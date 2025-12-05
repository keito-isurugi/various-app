/**
 * src/utils/algorithms/fibonacci-dp.ts
 *
 * フィボナッチ数列（動的計画法）アルゴリズムの実装
 * 効率的なボトムアップ方式によるテーブル構築をサポート
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * DPテーブルの状態を表す型
 */
interface DPTableState {
	index: number;
	value: number;
	isNew?: boolean;
	source?: string;
}

/**
 * フィボナッチ数列（動的計画法）アルゴリズムクラス
 *
 * ボトムアップ方式による効率的なフィボナッチ数列計算
 * 時間計算量: O(n)（線形）
 * 空間計算量: O(n)（DPテーブル）
 */
export class FibonacciDPAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "fibonacci-dp",
		name: "フィボナッチ数列（動的計画法）",
		description:
			"動的計画法を使用した効率的なフィボナッチ数列の計算。メモ化とボトムアップ方式で再計算を回避",
		category: "other",
		timeComplexity: {
			best: "O(n)", // 常に線形
			average: "O(n)", // 常に線形
			worst: "O(n)", // 常に線形
		},
		difficulty: 2, // 初級〜中級（DPの概念理解が必要）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private dpTable: DPTableState[] = [];

	/**
	 * フィボナッチ数列（動的計画法）を実行
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

		if (n > 1000) {
			throw new Error(
				"教育目的のため、nは1000以下に制限されています（メモリ使用量のため）",
			);
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.dpTable = [];

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `フィボナッチ数列（DP）開始：F(${n}) を効率的に計算します`,
			array: [],
			operation: "初期化",
			variables: {
				n: n,
				method: "動的計画法（ボトムアップ）",
				definition: "F(n) = F(n-1) + F(n-2), F(0)=0, F(1)=1",
				advantage: "各値を一度だけ計算し、メモ化により再計算を回避",
			},
		});

		// DPテーブルの初期化
		this.steps.push({
			id: this.stepId++,
			description: `DPテーブルを初期化（サイズ: ${n + 1}）`,
			array: [],
			operation: "テーブル作成",
			variables: {
				tableSize: n + 1,
				memoryUsage: `${n + 1} 要素`,
				purpose: "計算済みの値を保存して再利用",
			},
		});

		// エッジケース：n = 0 または 1
		if (n === 0) {
			this.dpTable.push({ index: 0, value: 0, isNew: true });
			this.steps.push({
				id: this.stepId++,
				description: "F(0) = 0（ベースケース）",
				array: this.dpTable.map((item) => item.value),
				operation: "ベースケース",
				variables: {
					n: 0,
					result: 0,
					dpTable: "{ 0: 0 }",
				},
			});
			return {
				success: true,
				result: 0,
				steps: this.steps,
				executionSteps: this.steps,
				timeComplexity: "O(1)",
			};
		}

		if (n === 1) {
			this.dpTable.push({ index: 0, value: 0, isNew: false });
			this.dpTable.push({ index: 1, value: 1, isNew: true });
			this.steps.push({
				id: this.stepId++,
				description: "F(0) = 0, F(1) = 1（ベースケース）",
				array: this.dpTable.map((item) => item.value),
				operation: "ベースケース",
				variables: {
					n: 1,
					result: 1,
					dpTable: "{ 0: 0, 1: 1 }",
				},
			});
			return {
				success: true,
				result: 1,
				steps: this.steps,
				executionSteps: this.steps,
				timeComplexity: "O(1)",
			};
		}

		// ベースケースの設定
		this.dpTable.push({ index: 0, value: 0, isNew: true, source: "定義" });
		this.dpTable.push({ index: 1, value: 1, isNew: true, source: "定義" });

		this.steps.push({
			id: this.stepId++,
			description: "ベースケースを設定：F(0) = 0, F(1) = 1",
			array: this.dpTable.map((item) => item.value),
			operation: "ベースケース設定",
			variables: {
				"dp[0]": 0,
				"dp[1]": 1,
				baseCase: "F(0) = 0, F(1) = 1",
			},
		});

		// ボトムアップでDPテーブルを構築
		for (let i = 2; i <= n; i++) {
			// 現在の状態を記録（新しい値を計算する前）
			this.steps.push({
				id: this.stepId++,
				description: `F(${i}) を計算：F(${i - 1}) + F(${i - 2})`,
				array: this.dpTable.map((item) => item.value),
				operation: "計算準備",
				variables: {
					i: i,
					"dp[i-1]": this.dpTable[i - 1].value,
					"dp[i-2]": this.dpTable[i - 2].value,
					formula: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${
						this.dpTable[i - 1].value
					} + ${this.dpTable[i - 2].value}`,
				},
			});

			// 新しい値を計算
			const newValue = this.dpTable[i - 1].value + this.dpTable[i - 2].value;
			this.dpTable.push({
				index: i,
				value: newValue,
				isNew: true,
				source: `F(${i - 1}) + F(${i - 2})`,
			});

			// 計算完了のステップ
			this.steps.push({
				id: this.stepId++,
				description: `F(${i}) = ${newValue} を保存`,
				array: this.dpTable.map((item) => item.value),
				operation: "値を保存",
				variables: {
					i: i,
					"dp[i]": newValue,
					calculation: `${this.dpTable[i - 1].value} + ${
						this.dpTable[i - 2].value
					} = ${newValue}`,
					tableUpdate: `dp[${i}] = ${newValue}`,
				},
			});

			// 古い値のisNewフラグをリセット
			for (const item of this.dpTable) {
				if (item.index < i) {
					item.isNew = false;
				}
			}
		}

		// 最終結果
		const result = this.dpTable[n].value;

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` 計算完了！F(${n}) = ${result}`,
			array: this.dpTable.map((item) => item.value),
			operation: "完了",
			variables: {
				n: n,
				result: result,
				totalIterations: n - 1,
				memoryUsed: `${n + 1} 要素`,
				timeComplexity: "O(n)",
				comparison: `再帰版では約 ${Math.floor(
					(1.618 ** n / Math.sqrt(5)) * 2,
				).toLocaleString()} 回の関数呼び出し`,
				efficiency: "各値を一度だけ計算、再計算なし",
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
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [], // フィボナッチ数列では配列は使用しない
			target: 10, // F(10) を計算
			parameters: { n: 10 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
フィボナッチ数列（動的計画法）は、再帰版の非効率性を解決する最適化手法です。

【ポイント】**動的計画法とは**
- 部分問題の解を保存して再利用
- 重複計算を回避する最適化手法
- ボトムアップまたはトップダウンで実装

【解析】**ボトムアップ方式**
- 小さい問題から順に解く
- 配列（DPテーブル）に結果を保存
- 必要な値が既に計算済み

【ヒント】**実装の特徴**
- 時間計算量: O(n) - 線形時間
- 空間計算量: O(n) - 配列サイズ
- 各値を一度だけ計算

 **アルゴリズムの流れ**
1. DPテーブルを初期化
2. ベースケース（F(0)=0, F(1)=1）を設定
3. F(2)からF(n)まで順番に計算
4. 各ステップで以前の2つの値を使用

【比較】**再帰版との比較**
- 再帰版: O(2^n) 時間、重複計算多数
- DP版: O(n) 時間、各値を一度だけ計算
- n=40: 再帰版は約10億回、DP版は40回

【応用】**さらなる最適化**
- 空間計算量をO(1)に削減可能
- 必要なのは直前の2つの値のみ
- 変数2つで実装可能

【基礎】**学習価値**
- 最適化の重要性を理解
- メモ化の概念を習得
- 効率的なアルゴリズム設計
- 実用的なプログラミング技法
		`.trim();
	}

	/**
	 * フィボナッチ数列を指定個数分生成（DP版）
	 * @param count 生成する個数
	 * @returns フィボナッチ数列の配列
	 */
	static generateSequence(count: number): number[] {
		if (count <= 0) return [];
		if (count === 1) return [0];

		const sequence = [0, 1];
		for (let i = 2; i < count; i++) {
			sequence.push(sequence[i - 1] + sequence[i - 2]);
		}
		return sequence.slice(0, count);
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
			{ n: 5, description: "基本的なDP", executionTime: "< 1ms" },
			{ n: 10, description: "DPの効率性", executionTime: "< 1ms" },
			{ n: 20, description: "大きな値も高速", executionTime: "< 1ms" },
			{ n: 50, description: "再帰版では不可能", executionTime: "< 1ms" },
			{ n: 100, description: "大規模計算", executionTime: "< 1ms" },
			{ n: 500, description: "超大規模", executionTime: "< 5ms" },
		];
	}

	/**
	 * メモリ使用量を計算
	 * @param n フィボナッチ数列の位置
	 * @returns DPテーブルのサイズ
	 */
	static calculateMemoryUsage(n: number): number {
		return n + 1; // 0からnまでの値を保存
	}

	/**
	 * 指定した位置のフィボナッチ数を効率的に計算（検証用）
	 * @param n フィボナッチ数列の位置
	 * @returns フィボナッチ数
	 */
	static calculateFibonacci(n: number): number {
		if (n <= 1) return n;

		let prev2 = 0;
		let prev1 = 1;

		for (let i = 2; i <= n; i++) {
			const current = prev1 + prev2;
			prev2 = prev1;
			prev1 = current;
		}

		return prev1;
	}
}
