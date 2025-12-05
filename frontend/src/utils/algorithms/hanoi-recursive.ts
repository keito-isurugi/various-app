/**
 * src/utils/algorithms/hanoi-recursive.ts
 *
 * ハノイの塔（再帰）アルゴリズムの実装
 * 教育目的でステップバイステップの分割統治法をサポート
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 杭の名前（A、B、C）
 */
type Tower = "A" | "B" | "C";

/**
 * 円盤の移動操作
 */
interface DiskMove {
	disk: number; // 移動する円盤のサイズ
	from: Tower; // 移動元の杭
	to: Tower; // 移動先の杭
	moveNumber: number; // 移動回数（1から始まる）
}

/**
 * 塔の状態（各杭の円盤スタック）
 */
interface TowerState {
	A: number[]; // 杭Aの円盤スタック（下から上へ）
	B: number[]; // 杭Bの円盤スタック（下から上へ）
	C: number[]; // 杭Cの円盤スタック（下から上へ）
}

/**
 * 再帰呼び出しの詳細情報
 */
interface HanoiCall {
	n: number; // 移動する円盤数
	from: Tower; // 移動元
	to: Tower; // 移動先
	aux: Tower; // 補助杭
	depth: number; // 再帰の深さ
	callId: string; // 呼び出しID
	parentCallId?: string; // 親の呼び出しID
	phase?: string; // 現在のフェーズ
}

/**
 * ハノイの塔（再帰）アルゴリズムクラス
 *
 * 分割統治法による再帰的解法
 * 時間計算量: O(2^n) - 指数的
 * 空間計算量: O(n) - 再帰の深さ
 * 移動回数: 2^n - 1 （最適解）
 */
export class HanoiRecursiveAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "hanoi-recursive",
		name: "ハノイの塔（再帰）",
		description:
			"分割統治法による再帰的解法。3つの杭を使って全ての円盤を移動する古典的パズルで、再帰アルゴリズムの美しい応用例",
		category: "divide",
		timeComplexity: {
			best: "O(2^n)", // 常に指数的
			average: "O(2^n)", // 常に指数的
			worst: "O(2^n)", // 常に指数的
		},
		difficulty: 4, // 上級（概念は理解しやすいが、再帰と指数的複雑さの理解が必要）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private callStack: HanoiCall[] = [];
	private callCounter = 0;
	private maxDepth = 0;
	private totalMoves = 0;
	private currentState: TowerState = { A: [], B: [], C: [] };

	/**
	 * ハノイの塔（再帰）を実行
	 * @param input n枚の円盤を杭Aから杭Cに移動
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
			throw new Error("円盤の枚数（n）が指定されていません");
		}

		// 入力値の検証
		if (!Number.isInteger(n) || n < 1) {
			throw new Error("円盤の枚数は1以上の整数である必要があります");
		}

		if (n > 10) {
			throw new Error(
				"教育目的のため、円盤の枚数は10枚以下に制限されています（計算時間とメモリ使用量のため）",
			);
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.callStack = [];
		this.callCounter = 0;
		this.maxDepth = 0;
		this.totalMoves = 0;

		// 初期状態の設定（杭Aに全円盤を配置）
		this.currentState = {
			A: Array.from({ length: n }, (_, i) => n - i), // 大きい円盤から小さい円盤へ
			B: [],
			C: [],
		};

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `ハノイの塔（再帰）開始：${n}枚の円盤を杭Aから杭Cに移動します`,
			array: [], // ハノイの塔では配列は使用しない
			operation: "初期化",
			variables: {
				n: n,
				goal: "杭A → 杭C への全円盤移動",
				rules: "①1回に1枚 ②大きい円盤を小さい円盤の上に置けない",
				expectedMoves: 2 ** n - 1,
				towerA: [...this.currentState.A],
				towerB: [...this.currentState.B],
				towerC: [...this.currentState.C],
			},
		});

		// ハノイの塔の再帰計算を実行
		this.hanoi(n, "A", "C", "B");

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` 完了！${n}枚の円盤を${this.totalMoves}回の移動で杭Cに移動しました`,
			array: [],
			operation: "完了",
			variables: {
				n: n,
				totalMoves: this.totalMoves,
				expectedMoves: 2 ** n - 1,
				efficiency: `最適解: ${this.totalMoves}回 = 2^${n} - 1`,
				maxDepth: this.maxDepth,
				timeComplexity: this.info.timeComplexity.average,
				finalState: "全円盤が杭Cに移動完了",
				towerA: [...this.currentState.A],
				towerB: [...this.currentState.B],
				towerC: [...this.currentState.C],
			},
		});

		return {
			success: true,
			result: `${this.totalMoves}回の移動で完了`,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
		};
	}

	/**
	 * ハノイの塔の再帰解法（可視化付き）
	 * @param n 移動する円盤の枚数
	 * @param from 移動元の杭
	 * @param to 移動先の杭
	 * @param aux 補助杭
	 * @param depth 現在の再帰の深さ（デフォルト: 0）
	 * @param parentCallId 親の呼び出しID（デフォルト: undefined）
	 */
	private hanoi(
		n: number,
		from: Tower,
		to: Tower,
		aux: Tower,
		depth = 0,
		parentCallId?: string,
	): void {
		// 再帰呼び出し情報を記録
		const callId = `call_${this.callCounter++}`;
		this.maxDepth = Math.max(this.maxDepth, depth);

		const currentCall: HanoiCall = {
			n: n,
			from: from,
			to: to,
			aux: aux,
			depth: depth,
			callId: callId,
			parentCallId: parentCallId,
			phase: "開始",
		};

		// 関数呼び出し開始のステップ
		this.steps.push({
			id: this.stepId++,
			description: `hanoi(${n}, ${from}, ${to}, ${aux}) の計算開始（深度: ${depth}）`,
			array: [],
			operation: "関数呼び出し",
			variables: {
				n: n,
				from: from,
				to: to,
				aux: aux,
				depth: depth,
				callId: callId,
				parentCallId: parentCallId || "なし",
				purpose: `${n}枚の円盤を${from}杭から${to}杭に移動`,
				towerA: [...this.currentState.A],
				towerB: [...this.currentState.B],
				towerC: [...this.currentState.C],
			},
		});

		// コールスタックに追加
		this.callStack.push(currentCall);

		// ベースケース：1枚の円盤の場合
		if (n === 1) {
			this.steps.push({
				id: this.stepId++,
				description: `ベースケース：1枚の円盤を${from}杭から${to}杭に直接移動`,
				array: [],
				operation: "ベースケース",
				variables: {
					n: n,
					from: from,
					to: to,
					depth: depth,
					callId: callId,
					action: "直接移動",
					reason: "1枚なので制約に関係なく移動可能",
				},
			});

			// 実際の円盤移動を実行
			this.moveDisk(1, from, to);

			// コールスタックから削除
			this.callStack.pop();

			this.steps.push({
				id: this.stepId++,
				description: `hanoi(${n}, ${from}, ${to}, ${aux}) 完了（深度: ${depth}）`,
				array: [],
				operation: "関数完了",
				variables: {
					n: n,
					depth: depth,
					callId: callId,
					completed: true,
					towerA: [...this.currentState.A],
					towerB: [...this.currentState.B],
					towerC: [...this.currentState.C],
				},
			});

			return;
		}

		// 再帰ケース：n枚の円盤を3段階で移動
		this.steps.push({
			id: this.stepId++,
			description: `再帰ケース：${n}枚の問題を3つのサブ問題に分割`,
			array: [],
			operation: "問題分割",
			variables: {
				n: n,
				from: from,
				to: to,
				aux: aux,
				depth: depth,
				callId: callId,
				strategy: "分割統治法",
				step1: `上の${n - 1}枚を${from}杭から${aux}杭に移動`,
				step2: `最下段の円盤を${from}杭から${to}杭に移動`,
				step3: `${aux}杭の${n - 1}枚を${to}杭に移動`,
			},
		});

		// ステップ1：上のn-1枚を補助杭に移動
		currentCall.phase = "ステップ1";
		this.steps.push({
			id: this.stepId++,
			description: `ステップ1開始：上の${n - 1}枚を${from}杭から${aux}杭に移動（${to}杭を補助として使用）`,
			array: [],
			operation: "ステップ1開始",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				phase: "ステップ1",
				subProblem: `hanoi(${n - 1}, ${from}, ${aux}, ${to})`,
				purpose: "最下段の円盤を露出させるため",
			},
		});

		this.hanoi(n - 1, from, aux, to, depth + 1, callId);

		this.steps.push({
			id: this.stepId++,
			description: `ステップ1完了：上の${n - 1}枚が${aux}杭に移動完了`,
			array: [],
			operation: "ステップ1完了",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				phase: "ステップ1完了",
				result: `${n - 1}枚が${aux}杭に配置済み`,
				nextStep: `最下段の円盤（サイズ${n}）を移動`,
				towerA: [...this.currentState.A],
				towerB: [...this.currentState.B],
				towerC: [...this.currentState.C],
			},
		});

		// ステップ2：最下段の円盤を目標杭に移動
		currentCall.phase = "ステップ2";
		this.steps.push({
			id: this.stepId++,
			description: `ステップ2：最下段の円盤（サイズ${n}）を${from}杭から${to}杭に移動`,
			array: [],
			operation: "ステップ2実行",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				phase: "ステップ2",
				diskSize: n,
				from: from,
				to: to,
				reason: "最大の円盤なので他の円盤の下に配置可能",
			},
		});

		// 最下段の円盤を移動
		this.moveDisk(n, from, to);

		this.steps.push({
			id: this.stepId++,
			description: `ステップ2完了：最下段の円盤が${to}杭に移動完了`,
			array: [],
			operation: "ステップ2完了",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				phase: "ステップ2完了",
				result: `最大円盤（サイズ${n}）が${to}杭の底に配置`,
				nextStep: `${aux}杭の${n - 1}枚を${to}杭に移動`,
				towerA: [...this.currentState.A],
				towerB: [...this.currentState.B],
				towerC: [...this.currentState.C],
			},
		});

		// ステップ3：補助杭のn-1枚を目標杭に移動
		currentCall.phase = "ステップ3";
		this.steps.push({
			id: this.stepId++,
			description: `ステップ3開始：${aux}杭の${n - 1}枚を${to}杭に移動（${from}杭を補助として使用）`,
			array: [],
			operation: "ステップ3開始",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				phase: "ステップ3",
				subProblem: `hanoi(${n - 1}, ${aux}, ${to}, ${from})`,
				purpose: "全ての円盤を目標杭に集結",
			},
		});

		this.hanoi(n - 1, aux, to, from, depth + 1, callId);

		this.steps.push({
			id: this.stepId++,
			description: `ステップ3完了：${n}枚の円盤移動が完了`,
			array: [],
			operation: "ステップ3完了",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				phase: "ステップ3完了",
				result: `${n}枚全てが${to}杭に正しい順序で配置`,
				achievement: "分割統治法による完全解決",
				towerA: [...this.currentState.A],
				towerB: [...this.currentState.B],
				towerC: [...this.currentState.C],
			},
		});

		// コールスタックから削除
		this.callStack.pop();

		this.steps.push({
			id: this.stepId++,
			description: `hanoi(${n}, ${from}, ${to}, ${aux}) 完了（深度: ${depth}）`,
			array: [],
			operation: "関数完了",
			variables: {
				n: n,
				depth: depth,
				callId: callId,
				completed: true,
				summary: `${n}枚の円盤を${from}杭から${to}杭に移動完了`,
			},
		});
	}

	/**
	 * 円盤を実際に移動する（状態更新と可視化）
	 * @param disk 移動する円盤のサイズ
	 * @param from 移動元の杭
	 * @param to 移動先の杭
	 */
	private moveDisk(disk: number, from: Tower, to: Tower): void {
		// 移動前の状態チェック
		const fromStack = this.currentState[from];
		const toStack = this.currentState[to];

		if (fromStack.length === 0) {
			throw new Error(`杭${from}に円盤がありません`);
		}

		const topDisk = fromStack[fromStack.length - 1];
		if (topDisk !== disk) {
			throw new Error(
				`杭${from}の最上段は円盤${topDisk}ですが、円盤${disk}の移動が要求されました`,
			);
		}

		if (toStack.length > 0 && toStack[toStack.length - 1] < disk) {
			throw new Error(
				`円盤${disk}を円盤${toStack[toStack.length - 1]}の上に置くことはできません`,
			);
		}

		// 円盤を移動
		const movedDisk = fromStack.pop();
		if (movedDisk !== undefined) {
			toStack.push(movedDisk);
			this.totalMoves++;

			// 移動のステップを記録
			this.steps.push({
				id: this.stepId++,
				description: ` 移動 ${this.totalMoves}: 円盤${disk}を杭${from}から杭${to}に移動`,
				array: [],
				operation: "円盤移動",
				variables: {
					moveNumber: this.totalMoves,
					disk: disk,
					from: from,
					to: to,
					towerA: [...this.currentState.A],
					towerB: [...this.currentState.B],
					towerC: [...this.currentState.C],
					isValidMove: true,
				},
			});
		}
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [], // ハノイの塔では配列は使用しない
			target: 3, // 3枚の円盤
			parameters: { n: 3 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
ハノイの塔（再帰）は、分割統治法の美しい応用例として有名な古典的パズルです。

【構造】**問題設定**
- 3本の杭（A、B、C）と異なるサイズのn枚の円盤
- 全円盤を杭Aから杭Cに移動することが目標
- 制約：①1回に1枚しか移動できない ②大きい円盤を小さい円盤の上に置けない

 **分割統治の思考**
- n枚の問題を3つのサブ問題に分解
- ①上のn-1枚を補助杭に移動 ②最下段を目標杭に移動 ③補助杭からn-1枚を目標杭に移動
- 各サブ問題は同じ構造を持つため再帰的に解決

 **指数的複雑さ**
- 最小移動回数：2^n - 1 回
- 時間計算量：O(2^n) - 指数的増加
- 空間計算量：O(n) - 再帰の深さ

【ポイント】**学習価値**
- 分割統治法の理解
- 再帰的思考の訓練
- 指数的複雑さの体感
- 最適化アルゴリズムの存在証明

【ヒント】**数学的洞察**
- 移動パターンと二進数の関係
- Gray符号との対応
- 各円盤の移動回数：円盤kは2^(k-1)回移動
		`.trim();
	}

	/**
	 * 指定した枚数での予想移動回数を計算
	 * @param n 円盤の枚数
	 * @returns 最小移動回数
	 */
	static calculateMinMoves(n: number): number {
		return 2 ** n - 1;
	}

	/**
	 * 指定した枚数での予想実行時間を算出
	 * @param n 円盤の枚数
	 * @returns 予想実行時間の説明
	 */
	static estimateExecutionTime(n: number): string {
		if (n <= 3) return "瞬時";
		if (n <= 5) return "< 10ms";
		if (n <= 7) return "< 100ms";
		if (n <= 10) return "< 1s";
		return "数秒以上";
	}

	/**
	 * 教育目的の適切なnの値を提案
	 * @returns 推奨値の配列
	 */
	static getRecommendedValues(): {
		n: number;
		description: string;
		moves: number;
		insight: string;
	}[] {
		return [
			{
				n: 1,
				description: "最小ケース",
				moves: 1,
				insight: "ベースケースの理解",
			},
			{
				n: 2,
				description: "基本的な分割",
				moves: 3,
				insight: "3ステップの確認",
			},
			{
				n: 3,
				description: "再帰構造の理解",
				moves: 7,
				insight: "分割統治の実感",
			},
			{
				n: 4,
				description: "複雑さの増加",
				moves: 15,
				insight: "指数的増加の体感",
			},
			{
				n: 5,
				description: "実用的なサイズ",
				moves: 31,
				insight: "パターンの発見",
			},
			{
				n: 6,
				description: "中程度の複雑さ",
				moves: 63,
				insight: "最適化の必要性",
			},
			{
				n: 7,
				description: "大きめのケース",
				moves: 127,
				insight: "計算量の実感",
			},
			{
				n: 8,
				description: "上級者向け",
				moves: 255,
				insight: "実用限界の理解",
			},
		];
	}

	/**
	 * 指定した枚数でのより詳細な統計情報を取得
	 * @param n 円盤の枚数
	 * @returns 統計情報
	 */
	static getStatistics(n: number): {
		totalMoves: number;
		totalCalls: number;
		maxDepth: number;
		timeComplexity: string;
	} {
		return {
			totalMoves: 2 ** n - 1,
			totalCalls: 2 ** n - 1, // 各移動につき1回の関数呼び出し
			maxDepth: n, // 最大再帰深度
			timeComplexity: `O(2^${n})`,
		};
	}
}
