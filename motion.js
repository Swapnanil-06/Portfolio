// Only animate project illustrations while they are on screen.
const coverObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('motion-visible', entry.isIntersecting));
}, {threshold: 0.15});
document.querySelectorAll('.project-cover').forEach(cover => coverObserver.observe(cover));
document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('motion-background', document.hidden);
});
