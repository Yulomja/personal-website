---
name: Loredana Piazza
description: Provisional visual system for a professional personal website.
colors:
  paper: "#f8f8f4"
  ink: "#202c3c"
  muted: "#5a6473"
  accent: "#434ac6"
  accent-hover: "#30369c"
  line: "#dadddf"
  wash: "#eeeff7"
  white: "#ffffff"
typography:
  display:
    fontFamily: "'DM Sans Variable', 'DM Sans', sans-serif"
    fontSize: "clamp(4.5rem, 8.6vw, 6rem)"
    fontWeight: 550
    lineHeight: 0.99
    letterSpacing: "-0.04em"
  heading:
    fontFamily: "'DM Sans Variable', 'DM Sans', sans-serif"
    fontSize: "clamp(2.6rem, 5.8vw, 4.6rem)"
    fontWeight: 550
    lineHeight: 1.17
    letterSpacing: "-0.03em"
  body:
    fontFamily: "'DM Sans Variable', 'DM Sans', sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  button:
    fontFamily: "'DM Sans Variable', 'DM Sans', sans-serif"
    fontSize: "0.9rem"
    fontWeight: 500
    lineHeight: 1.65
    letterSpacing: "normal"
rounded:
  button: "5px"
  panel: "8px"
spacing:
  paragraph: "1rem"
  action-gap: "30px"
  column-gap: "50px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 22px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
  button-small:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
    padding: "12px 17px"
  contact-panel:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "44px 48px 46px"
---

# Design System: Loredana Piazza

## Overview

This documents the current provisional implementation of the requested clean, professional, uncluttered website. Detailed UI direction remains deferred; this is an implementation reference, not a new brand identity. The source of truth is `app/globals.css` and the rendered React components.

The page uses generous open space, navy text, restrained blue-purple accents and a single sans-serif family. Typographic hierarchy and fine horizontal rules organise content. English and German share the same visual system and accommodate their different text lengths.

**Key Characteristics:**
- Light backgrounds and readable text.
- Spacious sections with clear headings.
- Restrained accent colour and simple link actions.

## Colors

### Primary

Accent marks the name punctuation, link hover, focus outlines and the development-status dot. Accent-hover supplies darker status and article-link text; the primary button's hover uses accent itself.

### Neutral

Paper is the page background; ink is the main text and primary-button fill. Muted identifies supporting text and inactive navigation. Line separates sections. Wash distinguishes the contact panel. White supplies text on dark buttons and the focused skip link.

## Typography

DM Sans Variable, DM Sans and the sans-serif fallback serve every text role. Headings use medium weight and tight tracking; body text uses a relaxed line height and a maximum measure of 72ch. The frontmatter records the desktop display, general page heading, body and button roles.

Section headings use (1.65rem), while section labels are smaller. Metadata uses muted text and tabular numerals. On small screens, body text becomes (16px), the home display uses `clamp(3.5rem, 20vw, 4.8rem)`, and the introduction uses (1.4rem). Page-specific heading overrides remain in the stylesheet.

## Layout

The shared container is `min(1120px, calc(100% - 112px))`, centred. At widths up to (1000px), horizontal gutters become (32px); up to (650px), they become (20px). Home sections, CV sections and project rows use a (1fr 2fr) grid with the column-gap token, change to (1fr 2.1fr) with a (30px) gap at the intermediate breakpoint, and stack at the small breakpoint.

The hero has generous vertical space. On larger screens, the name, role, location, introduction and actions form a text column beside the supplied portrait. The portrait uses a 4:5 frame with restrained rounding and a crop positioned at centre 35%; its original image file is preserved unchanged. At widths up to 800px, the layout stacks the name and role, portrait, introduction and actions. The image is capped at 320px in the stacked layout. Actions wrap as needed. Mobile navigation occupies a full second header row; the language switch stays beside the wordmark. Preserve these flexible layouts when German text takes more space.

## Elevation & Depth

The implementation uses no box shadows. Fine borders establish section boundaries, and the tinted contact panel creates a distinct surface without elevation.

## Shapes

Buttons have modest rounding; the contact panel has slightly softer corners. Status markers are small solid circles. Simple line arrows accompany actions, with diagonal arrows for external/contact destinations. Keep section boundaries as thin horizontal rules.

## Components

### Buttons and links

Primary actions are dark filled links with white text and inline arrows. The smaller download variant retains the same treatment with compact padding and type. Hover changes the fill to accent over (0.2s). Text actions remain unfilled, medium-weight links; their arrows translate (3px) on hover over (0.2s).

Links and buttons receive an accent outline (3px) offset by (5px) on keyboard focus. The skip link appears when focused. Preserve these visible states.

### Navigation

The wordmark is compact and medium-bold. Inactive links are muted; the current page uses ink with an accent underline. The language switch is separated by a vertical rule on larger screens and moves to the header's first row on small screens.

### Contact panel and content rows

The contact panel uses the wash background and panel rounding. On small screens its padding becomes (30px 25px 32px) and its actions stack. Professional experience and projects use open content rows separated by rules. The development label pairs text with an accent dot; it is informational, not a control.

### Motion and article content

The home display arrives over (0.75s) with a small vertical movement and blur when reduced motion is not requested. Reduced-motion preferences disable animation and transitions and restore automatic scrolling. Article content keeps links wrap-safe, images responsive and code/table overflow scrollable.

## Do's and Don'ts

- **Do** reuse the documented palette, typography and existing action patterns.
- **Do** retain visible keyboard focus and reduced-motion handling.
- **Do** verify English and German layouts at narrow widths.
- **Don't** treat this provisional implementation as a user-approved final brand identity.
- **Don't** replace the open section layout with decorative containers without a design request.
