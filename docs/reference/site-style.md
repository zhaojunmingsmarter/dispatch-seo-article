# Existing website style observations

Inspected locally in `sailor_fe_c_pc`, branch `feature/zhaojunming-1103`, HEAD `3b050d1d884d7c5983fe1e99c5e3a87805b654ee`; not a deployed-artifact assertion.

| Source | Observed facts |
| --- | --- |
| `official/src/pages/blog/pc/index.less` | Accent `#FFE11C`, white page, black headings, muted `#999999`; article list cards |
| `official/src/pages/blog/pc/detail.less` | Body `#3D3D3D`, recent-post cards with hover image scaling/shadow |
| `official/src/pages/blog/pc/detail.tsx` | Header/footer, breadcrumb, title, author/date, cover, HTML article body and recent posts; no sticky ToC/product rail |
| `official/src/pages/home/mobile/cssStyles.ts` | MT-Regular, NotoSansArabicUI-Regular, NotoSans-Regular, KeeTa-Regular font families |
| `official/tpl/partials/google.njk` | GTM `GTM-5X6JHLD8` template include; no production ingestion verification |

The source uses literal colors here; no corresponding named CSS token contract was established. No UI component code or event helper is installed in this staging repository.
