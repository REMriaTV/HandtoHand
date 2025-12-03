# Hand to Hand

Hand to Hand は短編小説「道程」のプロットやキャラクター情報、原稿を管理するためのリポジトリです。現状はスプレッドシートを一次ソースとして扱い、同じ内容をここに同期しながら GitHub Pages で公開できる形に整えることを目的としています。

## ゴール
- プロット・キャラクターなどの情報を Markdown で一元管理する
- GitHub Pages (`docs/` ディレクトリ) を使い、ブラウザから閲覧しながら編集アイデアを固める
- 将来的にウェブ上で直接編集・加筆できる仕組みを導入する際のベースを用意する

## ディレクトリ構成
```
hand-to-hand/
├─ README.md           # このリポジトリの説明
├─ docs/               # GitHub Pages で公開されるサイト
│  ├─ _config.yml      # Jekyll/Pages の設定
└─  └─ index.md         # サイトのトップページ (Hand to Hand)
```

## 今後やりたいこと
- プロット編集用の簡易フォーム or CMS を検討
- 章ごとの原稿を分割管理する仕組みを追加

リポジトリを REMriaTV の GitHub に作成する際は、以下のように進めてください。
```bash
cd hand-to-hand
git init
git add .
git commit -m "chore: initialize Hand to Hand repo"
git branch -M main
# GitHub 上で REMriaTV/hand-to-hand (仮) を作成後
git remote add origin git@github.com:REMriaTV/hand-to-hand.git
git push -u origin main
```
