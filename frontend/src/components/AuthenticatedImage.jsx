// src/components/AuthenticatedImage.jsx
import { useEffect, useState } from "react";

const AuthenticatedImage = ({ workId, className, style }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        const fetchImage = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/works/${workId}/file`, {
                    headers: { "Authorization": `Bearer ${jwt}` }
                });
                if (!res.ok) return;
                const blob = await res.blob();
                setImageUrl(URL.createObjectURL(blob));
            } catch (e) {
                console.error("画像取得エラー", e);
            }
        };
        fetchImage();
        return () => imageUrl && URL.revokeObjectURL(imageUrl);
    }, [workId]);

    return imageUrl ? (
        <img src={imageUrl} className={className} style={style} alt="work" />
    ) : (
        <div className="d-flex align-items-center justify-content-center bg-light w-100 h-100">
            <span className="text-muted">Loading...</span>
        </div>
    );
};

export default AuthenticatedImage;