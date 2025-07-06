"use client";

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

	// 体重バリデーション
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

	/**
	 * タブ切り替えハンドラー
	 */
	const handleTabChange = (tabKey: TabType) => {
		setActiveTab(tabKey);
	};

	/**
	 * 性別変更ハンドラー（状態リセット機能付き）
	 */
	const handleGenderChange = (gender: Gender) => {
		setSelectedGender(gender);
		// 性別変更時に体重をリセット（バリデーション範囲が異なるため）
		setBodyWeight("");
	};

	/**
	 * タブボタンのスタイルを取得
	 */
	const getTabButtonStyle = (tabKey: TabType): string => {
		const baseStyle =
			"px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";

		if (activeTab === tabKey) {
			return `${baseStyle} bg-blue-600 text-white`;
		}

		return `${baseStyle} bg-gray-100 text-gray-700 hover:bg-gray-200`;
	};

	/**
	 * アクティブなタブコンテンツをレンダリング
	 */
	const renderTabContent = () => {
		if (activeTab === "target") {
			return <TargetWeights bodyWeight={bodyWeight} gender={selectedGender} />;
		}

		// データテーブル表示
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
		<div className="min-h-screen py-8 px-4 bg-gray-50">
			<div className="container mx-auto max-w-6xl">
				{/* ヘッダー */}
				<header className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						BIG3レベル判定
					</h1>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						ウエイトトレーニングのBIG3（ベンチプレス、スクワット、デッドリフト）における
						あなたのレベルを体重から判定し、目標重量を確認できます。
					</p>
				</header>

				{/* 性別選択と体重入力セクション */}
				<section className="mb-8">
					<div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
						<div className="grid md:grid-cols-2 gap-6">
							{/* 性別選択 */}
							<GenderSelector
								selectedGender={selectedGender}
								onChange={handleGenderChange}
							/>
							{/* 体重入力 */}
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
				</section>

				{/* タブナビゲーション */}
				<section className="mb-8">
					<div className="flex justify-center">
						<div className="inline-flex space-x-2 bg-gray-200 p-1 rounded-lg">
							{tabs.map((tab) => (
								<button
									type="button"
									key={tab.key}
									role="tab"
									aria-selected={activeTab === tab.key}
									aria-controls={`tabpanel-${tab.key}`}
									onClick={() => handleTabChange(tab.key)}
									className={getTabButtonStyle(tab.key)}
								>
									{tab.label}
								</button>
							))}
						</div>
					</div>
				</section>

				{/* タブコンテンツ */}
				<section
					id={`tabpanel-${activeTab}`}
					aria-labelledby={`tab-${activeTab}`}
					className="bg-white rounded-lg shadow-sm p-6"
				>
					{renderTabContent()}
				</section>

				{/* 使い方説明 */}
				<section className="mt-12 bg-blue-50 rounded-lg p-6">
					<h2 className="text-xl font-semibold text-blue-900 mb-4">使い方</h2>
					<div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
						<div>
							<h3 className="font-semibold mb-2">1. 性別を選択</h3>
							<p>
								性別によって適用される基準値が異なります。正確な判定のため最初に選択してください。
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-2">2. 体重を入力</h3>
							<p>
								男性：50kg〜140kg、女性：40kg〜120kgの範囲で現在の体重を入力してください。
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-2">3. タブを選択</h3>
							<p>
								「目標重量」で全種目の目標を確認するか、個別の種目タブで詳細データを確認できます。
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-2">4. レベルを確認</h3>
							<p>
								初心者から
								エリートまで5段階でレベル分けされています。現在の挙上重量と比較してみましょう。
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-2">5. 目標設定</h3>
							<p>
								次のレベルの重量を目標にトレーニング計画を立ててください。安全第一で進めましょう。
							</p>
						</div>
					</div>
				</section>

				{/* 注意事項 */}
				<section className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<h3 className="text-lg font-semibold text-yellow-800 mb-2">
						重要な注意事項
					</h3>
					<ul className="text-sm text-yellow-700 space-y-1">
						<li>
							•
							このデータは一般的な指標であり、個人差やトレーニング経験により大きく異なります
						</li>
						<li>
							•
							無理な重量への挑戦は怪我の原因となります。適切なフォームと漸進的な負荷増加を心がけてください
						</li>
						<li>
							•
							トレーニング経験が浅い場合は、専門家の指導を受けることを強く推奨します
						</li>
						<li>
							•
							健康状態に不安がある場合は、医師に相談してからトレーニングを開始してください
						</li>
					</ul>
				</section>
			</div>
		</div>
	);
}
