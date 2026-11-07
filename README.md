# Swapnanil Chattopadhyay — Portfolio

A responsive static portfolio focused on software engineering in finance, AI and algorithms. Morgan Stanley placement and OpenAI DevDay work lead the experience; hardware projects have their own demos.

Build: node scripts/build-static.mjs
Check: node --check script.js
Preview: python -m http.server 4174 --directory dist

No package dependencies. Serve dist/ with any static host.

Files: index.html (short visual story), story.css (graphite/cobalt responsive design), story.js (scroll chapters, signal canvas and project navigation), styles.css (shared widget primitives), script.js (dialogs and hardware demos), project-widgets.js (project-specific widgets). Reduced motion presents all story chapters without scroll animation.

The placement widget is an illustrative greedy local-search demo, separate from the reported competition implementation. Career facts and metrics were supplied by the owner.

Sites hosting configuration: .openai/hosting.json. New Sites start private.
