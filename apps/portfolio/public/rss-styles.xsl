<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>RSS Feed | <xsl:value-of select="/rss/channel/title"/></title>
        <meta charset="utf-8" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          :root {
            --brand-blue: #2563eb;
            --brand-purple: #9333ea;
            --text-main: #1f2937;
            --text-muted: #6b7280;
            --bg-body: #ffffff;
            --bg-card: #f9fafb;
            --border: #e5e7eb;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --text-main: #f3f4f6;
              --text-muted: #9ca3af;
              --bg-body: #030712;
              --bg-card: #111827;
              --border: #1f2937;
            }
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-body);
            color: var(--text-main);
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 4rem 2rem;
          }

          header {
            border-bottom: 1px solid var(--border);
            padding-bottom: 2rem;
            margin-bottom: 3rem;
          }

          h1 {
            font-size: 3rem;
            font-weight: 900;
            letter-spacing: -0.05em;
            margin: 0 0 1rem 0;
          }

          .description {
            font-size: 1.25rem;
            color: var(--text-muted);
            max-width: 600px;
          }

          .feed-meta {
            margin-top: 2rem;
            display: flex;
            gap: 1.5rem;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--text-muted);
          }

          .entry {
            display: block;
            text-decoration: none;
            color: inherit;
            padding: 2rem;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 2rem;
            margin-bottom: 2rem;
            transition: all 0.3s ease;
          }

          .entry:hover {
            transform: translateY(-4px);
            border-color: var(--brand-blue);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }

          .entry-title {
            font-size: 1.5rem;
            font-weight: 800;
            margin: 0 0 0.75rem 0;
            letter-spacing: -0.025em;
          }

          .entry-meta {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--brand-blue);
            margin-bottom: 1rem;
          }

          .entry-description {
            color: var(--text-muted);
            font-size: 1rem;
            margin-bottom: 1.5rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            font-size: 0.75rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--brand-blue);
          }

          .notice {
            background: var(--bg-card);
            border: 1px solid var(--border);
            padding: 1.5rem;
            border-radius: 1rem;
            margin-bottom: 3rem;
            font-size: 0.875rem;
          }

          .notice a {
            color: var(--brand-blue);
            font-weight: 700;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="notice">
            <strong>Web Feed:</strong> This is a technical RSS feed. You can subscribe to these articles using a feed reader like <a href="https://feedly.com">Feedly</a>, <a href="https://netnewswire.com/">NetNewsWire</a>, or <a href="https://reederapp.com/">Reeder</a>.
          </div>

          <header>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
            <div class="feed-meta">
              <span>Updated: <xsl:value-of select="/rss/channel/lastBuildDate"/></span>
              <span><a href="{/rss/channel/link}" style="color: inherit; text-decoration: none;">Visit Website →</a></span>
            </div>
          </header>

          <div class="entries">
            <xsl:for-each select="/rss/channel/item">
              <a class="entry" href="{link}">
                <div class="entry-meta">
                  <xsl:value-of select="pubDate" />
                </div>
                <h2 class="entry-title"><xsl:value-of select="title"/></h2>
                <p class="entry-description"><xsl:value-of select="description"/></p>
                <div class="btn">Read Article <span>→</span></div>
              </a>
            </xsl:for-each>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
