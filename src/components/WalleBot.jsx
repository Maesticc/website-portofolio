import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { profile } from '../data/content';
import { useRobotGaze } from './RobotGaze';

/**
 * WalleBot
 * Maskot robot penjelajah. Desainnya orisinal; yang dipinjam hanya wataknya:
 * penasaran, bersahabat, dan suka menjelajah.
 *
 * Kepribadiannya dibangun dari perilaku, bukan dari gerakan berlebihan:
 *  - Mengamati pengguna. Mata dan kepala mengikuti kursor secara halus.
 *  - Penasaran pada navigasi. Saat sebuah tautan disorot, robot menoleh ke
 *    arah tautan itu, mendongak sedikit, lalu berkedip sekali seolah
 *    menyadari sesuatu.
 *  - Punya kehidupan saat menganggur. Bila kursor berhenti, robot memandang
 *    sekeliling perlahan dan sesekali melirik ke arah acak.
 *
 * Yang sengaja TIDAK dilakukan: memantul terus, berputar, bergetar, atau
 * mengejar kursor secara agresif. Kepala hanya bergerak dalam rentang enam
 * derajat, dan seluruh gerak dilewatkan spring supaya terasa punya bobot.
 *
 * Kinerja:
 *  - Gerak memakai motion value, jadi nol render ulang React saat kursor bergerak.
 *  - Listener pointer hanya satu untuk seluruh halaman, dikelola RobotGaze.
 *  - Loop animasi berhenti total saat robot keluar layar atau tab tidak aktif.
 *  - Pembacaan getBoundingClientRect dibatasi empat kali per detik.
 *  - prefers-reduced-motion mematikan seluruh gerak; robot tetap bisa disapa.
 */

const clamp1 = (v) => (v < -1 ? -1 : v > 1 ? 1 : v);
const rand = (min, max) => min + Math.random() * (max - min);

/* Ambang waktu sebelum robot dianggap menganggur. */
const IDLE_AFTER = 2600;
/* Jarak minimal antar kedipan reaksi, supaya tidak berkedip beruntun. */
const BLINK_COOLDOWN = 900;

export default function WalleBot() {
  const rootRef = useRef(null);
  const gaze = useRobotGaze();

  /* ---- nilai gerak dasar ---- */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const curiosity = useMotionValue(0);

  const sx = useSpring(px, { stiffness: 90, damping: 17, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 90, damping: 17, mass: 0.7 });
  const sCurious = useSpring(curiosity, { stiffness: 120, damping: 20 });

  /* ---- turunan gerak, semuanya dalam rentang kecil ---- */
  const pupilX = useTransform(sx, [-1, 1], [-8, 8]);
  const pupilY = useTransform(sy, [-1, 1], [-6, 6]);
  const glintX = useTransform(sx, [-1, 1], [-6, 6]);
  const glintY = useTransform(sy, [-1, 1], [-4, 4]);
  const headTilt = useTransform(sx, [-1, 1], [6, -6]);
  const bodyShift = useTransform(sx, [-1, 1], [-4, 4]);

  /* Saat penasaran, kepala terangkat sedikit. Itu saja bedanya. */
  const headLiftBase = useTransform(sy, [-1, 1], [-3, 3]);
  const headLiftCurious = useTransform(sCurious, [0, 1], [0, -2.5]);
  const headLift = useTransform(
    [headLiftBase, headLiftCurious],
    ([a, b]) => a + b,
  );

  const [blink, setBlink] = useState(false);
  const [quoteShown, setQuoteShown] = useState(false);
  const [waving, setWaving] = useState(false);
  const [active, setActive] = useState(false);

  const waveTimer = useRef(null);
  const blinkTimer = useRef(null);
  const quoteTimer = useRef(null);
  const lastBlinkAt = useRef(0);
  const activeRef = useRef(false);

  /* Kutipan tetap, ditampilkan sebagai dua baris. */
  const quoteLines = profile.robotQuote ?? ['The universe is vast.'];

  /* ---------- kedip, dipakai baik berkala maupun sebagai reaksi ---------- */
  const triggerBlink = useCallback((now) => {
    const t = now ?? performance.now();
    if (t - lastBlinkAt.current < BLINK_COOLDOWN) return;
    lastBlinkAt.current = t;
    setBlink(true);
    setTimeout(() => setBlink(false), 150);
  }, []);

  /* ---------- robot hanya hidup saat terlihat ---------- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
        setActive(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );
    observer.observe(el);

    const onVisibility = () => {
      const on = !document.hidden && activeRef.current;
      setActive(on);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  /* ---------- arah pandang: attractor, kursor, atau menganggur ---------- */
  useEffect(() => {
    if (!active || !gaze) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let running = true;

    /* Rect robot di-cache. Membacanya tiap frame memicu perhitungan tata
       letak berulang, jadi dibatasi empat kali per detik. */
    let rect = null;
    let rectAt = 0;

    /* Keadaan perilaku menganggur */
    let glanceUntil = 0;
    let glanceX = 0;
    let glanceY = 0;
    let nextGlanceAt = performance.now() + rand(2600, 5200);
    let seenEpoch = gaze.attractorEpoch.current;

    const tick = (t) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);

      const el = rootRef.current;
      if (!el) return;

      if (!rect || t - rectAt > 250) {
        rect = el.getBoundingClientRect();
        rectAt = t;
      }

      const headX = rect.left + rect.width / 2;
      const headY = rect.top + rect.height * 0.22;

      const attractor = gaze.attractor.current;

      /* Attractor baru muncul atau berganti: berkedip sekali sebagai tanda
         menyadari. Ini reaksi diskret, bukan animasi berulang. */
      if (gaze.attractorEpoch.current !== seenEpoch) {
        seenEpoch = gaze.attractorEpoch.current;
        if (attractor) triggerBlink(t);
      }

      curiosity.set(attractor ? 1 : 0);

      const pointer = gaze.pointer.current;
      const idle =
        !attractor &&
        (pointer.x === null || t - gaze.lastPointerAt.current > IDLE_AFTER);

      if (idle) {
        /* Memandang sekeliling perlahan. Dua sinus dengan periode berbeda
           agar polanya tidak terasa berulang. Amplitudonya kecil. */
        const wanderX = Math.sin(t / 4300) * 0.17;
        const wanderY = Math.sin(t / 6700) * 0.09;

        if (t > nextGlanceAt) {
          glanceX = rand(-0.62, 0.62);
          glanceY = rand(-0.42, 0.2);
          glanceUntil = t + rand(1100, 2000);
          nextGlanceAt = t + rand(4200, 8200);
        }

        const inGlance = t < glanceUntil;
        px.set(clamp1(wanderX + (inGlance ? glanceX * 0.62 : 0)));
        py.set(clamp1(wanderY + (inGlance ? glanceY * 0.62 : 0)));
        return;
      }

      const targetX = attractor ? attractor.x : pointer.x;
      const targetY = attractor ? attractor.y : pointer.y;
      if (targetX === null || targetY === null) return;

      /* Saat menoleh ke navigasi, pandangannya sedikit lebih tegas daripada
         saat sekadar mengikuti kursor. Bedanya tipis. */
      const gain = attractor ? 1.18 : 1;

      px.set(clamp1(((targetX - headX) / (window.innerWidth / 2)) * gain));
      py.set(clamp1(((targetY - headY) / (window.innerHeight / 2)) * gain));
    };

    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [active, gaze, px, py, curiosity, triggerBlink]);

  /* ---------- kedip berkala ---------- */
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const loop = () => {
      blinkTimer.current = setTimeout(
        () => {
          triggerBlink();
          loop();
        },
        rand(3400, 7600),
      );
    };
    loop();
    return () => clearTimeout(blinkTimer.current);
  }, [active, triggerBlink]);

  const wave = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setWaving(true);
    clearTimeout(waveTimer.current);
    waveTimer.current = setTimeout(() => setWaving(false), 1500);
  }, []);

  /* Kutipan muncul sekali, sesaat setelah robot terlihat, lalu tetap ada.
     Tidak berganti dan tidak hilang-timbul, supaya tidak mengganggu. Robot
     melambai sekali saat kutipan muncul, sebagai sapaan pembuka. */
  useEffect(() => {
    if (!active || quoteShown) return;
    quoteTimer.current = setTimeout(() => {
      setQuoteShown(true);
      wave();
    }, 2600);
    return () => clearTimeout(quoteTimer.current);
  }, [active, quoteShown, wave]);

  useEffect(
    () => () => {
      clearTimeout(waveTimer.current);
      clearTimeout(blinkTimer.current);
      clearTimeout(quoteTimer.current);
    },
    [],
  );

  /* Saat robot disentuh, ia melambai dan berkedip. Kutipan dipastikan
     tampil, tetapi tidak pernah disembunyikan lalu dimunculkan lagi. */
  const handleInteract = () => {
    setQuoteShown(true);
    wave();
    triggerBlink();
  };

  return (
    <div ref={rootRef} className="relative flex w-full flex-col items-center">
      {/* ---------- Gelembung kutipan robot ----------
          Kutipan tetap dua baris. Terasa seperti robot berbicara langsung
          kepada pengunjung, bukan gelembung chatbot. Muncul sekali dengan
          fade lembut lalu tetap ada. */}
      <motion.div
        initial={false}
        animate={
          quoteShown
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 8 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-2 z-20 w-max max-w-[17rem] -translate-y-full"
      >
        <div
          className="relative rounded-2xl px-4 py-3 text-center"
          style={{
            background: 'rgba(11,15,24,0.78)',
            border: '1px solid rgba(168,196,240,0.14)',
            boxShadow: '0 16px 38px -18px rgba(0,0,0,0.92)',
            backdropFilter: 'blur(2px)',
          }}
        >
          {quoteLines.map((line, i) => (
            <span
              key={i}
              className={`block font-mono text-[0.78rem] leading-relaxed ${
                i === 0 ? 'text-white/60' : 'text-white/90'
              }`}
            >
              {line}
            </span>
          ))}
          {/* ekor gelembung */}
          <span
            className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45"
            style={{
              background: 'rgba(11,15,24,0.78)',
              borderRight: '1px solid rgba(168,196,240,0.14)',
              borderBottom: '1px solid rgba(168,196,240,0.14)',
            }}
          />
        </div>
      </motion.div>

      {/* ---------- Robot ---------- */}
      <motion.button
        type="button"
        onClick={handleInteract}
        aria-label="Sapa robot"
        style={{ x: bodyShift }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="relative w-full cursor-pointer border-0 bg-transparent p-0"
      >
        <RobotSVG
          blink={blink}
          waving={waving}
          pupilX={pupilX}
          pupilY={pupilY}
          glintX={glintX}
          glintY={glintY}
          headTilt={headTilt}
          headLift={headLift}
        />
      </motion.button>
    </div>
  );
}

/* ===========================================================================
 * SVG robot
 * ======================================================================== */
function RobotSVG({
  blink,
  waving,
  pupilX,
  pupilY,
  glintX,
  glintY,
  headTilt,
  headLift,
}) {
  const lugs = Array.from({ length: 9 }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 320 300"
      className="h-auto w-full"
      role="img"
      aria-label="Maskot robot penjelajah bermata teropong"
    >
      <defs>
        {/* Kuning konstruksi yang lapuk, diredam agar cocok dengan cahaya
            temaram ruang angkasa, bukan cahaya studio. */}
        <linearGradient id="wbBody" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#d0a742" />
          <stop offset="0.45" stopColor="#a8801f" />
          <stop offset="1" stopColor="#6b4f11" />
        </linearGradient>
        <linearGradient id="wbBodyTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfb954" />
          <stop offset="1" stopColor="#b28c26" />
        </linearGradient>
        <linearGradient id="wbMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9b0bb" />
          <stop offset="0.5" stopColor="#767d89" />
          <stop offset="1" stopColor="#4d535d" />
        </linearGradient>
        <linearGradient id="wbTread" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#353942" />
          <stop offset="0.5" stopColor="#1e2128" />
          <stop offset="1" stopColor="#101216" />
        </linearGradient>
        <radialGradient id="wbLens" cx="0.42" cy="0.36" r="0.68">
          <stop offset="0" stopColor="#dfecfb" />
          <stop offset="0.28" stopColor="#9dbfe4" />
          <stop offset="0.7" stopColor="#365274" />
          <stop offset="1" stopColor="#121926" />
        </radialGradient>
        <linearGradient id="wbEyeCase" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#aeb5c0" />
          <stop offset="0.5" stopColor="#747b86" />
          <stop offset="1" stopColor="#454b54" />
        </linearGradient>

        {/* Rim light dari kiri, mengikuti arah cahaya lingkungan. */}
        <linearGradient id="wbRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(196,222,255,0.5)" />
          <stop offset="0.12" stopColor="rgba(196,222,255,0.14)" />
          <stop offset="0.4" stopColor="rgba(196,222,255,0)" />
        </linearGradient>

        {/* Sisi bayangan di kanan. */}
        <linearGradient id="wbShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.4" stopColor="rgba(5,8,16,0)" />
          <stop offset="1" stopColor="rgba(5,8,16,0.5)" />
        </linearGradient>

        {/* Ambient occlusion di titik pertemuan dua permukaan. */}
        <linearGradient id="wbAO" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Rim light dari langit. Permukaan atas robot menghadap ke langit,
            jadi menerima cahaya lemah dari seluruh kubah langit. Tanpa ini,
            bagian atas robot akan tampak lebih gelap daripada lingkungannya. */}
        <linearGradient id="wbSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(150,176,220,0.2)" />
          <stop offset="0.24" stopColor="rgba(150,176,220,0.05)" />
          <stop offset="0.6" stopColor="rgba(150,176,220,0)" />
        </linearGradient>

        <filter id="wbShadow" x="-60%" y="-160%" width="220%" height="420%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        {/* Bayangan kontak jauh lebih tajam daripada bayangan lunak */}
        <filter id="wbContact" x="-60%" y="-260%" width="220%" height="620%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="wbGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2" />
        </filter>

        <clipPath id="wbTreadClipL">
          <rect x="4" y="196" width="106" height="66" rx="33" />
        </clipPath>
        <clipPath id="wbTreadClipR">
          <rect x="210" y="196" width="106" height="66" rx="33" />
        </clipPath>
        <clipPath id="wbBodyClip">
          <rect x="86" y="132" width="148" height="112" rx="12" />
        </clipPath>
      </defs>

      {/* ================= BAYANGAN KONTAK =================
          Dua lapis. Yang lebar dan kabur adalah bayangan lunak yang jatuh ke
          kanan menjauhi cahaya. Yang sempit dan pekat adalah bayangan kontak
          tepat di bawah roda, yang memberi kesan bobot dan membuat robot
          terbaca benar benar menekan tanah. */}
      <ellipse
        cx="178"
        cy="264"
        rx="134"
        ry="16"
        fill="rgba(3,5,11,0.72)"
        filter="url(#wbShadow)"
      />
      <ellipse
        cx="162"
        cy="261"
        rx="92"
        ry="7"
        fill="rgba(2,3,8,0.85)"
        filter="url(#wbContact)"
      />

      {/* ================= AMBIENT OCCLUSION DI BAWAH RODA =================
          Celah antara roda dan tanah selalu lebih gelap daripada sekitarnya,
          karena cahaya sekitar tidak sampai ke sana. */}
      <ellipse cx="57" cy="259" rx="52" ry="6" fill="rgba(2,3,8,0.6)" />
      <ellipse cx="263" cy="259" rx="52" ry="6" fill="rgba(2,3,8,0.6)" />

      {/* ================= PUING DI TANAH ================= */}
      <g fill="#0b0d14" opacity="0.9">
        <rect x="18" y="252" width="26" height="9" rx="2" transform="rotate(-5 31 256)" />
        <rect x="272" y="250" width="30" height="10" rx="2" transform="rotate(4 287 255)" />
        <rect x="120" y="258" width="20" height="7" rx="2" transform="rotate(-3 130 261)" />
        <circle cx="60" cy="258" r="5" />
        <circle cx="252" cy="257" r="4" />
      </g>

      {/* ================= RODA TANK KIRI ================= */}
      <g>
        <rect x="4" y="196" width="106" height="66" rx="33" fill="url(#wbTread)" />
        <g clipPath="url(#wbTreadClipL)" opacity="0.5">
          {lugs.map((i) => (
            <rect key={i} x={10 + i * 11.5} y="196" width="5" height="66" fill="#0a0c10" />
          ))}
        </g>
        <rect x="20" y="212" width="74" height="34" rx="17" fill="#484e58" opacity="0.6" />
        <circle cx="34" cy="229" r="11" fill="#272b32" />
        <circle cx="34" cy="229" r="4.5" fill="#7d848f" />
        <circle cx="80" cy="229" r="11" fill="#272b32" />
        <circle cx="80" cy="229" r="4.5" fill="#7d848f" />
        <circle cx="57" cy="229" r="7" fill="#272b32" />
        <rect x="4" y="196" width="106" height="66" rx="33" fill="url(#wbRim)" />
        <rect x="4" y="196" width="106" height="66" rx="33" fill="url(#wbShade)" />
      </g>

      {/* ================= RODA TANK KANAN ================= */}
      <g>
        <rect x="210" y="196" width="106" height="66" rx="33" fill="url(#wbTread)" />
        <g clipPath="url(#wbTreadClipR)" opacity="0.5">
          {lugs.map((i) => (
            <rect key={i} x={216 + i * 11.5} y="196" width="5" height="66" fill="#0a0c10" />
          ))}
        </g>
        <rect x="226" y="212" width="74" height="34" rx="17" fill="#484e58" opacity="0.6" />
        <circle cx="240" cy="229" r="11" fill="#272b32" />
        <circle cx="240" cy="229" r="4.5" fill="#7d848f" />
        <circle cx="286" cy="229" r="11" fill="#272b32" />
        <circle cx="286" cy="229" r="4.5" fill="#7d848f" />
        <circle cx="263" cy="229" r="7" fill="#272b32" />
        <rect x="210" y="196" width="106" height="66" rx="33" fill="url(#wbRim)" opacity="0.35" />
        <rect x="210" y="196" width="106" height="66" rx="33" fill="url(#wbShade)" />
      </g>

      {/* ================= LENGAN KIRI (melambai saat menyapa) ================= */}
      <motion.g
        style={{ transformOrigin: '84px 152px' }}
        animate={waving ? { rotate: [0, -36, -15, -36, 0] } : { rotate: 0 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      >
        <rect x="66" y="150" width="20" height="12" rx="5" fill="#666d78" />
        <rect x="68" y="158" width="15" height="46" rx="6" fill="url(#wbMetal)" />
        <rect x="61" y="200" width="27" height="13" rx="5" fill="#525863" />
        <rect x="61" y="208" width="10" height="12" rx="3" fill="#434952" />
        <rect x="78" y="208" width="10" height="12" rx="3" fill="#434952" />
        <rect x="68" y="158" width="4" height="46" rx="2" fill="rgba(196,222,255,0.3)" />
      </motion.g>

      {/* ================= LENGAN KANAN ================= */}
      <g>
        <rect x="234" y="150" width="20" height="12" rx="5" fill="#5c626d" />
        <rect x="237" y="158" width="15" height="46" rx="6" fill="url(#wbMetal)" />
        <rect x="232" y="200" width="27" height="13" rx="5" fill="#4a5059" />
        <rect x="232" y="208" width="10" height="12" rx="3" fill="#3d434b" />
        <rect x="249" y="208" width="10" height="12" rx="3" fill="#3d434b" />
        <rect x="237" y="158" width="15" height="46" rx="6" fill="url(#wbShade)" />
      </g>

      {/* ================= BADAN KUBUS ================= */}
      <g>
        <rect x="86" y="132" width="148" height="112" rx="12" fill="url(#wbBody)" />
        <rect x="86" y="132" width="148" height="26" rx="12" fill="url(#wbBodyTop)" />

        <g clipPath="url(#wbBodyClip)">
          <rect x="86" y="158" width="148" height="3" fill="#00000028" />
          <rect x="86" y="196" width="148" height="2" fill="#00000022" />
          <rect x="158" y="158" width="2.5" height="38" fill="#00000022" />

          <rect x="98" y="166" width="52" height="24" rx="3" fill="#00000024" />
          <rect x="170" y="166" width="52" height="24" rx="3" fill="#00000024" />

          {/* karat dan kotoran */}
          <g opacity="0.3" fill="#5d3312">
            <path d="M96 158 q6 22 2 46 l-9 0 q-5 -24 1 -46 Z" />
            <path d="M224 160 q7 18 4 40 l-8 0 q-4 -22 0 -40 Z" />
            <path d="M150 214 q14 6 30 3 l0 9 q-16 3 -31 -3 Z" />
          </g>
          <g opacity="0.22" fill="#33220e">
            <circle cx="112" cy="206" r="4" />
            <circle cx="203" cy="200" r="3" />
            <circle cx="176" cy="228" r="3.4" />
            <circle cx="128" cy="146" r="2.6" />
          </g>
          <g opacity="0.22" fill="#e8d69a">
            <rect x="106" y="140" width="26" height="3" rx="1.5" />
            <rect x="192" y="142" width="18" height="2.5" rx="1.2" />
          </g>

          <rect x="86" y="216" width="148" height="28" fill="url(#wbAO)" />
        </g>

        {/* panel indikator dan lampu hijau */}
        <rect x="158" y="166" width="14" height="24" rx="2.5" fill="#1e222a" />
        <rect x="161" y="170" width="8" height="7" rx="1.5" fill="#4fc93f" />
        <rect
          x="161"
          y="170"
          width="8"
          height="7"
          rx="1.5"
          fill="#4fc93f"
          opacity="0.45"
          filter="url(#wbGlow)"
        />
        <rect x="161" y="180" width="8" height="6" rx="1.5" fill="#33373f" />

        {/* Kode unit. Identitas orisinal, memakai inisial pemilik situs. */}
        <text
          x="160"
          y="228"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="18"
          fontWeight="700"
          letterSpacing="2.5"
          fill="#5c4409"
          opacity="0.8"
        >
          DV-01
        </text>

        <circle cx="95" cy="141" r="2.6" fill="#00000036" />
        <circle cx="225" cy="141" r="2.6" fill="#00000036" />
        <circle cx="95" cy="235" r="2.6" fill="#00000036" />
        <circle cx="225" cy="235" r="2.6" fill="#00000036" />

        <rect x="86" y="132" width="148" height="112" rx="12" fill="url(#wbRim)" />
        <rect x="86" y="132" width="148" height="112" rx="12" fill="url(#wbShade)" />
        {/* cahaya lemah dari langit pada permukaan atas badan */}
        <rect x="86" y="132" width="148" height="112" rx="12" fill="url(#wbSky)" />
      </g>

      {/* ================= LEHER ================= */}
      <g>
        <rect x="150" y="96" width="16" height="42" rx="5" fill="#a5842a" />
        <rect x="150" y="96" width="5" height="42" fill="rgba(196,222,255,0.28)" />
        <rect x="144" y="126" width="28" height="10" rx="3" fill="#666d78" />
        <ellipse cx="158" cy="136" rx="26" ry="7" fill="rgba(0,0,0,0.35)" />
      </g>

      {/* ================= KEPALA DAN MATA TEROPONG ================= */}
      <motion.g
        style={{ transformOrigin: '158px 104px', y: headLift, rotate: headTilt }}
      >
        <rect x="126" y="62" width="66" height="20" rx="9" fill="#616874" />
        <rect x="126" y="62" width="66" height="6" rx="3" fill="#828997" />
        <rect x="126" y="62" width="66" height="20" rx="9" fill="url(#wbShade)" />

        {/* ---- mata kiri ---- */}
        <g>
          <rect x="112" y="24" width="10" height="16" rx="3" fill="#555b65" />
          <rect x="126" y="20" width="14" height="12" rx="3" fill="#666d78" />

          <circle cx="126" cy="62" r="34" fill="url(#wbEyeCase)" />
          <circle cx="126" cy="62" r="30.5" fill="none" stroke="#393f48" strokeWidth="2.5" />
          <circle cx="126" cy="62" r="27.5" fill="none" stroke="#8f96a1" strokeWidth="1.6" />
          <circle cx="126" cy="62" r="25" fill="#151a22" />
          <circle cx="126" cy="62" r="22" fill="url(#wbLens)" />

          <motion.circle
            cx="126"
            cy="62"
            r="10"
            fill="#0b1018"
            style={{ x: pupilX, y: pupilY }}
          />
          <motion.circle
            cx="131"
            cy="57"
            r="3.4"
            fill="#eef5ff"
            style={{ x: glintX, y: glintY }}
          />

          <motion.rect
            x="99"
            y="28"
            width="54"
            height="68"
            rx="27"
            fill="#666d78"
            initial={false}
            animate={{ scaleY: blink ? 1 : 0 }}
            style={{ transformOrigin: '126px 28px' }}
            transition={{ duration: 0.07 }}
          />

          <circle cx="126" cy="62" r="34" fill="url(#wbRim)" />
        </g>

        {/* ---- mata kanan ---- */}
        <g>
          <rect x="196" y="24" width="10" height="16" rx="3" fill="#4f555f" />
          <rect x="178" y="20" width="14" height="12" rx="3" fill="#616874" />

          <circle cx="192" cy="62" r="34" fill="url(#wbEyeCase)" />
          <circle cx="192" cy="62" r="30.5" fill="none" stroke="#393f48" strokeWidth="2.5" />
          <circle cx="192" cy="62" r="27.5" fill="none" stroke="#8f96a1" strokeWidth="1.6" />
          <circle cx="192" cy="62" r="25" fill="#151a22" />
          <circle cx="192" cy="62" r="22" fill="url(#wbLens)" />

          <motion.circle
            cx="192"
            cy="62"
            r="10"
            fill="#0b1018"
            style={{ x: pupilX, y: pupilY }}
          />
          <motion.circle
            cx="197"
            cy="57"
            r="3.4"
            fill="#eef5ff"
            style={{ x: glintX, y: glintY }}
          />

          <motion.rect
            x="165"
            y="28"
            width="54"
            height="68"
            rx="27"
            fill="#616874"
            initial={false}
            animate={{ scaleY: blink ? 1 : 0 }}
            style={{ transformOrigin: '192px 28px' }}
            transition={{ duration: 0.07 }}
          />

          <circle cx="192" cy="62" r="34" fill="url(#wbRim)" opacity="0.4" />
          <circle cx="192" cy="62" r="34" fill="url(#wbShade)" opacity="0.55" />
        </g>
      </motion.g>
    </svg>
  );
}
