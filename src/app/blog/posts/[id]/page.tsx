"use client";

import React from "react";
import { useEffect, useState } from "react";

export default function Home({
	params,
}: {
  params: { id: string };
}) {
	const [post, setPost] = useState([]);

	useEffect(() => {
		async function getPost() {
			const res = await fetch(`/api/blog/posts/${params.id}`);
			const data = await res.json();
			setPost(data)
			console.log(data)
		}
		getPost()		
	}, [params.id]);
  
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<h1>ブログ詳細</h1>
		</div>
	);
}
