/**
 * remark-glossary — 본문 마크다운에서 용어 사전(GLOSSARY) 표제어의
 * "첫 등장 1회"를 `/glossary#<id>` 링크로 자동 변환하는 remark 플러그인.
 *
 * 설계 (glossary.ts 상단 주석 구현):
 * - 한 문서 안에서 각 용어는 최초 1회만 링크한다(과잉 링크 방지).
 * - 헤딩 / 코드블록 / 인라인코드 / 이미 링크된 구간은 건드리지 않는다.
 * - 매칭 키는 표제어(term)의 괄호 앞 본체와 괄호 안 한글 설명.
 *   예: "FVG (불균형 갭)" → "FVG", "불균형 갭"
 * - 영문 약어(ASCII)는 단어 경계(\b)로 매칭해 오탐을 줄인다.
 * - 링크 노드에 `data-glossary=<id>` 를 실어 렌더러가 툴팁 컴포넌트로 교체한다.
 */

import { GLOSSARY } from "@/content/glossary";

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  url?: string;
  data?: { hProperties?: Record<string, string> };
};

type Matcher = { key: string; id: string; ascii: boolean };

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildMatchers(): Matcher[] {
  const matchers: Matcher[] = [];
  for (const e of GLOSSARY) {
    const keys = new Set<string>();
    // 표제어 본체 (괄호 앞)
    const base = e.term.replace(/\s*\([^)]*\)\s*/, "").trim();
    if (base) keys.add(base);
    // 괄호 안 한글 설명
    const paren = e.term.match(/\(([^)]+)\)/);
    if (paren) keys.add(paren[1].trim());
    for (const k of keys) {
      if (k.length < 2) continue; // 1글자 키 제외
      matchers.push({ key: k, id: e.id, ascii: /^[\x00-\x7F]+$/.test(k) });
    }
  }
  // 긴 키 우선 (겹침 방지: "BTC 도미넌스"가 "BTC"보다 먼저)
  matchers.sort((a, b) => b.key.length - a.key.length);
  return matchers;
}

const MATCHERS = buildMatchers();
// 이 타입의 노드 하위에서는 링크 변환을 하지 않는다.
const SKIP = new Set([
  "heading",
  "code",
  "inlineCode",
  "link",
  "linkReference",
]);

export function remarkGlossary() {
  return (tree: MdNode) => {
    const used = new Set<string>(); // 문서 전체에서 용어당 1회

    const visit = (node: MdNode) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === "text" && !SKIP.has(node.type)) {
          const replaced = linkifyText(child.value ?? "", used);
          if (replaced) {
            node.children.splice(i, 1, ...replaced);
            i += replaced.length - 1;
          }
        } else if (child.children && !SKIP.has(child.type)) {
          visit(child);
        }
      }
    };
    visit(tree);
  };
}

/** 텍스트 문자열에서 미사용 용어들을 순서대로 링크 노드로 분할한다. */
function linkifyText(text: string, used: Set<string>): MdNode[] | null {
  // 가장 이른 위치의 미사용 매처 선택 (동률이면 더 긴 키)
  let best: { idx: number; len: number; id: string } | null = null;
  for (const m of MATCHERS) {
    if (used.has(m.id)) continue;
    let idx = -1;
    if (m.ascii) {
      const re = new RegExp(`\\b${escapeRe(m.key)}\\b`);
      const mt = re.exec(text);
      if (mt) idx = mt.index;
    } else {
      idx = text.indexOf(m.key);
    }
    if (idx === -1) continue;
    if (
      !best ||
      idx < best.idx ||
      (idx === best.idx && m.key.length > best.len)
    ) {
      best = { idx, len: m.key.length, id: m.id };
    }
  }
  if (!best) return null;

  used.add(best.id);
  const before = text.slice(0, best.idx);
  const matched = text.slice(best.idx, best.idx + best.len);
  const after = text.slice(best.idx + best.len);

  const out: MdNode[] = [];
  if (before) out.push({ type: "text", value: before });
  out.push({
    type: "link",
    url: `/glossary#${best.id}`,
    data: { hProperties: { "data-glossary": best.id } },
    children: [{ type: "text", value: matched }],
  });
  // 같은 텍스트 노드의 나머지에서도 다른 용어를 계속 찾는다.
  if (after) {
    const rest = linkifyText(after, used);
    if (rest) out.push(...rest);
    else out.push({ type: "text", value: after });
  }
  return out;
}
