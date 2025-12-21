class ApiCommunicationExample {
    //書き方の例です
    //今回の制作物で使うAPIを実際に使っています

    //★JWTについて
    //JWT(json web token)とは、String文字列のカギです。fgaihfhaiw.dhagdjfehue.hwduhabdみたいな感じで来ます。
    //xxxxx.yyyyy.zzzzzという形になっており、トークンの情報.本文.署名という構造になっています。(今回は本文の部分にuserIDが入っているため、
    // これでサーバは個人を識別します)

    //フロント側ではこれをAPIリクエストに含めるだけでOKです。それでサーバ側でユーザーの識別ができます


    /**
     * 共通処理：
     * APIのレスポンスステータスを確認し、
     * エラーの場合は例外として扱う。
     */

    //★asyncとは？
    //javascriptには、javaのAPI呼び出しのように値が返ってくるまで処理を止めておく機能がない
    //→asyncと書くとその行や関数だけをスキップし、値が来てからその部分に戻って処理を再開することで疑似的な同期処理を実現している
    static async checkResponse(response) {
        if (!response.ok) {
            // エラー内容はテキストとして取得
            const errorText = await response.text();
            throw new Error(
                `HTTP ${response.status} Error : ${errorText}`
            );
        }
        return response;
    }

    // ==================================================
    // JWTを使わないAPI呼び出し例（ユーザー登録）
    // ==================================================
    static async registerUser() {

        /*
         * ユーザー登録APIは未認証で利用できるため、
         * Authorizationヘッダは付与しない。
         */
        //★awaitとは？
        //asyncの中でだけ使え、非同期処理の値が返ってくるまで待ってくれる。
        //もし↓でresponse = fetch()と書くと、responseにはPromiseという型が入り、目的のデータは入らずどんどん処理が進んでしまう
        const response = await fetch(
            "http://localhost:8080/api/auth/register",//URLの指定（本番はlocalhostではなくなるので、ここはグローバル変数とかにした方がいい）
            {
                method: "POST",//スプレッドシートを参照して、対応するものを書いてください
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userName: "testuser",
                    mailAddress: "test@example.com",
                    passWord: "password123"
                })
            }
        );

        // ステータスコードを確認
        //responseでawaitしているが、javascriptの仕様上処理は先に進んでしまうため、responseはこの時点でpromise型が返る可能性があるので、
        //awaitはここでも必要
        await this.checkResponse(response);

        /*
         * 本APIはレスポンスボディとして
         * JWT（文字列）を返す設計になっている
         */
        const jwt = await response.text();
        return jwt;

        //結果的に、awaitしてたresponseにデータが来る→同じくawaitしてたcheckResponce(response)が処理できる→同様にresponse.text()の順でデータが流れていく
    }

    // ==================================================
    // JWTを使うAPI呼び出し例（タグ一覧取得）
    // ==================================================
    static async fetchTags(jwt) {

        /*
         * 認証が必要なAPIでは、
         * AuthorizationヘッダにJWTを付与する
         */
        const response = await fetch(
            "http://localhost:8080/api/tags",//同じく変数化推奨
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwt}`//Barnerという文字列はAPIの約束みたいなもの、このまま使ってOKです
                }
                //もしbodyが必要なら、前の例のように必要なデータを記述しておく
            }
        );

        // ステータスコードを確認
        await this.checkResponse(response);

        /*
         * 正常時はJSON配列が返却される
         */
        const tags = await response.json();
        return tags;
    }

    // ==================================================
    // 作品検索 API（キーワードとタグを指定）
    // ==================================================
    static async searchWorks(jwt, keyword, tags) {
        // URLの末尾に付けるパラメータ (?keyword=abc&tags=web...) を作成
        const params = new URLSearchParams();

        if (keyword) {
            params.append("keyword", keyword);
        }

        // tagsが配列であれば、1つずつ追加
        if (tags && tags.length > 0) {
            tags.forEach(tag => {
                params.append("tags", tag);
            });
        }

        const response = await fetch(
            `http://localhost:8080/api/works/search?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }
        );

        // ステータスコードを確認（共通処理を利用）
        await this.checkResponse(response);

        // 検索結果のリストをJSONとして返す
        return await response.json();
    }

    // ==================================================
    // 作品詳細取得 API
    // ==================================================
    static async fetchWorkDetail(jwt, workId) {
        const response = await fetch(
            `http://localhost:8080/api/works/${workId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );

        await this.checkResponse(response);
        return await response.json();
    }

    // ==================================================
    // コメント投稿 API
    // ==================================================
    static async addComment(jwt, workId, content) {
        const response = await fetch(
            `http://localhost:8080/api/works/${workId}/comments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify({
                    content: content
                })
            }
        );

        await this.checkResponse(response);
        return await response.json();
    }

    // ★ いいねを追加するメソッド
    static async addLike(jwt, workId) {
        const response = await fetch(`http://localhost:8080/api/works/${workId}/like`, {
            method: "POST", // バックエンドの @PostMapping に合わせる
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        });
        await this.checkResponse(response);
        // バックエンドが新しいいいね数（数値）を返す想定
        return await response.json();
    }

    // ★ マイアルバムに追加するメソッド
    static async addToAlbum(jwt, workId) {
        const response = await fetch(`http://localhost:8080/api/works/${workId}/album`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        });
        await this.checkResponse(response);
        return await response.json();
    }

    // src/api/ApiCommunicationExample.jsx 内に追加
    static async fetchMyAlbum(jwt) {
        const response = await fetch("http://localhost:8080/api/works/album", {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
        return await response.json();
    }

    static async removeFromAlbum(jwt, workId) {
        const response = await fetch(`http://localhost:8080/api/works/${workId}/album`, {
            method: "DELETE", // または POST で削除用のパスを叩く
            headers: { "Authorization": `Bearer ${jwt}` }
        });
        await this.checkResponse(response);
    }
}

export default ApiCommunicationExample;


// ==================================================
// 作品投稿など、テキスト以外のデータをやり取りするAPIの利用方法(formDataを利用する方法)
// ==================================================

//ここで送るデータを作ります
// const formData = new FormData();
// formData.append("title", title);
// formData.append("explanation", explanation);
// formData.append("repositoryUrl", repositoryUrl);
// formData.append("workExtension", workExtension);
// formData.append("workData", workData);

// //拡張for文と同じやつ、tag配列を作ってます
// tags.forEach(tag => {
//     formData.append("tags", tag);
// });

// await fetch("http://localhost:8080/api/works", {//ここもURL(http://localhost:8080まで)は変数化推奨
//     method: "POST",
//     headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,//localStorageでJWTを保存したと仮定しています
//     },
//     body: formData,
// });
