# Product grounding

Keeta is a food delivery platform connecting customers, restaurants and delivery partners. It is the international brand of Meituan. This article integration currently targets the existing BR English and Brazilian Portuguese blog surfaces.

The source marketing description says: "Keeta connects customers, restaurants and delivery partners on an efficient food delivery platform."

Source: local `sailor_fe_c_pc/official/tpl/pages/home/br/en.njk`, inspected on branch `feature/zhaojunming-1103`, HEAD `3b050d1d884d7c5983fe1e99c5e3a87805b654ee`. This is local source evidence; it does not prove the deployed site's current geography, pricing, offers or availability.

## Problems and facets

1. Food delivery: customers seeking meals from local restaurants.
2. Restaurant delivery partnerships: restaurants seeking another channel to reach customers.
3. Courier delivery partnerships: people seeking delivery work and partnership information.

The website's blog describes these three audiences in `official/src/pages/blog/data/blog-posts.json`; two existing articles are retained as reference data in `docs/reference/existing-posts.json`. Re-read first-party product surfaces before researching. Do not derive topics from React, build tools, SEO infrastructure or this repository's own implementation.

## Editorial evidence

`docs/reference/existing-posts.json` and `existing-slugs.json` are snapshots, not the production source or a current promise of capabilities. Refresh against the current official source and MCP `get_pages` before proposing duplicates. Dynamic city coverage, offers, eligibility, pricing and numerical performance claims require fresh first-party evidence. Do not turn historical press-release claims into present-tense guarantees.
