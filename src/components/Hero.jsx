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

/* Kurva easing seragam untuk seluruh hero, terasa punya bobot dan tidak
 * terburu buru. */
const EASE = [0.22, 1, 0.36, 1];

/* Varian animasi masuk. Semuanya fade lembut dengan sedikit gerak naik.
 * Waktunya dirancang seperti perkenalan diri:
 *   1. "Hello, I am" muncul lebih dulu.
 *   2. "Darren Vincent" menyusul sesaat kemudian.
 *   3. Pernyataan utama muncul lebih lambat dan lebih anggun, tiap barisnya
 *      berurutan.
 *   4. Navigasi muncul paling akhir. */
const intro = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.2 } },
};
const name = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.6 } },
};
const statementGroup = {
  hidden: {},
  show: { transition: { delayChildren: 1.35, staggerChildren: 0.22 } },
};
const statementLine = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 1.05, ease: EASE } },
};
const nav = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 2.4 } },
};

export default function Hero() {
  return (
    <RobotGazeProvider>
      <HeroContent />
    </RobotGazeProvider>
  );
}

function HeroContent() {
  const [s1, s2, s3] = profile.heroStatement;
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

      {/* ================= TEKS (fokus utama) ================= */}
      <div className="relative z-30 flex flex-1 items-center justify-center px-6 pt-20 lg:px-10">
        <div className="w-full text-center">
          {/* 1. Sapaan kecil dan tenang */}
          <motion.p
            variants={intro}
            initial="hidden"
            animate="show"
            className="mb-4 font-mono text-xs tracking-[0.32em] text-white/40 uppercase sm:text-[0.8rem]"
          >
            {profile.heroIntro}
          </motion.p>

          {/* 2. Nama, personal dan menonjol */}
          <motion.p
            variants={name}
            initial="hidden"
            animate="show"
            className="mb-9 font-display font-light tracking-[-0.01em] text-white/90 sm:mb-10"
            style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.35rem)', lineHeight: 1.1 }}
          >
            {profile.name}
          </motion.p>

          {/* 3. Pernyataan utama, elemen visual terkuat. Tiap baris muncul
                berurutan dengan transisi yang lebih lambat dan anggun. */}
          <motion.h1
            variants={statementGroup}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-[20ch] font-display font-light tracking-[-0.025em] text-balance text-white"
            style={{ fontSize: 'clamp(2.1rem, 6vw, 4.4rem)', lineHeight: 1.06 }}
          >
            <motion.span variants={statementLine} className="block">
              {s1}
            </motion.span>
            <motion.span variants={statementLine} className="block">
              {s2}
            </motion.span>
            <motion.span variants={statementLine} className="block text-white/55">
              {s3}
            </motion.span>
          </motion.h1>

          {/* 4. Navigasi bernomor, muncul paling akhir */}
          <motion.nav
            aria-label="Navigasi utama"
            variants={nav}
            initial="hidden"
            animate="show"
            className="mt-11"
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
          transition={{ duration: 1.1, delay: 1, ease: EASE }}
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
          gundukan tanah dan kabut permukaan. */}
      <HorizonForeground />
    </section>
  );
}
