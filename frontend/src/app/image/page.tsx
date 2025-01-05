import apiClient from "@/libs/apiClient";

async function fetchImages() {
  const response = await apiClient.get("/images");
  return response.data;
}

export default async function Home() {
  const images = await fetchImages();
  const s3Path = `${process.env.AWS_S3_ENDPOINT_EXTERNAL}/${process.env.AWS_S3_BUCKET_NAME}`;


	return (
    <div className="grid place-items-center min-h-screen py-20">
      <article className="prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-xl">
        <h1>画像一覧</h1>
        <ul>
          {images.map((image: any) => (
            <li key={image.id}>
              {/* biome-ignore lint/a11y/useAltText: <explanation> */}
              <img src={`${s3Path}/${image.image_path}`} />
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
