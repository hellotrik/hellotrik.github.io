#!/usr/bin/env python3
"""\
古月方源·大爱仙尊｜卷土重来

千古地仙随风逝，昔日三王归青冢。
阳莽憾陨谁无败？卷土重来再称王。
天河一挂淘龙鱼，逆天独行顾八荒。
今日暂且展翼去，明朝登仙笞凤凰！

sourceBook: 蛊真人
sourceRef: 《蛊真人》全诗词整理（完整版）
sourceKind: poem

从 emoji-test.json（Unicode 全量 Emoji 图表结构）提取 emoji 字符，生成 emoji.txt。
也可从 unicode.org full-emoji-list.html 重新抓取并转换（需网络）。
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SAMPLES = ROOT / "unicode-sort" / "samples"
JSON_PATH = SAMPLES / "emoji-test.json"
TXT_PATH = SAMPLES / "emoji.txt"
CHART_URL = "https://unicode.org/emoji/charts/full-emoji-list.html"


def extractEmojiRowsFromJson(data: list) -> list[list[str]]:
    """从 emoji-test 结构数组中筛出序号行（4 列：序号、码点、字符、名称）。"""
    return [row for row in data if len(row) >= 4 and str(row[0]).isdigit()]


def writeEmojiTxtFromJson(json_path: Path = JSON_PATH, txt_path: Path = TXT_PATH) -> int:
    """
    读取 emoji-test.json，将全部 emoji 按图表顺序写入 emoji.txt（无分隔符）。

    返回 emoji 条目数。
    """
    data = json.loads(json_path.read_text(encoding="utf-8"))
    rows = extractEmojiRowsFromJson(data)
    txt_path.write_text("".join(row[2] for row in rows), encoding="utf-8")
    return len(rows)


def parseFullEmojiListHtml(html: str) -> list:
    """
    解析 Unicode full-emoji-list.html，输出与用户 emoji-test.json 同构的数组。

    实现原理：按 <tr> 扫描 bighead / mediumhead / 数据行（rchars + code + chars + name）。
    """
    result: list = []
    row_re = re.compile(
        r"<tr>\s*"
        r"(?:<th[^>]*class='(?:big|medium)head'[^>]*>.*?</th>|"
        r"<td class='rchars'>(\d+)</td>\s*"
        r"<td class='code'[^>]*>(U\+[^<]+)</td>\s*"
        r"<td class='chars'>([^<]*)</td>.*?<td class='name'>([^<]*)</td>)"
        r"\s*</tr>",
        re.DOTALL | re.IGNORECASE,
    )
    head_re = re.compile(
        r"<tr><th[^>]*class='(big|medium)head'[^>]*>.*?>([^<]+)</a></th></tr>",
        re.DOTALL | re.IGNORECASE,
    )

    pos = 0
    while pos < len(html):
        head = head_re.search(html, pos)
        data = row_re.search(html, pos)
        if head and (not data or head.start() < data.start()):
            result.append([unescape(head.group(2).strip())])
            pos = head.end()
            continue
        if data and data.group(1):
            idx, code, chars, name = data.group(1), data.group(2).strip(), data.group(3), data.group(4)
            result.append([idx, code, unescape(chars), unescape(name.strip())])
            pos = data.end()
            continue
        if data:
            pos = data.end()
            continue
        break
    return result


def fetchAndWriteJson(json_path: Path = JSON_PATH) -> list:
    """从 unicode.org 拉取图表 HTML 并写入 emoji-test.json。"""
    with urllib.request.urlopen(CHART_URL, timeout=60) as resp:
        html = resp.read().decode("utf-8", errors="replace")
    data = parseFullEmojiListHtml(html)
    json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return data


def main(argv: list[str]) -> int:
    if "--fetch" in argv:
        fetchAndWriteJson()
    count = writeEmojiTxtFromJson()
    print(f"emoji.txt: {count} entries from {JSON_PATH.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
