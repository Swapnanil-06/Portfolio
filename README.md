# Swapnanil Chattopadhyay — Portfolio

A responsive static portfolio focused on software engineering in finance, AI and algorithms. Morgan Stanley placement and OpenAI DevDay work lead the experience; hardware projects have their own demos.

Build: node scripts/build-static.mjs
Check: node --check script.js
Preview: python -m http.server 4174 --directory dist

No package dependencies. Serve dist/ with any static host.

The current design is an engineering desk: a neutral outer page, an interactive map connecting career interests to actual experience/projects, and a local Ctrl/Cmd-K search palette. Quant development is an interest lens, and the JPMorgan Chase exercise is explicitly a job simulation. The current Morgan Stanley title is Software Engineering Intern.

Files: index.html (content), desk.css and desk.js (responsive map, evidence inspector, local search and London clock), styles.css and story.css (shared widget primitives), overview.js (experience/education panels), script.js (project dialogs and hardware demos), project-widgets.js (project-specific experiments). Reduced motion disables entrance and connection animations. No API keys or external AI service are needed for search.

The placement widget is an illustrative greedy local-search demo, separate from the reported competition implementation. Career facts and metrics were supplied by the owner.

Sites hosting configuration: .openai/hosting.json. New Sites start private.
