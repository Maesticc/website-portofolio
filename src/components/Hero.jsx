import { motion, useReducedMotion } from 'motion/react';
import { navLinks, profile } from '../data/content';
import PlanetHorizon, {
  DistantPlanet,
  HorizonForeground,
} from './PlanetHorizon';
import { RobotGazeProvider, useGazeAttractor } from './RobotGaze';
import WalleBot from './WalleBot';

/* Tujuan utama yang ditawarkan di hero. */
const HERO_LINK_IDS = ['about', 'skills', 'projects', 'experience', 'contact'];
const HERO_LINKS = HERO_LINK_IDS.map((id) =>
  navLinks.find((l) => l.id === id),
).filter(Boolean);

/* Kurva easing sinematik, dipakai seragam di seluruh hero. */
const EASE = [0.22, 1, 0.36, 1];

/**
 * MaskedLine
 * Satu baris teks yang tersingkap dari balik mask.
 *
 * Teks berada di dalam wadah overflow-hidden. Pada keadaan awal, teks digeser
 * turun sejauh tingginya sendiri sehingga tersembunyi di bawah garis potong
 * mask, sekaligus sedikit buram. Saat tampil, teks meluncur naik ke tempatnya
 * dan menjadi tajam. Inilah reveal bertopeng yang diminta, bukan sekadar fade.
 *
 * Menerima delay agar tiap baris bisa disusun berurutan.
 */
/**
 * MaskedLine
 * Satu baris teks yang MASUK ke layar melalui sebuah mask, seolah tipografi
 * itu berjalan menuju tempatnya lalu berhenti.
 *
 * Wadah luar memakai overflow-hidden, jadi selama bergerak teks yang masih di
 * luar posisinya tidak terlihat, hanya tampak melintas melalui celah mask.
 * Geser awal memakai satuan piksel (bukan persen) supaya teks benar benar
 * berada di luar area terpotong, memberi kesan perjalanan yang tegas.
 *
 * dir menentukan arah masuk: 'left' datang dari kiri, 'right' dari kanan.
 * Gerak horizontal kuat (sekitar 100px) dipadu gerak vertikal sangat halus.
 * Easing sinematik dengan deselerasi kuat, tanpa pantulan. Setelah selesai,
 * teks diam total: nilai animate adalah keadaan akhir yang bertahan.
 */
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

  /* Baris beraksen memakai background-clip: text. Menganimasikan filter blur
     pada elemen yang sama akan mematahkan clipping itu dan membuat teksnya
     tampak hilang, jadi untuk baris aksen blur dilewati. */
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

  /* Jadwal masuk. Tiap elemen mulai sekitar 140ms setelah yang sebelumnya.
       Seluruh rangkaian selesai sekitar 1,3 detik (baris terakhir mulai
       0,56s, durasi 0,92s). */
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
      {/* ================= LINGKUNGAN ================= */}
      <PlanetHorizon />
      <DistantPlanet />

      {/* ================= TEKS (fokus utama) ================= */}
      <div className="relative z-30 flex flex-1 items-center justify-center px-6 pt-20 lg:px-10">
        <div className="w-full text-center">
          {/* 1. Intro: letter-spacing menyempit, buram menjadi tajam,
                posisi turun menyettel ke tempatnya. */}
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
            className="mb-4 font-mono text-xs text-white uppercase sm:text-[0.8rem]"
          >
            {profile.heroIntro}
          </motion.p>

          {/* 2. Nama: reveal bertopeng, meluncur naik dari balik mask. */}
          <h2
            className="mb-9 font-display font-light tracking-[-0.01em] text-white/90 sm:mb-10"
            style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.35rem)', lineHeight: 1.14 }}
          >
            <MaskedLine delay={t.name} reduce={reduce}>
              {profile.name}
            </MaskedLine>
          </h2>

          {/* 3. Headline: tiap baris tersingkap terpisah dari balik mask.
                Baris ketiga memakai aksen cahaya yang bergerak lambat. */}
          <h1
            className="mx-auto max-w-[20ch] font-display font-light tracking-[-0.025em] text-balance text-white"
            style={{ fontSize: 'clamp(2.1rem, 6vw, 4.4rem)', lineHeight: 1.06 }}
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

          {/* 4. Navigasi: muncul paling akhir dengan fade lembut. */}
          <motion.nav
            aria-label="Navigasi utama"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: t.nav }}
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
          selalu tersedia untuk robot dan cakrawala, dan mencegah tabrakan
          dengan teks. */}
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
