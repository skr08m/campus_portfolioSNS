# campus_portfolioSNS

## 基本的なgitの使い方

1. git管理対象のフォルダ階層へ移動する(今回なら.../campus_portfolioSNS)
2. ネットに公開できない情報を追加した場合（propertiesなどアクセス情報やAPIキーを書いたファイル）を追記したときは、gitignoreにそのファイルを忘れずに記述する
3. コマンドに `git add .` と入力して実行
4. 同じく、`git commit -m "この中にコメント内容を書く"`と入力し実行(例：git commit -m "~~クラスのcontrollerクラスを作成"　など)
5. 同じく、`git push origin 更新したいブランチを指定`　と入力して実行（例：`git push origin main`など）
<br>
<br>

## ブランチの作り方

### 1. ブランチを作る
`git checkout -b feature/add-login`<br>
→ 「add-login という作業箱を作って、そこに移動する」という意味。

### ◆ 2. 作業してコミットする
`git add .`<br>
`git commit -m "ログイン画面作成"`<br>
※コミットは今まで通り。

### ◆ 3. main に取り込む（merge）
main に移動<br>
`git checkout main`

最新を取る（重要）<br>
`git pull`

merge方法<br>
`git merge feature/add-login`

### ◆ 4. 開発が終わったブランチは削除してOK(できたらで大丈夫です)
`git branch -d feature/add-login`
<br>
<br>

## 🎨 図で理解！（テキストで図解）
main  ------------------------A----------------------C----
               \       
feature/add-login  ------B----------------------------/


A：main の現在の状態<br>
B：ブランチを切って新機能を実装<br>
C：完成した B の内容を main に合体（merge）
<br>

## フロントの人向けのデバッグ方法（ローカルでやる場合）<br>
1. backendのsrcファイル直下に`CampusPortfolioApplication`というクラスがあるのでそれを起動し、backendサーバーを立てます<br>
2. コンソールに大量の文字が出てくるので、最後に`server is running!`と出れば起動完了<br>
3. その状態でVSCodeにて新しいターミナルを作成し、今度はそっちでfrontend階層に移動した後`npm run dev`で画面を立ち上げる<br>
4. ブラウザでページを操作してAPI通信ができます<br>

## バックエンドの人向けのデバッグ方法 <br>
1. 起動までは上記の2までと同じです<br>
2. フロントが完成している場合は、実際のページを使ってデバッグしてOKです（以下はまだ未完成の場合）<br>
3. コマンドプロンプトの`curl`を使って通信します。コマンドの例はControllerの該当部分のコードと、使うDTOの構造をchatGPTに投げたら作ってくれます<br>
4. ブラウザでDBの状態を確認してデータが入っているか、APIリクエストの応答はあったか、サーバーがダウンしていないか、すべてOKなら完成です<br>
