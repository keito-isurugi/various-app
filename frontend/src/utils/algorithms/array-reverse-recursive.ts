/**
 * src/utils/algorithms/array-reverse-recursive.ts
 *
 * 配列の逆順（再帰）アルゴリズムの実装
 * 教育目的でステップバイステップの線形再帰をサポート
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
interface ReverseCall {
	start: number; // 開始インデックス
	end: number; // 終了インデックス
	depth: number; // 再帰の深さ
	callId: string; // 呼び出しID
	parentCallId?: string; // 親の呼び出しID
	isComplete: boolean; // 完了フラグ
	swapped?: boolean; // 交換が実行されたか
}

/**
 * 配列の逆順（再帰）アルゴリズムクラス
 *
 * 線形再帰による配列の逆順操作
 * 時間計算量: O(n) - 線形時間
 * 空間計算量: O(n) - 再帰の深さ
 */
export class ArrayReverseRecursiveAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "array-reverse-recursive",
		name: "配列の逆順（再帰）",
		description:
			"再帰による配列の逆順操作。線形再帰パターンで分割統治の考え方を学習し、両端から中央に向かって要素を交換",
		category: "other",
		timeComplexity: {
			best: "O(n)", // 常に線形
			average: "O(n)", // 常に線形
			worst: "O(n)", // 常に線形
		},
		difficulty: 2, // 初級〜中級（線形再帰で理解しやすい）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private callStack: ReverseCall[] = [];
	private callCounter = 0;
	private maxDepth = 0;
	private totalSwaps = 0;
	private currentArray: number[] = [];

	/**
	 * 配列の逆順（再帰）を実行
	 * @param input 逆順にする配列
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証と配列の取得
		if (!input.array || input.array.length === 0) {
			throw new Error("逆順にする配列が指定されていません");
		}

		const originalArray = [...input.array];

		// 配列長の検証
		if (originalArray.length > 20) {
			throw new Error(
				"教育目的のため、配列の長さは20要素以下に制限されています",
			);
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.callStack = [];
		this.callCounter = 0;
		this.maxDepth = 0;
		this.totalSwaps = 0;
		this.currentArray = [...originalArray]; // 作業用のコピー

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `配列の逆順（再帰）開始：[${originalArray.join(", ")}] を逆順にします`,
			array: [...this.currentArray],
			operation: "初期化",
			variables: {
				originalArray: [...originalArray],
				arrayLength: originalArray.length,
				goal: "両端から中央に向かって要素を交換",
				approach: "線形再帰による分割統治",
				expectedSwaps: Math.floor(originalArray.length / 2),
			},
		});

		// 空配列または1要素の場合の特別処理
		if (originalArray.length <= 1) {
			this.steps.push({
				id: this.stepId++,
				description: `配列長が${originalArray.length}のため、逆順操作は不要です`,
				array: [...this.currentArray],
				operation: "特別ケース",
				variables: {
					reason:
						originalArray.length === 0
							? "空配列"
							: "1要素配列（既に逆順と同じ）",
					result: [...this.currentArray],
				},
			});
		} else {
			// 配列の逆順を再帰実行
			this.reverseArray(0, this.currentArray.length - 1);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` 逆順完了！[${originalArray.join(", ")}] → [${this.currentArray.join(", ")}]`,
			array: [...this.currentArray],
			operation: "完了",
			variables: {
				originalArray: [...originalArray],
				reversedArray: [...this.currentArray],
				totalSwaps: this.totalSwaps,
				maxDepth: this.maxDepth,
				efficiency: `${this.totalSwaps}回の交換で完了`,
				timeComplexity: this.info.timeComplexity.average,
				verification: this.verifyReverse(originalArray, this.currentArray),
			},
		});

		return {
			success: true,
			result: [...this.currentArray],
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
		};
	}

	/**
	 * 配列の逆順を再帰的に実行（可視化付き）
	 * @param start 開始インデックス
	 * @param end 終了インデックス
	 * @param depth 現在の再帰の深さ（デフォルト: 0）
	 * @param parentCallId 親の呼び出しID（デフォルト: undefined）
	 */
	private reverseArray(
		start: number,
		end: number,
		depth = 0,
		parentCallId?: string,
	): void {
		// 再帰呼び出し情報を記録
		const callId = `call_${this.callCounter++}`;
		this.maxDepth = Math.max(this.maxDepth, depth);

		const currentCall: ReverseCall = {
			start: start,
			end: end,
			depth: depth,
			callId: callId,
			parentCallId: parentCallId,
			isComplete: false,
			swapped: false,
		};

		// 関数呼び出し開始のステップ
		this.steps.push({
			id: this.stepId++,
			description: `reverseArray(${start}, ${end}) の呼び出し開始（深度: ${depth}）`,
			array: [...this.currentArray],
			operation: "関数呼び出し",
			variables: {
				start: start,
				end: end,
				depth: depth,
				callId: callId,
				parentCallId: parentCallId || "なし",
				rangeSize: end - start + 1,
				purpose: `インデックス${start}から${end}までの範囲を逆順`,
				currentRange: this.currentArray.slice(start, end + 1),
			},
			highlightedElements: [start, end],
		});

		// コールスタックに追加
		this.callStack.push(currentCall);

		// ベースケース：start >= end の場合
		if (start >= end) {
			currentCall.isComplete = true;

			const reason =
				start === end
					? `中央要素（インデックス${start}）は交換不要`
					: `範囲が交差（start=${start} > end=${end}）で処理完了`;

			this.steps.push({
				id: this.stepId++,
				description: `ベースケース：${reason}`,
				array: [...this.currentArray],
				operation: "ベースケース",
				variables: {
					start: start,
					end: end,
					depth: depth,
					callId: callId,
					condition: "start >= end",
					reason: reason,
					action: "処理終了（再帰停止）",
				},
				highlightedElements: start === end ? [start] : [],
			});

			// コールスタックから削除
			this.callStack.pop();

			this.steps.push({
				id: this.stepId++,
				description: `reverseArray(${start}, ${end}) 完了（深度: ${depth}）`,
				array: [...this.currentArray],
				operation: "関数終了",
				variables: {
					start: start,
					end: end,
					depth: depth,
					callId: callId,
					completed: true,
				},
			});

			return;
		}

		// 再帰ケース：要素交換 + 再帰呼び出し
		this.steps.push({
			id: this.stepId++,
			description: `再帰ケース：array[${start}]とarray[${end}]を交換後、内側の範囲を処理`,
			array: [...this.currentArray],
			operation: "再帰ケース",
			variables: {
				start: start,
				end: end,
				depth: depth,
				callId: callId,
				leftValue: this.currentArray[start],
				rightValue: this.currentArray[end],
				swapAction: `${this.currentArray[start]} <-> ${this.currentArray[end]}`,
				nextCall: `reverseArray(${start + 1}, ${end - 1})`,
			},
			comparing: [start, end],
		});

		// 要素を交換
		this.swapElements(start, end);
		currentCall.swapped = true;

		this.steps.push({
			id: this.stepId++,
			description: `要素交換完了：array[${start}] <-> array[${end}]`,
			array: [...this.currentArray],
			operation: "要素交換",
			variables: {
				start: start,
				end: end,
				depth: depth,
				callId: callId,
				swapNumber: this.totalSwaps,
				newLeftValue: this.currentArray[start],
				newRightValue: this.currentArray[end],
				remainingRange: `[${start + 1}, ${end - 1}]`,
			},
			highlightedElements: [start, end],
		});

		// 内側の範囲に対して再帰呼び出し
		this.steps.push({
			id: this.stepId++,
			description: `内側の範囲 reverseArray(${start + 1}, ${end - 1}) を呼び出し`,
			array: [...this.currentArray],
			operation: "再帰呼び出し",
			variables: {
				start: start,
				end: end,
				depth: depth,
				callId: callId,
				nextStart: start + 1,
				nextEnd: end - 1,
				nextRangeSize: Math.max(0, end - 1 - (start + 1) + 1),
				purpose: "残りの範囲を逆順処理",
			},
		});

		this.reverseArray(start + 1, end - 1, depth + 1, callId);

		this.steps.push({
			id: this.stepId++,
			description: `内側の範囲 reverseArray(${start + 1}, ${end - 1}) が完了`,
			array: [...this.currentArray],
			operation: "再帰完了",
			variables: {
				start: start,
				end: end,
				depth: depth,
				callId: callId,
				completedRange: `[${start + 1}, ${end - 1}]`,
				currentState: "この範囲の処理完了",
			},
		});

		// 現在の呼び出しを完了
		currentCall.isComplete = true;

		// コールスタックから削除
		this.callStack.pop();

		this.steps.push({
			id: this.stepId++,
			description: `reverseArray(${start}, ${end}) 完了（深度: ${depth}）`,
			array: [...this.currentArray],
			operation: "関数終了",
			variables: {
				start: start,
				end: end,
				depth: depth,
				callId: callId,
				completed: true,
				contribution: `範囲[${start}, ${end}]の逆順処理完了`,
			},
		});
	}

	/**
	 * 配列の2つの要素を交換する
	 * @param i 1つ目のインデックス
	 * @param j 2つ目のインデックス
	 */
	private swapElements(i: number, j: number): void {
		if (
			i < 0 ||
			j < 0 ||
			i >= this.currentArray.length ||
			j >= this.currentArray.length
		) {
			throw new Error(
				`インデックス範囲外: i=${i}, j=${j}, 配列長=${this.currentArray.length}`,
			);
		}

		// 要素を交換
		const temp = this.currentArray[i];
		this.currentArray[i] = this.currentArray[j];
		this.currentArray[j] = temp;
		this.totalSwaps++;
	}

	/**
	 * 逆順の結果が正しいかを検証
	 * @param original 元の配列
	 * @param reversed 逆順後の配列
	 * @returns 検証結果
	 */
	private verifyReverse(original: number[], reversed: number[]): string {
		if (original.length !== reversed.length) {
			return "配列長が異なります";
		}

		for (let i = 0; i < original.length; i++) {
			if (original[i] !== reversed[original.length - 1 - i]) {
				return "逆順が正しくありません";
			}
		}

		return "逆順が正しく実行されました";
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [1, 2, 3, 4, 5], // 5要素の配列
			target: undefined,
			parameters: {},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
配列の逆順（再帰）は、線形再帰パターンの典型例です。

 **逆順の基本概念**
- 配列の要素を末尾から先頭の順序に並び替え
- 例：[1, 2, 3, 4, 5] → [5, 4, 3, 2, 1]
- 両端から中央に向かって要素を交換

 **再帰的思考**
- reverseArray(start, end)で範囲を指定
- ①array[start] <-> array[end] を交換
- ②reverseArray(start+1, end-1)を再帰呼び出し
- ベースケース：start >= end で停止

 **線形再帰の特徴**
- 問題サイズが毎回2ずつ減少
- 再帰の深さ：O(n/2) = O(n)
- 各段階で1回の再帰呼び出し
- フィボナッチのO(2^n)より効率的

️ **計算量**
- 時間計算量：O(n) - 線形時間
- 空間計算量：O(n) - 再帰スタック
- 交換回数：floor(n/2)回

【ポイント】**学習価値**
- 線形再帰パターンの理解
- 分割統治の基本概念
- 配列操作とインデックス管理
- ベースケース設計の重要性

【ヒント】**実用性と応用**
- 回文判定での類似パターン
- 分割統治ソートの境界処理
- 文字列操作での応用
- 再帰思考の訓練として最適
		`.trim();
	}

	/**
	 * 指定した配列長での予想実行時間を算出
	 * @param length 配列の長さ
	 * @returns 予想実行時間の説明
	 */
	static estimateExecutionTime(length: number): string {
		if (length <= 2) return "瞬時";
		if (length <= 5) return "< 1ms";
		if (length <= 10) return "< 10ms";
		if (length <= 20) return "< 100ms";
		return "実装制限により20要素以下";
	}

	/**
	 * 教育目的の適切な配列例を提案
	 * @returns 推奨配列の例
	 */
	static getRecommendedArrays(): {
		array: number[];
		description: string;
		insight: string;
	}[] {
		return [
			{
				array: [1],
				description: "1要素配列",
				insight: "ベースケースの理解",
			},
			{
				array: [1, 2],
				description: "2要素配列",
				insight: "最小の交換ケース",
			},
			{
				array: [1, 2, 3],
				description: "3要素配列（奇数）",
				insight: "中央要素の処理",
			},
			{
				array: [1, 2, 3, 4],
				description: "4要素配列（偶数）",
				insight: "全要素交換パターン",
			},
			{
				array: [1, 2, 3, 4, 5],
				description: "5要素配列",
				insight: "基本的な再帰構造",
			},
			{
				array: [5, 4, 3, 2, 1],
				description: "逆順配列",
				insight: "既に逆順の場合",
			},
			{
				array: [1, 3, 2, 4, 5],
				description: "ランダム配列",
				insight: "一般的なケース",
			},
			{
				array: [10, 20, 30, 40, 50, 60],
				description: "6要素配列",
				insight: "中程度の複雑さ",
			},
		];
	}

	/**
	 * 指定した配列長での統計情報を取得
	 * @param length 配列の長さ
	 * @returns 統計情報
	 */
	static getStatistics(length: number): {
		expectedSwaps: number;
		maxDepth: number;
		recursiveCalls: number;
		timeComplexity: string;
	} {
		return {
			expectedSwaps: Math.floor(length / 2),
			maxDepth: Math.floor(length / 2),
			recursiveCalls: Math.floor(length / 2) + 1, // ベースケース含む
			timeComplexity: `O(${length})`,
		};
	}

	/**
	 * 配列の逆順を反復的に実行（比較用）
	 * @param array 逆順にする配列
	 * @returns 逆順後の配列
	 */
	static reverseIterative(array: number[]): number[] {
		const result = [...array];
		let start = 0;
		let end = result.length - 1;

		while (start < end) {
			// 要素を交換
			const temp = result[start];
			result[start] = result[end];
			result[end] = temp;

			start++;
			end--;
		}

		return result;
	}
}
