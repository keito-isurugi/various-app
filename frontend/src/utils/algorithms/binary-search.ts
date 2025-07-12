/**
 * src/utils/algorithms/binary-search.ts
 *
 * 二分探索アルゴリズムの実装
 * 教育目的でステップバイステップの実行をサポート
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 二分探索アルゴリズムクラス
 *
 * ソート済み配列から指定された値を効率的に検索
 * 時間計算量: O(log n)
 * 空間計算量: O(1)
 */
export class BinarySearchAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "binary-search",
		name: "二分探索",
		description: "ソート済み配列から要素を効率的に検索するアルゴリズム",
		category: "search",
		timeComplexity: {
			best: "O(1)", // 最良の場合：最初に中央で見つかる
			average: "O(log n)", // 平均的な場合
			worst: "O(log n)", // 最悪の場合：最後まで探索
		},
		difficulty: 2, // 初級〜中級
		spaceComplexity: "O(1)",
	};

	/**
	 * 二分探索を実行
	 * @param input 探索対象の配列と目標値
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		const { array, target } = input;

		// 入力検証
		if (!array || array.length === 0) {
			return {
				success: false,
				result: -1,
				steps: [],
				executionSteps: [],
				timeComplexity: this.info.timeComplexity.worst,
			};
		}

		if (target === undefined) {
			throw new Error("探索対象の値（target）が指定されていません");
		}

		// ソート確認（教育目的での警告）
		const isSorted = this.isSorted(array);
		if (!isSorted) {
			console.warn(
				"警告: 配列がソートされていません。二分探索は正常に動作しない可能性があります。",
			);
		}

		const steps: AlgorithmStep[] = [];
		let left = 0;
		let right = array.length - 1;
		let stepId = 0;

		// 初期状態のステップ
		steps.push({
			id: stepId++,
			description: `探索開始：配列から ${target} を探します`,
			array: [...array],
			searchRange: { start: left, end: right },
			operation: "初期化",
			variables: {
				left: left,
				right: right,
				target: target,
			},
		});

		// 二分探索のメインループ
		while (left <= right) {
			const mid = Math.floor((left + right) / 2);
			const midValue = array[mid];

			// 中央要素との比較ステップ
			steps.push({
				id: stepId++,
				description: `中央要素 array[${mid}] = ${midValue} と ${target} を比較`,
				array: [...array],
				comparing: [mid],
				searchRange: { start: left, end: right },
				operation: "比較",
				variables: {
					left: left,
					right: right,
					mid: mid,
					midValue: midValue,
					target: target,
				},
			});

			if (midValue === target) {
				// 見つかった場合
				steps.push({
					id: stepId++,
					description: `✅ 見つかりました！ ${target} はインデックス ${mid} にあります`,
					array: [...array],
					foundIndex: mid,
					searchRange: { start: left, end: right },
					operation: "発見",
					variables: {
						result: mid,
						target: target,
					},
				});

				return {
					success: true,
					result: mid,
					steps: steps,
					executionSteps: steps,
					timeComplexity: this.info.timeComplexity.best,
				};
			}
			if (midValue < target) {
				// 右半分を探索
				left = mid + 1;
				steps.push({
					id: stepId++,
					description: `${midValue} < ${target} なので、右半分を探索します`,
					array: [...array],
					searchRange: { start: left, end: right },
					operation: "右半分選択",
					variables: {
						left: left,
						right: right,
						eliminatedRange: `[0, ${mid}]`,
					},
				});
			} else {
				// 左半分を探索
				right = mid - 1;
				steps.push({
					id: stepId++,
					description: `${midValue} > ${target} なので、左半分を探索します`,
					array: [...array],
					searchRange: { start: left, end: right },
					operation: "左半分選択",
					variables: {
						left: left,
						right: right,
						eliminatedRange: `[${mid}, ${array.length - 1}]`,
					},
				});
			}
		}

		// 見つからなかった場合
		steps.push({
			id: stepId++,
			description: `❌ ${target} は配列内に見つかりませんでした`,
			array: [...array],
			searchRange: { start: left, end: right },
			operation: "未発見",
			variables: {
				result: -1,
				target: target,
			},
		});

		return {
			success: false,
			result: -1,
			steps: steps,
			executionSteps: steps,
			timeComplexity: this.info.timeComplexity.worst,
		};
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
			target: 7,
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
二分探索は、ソート済みの配列から特定の要素を効率的に見つけるアルゴリズムです。

🔍 **基本原理**
1. 配列の中央要素を確認
2. 目標値と比較
3. 目標値が小さければ左半分、大きければ右半分を選択
4. 選択した半分で同じ処理を繰り返す

📈 **効率性**
- 各ステップで探索範囲が半分になる
- 1000個の要素でも最大10回の比較で見つかる
- 電話帳で名前を探すときと同じ方法

🎯 **実用例**
- 辞書での単語検索
- データベースのインデックス検索
- ゲームでの高得点ランキング検索
		`.trim();
	}

	/**
	 * 配列がソートされているかチェック
	 */
	private isSorted(array: number[]): boolean {
		for (let i = 1; i < array.length; i++) {
			if (array[i] < array[i - 1]) {
				return false;
			}
		}
		return true;
	}

	/**
	 * ランダムなソート済み配列を生成
	 * @param size 配列のサイズ
	 * @param maxValue 最大値
	 * @returns ソート済み配列
	 */
	static generateSortedArray(size: number, maxValue = 100): number[] {
		const array: number[] = [];
		let current = Math.floor(Math.random() * 5) + 1; // 1-5から開始

		for (let i = 0; i < size; i++) {
			array.push(current);
			current += Math.floor(Math.random() * 5) + 1; // 1-5ずつ増加
			if (current > maxValue) {
				current = maxValue;
			}
		}

		return array;
	}

	/**
	 * 配列内のランダムな要素を取得（探索テスト用）
	 * @param array 対象配列
	 * @returns ランダムな要素
	 */
	static getRandomTarget(array: number[]): number {
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	}

	/**
	 * 配列にない値を生成（見つからないケースのテスト用）
	 * @param array 対象配列
	 * @returns 配列にない値
	 */
	static getNonExistentTarget(array: number[]): number {
		let candidate = Math.floor(Math.random() * 200) + 1;
		while (array.includes(candidate)) {
			candidate = Math.floor(Math.random() * 200) + 1;
		}
		return candidate;
	}
}
