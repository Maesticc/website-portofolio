import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react';
import { navLinks } from '../data/content';

/* Item yang tampil di pill nav. Home tidak perlu tombol, dan section notes
   tidak dipakai jadi ikut dikeluarkan. */
const HIDDEN = ['home', 'notes'];
const ITEMS = navLinks.filter((l) => !HIDDEN.includes(l.id));

/* Berapa lama harus diam sebelum pill muncul */
const IDLE_DELAY = 650;

/**
 * FloatingNav
 * Pill navigasi yang mengapung di tengah bawah layar dengan aturan:
 *  - Tidak pernah tampil selama pengunjung masih di section home.
 *  - Setelah lewat home, pill muncul ketika pengunjung BERHENTI scroll.
 *  - Pill langsung sembunyi lagi begitu pengunjung melanjutkan scroll.
 *  - Ikut muncul saat menerima fokus keyboard, supaya tetap bisa diakses
 *    tanpa mouse.
 *
 * Deteksi scroll memakai useScroll() dari Motion, bukan
 * window.addEventListener('scroll'), agar tidak memicu reflow terus-menerus.
 */
export default function FloatingNav() {
  const { scrollY } = useScroll();

  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(ITEMS[0]?.id ?? null);

  const pastHero = useRef(false);
  const idleTimer = useRef(null);
  const focused = useRef(false);

  /* Menyalakan pill setelah diam beberapa saat */
  const scheduleReveal = () => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (pastHero.current) setVisible(true);
    }, IDLE_DELAY);
  };

  /* ---- apakah pengunjung sudah melewati section home ---- */
  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isPast = !entry.isIntersecting;
        pastHero.current = isPast;

        if (isPast) {
          scheduleReveal();
        } else {
          // kembali ke home: pill wajib hilang
          clearTimeout(idleTimer.current);
          setVisible(false);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  /* ---- sembunyikan saat scroll, tampilkan saat diam ---- */
  useMotionValueEvent(scrollY, 'change', () => {
    if (!focused.current) setVisible(false);
    scheduleReveal();
  });

  useEffect(() => () => clearTimeout(idleTimer.current), []);

  /* ---- menandai section yang sedang dilihat ---- */
  useEffect(() => {
    const sections = ITEMS.map((l) => document.getElementById(l.id)).filter(
      Boolean,
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (seen) setActive(seen.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.6, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="floating-nav"
          aria-label="Navigasi section"
          initial={{ opacity: 0, y: 22, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.34, ease: [0.32, 0.72, 0, 1] }}
          onFocusCapture={() => {
            focused.current = true;
            setVisible(true);
          }}
          onBlurCapture={() => {
            focused.current = false;
          }}
          className="fixed bottom-5 left-1/2 z-50 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 sm:bottom-6"
        >
          <ul className="glass-panel flex items-center gap-0.5 overflow-x-auto rounded-full px-2 py-2 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.9)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ITEMS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id} className="shrink-0">
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative block rounded-full px-3 py-2 font-mono text-[0.64rem] tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-300 sm:px-4 sm:text-[0.72rem] sm:tracking-[0.12em] ${
                      isActive
                        ? 'text-white'
                        : 'text-white/50 hover:text-white/85'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="floating-nav-active"
                        className="absolute inset-0 rounded-full border border-nebula/45 bg-nebula/20"
                        transition={{
                          type: 'spring',
                          stiffness: 360,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
