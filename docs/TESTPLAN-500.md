# MyMilesAI.com — Launch Test Plan (500 cases)

> Generated 2026-05-14. Covers marketing, auth, /app/, and cross-cutting concerns
> (CSP, perf, a11y, security, responsive, offline, browser compat). Numbering is
> exhaustive and contiguous from 1 to 500 — do not renumber when extracting.

## Index

| Range | Section |
|---|---|
| 1–40 | Marketing landing (`index.html`, `ms-parts1.jsx`, `ms-parts2.jsx`) |
| 41–60 | Features (`features.html`) |
| 61–80 | How It Works (`how-it-works.html`) |
| 81–100 | Pricing (`pricing.html`) |
| 101–115 | About (`about.html`) |
| 116–145 | Blog (`blog.html` + 7 posts) |
| 146–175 | Solutions (`solutions/index.html` + 6 sub-pages) |
| 176–205 | Sign In (`/signin/`) |
| 206–235 | Sign Up (`/signup/`) |
| 236–255 | Auth Callback (`/auth-callback/`) |
| 256–265 | Welcome (`/welcome/`) |
| 266–305 | `/app/` Dashboard |
| 306–345 | `/app/` Trips |
| 346–365 | `/app/` Places |
| 366–385 | `/app/` Reports |
| 386–405 | `/app/` Vehicles |
| 406–445 | `/app/` Settings |
| 446–455 | Privacy / Terms |
| 456–500 | Cross-cutting (CSP, perf, a11y, security, responsive, browser, SEO, data) |

Pre-conditions glossary:
- **clean browser** = fresh profile, no localStorage, no Supabase session, no cached SW
- **signed-in user** = `aman.s38@outlook.com` test account with seeded trips/vehicles/places
- **unauth** = no Supabase session in storage
- **desktop** = 1440×900 Chrome 130
- **mobile** = iOS Safari 18 at 390×844 (iPhone 14)

---

## 1. Marketing landing — `index.html` (cases 1–40)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 1 | P0 | smoke | clean browser, desktop | GET https://mymilesai.com/ | 200 OK; HTML returns; React root renders within 2s | DevTools Network: index.html status 200; `#root` has children after 2s |
| 2 | P0 | smoke | desktop | open DevTools console, reload | No JS errors, no React hydration warnings | Console: 0 errors, 0 warnings (Babel info messages allowed) |
| 3 | P0 | smoke | desktop | inspect `<title>` and `<meta name=description>` (in `<meta property=og:description>`) | Title is "MyMilesAI — Every mile, automatically deducted." | document.title exact match |
| 4 | P1 | security | desktop | curl -I https://mymilesai.com/ and inspect `meta[http-equiv=Content-Security-Policy]` | CSP header present; lists `script-src 'self' 'unsafe-inline' 'unsafe-eval'`, `connect-src 'self' https://*.supabase.co https://maps.googleapis.com https://routes.googleapis.com` | meta CSP regex match for each directive |
| 5 | P1 | smoke | desktop | inspect `<meta name=viewport>` | content="width=device-width,initial-scale=1" | exact attribute match |
| 6 | P1 | smoke | desktop | inspect `<meta name=theme-color>` | content="#0B0F0E" | exact match |
| 7 | P1 | smoke | desktop | inspect Open Graph tags | `og:title`, `og:description`, `og:type=website`, `og:url=https://mymilesai.com/` all present | 4/4 tags present |
| 8 | P1 | smoke | desktop | inspect `<meta name=twitter:card>` | content="summary" | exact match |
| 9 | P1 | perf | desktop, throttled Fast 3G | reload | DM Sans + Plus Jakarta Sans fonts load via preconnect to fonts.googleapis.com/fonts.gstatic.com | Network: fonts.gstatic.com responses 200, preconnect hint hit |
| 10 | P0 | smoke | desktop | click hero "Start Free Trial" CTA (anchor `href="signup/"`) | Browser navigates to /signup/ | URL becomes https://mymilesai.com/signup/ |
| 11 | P0 | smoke | desktop | click hero "See How It Works" CTA | Browser navigates to /how-it-works.html | URL becomes https://mymilesai.com/how-it-works.html |
| 12 | P1 | ux | desktop | inspect hero badges ("7-day free trial", "Cancel anytime", "US + Canada") | All three present below CTAs with check/clock icons | DOM has 3 spans with matching text |
| 13 | P1 | ux | desktop | inspect hero image | `assets/hero/app-real.jpg` loads with rounded mask; alt="MyMilesAI app — automatic mileage tracking" | img alt and src exact match, status 200 |
| 14 | P2 | ux | desktop, `prefers-reduced-motion: no-preference` | observe hero | Phone float, glow pulse, and 3 floating cards animate on 10s cycle | Animations present (visual or check CSS animation-name on `.hero-phone-img`) |
| 15 | P2 | a11y | desktop, `prefers-reduced-motion: reduce` set | reload | Hero phone, glow, and cards are static (no animation) | computedStyle animationName === 'none' for `.hero-phone-img` |
| 16 | P0 | smoke | desktop | click "MyMilesAI" logo in sticky nav | Returns to / | URL = `/` |
| 17 | P1 | regression | desktop | click "Solutions" button in nav | Dropdown opens with 6 persona links + "All solutions" footer link | `[role=menu]` visible; 7 `[role=menuitem]` anchors present |
| 18 | P1 | a11y | desktop | tab to Solutions button, press Enter, press Esc | Dropdown opens then closes via Esc | aria-expanded toggles true/false; menu hidden after Esc |
| 19 | P1 | regression | desktop | click outside open Solutions menu | Menu closes | menu not in DOM (or hidden) |
| 20 | P1 | regression | desktop | hover each nav link (Features, How It Works, Pricing, Blog, About) | Opacity transitions from 0.7 to 1 | computedStyle.opacity changes on mouseover |
| 21 | P0 | smoke | desktop | click MS region pill (defaults to US/MI) | Dropdown shows "United States · MI" and "Canada · KM" | dropdown visible with both options |
| 22 | P1 | regression | desktop | choose "Canada" from region pill | Pill label flips to "KM"; localStorage `mm_region` = "CA"; custom event `mm-locale-change` dispatched | localStorage.getItem('mm_region')==='CA' |
| 23 | P1 | regression | desktop, mm_region="CA" set | reload | Region pill renders pre-selected on "KM" | initial render shows KM label |
| 24 | P1 | smoke | desktop | scroll past 1 viewport | Sticky nav stays pinned with backdrop blur | nav offsetTop relative to viewport === 0 after scroll |
| 25 | P1 | smoke | desktop | inspect Value Props section ("Why it works") | 3 cards: "Auto-tracks every mile", "AI classifies business vs personal", "Tax-ready exports in one tap" | 3 `h3` elements with matching text |
| 26 | P1 | smoke | desktop | inspect Audience grid ("Who it's for") | 4 cards: Freelancers, Real Estate Agents, Rideshare & Delivery, Small Business Owners | 4 cards with "Learn more →" links to features.html |
| 27 | P1 | smoke | desktop | inspect dark "MSAudience" marquee section | 15 persona cards animate across 2 rows (right then left); pause on hover | `.ms-marq-right`/`.ms-marq-left` elements present; animation-name set |
| 28 | P1 | smoke | desktop | inspect home CTA section ("Your first 7 days are free") | CTA links to signup/ | anchor href === 'signup/' |
| 29 | P0 | smoke | desktop | scroll to footer | Logo, 4 link groups (Product/Resources/Legal + brand), copyright "© 2026 Harijas LLC · All rights reserved" | DOM has 4 footer columns + bottom row text match |
| 30 | P1 | smoke | desktop | click each footer link: Features, How It Works, Pricing, Blog, About, Sign In, Start Free Trial, Privacy Policy, Terms of Service | Each navigates to correct path | all 9 anchors return HTTP 200 when fetched |
| 31 | P1 | smoke | desktop | click footer mailto links | mailto:support@mymilesai.com and mailto:hello@mymilesai.com open mail client | href === expected mailto: URI |
| 32 | P1 | copy | desktop | inspect footer disclaimer | "MyMilesAI is a recordkeeping tool, not a tax preparer or tax-advice service." present | substring match |
| 33 | P1 | responsive | 360×640 (iPhone SE) | reload | No horizontal scroll; floating hero cards hidden via `@media(max-width:900px)` | document.body.scrollWidth <= viewport width; `.hero-card1` computed `display:none` |
| 34 | P1 | responsive | 768×1024 (iPad) | reload | Layout adapts (hero stacks or stays 2-col); audience marquee still scrolls | no horizontal overflow |
| 35 | P1 | responsive | 1024×768 | reload | Full nav visible, dropdown still works | scrollWidth <= clientWidth |
| 36 | P1 | responsive | 1440×900 | reload | Full layout; max-width 1200 caps audience grid | grid uses repeat(4,1fr) on audience |
| 37 | P1 | responsive | 1920×1080 | reload | Content centers, gutter on left/right | no horizontal scrollbar |
| 38 | P2 | a11y | desktop, keyboard only | tab through page top to bottom | Focus moves through logo → Solutions → links → region pill → Sign In → hero CTAs → cards → footer | focus visible at each step; no traps |
| 39 | P2 | a11y | desktop | run axe-core via DevTools | 0 critical violations | axe-core color-contrast, region, image-alt = 0 violations |
| 40 | P2 | perf | desktop, Lighthouse | run Lighthouse Performance audit | Score ≥ 70 (Babel JSX compile is a known cost) | Lighthouse Performance score ≥ 70 |

## 2. Features — `features.html` (cases 41–60)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 41 | P0 | smoke | clean browser | GET /features.html | 200 OK; page renders | status 200; `MSNav` + `MSFeatures` mount |
| 42 | P0 | smoke | desktop | console after load | No JS errors | console.error count === 0 |
| 43 | P1 | smoke | desktop | inspect first feature block ("Auto GPS tracking") | Heading "Start driving. That's it." present | h2 text match |
| 44 | P1 | smoke | desktop | inspect second feature block | "Swipe right for business. Left for personal." | h2 text match |
| 45 | P1 | smoke | desktop | inspect third feature block | "One tap. Tax-ready. Done." | h2 text match |
| 46 | P1 | regression | desktop | inspect FeatVisAutoDetect SVG | Dashed route line, two endpoint dots, "● BACKGROUND · TRACKING" label | svg path with strokeDasharray="6 6" present |
| 47 | P1 | regression | desktop | inspect FeatVisClassify rows | 4 fake trips with biz/pers pills | 4 row elements; tag colors `#1B4DDB` for biz, `#E5E7EB` for pers |
| 48 | P1 | regression | desktop | inspect FeatVisAudit table | "MILEAGE SUMMARY — 2026", VERIFIED badge, 4 sample rows, "Q1 TOTAL · 247 TRIPS" | text matches |
| 49 | P1 | copy | desktop | inspect stat labels | "Auto" (not "99.4%"), "12s", "4/4" displayed as stat numerals | exact text match — never display 99.4% |
| 50 | P1 | copy | desktop | each stat has a description line | "no taps required to start a trip", "daily review time after first week", "required elements captured" | three label texts match |
| 51 | P1 | smoke | desktop | check sticky nav matches landing | Logo + 5 nav links + Solutions dropdown + Sign In | all present |
| 52 | P1 | smoke | desktop | click "Pricing" nav link | Goes to /pricing.html | URL change |
| 53 | P1 | smoke | desktop | click "Sign In" nav button | Goes to /signin/ | URL change |
| 54 | P1 | smoke | desktop | scroll to footer | Footer renders with same structure as landing | 4 columns + bottom row |
| 55 | P1 | responsive | 360px | reload | Feature blocks stack 1-col, visual fills width | grid-template-columns collapses to 1fr at small breakpoint |
| 56 | P1 | responsive | 768px | reload | Same layout, narrower visuals | renders without overflow |
| 57 | P2 | a11y | desktop | run axe-core | 0 critical violations | axe core 0 errors |
| 58 | P1 | regression | desktop | region pill toggle US→CA | persists to localStorage; mm-locale-change event fires | localStorage updated |
| 59 | P1 | smoke | desktop | inspect canonical | `<link rel=canonical href=https://mymilesai.com/features.html>` present | tag present |
| 60 | P1 | perf | desktop, Lighthouse | run | Performance ≥ 70 | score >= 70 |

## 3. How It Works — `how-it-works.html` (cases 61–80)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 61 | P0 | smoke | clean browser | GET /how-it-works.html | 200 OK | status 200 |
| 62 | P0 | smoke | desktop | observe `<MSHow>` render | 3 numbered steps (01/02/03) | 3 step blocks present |
| 63 | P1 | smoke | desktop | inspect step 01 | Title "Install and go." + meta "Zero taps · Background mode" | text match |
| 64 | P1 | smoke | desktop | inspect step 02 | Title "Drive normally." + meta "~0 taps per trip" | text match |
| 65 | P1 | smoke | desktop | inspect step 03 | Title "Swipe and export." + meta "One tap export" | text match |
| 66 | P0 | smoke | desktop | click "Try a sample PDF →" button in step 03 | Calls `msDownloadSamplePDF()`; downloads `mymilesai-sample-mileage-log.pdf` | file downloaded; jsPDF blob created; no console errors |
| 67 | P1 | data-integrity | desktop, sample PDF downloaded | open PDF | "Mileage Log — Sample" header, VERIFIED badge, 10 rows, totals block, $0.725/mi rate, deduction = sum of biz miles × 0.725 | PDF content verified visually; deduction matches sum |
| 68 | P1 | data-integrity | desktop, sample PDF | inspect totals | Total trips = 10; Business miles + Personal miles = total miles; deduction = business × 0.725 | math matches MS_SAMPLE_TRIPS |
| 69 | P1 | regression | desktop, throttled offline jsPDF blocked | click sample PDF button | `alert('PDF library failed to load. Please refresh the page and try again.')` fires | alert text matches |
| 70 | P1 | copy | desktop | inspect H2 | "Three steps. $2,183.14 recovered, on average, every quarter." | exact text |
| 71 | P1 | smoke | desktop | inspect "How it works" eyebrow | Color #1B4DDB, weight 600 | computed style matches |
| 72 | P1 | smoke | desktop | nav region pill toggle | persists across pages | localStorage value matches |
| 73 | P1 | smoke | desktop | click logo | returns to / | URL is / |
| 74 | P1 | smoke | desktop | footer present | 4 columns | DOM check |
| 75 | P1 | responsive | 360px | reload | Steps stack 1-col | grid-template-columns becomes 1fr at <900px |
| 76 | P1 | responsive | 768px | reload | Steps may be 1-col; CTA reachable | sample PDF button still tappable (>=44×44) |
| 77 | P2 | a11y | desktop | run axe-core | 0 critical | axe 0 errors |
| 78 | P2 | a11y | keyboard | tab to sample PDF button, press Enter | Triggers download | download fires |
| 79 | P1 | smoke | desktop | inspect canonical | `<link rel=canonical>` to /how-it-works.html | present |
| 80 | P1 | security | desktop | sample PDF download | uses URL.createObjectURL on blob, revokes after 1500ms | no leftover blob URLs in performance memory after 5s |

## 4. Pricing — `pricing.html` (cases 81–100)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 81 | P0 | smoke | clean browser | GET /pricing.html | 200 OK | status 200 |
| 82 | P0 | smoke | desktop | inspect MSPricing card | Single "MyMilesAI Pro" tier renders | DOM has 1 card |
| 83 | P0 | copy | desktop | check monthly price | "$6.99/month" displayed | exact match |
| 84 | P0 | copy | desktop | check annual price | "$69.99/year — save ~17%" | text contains "$69.99/year" and "17%" |
| 85 | P0 | copy | desktop | crossed-out founding price | "$699/yr · founding member" appears struck through | text-decoration: line-through on $699/yr span |
| 86 | P0 | copy | desktop | check trial copy | "7 DAYS FREE · CANCEL ANYTIME" present | uppercase monospace text matches |
| 87 | P0 | smoke | desktop | check CTA button text | "Start Free Trial →" | text match |
| 88 | P0 | smoke | desktop | click CTA | Navigates to /signup/ | URL becomes /signup/ |
| 89 | P0 | copy | desktop | count feature checklist items | Exactly 10 features listed | 10 div.s with check svg |
| 90 | P1 | copy | desktop | inspect features 1-5 | "Unlimited automatic trip tracking", "AI business/personal classification", "Tax-ready PDF exports", "CSV export for QuickBooks, Xero, FreshBooks", "Real-time deduction counter ($0.725/mi or $0.73/km)" | 5/5 substrings match |
| 91 | P1 | copy | desktop | inspect features 6-10 | "US + Canada with standard mileage rates built in", "Works offline — syncs when back online", "Client and purpose tagging", "Multi-vehicle support", "Privacy-first: on-device processing, no data selling" | 5/5 substrings match |
| 92 | P1 | copy | desktop | inspect footer caption below card | "Cancel anytime from the app. No questions asked." | text match |
| 93 | P1 | smoke | desktop | inspect H2 heading | "One plan. Everything included. Costs less than one forgotten drive per month." | exact match |
| 94 | P1 | smoke | desktop | inspect "MyMilesAI Pro" badge above card | Pill badge with #1B4DDB background | DOM has positioned label |
| 95 | P1 | responsive | 360px | reload | Card fills width with max-width 480 cap | no horizontal scroll; padding adjusts |
| 96 | P1 | responsive | 768px | reload | Card centered | DOM check |
| 97 | P2 | a11y | desktop | run axe-core | 0 critical | axe 0 errors |
| 98 | P2 | a11y | keyboard | tab to CTA, Enter | Navigates to /signup/ | URL change |
| 99 | P1 | smoke | desktop | inspect canonical | rel=canonical to /pricing.html | present |
| 100 | P1 | regression | desktop | region pill set to CA | Pricing copy still shows $6.99/$69.99 (USD) — pricing not yet localized | text unchanged |

## 5. About — `about.html` (cases 101–115)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 101 | P0 | smoke | clean browser | GET /about.html | 200 OK; `MSAbout` renders | status 200 |
| 102 | P1 | copy | desktop | check H2 | "Built by people who got tired of losing deductions." | text match |
| 103 | P1 | copy | desktop | check 3 value props | "Privacy-first by design", "Simple and affordable", "Built for real workers" | 3/3 |
| 104 | P1 | copy | desktop | check tagline | "$6.99/month. Less than what you'd lose by forgetting a single client visit." | substring present |
| 105 | P0 | smoke | desktop | click mailto:support@mymilesai.com | mail client opens | href matches |
| 106 | P0 | smoke | desktop | click mailto:hello@mymilesai.com | mail client opens | href matches |
| 107 | P1 | copy | desktop | check origin claim | "product of Harijas LLC, based in Canada" | substring match |
| 108 | P1 | smoke | desktop | inspect canonical | rel=canonical present | tag exists |
| 109 | P1 | smoke | desktop | inspect "Questions? We're real people." copy | text present | exact match |
| 110 | P1 | smoke | desktop | nav + footer present | renders | DOM check |
| 111 | P1 | responsive | 360px | reload | 2-column "built by people" stacks to 1 column | grid collapses |
| 112 | P1 | responsive | 768px | reload | renders cleanly | no overflow |
| 113 | P2 | a11y | desktop | axe-core | 0 critical | axe 0 errors |
| 114 | P1 | copy | desktop | brand voice consistency check | No emoji in body copy; product not described as "AI agent" | string scan returns 0 matches |
| 115 | P1 | smoke | desktop | inspect <html lang> | "en" | attribute matches |

## 6. Blog — `blog.html` + 7 posts (cases 116–145)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 116 | P0 | smoke | clean browser | GET /blog.html | 200 OK | status 200 |
| 117 | P0 | smoke | desktop | inspect blog index posts | 4 cards on landing-style listing, links to 7 posts via "All articles" | DOM has >=4 article cards |
| 118 | P0 | smoke | desktop | each of 4 landing cards has working href | cards link to: irs-mileage-rate-2026, uber-driver-deductions-2026, irs-mileage-audit-guide, realtor-mileage-deductions | all 4 anchors return 200 |
| 119 | P0 | smoke | desktop | GET /blog/irs-mileage-rate-2026.html | 200 OK | status 200 |
| 120 | P0 | smoke | desktop | GET /blog/uber-driver-deductions-2026.html | 200 OK | status 200 |
| 121 | P0 | smoke | desktop | GET /blog/irs-mileage-audit-guide.html | 200 OK | status 200 |
| 122 | P0 | smoke | desktop | GET /blog/realtor-mileage-deductions.html | 200 OK | status 200 |
| 123 | P0 | smoke | desktop | GET /blog/cra-mileage-rates-2026.html | 200 OK | status 200 |
| 124 | P0 | smoke | desktop | GET /blog/freelancer-vehicle-deductions-2026.html | 200 OK | status 200 |
| 125 | P0 | smoke | desktop | GET /blog/new-features-bulk-classify-cra-csv.html | 200 OK | status 200 |
| 126 | P1 | smoke | desktop | inspect each post `<title>` | non-empty, descriptive | tag present and >10 chars |
| 127 | P1 | smoke | desktop | each post has `<meta name=description>` | present | meta exists |
| 128 | P1 | smoke | desktop | each post has canonical tag | `<link rel=canonical>` matches its own URL | href === document URL |
| 129 | P1 | smoke | desktop | each post `<html lang>` | "en" | attribute matches |
| 130 | P1 | a11y | desktop | heading hierarchy on each post | Single h1, then h2/h3 nested correctly (no skip h1→h3) | axe-core heading-order passes |
| 131 | P1 | smoke | desktop | each post displays publish date | visible date string | DOM check |
| 132 | P1 | smoke | desktop | each post has back-link to /blog.html | anchor present | href === /blog.html |
| 133 | P1 | smoke | desktop | each post has internal CTA to /signup/ or /pricing.html | at least one CTA link to signup or pricing | DOM check |
| 134 | P1 | copy | desktop | irs-mileage-rate-2026 post | mentions 2026 IRS standard rate | substring "2026" + "IRS" present |
| 135 | P1 | copy | desktop | uber-driver-deductions-2026 post | mentions 1099-K and rideshare | substring matches |
| 136 | P1 | copy | desktop | irs-mileage-audit-guide post | mentions IRS audit, recordkeeping requirements | substring matches |
| 137 | P1 | copy | desktop | realtor-mileage-deductions post | mentions showings, open houses | substring matches |
| 138 | P1 | copy | desktop | cra-mileage-rates-2026 post | mentions CRA rate (Canada) | substring "CRA" + "2026" present |
| 139 | P1 | copy | desktop | freelancer-vehicle-deductions-2026 post | mentions self-employed, Schedule C | substring matches |
| 140 | P1 | copy | desktop | new-features-bulk-classify-cra-csv post | announces bulk classify + CRA CSV | substring matches |
| 141 | P1 | smoke | desktop | inspect blog.html article grid | renders all 7 posts (or at least all that exist) | count >= 7 anchors to /blog/*.html |
| 142 | P1 | responsive | 360px | each post | text wraps, no horizontal scroll | scrollWidth <= clientWidth |
| 143 | P1 | responsive | 768px | each post | readable line length | DOM check |
| 144 | P2 | a11y | desktop | run axe-core on each post | 0 critical violations | axe 0 errors per post |
| 145 | P1 | seo | desktop | google-style preview | title + description + URL render fine in search-preview tool | manual check via SERP simulator |

## 7. Solutions — `solutions/index.html` + 6 sub-pages (cases 146–175)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 146 | P0 | smoke | clean browser | GET /solutions/ | 200 OK | status 200 |
| 147 | P0 | smoke | desktop | inspect solutions/index | Lists 6 persona cards | 6 anchors to /solutions/{slug}/ |
| 148 | P0 | smoke | desktop | GET /solutions/realtors/ | 200 OK | status 200 |
| 149 | P0 | smoke | desktop | GET /solutions/rideshare/ | 200 OK | status 200 |
| 150 | P0 | smoke | desktop | GET /solutions/freelancers/ | 200 OK | status 200 |
| 151 | P0 | smoke | desktop | GET /solutions/small-business/ | 200 OK | status 200 |
| 152 | P0 | smoke | desktop | GET /solutions/construction/ | 200 OK | status 200 |
| 153 | P0 | smoke | desktop | GET /solutions/sales-reps/ | 200 OK | status 200 |
| 154 | P1 | smoke | desktop | from index, click each persona card | navigates to corresponding sub-page | URL change matches slug |
| 155 | P1 | smoke | desktop | each sub-page has H1 specific to persona | h1 contains role keyword | text match |
| 156 | P1 | regression | desktop | each sub-page imports `solutions/locale.js` | region toggle works on these pages | localStorage `mm_region` updates |
| 157 | P1 | smoke | desktop | each sub-page renders MSNav with "Solutions" tab marked active (bold + #1B4DDB underline) | active styling applied | computedStyle borderBottom matches |
| 158 | P1 | smoke | desktop | each sub-page CTA links to /signup/ | anchor href correct | DOM check |
| 159 | P1 | copy | desktop | realtors page | mentions showings, MLS, open houses | substring matches |
| 160 | P1 | copy | desktop | rideshare page | mentions Uber, Lyft, DoorDash, gig | substring matches |
| 161 | P1 | copy | desktop | freelancers page | mentions client meetings, 1099 | substring matches |
| 162 | P1 | copy | desktop | small-business page | mentions supply runs, vendor meetings | substring matches |
| 163 | P1 | copy | desktop | construction page | mentions job sites, supply runs | substring matches |
| 164 | P1 | copy | desktop | sales-reps page | mentions territory coverage, demos | substring matches |
| 165 | P1 | regression | desktop | region=CA on realtors page | KM unit appears in copy (if locale.js wired) | text shows km or KM |
| 166 | P1 | regression | desktop | region=US on realtors page | MI unit appears | text shows mi or MI |
| 167 | P1 | smoke | desktop | "All solutions" footer link from sub-page returns to /solutions/ | anchor exists | href === /solutions/ |
| 168 | P1 | responsive | 360px | each sub-page | no horizontal scroll | scrollWidth <= clientWidth |
| 169 | P1 | responsive | 768px | each sub-page | layout adapts | renders cleanly |
| 170 | P2 | a11y | desktop | axe-core on /solutions/ | 0 critical | axe 0 errors |
| 171 | P2 | a11y | desktop | axe-core on each sub-page | 0 critical | axe 0 errors |
| 172 | P1 | smoke | desktop | each sub-page has canonical tag | rel=canonical present | tag exists |
| 173 | P1 | seo | desktop | each sub-page has meta description | tag present, >50 chars | DOM check |
| 174 | P2 | regression | desktop | /solutions/_animation-preview.html and /solutions/_locale-test.html | These are dev tools — robots.txt disallows | robots check |
| 175 | P1 | smoke | desktop | breadcrumb or "Back to solutions" present on sub-pages | navigable | anchor present |

## 8. Sign In — `/signin/` (cases 176–205)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 176 | P0 | smoke | clean browser | GET /signin/ | 200 OK | status 200 |
| 177 | P0 | smoke | unauth | observe form | Inputs: `#email` (type=email, autocomplete=email), `#password` (type=password, autocomplete=current-password, minlength=8) | DOM matches |
| 178 | P0 | smoke | unauth | inspect "Forgot password?" link | `<a data-forgot href="#" class="forgot">Forgot password?</a>` present | DOM check |
| 179 | P0 | smoke | unauth | inspect Apple SSO button | "Sign in with Apple" button present | DOM check |
| 180 | P0 | smoke | unauth | inspect Google SSO button | "Sign in with Google" button present | DOM check |
| 181 | P0 | integration | unauth | enter invalid email "foo", submit | HTML5 validation prevents submit | input:invalid styles applied |
| 182 | P0 | integration | unauth | enter email + wrong password, submit | Supabase returns 400; error surfaces in form | error banner shown with non-empty text |
| 183 | P0 | integration | unauth | enter correct email + password, submit | Session created; redirects to /app/ | URL becomes /app/; localStorage has sb-*-auth-token |
| 184 | P0 | integration | signed-in user, visit /signin/ | Bounces to /app/ (session detected) | URL redirects to /app/ within 1s |
| 185 | P0 | integration | unauth | click "Forgot password?" | Prompts for email, calls supabase.auth.resetPasswordForEmail | network call to /auth/v1/recover with email |
| 186 | P1 | integration | unauth | after reset link clicked from email | redirects to /auth-callback/?type=recovery | URL contains type=recovery |
| 187 | P0 | integration | unauth | click "Sign in with Apple" | OAuth flow opens with `provider=apple` and redirect to /auth-callback/ | URL contains appleid.apple.com |
| 188 | P0 | integration | unauth | click "Sign in with Google" | OAuth flow opens with provider=google | URL contains accounts.google.com |
| 189 | P1 | security | unauth | inspect CSP | connect-src allows accounts.google.com and appleid.apple.com (via OAuth redirects) | meta CSP allows OAuth domains |
| 190 | P1 | ux | unauth | inspect password input | type=password, no plaintext visible | DOM check |
| 191 | P2 | ux | unauth | (if password show/hide present) toggle visibility | input type toggles between password/text | DOM attribute check |
| 192 | P1 | integration | unauth | submit with short password (< 8 chars) | minlength validation blocks submit | input:invalid + native message |
| 193 | P1 | integration | unauth | observe error_description URL param | If URL has `?error_description=...`, surface text in alert/banner | DOM shows decoded error text |
| 194 | P1 | integration | unauth | submit 5x with wrong password rapidly | After Supabase rate limit, error indicates rate-limit | banner text contains "rate" or "too many" |
| 195 | P0 | a11y | unauth | tab through form | Email → Password → Forgot → Submit → Apple → Google in logical order | focus order verified |
| 196 | P0 | a11y | unauth | inspect focus rings | Visible 2px outline on each interactive | computedStyle outlineWidth >= 2px |
| 197 | P1 | smoke | unauth | inspect autocomplete attrs | email autocomplete="email"; password autocomplete="current-password" | DOM matches |
| 198 | P1 | copy | unauth | "Don't have an account? Sign up" link | links to /signup/ | href matches |
| 199 | P1 | smoke | unauth | page title | "Sign in" or similar | title meaningful |
| 200 | P1 | smoke | unauth | logo links to / | clicking logo navigates home | href === / |
| 201 | P1 | responsive | 360px | unauth | form stacks, fits viewport | no horizontal scroll |
| 202 | P1 | responsive | 768px | unauth | form centered | DOM check |
| 203 | P2 | a11y | desktop | axe-core | 0 critical | axe 0 errors |
| 204 | P1 | security | unauth | robots blocks /signin/ | robots.txt disallow present | curl /robots.txt shows Disallow: /signin/ |
| 205 | P1 | smoke | unauth | inspect noindex meta | `<meta name=robots content=noindex,nofollow>` present | DOM check |

## 9. Sign Up — `/signup/` (cases 206–235)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 206 | P0 | smoke | clean browser | GET /signup/ | 200 OK | status 200 |
| 207 | P0 | smoke | unauth | observe form fields | `#email`, `#password` (autocomplete=new-password, minlength=8), plus Apple/Google SSO buttons | DOM matches |
| 208 | P0 | smoke | unauth | inspect Apple button | text "Sign up with Apple" | DOM check |
| 209 | P0 | smoke | unauth | inspect Google button | text "Sign up with Google" | DOM check |
| 210 | P0 | integration | unauth | enter valid new email + 8+ char password, submit | Supabase creates auth user; sets `mmai_after_auth=1` flag; redirects to /auth-callback/ then /welcome/ | URL becomes /welcome/ |
| 211 | P0 | integration | unauth | enter existing email, submit | Supabase returns "user already registered"; form shows error | banner text matches |
| 212 | P0 | integration | unauth | enter password length 7 | Browser minlength validation blocks | input:invalid |
| 213 | P1 | integration | unauth | enter common weak password "12345678" | Supabase rejects or password-strength feedback shown | error banner or strength meter |
| 214 | P0 | integration | unauth | click Sign up with Apple | OAuth redirect to appleid.apple.com | URL contains appleid.apple.com |
| 215 | P0 | integration | unauth | click Sign up with Google | OAuth redirect to accounts.google.com | URL contains accounts.google.com |
| 216 | P0 | integration | unauth | after Apple OAuth completes with new user | Lands on /auth-callback/ with code; redirects to /welcome/ | URL ends at /welcome/ |
| 217 | P0 | integration | unauth | after Google OAuth completes with new user | Same as 216 | URL ends at /welcome/ |
| 218 | P0 | integration | signed-in user, visit /signup/ | Bounces to /app/ | URL becomes /app/ |
| 219 | P1 | regression | unauth | signup with email confirmation required | Email confirmation flow surfaces "check your inbox" message | banner text matches |
| 220 | P1 | smoke | unauth | terms + privacy checkbox or copy | "By signing up you agree to Terms + Privacy" with links | text matches, anchors to /terms/ and /privacy/ |
| 221 | P0 | a11y | unauth | tab through form | Email → Password → Submit → Apple → Google in logical order | focus order verified |
| 222 | P0 | a11y | unauth | focus rings visible | 2px outline on each interactive | computedStyle check |
| 223 | P1 | smoke | unauth | autocomplete attrs | email autocomplete="email", password autocomplete="new-password" | DOM matches |
| 224 | P1 | smoke | unauth | "Already have an account? Sign in" link | links to /signin/ | href matches |
| 225 | P1 | smoke | unauth | logo links to / | DOM check | href === / |
| 226 | P1 | responsive | 360px | unauth | form stacks, fits | scrollWidth <= clientWidth |
| 227 | P1 | responsive | 768px | unauth | form centered | DOM check |
| 228 | P2 | a11y | desktop | axe-core | 0 critical | axe 0 errors |
| 229 | P1 | security | unauth | robots blocks /signup/ | Disallow present | robots.txt check |
| 230 | P1 | smoke | unauth | noindex meta present | `<meta name=robots content=noindex,nofollow>` | DOM check |
| 231 | P1 | regression | unauth | after submit, button shows loading state | button text becomes "Creating account…" or spinner | DOM check during fetch |
| 232 | P1 | integration | unauth | rapid 6x signup attempts with invalid emails | After Supabase rate-limit, error indicates rate-limit | banner text contains "rate" or "too many" |
| 233 | P1 | security | unauth | password input has no autocomplete="off" anti-pattern | autocomplete=new-password allows password managers | attribute check |
| 234 | P1 | copy | unauth | inspect headline | mentions free trial / "Start your free trial" or similar | text contains "free" |
| 235 | P1 | integration | unauth | localStorage `mmai_after_auth` flag | After successful sign-up, flag set to "1" before auth-callback | localStorage check |

## 10. Auth Callback — `/auth-callback/` (cases 236–255)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 236 | P0 | smoke | clean browser | GET /auth-callback/ with no params | 200 OK; page shows neutral "completing sign in…" state | status 200 |
| 237 | P0 | integration | unauth | hit /auth-callback/#access_token=...&refresh_token=... | Supabase client parses hash, persists session, redirects to /app/ | URL becomes /app/ within 3s |
| 238 | P0 | integration | unauth, mmai_after_auth=1 | hit /auth-callback/#access_token=... | After session settle, redirects to /welcome/ (not /app/) | URL becomes /welcome/ |
| 239 | P0 | integration | unauth | hit /auth-callback/?type=recovery | Renders inline set-password form (not redirect) | form with new password fields visible |
| 240 | P0 | integration | recovery flow | enter new password 8+ chars, submit | supabase.auth.updateUser called; success state; redirect to /signin/ or /app/ | network call hits /auth/v1/user; URL changes |
| 241 | P1 | integration | recovery flow | new password too short | Validation error inline | error visible |
| 242 | P1 | integration | recovery flow | mismatched confirm field (if present) | inline error | error visible |
| 243 | P1 | integration | unauth | hit /auth-callback/?error=access_denied&error_description=...&error_code=... | Error description surfaces in body; "Try again" button visible | text matches; anchor to /signin/ |
| 244 | P1 | integration | unauth | "Try again" button after error | Returns to /signin/ | URL change |
| 245 | P0 | security | unauth | inspect CSP on this page | Same as /app/ — connect-src includes *.supabase.co, accounts.google.com, appleid.apple.com | meta CSP check |
| 246 | P1 | integration | recovery flow | network failure during updateUser | Error toast shown, user can retry | error visible |
| 247 | P1 | smoke | unauth | inspect noindex meta | `<meta name=robots content=noindex,nofollow>` present | DOM check |
| 248 | P1 | regression | unauth, signing-in flow | after redirect to /app/, mmai_after_auth flag cleared | localStorage `mmai_after_auth` removed | localStorage check |
| 249 | P1 | a11y | recovery flow | tab to new password field | focus visible | DOM check |
| 250 | P1 | responsive | 360px | recovery form | fits viewport | no horizontal scroll |
| 251 | P1 | responsive | 768px | recovery form | renders cleanly | DOM check |
| 252 | P1 | smoke | unauth | inspect logo links to / | DOM check | href === / |
| 253 | P2 | security | unauth | session token only stored in Supabase storage (httpOnly cookies or localStorage per Supabase config) | no PII in URL after redirect | URL clean of tokens |
| 254 | P1 | smoke | unauth | robots blocks /auth-callback/ | Disallow present | robots.txt check |
| 255 | P2 | a11y | desktop | axe-core in idle and recovery states | 0 critical | axe 0 errors |

## 11. Welcome — `/welcome/` (cases 256–265)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 256 | P0 | smoke | signed-in user, post-signup | GET /welcome/ | 200 OK | status 200 |
| 257 | P0 | smoke | signed-in user | inspect content | "Welcome" headline + onboarding copy + CTA to /app/ | text + anchor present |
| 258 | P0 | smoke | signed-in user | click CTA (e.g. "Open dashboard") | navigates to /app/ | URL becomes /app/ |
| 259 | P0 | integration | unauth | hit /welcome/ directly | Redirects to /signin/ (or graceful gate) | URL change |
| 260 | P1 | smoke | desktop | inspect logo links to / | href === / | DOM check |
| 261 | P1 | smoke | desktop | inspect noindex meta | `<meta name=robots content=noindex,nofollow>` | DOM check |
| 262 | P1 | responsive | 360px | renders cleanly | no horizontal scroll | scrollWidth check |
| 263 | P1 | responsive | 768px | renders cleanly | DOM check |
| 264 | P2 | a11y | desktop | axe-core | 0 critical | axe 0 errors |
| 265 | P1 | security | desktop | robots blocks /welcome/ | Disallow present | robots.txt check |

## 12. `/app/` Dashboard (cases 266–305)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 266 | P0 | smoke | unauth | GET /app/ | Redirects to /signin/ via auth guard | URL becomes /signin/ within 2s |
| 267 | P0 | smoke | signed-in user | GET /app/ | 200 OK; dashboard renders | status 200; `body.mmai-ready` class present after init |
| 268 | P0 | smoke | signed-in user | inspect document title | "MyMilesAI — Dashboard" | exact match |
| 269 | P0 | regression | signed-in user | observe initial paint | `.main` invisible until `body.mmai-ready` — no FOUC of mock content | `.main` visibility: hidden until ready class |
| 270 | P0 | regression | signed-in user, fresh load | inspect profile name in sidebar | shows real first/last (NOT "Marcus T.") | `[data-mmai=profile-name]` text !== "Marcus T." |
| 271 | P0 | regression | signed-in user | inspect YTD deduction KPI | shows real $X.XX from user's data, NOT 847 | `[data-mmai=ytd-deduction]` text !== "$847" |
| 272 | P0 | regression | signed-in user | inspect plan line in profile | shows "Pro · 2026" only if real plan; otherwise current plan | does not hardcode "Pro · 2026" |
| 273 | P0 | smoke | signed-in user | inspect eyebrow date | reflects current date (today, e.g. "Thursday · May 14") | text contains current weekday or month |
| 274 | P0 | smoke | signed-in user | inspect greeting | "Good morning/afternoon/evening, {first} —" with time-of-day based on local clock | text starts with "Good" + matches local TOD |
| 275 | P0 | smoke | signed-in user | inspect trips-to-review count | numeric, matches Supabase query of unclassified trips | data matches DB |
| 276 | P0 | smoke | signed-in user | inspect Miles · YTD | numeric > 0 if user has trips | non-zero when seeded |
| 277 | P0 | smoke | signed-in user | inspect Business % ring | arc dashoffset reflects pct; ring-text shows pct | computed stroke-dashoffset reasonable |
| 278 | P0 | smoke | signed-in user | inspect Business of total | "X of Y mi" | text matches Y = miles-total |
| 279 | P0 | smoke | signed-in user | inspect Needs review KPI | shows count of unreviewed trips | matches `unc` count in filter |
| 280 | P0 | smoke | signed-in user | inspect biz-ring SVG arc | `[data-mmai=biz-ring-arc]` stroke-dashoffset animates from 175.9 to computed value | arc not at 175.9 (default) after init |
| 281 | P1 | smoke | signed-in user | inspect YTD sparkline | `[data-mmai=ytd-spark]` SVG has path data | svg children > 0 |
| 282 | P1 | smoke | signed-in user | inspect miles sparkline | `[data-mmai=miles-spark]` SVG renders | svg children > 0 |
| 283 | P0 | smoke | signed-in user | inspect Recent trips panel | "Most recent five trips this year." caption + max 5 rows | row count <= 5 |
| 284 | P0 | smoke | signed-in user | inspect "View all N →" link | shows real total trip count | text matches `[data-mmai=trips-count]` |
| 285 | P0 | smoke | signed-in user | click "View all" link | switches to /app Trips tab (via `go('trips')`) | `#p-trips.on` |
| 286 | P0 | smoke | signed-in user | inspect quarter card | label "Qx deduction", value $X.XX, business miles, rate, est tax saved | all four rows render with real data |
| 287 | P0 | smoke | signed-in user | click "Export PDF (YTD · business)" | jsPDF generates and downloads PDF | file downloaded; console clean |
| 288 | P0 | smoke | signed-in user | click "Export CSV (YTD · all trips)" | CSV downloaded | file downloaded with .csv extension |
| 289 | P0 | smoke | signed-in user | inspect locale toggle | Two buttons: 🇺🇸 USD and 🇨🇦 CAD | DOM check |
| 290 | P0 | regression | signed-in user, locale=US | click CAD button | currency display updates; localStorage `mm_region` = "CA" | YTD prefix changes to C$ or symbol |
| 291 | P1 | regression | signed-in user, locale=CA | reload | locale toggle remembers CA | CAD button has `.active` class |
| 292 | P0 | smoke | signed-in user | inspect "This week's drives" timeline | renders week timeline SVG or empty state | DOM has `[data-mmai=week-timeline-inner]` populated |
| 293 | P1 | regression | signed-in user with no trips this week | week timeline shows empty state | "No drives this week" or similar | text match |
| 294 | P0 | smoke | signed-in user | click "+ Log trip" in topbar | Opens `#mmai-overlay` modal with trip form | overlay no longer `hidden`; modal title set |
| 295 | P1 | regression | signed-in user | press Esc with modal open | modal closes | overlay `hidden` again |
| 296 | P0 | smoke | signed-in user | inspect classify pill colors in recent trips | biz=#1B4DDB (blue), pers=#E5E7EB (gray), unreviewed=#EFF4FF/#185FA5 | computedStyle check |
| 297 | P0 | smoke | signed-in user | click tabs (Dashboard, Trips, Places, Reports, Vehicles, Settings) | each shows correct `.page.on` | one and only one page has `.on` after each click |
| 298 | P0 | a11y | signed-in user | inspect tabs aria | `role=tablist` on container, `role=tab` on buttons, `aria-controls`, `aria-selected` toggles | axe ARIA passes |
| 299 | P0 | smoke | signed-in user | click sidebar "Help" item | Opens help center or modal (via `[data-mmai=open-help]`) | event fires; no console error |
| 300 | P0 | smoke | signed-in user | click "Sign out" link in sidebar | Supabase signOut called; redirect to /signin/ | URL becomes /signin/ |
| 301 | P1 | responsive | 360px (iPhone SE) | inspect /app/ | grid collapses; sidebar may stack | no horizontal scroll; tab bar reachable |
| 302 | P1 | responsive | 768px (iPad) | inspect /app/ | sidebar + main render | DOM check |
| 303 | P2 | a11y | signed-in user | axe-core on dashboard | 0 critical violations | axe 0 errors |
| 304 | P1 | perf | signed-in user, Lighthouse | run on /app/ | Performance score ≥ 70 | Lighthouse ≥ 70 |
| 305 | P1 | regression | signed-in user | reload while on /app/ | dashboard re-renders, no FOUC, no flash of "—" placeholder for >2s | placeholders cleared within 2s |

## 13. `/app/` Trips (cases 306–345)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 306 | P0 | smoke | signed-in user | click Trips tab | `#p-trips.on`; greeting "All trips" | tab active |
| 307 | P0 | smoke | signed-in user | inspect trips-eyebrow-review | "N trips · M need review" reflects DB | text matches counts |
| 308 | P0 | smoke | signed-in user | inspect filter pills | All, Business, Personal, Needs review — each with count | 4 pills present, counts non-negative |
| 309 | P0 | regression | signed-in user, click each filter pill | rows filter by class | filtered count matches `data-mmai=trips-filter-*` |
| 310 | P0 | smoke | signed-in user | inspect table headers | Date / Route / Purpose / Miles / VALUE / CLASS / actions | 7 columns matching |
| 311 | P0 | smoke | signed-in user | enter search "office" in trips-search | rows filter by from_addr/to_addr/purpose containing query | visible rows all contain "office" (case-insensitive) |
| 312 | P0 | smoke | signed-in user | clear search | all rows return | visible row count returns to total |
| 313 | P0 | smoke | signed-in user | sort by date (default) | rows ordered descending by date | first row date >= second row date |
| 314 | P0 | smoke | signed-in user | click classify pill on a row | dropdown opens with Business, Personal, Medical, Charity, Review options | dropdown visible with all 5 options |
| 315 | P0 | regression | signed-in user, classify dropdown open | select "Medical" | row updates classification; pill color reflects new class | DB UPDATE succeeds; pill text "Medical" |
| 316 | P0 | regression | signed-in user | select "Charity" on different row | DB update succeeds | network call success |
| 317 | P0 | regression | signed-in user | select "Review" on a classified row | row flips back to unreviewed | pill text "Needs review" or icon |
| 318 | P0 | smoke | signed-in user | click "more" (⋯) on a row | row menu opens with Edit / Delete / Duplicate options | menu visible |
| 319 | P0 | smoke | signed-in user | click "Edit" on a row | Modal opens with prefilled date, miles, vehicle, purpose, client, notes | overlay shown; fields populated |
| 320 | P0 | smoke | signed-in user | edit miles in modal, save | DB UPDATE succeeds; row reflects new miles immediately | row text matches new value |
| 321 | P0 | smoke | signed-in user | edit purpose in modal, save | row purpose updates | row text matches |
| 322 | P0 | smoke | signed-in user | change vehicle assignment, save | trip linked to new vehicle | DB column updated |
| 323 | P0 | smoke | signed-in user | click "Delete" in row menu | soft delete; row disappears; undo toast shows for 5s | `.mmai-undo-toast` visible |
| 324 | P0 | regression | signed-in user, just deleted | click "Undo" in toast | row restored at original position | row visible again with same UID |
| 325 | P0 | smoke | signed-in user, large dataset | scroll to bottom | More rows load (infinite scroll) or pagination next-page | DOM row count increases |
| 326 | P1 | smoke | signed-in user | inspect total miles in eyebrow | matches sum of all rows' miles | math check |
| 327 | P1 | regression | signed-in user | click "Export CSV" in Trips topbar | CSV downloads with all visible rows | file downloaded; row count matches |
| 328 | P1 | regression | signed-in user | click "Export PDF" in Trips topbar | PDF downloads in standard mileage format | file downloaded with correct columns |
| 329 | P0 | data-integrity | signed-in user | edit a trip and save | trip_uid stays the same; DB row updated (not duplicated) | DB row count unchanged |
| 330 | P0 | data-integrity | signed-in user | edit miles to 0 or negative | validation prevents save | error displayed |
| 331 | P0 | data-integrity | signed-in user | edit date to future | validation flags or accepts (per spec) | behavior matches spec |
| 332 | P1 | smoke | signed-in user | inspect from/to addresses | shown with `.from` (top) and `.to` (sub) | DOM check |
| 333 | P1 | smoke | signed-in user | inspect classify-pill aria-busy | during UPDATE, pill has aria-busy="true"; afterwards removed | attribute toggles |
| 334 | P1 | regression | signed-in user, slow network | classify a trip | pill shows busy state during request | aria-busy=true |
| 335 | P0 | a11y | signed-in user | tab through trips table | row menu reachable via keyboard | focus visible on each interactive |
| 336 | P0 | a11y | signed-in user | Esc closes row menu | row menu hidden | menu removed from DOM |
| 337 | P1 | responsive | 360px | inspect trips table | columns may collapse; rows readable | no horizontal scroll inside container or graceful scroll inside table |
| 338 | P1 | responsive | 768px | inspect trips table | columns readable | DOM check |
| 339 | P2 | a11y | signed-in user | axe-core on Trips tab | 0 critical | axe 0 errors |
| 340 | P1 | regression | signed-in user, no trips | inspect empty state | "No trips yet" or "+ Log your first trip" | DOM has empty state |
| 341 | P0 | smoke | signed-in user | "+ Log trip" in Trips topbar | opens trip create modal | overlay shown |
| 342 | P0 | smoke | signed-in user | create a trip manually with miles=10, purpose, vehicle | DB INSERT; row appears at top | new row visible |
| 343 | P1 | data-integrity | signed-in user | create trip with duplicate trip_uid | UPSERT idempotent — no duplicate row | DB row count unchanged on retry |
| 344 | P1 | regression | signed-in user | bulk-classify multiple unreviewed (if bulk UI present) | all selected update | UPDATE count matches selection |
| 345 | P1 | smoke | signed-in user | filter to "Needs review", classify all → 0 | filter count drops to 0 | `data-mmai=trips-filter-unc` shows "0" |

## 14. `/app/` Places (cases 346–365)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 346 | P0 | smoke | signed-in user | click Places tab | `#p-places.on`; greeting "Your frequent places." | tab active |
| 347 | P0 | smoke | signed-in user | inspect places count in eyebrow | matches DB count | text matches `[data-mmai=places-count]` |
| 348 | P0 | smoke | signed-in user | inspect places list grid | renders cards with name, address, category badge, visit count | cards present |
| 349 | P0 | smoke | signed-in user | click "+ Add place" | Opens add place modal with name, address, category fields | overlay shown |
| 350 | P0 | smoke | signed-in user | add place "Home Office" with category Business | DB INSERT; card appears | new card visible |
| 351 | P0 | smoke | signed-in user | click category badge on a card | category picker opens (Business/Personal/etc.) | `.cat-picker` shown |
| 352 | P0 | regression | signed-in user | change category to Personal | DB UPDATE; badge updates | badge text/class changes |
| 353 | P0 | smoke | signed-in user | click "Edit" on a place card | modal opens prefilled | overlay shown; fields populated |
| 354 | P0 | smoke | signed-in user | edit address, save | DB UPDATE; card reflects | text match |
| 355 | P0 | smoke | signed-in user | click "Delete" on a place | soft delete; card disappears; undo toast shown | `.mmai-undo-toast` visible |
| 356 | P0 | regression | signed-in user, just deleted | click Undo | card restored | card visible again |
| 357 | P0 | smoke | signed-in user | enter search "home" in places-search | cards filter to matches | visible cards all contain "home" |
| 358 | P0 | smoke | signed-in user | click clear (×) on search | search clears; all cards return | input value=""; cards return |
| 359 | P1 | smoke | signed-in user, no places | inspect empty state | `.places-empty` block with icon + title + sub + add-place CTA | DOM check |
| 360 | P1 | smoke | signed-in user | inspect visit count per place | matches DB aggregate | text matches |
| 361 | P1 | a11y | signed-in user | tab through cards | focus visible on each card | computedStyle outline |
| 362 | P1 | a11y | signed-in user | Esc closes category picker | picker hidden | DOM check |
| 363 | P1 | responsive | 360px | inspect places grid | cards stack 1-col | grid-template-columns adapts |
| 364 | P1 | responsive | 768px | inspect places grid | 2-col layout | DOM check |
| 365 | P2 | a11y | signed-in user | axe-core on Places | 0 critical | axe 0 errors |

## 15. `/app/` Reports (cases 366–385)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 366 | P0 | smoke | signed-in user | click Reports tab | `#p-reports.on`; greeting "Build an accurate mileage log." | tab active |
| 367 | P0 | smoke | signed-in user | inspect period pills | Last 7 days / This month / This quarter (default on) / YTD / Last year | 5 pills, "quarter" has `.on` |
| 368 | P0 | smoke | signed-in user | click "YTD" pill | YTD becomes active; preview totals update | `.on` moves; total updates |
| 369 | P0 | smoke | signed-in user | click "Last year" pill | active; totals reflect last year | total reflects historical data |
| 370 | P0 | smoke | signed-in user | inspect vehicles checkbox list | one row per user's vehicle; default all on | list count matches vehicles |
| 371 | P0 | regression | signed-in user, multi-vehicle | uncheck one vehicle | preview totals exclude that vehicle's trips | total decreases |
| 372 | P0 | smoke | signed-in user | inspect classification pills | Business only (default) / Business + Personal / All trips | 3 pills, "biz" has `.on` |
| 373 | P0 | regression | signed-in user | click "All trips" classification | preview updates | preview row count increases |
| 374 | P0 | smoke | signed-in user | inspect format pills | PDF · Standard (default) / CSV · generic / QuickBooks CSV / Xero CSV | 4 pills |
| 375 | P0 | smoke | signed-in user | click "QuickBooks CSV" pill | active state | `.on` class moves |
| 376 | P0 | smoke | signed-in user | inspect preview PDF card | shows period title + sample rows + total | preview rows render |
| 377 | P0 | smoke | signed-in user | click "Generate report" | jsPDF (PDF) or CSV download triggered | file downloaded; console clean |
| 378 | P0 | smoke | signed-in user, PDF format | generated PDF | contains all four required fields per trip: date, route, purpose, miles | open PDF and visually verify |
| 379 | P0 | smoke | signed-in user, CSV format | generated CSV | header row present + data rows | open CSV, check headers |
| 380 | P0 | smoke | signed-in user, QuickBooks CSV | generated file | column order matches QuickBooks mileage import schema | manual schema check |
| 381 | P0 | smoke | signed-in user, Xero CSV | generated file | column order matches Xero mileage import schema | manual schema check |
| 382 | P1 | smoke | signed-in user | inspect rep-total-deduction | matches sum(biz_miles × rate) over selected period | math check |
| 383 | P1 | smoke | signed-in user | inspect rep-totals-line | "X trips · Y miles · standard rate" | text match |
| 384 | P1 | responsive | 360px | inspect report builder | builder + preview stack 1-col | grid collapses |
| 385 | P2 | a11y | signed-in user | axe-core on Reports | 0 critical | axe 0 errors |

## 16. `/app/` Vehicles (cases 386–405)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 386 | P0 | smoke | signed-in user | click Vehicles tab | `#p-vehicles.on`; greeting "Your fleet." | tab active |
| 387 | P0 | smoke | signed-in user | inspect vehicles count in eyebrow | matches DB count | text matches |
| 388 | P0 | smoke | signed-in user | inspect vehicle cards | each shows make/model, year, stats (miles, trips), default badge if applicable | DOM check |
| 389 | P0 | smoke | signed-in user | click "+ Add vehicle" | Add vehicle modal opens with make, model, year, default fields | overlay shown |
| 390 | P0 | smoke | signed-in user | add vehicle "2024 Toyota Camry" | DB INSERT; card appears | new card visible |
| 391 | P0 | smoke | signed-in user | click "Edit" on a vehicle | modal opens prefilled | fields populated |
| 392 | P0 | smoke | signed-in user | edit make/model, save | card updates | text match |
| 393 | P0 | smoke | signed-in user | click "Delete" on a vehicle | soft delete; card disappears; undo toast | `.mmai-undo-toast` visible |
| 394 | P0 | regression | signed-in user | click Undo on delete | card restored | card visible |
| 395 | P0 | data-integrity | signed-in user | mark non-default vehicle as default | previous default loses badge; this one gains it | only one card has `.vbadge` with text "DEFAULT" |
| 396 | P0 | data-integrity | signed-in user | rapid toggle default between two vehicles 5x | DB always has exactly one default for user | SQL `SELECT COUNT(*) WHERE is_default = true AND user_id = X` === 1 |
| 397 | P0 | data-integrity | signed-in user, 0 vehicles | try to delete the only default | warning OR allow (per spec); if allowed, no default vehicle exists | behavior consistent |
| 398 | P1 | smoke | signed-in user | inspect "+ Add vehicle" card | dashed border, plus icon | `.vcard.add` present |
| 399 | P1 | smoke | signed-in user | inspect bluetooth/CarPlay metadata fields (if present) | render in card | DOM check |
| 400 | P1 | smoke | signed-in user, 0 vehicles | inspect empty state | "+ Add your first vehicle" prominent | DOM check |
| 401 | P1 | a11y | signed-in user | tab through cards | focus visible | computedStyle check |
| 402 | P1 | responsive | 360px | inspect vehicles grid | cards stack 1-col | grid adapts |
| 403 | P1 | responsive | 768px | inspect | 1-2 col layout | DOM check |
| 404 | P2 | a11y | signed-in user | axe-core on Vehicles | 0 critical | axe 0 errors |
| 405 | P1 | smoke | signed-in user | vehicle counter in sidebar | `[data-mmai=vehicles-count]` matches card count | text match |

## 17. `/app/` Settings (cases 406–445)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 406 | P0 | smoke | signed-in user | click Settings tab | `#p-settings.on`; greeting "Settings." | tab active |
| 407 | P0 | smoke | signed-in user | inspect set-nav left rail | Account (default on), Automation, Tax preferences, Billing, Security | 5 nav items |
| 408 | P0 | smoke | signed-in user, Account panel | inspect rows | Full name / Email / Phone / Time zone / Language / Country / Company Name | 7 rows present |
| 409 | P0 | regression | signed-in user | NO "Privacy" panel exists in set-nav | confirms recent removal | nav has 5 items, not 6 |
| 410 | P0 | smoke | signed-in user | inspect avatar + name + plan | initial, name, plan line | populated from session |
| 411 | P0 | smoke | signed-in user | click "Manage plan" button | jumps to Billing panel | `#sp-billing.on` |
| 412 | P0 | smoke | signed-in user | click "EDIT" on Full name | modal opens with name field | overlay shown |
| 413 | P0 | smoke | signed-in user | save new name | DB UPDATE; row reflects | text match |
| 414 | P0 | smoke | signed-in user | inspect Email row | shows current user email; edit-link is `.disabled` with "SIGNED IN" | disabled class present |
| 415 | P0 | smoke | signed-in user | click "EDIT" on Phone | modal opens | overlay shown |
| 416 | P0 | smoke | signed-in user | edit time zone | edit-link triggers picker; saves to profile | DB UPDATE |
| 417 | P0 | smoke | signed-in user | inspect Country edit-link | clickable; opens country picker | modal shown |
| 418 | P0 | smoke | signed-in user | edit Company Name (Workspace) | DB UPDATE | text match |
| 419 | P0 | smoke | signed-in user | click Automation tab | shows "AUTOMATION CONTROLS · COMING SOON" coming-soon block | text match |
| 420 | P0 | smoke | signed-in user | click Tax preferences tab | shows mileage rate row with "$0.725" default | DOM check |
| 421 | P0 | smoke | signed-in user | click "EDIT" on Mileage rate | rate input modal opens | overlay shown |
| 422 | P0 | regression | signed-in user, set custom rate $0.700 | save | DB UPDATE; row shows $0.700; quarter card on dashboard recomputes | text match + dashboard reflects |
| 423 | P0 | regression | signed-in user, region=CA | mileage rate row shows $0.73/km or CAD equivalent | text match |
| 424 | P0 | smoke | signed-in user | click Billing tab | shows current plan + payment method cards; both buttons disabled with "Manage in iOS app" title | disabled attribute + title match |
| 425 | P0 | smoke | signed-in user | inspect invoice coming-soon | "INVOICES & BILLING EMAIL · COMING SOON" | text match |
| 426 | P0 | smoke | signed-in user | click Security tab | shows Email row + Sign out row | DOM check |
| 427 | P0 | regression | signed-in user, set-email present in Account AND Security | both reflect same email (recent commit: writes to BOTH tabs) | both `[data-mmai=set-email]` instances render identical text | text match |
| 428 | P0 | smoke | signed-in user | click "Sign out →" in Security | signOut called; redirects to /signin/ | URL change |
| 429 | P0 | smoke | signed-in user | inspect password/2FA coming-soon block | "PASSWORD · 2FA · ACTIVE SESSIONS · COMING SOON" text present | text match |
| 430 | P0 | smoke | signed-in user | click sidebar Help item | opens help center URL/modal | event fires |
| 431 | P0 | smoke | signed-in user | inspect about-app version (footer of settings or sidebar) | shows current build/version | text match |
| 432 | P1 | a11y | signed-in user | tab through Account fields | focus visible on each edit-link | computedStyle outline |
| 433 | P1 | a11y | signed-in user | edit-link flash | clicking edit-link flashes "EDITING…" then reverts after 900ms | text changes then reverts |
| 434 | P1 | regression | signed-in user | switching panels via left rail | only one `.sp.on` at a time | DOM check |
| 435 | P1 | responsive | 360px | inspect settings | set-grid collapses to 1-col | DOM check |
| 436 | P1 | responsive | 768px | inspect settings | 2-col layout | DOM check |
| 437 | P1 | data-integrity | signed-in user | edit name to >100 chars | validation rejects or truncates | error or truncated value |
| 438 | P1 | data-integrity | signed-in user | edit phone to invalid format | validation rejects | error visible |
| 439 | P1 | regression | signed-in user, modal open | Esc closes modal without saving | overlay hidden; DB unchanged | DB unchanged |
| 440 | P1 | regression | signed-in user, modal open | click backdrop | overlay closes | overlay hidden |
| 441 | P1 | smoke | signed-in user | inspect Language row | shows "English (US)" or current language | text non-empty |
| 442 | P1 | smoke | signed-in user | inspect Time zone | shows IANA tz like "America/New_York" | text matches regex |
| 443 | P2 | a11y | signed-in user | axe-core on Settings | 0 critical | axe 0 errors |
| 444 | P1 | regression | signed-in user | log out then sign back in | settings persist (DB-backed) | values match what was saved |
| 445 | P1 | data-integrity | signed-in user | concurrent edits in 2 tabs | last write wins (or conflict warning per spec) | DB reflects last save |

## 18. Privacy / Terms (cases 446–455)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 446 | P0 | smoke | clean browser | GET /privacy/ | 200 OK | status 200 |
| 447 | P0 | smoke | desktop | inspect /privacy/ content | non-empty privacy policy with effective date | length > 1000 chars |
| 448 | P0 | smoke | clean browser | GET /terms/ | 200 OK | status 200 |
| 449 | P0 | smoke | desktop | inspect /terms/ content | non-empty terms of service with effective date | length > 1000 chars |
| 450 | P1 | smoke | desktop | inspect anchors within Privacy | all #section anchors target real ids | each anchor's target element exists |
| 451 | P1 | smoke | desktop | inspect anchors within Terms | all #section anchors target real ids | each target exists |
| 452 | P1 | smoke | desktop | inspect canonical tags | both pages have rel=canonical | tag present |
| 453 | P1 | responsive | 360px | both pages | text wraps, readable | scrollWidth check |
| 454 | P2 | a11y | desktop | axe-core on both pages | 0 critical violations | axe 0 errors |
| 455 | P1 | smoke | desktop | both pages have nav + footer | renders | DOM check |

## 19. Cross-cutting (cases 456–500)

| # | Severity | Type | Pre-condition | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|---|
| 456 | P0 | security | clean browser | curl every public page and inspect CSP | meta CSP present on each | regex match for `Content-Security-Policy` |
| 457 | P0 | security | desktop | /app/ CSP | excludes `'unsafe-eval'` (no Babel in /app/) | CSP script-src does NOT contain 'unsafe-eval' |
| 458 | P0 | security | desktop | marketing CSP | includes `'unsafe-eval'` (Babel JSX requires it) | CSP script-src contains 'unsafe-eval' |
| 459 | P0 | security | desktop | /app/ CSP connect-src | allows `https://*.supabase.co`, `https://accounts.google.com`, `https://appleid.apple.com` | CSP regex match |
| 460 | P0 | security | desktop | every page CSP | `frame-ancestors 'none'` (clickjacking) | regex match |
| 461 | P0 | security | desktop | every page CSP | `object-src 'none'` (Flash/legacy plugin) | regex match |
| 462 | P0 | security | desktop | every page CSP | `base-uri 'self'` | regex match |
| 463 | P1 | regression | desktop | Service worker registration | (if SW shipped) sw.js fetched and registers; (if not) navigator.serviceWorker.controller === null | matches deploy state |
| 464 | P1 | regression | desktop, SW shipped | offline test | navigate offline; shell renders from SW cache | offline page or cached shell shown |
| 465 | P1 | regression | desktop | manifest.json exists | (if PWA) `<link rel=manifest>` references manifest.json | DOM check |
| 466 | P1 | regression | desktop, PWA | manifest.json validates | name, short_name, icons, start_url, display present | JSON schema valid |
| 467 | P0 | perf | desktop | TTFB from Fastly/GitHub Pages edge | < 500ms for /index.html | Network timing < 500ms |
| 468 | P0 | perf | desktop | FCP on / | < 2s (cold load over Fast 3G) | Lighthouse FCP < 2s |
| 469 | P0 | perf | desktop, Lighthouse | /app/ score | Performance ≥ 70 | LH ≥ 70 |
| 470 | P0 | perf | desktop | total JS bundle on / | render-blocking JS over 200KB flagged | LH "eliminate render-blocking" passes |
| 471 | P0 | a11y | desktop, keyboard | full tab order across / | logical L→R, T→B; no traps | manual walk-through |
| 472 | P0 | a11y | desktop | focus rings on every focusable element | visible outline ≥ 2px | computedStyle outlineWidth >= 2 |
| 473 | P0 | a11y | desktop | ARIA labels on `/app/` tabs/tablist | `role=tablist`, `role=tab`, `aria-selected`, `aria-controls` all present | axe ARIA passes |
| 474 | P0 | a11y | desktop, axe-core | color contrast on all body text | meets WCAG AA (4.5:1 for body, 3:1 for large) | axe color-contrast 0 errors |
| 475 | P0 | a11y | desktop | alt text on hero image, persona icons | meaningful alt or aria-hidden | axe image-alt passes |
| 476 | P0 | a11y | desktop, keyboard | no keyboard traps | Tab forward + Shift+Tab back across page | manual walk-through |
| 477 | P0 | a11y | signed-in user | Esc closes modals on /app/ | `#mmai-overlay` hides | overlay `hidden` after Esc |
| 478 | P0 | security | network panel | no extra API keys beyond Supabase publishable | no service_role, no SK_, no secret-prefixed env in network requests | grep network for key patterns: 0 matches |
| 479 | P0 | security | signed-in user A | attempt UPDATE on user B's row via raw fetch | Supabase RLS rejects with 401/403 | network response status 403 or 401 |
| 480 | P0 | security | signed-in user | Supabase auth uses JWT bearer | CSRF not applicable (no cookie-based auth on /app/) | inspect Authorization header on requests |
| 481 | P0 | security | desktop | cookies set by Supabase (if any) | Secure flag + HttpOnly where applicable | document.cookie inspect |
| 482 | P0 | responsive | 360px (iPhone SE) | all routes | no horizontal scroll | scrollWidth <= clientWidth on each page |
| 483 | P0 | responsive | 414px (iPhone 14) | all routes | layout adapts | DOM check |
| 484 | P0 | responsive | 768px (iPad) | all routes | nav adapts | DOM check |
| 485 | P0 | responsive | 1024px (laptop) | all routes | full layout | DOM check |
| 486 | P0 | responsive | 1440px (desktop) | all routes | content centered | DOM check |
| 487 | P0 | responsive | 1920px (large) | all routes | gutters present, content not stretched | max-width caps respected |
| 488 | P0 | browser-compat | Chrome 130 | smoke regression of /, /signin/, /signup/, /app/ | renders cleanly | 0 console errors |
| 489 | P0 | browser-compat | Firefox 128 | same smoke | renders cleanly | 0 console errors |
| 490 | P0 | browser-compat | Safari 17.6 | same smoke | renders cleanly | 0 console errors |
| 491 | P0 | browser-compat | Edge 130 | same smoke | renders cleanly | 0 console errors |
| 492 | P0 | browser-compat | iOS Safari 18 (iPhone 14) | / + /signin/ + /app/ | renders; locale toggle works; Apple SSO opens native | 0 console errors |
| 493 | P0 | browser-compat | Android Chrome 130 (Pixel 7) | / + /signin/ + /app/ | renders; Google SSO works | 0 console errors |
| 494 | P0 | seo | desktop | curl /sitemap.xml | 200 OK; contains 24 `<url>` entries | grep `<url>` count = 24 |
| 495 | P0 | seo | desktop | curl /robots.txt | blocks /app/, /auth-callback/, /welcome/, /signin/, /signup/, dev preview pages; lists sitemap | regex match for each Disallow |
| 496 | P1 | seo | desktop | each public page has canonical + meta description + og:image | tags present | DOM check on each route |
| 497 | P0 | data-integrity | signed-in user | trip_uid de-dup on UPSERT | re-running iOS sync with same trip_uid does NOT create duplicate | DB row count unchanged after re-sync |
| 498 | P0 | data-integrity | signed-in user, multi-vehicle | only one is_default per user enforced (DB constraint or app-level atomic update) | toggling default flips exactly one | SQL `SELECT COUNT(*) WHERE is_default AND user_id=X` always === 1 |
| 499 | P0 | data-integrity | signed-in user | soft-delete a trip | UI hides immediately; DB column `deleted_at` set; not in default SELECT | UI + DB consistent |
| 500 | P1 | integration | signed-in user, 2 browser tabs open on /app/ | mutate a trip in tab A; observe tab B (after realtime ships) | tab B reflects mutation within 3s | DOM updates in tab B; alternative: cross-device parity after refresh works today (iOS app mutation visible in web after F5) |

---

## Execution Notes

- **Severity:** P0 = ship-blocker; P1 = must-fix; P2 = should-fix; P3 = nice-to-have.
- **Run order recommendation:** 1–100 (marketing) for SEO/launch; 176–265 (auth) before /app/ tests; 266–445 (/app/) require seeded test user `aman.s38@outlook.com` per memory `user_accounts.md`; 446–500 (cross-cutting) last.
- **Tooling assumed:** Chrome DevTools (Network, Console, Lighthouse, axe DevTools extension); curl for sitemap/robots; SQL access to Supabase project `dxpuuiqibtizewbbffjk` for DB verification.
- **Known carve-outs:**
  - `assets/js/app.js` lines that touch `TripDetector` and the speedometer/miles-calc paths are locked zones (memory: `locked_code_zones`) — do NOT modify in fix PRs.
  - Realtime tests (case 500) gracefully degrade until realtime subscription ships; treat refresh-parity as the current bar.
  - jsPDF + jspdf-autotable are loaded with cache-busted `?v=` query params — verify version bump in network panel after any deploy.
