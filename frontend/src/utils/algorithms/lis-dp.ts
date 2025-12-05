/**
 * src/utils/algorithms/lis-dp.ts
 *
 * 最長増加部分列（LIS: Longest Increasing Subsequence）アルゴリズムの実装
 * 動的計画法を使用して配列から最長の増加部分列を効率的に求める
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * DPテーブルの各要素の状態を表す型
 */
interface LISDPTableCell {
	index: number; // 配列のインデックス
	value: number; // 配列の値
	dpValue: number; // その位置までのLISの長さ
	isNew?: boolean; // 新しく計算されたセルかどうか
	predecessor?: number; // 前の要素のインデックス（バックトラック用）
	isPartOfLIS?: boolean; // 最終的なLISに含まれるかどうか
}

/**
 * LIS（最長増加部分列）動的計画法アルゴリズムクラス
 *
 * 配列から最長の厳密増加部分列を動的計画法で効率的に計算
 * 時間計算量: O(n²)（基本的なDP実装）
 * 空間計算量: O(n)（DPテーブル）
 */
export class LISDPAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "lis-dp",
		name: "最長増加部分列（LIS）",
		description:
			"動的計画法を使用して配列から最長の増加部分列を効率的に求めるアルゴリズム",
		category: "dynamic",
		timeComplexity: {
			best: "O(n²)", // n は配列の長さ
			average: "O(n²)",
			worst: "O(n²)",
		},
		difficulty: 3, // 中級（動的計画法とバックトラックの理解が必要）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private dpTable: LISDPTableCell[] = [];
	private inputArray: number[] = [];
	private lisResult: number[] = [];

	/**
	 * LIS（最長増加部分列）を実行
	 * @param input 数値配列
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証と値の取得
		const array = input.array;

		if (!array || !Array.isArray(array)) {
			throw new Error("数値配列が必要です");
		}

		if (array.length === 0) {
			throw new Error("空の配列です");
		}

		if (!array.every((val) => typeof val === "number")) {
			throw new Error("全ての要素が数値である必要があります");
		}

		// 教育目的の制限
		if (array.length > 12) {
			throw new Error(
				"教育目的のため、配列のサイズは12要素以下に制限されています",
			);
		}

		// 重複削除と値の範囲制限
		const values = Array.from(new Set(array));
		if (values.some((val) => val < 1 || val > 100)) {
			throw new Error("値は1から100の範囲で設定してください");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.dpTable = [];
		this.inputArray = [...array];
		this.lisResult = [];

		const n = array.length;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `LIS（最長増加部分列）開始：配列 [${array.join(", ")}] から最長の増加部分列を求める`,
			array: [...array],
			operation: "初期化",
			variables: {
				inputArray: array,
				arrayLength: n,
				method: "動的計画法（一次元DP）",
				purpose: "配列から最長の厳密増加部分列を求める",
				note: "各要素で終わるLISの長さを計算",
			},
		});

		// DPテーブルの初期化
		this.initializeDPTable(array);

		// DPテーブルを埋める
		this.fillDPTable(array);

		// 最長のLISを見つけて構築
		const maxLength = Math.max(...this.dpTable.map((cell) => cell.dpValue));
		this.lisResult = this.constructLIS(array, maxLength);

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` LIS計算完了！最長増加部分列：[${this.lisResult.join(", ")}]（長さ：${maxLength}）`,
			array: [...array],
			highlight: this.getLISIndices(array, this.lisResult),
			operation: "完了",
			variables: {
				lis: this.lisResult,
				length: maxLength,
				inputArray: array,
				lisIndices: this.getLISIndices(array, this.lisResult),
				timeComplexity: "O(n²)",
				spaceComplexity: "O(n)",
				efficiency: `${array.length}個の要素に対して${this.stepId}ステップで完了`,
			},
		});

		return {
			success: true,
			result: this.lisResult,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
			summary: {
				lisLength: maxLength,
				lis: this.lisResult,
				originalArray: array,
				comparisons: this.countComparisons(),
			},
		};
	}

	/**
	 * DPテーブルを初期化
	 */
	private initializeDPTable(array: number[]): void {
		this.steps.push({
			id: this.stepId++,
			description:
				"DPテーブルを初期化：各要素について「その要素で終わるLISの長さ」を記録",
			array: [...array],
			operation: "テーブル初期化",
			variables: {
				tableSize: array.length,
				meaning: "dp[i] = i番目の要素で終わるLISの最大長",
				initialValue: "全て1で初期化（各要素単独で長さ1）",
				explanation: "どの要素も最低限、自分だけの部分列（長さ1）を形成できる",
			},
		});

		// DPテーブルを初期化（すべて1で初期化）
		this.dpTable = array.map((value, index) => ({
			index,
			value,
			dpValue: 1, // 各要素は最低限、自分だけの部分列（長さ1）を形成
			isNew: true,
		}));
	}

	/**
	 * DPテーブルを埋める
	 */
	private fillDPTable(array: number[]): void {
		const n = array.length;

		for (let i = 1; i < n; i++) {
			const currentValue = array[i];

			this.steps.push({
				id: this.stepId++,
				description: `要素 ${currentValue}（インデックス${i}）を処理：これより小さい前の要素を探索`,
				array: [...array],
				highlight: [i],
				operation: "要素処理開始",
				variables: {
					currentIndex: i,
					currentValue: currentValue,
					processing: `array[${i}] = ${currentValue}`,
					goal: "この要素で終わる最長増加部分列の長さを計算",
				},
			});

			let maxLength = 1; // 現在の要素単独での長さ
			let bestPredecessor = -1; // 最適な前の要素のインデックス

			// 現在の要素より小さい前の要素をすべてチェック
			for (let j = 0; j < i; j++) {
				const prevValue = array[j];

				if (prevValue < currentValue) {
					// 増加条件を満たす
					const candidateLength = this.dpTable[j].dpValue + 1;

					this.steps.push({
						id: this.stepId++,
						description: `${prevValue} < ${currentValue} → 増加条件を満たす：dp[${j}] + 1 = ${this.dpTable[j].dpValue} + 1 = ${candidateLength}`,
						array: [...array],
						highlight: [i],
						comparing: [j],
						operation: "増加条件チェック",
						variables: {
							prevIndex: j,
							prevValue: prevValue,
							currentIndex: i,
							currentValue: currentValue,
							prevLength: this.dpTable[j].dpValue,
							candidateLength: candidateLength,
							isIncreasing: true,
						},
					});

					if (candidateLength > maxLength) {
						maxLength = candidateLength;
						bestPredecessor = j;

						this.steps.push({
							id: this.stepId++,
							description: `より長いLISを発見：dp[${i}] = ${maxLength} に更新`,
							array: [...array],
							highlight: [i],
							secondary: [j.toString()],
							operation: "DPテーブル更新",
							variables: {
								currentIndex: i,
								newLength: maxLength,
								predecessorIndex: j,
								improvement: `${maxLength - 1} → ${maxLength}`,
							},
						});
					}
				} else {
					// 増加条件を満たさない
					this.steps.push({
						id: this.stepId++,
						description: `${prevValue} ≥ ${currentValue} → 増加条件を満たさない：スキップ`,
						array: [...array],
						highlight: [i],
						comparing: [j],
						operation: "条件チェック",
						variables: {
							prevIndex: j,
							prevValue: prevValue,
							currentIndex: i,
							currentValue: currentValue,
							isIncreasing: false,
							reason: "厳密増加の条件を満たさない",
						},
					});
				}
			}

			// DPテーブルを更新
			this.dpTable[i].dpValue = maxLength;
			this.dpTable[i].predecessor = bestPredecessor;
			this.dpTable[i].isNew = true;

			// 前の要素のisNewフラグをリセット
			for (let k = 0; k < i; k++) {
				this.dpTable[k].isNew = false;
			}

			this.steps.push({
				id: this.stepId++,
				description: `dp[${i}] = ${maxLength} に確定（要素 ${currentValue} で終わるLISの最大長）`,
				array: [...array],
				highlight: [i],
				operation: "dp値確定",
				variables: {
					index: i,
					value: currentValue,
					dpValue: maxLength,
					predecessor: bestPredecessor,
					currentDPTable: this.dpTable.map((cell) => cell.dpValue),
					progress: `${i + 1}/${n}要素完了`,
				},
			});
		}
	}

	/**
	 * LISを構築
	 */
	private constructLIS(array: number[], maxLength: number): number[] {
		// 最大長を持つ要素を見つける
		let maxIndex = 0;
		for (let i = 1; i < this.dpTable.length; i++) {
			if (this.dpTable[i].dpValue > this.dpTable[maxIndex].dpValue) {
				maxIndex = i;
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `LIS構築開始：最大長${maxLength}を持つ要素 ${array[maxIndex]}（インデックス${maxIndex}）から逆順に構築`,
			array: [...array],
			highlight: [maxIndex],
			operation: "LIS構築開始",
			variables: {
				startIndex: maxIndex,
				startValue: array[maxIndex],
				maxLength: maxLength,
				method: "predecessorリンクを辿って逆順構築",
			},
		});

		// バックトラックでLISを構築
		const lis: number[] = [];
		let currentIndex = maxIndex;

		while (currentIndex !== -1) {
			const currentCell = this.dpTable[currentIndex];
			lis.unshift(array[currentIndex]); // 先頭に追加（逆順構築）

			this.steps.push({
				id: this.stepId++,
				description: `要素 ${array[currentIndex]}（インデックス${currentIndex}）をLISに追加`,
				array: [...array],
				highlight: [currentIndex],
				operation: "LIS構築",
				variables: {
					currentIndex: currentIndex,
					currentValue: array[currentIndex],
					addedToLIS: array[currentIndex],
					currentLIS: [...lis],
					nextIndex: currentCell.predecessor ?? -1,
				},
			});

			currentIndex = currentCell.predecessor ?? -1;
		}

		// LISに含まれる要素をマーク
		for (const value of lis) {
			const index = array.indexOf(value);
			if (index !== -1) {
				this.dpTable[index].isPartOfLIS = true;
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `LIS構築完了：[${lis.join(", ")}]`,
			array: [...array],
			highlight: this.getLISIndices(array, lis),
			operation: "LIS構築完了",
			variables: {
				finalLIS: lis,
				length: lis.length,
				explanation: "predecessorリンクを辿ることで最適なLISを復元",
			},
		});

		return lis;
	}

	/**
	 * LISの要素のインデックスを取得
	 */
	private getLISIndices(array: number[], lis: number[]): number[] {
		const indices: number[] = [];
		let arrayIndex = 0;

		for (const lisValue of lis) {
			// 現在のLIS要素が配列のどの位置にあるかを探す
			while (arrayIndex < array.length && array[arrayIndex] !== lisValue) {
				arrayIndex++;
			}
			if (arrayIndex < array.length) {
				indices.push(arrayIndex);
				arrayIndex++; // 次の要素は現在の位置より後ろにある
			}
		}

		return indices;
	}

	/**
	 * 比較回数をカウント
	 */
	private countComparisons(): number {
		const n = this.inputArray.length;
		return (n * (n - 1)) / 2; // O(n²)の比較回数
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [10, 22, 9, 33, 21, 50, 41, 60],
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
最長増加部分列（Longest Increasing Subsequence, LIS）は、与えられた配列から最長の厳密増加する部分列を効率的に求める動的計画法のアルゴリズムです。

【ポイント】**問題の定義**
- 配列が与えられる
- 元の順序を保ったまま要素を選択
- 選択した要素が厳密に増加する（同じ値は含まない）
- その中で最も長い部分列を求める

【解析】**動的計画法のアプローチ**
- dp[i] = i番目の要素で終わるLISの最大長
- 各要素について、それより前の小さい要素を探索
- 最適な前の要素から長さを継承

 **状態遷移の規則**
1. 初期化: dp[i] = 1（各要素は単独で長さ1）
2. 各要素iについて：
   - 前の要素j（j < i）で array[j] < array[i] のものを探索
   - dp[i] = max(dp[i], dp[j] + 1)

【計算量】**計算量の特徴**
- 時間計算量: O(n²) - 各要素に対して前の要素を全探索
- 空間計算量: O(n) - DPテーブルのサイズ
- より効率的なO(n log n)の実装も存在（二分探索使用）

**解の復元**
- predecessorリンクを保存
- 最大長を持つ要素から逆順に辿る
- 実際のLISを構築

 **実用的な応用**
- 株価分析（最長の上昇トレンド）
- データの時系列分析
- ソートアルゴリズムの効率性測定
- ゲームのスコア分析
- バイオインフォマティクス

【ヒント】**学習価値**
- 一次元DPの代表例
- 貪欲法では解けない最適化問題
- バックトラックによる解の復元
- 効率的アルゴリズム設計の思考

【詳細】**具体例**
- 配列: [10, 22, 9, 33, 21, 50, 41, 60]
- LIS: [10, 22, 33, 50, 60] (長さ5)
- 部分列は元の順序を保持：10→22→33→50→60

**重要なポイント**
- 部分列 ≠ 部分配列（連続である必要なし）
- 厳密増加（同じ値は含まない）
- 複数のLISが存在する場合がある
- 効率的な実装により実用的な問題に対応可能
		`.trim();
	}

	/**
	 * 推奨する入力例を取得
	 */
	static getRecommendedInputs(): {
		array: number[];
		description: string;
		expectedLIS: number[];
		expectedLength: number;
	}[] {
		return [
			{
				array: [10, 22, 9, 33, 21, 50, 41, 60],
				description: "基本例：中程度の複雑さ",
				expectedLIS: [10, 22, 33, 50, 60],
				expectedLength: 5,
			},
			{
				array: [3, 10, 2, 1, 20],
				description: "シンプルな例：理解しやすい",
				expectedLIS: [3, 10, 20],
				expectedLength: 3,
			},
			{
				array: [1, 2, 3, 4, 5],
				description: "完全増加：LIS = 全体",
				expectedLIS: [1, 2, 3, 4, 5],
				expectedLength: 5,
			},
			{
				array: [5, 4, 3, 2, 1],
				description: "完全減少：LIS = 単一要素",
				expectedLIS: [5],
				expectedLength: 1,
			},
			{
				array: [1, 3, 2, 4],
				description: "小さな例：手計算可能",
				expectedLIS: [1, 3, 4],
				expectedLength: 3,
			},
			{
				array: [10, 9, 2, 5, 3, 7, 101, 18],
				description: "複雑な例：効率性を実感",
				expectedLIS: [2, 3, 7, 18],
				expectedLength: 4,
			},
		];
	}

	/**
	 * 指定した配列のLISを解く（検証用）
	 * @param array 入力配列
	 * @returns LISの長さと配列
	 */
	static solve(array: number[]): { length: number; lis: number[] } {
		if (array.length === 0) {
			return { length: 0, lis: [] };
		}

		const n = array.length;
		const dp = Array(n).fill(1);
		const predecessor = Array(n).fill(-1);

		// DPテーブルを構築
		for (let i = 1; i < n; i++) {
			for (let j = 0; j < i; j++) {
				if (array[j] < array[i] && dp[j] + 1 > dp[i]) {
					dp[i] = dp[j] + 1;
					predecessor[i] = j;
				}
			}
		}

		// 最大長とその位置を見つける
		const maxLength = Math.max(...dp);
		const maxIndex = dp.indexOf(maxLength);

		// LISを構築
		const lis: number[] = [];
		let currentIndex = maxIndex;
		while (currentIndex !== -1) {
			lis.unshift(array[currentIndex]);
			currentIndex = predecessor[currentIndex];
		}

		return {
			length: maxLength,
			lis: lis,
		};
	}
}
