# Swapnanil Chattopadhyay — Portfolio

A responsive static portfolio focused on software engineering in finance, AI and algorithms. Morgan Stanley placement and OpenAI DevDay work lead the experience; hardware projects have their own demos.

Build: node scripts/build-static.mjs
Check: node --check script.js
Preview: python -m http.server 4174 --directory dist

No package dependencies. Serve dist/ with any static host.

The opening personal-profile widget introduces Swapnanil by name, followed by his SWE internship, bio and links. Native expandable experience, education and awards records sit alongside it; education opens initially. The engineering-desk project map and local Ctrl/Cmd-K search remain below. Quant development is an interest lens, and the JPMorgan Chase exercise is explicitly a job simulation. The current Morgan Stanley title is Software Engineering Intern. The profile widget uses identity.css.

Files: index.html (content), desk.css and desk.js (responsive map, evidence inspector, local search and London clock), styles.css and story.css (shared widget primitives), overview.js (experience/education panels), script.js (project dialogs and hardware demos), project-widgets.js (project-specific experiments). Reduced motion disables entrance and connection animations. No API keys or external AI service are needed for search.

The placement widget is an illustrative greedy local-search demo, separate from the reported competition implementation. Career facts and metrics were supplied by the owner.

Sites hosting configuration: .openai/hosting.json. New Sites start private.
