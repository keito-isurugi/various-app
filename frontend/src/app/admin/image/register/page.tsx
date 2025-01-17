"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
}

export default function ImageUploader() {
    const [images, setImages] = useState<UploadedImage[]>([]);

    // ドラッグ＆ドロップの設定
    const onDrop = (acceptedFiles: File[]) => {
        const newImages = acceptedFiles.map((file) => ({
            id: URL.createObjectURL(file),
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif"], // 許可するファイル形式
        },
        multiple: true,
    });

    // 画像を削除（個別）
    const handleRemoveImage = (id: string) => {
        setImages(images.filter((image) => image.id !== id));
    };

    // 画像を全削除
    const handleRemoveAll = () => {
        setImages([]);
    };

    // 画像をサーバーに保存
    const handleUploadImages = async () => {
        if (images.length === 0) {
            alert("アップロードする画像がありません");
            return;
        }

        const formData = new FormData();
        images.forEach((image) => {
            formData.append("images", image.file);
        });

        try {
            const response = await axios.post("http://localhost:8080/api/images/multi", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                alert("画像がアップロードされました!");
                console.log("Uploaded Images:", response.data);
                handleRemoveAll(); // アップロード後にリセットする場合
            }
        } catch (error) {
            console.error("アップロードに失敗しました", error);
            alert("アップロードに失敗しました。");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* ドラッグ＆ドロップエリア */}
            <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
            >
                <input {...getInputProps()} />
                <p>画像をドラッグ＆ドロップ、またはクリックしてアップロード</p>
                <p className="text-sm text-gray-500">JPEG, PNG, GIF 形式が許可されています。</p>
            </div>

            {/* 画像の一覧表示 */}
            {images.length > 0 && (
                <div className="mt-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">アップロードされた画像</h3>
                        <button
                            onClick={handleRemoveAll}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            全て削除
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {images.map((image) => (
                            <div key={image.id} className="relative">
                                <img
                                    src={image.preview}
                                    alt="Upload Preview"
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => handleRemoveImage(image.id)}
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 rounded"
                                >
                                    削除
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* アップロードボタン */}
            {images.length > 0 && (
                <button
                    onClick={handleUploadImages}
                    className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600 w-full"
                >
                    画像をアップロード
                </button>
            )}
        </div>
    );
}
