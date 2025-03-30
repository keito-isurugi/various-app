'use client';

import React, { useState } from 'react';
import axios from 'axios';

type ImageData = {
    id: string;
    image_path: string;
    display_flag: boolean;
    tags: any;
};

export default function ImagesPage() {
    // APIのURLとS3のパスを設定
    const s3Path = `${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT_EXTERNAL}/${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}`;
    const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

    // 画像データの状態を管理
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(false);

    // 最初に画像データを取得する
    React.useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get(`${apiBaseUrl}/images`);
                setImages(res.data); // 取得した画像データを状態に保存
            } catch (error) {
                console.error('Failed to fetch images:', error);
            }
        };

        fetchImages();
    }, [apiBaseUrl]);

    // 画像削除のリクエストを送信
    const deleteImage = async (imagePath: string) => {
        setLoading(true); // ローディング状態を設定
        try {
            await axios.delete(`${apiBaseUrl}/images/${imagePath}`); // DELETEリクエストを送信
            setImages((prev) => prev.filter((img) => img.image_path !== imagePath)); // ローカル状態を更新
        } catch (error) {
            console.error('Failed to delete image:', error);
        } finally {
            setLoading(false); // ローディング状態を解除
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">画像一覧</h1>
            {/* 画像グリッドを表示 */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                    <div key={image.id} className="relative bg-white rounded shadow-lg p-4">
                        {/* 画像表示 */}
                        <img
                            src={`${s3Path}/${image.image_path}`}
                            alt="uploaded image"
                            className="w-full h-40 object-cover rounded"
                        />
                        {/* タグ表示 */}
                        <div className="mt-3">
                            <p className="text-sm font-semibold text-black">タグ:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {image.tags.map((tag: any) => (
                                    <span
                                        key={tag.id}
                                        className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* 削除ボタン */}
                        <button
                            onClick={() => deleteImage(image.image_path)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none"
                        >
                            ✘
                        </button>
                    </div>
                ))}
            </div>
            {/* ローディングメッセージ */}
            {loading && <p className="text-gray-500 mt-4">削除中...</p>}
            {/* データが空のメッセージ */}
            {!loading && images.length === 0 && <p className="text-gray-500 mt-4">画像がありません。</p>}
        </div>
    );
}
