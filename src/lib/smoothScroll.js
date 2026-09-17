
function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

let activeAnimation = 0;

export function smoothScrollTo(id, offset = null) {
  const el = document.getElementById(id);
  if (!el) return;

  let topMargin = offset;
  if (topMargin == null) {
    const raw = getComputedStyle(el).scrollMarginTop;
    topMargin = parseFloat(raw) || 0;
  }

  const startY = window.scrollY;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;
  const rawTarget = startY + el.getBoundingClientRect().top - topMargin;
  const targetY = Math.max(0, Math.min(rawTarget, maxScroll));
  const distance = targetY - startY;

  if (history.replaceState) {
    history.replaceState(null, '', `#${id}`);
  }

  if (Math.abs(distance) < 4) {
    window.scrollTo(0, targetY);
    return;
  }

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  const duration = prefersReduced
    ? Math.min(300, Math.max(160, Math.abs(distance) * 0.16))
    : Math.min(1200, Math.max(600, Math.abs(distance) * 0.5));

  const startTime = performance.now();
  const animId = ++activeAnimation; // membatalkan animasi sebelumnya bila ada

  function step(now) {
    if (animId !== activeAnimation) return;

    const elapsed = now - startTime;
    const p = Math.min(1, elapsed / duration);
    const eased = easeInOutQuint(p);
    window.scrollTo(0, startY + distance * eased);

    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      window.scrollTo(0, targetY);
    }
  }

  requestAnimationFrame(step);
}

export function handleNavClick(id, offset = null) {
  return (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    smoothScrollTo(id, offset);
  };
}
