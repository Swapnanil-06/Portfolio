(() => {
  const panel = document.getElementById('portfolio-chat');
  const messages = document.getElementById('chat-messages');
  const form = document.getElementById('chat-composer');
  const input = document.getElementById('chat-message-input');
  const send = document.getElementById('chat-send');
  const status = document.getElementById('chat-request-status');
  let clientPromise, busy = false, resizeFrame;

  function fitPanel() {
    const viewport = window.visualViewport;
    const width = viewport?.width || window.innerWidth;
    const height = viewport?.height || window.innerHeight;
    const left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
    const keyboard = height < window.innerHeight - 140 || height < 500;
    const margin = width <= 600 || keyboard ? 10 : 24;
    const bottom = keyboard ? 10 : width <= 600 ? 80 : 90;
    const panelWidth = Math.max(0, Math.min(width - margin * 2, width <= 600 ? width : 460));
    const panelHeight = Math.max(0, Math.min(740, height - bottom - 10));
    Object.assign(panel.style, {
      width: panelWidth + 'px', height: panelHeight + 'px',
      left: (left + width - margin - panelWidth) + 'px',
      top: (top + height - bottom - panelHeight) + 'px', right: 'auto', bottom: 'auto'
    });
    panel.classList.toggle('chat-compact', keyboard || panelHeight < 440);
    growInput();
  }
  function scheduleFit() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(fitPanel);
  }
  function growInput() {
    const max = Math.max(44, Math.min(100, panel.clientHeight * .24));
    input.style.height = 'auto';
    input.style.height = Math.min(max, Math.max(44, input.scrollHeight + 2)) + 'px';
    input.style.overflowY = input.scrollHeight > max ? 'auto' : 'hidden';
    send.disabled = busy || !input.value.trim();
  }
  function appendInline(parent, text) {
    const pattern = /\*\*(.+?)\*\*|`([^`]+)`/g;
    let offset = 0;
    for (const match of text.matchAll(pattern)) {
      parent.append(document.createTextNode(text.slice(offset, match.index)));
      const element = document.createElement(match[1] ? 'strong' : 'code');
      element.textContent = match[1] || match[2];
      parent.append(element);
      offset = match.index + match[0].length;
    }
    parent.append(document.createTextNode(text.slice(offset)));
  }
  function addMessage(role, text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-message ' + role;
    const label = document.createElement('span');
    label.className = 'chat-message-label';
    label.textContent = role === 'user' ? 'You' : 'AI assistant';
    const content = document.createElement('div');
    content.className = 'chat-message-content';
    // Text-only DOM construction: responses never become executable HTML.
    let list;
    text.split('\n').forEach(line => {
      const item = line.match(/^\s*(?:[-*]|\d+[.)])\s+(.+)$/);
      if (item) {
        if (!list) { list = document.createElement('ul'); content.append(list); }
        const li = document.createElement('li'); appendInline(li, item[1]); list.append(li);
      } else {
        list = null;
        if (line.trim()) { const p = document.createElement('p'); appendInline(p, line); content.append(p); }
      }
    });
    bubble.append(label, content);
    messages.append(bubble);
    messages.scrollTop = messages.scrollHeight;
  }
  async function getClient() {
    if (!clientPromise) {
      clientPromise = import('./assets/gradio-client-2.7.2.js')
        .then(({Client}) => Client.connect('https://swap-069-agentic-ai-agent.hf.space'))
        .catch(error => { clientPromise = undefined; throw error; });
    }
    return clientPromise;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message || busy) return;
    busy = true;
    addMessage('user', message);
    input.value = '';
    growInput();
    status.classList.remove('is-error');
    status.textContent = 'Connecting to the assistant…';
    messages.setAttribute('aria-busy', 'true');
    let timeout, submission;
    try {
      const client = await getClient();
      status.textContent = 'Thinking…';
      // Reuse one official client instance so Gradio retains conversation state.
      submission = client.submit('/chat', {message});
      timeout = setTimeout(() => submission.cancel(), 60000);
      let reply;
      for await (const result of submission) {
        if (result.type === 'data') reply = result.data?.[0];
      }
      if (typeof reply !== 'string' || !reply.trim()) throw new Error('No reply returned');
      addMessage('assistant', reply);
      status.textContent = '';
    } catch {
      status.textContent = 'Couldn’t reach the assistant. Try again, or open Hugging Face above.';
      status.classList.add('is-error');
      if (!input.value) input.value = message;
    } finally {
      clearTimeout(timeout);
      busy = false;
      messages.setAttribute('aria-busy', 'false');
      growInput();
    }
  });
  input.addEventListener('input', growInput);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      if (!send.disabled) form.requestSubmit();
    }
  });
  input.addEventListener('focus', scheduleFit);
  input.addEventListener('blur', scheduleFit);
  window.addEventListener('resize', scheduleFit);
  window.visualViewport?.addEventListener('resize', scheduleFit);
  window.visualViewport?.addEventListener('scroll', scheduleFit);
  document.addEventListener('portfolio-chat-opened', () => {
    fitPanel();
    messages.scrollTop = messages.scrollHeight;
    if (matchMedia('(pointer: fine)').matches) input.focus({preventScroll: true});
  });
  fitPanel();
})();
