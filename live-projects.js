(() => {
  const spaceUrl = 'https://huggingface.co/spaces/Swap-069/Agentic_AI_Agent';
  const gameUrl = 'https://agent-arena-paintball.vercel.app/';
  const chat = document.getElementById('portfolio-chat');
  const launcher = document.getElementById('chat-launcher');
  const closeChatButton = document.getElementById('close-portfolio-chat');
  const studio = document.getElementById('project-studio-dialog');
  const notes = document.getElementById('project-dialog');
  const stage = document.querySelector('.project-stage');
  let chatOpener = launcher;

  function openChat(trigger = launcher) {
    // Leave native modal layers before opening the modeless hotel-style chat.
    // Their close handlers restore focus first; the chat then takes its turn.
    const topModal = notes.open ? notes : studio.open ? studio : null;
    if (topModal) {
      topModal.addEventListener('close', () => openChat(trigger), {once: true});
      topModal.close();
      return;
    }
    chatOpener = trigger;
    const wasHidden = chat.hidden;
    chat.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    launcher.classList.add('is-open');
    if (wasHidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      chat.animate([{opacity: 0, transform: 'translateY(14px) scale(.98)'}, {opacity: 1, transform: 'none'}], {duration: 220, easing: 'ease-out'});
    }
    closeChatButton.focus({preventScroll: true});
    document.dispatchEvent(new Event('portfolio-chat-opened'));
  }
  function closeChat() {
    chat.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.classList.remove('is-open');
    const target = chatOpener?.isConnected && !chatOpener.closest('dialog:not([open])') ? chatOpener : launcher;
    target.focus({preventScroll: true});
  }
  launcher.onclick = () => chat.hidden ? openChat(launcher) : closeChat();
  closeChatButton.onclick = closeChat;
  chat.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeChat(); }
  });
  document.addEventListener('open-portfolio-chat', event => openChat(event.detail?.trigger || launcher));
  document.addEventListener('open-project-studio', () => { if (!chat.hidden) closeChat(); });

  const gamePanel = document.createElement('div');
  gamePanel.className = 'live-game-panel';
  gamePanel.hidden = true;
  gamePanel.innerHTML = `<div class="live-game-image"><img src="assets/agent-arena-preview.png" alt="The actual Agent Arena paintball game’s start screen" loading="lazy"></div><div class="live-game-copy"><span class="live-game-eyebrow">PLAY THE ORIGINAL</span><h3>Choose your character.<br>Enter the arena.</h3><p>Play the actual Agent Arena paintball build from our OpenAI DevDay Community Hackathon project.</p><a class="live-game-launch" href="${gameUrl}" target="_blank" rel="noopener noreferrer">Play the game <span>↗</span></a><small>Opens in a new tab for the full game.</small><button class="live-game-notes">Project &amp; build notes ↗</button></div>`;
  stage.append(gamePanel);
  gamePanel.querySelector('.live-game-notes').onclick = event => openDeskItem('arena', event.currentTarget);

  function updateLiveProjects() {
    const active = document.querySelector('.project-workbench').dataset.activeProject;
    const liveGame = active === 'arena';
    stage.classList.toggle('has-live-game', liveGame);
    gamePanel.hidden = !liveGame;
    if (liveGame) studio.setAttribute('aria-label', 'Agent Arena — play the original game');
    else studio.removeAttribute('aria-label');
    projectRoutes[projectRoute].forEach((key, i) => {
      const button = projectRows[i].querySelector('[data-project-preview]');
      const text = key === 'agent' ? 'Chat with me' : key === 'arena' ? 'Play Agent Arena' : 'Try interactive demo';
      button.querySelector('span').textContent = text;
      button.setAttribute('aria-label', key === 'agent' ? 'Chat with Swapnanil’s AI assistant' : key === 'arena' ? 'Play the real Agent Arena game' : 'Try ' + deskItems[key].title + ' interactive demo');
      button.setAttribute('aria-controls', key === 'agent' ? 'portfolio-chat' : 'project-studio-dialog');
    });
  }
  document.addEventListener('project-preview-change', updateLiveProjects);
  updateLiveProjects();
})();
