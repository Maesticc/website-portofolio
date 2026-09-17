import { motion, useReducedMotion } from 'motion/react';
import { navLinks, profile } from '../data/content';
import PlanetHorizon, {
  DistantPlanet,
  HorizonForeground,
} from './PlanetHorizon';
import { RobotGazeProvider, useGazeAttractor } from './RobotGaze';
import WalleBot from './WalleBot';
import { handleNavClick } from '../lib/smoothScroll';

const HERO_LINK_IDS = ['about', 'skills', 'projects', 'experience', 'contact'];
const HERO_LINKS = HERO_LINK_IDS.map((id) =>
  navLinks.find((l) => l.id === id),
).filter(Boolean);

const EASE = [0.22, 1, 0.36, 1];

function MaskedLine({ children, delay, className = '', reduce, dir = 'left', accent = false }) {
  if (reduce) {
    return (
      <span className="block overflow-hidden pb-[0.12em]">
        <motion.span
          className={`block ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay * 0.6 }}
        >
          {children}
        </motion.span>
      </span>
    );
  }

  const fromX = dir === 'left' ? -104 : 104;

  const initial = accent
    ? { x: fromX, y: 14, opacity: 0 }
    : { x: fromX, y: 14, opacity: 0, filter: 'blur(4px)' };
  const animate = accent
    ? { x: 0, y: 0, opacity: 1 }
    : { x: 0, y: 0, opacity: 1, filter: 'blur(0px)' };

  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className={`block will-change-transform ${className}`}
        initial={initial}
        animate={animate}
        transition={{ duration: 0.92, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  return (
    <RobotGazeProvider>
      <HeroContent />
    </RobotGazeProvider>
  );
}

function HeroContent() {
  const [s1, s2, s3] = profile.heroStatement;
  const gazeAttractor = useGazeAttractor();
  const reduce = useReducedMotion();

  const t = {
    intro: 0,
    name: 0.14,
    l1: 0.28,
    l2: 0.42,
    l3: 0.56,
    nav: 1.1,
  };

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden
                 [--bot-h:10rem] [--horizon:20vh]
                 sm:[--bot-h:12rem] sm:[--horizon:24vh]
                 lg:[--bot-h:14.5rem] lg:[--horizon:28vh]"
    >
      <PlanetHorizon />
      <DistantPlanet />

      <div className="relative z-30 flex flex-1 items-center justify-center px-6 pt-20 lg:px-10">
        <div className="w-full text-center">
          <motion.p
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 8, letterSpacing: '0.55em', filter: 'blur(4px)' }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 0.42, y: 0, letterSpacing: '0.32em', filter: 'blur(0px)' }
            }
            transition={{ duration: 1, ease: EASE, delay: t.intro }}
            className="mb-5 font-mono text-sm text-white uppercase sm:text-base"
          >
            {profile.heroIntro}
          </motion.p>

          <h2
            className="mb-9 font-display font-light tracking-[-0.01em] text-white/90 sm:mb-10"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.14 }}
          >
            <MaskedLine delay={t.name} reduce={reduce}>
              {profile.name}
            </MaskedLine>
          </h2>

          <h1
            className="mx-auto max-w-[20ch] font-display font-light tracking-[-0.025em] text-balance text-white"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', lineHeight: 1.06 }}
          >
            <MaskedLine delay={t.l1} reduce={reduce}>
              {s1}
            </MaskedLine>
            <MaskedLine delay={t.l2} reduce={reduce}>
              {s2}
            </MaskedLine>
            <MaskedLine
              delay={t.l3}
              reduce={reduce}
              accent
              className="hero-accent"
            >
              {s3}
            </MaskedLine>
          </h1>

          <motion.nav
            aria-label="Navigasi utama"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: t.nav }}
            className="mt-11"
          >
            <ul className="flex flex-wrap items-center justify-center gap-2.5">
              {HERO_LINKS.map((link, i) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={handleNavClick(link.id)}
                    {...gazeAttractor}
                    className="group flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 transition-colors duration-500 ease-out hover:border-white/30 hover:bg-white/[0.04] active:scale-[0.98]"
                  >
                    <span className="font-mono text-sm text-white/30 transition-colors duration-500 group-hover:text-white/55">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-base tracking-[0.1em] uppercase text-white/65 transition-colors duration-500 group-hover:text-white">
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="-ml-1 text-sm text-white/0 transition-all duration-500 group-hover:ml-0 group-hover:text-white/45"
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
          <div className="translate-x-[7%]" style={{ width: 'calc(var(--bot-h) * 1.067)' }}>
            <WalleBot />
          </div>
        </motion.div>
      </div>

      <HorizonForeground />
    </section>
  );
}
