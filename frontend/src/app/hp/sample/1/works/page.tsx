import { WorksListPage } from "@/components/hp/sample1/WorksListPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "施工事例 | 和心建築",
	description:
		"和心建築の施工事例一覧。伝統的な日本建築と現代的な機能性を融合した注文住宅の実例をご紹介します。",
};

export default function WorksPage() {
	return <WorksListPage />;
}
