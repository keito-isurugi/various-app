/**
 * src/utils/algorithms/lcs-dp.ts
 *
 * 最長共通部分列（LCS: Longest Common Subsequence）アルゴリズムの実装
 * 動的計画法を使用して二つの文字列の最長共通部分列を効率的に求める
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
interface LCSDPTableCell {
	row: number;
	col: number;
	value: number; // LCSの長さ
	isNew?: boolean;
	fromDiagonal?: boolean; // 斜め上から（文字が一致）
	fromTop?: boolean; // 上から
	fromLeft?: boolean; // 左から
	char1?: string; // 文字列1の文字
	char2?: string; // 文字列2の文字
	isMatching?: boolean; // 文字が一致するか
}

/**
 * バックトラックの方向を表す列挙型
 */
enum BacktrackDirection {
	DIAGONAL = "diagonal", // 斜め上（文字一致）
	UP = "up", // 上
	LEFT = "left", // 左
}

/**
 * LCS（最長共通部分列）動的計画法アルゴリズムクラス
 *
 * 二つの文字列の最長共通部分列を2次元DPテーブルで効率的に計算
 * 時間計算量: O(m×n)（mとnは各文字列の長さ）
 * 空間計算量: O(m×n)（DPテーブル）
 */
export class LCSDPAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "lcs-dp",
		name: "最長共通部分列（LCS）",
		description:
			"動的計画法を使用して二つの文字列の最長共通部分列を効率的に求めるアルゴリズム",
		category: "dynamic",
		timeComplexity: {
			best: "O(m×n)", // mとnは各文字列の長さ
			average: "O(m×n)",
			worst: "O(m×n)",
		},
		difficulty: 3, // 中級（2次元DPとバックトラックの理解が必要）
		spaceComplexity: "O(m×n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private dpTable: LCSDPTableCell[][] = [];
	private string1 = "";
	private string2 = "";
	private lcsResult = "";

	/**
	 * LCS（最長共通部分列）を実行
	 * @param input 二つの文字列（string1, string2）
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証と値の取得
		const str1 = input.parameters?.string1 as string;
		const str2 = input.parameters?.string2 as string;

		if (!str1 || !str2) {
			throw new Error("二つの文字列（string1, string2）が必要です");
		}

		if (typeof str1 !== "string" || typeof str2 !== "string") {
			throw new Error("入力は文字列である必要があります");
		}

		if (str1.length === 0 && str2.length === 0) {
			throw new Error("両方の文字列が空です");
		}

		// 教育目的の制限
		if (str1.length > 10 || str2.length > 10) {
			throw new Error(
				"教育目的のため、文字列の長さは10文字以下に制限されています",
			);
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.dpTable = [];
		this.string1 = str1;
		this.string2 = str2;
		this.lcsResult = "";

		const m = str1.length;
		const n = str2.length;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `LCS（最長共通部分列）開始：「${str1}」と「${str2}」の最長共通部分列を求める`,
			array: [], // LCSでは配列は使用しない
			operation: "初期化",
			variables: {
				string1: str1,
				string2: str2,
				length1: m,
				length2: n,
				method: "動的計画法（二次元DPテーブル）",
				purpose: "二つの文字列の最長共通部分列を求める",
			},
		});

		// DPテーブルの初期化
		this.initializeDPTable(m, n);

		// ベースケースの設定
		this.setBaseCase(m, n);

		// DPテーブルを埋める
		this.fillDPTable(str1, str2, m, n);

		// バックトラックでLCSを構築
		const lcsLength = this.dpTable[m][n].value;
		this.lcsResult = this.backtrackLCS(str1, str2, m, n);

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` LCS計算完了！最長共通部分列：「${this.lcsResult}」（長さ：${lcsLength}）`,
			array: [],
			operation: "完了",
			variables: {
				lcs: this.lcsResult,
				length: lcsLength,
				string1: str1,
				string2: str2,
				tableSize: `${m + 1} × ${n + 1}`,
				cellsChecked: (m + 1) * (n + 1),
				timeComplexity: "O(m×n)",
				spaceComplexity: "O(m×n)",
			},
		});

		return {
			success: true,
			result: this.lcsResult,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
		};
	}

	/**
	 * DPテーブルを初期化
	 */
	private initializeDPTable(m: number, n: number): void {
		this.steps.push({
			id: this.stepId++,
			description: `DPテーブルを初期化：${m + 1} × ${n + 1} = ${(m + 1) * (n + 1)}セル`,
			array: [],
			operation: "テーブル初期化",
			variables: {
				rows: m + 1,
				cols: n + 1,
				totalCells: (m + 1) * (n + 1),
				meaning: "dp[i][j] = string1[0..i-1]とstring2[0..j-1]のLCSの長さ",
				explanation: "各セルは対応する部分文字列のLCSの長さを保存",
			},
		});

		// DPテーブルを初期化（0で埋める）
		this.dpTable = Array(m + 1)
			.fill(null)
			.map((_, row) =>
				Array(n + 1)
					.fill(null)
					.map((_, col) => ({
						row,
						col,
						value: 0,
						isNew: false,
					})),
			);
	}

	/**
	 * ベースケースを設定
	 */
	private setBaseCase(m: number, n: number): void {
		this.steps.push({
			id: this.stepId++,
			description:
				"ベースケースを設定：空文字列とのLCSは0（dp[0][j] = 0, dp[i][0] = 0）",
			array: [],
			operation: "ベースケース設定",
			variables: {
				baseCase: "dp[0][j] = 0 and dp[i][0] = 0 for all i,j",
				meaning: "空文字列と任意の文字列のLCSの長さは0",
				firstRowCol: "最初の行と列は全て0で初期化済み",
			},
		});

		// 初期値は既に0で設定されているので、isNewフラグのみ設定
		for (let i = 0; i <= m; i++) {
			this.dpTable[i][0].isNew = true;
		}
		for (let j = 0; j <= n; j++) {
			this.dpTable[0][j].isNew = true;
		}
	}

	/**
	 * DPテーブルを埋める
	 */
	private fillDPTable(str1: string, str2: string, m: number, n: number): void {
		for (let i = 1; i <= m; i++) {
			const char1 = str1[i - 1];

			this.steps.push({
				id: this.stepId++,
				description: `文字「${char1}」（string1[${i - 1}]）を処理開始 - 行${i}を計算`,
				array: [],
				operation: "行計算開始",
				variables: {
					currentRow: i,
					currentChar1: char1,
					charIndex1: i - 1,
					processing: `string1の${i}番目の文字「${char1}」`,
				},
			});

			for (let j = 1; j <= n; j++) {
				const char2 = str2[j - 1];
				const isMatching = char1 === char2;

				// セルの情報を設定
				this.dpTable[i][j].char1 = char1;
				this.dpTable[i][j].char2 = char2;
				this.dpTable[i][j].isMatching = isMatching;

				let result: number;
				let explanation: string;

				if (isMatching) {
					// 文字が一致する場合：斜め上の値 + 1
					result = this.dpTable[i - 1][j - 1].value + 1;
					this.dpTable[i][j].fromDiagonal = true;
					explanation = `文字「${char1}」が一致 → dp[${i - 1}][${j - 1}] + 1 = ${this.dpTable[i - 1][j - 1].value} + 1`;
				} else {
					// 文字が一致しない場合：上または左の最大値
					const fromTop = this.dpTable[i - 1][j].value;
					const fromLeft = this.dpTable[i][j - 1].value;
					result = Math.max(fromTop, fromLeft);

					if (fromTop >= fromLeft) {
						this.dpTable[i][j].fromTop = true;
						explanation = `文字「${char1}」≠「${char2}」→ max(上:${fromTop}, 左:${fromLeft}) = ${result}（上から）`;
					} else {
						this.dpTable[i][j].fromLeft = true;
						explanation = `文字「${char1}」≠「${char2}」→ max(上:${fromTop}, 左:${fromLeft}) = ${result}（左から）`;
					}
				}

				this.dpTable[i][j].value = result;
				this.dpTable[i][j].isNew = true;

				// 重要なセルまたは値が変化したセルの詳細記録
				if (isMatching || result > 0 || (i <= 3 && j <= 3)) {
					this.steps.push({
						id: this.stepId++,
						description: `dp[${i}][${j}] = ${result} を計算`,
						array: [],
						operation: "セル計算",
						variables: {
							cell: `dp[${i}][${j}]`,
							char1: char1,
							char2: char2,
							isMatching: isMatching,
							result: result,
							explanation: explanation,
							position1: i - 1,
							position2: j - 1,
						},
					});
				}
			}

			// 行の計算完了
			this.steps.push({
				id: this.stepId++,
				description: `行${i}の計算完了（文字「${char1}」の処理完了）`,
				array: [],
				operation: "行計算完了",
				variables: {
					completedRow: i,
					processedChar: char1,
					currentMaxLCS: Math.max(
						...this.dpTable[i].slice(0, n + 1).map((cell) => cell.value),
					),
					progress: `${i}/${m}行完了`,
				},
			});

			// 古いセルのisNewフラグをリセット
			for (let row = 0; row < i; row++) {
				for (let col = 0; col <= n; col++) {
					this.dpTable[row][col].isNew = false;
				}
			}
		}
	}

	/**
	 * バックトラックでLCSを構築
	 */
	private backtrackLCS(
		str1: string,
		str2: string,
		m: number,
		n: number,
	): string {
		this.steps.push({
			id: this.stepId++,
			description: "バックトラックを開始してLCSを構築",
			array: [],
			operation: "バックトラック開始",
			variables: {
				startPosition: `dp[${m}][${n}]`,
				lcsLength: this.dpTable[m][n].value,
				method: "右下から左上に向かって逆算",
			},
		});

		const lcs: string[] = [];
		let i = m;
		let j = n;

		while (i > 0 && j > 0) {
			const currentCell = this.dpTable[i][j];
			const char1 = str1[i - 1];
			const char2 = str2[j - 1];

			if (char1 === char2) {
				// 文字が一致：LCSに追加して斜め上に移動
				lcs.unshift(char1);
				this.steps.push({
					id: this.stepId++,
					description: `文字「${char1}」をLCSに追加 → dp[${i - 1}][${j - 1}]に移動`,
					array: [],
					operation: "バックトラック",
					variables: {
						currentPosition: `dp[${i}][${j}]`,
						char: char1,
						action: "文字をLCSに追加",
						direction: "斜め上",
						nextPosition: `dp[${i - 1}][${j - 1}]`,
						currentLCS: lcs.join(""),
					},
				});
				i--;
				j--;
			} else {
				// 文字が不一致：より大きい値の方向に移動
				const upValue = this.dpTable[i - 1][j].value;
				const leftValue = this.dpTable[i][j - 1].value;

				if (upValue >= leftValue) {
					this.steps.push({
						id: this.stepId++,
						description: `文字不一致「${char1}」≠「${char2}」→ 上方向に移動`,
						array: [],
						operation: "バックトラック",
						variables: {
							currentPosition: `dp[${i}][${j}]`,
							char1: char1,
							char2: char2,
							upValue: upValue,
							leftValue: leftValue,
							direction: "上",
							nextPosition: `dp[${i - 1}][${j}]`,
						},
					});
					i--;
				} else {
					this.steps.push({
						id: this.stepId++,
						description: `文字不一致「${char1}」≠「${char2}」→ 左方向に移動`,
						array: [],
						operation: "バックトラック",
						variables: {
							currentPosition: `dp[${i}][${j}]`,
							char1: char1,
							char2: char2,
							upValue: upValue,
							leftValue: leftValue,
							direction: "左",
							nextPosition: `dp[${i}][${j - 1}]`,
						},
					});
					j--;
				}
			}
		}

		const result = lcs.join("");

		this.steps.push({
			id: this.stepId++,
			description: `バックトラック完了！LCS：「${result}」`,
			array: [],
			operation: "バックトラック完了",
			variables: {
				finalLCS: result,
				length: result.length,
				explanation: "右下から左上への逆算により最長共通部分列を構築完了",
			},
		});

		return result;
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: { string1: "ABCDGH", string2: "AEDFHR" },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
最長共通部分列（Longest Common Subsequence, LCS）は、二つの文字列の共通する部分列の中で最も長いものを効率的に求める動的計画法のアルゴリズムです。

【ポイント】**問題の定義**
- 二つの文字列が与えられる
- 両方の文字列に共通して現れる部分列を探す
- その中で最も長いもの（LCS）を求める
- 部分列：元の順序を保ったまま文字を抜き出したもの

【解析】**動的計画法のアプローチ**
- dp[i][j] = string1[0..i-1]とstring2[0..j-1]のLCSの長さ
- 二次元テーブルでボトムアップに解を構築
- 各文字に対して「一致/不一致」を考慮

 **状態遷移の規則**
1. 文字が一致する場合：
   - dp[i][j] = dp[i-1][j-1] + 1
2. 文字が一致しない場合：
   - dp[i][j] = max(dp[i-1][j], dp[i][j-1])

【計算量】**計算量の特徴**
- 時間計算量: O(m×n) - 各文字列の長さの積
- 空間計算量: O(m×n) - DPテーブルのサイズ
- 全探索のO(2^min(m,n))から大幅に改善

**バックトラック（解の復元）**
- DPテーブルの右下から左上に向かって逆算
- 文字が一致した位置でLCSに文字を追加
- 実際の部分列を構築

 **実用的な応用**
- DNAシーケンス解析（遺伝子配列の比較）
- テキストの差分検出（diff, git）
- プログラムのバージョン管理
- 文書の類似度判定
- バイオインフォマティクス

【ヒント】**学習価値**
- 二次元DPの代表的な例
- 文字列アルゴリズムの基礎
- バックトラックによる解の復元
- 最適化問題への応用力

【詳細】**具体例**
- string1: "ABCDGH", string2: "AEDFHR"
- LCS: "ADH" (長さ3)
- 部分列は元の順序を保持：A→D→H

**重要なポイント**
- 部分列 ≠ 部分文字列（連続である必要なし）
- 複数のLCSが存在する場合がある
- 動的計画法により効率的に解ける
- 実世界の様々な問題に応用可能
		`.trim();
	}

	/**
	 * 推奨する入力例を取得
	 */
	static getRecommendedInputs(): {
		string1: string;
		string2: string;
		description: string;
		expectedLCS: string;
		expectedLength: number;
	}[] {
		return [
			{
				string1: "ABCDGH",
				string2: "AEDFHR",
				description: "基本例：中程度の複雑さ",
				expectedLCS: "ADH",
				expectedLength: 3,
			},
			{
				string1: "AGGTAB",
				string2: "GXTXAYB",
				description: "標準例：よく使われる例",
				expectedLCS: "GTAB",
				expectedLength: 4,
			},
			{
				string1: "ABC",
				string2: "ABC",
				description: "完全一致：LCS = 全体",
				expectedLCS: "ABC",
				expectedLength: 3,
			},
			{
				string1: "ABC",
				string2: "DEF",
				description: "共通文字なし：LCS = 空文字列",
				expectedLCS: "",
				expectedLength: 0,
			},
			{
				string1: "HELLO",
				string2: "HELP",
				description: "類似文字列：部分的一致",
				expectedLCS: "HEL",
				expectedLength: 3,
			},
			{
				string1: "COMPUTER",
				string2: "OUTER",
				description: "複雑な例：効率性を実感",
				expectedLCS: "OUTER",
				expectedLength: 5,
			},
		];
	}

	/**
	 * DPテーブルのサイズを計算
	 * @param str1Length 文字列1の長さ
	 * @param str2Length 文字列2の長さ
	 * @returns テーブルサイズ情報
	 */
	static calculateTableSize(
		str1Length: number,
		str2Length: number,
	): {
		rows: number;
		cols: number;
		total: number;
	} {
		const rows = str1Length + 1;
		const cols = str2Length + 1;
		return {
			rows,
			cols,
			total: rows * cols,
		};
	}

	/**
	 * 指定した文字列のLCSを解く（検証用）
	 * @param str1 文字列1
	 * @param str2 文字列2
	 * @returns LCSの長さと文字列
	 */
	static solve(str1: string, str2: string): { length: number; lcs: string } {
		const m = str1.length;
		const n = str2.length;
		const dp = Array(m + 1)
			.fill(null)
			.map(() => Array(n + 1).fill(0));

		// DPテーブルを構築
		for (let i = 1; i <= m; i++) {
			for (let j = 1; j <= n; j++) {
				if (str1[i - 1] === str2[j - 1]) {
					dp[i][j] = dp[i - 1][j - 1] + 1;
				} else {
					dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
				}
			}
		}

		// バックトラックでLCSを構築
		const lcs: string[] = [];
		let i = m;
		let j = n;
		while (i > 0 && j > 0) {
			if (str1[i - 1] === str2[j - 1]) {
				lcs.unshift(str1[i - 1]);
				i--;
				j--;
			} else if (dp[i - 1][j] >= dp[i][j - 1]) {
				i--;
			} else {
				j--;
			}
		}

		return {
			length: dp[m][n],
			lcs: lcs.join(""),
		};
	}
}
