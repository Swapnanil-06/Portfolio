const deskItems={ms:{title:'Morgan Stanley',subtitle:'Software Engineering Intern',category:'EXPERIENCE',copy:'Application Infrastructure in London. Full-stack work with Angular and Java Spring Boot in a Linux environment.',skills:['Java','Spring Boot','Angular','Linux'],note:'Jun 2026 – Jun 2027 · Year in industry',short:'Software engineering'},arena:{title:'Agent Arena',subtitle:'OpenAI DevDay Community Hackathon',category:'HACKATHON / TOP 6 FINALIST',copy:'A 3D replica of the event venue and a Codex pets-themed shooter, built with my team. Top 6 finalist among 200+ participants.',skills:['Interactive software','3D environments','Hackathon'],note:'Team project · Community hackathon',short:'OpenAI DevDay Hackathon'},agent:{title:'AI website agent',subtitle:'A deployed Python assistant',category:'SOFTWARE / AI',copy:'Built with Groq, Gradio and an OpenAI-compatible API. Deployed on Hugging Face Spaces with secrets management and notifications.',skills:['Python','LLM APIs','Gradio'],note:'Personal project · Deployed assistant',short:'Python / LLM APIs'},placement:{title:'Auction-based placement',subtitle:'PARTCL × HRT Macro Placement Competition',category:'OPTIMISATION / ALGORITHMS',copy:'A Python algorithm treating macros as bidders and locations as goods, balancing wire length, area and density within a fixed runtime.',skills:['Python','Optimisation','Algorithms'],note:'Competition project · April 2026',short:'PARTCL × HRT competition'},credit:{title:'Credit analysis',subtitle:'JPMorgan Chase Quantitative Research job simulation',category:'JOB SIMULATION',copy:'Analysed loan default probabilities and used dynamic programming to bucket FICO scores. A learning simulation, rather than employment.',skills:['Python','Dynamic programming','Credit analysis'],note:'Job simulation · June 2025',short:'Quant research job simulation'},network:{title:'Network route optimisation',subtitle:'Kruskal’s minimum spanning tree',category:'ALGORITHMS / C',copy:'A C implementation for weighted networks, with edge sorting, file-based input and minimum spanning tree construction.',skills:['C','Graph algorithms','Data structures'],note:'University project · May 2025',short:'C / Graph algorithms'},riscv:{title:'Ripple-32',subtitle:'RISC-V CPU · Team lead',category:'DIGITAL HARDWARE / VERIFICATION',copy:'Leading eight engineers designing a CPU from scratch. Register architecture, control logic and 30+ cocotb tests.',skills:['Verilog','RISC-V','cocotb'],note:'Ongoing team project · SHaRC',short:'RISC-V / RTL verification'},mac:{title:'Vector MAC engine',subtitle:'Pipelined INT8 compute for FPGA',category:'COMPUTE ARCHITECTURE',copy:'Word-length analysis and a pipelined vector multiply-accumulate design, evaluated through Vivado synthesis and timing analysis.',skills:['Verilog','Vivado','FPGA'],note:'University project · May 2026',short:'FPGA / Pipelining'}};
const projectFacts = {
  arena: { context: 'OpenAI DevDay Community Hackathon', copy: 'A team-built 3D venue and playable shooter.', result: 'Top 6 finalist · 200+ participants', skills: ['3D environments', 'Interactive software'] },
  placement: { context: 'PARTCL × HRT competition', copy: 'Auction-based optimisation of chip layouts.', result: 'Auction theory applied to chip placement', skills: ['Python', 'Optimisation', 'Algorithms'] },
  agent: { context: 'Personal project · Deployed', copy: 'A deployed assistant built with Python and LLM APIs.', result: 'Groq · Gradio · OpenAI-compatible API', skills: ['Python', 'LLM APIs', 'Gradio'] },
  network: { context: 'University project', copy: 'Minimum spanning trees for weighted networks.', result: 'Edge sorting, graph construction and file-based input', skills: ['C', 'Kruskal’s algorithm', 'Data structures'] },
  credit: { context: 'JPMorgan Chase job simulation', copy: 'Loan default analysis and FICO score bucketing.', result: 'Quantitative research simulation', skills: ['Python', 'Dynamic programming', 'Credit analysis'] },
  riscv: { context: 'SHaRC · Ongoing team project', copy: 'Leading an eight-person RISC-V CPU design team.', result: 'Register architecture, control logic and RTL verification', skills: ['Verilog', 'RISC-V', 'cocotb'] },
  mac: { context: 'University project', copy: 'Pipelined INT8 vector computation for FPGA.', result: 'Area and latency evaluation with Vivado', skills: ['Verilog', 'FPGA', 'Vivado'] }
};
const projectRoutes = {
  selected: ['arena', 'placement', 'agent'],
  software: ['arena', 'agent', 'network'],
  quant: ['placement', 'credit', 'network'],
  systems: ['riscv', 'mac', 'network']
};
const projectBench = document.querySelector('.project-workbench');
const projectRows = [...document.querySelectorAll('[data-skim-row]')];
const projectNodes = [...document.querySelectorAll('[data-map-position]')];
const projectPlayback = document.getElementById('project-playback');
let projectRoute = 'selected', projectIndex = 0, projectPinned = false;
let projectPaused = reducedMotion, projectHover = false, projectFocus = false, projectVisible = false, projectTimeout;

function openDeskItem(key, returnFocus) {
  const trigger = document.querySelector('[data-open-key="' + key + '"]');
  let parent = trigger.parentElement;
  while (parent) {
    if (parent.tagName === 'DETAILS' && !returnFocus) parent.open = true;
    parent = parent.parentElement;
  }
  trigger.click();
  if (returnFocus) opener = returnFocus;
  else if (trigger.closest('[hidden]')) opener = document.querySelector('[data-open-search]');
}

function selectProject(index, manual = false) {
  projectIndex = index;
  const key = projectRoutes[projectRoute][index];
  projectRows.forEach((row, i) => {
    row.classList.toggle('is-current', i === index);
    const trigger = row.querySelector('[data-project-preview]');
    trigger.removeAttribute('aria-pressed');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'project-studio-dialog');
  });
  projectNodes.forEach((node, i) => node.setAttribute('aria-pressed', String(i === index)));
  document.querySelectorAll('.project-canvas .connection-lines path').forEach((path, i) => path.classList.toggle('selected', i === index));
  document.getElementById('project-active-category').textContent = deskItems[key].category;
  document.getElementById('project-active-title').textContent = deskItems[key].title;
  projectBench.dataset.activeProject = key;
  document.dispatchEvent(new CustomEvent('project-preview-change', {detail: {key}}));
  if (manual) projectPinned = true;
  scheduleProjectPreview();
}

function renderProjectRoute(key) {
  projectRoute = key;
  document.querySelectorAll('[data-route]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.route === key)));
  projectRoutes[key].forEach((itemKey, index) => {
    const item = deskItems[itemKey], facts = projectFacts[itemKey], row = projectRows[index], node = projectNodes[index];
    row.querySelector('h3').textContent = item.title;
    row.querySelector('.skim-context').textContent = facts.context;
    row.querySelector('.skim-description').textContent = facts.copy;
    row.querySelector('.skim-result').textContent = facts.result;
    const tags = row.querySelector('.skim-skills');
    tags.replaceChildren();
    facts.skills.forEach(text => { const li = document.createElement('li'); li.textContent = text; tags.append(li); });
    row.querySelector('.skim-preview').setAttribute('aria-label', 'Explore ' + item.title);
    if (node) {
      node.querySelector('strong').textContent = item.title;
      node.querySelector('small').textContent = item.short;
    }
  });
  projectBench.dataset.route = key;
  selectProject(0);
}

function scheduleProjectPreview() {
  clearTimeout(projectTimeout);
  const globalPause = document.body.classList.contains('motion-paused');
  const running = !projectPaused && !projectPinned && !projectHover && !projectFocus && projectVisible && !document.hidden && !globalPause;
  projectBench.classList.toggle('preview-paused', !running);
  projectBench.classList.toggle('scene-paused', projectPaused || globalPause);
  projectPlayback.setAttribute('aria-label', projectPaused ? 'Play project preview' : 'Pause project preview');
  const icon = projectPlayback.querySelector('[data-project-playback-icon]');
  const label = projectPlayback.querySelector('[data-project-playback-label]');
  const iconText = projectPaused ? '▶' : 'Ⅱ', labelText = projectPaused ? 'Play' : 'Pause';
  if (icon.textContent !== iconText) icon.textContent = iconText;
  if (label.textContent !== labelText) label.textContent = labelText;
  const atlasControl=document.getElementById('atlas-playback');
  if(atlasControl){ atlasControl.setAttribute('aria-label',projectPaused?'Play project overview':'Pause project overview'); const ai=atlasControl.querySelector('[data-atlas-icon]'),al=atlasControl.querySelector('[data-atlas-label]');if(ai.textContent!==iconText)ai.textContent=iconText;if(al.textContent!==labelText)al.textContent=labelText; }
  if (running) projectTimeout = setTimeout(() => selectProject((projectIndex + 1) % 3), 8000);
}

document.querySelectorAll('[data-route]').forEach(button => button.onclick = () => { projectPinned = true; renderProjectRoute(button.dataset.route); });
function openProjectExperiment(button) { selectProject(Number(button.dataset.projectPreview), true); document.dispatchEvent(new CustomEvent('open-project-studio', {detail: {trigger: button}})); }
document.querySelectorAll('[data-project-preview]').forEach(button => button.onclick = () => openProjectExperiment(button));
projectRows.forEach(row => row.addEventListener('click', event => {
  if (!event.target.closest('button, a')) openProjectExperiment(row.querySelector('[data-project-preview]'));
}));
projectNodes.forEach(button => button.onclick = () => selectProject(Number(button.dataset.mapPosition), true));
document.getElementById('open-project-notes').onclick = event => openDeskItem(projectRoutes[projectRoute][projectIndex], event.currentTarget);
projectPlayback.onclick = () => { projectPaused = !projectPaused; if (!projectPaused) projectPinned = false; scheduleProjectPreview(); };
document.addEventListener('project-stage-interaction', () => { projectPinned = true; scheduleProjectPreview(); });
projectBench.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { projectHover = true; scheduleProjectPreview(); } });
projectBench.addEventListener('pointerleave', () => { projectHover = false; scheduleProjectPreview(); });
projectBench.addEventListener('focusin', () => { projectFocus = true; scheduleProjectPreview(); });
projectBench.addEventListener('focusout', () => queueMicrotask(() => { projectFocus = projectBench.contains(document.activeElement); scheduleProjectPreview(); }));
document.addEventListener('visibilitychange', scheduleProjectPreview);
new IntersectionObserver(entries => { projectVisible = entries[0].isIntersecting; scheduleProjectPreview(); }, {threshold: .2}).observe(projectBench);
new MutationObserver(scheduleProjectPreview).observe(document.body, {attributes: true, attributeFilter: ['class']});
renderProjectRoute('selected');
detailData.awards={title:'Awards & competitions',label:'SELECTED RECOGNITION',copy:'Top 6 finalist, OpenAI DevDay Community Hackathon — Agent Arena, among 200+ participants. First place in the 180 Degrees Consulting university-wide case competition (2026).',heading:'Olympiads & challenges',note:'British Physics Olympiad Round 1: Bronze 2 (2023). UKMT Senior Mathematics Challenge: Silver (2023). Senior Physics Challenge: Bronze (2022).'};
const searchable=[...Object.entries(deskItems).map(([key,item])=>({key,title:item.title,description:item.subtitle,kind:item.category,keywords:item.skills.join(' ')})),{key:'mastek',title:'Mastek',description:'AI / ML Summer Intern',kind:'EXPERIENCE',keywords:'data SQL predictive analytics'},{key:'education',title:'University of Sheffield',description:'80%+ across Years 1 & 2 · First Class · BEng 2028',kind:'EDUCATION',keywords:'maths 94 first class academics'},{key:'awards',title:'Awards & olympiads',description:'OpenAI DevDay · 180 Degrees Consulting · BPhO · UKMT',kind:'RECOGNITION',keywords:'bronze silver medals physics maths'}];
const searchDialog=document.getElementById('search-dialog'),searchInput=document.getElementById('portfolio-search'),searchResults=document.getElementById('search-results');let searchOpener;
function openSearch(trigger){if(dialog.open)return;searchOpener=trigger;searchInput.value='';renderSearch();searchDialog.showModal();searchInput.focus()}
function openSearchResult(item){searchDialog.close();if(item.key==='education'||item.key==='awards'){document.querySelector('[data-story-detail="'+item.key+'"]').click()}else openDeskItem(item.key)}
function renderSearch(){const q=searchInput.value.trim().toLowerCase();const matches=searchable.filter(item=>[item.title,item.description,item.keywords,item.kind].join(' ').toLowerCase().includes(q));searchResults.replaceChildren();if(!matches.length){const p=document.createElement('p');p.className='no-results';p.textContent='No matches. Try “Python”, “Morgan Stanley” or “awards”.';searchResults.append(p)}matches.forEach(item=>{const button=document.createElement('button');const row=document.createElement('div');row.setAttribute('role','listitem');const title=document.createElement('span');title.textContent=item.title;const kind=document.createElement('small');kind.textContent=item.kind;button.append(title,kind);button.onclick=()=>openSearchResult(item);row.append(button);searchResults.append(row)})}
document.querySelectorAll('[data-open-search]').forEach(button=>button.onclick=()=>openSearch(button));document.getElementById('close-search').onclick=()=>searchDialog.close();searchInput.oninput=renderSearch;searchInput.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();searchResults.querySelector('button')?.focus()}if(e.key==='Enter'){searchResults.querySelector('button')?.click()}};searchResults.onkeydown=e=>{const buttons=[...searchResults.querySelectorAll('button')],index=buttons.indexOf(document.activeElement);if(e.key==='ArrowDown'){e.preventDefault();buttons[(index+1)%buttons.length]?.focus()}if(e.key==='ArrowUp'){e.preventDefault();if(index<=0)searchInput.focus();else buttons[index-1].focus()}};searchDialog.addEventListener('close',()=>searchOpener?.focus());document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(searchDialog.open)searchDialog.close();else openSearch(document.querySelector('[data-open-search]'))}});document.querySelector('.personal-widget').classList.add('desk-enter');
