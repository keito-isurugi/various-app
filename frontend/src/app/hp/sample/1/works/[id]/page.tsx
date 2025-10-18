import { WorksDetailPage } from "@/components/hp/sample1/WorksDetailPage";
import { getWorkById } from "@/data/worksData";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface WorksDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata(
	props: WorksDetailPageProps,
): Promise<Metadata> {
	const params = await props.params;
	const work = getWorkById(params.id);

	if (!work) {
		return {
			title: "施工事例が見つかりません | 和心建築",
		};
	}

	return {
		title: `${work.title} | 施工事例 | 和心建築`,
		description: work.description,
	};
}

export default async function WorksDetailPageRoute(
	props: WorksDetailPageProps,
) {
	const params = await props.params;
	const work = getWorkById(params.id);

	if (!work) {
		notFound();
	}

	return <WorksDetailPage work={work} />;
}
