# Swapnanil Chattopadhyay — Portfolio

A responsive static portfolio focused on software engineering in finance, AI and algorithms. Morgan Stanley placement and OpenAI DevDay work lead the experience; hardware projects have their own demos.

Build: node scripts/build-static.mjs
Check: node --check script.js
Preview: python -m http.server 4174 --directory dist

No package dependencies. Serve dist/ with any static host.

Responsive layouts: desktop uses columns, tablet/phone layouts stack at 900px, and narrow-phone adjustments apply at 360px. Mobile navigation remains visible, primary touch controls have 44px targets, and dialogs use dynamic viewport height with internal scrolling. Touch pointer entry does not trigger desktop hover-pause. Responsive overrides are in responsive.css. Browser QA covered all three carousel panels at 320, 375, 430, 700, 768, 1024 and 1440px, plus 844×390 landscape, mobile search and project dialogs.

The opening personal-profile widget introduces Swapnanil by name, followed by his SWE internship, bio and links. A rotating highlights panel cycles through experience, education and recognition every five seconds. Manual selection pauses rotation; hover, focus, visibility and reduced-motion preferences are respected. Academic results are summarised as 80%+ across Years 1 and 2. The fixed identity remains beside the rotating panel on desktop. readability.css increases text sizes and contrast site-wide; profile-carousel.js manages rotation. The engineering-desk project map and local Ctrl/Cmd-K search remain below. Quantitative engineering is an interest lens, and the JPMorgan Chase exercise is explicitly a job simulation. The current Morgan Stanley title is Software Engineering Intern.

Files: index.html (content), desk.css and desk.js (responsive map, evidence inspector, local search and London clock), styles.css and story.css (shared widget primitives), overview.js (experience/education panels), script.js (project dialogs and hardware demos), project-widgets.js (project-specific experiments). Reduced motion disables entrance and connection animations. No API keys or external AI service are needed for search.

The placement widget is an illustrative greedy local-search demo, separate from the reported competition implementation. Career facts and metrics were supplied by the owner.

Sites hosting configuration: .openai/hosting.json. New Sites start private.
