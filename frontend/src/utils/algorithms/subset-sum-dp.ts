/**
 * src/utils/algorithms/subset-sum-dp.ts
 *
 * 部分和問題（動的計画法）アルゴリズムの実装
 * 二次元DPテーブルによる効率的な部分集合存在判定をサポート
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * DPテーブルの各セルの状態を表す型
 */
interface DPTableCell {
	row: number;
	col: number;
	value: boolean;
	isNew?: boolean;
	fromTop?: boolean;
	fromTopLeft?: boolean;
	element?: number;
}

/**
 * 部分和問題（動的計画法）アルゴリズムクラス
 *
 * 二次元DPテーブルによる効率的な部分集合存在判定
 * 時間計算量: O(n×S)（nは要素数、Sはターゲット）
 * 空間計算量: O(n×S)（DPテーブル）
 */
export class SubsetSumDPAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "subset-sum-dp",
		name: "部分和問題（動的計画法）",
		description:
			"動的計画法を使用した部分和問題の解法。二次元DPテーブルで部分集合の存在を効率的に判定",
		category: "dynamic",
		timeComplexity: {
			best: "O(n×S)", // nは要素数、Sはターゲット
			average: "O(n×S)",
			worst: "O(n×S)",
		},
		difficulty: 3, // 中級（2次元DPの理解が必要）
		spaceComplexity: "O(n×S)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private dpTable: DPTableCell[][] = [];

	/**
	 * 部分和問題（動的計画法）を実行
	 * @param input 配列とターゲット値
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証と値の取得
		const array = input.array;
		const target = input.target;

		if (!array || array.length === 0) {
			throw new Error("配列が指定されていません");
		}

		if (target === undefined || target <= 0) {
			throw new Error("有効なターゲット値が指定されていません");
		}

		// 入力値の検証
		for (const num of array) {
			if (!Number.isInteger(num) || num <= 0) {
				throw new Error("配列の要素は正の整数である必要があります");
			}
		}

		if (array.length > 10) {
			throw new Error(
				"教育目的のため、配列の要素数は10個以下に制限されています",
			);
		}

		if (target > 100) {
			throw new Error("教育目的のため、ターゲットは100以下に制限されています");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.dpTable = [];

		const n = array.length;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `部分和問題（動的計画法）開始：配列[${array.join(",")}]でターゲット${target}の部分集合を探索`,
			array: array,
			operation: "初期化",
			variables: {
				array: `[${array.join(",")}]`,
				target: target,
				n: n,
				method: "動的計画法（二次元DPテーブル）",
				purpose: "配列の部分集合でターゲットの和を作れるかを判定",
			},
		});

		// DPテーブルの初期化
		this.initializeDPTable(n, target);

		// ベースケースの設定
		this.setBaseCase(n, target);

		// DPテーブルを埋める
		const result = this.fillDPTable(array, n, target);

		// 結果の確認
		const finalResult = this.dpTable[n][target].value;

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` 計算完了！ターゲット${target}の部分集合は${finalResult ? "存在します" : "存在しません"}`,
			array: array,
			operation: "完了",
			variables: {
				result: finalResult ? "存在する" : "存在しない",
				target: target,
				tableSize: `${n + 1} × ${target + 1}`,
				cellsChecked: (n + 1) * (target + 1),
				timeComplexity: "O(n×S)",
				spaceComplexity: "O(n×S)",
			},
		});

		return {
			success: true,
			result: finalResult,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
		};
	}

	/**
	 * DPテーブルを初期化
	 */
	private initializeDPTable(n: number, target: number): void {
		this.steps.push({
			id: this.stepId++,
			description: `DPテーブルを初期化：${n + 1} × ${target + 1} = ${(n + 1) * (target + 1)}セル`,
			array: [],
			operation: "テーブル初期化",
			variables: {
				rows: n + 1,
				cols: target + 1,
				totalCells: (n + 1) * (target + 1),
				meaning: "dp[i][j] = 最初のi個の要素で和jが作れるか",
			},
		});

		// DPテーブルを初期化（false で埋める）
		this.dpTable = Array(n + 1)
			.fill(null)
			.map((_, row) =>
				Array(target + 1)
					.fill(null)
					.map((_, col) => ({
						row,
						col,
						value: false,
						isNew: false,
					})),
			);
	}

	/**
	 * ベースケースを設定
	 */
	private setBaseCase(n: number, target: number): void {
		this.steps.push({
			id: this.stepId++,
			description:
				"ベースケースを設定：空集合の和は0（すべてのdp[i][0] = true）",
			array: [],
			operation: "ベースケース設定",
			variables: {
				baseCase: "dp[i][0] = true for all i",
				meaning: "空集合の和は常に0なので作成可能",
			},
		});

		// 空集合の和は0なので、すべてのdp[i][0] = true
		for (let i = 0; i <= n; i++) {
			this.dpTable[i][0].value = true;
			this.dpTable[i][0].isNew = true;
		}
	}

	/**
	 * DPテーブルを埋める
	 */
	private fillDPTable(array: number[], n: number, target: number): boolean {
		for (let i = 1; i <= n; i++) {
			const currentElement = array[i - 1];

			this.steps.push({
				id: this.stepId++,
				description: `要素${currentElement}を考慮して行${i}を計算開始`,
				array: array,
				operation: "行計算開始",
				variables: {
					currentRow: i,
					currentElement: currentElement,
					elementIndex: i - 1,
					processing: `配列の${i}番目の要素: ${currentElement}`,
				},
			});

			for (let j = 1; j <= target; j++) {
				// 現在の要素を含めない場合
				const withoutCurrent = this.dpTable[i - 1][j].value;

				// 現在の要素を含める場合（可能であれば）
				let withCurrent = false;
				if (j >= currentElement) {
					withCurrent = this.dpTable[i - 1][j - currentElement].value;
				}

				// 結果を決定
				const result = withoutCurrent || withCurrent;
				this.dpTable[i][j].value = result;
				this.dpTable[i][j].isNew = true;

				// どちらのケースから来たかを記録
				if (withCurrent && j >= currentElement) {
					this.dpTable[i][j].fromTopLeft = true;
					this.dpTable[i][j].element = currentElement;
				}
				if (withoutCurrent) {
					this.dpTable[i][j].fromTop = true;
				}

				// 詳細なステップ記録（重要なセルのみ）
				if (
					result ||
					j === target ||
					(j >= currentElement && withCurrent !== withoutCurrent)
				) {
					let explanation = "";
					if (j < currentElement) {
						explanation = `要素${currentElement} > ${j}なので含められない → dp[${i - 1}][${j}] = ${withoutCurrent}`;
					} else if (withoutCurrent && withCurrent) {
						explanation = `要素${currentElement}を含めても含めなくても作成可能`;
					} else if (withCurrent) {
						explanation = `要素${currentElement}を含めることで作成可能 → dp[${i - 1}][${j - currentElement}] = true`;
					} else if (withoutCurrent) {
						explanation = `要素${currentElement}なしで作成可能 → dp[${i - 1}][${j}] = true`;
					} else {
						explanation = "どちらの方法でも作成不可能";
					}

					this.steps.push({
						id: this.stepId++,
						description: `dp[${i}][${j}] = ${result}を計算`,
						array: array,
						operation: "セル計算",
						variables: {
							currentElement: currentElement,
							targetSum: j,
							withoutElement: withoutCurrent,
							withElement: j >= currentElement ? withCurrent : "不可能",
							result: result,
							explanation: explanation,
						},
					});
				}
			}

			// 行の計算完了
			this.steps.push({
				id: this.stepId++,
				description: `行${i}の計算完了（要素${currentElement}の処理完了）`,
				array: array,
				operation: "行計算完了",
				variables: {
					completedRow: i,
					processedElement: currentElement,
					targetResult: this.dpTable[i][target].value,
					progress: `${i}/${n}行完了`,
				},
			});

			// 古いセルのisNewフラグをリセット
			for (let row = 0; row < i; row++) {
				for (let col = 0; col <= target; col++) {
					this.dpTable[row][col].isNew = false;
				}
			}
		}

		return this.dpTable[n][target].value;
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [2, 3, 7, 8, 10],
			target: 11,
			parameters: { array: [2, 3, 7, 8, 10], target: 11 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
部分和問題（動的計画法）は、与えられた配列の部分集合でターゲットの和を作れるかを効率的に判定するアルゴリズムです。

【ポイント】**問題の定義**
- 正の整数の配列が与えられる
- ターゲットとなる和Sが指定される
- 配列の部分集合でSを作れるかを判定

【解析】**動的計画法のアプローチ**
- dp[i][j] = 最初のi個の要素で和jが作れるか
- 二次元テーブルでボトムアップに解を構築
- 各要素に対して「含める/含めない」を考慮

 **状態遷移**
- dp[i][j] = dp[i-1][j] OR dp[i-1][j-arr[i-1]]
- 左項：i番目の要素を含めない
- 右項：i番目の要素を含める（j ≥ arr[i-1]の場合）

【計算量】**計算量の特徴**
- 時間計算量: O(n×S) - 配列サイズ×ターゲット
- 空間計算量: O(n×S) - DPテーブルのサイズ
- 全探索のO(2^n)から大幅に改善

 **実用的な応用**
- ナップサック問題の基礎
- 配列の分割問題
- 硬貨の組み合わせ問題
- リソース配分の最適化

【ヒント】**学習価値**
- 二次元DPの典型例
- 状態設計の重要性
- 最適化問題への応用力
- バックトラックによる解の復元
		`.trim();
	}

	/**
	 * 教育目的の適切な入力値を提案
	 * @returns 推奨値の配列
	 */
	static getRecommendedValues(): {
		array: number[];
		target: number;
		description: string;
	}[] {
		return [
			{
				array: [1, 2, 3],
				target: 4,
				description: "基本例：簡単な部分集合",
			},
			{
				array: [2, 3, 7, 8, 10],
				target: 11,
				description: "標準例：複数の解が存在",
			},
			{
				array: [1, 3, 5, 7],
				target: 8,
				description: "解が存在するケース",
			},
			{
				array: [2, 4, 6, 8],
				target: 15,
				description: "解が存在しないケース",
			},
			{
				array: [1, 5, 11, 5],
				target: 11,
				description: "同じ値を含む配列",
			},
			{
				array: [3, 34, 4, 12, 5, 2],
				target: 9,
				description: "複雑な例：効率性を実感",
			},
		];
	}

	/**
	 * DPテーブルのサイズを計算
	 * @param arrayLength 配列の長さ
	 * @param target ターゲット値
	 * @returns テーブルサイズ情報
	 */
	static calculateTableSize(
		arrayLength: number,
		target: number,
	): {
		rows: number;
		cols: number;
		total: number;
	} {
		const rows = arrayLength + 1;
		const cols = target + 1;
		return {
			rows,
			cols,
			total: rows * cols,
		};
	}

	/**
	 * 指定した入力での部分和問題を解く（検証用）
	 * @param array 配列
	 * @param target ターゲット値
	 * @returns 部分集合が存在するかどうか
	 */
	static solve(array: number[], target: number): boolean {
		const n = array.length;
		const dp = Array(n + 1)
			.fill(null)
			.map(() => Array(target + 1).fill(false));

		// ベースケース
		for (let i = 0; i <= n; i++) {
			dp[i][0] = true;
		}

		// DPテーブルを埋める
		for (let i = 1; i <= n; i++) {
			for (let j = 1; j <= target; j++) {
				dp[i][j] = dp[i - 1][j];
				if (j >= array[i - 1]) {
					dp[i][j] = dp[i][j] || dp[i - 1][j - array[i - 1]];
				}
			}
		}

		return dp[n][target];
	}
}
