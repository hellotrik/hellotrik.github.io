#!/usr/bin/env sh
# 九息服气
# 吐纳九息集虚空元炁，可疗伤与恢复；聚则成形、散则成炁。
# 来源：天罡三十六法 · https://baike.baidu.com/item/%E5%A4%A9%E7%BD%A1%E4%B8%89%E5%8D%81%E5%85%AD%E6%B3%95/60754650 · kairos-dao-header
set -eu
ROOT="$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)"
cp "$ROOT/项目结构.canvas" "$ROOT/project-structure/canvas.json"
echo "已同步：项目结构.canvas -> project-structure/canvas.json"
