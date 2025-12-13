"use client";

import Image from "next/image";

const BallSpinner = () => {
	return (
		<div className="w-full text-center py-20">
			<Image
				className="my-0 mx-auto pokemon-ball-spin"
				width={80}
				height={80}
				src="/img/pokemon/ball.svg"
				alt="Loading..."
			/>
		</div>
	);
};

export default BallSpinner;
