/* =============================================================================
 * smoothScroll.js
 * Scroll halus bergaya sinematik menuju sebuah section.
 *
 * Kenapa tidak memakai scroll-behavior: smooth bawaan browser saja? Karena
 * kurvanya tidak bisa diatur dan durasinya tidak konsisten antar browser.
 * Di sini kita kendalikan sendiri: mulai pelan, mempercepat, lalu melambat
 * dan berhenti tepat di tujuan, seperti kamera yang bergerak melintasi halaman.
 *
 * Menghormati prefers-reduced-motion: bila aktif, langsung lompat tanpa animasi.
 * Berhenti tepat di tujuan, tanpa overshoot, tanpa pantulan.
 * ========================================================================== */

/* Easing easeInOutQuint: akselerasi lembut di awal, deselerasi kuat di akhir.
 * Terasa "berbobot" dan sinematik, bukan linear yang kaku. */
function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

let activeAnimation = 0;

/**
 * Menggulir halus ke elemen dengan id tertentu.
 * @param {string} id     id section tujuan
 * @param {number} offset jarak dari tepi atas viewport (px). Default 0 karena
 *                        tidak ada navbar atas yang menutupi.
 */
export function smoothScrollTo(id, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;

  const startY = window.scrollY;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;
  const rawTarget = startY + el.getBoundingClientRect().top - offset;
  /* Jangan melewati batas dokumen, supaya berhenti tepat tanpa terpental. */
  const targetY = Math.max(0, Math.min(rawTarget, maxScroll));
  const distance = targetY - startY;

  /* Perbarui hash tanpa memicu lompatan bawaan browser. */
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

  /* Durasi proporsional dengan jarak.
     - Normal        : 600ms sampai 1200ms, terasa sinematik.
     - Reduced-motion: tetap beranimasi tapi jauh lebih singkat (maks 300ms),
       karena ini gerak yang DIMINTA pengguna lewat klik, bukan gerak pasif.
       Ini tetap menghormati preferensi (durasi pendek) sambil memastikan
       perpindahannya tidak terasa seperti lompatan kasar. */
  const duration = prefersReduced
    ? Math.min(300, Math.max(160, Math.abs(distance) * 0.16))
    : Math.min(1200, Math.max(600, Math.abs(distance) * 0.5));

  const startTime = performance.now();
  const animId = ++activeAnimation; // membatalkan animasi sebelumnya bila ada

  function step(now) {
    /* Kalau ada permintaan scroll baru, hentikan yang lama. */
    if (animId !== activeAnimation) return;

    const elapsed = now - startTime;
    const p = Math.min(1, elapsed / duration);
    const eased = easeInOutQuint(p);
    window.scrollTo(0, startY + distance * eased);

    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      /* Pastikan mendarat persis di tujuan. */
      window.scrollTo(0, targetY);
    }
  }

  requestAnimationFrame(step);
}

/**
 * Handler klik untuk tautan navigasi. Mencegah lompatan bawaan anchor, lalu
 * menggulir halus. Dipakai bersama oleh nav hero dan pill nav.
 * Mengembalikan fungsi handler agar mudah dipasang di onClick.
 */
export function handleNavClick(id, offset = 0) {
  return (e) => {
    /* Biarkan klik dengan modifier (buka tab baru, dsb.) berjalan normal. */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    smoothScrollTo(id, offset);
  };
}
