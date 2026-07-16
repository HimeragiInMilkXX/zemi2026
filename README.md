# 告知サイト作業ガイドライン

リポジトリ: https://github.com/HimeragiInMilkXX/zemi2026

---

## 1. 作業開始までの手順

### 1-1. 初回のみ：パッケージのインストール

```bash
npm install
```

### 1-2. SCSSの監視（コンパイル）を開始

VS Code で新しいターミナルを開き、以下を実行してください。

```bash
npm run sass:watch
```

実行すると以下のような表示になります。これが出ていれば、SCSSを保存するたびに自動で `dist/css/styles.css` にコンパイルされます。**作業中はこのターミナルを閉じずに開いたままにしてください。**

```
E:\portfolioWeb\middlePresent>npm run sass:watch

> middlepresent@1.0.0 sass:watch
> sass --watch src/scss/styles.scss:dist/css/styles.css

[2026-06-22 18:12] Compiled src\scss\styles.scss to dist\css\styles.css.
Sass is watching for changes. Press Ctrl-C to stop.
```

### 1-3. Live Server を起動

リアルタイムで見た目を確認しながら作業するため、`index.html` を開いた状態で Live Server を起動してください。

### 1-4. 作業完了後：commit & push

作業が終わったら、忘れずに commit & push してください。

```bash
git add .
git commit -m "（変更内容を記載）"
git push
```

---

## 2. セクション（HTML）の追加・編集ルール

`.level-section` が各セクションのコンテナです。新しいセクションを追加する場合は、以下の構造をコピーして使ってください。

```html
<section class="level-section" data-mtop="121" data-mbottom="122" data-gap="50">
    <h2 class="title">
        <span class="tag english"> LV.2 </span>
        <span class="content"> メンバー紹介 </span>
    </h2>
    <div class="content"> メンバー紹介 </div>
</section>
```

### 2-1. 親要素（`.level-section`）の data 属性

| 属性 | 内容 |
|---|---|
| `data-mtop` | margin-top（px） |
| `data-mbottom` | margin-bottom（px） |
| `data-gap` | タイトルとコンテンツの間のgap（縦方向のflexbox） |

> これらの値は `src/js/generatedStyles.js` が読み取り、自動的に `style.marginTop` / `style.marginBottom` / `style.gap` として適用しています。SCSS側で個別に margin や gap を指定する必要はありません。

### 2-2. 見出し（`h2.title`）

`<span class="content">` の中のテキストをデザインに合わせて変更してください（例：`メンバー紹介` → 実際の見出し）。

### 2-3. `.content` の div

`<div class="content">` は必ず存在させてください。**このdivの中に実際のコンテンツを入れていきます。**

### 2-4. 編集できる範囲（重要）

**HTMLで編集・追加してよいのは、各 `.level-section` 内の `<div class="content">` の中だけです。それ以外の部分（`.level-section` 自体の属性や `h2.title` の構造など）は変更しないでください。**

`.content` div の中であれば、何を書いても問題ありません（最初のセクション「先生紹介」を参考にしてください）。

---

## 3. 各セクションのスタイリング手順（SCSS）

セクション用のテンプレートSCSSファイルは `src/scss/sections/` フォルダにあります。担当のセクションの作業を始める際は、以下の手順で進めてください。

1. ファイル名を `_[番号].scss` から `_[セクション名].scss` に変更する
2. `src/scss/styles.scss` に以下を追記する
   ```scss
   @use "./sections/[セクション名]";
   ```
3. スタイリングを始める！

### 3-1. 現在のファイル対応表

| セクション (LV.) | 見出し | 現在のファイル名 | 状態 |
|---|---|---|---|
| LV.1 | 先生紹介 | `_先生紹介.scss` | ✅ 完了（参考用サンプル） |
| LV.2 | メンバー紹介 | `_2.scss` | 未着手 |
| LV.3 | メンバーたちの作品 | `_3.scss` | 未着手 |
| LV.4 | ゼミの活動 | `_4.scss` | 未着手 |

### 3-2. 実装サンプル

各セクションのSCSSファイルでは、セレクタに `.level-section:nth-of-type(N)>.content` を使い、何番目のセクションかを指定します（Nはセクションの順番）。すでに完了している `_先生紹介.scss`（LV.1）が良い参考例です。

```scss
@use "../base";

.level-section:nth-of-type(1)>.content {

    display: flex;
    gap: 36px;
    flex-direction: column;
    align-items: flex-start;

    background-image: url(../../../src/assets/kuriya.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: 11%;

    padding: {
        bottom: 102px;
        top: 118px;
        left: 40px;
        right: 40px;
    }

    p { color: base.$font-color; }

    .description {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .name { font-size: 6rem; font-weight: bold; }
        .position, .profession { font-size: 1.25rem; }
    }

    .title { font-size: 2rem; font-weight: medium; }

}
```

LV.2（メンバー紹介）を例にすると、`_2.scss` → `_メンバー紹介.scss` にリネームし、セレクタは `.level-section:nth-of-type(2)>.content` のままでOKです。

---

## 4. ルール・注意事項

1. **クラス名の重複に注意**：`.content` 自体のスタイル以外は自由に書いて構いませんが、要素のクラス名は他のセクションと衝突しないユニークな名前にしてください。
2. **ネストは必須ではありません**。書きやすい形でOKです。
3. **色は必ず `src/scss/_base.scss` の変数を使ってください**（例：`base.$font-color`）。`_base.scss` に変数が定義されていない色のみ、直接指定してOKです。
   - 現在の `_base.scss` で定義されている変数：`$primary-color`、`$background-color`、`$font-color`、`$secondary-color`
   - ⚠️ 現状 `_3.scss` と `_4.scss` には仮で `color: white;` と直接書かれています。作業を始める際は `base.$font-color` に置き換えてください。

---

## 5. 既存の共通パーツ（再利用できるもの）

すでにグローバルで定義済みなので、同じ見た目を作る場合はクラスをそのまま使ってください（再定義不要）。

### 5-1. 英語テキスト用クラス

テキストが英語の場合、フォントを正しく当てるために `english` クラスを付けてください。

```html
<span class="english"> LV.2 </span>
```

### 5-2. 詳細ページボタン

```html
<button class="detail-button" data-size="24" data-ptb="20" data-plr="44">
    <span> 詳細ページを見る </span>
    <img src="./src/assets/arrow.svg" alt="">
</button>
```

| data属性 | 内容 |
|---|---|
| `data-size` | 文字サイズ（px） |
| `data-ptb` | 上下のパディング（px） |
| `data-plr` | 左右のパディング（px） |

---

## 6. 画像が表示されない場合の確認ポイント

`background-image: url(...)` 等で画像が表示されないときは、まずブラウザのコンソールでエラー（404など）を確認してください。

パスの考え方として、**`url()` のパスは、コンパイル後のCSSファイル（`dist/css/styles.css`）の場所からの相対パスとして解釈されます**（書いている `.scss` ファイル自体の場所からではありません）。`dist/css/` はプロジェクトのルートから2階層下なので、理論上は `../../src/assets/[ファイル名]`（2階層分の `../`）でルート直下の `src/assets/` に到達できます。

> 補足：`_先生紹介.scss` では実際には `../../../src/assets/kuriya.jpg`（3階層分の `../`）と書かれています。これは本来必要な数より1つ多いのですが、ブラウザはルートより上に `../` で遡ろうとすると、そこで止まって（ルート自体を指す状態になって）くれるため、結果的に `../../` と同じ場所を指してエラーにはなりません。新しく書く場合は `../../` で問題ありません。

それでも画像が表示されない場合は、コンソールのエラー内容と一緒に教えてください。
