<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>
  <xsl:template match="/">
    <html lang="ko">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> · RSS</title>
        <style>
          :root {
            --bg: #f4ecd8;
            --fg: #1d1a16;
            --fg-muted: #6b6357;
            --accent: #c0653a;
            --border: #d6cab2;
            --card: #faf3e0;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #1a1714;
              --fg: #f0e9d6;
              --fg-muted: #a89e8c;
              --accent: #e8915f;
              --border: #3a342c;
              --card: #221e1a;
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Segoe UI", sans-serif;
            background: var(--bg);
            color: var(--fg);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 760px;
            margin: 0 auto;
            padding: 56px 24px 96px;
          }
          .eyebrow {
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-size: 12px;
            font-weight: 600;
            color: var(--accent);
          }
          h1 {
            margin: 12px 0 0;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: -0.02em;
            line-height: 1.1;
          }
          .lede {
            margin-top: 16px;
            font-size: 16px;
            color: var(--fg-muted);
          }
          .lede a { color: var(--accent); text-decoration: none; }
          .lede a:hover { text-decoration: underline; }
          .info {
            margin-top: 24px;
            padding: 16px 20px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            color: var(--fg-muted);
          }
          .info code {
            font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 13px;
            color: var(--accent);
            background: transparent;
          }
          .items {
            margin-top: 40px;
            list-style: none;
            padding: 0;
          }
          .item {
            padding: 24px 0;
            border-top: 1px solid var(--border);
          }
          .item:first-child { border-top: none; padding-top: 0; }
          .item-date {
            font-size: 13px;
            color: var(--fg-muted);
            font-variant-numeric: tabular-nums;
          }
          .item-title {
            margin: 6px 0 0;
            font-size: 22px;
            font-weight: 700;
            line-height: 1.3;
            letter-spacing: -0.01em;
          }
          .item-title a {
            color: var(--fg);
            text-decoration: none;
          }
          .item-title a:hover { color: var(--accent); }
          .item-desc {
            margin-top: 10px;
            color: var(--fg-muted);
            font-size: 15px;
          }
          .item-cats {
            margin-top: 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .cat {
            font-size: 11px;
            padding: 3px 9px;
            border: 1px solid var(--border);
            border-radius: 999px;
            color: var(--fg-muted);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p class="eyebrow">RSS Feed · <xsl:value-of select="/rss/channel/language"/></p>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="lede"><xsl:value-of select="/rss/channel/description"/></p>
          <div class="info">
            이 페이지는 <strong>RSS 피드</strong>입니다. Feedly·Inoreader·NetNewsWire 같은 RSS 리더에 이 주소를 등록하시면 새 글을 자동으로 받아보실 수 있습니다.<br/>
            피드 주소: <code><xsl:value-of select="/rss/channel/atom:link/@href"/></code><br/>
            사이트로 돌아가기: <a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute><xsl:value-of select="/rss/channel/link"/></a>
          </div>
          <ul class="items">
            <xsl:for-each select="/rss/channel/item">
              <li class="item">
                <div class="item-date"><xsl:value-of select="substring(pubDate, 1, 16)"/></div>
                <h2 class="item-title">
                  <a target="_blank" rel="noopener">
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h2>
                <p class="item-desc"><xsl:value-of select="description"/></p>
                <xsl:if test="category">
                  <div class="item-cats">
                    <xsl:for-each select="category">
                      <span class="cat"><xsl:value-of select="."/></span>
                    </xsl:for-each>
                  </div>
                </xsl:if>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
