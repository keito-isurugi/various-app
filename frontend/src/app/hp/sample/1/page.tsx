import { HousingCompanyHomepage } from "@/components/hp/sample1/HousingCompanyHomepage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "和心建築 - 自然素材の注文住宅",
	description:
		"職人の技と自然素材にこだわった和モダンな注文住宅を提供する和心建築のホームページです。",
};

/**
 * HPサンプル1: 高級旅館のような和モダンテイストの木造注文住宅会社
 * /hp/sample/1 のルーティング設定
 */
export default function HousingCompanySample1() {
	return <HousingCompanyHomepage />;
}
