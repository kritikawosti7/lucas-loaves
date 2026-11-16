# Luca's Loaves: XML project

This folder is the first project in the XML assignment. The XML is the source of truth for the bakery content. Its external DTD declares the document structure, and its XSLT transforms that data into browser-compatible HTML. The HTML output can then load CSS, an animated GIF and a WAV file. XML alone does not provide HTML image or audio playback.

## Files and setup

In Visual Studio Code, open the `XML_Assignment` folder. In `Lucas_Loaves`, create or keep these files:

| File | Purpose |
| --- | --- |
| `lucas_loaves.xml` | UTF-8 bakery data; references its DTD and XSLT |
| `lucas_loaves.dtd` | External rules for allowed elements, nesting and attributes |
| `lucas_loaves.xsl` | XSLT 1.0 transformation from XML data to HTML |
| `lucas_loaves.css` | Responsive cream-and-brown presentation |
| `bread.gif`, `bread.wav` | Original animated illustration and short melody |
| `generate_assets.js` | Reproducibly generates the two media assets using Node.js only |
| `serve.js` | Starts a local-only preview server for browser testing |

The asset generator uses Node's built-in modules; it needs no package installation. In VS Code, open **Terminal > New Terminal**, check that the terminal is in `Lucas_Loaves`, and run:

```powershell
node .\generate_assets.js
```

If the terminal is currently in the assignment root, run `node .\Lucas_Loaves\generate_assets.js` instead. Keep the generated files beside the XML and stylesheet files so their relative references resolve.

## XML tree

```text
bakery
|-- brand
|-- tagline
|-- introduction
|-- products
|   |-- product [id, category]
|   |   |-- name
|   |   |-- price [currency]
|   |   `-- description
|   `-- product (repeated for all four loaves)
|-- media
|   |-- image [src, alt, width, height]
|   `-- audio [src, type, title]
`-- footer
    `-- copyright
```

## Design and development notes

**Methodology.** The design starts with the content and its hierarchy, then defines a DTD contract, adds the transformation and responsive presentation, and finishes with validation and browser/device testing. Work incrementally: change one layer, revalidate, preview, record the result, and correct discrepancies. The XML contains all four product names, AUD prices and descriptions; XSLT repeats the product template from the XML rather than duplicating menu content in HTML.

**Elements, attributes and entities.** Elements such as `product`, `name` and `description` hold structured content. Attributes such as `id`, `category`, `currency` and `src` qualify an element with compact metadata. `id` values uniquely identify each product. XML reserves `&` and `<`; write them as `&amp;` and `&lt;` in text, and quote attribute values. Apostrophes are valid in element text. The current content needs no custom entity declarations.

**DTD.** The external DTD specifies the required root and child order, permits one or more products, gives each product a required unique ID and category, constrains category and currency values, and requires descriptions and accessible media text. A DTD checks structure, not whether the bakery claims or prices are factually correct. It also cannot enforce that a referenced file exists; check those paths separately.

**CSS.** The stylesheet uses a cream paper background, dark brown text, caramel accents, a responsive two-column desktop product grid and a single-column mobile layout. Focus states, readable line-height and a reduced-motion preference are included. Google Fonts are an optional online enhancement; Georgia and Segoe UI fallbacks keep the page readable offline. The image and audio files are local.

**Tools.** Visual Studio Code is used to edit the XML, DTD, XSLT and CSS. Node.js generates the original GIF and WAV. A standards-aware XML parser validates the external DTD. Edge and Firefox (or Chrome) are suitable browser checks; use desktop and a real phone or a browser's device emulation for viewport checks.

## Legislation and standards to discuss

- **XML 1.0 (Fifth Edition), W3C Recommendation:** governs XML syntax and well-formed documents. The external DTD adds a validity check.
- **XSLT 1.0, W3C Recommendation:** defines the XML-to-HTML transformation used here.
- **HTML Living Standard, WHATWG:** defines the generated `img`, `audio`, `source`, document language and media controls used for browser presentation.
- **CSS specifications, W3C:** define the stylesheet features used for responsive layout, focus and reduced-motion handling.
- **WCAG 2.2, W3C Recommendation:** use as the accessibility evaluation standard, including text contrast, keyboard access, meaningful image alternatives and reduced motion. This project provides a useful basis but needs measured contrast and keyboard/browser checks before claiming conformance.
- **Copyright Act 1968 (Cth), Australia:** use only media you created, licensed or have permission to use. The generator creates original simple media for this assignment; do not copy a GIF or recording from a website without permission.
- **Disability Discrimination Act 1992 (Cth), Australia:** relevant to accessible digital services. Treat WCAG review as a practical accessibility check, not as a legal guarantee.
- **Privacy Act 1988 (Cth), Australia:** no personal information is collected by this static project. Reassess privacy obligations before adding forms, analytics or user accounts; whether the Act applies depends on the organisation and activity.

Check the current official versions and your course's required referencing style before submitting. Listing a law or standard is not proof of legal compliance.

## Validate and open offline

### Validate the XML and DTD in Windows PowerShell

Run this from the `Lucas_Loaves` directory. It uses .NET's XML reader with DTD validation enabled and resolves the DTD relative to the XML file:

```powershell
$settings = [System.Xml.XmlReaderSettings]::new()
$settings.DtdProcessing = [System.Xml.DtdProcessing]::Parse
$settings.ValidationType = [System.Xml.ValidationType]::DTD
$settings.XmlResolver = [System.Xml.XmlUrlResolver]::new()
$reader = [System.Xml.XmlReader]::Create((Resolve-Path .\lucas_loaves.xml), $settings)
try { while ($reader.Read()) {} ; 'XML is well-formed and valid against lucas_loaves.dtd.' }
finally { $reader.Dispose() }
```

For a separate command-line option, install `xmllint` through a trusted package manager and run `xmllint --noout --valid lucas_loaves.xml` from this folder. Do not treat successful parsing without DTD validation as a validity result.

Generate assets if needed, then start the preview server from this folder:

```powershell
node .\generate_assets.js
node .\serve.js
```

Open `http://127.0.0.1:4173/lucas_loaves.xml` in Edge or Firefox. The server is bound to the local computer only; stop it with Ctrl+C in the terminal. The XML stylesheet processing instruction asks the browser to apply the local XSLT; the transformed page loads the CSS and media files over HTTP. Browsers currently warn that built-in XSLT processing is deprecated, so record the browser/version used and follow any course requirement for a transformation fallback. No server-side application or package installation is required.

### Test matrix and result record

Do not mark a test as passed until you have performed it. Record the date, browser/device/version, viewport or screen size, expected result, observed result and any correction.

| Test | Expected result | Result to record |
| --- | --- | --- |
| XML + external DTD | Validator reports no well-formedness or validity errors | Passed 2026-11-15 using Windows PowerShell/.NET `XmlReader` with DTD validation enabled |
| Asset references | `bread.gif` animates and `bread.wav` is found and playable | Passed local HTTP preview: GIF produced six distinct rendered frames; WAV decoded to 3.2 seconds and playback time advanced |
| Content | Four names, four descriptions, and AUD $7.00, $8.00, $9.00, $9.50 display | Passed local browser preview; all four products, prices and copyright were present |
| Desktop browser 1 | No missing files, overflow or unreadable text | VS Code embedded Chromium 148; transformed page and media rendered without horizontal overflow; external-DTD MIME warning noted below |
| Desktop browser 2 | Same content and usable native audio controls | Browser/version and result: __________ |
| Desktop device | Layout readable at desktop width | Device/viewport and result: __________ |
| Mobile device | One-column cards, no horizontal scrolling, usable controls | Browser emulation reported 360 and 305 CSS pixels: one column and no overflow at both widths; physical phone not tested |
| Accessibility | Keyboard focus visible; image has meaningful alternative; reduced motion respected | Findings/corrections: __________ |
| Offline | With network disabled, local content, GIF and WAV work; web font may fall back | Result/corrections: __________ |

For a quick two-browser/two-device assessment, test Edge on a Windows computer and Firefox on a second desktop browser, then test a phone and a tablet (or record browser device-emulation dimensions if physical devices are unavailable). Verify actual audio playback with user interaction. Browsers may restrict autoplay; this page deliberately uses controls and does not autoplay.

## Hosting and evidence

For online testing, publish the whole `Lucas_Loaves` folder to a static host that serves XML, XSLT, CSS, GIF and WAV with correct relative paths and MIME types. Test the hosted XML URL in two browsers and one phone-sized viewport. A course-approved static host or GitHub Pages can be used; check that the host permits the XML/XSLT content type and that its security policy does not block the transformation. If it does, host the transformed HTML through an approved build step or a course-approved server while retaining and submitting the validated XML and DTD.

Capture these assessment screenshots after testing:

1. VS Code Explorer showing all project files.
2. The XML source showing the XML declaration, stylesheet processing instruction and external DTD declaration.
3. The DTD source showing the product/content model and required attributes.
4. The validator command and its actual successful output.
5. The rendered desktop page showing all four loaves and prices.
6. The rendered mobile page showing the responsive layout.
7. The animated GIF visibly in motion (a short screen recording is stronger evidence than a still image).
8. The audio control during playback, plus your browser/device test record.
9. The hosted page URL and rendered result, only if online hosting is part of your submission.

Do not fabricate test results. Add dated observations and corrections to the test matrix after you run each test. This first project should be fully validated before beginning Bryan's Café.

**Observed browser note (2026-11-15).** The embedded Chromium rendered the XSLT output and media, but logged a warning rejecting the external DTD MIME type and warned that browser XSLT processing instructions are deprecated. The DTD validity result above comes from the independent .NET validator, not from the browser preview. Check the course's target browsers and hosting MIME behavior before submission; if XSLT processing is unavailable there, use a course-approved transformation/build step while retaining these XML and DTD source files.