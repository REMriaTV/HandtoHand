# Hand to Hand – Handover Log

## Purpose
- Keep a persistent, repo-stored log that Codex/people can consult even if terminals or tabs close.
- Track how Hand to Hand (short story "道程") evolves: requirements, decisions, outstanding questions.
- Point to the authoritative content sources (spreadsheet, Obsidian, Markdown) so the latest material can be synced quickly.

## Sources of Truth / Where to Look
- Primary ideation: Spreadsheet ("Hand to Hand" tab) – <https://docs.google.com/spreadsheets/d/1Nh1yDXMdR6Z-Hoyua6T76hdtmO5g5x7Prt1-SpRGoKc/edit?gid=302707251#gid=302707251>
- Obsidian note: 「★Hand to Hand サイト設計」 (still used for brainstorming but may lag behind).
- Repository Markdown:
  - `content/plot-outline.md` – scene-by-scene outline synced from spreadsheet notes.
  - `content/characters.md` – cast descriptions and traits.
  - `content/manuscript.md` – prose draft (sections 一〜七まで反映済み。八は書きかけ)。
  - `docs/index.md` – GitHub Pages prototype (currently placeholder).

Whenever spreadsheet/Obsidian get updates, mirror the canonical pieces here so Codex always reads the latest Markdown + this log.

## Project Snapshot (2025-11-25)
- **Site title**: Hand to Hand (to be hosted on REMriaTV GitHub, repo not yet created).
- **Story**: Short story "道程" documenting plot, characters, manuscript, structure diagrams, illustration slots, prompts (手/ハンカチ/12時/ちくわ/嘘), image music, and writing memos.
- **Goal**: Maintain all narrative data in Markdown, expose via GitHub Pages (`docs/`), and pave the way for future CMS/editor UI.
- **Current storage**: Spreadsheet is still the working draft; this repo mirrors it manually.

## Key Creative Notes
- **Logline**: 男子中学生・瀬田が女子に手を差し伸べられて感動する話。
- **Theme**: 「好きな娘としか手を繋ぎたくない」主人公が予想外の展開で試練と成長を得る。
- **Structure**: Five prompts map to acts (手/ハンカチ/12時/ちくわ/嘘)。Act III uses 12時チャイムをきっかけに体育館地下倉庫で閉じ込められる展開。Act IV〜終章の詳細は追記予定。
- **Character focus**:
  - 瀬田亮二: "手つなぎ童貞"。潔癖設定は再検討中（重くなり過ぎるため暫定で外す方向）。
  - 川原海美: 才女で医者志望。潔癖傾向やマイルールの扱いは未確定。
  - 横野志保（リンゴ）: バレー部ムードメーカー。終盤で手を差し伸べる役回り想定。
  - 教員/部活: クボセン、ザキヤマ、盛岡、バレー部員など。
- **Outstanding world-building items**: 体育館地下倉庫のレイアウト、倉庫に横野が来る目的、ハンカチの所有/意味付け、ちくわ比喩の活用、12時を契機にした緊張の段階付け、終章「嘘」の仕掛け。

## Work Log
### 2025-11-29
- 原稿ページの改修に向けて（更新および変更）
  - 原稿（本文）ページを **「文庫本をそのままウェブに移したような読み心地」** に整える
  - 章タイトル：小さく表示。
    - レイアウトについて：要相談・要調整
  - ページ番号：小さく表示する
    - レイアウトについて：要相談・要調整
  - 余白：要相談・要調整
  - 列数：要相談・要調整
  - 1列あたりの文字数：要相談・要調整
  - 行（列）間：要相談・要調整
  - 字間：要相談・要調整
  - ページ組：見開き or 単一：要相談・要調整
  - 様式：縦書き（決定）
  - ページ移動：矢印 or スクロール：要相談・要調整
  - 章の移動：矢印 or スクロール：要相談・要調整
  - 背景（紙色）：
    - manuscript-entry を紙色（例: #fdfaf4）のシートで包み、余白と影を軽く付けて読書用の“紙面”に見せる案を検討中。決定ではない。
    - prefers-color-scheme: dark に合わせた夜間配色も用意して、背景と紙色を反転させる案を検討中。決定ではない。
      

### 2025-11-25
- 決定: リポジトリ直下に `handover.md` を新設し、Codex との共有ログとして使う。
- 相談: Obsidian/Spreadsheet との同期が常に最新でないため、ここを一次参照位置とする。
- 必要事項: act 4〜終章の詳細と、ハンカチ設定（所持者/意味）の固め。
- 進捗: REMriaTV/HandtoHand リポジトリを作成し push、GitHub Pages (main / docs) を公開。`docs/_config.yml` の description を修正してビルド成功。
- 更新: `docs/index.md` にログライン・テーマ・プロット概要・執筆メモ・お題・主要キャラ要約を追記し、ブラウザから全体像を把握できるようにした。
- 構成: トップページをサマリ化し、`docs/plot.md`・`docs/characters.md`・`docs/memos.md` を新設。各ページへリンクするナビゲーションを追加。
- 追加: 原稿の進行状況をまとめる `docs/manuscript.md` を作成し、トップページからリンク。
- ルール: 原稿テキストは原文のまま掲載し、許可がない限り修正・削除しない（最重要事項）。
- 表示: `docs/assets/css/style.scss` で縦書きレイアウトを追加し、章ページ(`docs/manuscript/*.md`)を `div.manuscript-body` で包んで閲覧できる形にした。
- UI: 原稿ページ専用レイアウト (`docs/_layouts/manuscript.html`) を追加し、サイトタイトル等のサイドバーを非表示にして本文へ集中できる画面にした。横スクロール＆前後章ナビを装備し、段落の改行・余白・冒頭表示位置も調整済み。見出し（作品名 / 章タイトル）を左右に配置し、本文幅を中央に絞って読みやすさを優先。
- 2025-11-25 追加: 原稿ページの上下スクロールを禁止し、作品名・章題を固定表示。原稿枠を中央に細め、枠内のみ横スクロールかつバーは非表示化。章本文の`# （一）`などのヘッダを削除し、ページ下部ナビを同一画面内に収めるよう CSS を再調整。変更は GitHub Pages へ push 済み。
- 2025-11-25 追記: 原稿枠に作品名と章題を内包させる `manuscript-frame` を導入。見出し〜本文を同一パネル化し、列の高さを約30文字（`height:32rem`）に制限してフッターナビが 1 画面に収まるよう再レイアウト。`docs/_layouts/manuscript.html` で `<nav>` を判定し枠外に出す処理を追加。
- 2025-11-25 追記2: 作品タイトル「道程」を `docs/_config.yml` で `story_title` として定義し、原稿ページでは枠外に表示。章題は右端固定、サイト名は非表示。原稿枠の上下余白とカラム高さ（`--manuscript-body-height: 30rem`）を見直し、ページリンクが常に 1 ビュー内に入るよう CSS/HTML を再構成。
- 2025-11-25 追記3: 作品名・章題を完全に原稿枠の外に出す `manuscript-meta` を新設。左に「道程」、右に章題を縦書きで配置し、枠との距離を `--manuscript-meta-offset` で制御。カード自体のセンタリングを調整し、meta → 原稿 → ナビが縦方向に独立して並ぶ構造へ更新。
- 2025-11-25 追記4: タイトル/章題要素を廃止し、原稿枠とページリンクのみのシンプル構成へ戻した。余白も圧縮して視線が本文に直行するレイアウトへ再調整。その後さらに上部余白を削り、枠が画面内で上寄せされるよう CSS を微調整。
- 2025-11-25 指示: 見開きスタイルを再設計予定。原稿枠を画面中央に固定し上下余白を揃える／ページリンクは枠から少し離し薄色細字で配置／章題は枠内右余白に控えめ表示／ページ番号を枠下余白に追加。中央に縦ラインを引き、左右ページに原稿を置きつつ中央ライン周辺は余白を確保。横スクロール（ドラッグ）は維持しつつ、三角ボタンで見開き単位を切り替える UI を検討。章構成は「手／ハンカチ／12時／ちくわ／嘘」のテーマ単位に変更し、元の章番号表示は行わない（バックヤード管理のみ）。HTML ページもテーマ単位で再構成予定。
- 2025-11-25 追記5: 上記指示に沿って原稿ページをテーマ単位（手/ハンカチ/12時/ちくわ/嘘）へ再編。`docs/manuscript/hand.md` など新ファイルに統合し、旧 `chapter-01〜08` を廃止。レイアウトは中央配置＋見開きライン＋右余白の章題表示＋ページ番号/薄色ナビ/左右の見開きボタンを実装し、中央ライン付近は疑似要素で余白化してスクロール時も文字が被らないようにした。
- 2025-11-25 追記6: 原稿枠を 54vw 相当へ再縮小し、左右ページを 10 列想定の幅に整列。中央ライン左右に 2 列分の余白を確保し、冒頭 6 列ぶんに章題ブロックを差し込む方式へ変更（章題がスクロールで見切れる）。三角ボタンは HTML ページ遷移ではなく原稿内スクロールに割り当て、ページ下部リンクは左「← 前へ」/中央「トップ」/右「次へ →」の並びに調整。ページ番号表示は撤廃。

### 2025-11-29
- 相談: 原稿ページは「文庫本のように読書へ集中できる」方向へ再設計する。余計な装飾を排し、章題・ページ番号など最低限の情報だけを紙面の外側に添える。
- 方針: まずモックアップでレイアウト案（縦書き／余白幅／段数／メタ情報表示方法）を固め、了承後に実装へ進む。既存の `docs/_layouts/manuscript.html` と SCSS にはまだ手を入れない。

### 2025-11-21
- ハンドオフ理解を整理 (README.md に記載)。
- 目的・ディレクトリ構成・Pages 運用フローを文章化。

## Next Actions / Open Questions
1. Decide final home for spreadsheet-sync workflow (manual copy vs. script) so repo stays current.
2. Flesh out Act IV「ちくわ」と終章「嘘」（舞台: 体育館地下倉庫、音楽リンクあり）を `content/plot-outline.md` および `content/manuscript.md` に追記。
3. 瀬田の内面設定（潔癖の有無、手に関するコンプレックス）を確定し、序盤の描写を整合。
4. ハンカチの由来/所有者（川原 or 横野）を明文化し、プロット上の役割を統一。
5. GitHub リポジトリ (REMriaTV) を作成し、このリポジトリを push。GitHub Pages を `docs/` で有効化。

## How to Update This File
- Append new dated entries under **Work Log** with bullet lists of decisions/questions。
- Update **Project Snapshot** and **Key Creative Notes** when major changes occur (structure, characters, tools, goals)。
- Keep **Sources of Truth** links/tips accurate so Codex can fetch the right docs quickly。
- Reference related Markdown files instead of duplicating large prose blocks; note where the latest text lives.

_Last updated: 2025-11-25_
