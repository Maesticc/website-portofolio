import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { navLinks, profile } from '../data/content';
import PlanetHorizon, {
  DistantPlanet,
  HorizonForeground,
} from './PlanetHorizon';
import { RobotGazeProvider, useGazeAttractor } from './RobotGaze';
import WalleBot from './WalleBot';

/* Empat tujuan utama yang ditawarkan di hero. */
const HERO_LINK_IDS = ['about', 'skills', 'projects', 'contact'];
const HERO_LINKS = HERO_LINK_IDS.map((id) =>
  navLinks.find((l) => l.id === id),
).filter(Boolean);

/** Efek mengetik untuk nama di hero. */
function useTypewriter(text, speed = 92, startDelay = 520) {
  const [shown, setShown] = useState('');

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(text);
      return;
    }

    let i = 0;
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return shown;
}

/* Kurva easing seragam untuk seluruh hero, terasa punya bobot. */
const EASE = [0.32, 0.72, 0, 1];

export default function Hero() {
  return (
    <RobotGazeProvider>
      <HeroContent />
    </RobotGazeProvider>
  );
}

function HeroContent() {
  const typed = useTypewriter(profile.name);
  const [line1, line2] = profile.heroHeadline.split('\n');
  /* Handler yang membuat robot menoleh ke tautan yang sedang disorot. */
  const gazeAttractor = useGazeAttractor();

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden
                 [--bot-h:10rem] [--horizon:20vh]
                 sm:[--bot-h:12rem] sm:[--horizon:24vh]
                 lg:[--bot-h:14.5rem] lg:[--horizon:28vh]"
    >
      {/* ================= LINGKUNGAN ================= */}
      <PlanetHorizon />
      <DistantPlanet />

      {/* ================= TEKS (fokus utama) =================
          Memakai flex-1 dengan min-height otomatis. Kalau ruang vertikal
          sempit, area ini tidak menyusut di bawah tinggi isinya, melainkan
          hero yang memanjang. Jadi teks tidak mungkin bertabrakan dengan
          robot di viewport pendek mana pun. */}
      <div className="relative z-30 flex flex-1 items-center justify-center px-6 pt-20 lg:px-10">
        <div className="w-full text-center">
          {/* Sapaan kecil dengan efek mengetik */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-6 font-mono text-xs tracking-[0.2em] text-white/40 sm:text-[0.8rem]"
          >
            Hi, I&apos;m <span className="text-white/75">{typed}</span>
            <span className="ml-0.5 animate-pulse text-white/35">|</span>
          </motion.p>

          {/* Judul utama. Titik fokus halaman: tidak ada elemen lain yang
              boleh menyaingi kontrasnya. */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="mx-auto max-w-[19ch] font-display font-light tracking-[-0.025em] text-balance text-white"
            style={{
              fontSize: 'clamp(2rem, 5.6vw, 3.9rem)',
              lineHeight: 1.08,
            }}
          >
            <span className="block">{line1}</span>
            <span className="block text-white/55">{line2}</span>
          </motion.h1>

          {/* Penjelas singkat */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.48, ease: EASE }}
            className="mx-auto mt-6 max-w-[46ch] text-sm leading-relaxed text-white/45 sm:text-base"
          >
            {profile.heroSubtitle}
          </motion.p>

          {/* Navigasi bernomor */}
          <motion.nav
            aria-label="Navigasi utama"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.62, ease: EASE }}
            className="mt-8"
          >
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {HERO_LINKS.map((link, i) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    {...gazeAttractor}
                    className="group flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 transition-colors duration-500 ease-out hover:border-white/30 hover:bg-white/[0.04] active:scale-[0.98]"
                  >
                    <span className="font-mono text-[0.64rem] text-white/30 transition-colors duration-500 group-hover:text-white/55">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-white/65 transition-colors duration-500 group-hover:text-white">
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="-ml-1 text-[0.65rem] text-white/0 transition-all duration-500 group-hover:ml-0 group-hover:text-white/45"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>
      </div>

      {/* ================= ZONA ROBOT =================
          Ruang ini ikut perhitungan tata letak (bukan absolut), sehingga
          selalu tersedia untuk robot dan cakrawala. Inilah yang mencegah
          tabrakan dengan teks. */}
      <div
        className="relative z-10 shrink-0"
        style={{ height: 'calc(var(--horizon) + var(--bot-h) - 2.1rem)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.9, ease: EASE }}
          className="absolute inset-x-0 flex justify-center"
          style={{ bottom: 'calc(var(--horizon) - 2.1rem)' }}
        >
          {/* Lebar dihitung dari tinggi: viewBox 320x300, jadi w = h x 1.067 */}
          <div className="translate-x-[7%]" style={{ width: 'calc(var(--bot-h) * 1.067)' }}>
            <WalleBot />
          </div>
        </motion.div>
      </div>

      {/* ================= TANAH TERDEKAT =================
          Digambar di depan robot, sehingga kakinya tertutup sedikit oleh
          gundukan tanah dan kabut permukaan. Itu yang membuat robot terbaca
          berada di dalam lanskap, bukan di depan gambar lanskap. */}
      <HorizonForeground />
    </section>
  );
}
