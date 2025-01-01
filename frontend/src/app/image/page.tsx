import apiClient from "@/libs/apiClient";

async function fetchImages() {
  const response = await apiClient.get("/images");
  return response.data;
}

export default async function Home() {
  const images = await fetchImages();

	return (
    <div className="grid place-items-center min-h-screen py-20">
      <article className="prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-xl">
        <h1>画像一覧</h1>
        <ul>
          {images.map((image: any) => (
            <li key={image.id}>
              {/* biome-ignore lint/a11y/useAltText: <explanation> */}
              <img src={image.image_path} />
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
