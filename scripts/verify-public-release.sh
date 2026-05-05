#!/usr/bin/env bash
# verify-public-release.sh — v0.1.0 공개 출시 가드.
#
# 외부 degit 사용자가 클론 후에도 깨지지 않도록 보장하는 9단계 검사.
# 한 단계라도 실패하면 즉시 exit 1 한다.
#
# 사용:
#   npm run check:public-release
#
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

echo "[1/9] symlink 박제 검사 (.claude / .agents 가 mode 120000 이면 안 됨)"
symlinks_in_index="$(git ls-files -s .claude .agents 2>/dev/null | awk '$1 == "120000" { print }' | wc -l | tr -d ' ')"
if [ "$symlinks_in_index" != "0" ]; then
  echo "FAIL: $symlinks_in_index symlink entries tracked"
  exit 1
fi

echo "[2/9] 개인 식별자 검사 (kbk·missing107·gwonbeomgyu·GoogleDrive·Obsidian Vault·로컬 경로)"
# 다음 파일은 검사 패턴을 부재 검증·문서 목적으로 보유해 false positive 발생 → 제외.
#   - package-lock.json: 외부 식별자가 아닌 내부 의존 메타
#   - rootLayout.test.tsx: 회귀 테스트가 패턴 부재를 assert
#   - scripts/verify-public-release.sh: 본 스크립트 자체가 검사 키워드 포함
hits=$(git ls-files \
  | grep -vE '^(package-lock\.json|.*tests?/.*rootLayout\.test\.tsx|scripts/verify-public-release\.sh)$' \
  | xargs grep -lE "(kbk|missing107|gwonbeomgyu|GoogleDrive|Obsidian Vault|shortcut-targets|/Users/gwonbeomgyu)" 2>/dev/null || true)
if [ -n "$hits" ]; then
  echo "FAIL: personal identifiers found in:"
  echo "$hits"
  exit 1
fi

echo "[3/9] 옵시디언/하네스 의존 검사 (.claude/ 내부)"
dep_hits=$(git ls-files .claude/ | xargs grep -liE "(obsidian|harness-entry-gate|vault-path|mcp__obsidian)" 2>/dev/null || true)
if [ -n "$dep_hits" ]; then
  echo "FAIL: obsidian/harness deps found in:"
  echo "$dep_hits"
  exit 1
fi

echo "[4/9] CLAUDE.md 데드 링크 검사 (루트 + 워크스페이스 6종)"
dead=0
for f in CLAUDE.md apps/web/CLAUDE.md apps/api/CLAUDE.md apps/api/src/services/CLAUDE.md apps/api/src/repositories/CLAUDE.md packages/shared-types/CLAUDE.md packages/ui/CLAUDE.md; do
  [ -f "$f" ] || { echo "FAIL: missing $f"; exit 1; }
  while IFS= read -r link; do
    case "$link" in
      http://*|https://*) continue ;;
      \#*) continue ;;
    esac
    target_dir="$(dirname "$f")"
    if [ ! -e "$target_dir/$link" ]; then
      echo "DEAD: $f -> $link"
      dead=$((dead + 1))
    fi
  done < <(grep -oE '\]\([^)]+\)' "$f" | sed 's/](//;s/)$//')
done
if [ "$dead" != "0" ]; then
  echo "FAIL: $dead dead link(s)"
  exit 1
fi

echo "[5/9] .vite/ 추적 + local 파일 추적 검사"
vite_tracked=$(git ls-files | grep -cE '^\.vite/' || true)
local_tracked=$(git ls-files | grep -cE '(^|/)(CLAUDE|AGENTS|GEMINI)\.local\.md$' || true)
if [ "$vite_tracked" != "0" ] || [ "$local_tracked" != "0" ]; then
  echo "FAIL: .vite tracked=$vite_tracked, *.local.md tracked=$local_tracked"
  exit 1
fi

echo "[6/9] package.json name 검사"
name=$(node -e "console.log(require('./package.json').name)")
if [ "$name" = "kbk-monorepo-template" ] || [ -z "$name" ]; then
  echo "FAIL: package.json name = '$name'"
  exit 1
fi
echo "      name = $name"

echo "[7/9] .github 메타 검사 (placeholder URL·개인 식별자)"
gh_hits=$(find .github -type f \( -name "*.md" -o -name "*.yml" -o -name "CODEOWNERS" \) -print0 | xargs -0 grep -lE "(missing107|github\.com/discussions[^/_a-zA-Z])" 2>/dev/null || true)
gh_kbk=$(find .github -type f \( -name "*.md" -o -name "*.yml" -o -name "CODEOWNERS" \) -print0 | xargs -0 grep -lE "(\bkbk\b)" 2>/dev/null || true)
if [ -n "$gh_hits" ] || [ -n "$gh_kbk" ]; then
  echo "FAIL: .github metadata leaks:"
  [ -n "$gh_hits" ] && echo "$gh_hits"
  [ -n "$gh_kbk" ] && echo "$gh_kbk"
  exit 1
fi

echo "[8/9] MySQL 잔존 검사 (apps/api/README.md)"
if grep -iE "mysql|kbk-mysql" apps/api/README.md >/dev/null 2>&1; then
  echo "FAIL: mysql keyword still in apps/api/README.md"
  exit 1
fi

echo "[9/9] LICENSE 존재 검사"
[ -f LICENSE ] || { echo "FAIL: LICENSE missing"; exit 1; }
grep -qiE "MIT License|Apache License|BSD" LICENSE || { echo "FAIL: LICENSE body not recognized"; exit 1; }

echo ""
echo "[OK] all 9 checks passed."
