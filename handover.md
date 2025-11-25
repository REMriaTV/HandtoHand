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
### 2025-11-25
- 決定: リポジトリ直下に `handover.md` を新設し、Codex との共有ログとして使う。
- 相談: Obsidian/Spreadsheet との同期が常に最新でないため、ここを一次参照位置とする。
- 必要事項: act 4〜終章の詳細と、ハンカチ設定（所持者/意味）の固め。

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
