// Small, self-contained studies of the projects. These are illustrative demos,
// not captured project footage or a replacement for the original implementations.
(() => {
  const canvas = document.getElementById('project-stage-canvas');
  const ctx = canvas.getContext('2d');
  const stage = document.querySelector('.project-stage');
  const bench = document.querySelector('.project-workbench');
  const action = document.getElementById('stage-action');
  const instruction = document.getElementById('stage-instruction');
  const status = document.getElementById('stage-status');
  const sceneLabel = document.getElementById('stage-scene-label');
  const pagination = document.createElement('div');
  pagination.className = 'stage-pagination';
  pagination.innerHTML = '<button aria-label="Previous project">←</button><span>01 / 03</span><button aria-label="Next project">→</button>';
  stage.querySelector('.stage-header').after(pagination);
  pagination.querySelectorAll('button').forEach((button,i) => button.onclick = () => {
    const rows=[...document.querySelectorAll('[data-skim-row]')];
    const index=rows.findIndex(row=>row.classList.contains('is-current'));
    rows[(index+(i?1:2))%3].querySelector('[data-project-preview]').click();
  });
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const green = '#bed0a1', copper = '#cd916a', white = '#e4e9d9', dim = '#788d75';
  let key, w = 0, h = 0, scale = 1, frame = 0, time = 0, last = 0, visible = false;
  let orbit = 0, selected = -1, destination = [0, 0], player = [0, 0], beacon = [3, -2], beacons = 0;
  let cells = [], visual = [], request = -1, phase = -1, buckets = 4, treeCount = 0, cpuCycle = 0, macRun = -1;
  let pointerStart = null, pointerLast = null;
  const graph = [[-275,-80],[-180,95],[-90,-135],[-40,15],[65,135],[130,-80],[235,55],[280,-135],[5,-160]];
  const graphEdges = [[0,1],[0,2],[0,3],[1,3],[1,4],[2,3],[2,8],[3,4],[3,5],[3,8],[4,6],[5,6],[5,7],[5,8],[6,7],[7,8]];
  const sortedEdges = [...graphEdges].sort((a,b) => edgeLength(a)-edgeLength(b));
  const parent = graph.map((_,i) => i), mst = [];
  const root = i => parent[i] === i ? i : (parent[i] = root(parent[i]));
  sortedEdges.forEach(e => { const a=root(e[0]), b=root(e[1]); if(a!==b) { parent[a]=b; mst.push(e); } });
  const links = [[0,1],[0,4],[1,2],[1,5],[2,3],[3,7],[4,5],[4,8],[5,6],[6,7],[6,9],[7,10],[8,9],[9,10],[10,11]];
  const settings = {
    arena: ['THE ARENA / AN INTERACTIVE STUDY', 'Click the floor to move. Arrow keys work too.', 'Find beacon', 'Explore the arena. Collect the beacon.'],
    placement: ['PLACEMENT / CONSTRAINTS IN MOTION', 'Select two blocks to swap their positions.', 'Optimise layout', 'A small placement study, using Manhattan wire length.'],
    agent: ['AI AGENT / FOLLOW THE REQUEST', 'Send a request through the illustrated pipeline.', 'Run a request', 'Query → model → tools → response.'],
    network: ['NETWORKS / FIND THE SPANNING TREE', 'Build a minimum spanning tree, one edge at a time.', 'Add next edge', 'Weighted graph · Kruskal’s algorithm.'],
    credit: ['CREDIT / EXPLORE SCORE BUCKETS', 'Change the grouping of a synthetic score distribution.', 'Change buckets', 'Illustrative data · no real borrowers.'],
    riscv: ['RIPPLE-32 / INSIDE THE DATAPATH', 'Step through a simplified instruction walkthrough.', 'Step instruction', 'Illustrative datapath · registers start at zero.'],
    mac: ['VECTOR MAC / PARALLEL TO PIPELINED', 'Follow four products through the adder tree.', 'Run the vector', 'INT8 inputs · multiply → add → accumulate.']
  };
  function edgeLength(e) { return Math.hypot(graph[e[0]][0]-graph[e[1]][0],graph[e[0]][1]-graph[e[1]][1]); }
  function text(value,x,y,size=12,color=dim,align='left') {
    ctx.font = `${Math.max(size,9/scale)}px 'DM Sans',Arial,sans-serif`;
    ctx.fillStyle=color; ctx.textAlign=align; ctx.textBaseline='middle'; ctx.fillText(value,x,y);
  }
  function line(points,color=dim,width=1,dash=[]) {
    ctx.beginPath(); points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
  }
  function polygon(points,fill,stroke='#6e836044') {
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();
    ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
  }
  function dot(x,y,r,color,glow=0) {
    ctx.save();ctx.shadowColor=color;ctx.shadowBlur=glow;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  function box(x,y,bw,bh,label,active=false,sub='') {
    ctx.save();ctx.beginPath();ctx.roundRect(x-bw/2,y-bh/2,bw,bh,7);ctx.fillStyle=active?'#3d5039':'#252f29';ctx.fill();ctx.strokeStyle=active?green:'#677b5a88';ctx.lineWidth=active?1.7:1;ctx.stroke();
    text(label,x,y-(sub?9:0),15,active?white:'#b7c6ac','center');if(sub)text(sub,x,y+15,10,dim,'center');ctx.restore();
  }
  function iso(x,y,z=0) {
    const c=Math.cos(orbit),s=Math.sin(orbit),a=x*c-y*s,b=x*s+y*c;
    return [(a-b)*32,(a+b)*15-z*35+25];
  }
  function block(x,y,bw,bd,bh,fill='#657957',light='#95a880',label='') {
    const a=iso(x,y,bh),b=iso(x+bw,y,bh),c=iso(x+bw,y+bd,bh),d=iso(x,y+bd,bh),e=iso(x+bw,y,0),f=iso(x+bw,y+bd,0),g=iso(x,y+bd,0);
    polygon([d,c,f,g],fill);polygon([b,c,f,e],'#344b37');polygon([a,b,c,d],light,'#b4c99a66');
    if(label) { const p=iso(x+bw/2,y+bd/2,bh);text(label,p[0],p[1],11,'#18261d','center'); }
  }
  function floor(size=5) {
    const a=iso(-size,-size),b=iso(size,-size),c=iso(size,size),d=iso(-size,size);
    polygon([d,c,[c[0],c[1]+15],[d[0],d[1]+15]],'#26382b','#72886544');
    polygon([b,c,[c[0],c[1]+15],[b[0],b[1]+15]],'#1b2c23','#72886544');
    polygon([a,b,c,d],'#25362c','#7e956c99');
    for(let i=-size;i<=size;i++) { line([iso(i,-size),iso(i,size)],'#7b98652b');line([iso(-size,i),iso(size,i)],'#7b98652b'); }
  }
  function halo(x,y,r,color=green) {
    ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(x,y,r,r*.45,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  function drawArena(dt) {
    floor();
    const obstacles=[[-4,-3,2,1,1],[-1,-4,1,2,1.5],[2,-4,2,1,.7],[-4,0,1,2,.65],[1,1,2,1,.9],[3,3,1,1,1.4],[-2,3,2,1,.5]];
    obstacles.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])).forEach(p=>block(...p));
    const bp=iso(...beacon),pulse=1+Math.sin(time*2)*.1;
    halo(bp[0],bp[1],17*pulse,copper);halo(bp[0],bp[1],27*pulse,'#cd916a44');
    line([[bp[0],bp[1]],[bp[0],bp[1]-55]],'#cd916a88',1,[3,5]);dot(bp[0],bp[1]-55,5,copper,20);
    const blend=media.matches?1:Math.min(1,dt*5);
    player[0]+=(destination[0]-player[0])*blend;player[1]+=(destination[1]-player[1])*blend;
    const pp=iso(...player);halo(pp[0],pp[1]+2,17,'#e0e8d0aa');block(player[0]-.28,player[1]-.28,.56,.56,.75,'#935c3e',copper);
    dot(pp[0],pp[1]-35,2.5,white,12);
    if(Math.hypot(player[0]-beacon[0],player[1]-beacon[1])<.18) {
      beacons++;beacon=[[3,-2],[-3,2],[2,3],[-2,-3]][beacons%4];status.textContent=`Beacon ${beacons} collected. Find the next one.`;
    }
    text('ISOMETRIC PLAYGROUND',0,195,11,dim,'center');
    text(String(beacons).padStart(2,'0')+' / BEACONS',310,-155,11,copper,'right');
  }
  function wireScore(positions=cells) { return links.reduce((sum,[a,b])=>sum+Math.abs(positions[a][0]-positions[b][0])+Math.abs(positions[a][1]-positions[b][1]),0); }
  function drawPlacement(dt) {
    floor(5);
    cells.forEach((p,i)=> { const blend=media.matches?1:Math.min(1,dt*7);visual[i][0]+=(p[0]-visual[i][0])*blend;visual[i][1]+=(p[1]-visual[i][1])*blend; });
    links.forEach(([a,b],i)=> {
      const p=iso(visual[a][0]+.5,visual[a][1]+.5,.3),q=iso(visual[b][0]+.5,visual[b][1]+.5,.3);
      line([p,[q[0],p[1]],q],i%3?'#a2b68e50':'#d19a6b88',1);
      const t=(time*.18+i*.13)%1;dot(p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,1.8,i%3?green:copper,5);
    });
    visual.map((p,i)=>({p,i})).sort((a,b)=>(a.p[0]+a.p[1])-(b.p[0]+b.p[1])).forEach(({p,i})=>block(p[0],p[1],1.15,1.15,i===selected?.7:.32,i===selected?'#93613f':'#526c4a',i===selected?copper:(i%4===0?'#a5b78b':'#7c946a'),String(i+1).padStart(2,'0')));
    text('WIRE LENGTH',-310,-158,11,dim);text(String(wireScore()),-310,-122,31,white);
    text('12 BLOCKS / 15 CONNECTIONS',310,187,10,dim,'right');
  }
  function packet(a,b,t,color=green) {
    const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;dot(x,y,4,color,15);dot(x-(b[0]-a[0])*.025,y-(b[1]-a[1])*.025,2,color,6);
  }
  function drawAgent() {
    const nodes=[[-265,0],[-70,-65],[150,-65],[270,65]],names=['QUERY','MODEL','TOOLS','RESPONSE'];
    const subs=['user input','reason + route','take action','return output'];
    const elapsed=request<0?-1:time-request;
    const active=elapsed<0?-1:Math.min(3,Math.floor(elapsed/.95));
    if(active!==phase && elapsed>=0) { phase=active;status.textContent=['Request received.','Model: interpret the request.','Tools: retrieve the relevant context.','Response returned. Illustrative flow complete.'][active]; }
    nodes.slice(0,-1).forEach((p,i)=> { const q=nodes[i+1];line([p,[q[0],p[1]],q],'#7b94606b',1.2);packet(p,q,(time*.34+i*.27)%1,i===active?copper:green); });
    line([nodes[1],[-70,115],[150,115],nodes[2]],'#718c5544',1,[3,6]);
    box(-70,115,138,48,'CONTEXT',false);text('retrieve / remember',150,115,11,dim,'center');
    nodes.forEach((p,i)=>box(...p,i===3?138:130,72,names[i],i===active,subs[i]));
    const cx=-70,cy=-145,r=25;const vertices=Array.from({length:6},(_,i)=>[cx+Math.cos(i*Math.PI/3+time*.2)*r,cy+Math.sin(i*Math.PI/3+time*.2)*r*.65]);
    line([...vertices,vertices[0]],'#bdcfa188');vertices.forEach(p=>line([p,[cx,cy]],'#bdcfa144'));
    text('A REQUEST, MADE VISIBLE',0,195,11,dim,'center');
  }
  function drawNetwork() {
    graphEdges.forEach(e=> { const accepted=mst.slice(0,treeCount).some(x=>x[0]===e[0]&&x[1]===e[1]);line([graph[e[0]],graph[e[1]]],accepted?green:'#56674e66',accepted?2:1);if(accepted)packet(graph[e[0]],graph[e[1]],(time*.2)%1); });
    graph.forEach((p,i)=> { dot(...p,20,'#202e25');halo(p[0],p[1],23,'#647e5188');dot(...p,4,copper,10);text(String.fromCharCode(65+i),p[0],p[1]-31,12,white,'center'); });
    text(`${treeCount} / ${mst.length} EDGES`,-310,185,12,green);text('NO CYCLES',310,185,11,dim,'right');
  }
  function drawCredit() {
    const bars=28,step=21,base=130,left=-285;
    for(let i=0;i<bars;i++) {
      const height=(Math.exp(-Math.pow((i-18)/8,2))*160+Math.exp(-Math.pow((i-6)/5,2))*48+12);
      const bucket=Math.min(buckets-1,Math.floor(i/(bars/buckets))),colors=['#647c55','#8ca571','#bdc99d','#b7936d','#c5a481','#8da89c','#718f80'];
      const x=left+i*step,y=base-height;
      ctx.fillStyle=colors[bucket%colors.length];ctx.globalAlpha=.8+.1*Math.sin(time+i*.2);ctx.fillRect(x,y,15,height);ctx.globalAlpha=1;
    }
    line([[-300,base],[310,base]],'#b1c09c88');
    for(let i=1;i<buckets;i++) { const x=left+(bars/buckets)*i*step;line([[x,-110],[x,base]],'#d8b78d88',1,[4,5]); }
    text('300',-290,155,12,dim);text('850',300,155,12,dim,'right');text('SYNTHETIC FICO DISTRIBUTION',0,195,11,dim,'center');
    text(String(buckets)+' BUCKETS',-290,-155,21,white);
  }
  function drawCPU() {
    const xs=[-270,-90,90,270],names=['FETCH','DECODE','EXECUTE','WRITEBACK'];
    xs.forEach((x,i)=> { if(i<3){line([[x,-40],[xs[i+1],-40]],'#8ca67466',2);packet([x,-40],[xs[i+1],-40],(time*.45)%1,copper);}box(x,-40,140,85,names[i],i===cpuCycle%4,'stage '+(i+1)); });
    line([[-270,5],[-270,120],[270,120],[270,5]],'#809b6544',1,[4,7]);
    text('REGISTER FILE',-270,91,11,dim);['x1','x2','x3'].forEach((reg,i)=>box(-75+i*145,120,115,50,`${reg} = ${i===2?cpuCycle*3:cpuCycle*(i+1)}`,false));
    text('ADD x3, x1, x2',0,-150,24,white,'center');text('SIMPLIFIED INSTRUCTION WALKTHROUGH',0,195,10,dim,'center');
  }
  function drawMAC() {
    const a=[3,-2,4,1],b=[2,3,-1,5],elapsed=macRun<0?-1:time-macRun;
    a.forEach((n,i)=> { const x=-270+i*180;box(x,-80,128,68,`${n} × ${b[i]}`,elapsed>=0&&elapsed<1.2);text(String(n*b[i]),x,-22,16,green,'center');line([[x,0],[i<2?-170:170,75]],'#8ca67477',1.5); });
    box(-170,75,95,48,'0',elapsed>=1.2&&elapsed<2);box(170,75,95,48,'1',elapsed>=1.2&&elapsed<2);
    line([[-170,100],[0,155],[170,100]],'#8ca67477',1.5);box(0,155,130,55,'Σ = 1',elapsed>=2);
    text('PARALLEL PRODUCTS',0,-155,11,dim,'center');text('PIPELINED REDUCTION',310,183,10,dim,'right');
  }
  const drawers={arena:drawArena,placement:drawPlacement,agent:drawAgent,network:drawNetwork,credit:drawCredit,riscv:drawCPU,mac:drawMAC};
  function draw(dt=0) {
    const dpr=Math.min(devicePixelRatio||1,2);
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.translate(w/2,h/2+4);ctx.scale(scale,scale);
    // Quiet drafting marks frame the experiment, rather than a decorative grid.
    [[-345,-170],[345,-170],[-345,175],[345,175]].forEach(([x,y])=> { line([[x-5,y],[x+5,y]],'#72876544');line([[x,y-5],[x,y+5]],'#72876544'); });
    drawers[key]?.(dt);
  }
  function tick(now) {
    frame=0;
    const paused=media.matches||document.hidden||document.body.classList.contains('motion-paused')||bench.classList.contains('scene-paused');
    const dt=Math.min(.05,(now-last)/1000||0);last=now;
    if(visible&&!paused) { time+=dt;draw(dt);frame=requestAnimationFrame(tick); }
    else draw();
  }
  function wake() { if(!frame&&visible) { last=performance.now();frame=requestAnimationFrame(tick); } }
  function resize() {
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);if(!rect.width||!rect.height)return;w=rect.width;h=rect.height;
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);scale=Math.min(w/770,h/420);
    if(key) {
      document.querySelector('.stage-coordinate').textContent=key==='arena'?(innerWidth<=560?'TAP TO MOVE':'DRAG TO ORBIT'):'CLICK TO EXPLORE';
      instruction.textContent=key==='arena'&&innerWidth<=560?'Tap the floor to move, or find a beacon.':settings[key][1];
    }
    draw();wake();
  }
  function select(next) {
    if(!settings[next])return;
    if(key===next)return;key=next;orbit=0;selected=-1;player=[0,0];destination=[0,0];beacon=[3,-2];beacons=0;
    cells=[[-4,-3],[0,2],[-2,-3],[2,2],[0,-3],[-4,0],[2,-3],[-2,2],[2,0],[-2,0],[-4,2],[0,0]];
    visual=cells.map(p=>[...p]);request=-1;phase=-1;treeCount=0;cpuCycle=0;macRun=-1;buckets=4;
    const config=settings[key];sceneLabel.textContent=config[0];instruction.textContent=config[1];status.textContent=config[3];
    document.querySelector('.stage-coordinate').textContent=key==='arena'?(innerWidth<=560?'TAP TO MOVE':'DRAG TO ORBIT'):'CLICK TO EXPLORE';
    if(key==='arena'&&innerWidth<=560)instruction.textContent='Tap the floor to move, or find a beacon.';
    const current=[...document.querySelectorAll('[data-skim-row]')].findIndex(row=>row.classList.contains('is-current'));
    pagination.querySelector('span').textContent=String(current+1).padStart(2,'0')+' / 03';
    action.replaceChildren(document.createTextNode(config[2]+' '));const arrow=document.createElement('span');arrow.textContent='↗';action.append(arrow);
    canvas.setAttribute('aria-label',config[0]+'. '+config[1]);
    stage.classList.remove('is-changing');void stage.offsetWidth;stage.classList.add('is-changing');draw();wake();
  }
  function interact() { document.dispatchEvent(new Event('project-stage-interaction')); }
  function primaryAction() {
    interact();
    if(key==='arena') { destination=[...beacon];if(media.matches||bench.classList.contains('scene-paused'))player=[...destination]; }
    if(key==='placement') {
      const before=wireScore();let best=before,pair=null;
      for(let i=0;i<cells.length;i++)for(let j=i+1;j<cells.length;j++){[cells[i],cells[j]]=[cells[j],cells[i]];const score=wireScore();if(score<best){best=score;pair=[i,j];}[cells[i],cells[j]]=[cells[j],cells[i]];}
      if(pair){const[i,j]=pair;[cells[i],cells[j]]=[cells[j],cells[i]];status.textContent=`Demo wire length: ${before} → ${best}. Try another optimisation.`;}
      else {cells.reverse();status.textContent='Layout reshuffled. Optimise the new arrangement.';}
      if(media.matches||bench.classList.contains('scene-paused'))visual=cells.map(p=>[...p]);
    }
    if(key==='agent'){if(media.matches||bench.classList.contains('scene-paused')){phase=(phase+1)%4;status.textContent=['Request received.','Model: interpret the request.','Tools: retrieve the relevant context.','Response returned.'][phase];request=time-phase*.95;}else{request=time;phase=-1;status.textContent='Request sent. Follow the signal.';}}
    if(key==='network'){treeCount=(treeCount+1)%(mst.length+1);status.textContent=`${treeCount} of ${mst.length} edges selected. No cycles.`;}
    if(key==='credit'){buckets=buckets===7?3:buckets+1;status.textContent=`Synthetic distribution grouped into ${buckets} equal-width buckets.`;}
    if(key==='riscv'){cpuCycle++;status.textContent=`Step ${cpuCycle}: x1 = ${cpuCycle}, x2 = ${cpuCycle*2}, x3 = ${cpuCycle*3}.`;}
    if(key==='mac'){macRun=time;status.textContent='3×2 + (−2)×3 + 4×(−1) + 1×5 = 1.';}
    draw(media.matches?1:0);wake();
  }
  action.addEventListener('click',primaryAction);
  canvas.addEventListener('pointerdown',e=> { pointerStart=[e.clientX,e.clientY];pointerLast=pointerStart;interact(); });
  canvas.addEventListener('pointermove',e=> { if(!pointerStart||e.pointerType==='touch')return;if(key==='arena'){orbit=Math.max(-.4,Math.min(.4,orbit+(e.clientX-pointerLast[0])*.003));pointerLast=[e.clientX,e.clientY];draw();} });
  canvas.addEventListener('pointercancel',()=>pointerStart=null);
  canvas.addEventListener('pointerleave',()=>pointerStart=null);
  canvas.addEventListener('pointerup',e=> {
    if(!pointerStart)return;const distance=Math.hypot(e.clientX-pointerStart[0],e.clientY-pointerStart[1]);pointerStart=null;if(distance>10)return;
    const rect=canvas.getBoundingClientRect(),p=[(e.clientX-rect.left-w/2)/scale,(e.clientY-rect.top-h/2-4)/scale];
    if(key==='arena'){let best=Infinity;for(let x=-4;x<=4;x++)for(let y=-4;y<=4;y++){const q=iso(x,y),d=Math.hypot(q[0]-p[0],q[1]-p[1]);if(d<best){best=d;destination=[x,y];}}if(media.matches||bench.classList.contains('scene-paused'))player=[...destination];}
    else if(key==='placement'){let best=Infinity,index=-1;visual.forEach((v,i)=>{const q=iso(v[0]+.5,v[1]+.5,.4),d=Math.hypot(q[0]-p[0],q[1]-p[1]);if(d<best){best=d;index=i;}});if(best<70){if(selected<0){selected=index;status.textContent=`Block ${index+1} selected. Choose a second block.`;}else{[cells[selected],cells[index]]=[cells[index],cells[selected]];selected=-1;status.textContent=`Positions swapped. Demo wire length: ${wireScore()}.`;if(media.matches)visual=cells.map(v=>[...v]);}}}
    else primaryAction();
    draw(media.matches?1:0);wake();
  });
  canvas.addEventListener('keydown',e=> {
    if(key==='arena'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault();interact();const changes={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]},d=changes[e.key];destination=[Math.max(-4,Math.min(4,destination[0]+d[0])),Math.max(-4,Math.min(4,destination[1]+d[1]))];if(media.matches||bench.classList.contains('scene-paused'))player=[...destination];draw();wake(); }
    if(e.key==='Enter'||e.key===' '){e.preventDefault();primaryAction();}
  });
  document.addEventListener('project-preview-change',e=>select(e.detail.key));
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;wake();},{threshold:.1}).observe(canvas);
  new MutationObserver(wake).observe(bench,{attributes:true,attributeFilter:['class']});
  new MutationObserver(wake).observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',wake);media.addEventListener('change',()=>{draw();wake();});
  select(bench.dataset.activeProject||'arena');resize();
})();
