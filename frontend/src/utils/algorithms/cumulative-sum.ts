/**
 * src/utils/algorithms/cumulative-sum.ts
 *
 * 累積和・差分配列アルゴリズムの実装
 * 前処理による配列の区間和・区間更新の高速化を実現する重要な技法
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 累積和・差分配列操作の種類
 */
type CumulativeSumOperationType =
	| "build" // 累積和配列の構築
	| "rangeSum" // 区間和クエリ
	| "pointUpdate" // 一点更新
	| "rangeUpdate" // 区間更新
	| "differenceArray" // 差分配列の表示
	| "restore" // 差分配列から元配列を復元
	| "multipleQueries" // 複数クエリの一括処理
	| "compare"; // ナイーブ法との比較

/**
 * 累積和・差分配列アルゴリズムクラス
 *
 * 配列の前処理により区間和クエリと区間更新を高速化する技法
 * 累積和: O(1)での区間和クエリを実現
 * 差分配列: O(1)での区間更新と最終的な復元を実現
 * 時間計算量: 前処理O(n)、クエリO(1)、区間更新O(1)
 * 空間計算量: O(n)
 */
export class CumulativeSumAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "cumulative-sum",
		name: "累積和・差分配列",
		description:
			"前処理による配列の区間和・区間更新の高速化。累積和でO(1)区間和、差分配列でO(1)区間更新を実現",
		category: "other",
		timeComplexity: {
			best: "O(1)", // クエリ操作
			average: "O(n)", // 前処理
			worst: "O(n)", // 構築時
		},
		difficulty: 2, // 初級〜中級（概念は簡単だが応用が重要）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private originalArray: number[] = [];
	private cumulativeSum: number[] = [];
	private differenceArray: number[] = [];

	/**
	 * 累積和・差分配列操作を実行
	 * @param input 入力データと操作指定
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 入力パラメータの取得
		const operation = input.parameters?.operation as CumulativeSumOperationType;
		const array = input.parameters?.array as number[] | undefined;
		const left = input.parameters?.left as number | undefined;
		const right = input.parameters?.right as number | undefined;
		const index = input.parameters?.index as number | undefined;
		const value = input.parameters?.value as number | undefined;
		const queries = input.parameters?.queries as
			| Array<{
					type: string;
					left?: number;
					right?: number;
					index?: number;
					value?: number;
			  }>
			| undefined;

		// 配列の設定
		if (array) {
			this.originalArray = [...array];
		}

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `累積和・差分配列操作開始：${this.getOperationDescription(operation)}を実行`,
			array: [...this.originalArray],
			operation: "初期化",
			variables: {
				operation: operation,
				arraySize: this.originalArray.length,
				technique: this.getTechniqueDescription(operation),
			},
		});

		let result: any;

		// 操作の実行
		switch (operation) {
			case "build":
				if (array && array.length > 0) {
					result = this.performBuild(array);
				} else {
					throw new Error("構築には非空の配列が必要です");
				}
				break;

			case "rangeSum":
				if (left !== undefined && right !== undefined) {
					result = this.performRangeSum(left, right);
				} else {
					throw new Error("区間和クエリには左端と右端が必要です");
				}
				break;

			case "pointUpdate":
				if (index !== undefined && value !== undefined) {
					result = this.performPointUpdate(index, value);
				} else {
					throw new Error("一点更新にはインデックスと値が必要です");
				}
				break;

			case "rangeUpdate":
				if (left !== undefined && right !== undefined && value !== undefined) {
					result = this.performRangeUpdate(left, right, value);
				} else {
					throw new Error("区間更新には範囲と値が必要です");
				}
				break;

			case "differenceArray":
				result = this.performShowDifferenceArray();
				break;

			case "restore":
				result = this.performRestore();
				break;

			case "multipleQueries":
				if (queries && queries.length > 0) {
					result = this.performMultipleQueries(queries);
				} else {
					throw new Error("複数クエリ処理にはクエリ配列が必要です");
				}
				break;

			case "compare":
				if (left !== undefined && right !== undefined) {
					result = this.performComparison(left, right);
				} else {
					throw new Error("比較処理には範囲が必要です");
				}
				break;

			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: `🎉 累積和・差分配列操作完了！${this.getOperationDescription(operation)}が正常に実行されました`,
			array: [...this.originalArray],
			operation: "完了",
			variables: {
				result: result,
				totalSteps: this.steps.length,
				technique: this.getTechniqueDescription(operation),
				efficiency: this.getEfficiencyNote(operation),
			},
		});

		return {
			success: true,
			result: result,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.getOperationComplexity(operation),
			summary: {
				operation: operation,
				operationResult: result,
				arraySize: this.originalArray.length,
				totalSteps: this.steps.length,
				technique: this.getTechniqueDescription(operation),
			},
		};
	}

	/**
	 * 累積和配列の構築
	 */
	private performBuild(array: number[]): string {
		this.originalArray = [...array];
		this.cumulativeSum = new Array(array.length + 1).fill(0);

		this.steps.push({
			id: this.stepId++,
			description: `配列 [${array.join(", ")}] から累積和配列を構築`,
			array: [...array],
			operation: "構築開始",
			variables: {
				originalArray: array,
				arraySize: array.length,
				cumulativeSize: this.cumulativeSum.length,
			},
		});

		// 累積和配列の構築
		for (let i = 0; i < array.length; i++) {
			this.cumulativeSum[i + 1] = this.cumulativeSum[i] + array[i];

			this.steps.push({
				id: this.stepId++,
				description: `cumSum[${i + 1}] = cumSum[${i}] + arr[${i}] = ${this.cumulativeSum[i]} + ${array[i]} = ${this.cumulativeSum[i + 1]}`,
				array: [...array],
				highlight: [i],
				operation: "累積和計算",
				variables: {
					currentIndex: i,
					currentValue: array[i],
					previousCumSum: this.cumulativeSum[i],
					newCumSum: this.cumulativeSum[i + 1],
					cumulativeArray: [...this.cumulativeSum],
				},
			});
		}

		// 差分配列も初期化
		this.differenceArray = new Array(array.length + 1).fill(0);
		for (let i = 0; i < array.length; i++) {
			this.differenceArray[i] = array[i] - (i > 0 ? array[i - 1] : 0);
		}

		this.steps.push({
			id: this.stepId++,
			description: "累積和配列構築完了",
			array: [...array],
			operation: "構築完了",
			variables: {
				cumulativeArray: [...this.cumulativeSum],
				differenceArray: [...this.differenceArray],
				constructionComplexity: "O(n)",
				queryComplexity: "O(1)",
			},
		});

		return `サイズ ${array.length} の配列から累積和配列を構築しました`;
	}

	/**
	 * 区間和クエリの実行
	 */
	private performRangeSum(left: number, right: number): number {
		if (this.cumulativeSum.length === 0) {
			throw new Error("累積和配列が構築されていません");
		}

		if (left < 0 || right >= this.originalArray.length || left > right) {
			throw new Error("無効な範囲です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `区間和クエリ：arr[${left}]からarr[${right}]までの合計を計算`,
			array: [...this.originalArray],
			highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
			operation: "区間和クエリ開始",
			variables: {
				queryRange: `[${left}, ${right}]`,
				rangeSize: right - left + 1,
				formula: `cumSum[${right + 1}] - cumSum[${left}]`,
			},
		});

		const result = this.cumulativeSum[right + 1] - this.cumulativeSum[left];

		this.steps.push({
			id: this.stepId++,
			description: `区間和計算：${this.cumulativeSum[right + 1]} - ${this.cumulativeSum[left]} = ${result}`,
			array: [...this.originalArray],
			highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
			operation: "区間和計算完了",
			variables: {
				rightCumSum: this.cumulativeSum[right + 1],
				leftCumSum: this.cumulativeSum[left],
				rangeSum: result,
				complexity: "O(1)",
				cumulativeArray: [...this.cumulativeSum],
			},
		});

		return result;
	}

	/**
	 * 一点更新の実行
	 */
	private performPointUpdate(index: number, value: number): string {
		if (index < 0 || index >= this.originalArray.length) {
			throw new Error("無効なインデックスです");
		}

		const oldValue = this.originalArray[index];
		const delta = value - oldValue;

		this.steps.push({
			id: this.stepId++,
			description: `一点更新：arr[${index}]を ${oldValue} から ${value} に変更（差分: ${delta}）`,
			array: [...this.originalArray],
			highlight: [index],
			operation: "一点更新開始",
			variables: {
				index: index,
				oldValue: oldValue,
				newValue: value,
				delta: delta,
			},
		});

		// 元配列を更新
		this.originalArray[index] = value;

		// 累積和配列を更新
		for (let i = index + 1; i < this.cumulativeSum.length; i++) {
			this.cumulativeSum[i] += delta;
		}

		this.steps.push({
			id: this.stepId++,
			description: `累積和配列を更新：インデックス${index + 1}以降に差分${delta}を追加`,
			array: [...this.originalArray],
			highlight: [index],
			operation: "累積和更新完了",
			variables: {
				updatedArray: [...this.originalArray],
				updatedCumSum: [...this.cumulativeSum],
				updateComplexity: "O(n)", // ナイーブな更新
				betterApproach: "差分配列を使用すればO(1)で更新可能",
			},
		});

		return `インデックス ${index} を ${value} に更新しました`;
	}

	/**
	 * 区間更新の実行（差分配列使用）
	 */
	private performRangeUpdate(
		left: number,
		right: number,
		value: number,
	): string {
		if (left < 0 || right >= this.originalArray.length || left > right) {
			throw new Error("無効な範囲です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `区間更新：arr[${left}]からarr[${right}]に値${value}を加算`,
			array: [...this.originalArray],
			highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
			operation: "区間更新開始",
			variables: {
				updateRange: `[${left}, ${right}]`,
				rangeSize: right - left + 1,
				addValue: value,
				technique: "差分配列による高速化",
			},
		});

		// 差分配列による区間更新（O(1)）
		this.differenceArray[left] += value;
		if (right + 1 < this.differenceArray.length) {
			this.differenceArray[right + 1] -= value;
		}

		this.steps.push({
			id: this.stepId++,
			description: `差分配列更新：diff[${left}] += ${value}, diff[${right + 1}] -= ${value}`,
			array: [...this.originalArray],
			operation: "差分配列更新",
			variables: {
				differenceArray: [...this.differenceArray],
				leftUpdate: `diff[${left}] += ${value}`,
				rightUpdate:
					right + 1 < this.differenceArray.length
						? `diff[${right + 1}] -= ${value}`
						: "範囲外のため更新なし",
				complexity: "O(1)",
			},
		});

		// 元配列に反映（実際の運用では最後にまとめて実行）
		for (let i = left; i <= right; i++) {
			this.originalArray[i] += value;
		}

		this.steps.push({
			id: this.stepId++,
			description: "区間更新完了：差分配列の変更を元配列に反映",
			array: [...this.originalArray],
			highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
			operation: "区間更新完了",
			variables: {
				updatedArray: [...this.originalArray],
				efficiencyNote:
					"複数の区間更新がある場合、最後にまとめて復元することで全体をO(n)に抑制可能",
			},
		});

		return `区間[${left}, ${right}]に値${value}を加算しました`;
	}

	/**
	 * 差分配列の表示
	 */
	private performShowDifferenceArray(): number[] {
		this.steps.push({
			id: this.stepId++,
			description: "差分配列の内容を表示",
			array: [...this.originalArray],
			operation: "差分配列表示",
			variables: {
				originalArray: [...this.originalArray],
				differenceArray: [...this.differenceArray],
				explanation: "diff[i] = arr[i] - arr[i-1] (arr[-1] = 0とする)",
				usage: "区間更新をO(1)で実行するために使用",
			},
		});

		return [...this.differenceArray];
	}

	/**
	 * 差分配列から元配列を復元
	 */
	private performRestore(): number[] {
		this.steps.push({
			id: this.stepId++,
			description: "差分配列から元配列を復元",
			array: [...this.originalArray],
			operation: "復元開始",
			variables: {
				differenceArray: [...this.differenceArray],
				method: "累積和を計算して元配列を求める",
			},
		});

		const restored = new Array(this.originalArray.length);
		restored[0] = this.differenceArray[0];

		for (let i = 1; i < restored.length; i++) {
			restored[i] = restored[i - 1] + this.differenceArray[i];

			this.steps.push({
				id: this.stepId++,
				description: `arr[${i}] = arr[${i - 1}] + diff[${i}] = ${restored[i - 1]} + ${this.differenceArray[i]} = ${restored[i]}`,
				array: [...restored],
				highlight: [i],
				operation: "復元計算",
				variables: {
					currentIndex: i,
					previousValue: restored[i - 1],
					difference: this.differenceArray[i],
					newValue: restored[i],
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: "復元完了",
			array: [...restored],
			operation: "復元完了",
			variables: {
				restoredArray: [...restored],
				complexity: "O(n)",
			},
		});

		return restored;
	}

	/**
	 * 複数クエリの一括処理
	 */
	private performMultipleQueries(
		queries: Array<{
			type: string;
			left?: number;
			right?: number;
			index?: number;
			value?: number;
		}>,
	): any[] {
		const results: any[] = [];

		this.steps.push({
			id: this.stepId++,
			description: `複数クエリ処理開始：${queries.length}個のクエリを実行`,
			array: [...this.originalArray],
			operation: "複数クエリ開始",
			variables: {
				queryCount: queries.length,
				queryTypes: queries.map((q) => q.type),
			},
		});

		for (let i = 0; i < queries.length; i++) {
			const query = queries[i];

			this.steps.push({
				id: this.stepId++,
				description: `クエリ${i + 1}: ${this.getQueryDescription(query)}`,
				array: [...this.originalArray],
				operation: "クエリ実行",
				variables: {
					queryIndex: i + 1,
					queryType: query.type,
					queryLeft: query.left,
					queryRight: query.right,
					queryIndex_param: query.index,
					queryValue: query.value,
				},
			});

			let result: any;
			switch (query.type) {
				case "rangeSum":
					if (query.left !== undefined && query.right !== undefined) {
						result =
							this.cumulativeSum[query.right + 1] -
							this.cumulativeSum[query.left];
					}
					break;
				case "rangeUpdate":
					if (
						query.left !== undefined &&
						query.right !== undefined &&
						query.value !== undefined
					) {
						this.differenceArray[query.left] += query.value;
						if (query.right + 1 < this.differenceArray.length) {
							this.differenceArray[query.right + 1] -= query.value;
						}
						result = `区間[${query.left}, ${query.right}]に${query.value}を加算`;
					}
					break;
			}

			results.push(result);
		}

		this.steps.push({
			id: this.stepId++,
			description: "複数クエリ処理完了",
			array: [...this.originalArray],
			operation: "複数クエリ完了",
			variables: {
				results: results,
				totalComplexity: "O(n + q)", // n: 配列サイズ, q: クエリ数
				efficiency: "前処理により各クエリがO(1)で実行",
			},
		});

		return results;
	}

	/**
	 * ナイーブ法との比較
	 */
	private performComparison(
		left: number,
		right: number,
	): {
		naive: { result: number; steps: number };
		cumulative: { result: number; steps: number };
	} {
		this.steps.push({
			id: this.stepId++,
			description: `ナイーブ法 vs 累積和法の比較：区間[${left}, ${right}]の合計計算`,
			array: [...this.originalArray],
			operation: "比較開始",
			variables: {
				compareRange: `[${left}, ${right}]`,
				naiveComplexity: "O(n)",
				cumulativeComplexity: "O(1)",
			},
		});

		// ナイーブ法
		let naiveSum = 0;
		let naiveSteps = 0;
		for (let i = left; i <= right; i++) {
			naiveSum += this.originalArray[i];
			naiveSteps++;
		}

		// 累積和法
		const cumulativeResult =
			this.cumulativeSum[right + 1] - this.cumulativeSum[left];

		this.steps.push({
			id: this.stepId++,
			description: "比較結果",
			array: [...this.originalArray],
			highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
			operation: "比較完了",
			variables: {
				naiveResult: naiveSum,
				naiveSteps: naiveSteps,
				naiveComplexity: "O(n)",
				cumulativeResult: cumulativeResult,
				cumulativeSteps: 1,
				cumulativeComplexity: "O(1)",
				speedup: `${naiveSteps}倍高速`,
			},
		});

		return {
			naive: { result: naiveSum, steps: naiveSteps },
			cumulative: { result: cumulativeResult, steps: 1 },
		};
	}

	/**
	 * 操作の説明を取得
	 */
	private getOperationDescription(
		operation: CumulativeSumOperationType,
	): string {
		const descriptions = {
			build: "累積和配列の構築",
			rangeSum: "区間和クエリ",
			pointUpdate: "一点更新",
			rangeUpdate: "区間更新",
			differenceArray: "差分配列の表示",
			restore: "差分配列からの復元",
			multipleQueries: "複数クエリの一括処理",
			compare: "ナイーブ法との比較",
		};
		return descriptions[operation] || "操作";
	}

	/**
	 * 技法の説明を取得
	 */
	private getTechniqueDescription(
		operation: CumulativeSumOperationType,
	): string {
		const techniques = {
			build: "前処理による高速化準備",
			rangeSum: "累積和による区間和の高速計算",
			pointUpdate: "累積和配列の部分更新",
			rangeUpdate: "差分配列による区間更新",
			differenceArray: "差分配列の可視化",
			restore: "差分配列からの復元処理",
			multipleQueries: "前処理効果の実証",
			compare: "アルゴリズム効率比較",
		};
		return techniques[operation] || "技法";
	}

	/**
	 * 効率性に関する注記を取得
	 */
	private getEfficiencyNote(operation: CumulativeSumOperationType): string {
		const notes = {
			build: "O(n)の前処理でO(1)クエリを実現",
			rangeSum: "ナイーブ法O(n) → 累積和法O(1)",
			pointUpdate: "累積和配列更新はO(n)、差分配列更新はO(1)",
			rangeUpdate: "ナイーブ法O(n) → 差分配列法O(1)",
			differenceArray: "区間更新の効率化に重要",
			restore: "全ての区間更新を一括で反映",
			multipleQueries: "クエリ数が多いほど前処理の効果が顕著",
			compare: "前処理のコストを上回る高速化を実現",
		};
		return notes[operation] || "効率性";
	}

	/**
	 * クエリの説明を取得
	 */
	private getQueryDescription(query: any): string {
		switch (query.type) {
			case "rangeSum":
				return `区間和[${query.left}, ${query.right}]`;
			case "rangeUpdate":
				return `区間更新[${query.left}, ${query.right}] += ${query.value}`;
			default:
				return "不明なクエリ";
		}
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getOperationComplexity(
		operation: CumulativeSumOperationType,
	): string {
		const complexities = {
			build: "O(n)",
			rangeSum: "O(1)",
			pointUpdate: "O(n)", // 累積和配列の場合
			rangeUpdate: "O(1)", // 差分配列の場合
			differenceArray: "O(1)",
			restore: "O(n)",
			multipleQueries: "O(n + q)", // n: 配列サイズ, q: クエリ数
			compare: "O(n)",
		};
		return complexities[operation] || "O(n)";
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				operation: "build",
				array: [1, 3, 5, 7, 9, 11, 13, 15],
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
累積和（Cumulative Sum）と差分配列（Difference Array）は、配列の区間操作を高速化する重要な前処理技法です。多くの競技プログラミングや実用アプリケーションで基盤となる技術です。

🔢 **累積和（Prefix Sum）**
- 前処理O(n)で累積和配列を構築
- 区間和クエリをO(1)で実行
- cumSum[i] = arr[0] + arr[1] + ... + arr[i-1]
- 区間[l,r]の合計 = cumSum[r+1] - cumSum[l]

📊 **主要な操作と計算量**
- 構築: O(n) - 一度だけ実行
- 区間和クエリ: O(1) - 何度でも高速実行
- ナイーブ法: O(n) → 累積和法: O(1)
- 複数クエリでの効果: O(nq) → O(n+q)

🔄 **差分配列（Difference Array）**
- diff[i] = arr[i] - arr[i-1] の形で構築
- 区間更新をO(1)で実行
- 区間[l,r]に値vを加算: diff[l] += v, diff[r+1] -= v
- 最終的な復元: 差分配列の累積和で元配列を求める

💡 **実装のポイント**
- 1-indexed累積和配列で境界処理を簡潔化
- 差分配列による区間更新の遅延評価
- 複数の区間更新後にまとめて復元処理
- オーバーフロー対策と境界条件の適切な処理

🌟 **累積和の応用パターン**
- **2次元累積和**: 矩形領域の合計をO(1)で計算
- **累積XOR**: ビット演算の区間操作
- **累積最大値/最小値**: モノトニックな性質を利用
- **移動平均**: スライディングウィンドウとの組み合わせ

🚀 **差分配列の応用例**
- **区間スケジューリング**: 時間区間の重複管理
- **イベント処理**: 開始・終了イベントの効率的処理
- **座標圧縮との組み合わせ**: 大きな座標空間での区間操作
- **セグメント木の軽量版**: 単純な区間更新ならより高速

⚡ **パフォーマンス特性**
- クエリ数が多いほど前処理のコストを上回る効果
- メモリ効率が良い（元配列 + 前処理配列のみ）
- 実装が簡潔で理解しやすい
- 多くの上位アルゴリズムの基盤技術

🔍 **他の手法との比較**
- vs セグメント木: 実装が簡単、メモリ効率が良い
- vs Fenwick Tree: より直感的、範囲クエリに特化
- vs ナイーブ法: 前処理により劇的な高速化を実現

累積和と差分配列は、「前処理による最適化」という重要な思考パターンを学べる教材です。シンプルながら強力な技法で、多くの問題解決の基盤となります。
		`.trim();
	}

	/**
	 * 推奨される操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: CumulativeSumOperationType;
		array?: number[];
		left?: number;
		right?: number;
		index?: number;
		value?: number;
		queries?: Array<{
			type: string;
			left?: number;
			right?: number;
			value?: number;
		}>;
		description: string;
		expectedResult: any;
	}[] {
		return [
			{
				operation: "build",
				array: [1, 3, 5, 7, 9, 11],
				description: "配列から累積和配列を構築",
				expectedResult: "サイズ6の配列から累積和配列を構築しました",
			},
			{
				operation: "rangeSum",
				left: 1,
				right: 4,
				description: "区間[1,4]の合計をO(1)で計算",
				expectedResult: 24, // 3+5+7+9
			},
			{
				operation: "compare",
				left: 0,
				right: 3,
				description: "ナイーブ法と累積和法の性能比較",
				expectedResult: "比較結果オブジェクト",
			},
			{
				operation: "rangeUpdate",
				left: 1,
				right: 3,
				value: 5,
				description: "区間[1,3]に5を加算（差分配列使用）",
				expectedResult: "区間[1,3]に値5を加算しました",
			},
			{
				operation: "differenceArray",
				description: "差分配列の内容を表示",
				expectedResult: "差分配列",
			},
			{
				operation: "restore",
				description: "差分配列から元配列を復元",
				expectedResult: "復元された配列",
			},
			{
				operation: "multipleQueries",
				queries: [
					{ type: "rangeSum", left: 0, right: 2 },
					{ type: "rangeSum", left: 2, right: 4 },
					{ type: "rangeUpdate", left: 1, right: 3, value: 2 },
				],
				description: "複数クエリの一括処理で効率性を実証",
				expectedResult: "クエリ結果配列",
			},
		];
	}
}
