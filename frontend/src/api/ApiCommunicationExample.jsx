/**
 * バックエンド（Java/Spring Boot）との通信を一括管理するクラス
 * ファイル名: ApiCommunicationExample.js
 */
class ApiCommunicationExample {
    // APIのベースURL
    static BASE_URL = "http://localhost:8080/api";

    /**
     * 共通処理：レスポンスのステータスチェック
     */
    static async checkResponse(response) {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status} Error : ${errorText}`);
        }
        return response;
    }

    // ==================================================
    // 認証（Auth）系
    // ==================================================

    /**
     * ユーザー登録
     */
    static async registerUser(userData) {
        const response = await fetch(`${this.BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        await this.checkResponse(response);
        return await response.text(); // JWTトークンを返す
    }

    /**
     * ログイン
     */
    static async login(loginData) {
        const response = await fetch(`${this.BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        });
        await this.checkResponse(response);
        return await response.text(); // JWTトークンを返す
    }

    // ==================================================
    // 作品（Works）系
    // ==================================================

    /**
     * 作品投稿（画像ファイルを含むため FormData を使用）
     */
    static async postWork(jwt, formData) {
        const response = await fetch(`${this.BASE_URL}/works`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`
            },
            body: formData
        });
        await this.checkResponse(response);
        return await response.json();
    }

    /**
     * 作品検索（キーワード ＋ タグ）
     * 複数のタグを Java側で List<String> として受け取れる形式で送信します
     */
    static async searchWorks(jwt, keyword, tags) {
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);

        if (tags && tags.length > 0) {
            // tags=A&tags=B の形式で追加
            tags.forEach(tag => params.append("tags", tag));
        }

        const response = await fetch(`${this.BASE_URL}/works/search?${params.toString()}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
        return await response.json();
    }

    /**
     * 作品詳細取得
     */
    static async fetchWorkDetail(jwt, workId) {
        const response = await fetch(`${this.BASE_URL}/works/${workId}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
        return await response.json();
    }

    /**
     * 自分が投稿した作品一覧（PastWork用）
     */
    static async fetchMyWorks(jwt) {
        const response = await fetch(`${this.BASE_URL}/works/me`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
        return await response.json();
    }

    // ==================================================
    // アクション（Like / Album / Comment）系
    // ==================================================

    /**
     * いいね追加
     */
    static async addLike(jwt, workId) {
        const response = await fetch(`${this.BASE_URL}/works/${workId}/like`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
        return await response.json(); // 新しいいいね数を返す
    }

    /**
     * いいね取り消し
     */
    static async removeLike(jwt, workId) {
        const response = await fetch(`${this.BASE_URL}/works/${workId}/unlike`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
        return await response.json();
    }

    /**
     * マイアルバムに追加
     */
    static async addToAlbum(jwt, workId) {
        const response = await fetch(`${this.BASE_URL}/works/${workId}/album`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
        return await response.json();
    }

    /**
     * マイアルバムから削除
     */
    static async removeFromAlbum(jwt, workId) {
        const response = await fetch(`${this.BASE_URL}/works/${workId}/album/remove`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
    }

    /**
     * マイアルバム一覧取得
     */
    static async fetchMyAlbum(jwt) {
        const response = await fetch(`${this.BASE_URL}/works/album`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
        return await response.json();
    }

    /**
     * コメント投稿
     */
    static async addComment(jwt, workId, content) {
        const response = await fetch(`${this.BASE_URL}/works/${workId}/comments`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: content })
        });
        await this.checkResponse(response);
        return await response.json();
    }

    // ==================================================
    // その他（Tagsなど）
    // ==================================================

    /**
     * タグ一覧取得
     */
    static async fetchTags(jwt) {
        const response = await fetch(`${this.BASE_URL}/tags`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
        return await response.json();
    }
}

export default ApiCommunicationExample;