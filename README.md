# Swapnanil Chattopadhyay — Portfolio

A responsive static portfolio focused on software engineering in finance, AI and algorithms. Morgan Stanley placement and OpenAI DevDay work lead the experience; hardware projects have their own demos.

Build: node scripts/build-static.mjs
Check: node --check script.js
Preview: python -m http.server 4174 --directory dist

No package dependencies. Serve dist/ with any static host.

Files: index.html (compact factual overview), overview.css and overview.js (responsive layout, accessible background explorer and project filters), styles.css and story.css (shared style/widget primitives), script.js (dialogs and hardware demos), project-widgets.js (project-specific widgets). The current homepage has no pinned scroll chapters, oversized name or separate Finance project-count category. Reduced motion disables entrance and panel animations.

The placement widget is an illustrative greedy local-search demo, separate from the reported competition implementation. Career facts and metrics were supplied by the owner.

Sites hosting configuration: .openai/hosting.json. New Sites start private.
