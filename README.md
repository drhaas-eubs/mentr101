# MENTR101 — The Entrepreneurial Cycle: Idea to Business

Course website for MENTR101 (EU Business School, Masters Level 7, 3 ECTS), built in the same
structure as `drhaas-eubs.github.io/marti301`.

© Dr. Hildegard Haas · Genedia AG Education — appears on every page. 

## Pages

| File | Content |
|---|---|
| `index.html` | Course hub: 8 unit accordions, search, links to everything |
| `unit1.html` … `unit8.html` | Framework gallery per unit (2 Slibraries × 5 frameworks) |
| `gallery.html` | All 80 frameworks, searchable and filterable by unit / AI only |
| `authors.html` | 32 Author Slibraries (why · foundation · frameworks · use · limits · impact) |
| `definitions.html` | 72 professional definitions with Harvard sources, filterable |
| `tools.html` | 35 venture tools with use case and caution, grouped in 7 categories |
| `ai.html` | The integrated AI teaching track and the four standing AI-use rules |
| `assessments.html` | Assessment 1 (40%) and Assessment 2 (60%) with full criteria |
| `syllabus.html` | Complete course outline: description, ILOs, CPC skills, hours, bibliography |
| `assets/css/mentr.css` | Design system (Arial only, navy / teal / amber, unit colour coding) |
| `activities/UnitN_Activities.html` | Session plan: phases, timings, tasks, materials, deliverable |
| `cases/UnitN_Case.html` | Teaching case with case data and five task questions |
| `prereading/UnitN_PreReading.html` | Pre-reading article, key framework, takeaway, references |
| `reflections/UnitN_Reflection.html` | Three reflection questions for independent study |
| `sheets.html` | Framework Sheet Library — 80 full A4 reference sheets, paged viewer |
| `authorsheets.html` | Author Slibrary Library — 32 full A4 author sheets |
| `assets/pdf/MENTR101_Framework_Sheets.pdf` | The same 80 sheets as a printable A4 PDF |
| `assets/pdf/MENTR101_Author_Slibraries.pdf` | The 32 author sheets as a printable A4 PDF |
| `assets/js/figures.js` | Parametric figure engine — numbered, labelled SVG diagrams |
| `assets/js/mentr.js` | Card rendering, three-part modal, search |

## Structure of the content

Every unit of the approved course outline has two Slibraries:

1. the established entrepreneurship frameworks for that stage of the cycle;
2. an **AI Slibrary** (teal) integrating artificial intelligence at exactly that stage —
   this is the new content that is not yet in the approved outline.

80 frameworks · 16 Slibraries. Every framework is delivered in three guaranteed parts:

1. **Slibrary card** — thumbnail figure, Slibrary number and sheet number (n/5);
2. **Short description** — professional definition, the labelled figure with its caption,
   four working points and the Harvard reference, in the modal;
3. **Full A4 reference sheet** — who developed it, why, how/when/by whom it is used,
   innovation relative to the predecessor tool, related frameworks and all sources.
   Viewable in `sheets.html` and downloadable as a PDF.

The author gallery follows the same three-part structure, with 32 A4 Author Slibraries.

## Core message and ILOs

Every unit carries a distilled core message produced with Bostelaar's method — decompose,
prioritise, three sentences, one sentence — together with the intended learning outcomes from
section 2 of the course outline that the unit addresses. It appears on the unit gallery page and the
session activity page in full, as a one-line banner on the home page, case, pre-reading and
reflection pages, and as a mapping table in the syllabus.

## Per-unit resources

Each of the eight units carries the full MARTI301-style resource set, reachable from the unit
accordion on the home page:

Framework Gallery · Session Activities · Case Study · Pre-Reading · Reflection Prompt ·
AI Slibrary · Framework Authors · A4 Reference Sheets

That is 8 session plans, 8 teaching cases, 8 pre-readings and 8 reflection prompts — 32 pages,
all composite teaching cases written for this course.

## View-only protection

Every page loads `assets/js/protect.js` and the protection block in `assets/css/mentr.css`:

- text selection, copy, cut, paste, drag and right-click are disabled;
- the shortcuts Ctrl/Cmd + C, X, S, P, U, A, Ctrl/Cmd+Shift+I/J/C and F12 are intercepted;
- printing produces a one-page licence notice instead of the content (print stylesheet plus a
  `beforeprint` shield), and `window.print()` is overridden;
- the "Download PDF" buttons have been removed from the two sheet viewers, and the
  `download` attribute is stripped from any link at load time;
- a footer line on every page states the licence condition.

**This is a deterrent, not encryption.** Anything a browser can display can still be captured by a
screenshot, by disabling JavaScript, by "view source", or by developer tools. Client-side protection
raises the effort and removes the accidental copy-paste; it cannot make the material technically
unobtainable. If material must be genuinely restricted, put it behind Moodle authentication with a
watermark carrying the student's name.

**Before deploying for students:** delete `assets/pdf/` from the repository. The PDFs are your own
teaching copies; leaving them in place makes the sheets downloadable by direct URL regardless of the
protection above.

## Deployment on GitHub Pages

1. Create a repository, e.g. `drhaas-eubs/mentr101`.
2. Copy the whole contents of this folder into the repository root
   (`index.html` must sit at the root, `assets/` beside it).
3. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.
4. The site appears at `https://drhaas-eubs.github.io/mentr101/`.

No build step, no dependencies, no external assets — every page works offline by opening it directly.

## Editing

All content lives in the three data files used to generate the site
(`data_a.py`, `data_b.py`, `data_c.py`) and is rendered by `build.py`.
To change a framework, an author card, a tool or a definition, edit the data and re-run the build,
or edit the generated HTML directly for one-off corrections.
