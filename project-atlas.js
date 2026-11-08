(() => {
  const dialog = document.getElementById('project-studio-dialog');
  const overview = document.querySelector('.project-workbench');
  let returnFocus, closing = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const illustrations = {
    replay: '<path class="thumb-grid" d="M25 80H195 M25 24V80"/><path class="thumb-signal" d="m30 65 32-13 32 8 32-27 30 8 32-19"/><path class="thumb-mark" d="m30 65 32-13 32 8 32-11 30 8 32-5"/><circle class="thumb-beacon" cx="126" cy="33" r="5"/><path class="thumb-mark" d="M82 19a20 20 0 1 0 0 40 M82 19v12H70"/>',
    arena: '<path class="thumb-grid" d="M27 57 110 16 193 57 110 98Z M55 43 138 84 M83 29 166 70 M55 71 138 30 M83 85 166 44"/><g class="thumb-float"><path class="thumb-top" d="m65 41 22-11 22 11-22 11Z"/><path class="thumb-side" d="m65 41 22 11v22L65 63Z"/><path class="thumb-face" d="m87 52 22-11v22L87 74Z"/></g><path class="thumb-top" d="m121 58 26-13 22 11-26 13Z"/><path class="thumb-side" d="m121 58 22 11v13l-22-11Z"/><path class="thumb-face" d="m143 69 26-13v13l-26 13Z"/><circle class="thumb-beacon" cx="114" cy="68" r="4"/>',
    placement: '<path class="thumb-grid" d="M37 14h146v76H37Z M37 39h146 M37 64h146 M73 14v76 M110 14v76 M147 14v76"/><path class="thumb-signal" d="M52 27H93V52H164V78H126"/><rect class="thumb-block" x="43" y="20" width="26" height="32" rx="2"/><rect class="thumb-block alt" x="79" y="20" width="59" height="16" rx="2"/><rect class="thumb-block" x="148" y="20" width="27" height="43" rx="2"/><rect class="thumb-block" x="43" y="62" width="48" height="20" rx="2"/><rect class="thumb-copper thumb-float" x="102" y="47" width="32" height="35" rx="2"/>',
    agent: '<path class="thumb-signal" d="M38 50H182 M110 50V78H164V50"/><rect class="thumb-unit" x="13" y="34" width="48" height="32" rx="5"/><rect class="thumb-unit focus" x="86" y="24" width="48" height="52" rx="5"/><rect class="thumb-unit" x="159" y="34" width="48" height="32" rx="5"/><circle class="thumb-beacon" cx="110" cy="50" r="6"/><path class="thumb-mark" d="m31 44 7 6-7 6 M175 44h15 M175 50h10 M175 56h13"/>',
    network: '<path class="thumb-grid" d="m24 65 50-41 34 49 53-55 34 52 M24 65l84 8 87-3 M74 24l87-6"/><path class="thumb-signal" d="m24 65 50-41 34 49 87-3-34-52"/>'+[[24,65],[74,24],[108,73],[161,18],[195,70]].map(([x,y])=>`<circle class="thumb-node" cx="${x}" cy="${y}" r="7"/>`).join(''),
    credit: '<path class="thumb-grid" d="M24 84H199"/>'+Array.from({length:12},(_,i)=>`<rect class="${i>7?'thumb-copper':'thumb-block'}" x="${29+i*14}" y="${77-[13,19,24,30,41,49,62,54,66,46,35,19][i]}" width="9" height="${[13,19,24,30,41,49,62,54,66,46,35,19][i]}" rx="1"/>`).join(''),
    riscv: '<path class="thumb-signal" d="M30 50H192 M51 68V85H169V68"/>'+[20,72,124,176].map((x,i)=>`<rect class="thumb-unit${i===2?' focus':''}" x="${x}" y="32" width="29" height="36" rx="3"/>`).join('')+'<path class="thumb-mark" d="M131 43h15 M131 50h15 M131 57h15"/>',
    mac: '<path class="thumb-signal" d="m30 26 49 35 31 24 31-24 49-35 M81 26l-2 35 M139 26l2 35"/>'+[20,71,129,180].map(x=>`<rect class="thumb-unit" x="${x}" y="16" width="22" height="22" rx="3"/>`).join('')+'<circle class="thumb-beacon" cx="110" cy="85" r="7"/>'
  };
  function updateOverview() {
    projectRoutes[projectRoute].forEach((key,i) => {
      const thumb = projectRows[i].querySelector('.atlas-thumbnail');
      if(thumb.dataset.project!==key) {
        thumb.innerHTML = '<svg viewBox="0 0 220 106" focusable="false">'+illustrations[key]+'</svg>';
        thumb.dataset.project = key;
      }
    });
    overview.querySelectorAll('.atlas-connections path').forEach((path,i)=>path.classList.toggle('selected',i===projectIndex));
  }
  document.addEventListener('project-preview-change',updateOverview);
  document.addEventListener('open-project-studio',event => {
    returnFocus = event.detail.trigger;
    if(!dialog.open) {
      dialog.showModal();
      document.body.classList.add('studio-open');
      document.getElementById('close-project-studio').focus();
    }
  });
  function closeStudio() {
    if(closing||!dialog.open)return;
    closing=true;
    const finish=()=>{dialog.close();closing=false;};
    if(reduced.matches)finish();
    else dialog.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(12px) scale(.985)'}],{duration:150,easing:'ease-in'}).finished.then(finish,finish);
  }
  document.getElementById('close-project-studio').onclick=closeStudio;
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeStudio();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('studio-open');returnFocus?.focus();});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeStudio();});
  document.getElementById('atlas-playback').onclick=()=>document.getElementById('project-playback').click();
  updateOverview();
})();
