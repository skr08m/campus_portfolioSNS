// src/components/AuthenticatedImage.jsx
import { useEffect, useState } from "react";

const AuthenticatedImage = ({ workId, className, style }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true; // アンマウント後のステート更新を防ぐフラグ
        let currentUrl = null;

        const jwt = localStorage.getItem("jwt");

        const fetchImage = async () => {
            if (!workId) return;

            try {
                const res = await fetch(`http://localhost:8080/api/works/${workId}/file`, {
                    headers: {
                        "Authorization": `Bearer ${jwt}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const blob = await res.blob();

                // 以前のURLがあれば解放（念のため）
                if (currentUrl) URL.revokeObjectURL(currentUrl);

                const objectUrl = URL.createObjectURL(blob);
                currentUrl = objectUrl;

                if (isMounted) {
                    setImageUrl(objectUrl);
                    setError(false);
                }
            } catch (e) {
                console.error("画像取得エラー:", e);
                if (isMounted) setError(true);
            }
        };

        fetchImage();

        // クリーンアップ関数
        return () => {
            isMounted = false;
            if (currentUrl) {
                URL.revokeObjectURL(currentUrl);
            }
        };
    }, [workId]); // workIdが変わった時だけ再実行

    // エラー時の表示
    if (error) {
        return (
            <div className={`d-flex align-items-center justify-content-center bg-light text-muted ${className}`} style={style}>
                <span>No Image</span>
            </div>
        );
    }

    // 読み込み中または画像表示
    return imageUrl ? (
        <img src={imageUrl} className={className} style={style} alt="work" />
    ) : (
        <div className={`d-flex align-items-center justify-content-center bg-light ${className}`} style={style}>
            <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>
            <span className="ms-2 text-muted">Loading...</span>
        </div>
    );
};

export default AuthenticatedImage;