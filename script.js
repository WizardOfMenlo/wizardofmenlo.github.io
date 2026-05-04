const revealItems = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll('[data-section]');
const copyButton = document.querySelector('[data-copy]');
const yearNode = document.getElementById('year');
const detailCards = document.querySelectorAll('details');


const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  {
    threshold: 0.45,
    rootMargin: '-20% 0px -45% 0px',
  }
);

sections.forEach((section) => sectionObserver.observe(section));

if (copyButton) {
  const defaultLabel = copyButton.textContent.trim();
  copyButton.addEventListener('click', async () => {
    const value = copyButton.getAttribute('data-copy');
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      copyButton.textContent = 'Copied';
      window.setTimeout(() => {
        copyButton.textContent = defaultLabel;
      }, 1600);
    } catch (error) {
      copyButton.textContent = value;
      window.setTimeout(() => {
        copyButton.textContent = defaultLabel;
      }, 1800);
    }
  });
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const syncDetailLabel = (card) => {
  const label = card.querySelector('[data-toggle-label]');
  if (!label) return;
  label.textContent = card.open ? 'Close' : 'Open';
};

detailCards.forEach((card) => {
  syncDetailLabel(card);
  card.addEventListener('toggle', () => syncDetailLabel(card));
});

const openHashTarget = () => {
  const hash = window.location.hash;
  if (!hash || hash === '#') return;

  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;

  let card = target.matches('details') ? target : target.closest('details');
  let opened = false;

  while (card) {
    if (!card.open) {
      card.open = true;
      syncDetailLabel(card);
      opened = true;
    }
    card = card.parentElement ? card.parentElement.closest('details') : null;
  }

  if (opened) {
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start' });
    });
  }
};

if (window.renderMathInElement) {
  window.renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\begin{equation}', right: '\\end{equation}', display: true },
      { left: '\\begin{equation*}', right: '\\end{equation*}', display: true },
      { left: '\\begin{align}', right: '\\end{align}', display: true },
      { left: '\\begin{align*}', right: '\\end{align*}', display: true },
      { left: '\\begin{alignat}', right: '\\end{alignat}', display: true },
      { left: '\\begin{gather}', right: '\\end{gather}', display: true },
      { left: '\\begin{CD}', right: '\\end{CD}', display: true },
    ],
    throwOnError: false,
  });
}

openHashTarget();

window.addEventListener('hashchange', openHashTarget);
window.addEventListener('load', openHashTarget);
