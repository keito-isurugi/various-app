"use client";

import { AlertTriangle, ClipboardList, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { DataTable } from "../../components/big3/DataTable";
import { GenderSelector } from "../../components/big3/GenderSelector";
import { TargetWeights } from "../../components/big3/TargetWeights";
import { WeightInput } from "../../components/big3/WeightInput";
import type { ExerciseType, Gender } from "../../types/big3";
import { validateBodyWeightByGender } from "../../utils/big3-calculator-gender";

type TabType = "target" | ExerciseType;

export default function BIG3Page() {
	const [bodyWeight, setBodyWeight] = useState<number | "">("");
	const [activeTab, setActiveTab] = useState<TabType>("target");
	const [selectedGender, setSelectedGender] = useState<Gender>("male");

	const validation =
		bodyWeight !== ""
			? validateBodyWeightByGender(bodyWeight, selectedGender)
			: { isValid: true };

	const tabs: { key: TabType; label: string }[] = [
		{ key: "target", label: "目標重量" },
		{ key: "ベンチプレス", label: "ベンチプレス" },
		{ key: "スクワット", label: "スクワット" },
		{ key: "デッドリフト", label: "デッドリフト" },
	];

	const handleGenderChange = (gender: Gender) => {
		setSelectedGender(gender);
		setBodyWeight("");
	};

	const renderTabContent = () => {
		if (activeTab === "target") {
			return <TargetWeights bodyWeight={bodyWeight} gender={selectedGender} />;
		}

		const highlightWeight =
			bodyWeight !== "" && validation.isValid ? bodyWeight : undefined;
		return (
			<DataTable
				exercise={activeTab}
				gender={selectedGender}
				highlightBodyWeight={highlightWeight}
			/>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto px-4 py-8">
				{/* Header */}
				<header className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						BIG3レベル判定
					</h1>
					<p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
						ベンチプレス・スクワット・デッドリフトのレベルを体重から判定します
					</p>
				</header>

				{/* Input Section */}
				<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
					<div className="grid md:grid-cols-2 gap-6">
						<GenderSelector
							selectedGender={selectedGender}
							onChange={handleGenderChange}
						/>
						<WeightInput
							value={bodyWeight}
							onChange={setBodyWeight}
							gender={selectedGender}
							errorMessage={
								!validation.isValid ? validation.errorMessage : undefined
							}
						/>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto">
					{tabs.map((tab) => (
						<button
							type="button"
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`
								flex-1 min-w-fit px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer
								${
									activeTab === tab.key
										? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
								}
							`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Tab Content */}
				<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
					{renderTabContent()}
				</div>

				{/* Related Link */}
				<Link
					href="/training-menu"
					className="mt-6 flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl hover:shadow-md transition-shadow"
				>
					<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
						<ClipboardList className="w-5 h-5 text-white" />
					</div>
					<div>
						<p className="font-medium text-gray-900 dark:text-gray-100">
							トレーニングメニュー
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							1RMからMAXアップ・筋肥大メニューを自動計算
						</p>
					</div>
				</Link>

				{/* Notes */}
				<div className="mt-8 space-y-4">
					<div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
						<Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
						<div className="space-y-1">
							<p className="font-medium text-gray-900 dark:text-gray-100">
								使い方
							</p>
							<p>
								性別を選択し、体重を入力すると各レベルの目標重量が表示されます。タブを切り替えて各種目の詳細データも確認できます。
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
						<AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
						<div className="space-y-1">
							<p className="font-medium text-gray-900 dark:text-gray-100">
								注意事項
							</p>
							<p>
								このデータは一般的な指標です。無理な重量への挑戦は避け、適切なフォームと漸進的な負荷増加を心がけてください。
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
						<ExternalLink className="w-5 h-5 shrink-0 mt-0.5 text-gray-500" />
						<div className="space-y-1">
							<p className="font-medium text-gray-900 dark:text-gray-100">
								データ参照元
							</p>
							<p>
								レベル判定の基準データは{" "}
								<a
									href="https://strengthlevel.com/strength-standards"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 dark:text-blue-400 hover:underline"
								>
									Strength Level
								</a>{" "}
								を参考にしています。
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
