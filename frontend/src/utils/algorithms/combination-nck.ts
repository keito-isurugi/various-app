/**
 * src/utils/algorithms/combination-nck.ts
 *
 * nCk組み合わせ計算アルゴリズムの実装
 * 数学的基礎から効率的実装まで複数の手法を提供する組み合わせ数学アルゴリズム
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 計算方法を表す型
 */
type CombinationMethod = "factorial" | "optimized" | "pascal" | "iterative";

/**
 * nCk組み合わせ計算の各ステップの状態を表す型
 */
interface CombinationStep {
	step: number; // ステップ番号
	n: number; // 全体の要素数
	k: number; // 選択する要素数
	calculation: string; // 計算式
	result: number; // 現在の結果
	explanation: string; // ステップの説明
	method: string; // 使用した計算方法
	isNew?: boolean; // 新しく計算されたステップかどうか
}

/**
 * nCk組み合わせ計算アルゴリズムクラス
 *
 * C(n,k) = n!/(k!×(n-k)!) を効率的に計算する数学的アルゴリズム
 * 階乗計算、最適化手法、パスカルの三角形、逐次計算の4つの手法を提供
 * 時間計算量: O(min(k, n-k))（最適化版）
 * 空間計算量: O(1)（基本版）または O(k)（パスカル版）
 */
export class CombinationNCkAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "combination-nck",
		name: "nCk組み合わせ計算",
		description:
			"組み合わせ数学の基本的な計算C(n,k)を複数の手法で効率的に実装。確率論と統計学の基盤",
		category: "other",
		timeComplexity: {
			best: "O(1)", // k=0,n の場合
			average: "O(min(k, n-k))", // 最適化版
			worst: "O(n)", // 階乗版
		},
		difficulty: 2, // 初中級（数学的理解が必要）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private combinationSteps: CombinationStep[] = [];

	/**
	 * nCk組み合わせ計算を実行
	 * @param input 計算パラメータ（n, k, method）
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証と値の取得
		const n = input.parameters?.n as number;
		const k = input.parameters?.k as number;
		const method =
			(input.parameters?.method as CombinationMethod) || "optimized";

		if (!this.validateInputs(n, k, method)) {
			throw new Error("有効な入力パラメータが必要です");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.combinationSteps = [];

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `nCk組み合わせ計算開始：C(${n},${k}) を${this.getMethodDescription(method)}で計算`,
			array: [],
			operation: "初期化",
			variables: {
				n: n,
				k: k,
				formula: "C(n,k) = n!/(k!×(n-k)!)",
				method: this.getMethodDescription(method),
				explanation: "n個の要素からk個を選ぶ組み合わせの数",
				applications: "確率論、統計学、組合せ最適化",
			},
		});

		let result: number;

		// 計算方法に応じて実行
		switch (method) {
			case "factorial":
				result = this.performFactorialMethod(n, k);
				break;
			case "optimized":
				result = this.performOptimizedMethod(n, k);
				break;
			case "pascal":
				result = this.performPascalMethod(n, k);
				break;
			case "iterative":
				result = this.performIterativeMethod(n, k);
				break;
			default:
				throw new Error(`未対応の計算方法: ${method}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` nCk組み合わせ計算完了！C(${n},${k}) = ${result}`,
			array: [],
			operation: "完了",
			variables: {
				result: result,
				formula: `C(${n},${k}) = ${result}`,
				method: this.getMethodDescription(method),
				timeComplexity: this.getTimeComplexity(method, n, k),
				spaceComplexity: this.getSpaceComplexity(method),
				mathematicalSignificance: "組み合わせ数学と確率論の基礎",
				realWorldApplications: "ロッタリー、統計サンプリング、暗号学",
			},
		});

		return {
			success: true,
			result: result,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.getTimeComplexity(method, n, k),
			summary: {
				n: n,
				k: k,
				result: result,
				method: method,
				calculations: this.combinationSteps.length,
				efficiency: this.getEfficiencyAnalysis(method, n, k),
			},
		};
	}

	/**
	 * 入力値の検証
	 */
	private validateInputs(
		n: number,
		k: number,
		method: CombinationMethod,
	): boolean {
		// 基本的な数値チェック
		if (!Number.isInteger(n) || !Number.isInteger(k)) {
			throw new Error("nとkは整数である必要があります");
		}

		if (n < 0 || k < 0) {
			throw new Error("nとkは非負整数である必要があります");
		}

		if (k > n) {
			throw new Error("kはn以下である必要があります");
		}

		// 教育目的の制限
		if (n > 20) {
			throw new Error("教育目的のため、nは20以下に制限されています");
		}

		// 階乗方法での制限（オーバーフロー防止）
		if (method === "factorial" && n > 15) {
			throw new Error("階乗方法では、nは15以下に制限されています");
		}

		return true;
	}

	/**
	 * 階乗を使った基本的な計算方法
	 */
	private performFactorialMethod(n: number, k: number): number {
		this.steps.push({
			id: this.stepId++,
			description: `階乗方法：C(${n},${k}) = ${n}!/(${k}!×${n - k}!) を直接計算`,
			array: [],
			operation: "階乗計算開始",
			variables: {
				formula: `C(${n},${k}) = ${n}!/(${k}!×${n - k}!)`,
				method: "階乗の直接計算",
				warning: "大きな数値ではオーバーフローの可能性",
			},
		});

		// 階乗を計算
		const nFactorial = this.calculateFactorial(n, "n");
		const kFactorial = this.calculateFactorial(k, "k");
		const nMinusKFactorial = this.calculateFactorial(n - k, "n-k");

		const result = nFactorial / (kFactorial * nMinusKFactorial);

		this.steps.push({
			id: this.stepId++,
			description: `階乗計算完了：${nFactorial}/(${kFactorial}×${nMinusKFactorial}) = ${result}`,
			array: [],
			operation: "階乗計算完了",
			variables: {
				nFactorial: nFactorial,
				kFactorial: kFactorial,
				nMinusKFactorial: nMinusKFactorial,
				calculation: `${nFactorial}/(${kFactorial}×${nMinusKFactorial})`,
				result: result,
			},
		});

		return result;
	}

	/**
	 * 最適化された計算方法（オーバーフロー回避）
	 */
	private performOptimizedMethod(n: number, k: number): number {
		// k > n-k の場合は k = n-k に変更（計算量削減）
		const optimizedK = Math.min(k, n - k);

		this.steps.push({
			id: this.stepId++,
			description: `最適化方法：min(${k}, ${n - k}) = ${optimizedK} を使用して効率化`,
			array: [],
			operation: "最適化開始",
			variables: {
				originalK: k,
				optimizedK: optimizedK,
				optimization: "C(n,k) = C(n,n-k) の性質を利用",
				efficiency: `計算量をO(${k})からO(${optimizedK})に削減`,
			},
		});

		let result = 1;

		for (let i = 0; i < optimizedK; i++) {
			result = (result * (n - i)) / (i + 1);

			this.steps.push({
				id: this.stepId++,
				description: `ステップ${i + 1}：result = (result × ${n - i}) / ${i + 1} = ${result}`,
				array: [],
				operation: "逐次計算",
				variables: {
					iteration: i + 1,
					numerator: n - i,
					denominator: i + 1,
					currentResult: result,
					explanation: "乗算と除算を交互に行ってオーバーフロー回避",
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: `最適化計算完了：C(${n},${k}) = ${result}`,
			array: [],
			operation: "最適化完了",
			variables: {
				finalResult: result,
				iterations: optimizedK,
				efficiency: `O(min(${k}, ${n - k})) = O(${optimizedK})の計算量`,
			},
		});

		return result;
	}

	/**
	 * パスカルの三角形を使った動的計画法
	 */
	private performPascalMethod(n: number, k: number): number {
		this.steps.push({
			id: this.stepId++,
			description:
				"パスカルの三角形方法：C(i,j) = C(i-1,j-1) + C(i-1,j) の漸化式を利用",
			array: [],
			operation: "パスカル開始",
			variables: {
				formula: "C(i,j) = C(i-1,j-1) + C(i-1,j)",
				approach: "動的計画法による底上げ式計算",
				spaceComplexity: `O(min(k, n-k)) = O(${Math.min(k, n - k)})`,
			},
		});

		// 空間効率化のため、必要な部分のみ計算
		const minK = Math.min(k, n - k);
		let prev = new Array(minK + 1).fill(0);
		let curr = new Array(minK + 1).fill(0);

		prev[0] = 1;

		for (let i = 1; i <= n; i++) {
			curr[0] = 1;

			for (let j = 1; j <= Math.min(i, minK); j++) {
				curr[j] = prev[j - 1] + (prev[j] || 0);
			}

			this.steps.push({
				id: this.stepId++,
				description: `行${i}完了：${curr.slice(0, Math.min(i + 1, minK + 1)).join(", ")}`,
				array: [...curr.slice(0, Math.min(i + 1, minK + 1))],
				operation: "パスカル行計算",
				variables: {
					row: i,
					values: curr.slice(0, Math.min(i + 1, minK + 1)),
					targetPosition: k > n - k ? n - k : k,
				},
			});

			// 配列を入れ替え
			[prev, curr] = [curr, prev];
			curr.fill(0);
		}

		const result = prev[minK];

		this.steps.push({
			id: this.stepId++,
			description: `パスカル計算完了：C(${n},${k}) = ${result}`,
			array: [],
			operation: "パスカル完了",
			variables: {
				result: result,
				rows: n,
				spaceUsed: minK + 1,
				efficiency: "動的計画法によるボトムアップ計算",
			},
		});

		return result;
	}

	/**
	 * 逐次計算方法（安全版）
	 */
	private performIterativeMethod(n: number, k: number): number {
		this.steps.push({
			id: this.stepId++,
			description: `逐次計算方法：安全な乗除算で C(${n},${k}) を計算`,
			array: [],
			operation: "逐次計算開始",
			variables: {
				approach: "数値の安定性を重視した逐次計算",
				advantage: "中間結果が常に整数",
			},
		});

		if (k === 0 || k === n) {
			this.steps.push({
				id: this.stepId++,
				description: `特別ケース：C(${n},${k}) = 1`,
				array: [],
				operation: "特別ケース",
				variables: {
					explanation: k === 0 ? "何も選ばない場合" : "全て選ぶ場合",
					result: 1,
				},
			});
			return 1;
		}

		// k > n/2 の場合は k = n-k で計算量削減
		const actualK = k > n - k ? n - k : k;
		let result = 1;

		for (let i = 0; i < actualK; i++) {
			result = (result * (n - i)) / (i + 1);

			this.steps.push({
				id: this.stepId++,
				description: `ステップ${i + 1}：(${(result * (i + 1)) / (n - i)} × ${n - i}) ÷ ${i + 1} = ${result}`,
				array: [],
				operation: "逐次乗除算",
				variables: {
					step: i + 1,
					multiplier: n - i,
					divisor: i + 1,
					intermediateResult: result,
					remainingSteps: actualK - i - 1,
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: `逐次計算完了：C(${n},${k}) = ${result}`,
			array: [],
			operation: "逐次計算完了",
			variables: {
				result: result,
				stepsUsed: actualK,
				safetyGuarantee: "すべての中間結果が整数",
			},
		});

		return result;
	}

	/**
	 * 階乗を計算（ステップ記録付き）
	 */
	private calculateFactorial(num: number, label: string): number {
		if (num === 0 || num === 1) {
			this.steps.push({
				id: this.stepId++,
				description: `${label}! = ${num}! = 1`,
				array: [],
				operation: "階乗計算",
				variables: {
					number: num,
					result: 1,
					explanation: "0! = 1, 1! = 1 (定義)",
				},
			});
			return 1;
		}

		let result = 1;
		const sequence = [];

		for (let i = 1; i <= num; i++) {
			result *= i;
			sequence.push(i);
		}

		this.steps.push({
			id: this.stepId++,
			description: `${label}! = ${num}! = ${sequence.join(" × ")} = ${result}`,
			array: [],
			operation: "階乗計算",
			variables: {
				number: num,
				sequence: sequence,
				result: result,
				calculation: sequence.join(" × "),
			},
		});

		return result;
	}

	/**
	 * 計算方法の説明を取得
	 */
	private getMethodDescription(method: CombinationMethod): string {
		const descriptions = {
			factorial: "階乗による直接計算",
			optimized: "最適化された効率的計算",
			pascal: "パスカルの三角形（動的計画法）",
			iterative: "逐次計算（安全版）",
		};
		return descriptions[method] || "組み合わせ計算";
	}

	/**
	 * 時間計算量を取得
	 */
	private getTimeComplexity(
		method: CombinationMethod,
		n: number,
		k: number,
	): string {
		switch (method) {
			case "factorial":
				return `O(n) = O(${n})`;
			case "optimized":
			case "iterative":
				return `O(min(k, n-k)) = O(${Math.min(k, n - k)})`;
			case "pascal":
				return `O(n × min(k, n-k)) = O(${n} × ${Math.min(k, n - k)})`;
			default:
				return "O(min(k, n-k))";
		}
	}

	/**
	 * 空間計算量を取得
	 */
	private getSpaceComplexity(method: CombinationMethod): string {
		switch (method) {
			case "factorial":
			case "optimized":
			case "iterative":
				return "O(1)";
			case "pascal":
				return "O(min(k, n-k))";
			default:
				return "O(1)";
		}
	}

	/**
	 * 効率性分析を取得
	 */
	private getEfficiencyAnalysis(
		method: CombinationMethod,
		n: number,
		k: number,
	): string {
		const minK = Math.min(k, n - k);
		switch (method) {
			case "factorial":
				return `階乗計算：${n + k + (n - k)}回の乗算`;
			case "optimized":
			case "iterative":
				return `最適化：${minK}回の演算で完了`;
			case "pascal":
				return `動的計画法：${n * minK}回の加算`;
			default:
				return "効率的な計算";
		}
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				n: 5,
				k: 2,
				method: "optimized",
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
nCk組み合わせ計算（Combination）は、n個の要素からk個を選ぶ組み合わせの数を求める基本的な数学的アルゴリズムです。確率論、統計学、組合せ最適化において中核的な役割を果たしています。

【ポイント】**基本的な定義**
- C(n,k) = n!/(k!×(n-k)!)
- n個の要素からk個を順序を考慮せずに選ぶ場合の数
- 対称性：C(n,k) = C(n,n-k)

【解析】**重要な性質**
- C(n,0) = C(n,n) = 1（何も選ばない／全て選ぶ）
- C(n,1) = C(n,n-1) = n（1個選ぶ／1個残す）
- パスカルの恒等式：C(n,k) = C(n-1,k-1) + C(n-1,k)

【計算量】**効率的な計算手法**
- 最適化版：min(k, n-k)を使用してO(min(k, n-k))
- パスカルの三角形：動的計画法でボトムアップ計算
- 逐次計算：オーバーフロー回避の安全な実装

【詳細】**実装上の注意点**
- 階乗の直接計算は大きな数でオーバーフロー
- 乗算と除算を交互に行って中間結果を制御
- 対称性を利用した計算量の削減

 **実用的な応用**
- 確率論：事象の組み合わせ計算
- 統計学：標本抽出とサンプリング理論
- 暗号学：鍵空間の大きさ評価
- 機械学習：特徴選択とモデル選択

【ヒント】**学習価値**
- 組み合わせ数学の基礎概念
- 効率的アルゴリズム設計の考え方
- 数値計算の安定性と精度
- 動的計画法の実践的応用

【数値】**計算例**
- C(5,2) = 5!/(2!×3!) = 120/(2×6) = 10
- C(10,3) = 10×9×8/(3×2×1) = 120
- C(n,0) = 1, C(n,n) = 1（境界条件）

**重要なポイント**
- 対称性を活用した効率化
- オーバーフロー対策の重要性
- 動的計画法との関連性
- 実世界での豊富な応用例
		`.trim();
	}

	/**
	 * 推奨する入力例を取得
	 */
	static getRecommendedInputs(): {
		n: number;
		k: number;
		method: CombinationMethod;
		description: string;
		expectedResult: number;
	}[] {
		return [
			{
				n: 5,
				k: 2,
				method: "optimized",
				description: "基本例：C(5,2)",
				expectedResult: 10,
			},
			{
				n: 4,
				k: 0,
				method: "optimized",
				description: "境界例：C(4,0)",
				expectedResult: 1,
			},
			{
				n: 6,
				k: 3,
				method: "pascal",
				description: "パスカル：C(6,3)",
				expectedResult: 20,
			},
			{
				n: 8,
				k: 2,
				method: "factorial",
				description: "階乗版：C(8,2)",
				expectedResult: 28,
			},
			{
				n: 10,
				k: 5,
				method: "iterative",
				description: "対称例：C(10,5)",
				expectedResult: 252,
			},
			{
				n: 7,
				k: 1,
				method: "optimized",
				description: "簡単例：C(7,1)",
				expectedResult: 7,
			},
		];
	}

	/**
	 * 指定したnCk組み合わせ計算を解く（検証用）
	 * @param n 全体の要素数
	 * @param k 選択する要素数
	 * @param method 計算方法
	 * @returns 計算結果
	 */
	static solve(
		n: number,
		k: number,
		method: CombinationMethod = "optimized",
	): number {
		if (k > n || k < 0 || n < 0) {
			throw new Error("無効な入力: 0 ≤ k ≤ n である必要があります");
		}

		if (k === 0 || k === n) return 1;

		switch (method) {
			case "factorial":
				return CombinationNCkAlgorithm.factorialMethod(n, k);
			case "optimized":
			case "iterative":
				return CombinationNCkAlgorithm.optimizedMethod(n, k);
			case "pascal":
				return CombinationNCkAlgorithm.pascalMethod(n, k);
			default:
				return CombinationNCkAlgorithm.optimizedMethod(n, k);
		}
	}

	/**
	 * 階乗による計算の静的実装
	 */
	private static factorialMethod(n: number, k: number): number {
		const factorial = (num: number): number => {
			if (num <= 1) return 1;
			let result = 1;
			for (let i = 2; i <= num; i++) {
				result *= i;
			}
			return result;
		};

		return factorial(n) / (factorial(k) * factorial(n - k));
	}

	/**
	 * 最適化された計算の静的実装
	 */
	private static optimizedMethod(n: number, k: number): number {
		const minK = Math.min(k, n - k);
		let result = 1;

		for (let i = 0; i < minK; i++) {
			result = (result * (n - i)) / (i + 1);
		}

		return result;
	}

	/**
	 * パスカルの三角形による計算の静的実装
	 */
	private static pascalMethod(n: number, k: number): number {
		const minK = Math.min(k, n - k);
		let prev = new Array(minK + 1).fill(0);
		let curr = new Array(minK + 1).fill(0);

		prev[0] = 1;

		for (let i = 1; i <= n; i++) {
			curr[0] = 1;
			for (let j = 1; j <= Math.min(i, minK); j++) {
				curr[j] = prev[j - 1] + (prev[j] || 0);
			}
			[prev, curr] = [curr, prev];
			curr.fill(0);
		}

		return prev[minK];
	}
}
