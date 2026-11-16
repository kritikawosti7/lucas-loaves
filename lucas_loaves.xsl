<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/bakery">
    <html lang="en-AU">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="brand" /> | Fresh sourdough</title>
        <link rel="stylesheet" href="lucas_loaves.css" />
      </head>
      <body id="top">
        <header class="masthead">
          <div class="masthead-copy">
            <p class="eyebrow">A neighbourhood bakery</p>
            <h1><xsl:value-of select="brand" /></h1>
            <p class="tagline"><xsl:value-of select="tagline" /></p>
            <p class="intro"><xsl:value-of select="introduction" /></p>
            <a class="menu-link" href="#our-loaves">Explore today's loaves <span aria-hidden="true">&#8595;</span></a>
          </div>
          <figure class="bread-figure">
            <img src="{media/image/@src}" alt="{media/image/@alt}" width="{media/image/@width}" height="{media/image/@height}" />
            <figcaption>Slow dough. Warm ovens. Good bread.</figcaption>
          </figure>
        </header>
        <main>
          <section class="loaves" id="our-loaves" aria-labelledby="loaves-title">
            <div class="section-heading">
              <p class="eyebrow">Made fresh every morning</p>
              <h2 id="loaves-title">Today's loaves</h2>
            </div>
            <div class="product-grid">
              <xsl:for-each select="products/product">
                <article class="product" data-category="{@category}">
                  <p class="product-number"><xsl:number value="position()" format="01" /></p>
                  <h3><xsl:value-of select="name" /></h3>
                  <p class="description"><xsl:value-of select="description" /></p>
                  <p class="price"><span class="currency"><xsl:value-of select="price/@currency" /></span> $<xsl:value-of select="price" /></p>
                </article>
              </xsl:for-each>
            </div>
          </section>
          <section class="sound-section" aria-labelledby="sound-title">
            <div>
              <p class="eyebrow">A little bakery atmosphere</p>
              <h2 id="sound-title">Press play, take a breath.</h2>
            </div>
            <audio controls="controls" preload="metadata" aria-label="A short original bakery bell melody">
              <source src="{media/audio/@src}" type="{media/audio/@type}" />
              Your browser does not support audio playback.
            </audio>
          </section>
        </main>
        <footer>
          <p><xsl:value-of select="footer/copyright" /></p>
          <a href="#top" class="back-to-top">Back to top <span aria-hidden="true">&#8593;</span></a>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>