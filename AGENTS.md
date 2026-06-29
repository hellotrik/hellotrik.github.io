# AGENTS.md

## Cursor Cloud specific instructions

本仓库是一个 **Jekyll 静态站点**（GitHub Pages，主题 `jekyll-theme-cayman`，自定义域名见 `CNAME`），
根目录下还有若干纯静态的 HTML/JS 小工具（`cron/`、`cidr/`、`unicode-sort/`、`chess/`、`qianziwen/` 等），
以及一个辅助脚本 `abs/py/build_emoji_sample.py`。

### 服务与运行（核心应用 = Jekyll 站点）

- 仓库**没有 `Gemfile`**，本地预览直接用全局安装的 `jekyll`（不要用 `bundle exec`）。
- 开发预览（与 `.vscode/tasks.json` 中的任务一致，但显式指定 host/port）：
  - `jekyll serve --host 0.0.0.0 --port 4000 --livereload --force_polling`
  - 站点地址 `http://localhost:4000/`，首页标题为「词不达意」。
  - 子工具路径如 `http://localhost:4000/cron/`、`/cidr/`、`/unicode-sort/`。
  - `--force_polling` 是必须的：容器内文件系统事件不可靠，否则热重载可能不触发。
- 构建（仅校验能否生成）：`jekyll build`，输出到 `_site/`（已被 `.gitignore` 忽略）。
- 本仓库**没有独立的 lint / 测试套件**；「lint」即 Jekyll 构建本身（构建通过即视为通过）。

### 辅助脚本

- `python3 abs/py/build_emoji_sample.py` 由 `unicode-sort/samples/emoji-test.json` 生成 `emoji.txt`。
  该 JSON 源文件**未纳入版本库**（只有产物 `emoji.txt` 在库中）。如需重新生成，先用
  `python3 abs/py/build_emoji_sample.py --fetch` 联网从 unicode.org 抓取（需要外网）。
  脚本本身只依赖 Python 3 标准库，无第三方依赖。

### 注意事项

- 根目录有一个遗留的 `default.profraw`（约 5MB 的 profiling 产物），与构建无关，忽略即可。
