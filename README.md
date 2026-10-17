# StoryCast Accessible Media Feature Microsite

A 3-page microsite for audio and video documentary storytelling, built with **semantic HTML5, Sass and a little vanilla JavaScript no frameworks**. Designed in Figma (forest green · lime · off-white · charcoal · sage) and built to WCAG 2.1 AA.

| Page | File |
| --- | --- |
| Home | `index.html` |
| Story detail | `story/story-one.html` |
| About & Accessibility | `about.html` |

**Live site:** _add your GitHub Pages / hosting URL here_

**Wireframes (Figma, page 2):** https://www.figma.com/design/peUIbsy5zzb8otJ0jKyz95?node-id=1-2 ·

**High-fidelity mockups (Figma, page 3):** https://www.figma.com/design/peUIbsy5zzb8otJ0jKyz95?node-id=1-3 · 

**Design system (Figma, page 1):** https://www.figma.com/design/peUIbsy5zzb8otJ0jKyz95?node-id=0-1

**Sitemap (Figma, sitemap):** https://www.figma.com/board/g9h4KIZrh34tM6I9CoK2hp/StoryCast-Sitemap?node-id=0-1&t=P771abOiUe25rnIC-1 

**Research Document (PDF):** https://github.com/murinziben/storycast/blob/main/docs/StoryCast-Research-Document.pdf
---

## Project structure

```
storycast/
├── index.html                  Home
├── about.html                  About & Accessibility
├── story/
│   └── story-one.html          Story detail (video, transcript, related stories)
├── sass/                       Source styles (edit these)
│   ├── main.scss               Entry point — declares cascade layers, loads partials
│   ├── _colors.scss            Colour tokens + semantic roles
│   ├── _typography.scss        Font families, fluid type scale, weights
│   ├── _spacing.scss           Spacing scale, radius, breakpoints, sizes
│   ├── _mixins.scss            Breakpoint, focus-ring, visually-hidden, eyebrow
│   ├── _utilities.scss         Highest-priority helpers (.sr-only …)
│   ├── base/                   fonts, tokens → CSS variables, reset, base elements
│   ├── layout/                 container, header/nav, footer
│   ├── components/             button, tag, media-frame, video-preview, audio-card,
│   │                           range, video-player, transcript, article, feature
│   └── pages/                  home, story, about
├── css/main.css                Compiled stylesheet (committed so the site runs as-is)
├── js/                         Vanilla JS, one small file per concern
│   ├── nav.js                  Mobile menu toggle
│   ├── format.js               Time formatting helpers
│   ├── video-player.js         Custom accessible video controls
│   ├── audio-player.js         Custom accessible audio controls
│   └── transcript.js           Show/hide full transcript
├── assets/
│   ├── images/                 Documentary photography + favicon
│   ├── video/                  Films (mp4)
│   ├── audio/                  Audio stories (mp3)
│   ├── captions/               WebVTT caption track(s)
│   ├── transcripts/            Plain-text transcripts for every video/audio story
│   └── fonts/                  Self-hosted Bricolage Grotesque + Public Sans
└── docs/                       Sitemap (png) and research document (PDF)
```

## Running locally

Requirements: Node.js 18+ (only needed for Sass and the dev server).

```bash
npm install        # installs Sass and a tiny static server
npm run build      # compiles sass/main.scss → css/main.css
npm run watch      # (optional) recompile on every change
npm run serve      # serves the site at http://localhost:8080
```

Open <http://localhost:8080>. Use the local server rather than double-clicking the HTML files: browsers block caption tracks (`<track>`) and media seeking on `file://` URLs. `npm run serve` uses a server that supports HTTP range requests so the video can be scrubbed.

The compiled `css/main.css` is committed, so the site also works on any static host (e.g. GitHub Pages) without a build step. All links are relative, so it works from a sub-path such as `username.github.io/storycast/`.

## How the CSS is organised

- **Tokens** live in `_colors`, `_typography` and `_spacing` as Sass maps and are emitted as CSS custom properties (`--color-accent`, `--space-4`, `--fs-3xl` …). Components use *semantic roles* (`--color-bg-brand`, `--color-text-muted`) rather than raw hex values.
- **Cascade layers** set priority explicitly: `reset < tokens < base < layout < components < pages < utilities`.
- **BEM** naming: `.block`, `.block__element`, `.block--modifier` (e.g. `.audio-card__image`, `.btn--accent`).
- **Responsive:** mobile-first CSS Grid + Flexbox with `min-width` breakpoints.
- **Container query:** `.audio-card` (`sass/components/_audio-card.scss`) declares `container-type: inline-size` and switches from stacked to side-by-side when *its own* width reaches 28rem — independent of the viewport.
- **Progressive enhancement:** every interactive widget works without JS (native video/audio controls, full transcript visible, nav open). JS upgrades them.

## Accessibility checklist how each requirement is met

| Requirement | How it is met |
| --- | --- |
| **Semantic HTML5** | `header`, `nav`, `main`, `section` (each labelled by its heading), `article`, `aside`, `figure`/`figcaption`, `footer`, `time`, `dl` for metadata and transcripts, `details`/`summary` for audio transcripts. One `h1` per page and no skipped heading levels. |
| **Captions for video** | `<track kind="captions" srclang="en" default>` pointing at `assets/captions/<story>.en.vtt`. Captions are on by default and have a CC toggle (`aria-pressed`). Caption text is styled with `::cue` (white on near-black). |
| **Transcripts for all audio/video** | The film has an on-page speaker-labelled transcript (“Read Transcript”) plus a downloadable `.txt`. Each audio story has an expandable on-page transcript and a `.txt` in `assets/transcripts/`. |
| **Figure descriptions** | The video is wrapped in a `<figure>` whose `<figcaption>` describes the scene and lists shortcuts. |
| **Colour contrast (AA)** | All text pairs ≥ 7.8:1 on light surfaces and ≥ 8:1 on dark surfaces (body text needs 4.5:1). Lime is only ever used as a fill or on dark backgrounds. Seek-bar track is ≥ 3:1. See the table in the research PDF. |
| **Keyboard navigation** | Everything is a real `<a>` / `<button>` / `<input>`. Skip link is the first tab stop. Player shortcuts: **K** play/pause, **C** captions, **M** mute, **F** fullscreen, **←/→** skip 5 s. **Esc** closes the mobile menu. |
| **Visible focus** | A global `:focus-visible` style: 3px lime outline + 6px forest halo, visible on both light and dark surfaces. Forced-colours mode falls back to the system highlight. |
| **ARIA where HTML isn't enough** | `aria-expanded`/`aria-controls` on the menu and transcript toggles; `aria-pressed` on mute, captions, fullscreen and audio play buttons; `aria-label` on icon-only buttons; `aria-valuetext` (“2 minutes 5 seconds of 12 minutes 4 seconds”) on seek sliders; `role="status"` live region announcing caption/mute changes; `aria-current="page"` in nav; decorative icons and images use `aria-hidden` / empty `alt`. |
| **Not colour alone** | Pressed buttons also change icon and `aria-label`; the active nav item is underlined; categories and CC badges carry text. |
| **Touch targets** | Controls are at least 44 × 44 px. |
| **Reduced motion** | Hover zooms and smooth scrolling are disabled under `prefers-reduced-motion`. |
| **Responsive** | Verified at 1440, 768 and 390 px with no horizontal scrolling. |
| **Automated checks** | axe-core (WCAG 2.0/2.1 A + AA + best-practice): 0 violations on all three pages. |

### Tested

- axe-core 0 violations on every page (desktop viewport).
- No horizontal overflow at 1440 / 768 / 390 px.
- Keyboard: tab order, skip link, menu toggle, play/pause/mute/captions/seek shortcuts, transcript toggle.
- Recommended before submitting: a quick pass with a screen reader (NVDA/VoiceOver) and browser zoom to 200 %.

## Media note

Two real films are used, one per story page:

| Page | Film | Length | Captions / transcript |
|---|---|---|---|
| `story/story-one.html` | *SHE Creates Change* (Dewmini's story), presented by Room to Read | 5:41 | `she-creates-change.en.vtt`, `she-creates-change.txt` |
| `story/story-two.html` | *Mother Hood* (trailer) | 1:41 | `mother-hood.en.vtt`, `mother-hood.txt` |

The captions and transcripts were written from the subtitles and title cards burned into the videos (read from the video frames and checked by hand), because no speech-recognition model could be used. Timings are accurate to about half a second. In *SHE Creates Change* the animated section (1:40 to 5:35) has no dialogue subtitles, so it is described in the transcript but not captioned; a human review of the audio is recommended before public release.

The two audio stories (`assets/audio/*.mp3`) are still **silent placeholders** and their descriptions are illustrative. Replace them with real audio and update the transcripts.

## Credits

- Typefaces: Bricolage Grotesque and Public Sans (SIL Open Font License), self-hosted via Fontsource.
- Icons: Lucide (ISC licence).
- Photography: placeholder documentary imagery supplied with the Lovable design — replace or credit as appropriate before public release.
- Video: *SHE Creates Change* is by Room to Read, in association with the Troper Wojcicki Foundation (executive producers Brenda Chapman, Jill Culton, Freida Pinto, Dr. Geetha Murali, Nexus Studios). *Mother Hood* trailer: source and credit to be added by the project team. Both videos are used here for a non-commercial university assignment; confirm permission before any public release.
