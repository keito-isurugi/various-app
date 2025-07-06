"use client";

import React, { useState, useCallback, useMemo } from "react";
import { CalculationExplanation } from "../../components/calculator/CalculationExplanation";
import { CelestialBodySelector } from "../../components/calculator/CelestialBodySelector";
import { ParameterInput } from "../../components/calculator/ParameterInput";
import { ResultDisplay } from "../../components/calculator/ResultDisplay";
import type { CelestialBody } from "../../data/celestial-bodies";
import type {
	CalculationParameter,
	CalculationResult,
	ValidationResult,
} from "../../types/calculator";
import type { Calculator } from "../../types/calculator";
import { EscapeVelocityCalculator } from "../../utils/calculators/escape-velocity";
import { MassEnergyCalculator } from "../../utils/calculators/mass-energy";
import { SchwarzschildRadiusCalculator } from "../../utils/calculators/schwarzschild-radius";
import { getExplanationData } from "../../utils/explanation-provider";

/**
 * 計算ページのメインコンポーネント
 * 複数の計算機能をサポートする拡張可能な設計
 */
export default function CalculatorPage() {
	// 利用可能な計算機一覧
	const availableCalculators: Calculator[] = useMemo(
		() => [
			new SchwarzschildRadiusCalculator(),
			new EscapeVelocityCalculator(),
			new MassEnergyCalculator(),
		],
		[],
	);

	// 現在選択されている計算機
	const [selectedCalculatorId, setSelectedCalculatorId] = useState(
		availableCalculators[0].type,
	);
	const calculator =
		availableCalculators.find((calc) => calc.type === selectedCalculatorId) ||
		availableCalculators[0];

	// 状態管理
	const [parameters, setParameters] = useState<CalculationParameter[]>(
		calculator.getExampleParameters(),
	);
	const [results, setResults] = useState<CalculationResult[]>([]);
	const [isCalculating, setIsCalculating] = useState(false);
	const [validationResult, setValidationResult] = useState<ValidationResult>({
		isValid: true,
		errors: [],
		warnings: [],
	});
	const [selectedCelestialBody, setSelectedCelestialBody] =
		useState<CelestialBody | null>(null);

	/**
	 * 天体選択ハンドラー
	 */
	const handleCelestialBodySelect = useCallback(
		(body: CelestialBody | null) => {
			setSelectedCelestialBody(body);

			if (body) {
				// 質量パラメータを更新
				setParameters((prev) =>
					prev.map((param) => {
						if (param.id === "mass") {
							return { ...param, value: body.mass };
						}
						// 脱出速度計算機の場合は半径も更新
						if (
							param.id === "radius" &&
							body.radius &&
							selectedCalculatorId === "escape_velocity"
						) {
							return { ...param, value: body.radius };
						}
						return param;
					}),
				);
			}
		},
		[selectedCalculatorId],
	);

	/**
	 * パラメータ変更ハンドラー
	 */
	const handleParameterChange = useCallback(
		(updatedParameter: CalculationParameter) => {
			setParameters((prev) =>
				prev.map((param) =>
					param.id === updatedParameter.id ? updatedParameter : param,
				),
			);

			// 手動で質量を変更した場合は天体選択をリセット
			if (updatedParameter.id === "mass") {
				setSelectedCelestialBody(null);
			}
		},
		[],
	);

	/**
	 * 計算実行
	 */
	const handleCalculate = useCallback(async () => {
		setIsCalculating(true);

		try {
			// バリデーション
			const validation = calculator.validateParameters(parameters);
			setValidationResult(validation);

			if (!validation.isValid) {
				setResults([]);
				return;
			}

			// 計算実行
			const calculationResults = await Promise.resolve(
				calculator.calculate(parameters),
			);
			setResults(calculationResults);
		} catch (error) {
			console.error("計算エラー:", error);
			setValidationResult({
				isValid: false,
				errors: [
					error instanceof Error
						? error.message
						: "計算中にエラーが発生しました",
				],
				warnings: [],
			});
			setResults([]);
		} finally {
			setIsCalculating(false);
		}
	}, [calculator, parameters]);

	/**
	 * 計算機変更ハンドラー
	 */
	const handleCalculatorChange = useCallback(
		(calculatorId: string) => {
			setSelectedCalculatorId(calculatorId);
			const newCalculator = availableCalculators.find(
				(calc) => calc.type === calculatorId,
			);
			if (newCalculator) {
				const exampleParams = newCalculator.getExampleParameters();
				setParameters(exampleParams);
				setValidationResult({ isValid: true, errors: [], warnings: [] });
				setResults([]);
				setSelectedCelestialBody(null);
			}
		},
		[availableCalculators],
	);

	/**
	 * 例の値を読み込み
	 */
	const handleLoadExample = useCallback(() => {
		const exampleParams = calculator.getExampleParameters();
		setParameters(exampleParams);
		setValidationResult({ isValid: true, errors: [], warnings: [] });
		setResults([]);
		setSelectedCelestialBody(null);
	}, [calculator]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						物理計算ツール
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						各種物理量の計算を行うことができます。シュワルツシルト半径や脱出速度などの計算をサポートしています。
					</p>
				</header>

				{/* 計算機選択 */}
				<section className="mb-8">
					<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
						計算タイプ
					</h2>
					<div className="grid md:grid-cols-2 gap-4">
						{availableCalculators.map((calc) => (
							<button
								type="button"
								key={calc.type}
								onClick={() => handleCalculatorChange(calc.type)}
								className={`
									p-6 rounded-xl border-2 transition-all duration-200 text-left
									${
										calc.type === selectedCalculatorId
											? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-opacity-20"
											: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600"
									}
								`}
							>
								<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
									{calc.displayName}
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{calc.description}
								</p>
							</button>
						))}
					</div>
				</section>

				{/* 現在の計算機情報 */}
				<section className="mb-8">
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
						<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
							{calculator.displayName}
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							{calculator.description}
						</p>
					</div>
				</section>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* 入力セクション */}
					<section className="space-y-6">
						<div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
									パラメータ入力
								</h2>
								<button
									type="button"
									onClick={handleLoadExample}
									className="px-3 py-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
								>
									例の値を読み込み
								</button>
							</div>

							{/* 天体選択 */}
							<div className="mb-6">
								<CelestialBodySelector
									selectedBodyId={selectedCelestialBody?.id || null}
									onBodySelect={handleCelestialBodySelect}
									disabled={isCalculating}
								/>
							</div>

							{/* パラメータ入力フォーム */}
							<div className="space-y-4">
								{parameters.map((parameter) => (
									<ParameterInput
										key={parameter.id}
										parameter={parameter}
										onChange={handleParameterChange}
										disabled={isCalculating}
									/>
								))}
							</div>

							{/* エラー・警告表示 */}
							{(validationResult.errors.length > 0 ||
								validationResult.warnings.length > 0) && (
								<div className="space-y-2">
									{validationResult.errors.map((error, index) => (
										<div
											key={`error-${error.slice(0, 50)}-${Date.now()}-${index}`}
											className="flex items-center text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 p-3 rounded-md border border-red-200 dark:border-red-700/50"
										>
											<svg
												className="w-4 h-4 mr-2 flex-shrink-0"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<title>エラー</title>
												<path
													fillRule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
											{error}
										</div>
									))}
									{validationResult.warnings.map((warning, index) => (
										<div
											key={`warning-${warning.slice(0, 50)}-${Date.now()}-${index}`}
											className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md border border-yellow-200 dark:border-yellow-700/50"
										>
											<svg
												className="w-4 h-4 mr-2 flex-shrink-0"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<title>警告</title>
												<path
													fillRule="evenodd"
													d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
											{warning}
										</div>
									))}
								</div>
							)}

							{/* 計算ボタン */}
							<button
								type="button"
								onClick={handleCalculate}
								disabled={isCalculating || !validationResult.isValid}
								className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
									isCalculating || !validationResult.isValid
										? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed scale-100"
										: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isCalculating ? (
									<div className="flex items-center justify-center">
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
										計算中...
									</div>
								) : (
									"計算実行"
								)}
							</button>
						</div>
					</section>

					{/* 結果セクション */}
					<section className="space-y-6">
						<div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg">
							<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
								計算結果
							</h2>

							{results.length > 0 ? (
								<div className="space-y-4">
									{results.map((result) => (
										<ResultDisplay key={result.id} result={result} />
									))}
								</div>
							) : (
								<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl p-8 text-center">
									<div className="text-gray-400 dark:text-gray-500 mb-4">
										<svg
											className="w-16 h-16 mx-auto"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>計算機</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1}
												d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<p className="text-gray-500 dark:text-gray-400 text-lg">
										パラメータを入力して「計算実行」ボタンを押してください
									</p>
								</div>
							)}
						</div>
					</section>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					{(() => {
						const explanationData = getExplanationData(calculator.type);
						return explanationData ? (
							<CalculationExplanation
								explanationData={explanationData}
								defaultExpanded={false}
								className="shadow-xl"
							/>
						) : null;
					})()}
				</section>
			</div>
		</div>
	);
}
