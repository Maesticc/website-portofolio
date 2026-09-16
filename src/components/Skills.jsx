import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { skillCategories, skills } from '../data/content';
import Section from './Section';
import { ConstellationFX } from './SectionFX';
import { Reveal, Tag } from './ui';

/* Jumlah baris keyboard diambil langsung dari data skill. */
const ROWS = [...new Set(skills.map((s) => s.row))].sort((a, b) => a - b);

/* Helper warna: bikin sisi keycap lebih gelap dari permukaannya. */
const shade = (color, percentBlack) =>
  `color-mix(in srgb, ${color} ${100 - percentBlack}%, #000)`;

/* Helper warna: bikin permukaan keycap lebih terang (untuk highlight). */
const tint = (color, percentWhite) =>
  `color-mix(in srgb, ${color} ${100 - percentWhite}%, #fff)`;

/* -----------------------------------------------------------------------------
 * Satu keycap 3D.
 * Dibentuk dari 5 bidang: permukaan atas + 4 dinding samping,
 * semuanya disusun dengan CSS transform di dalam ruang preserve-3d.
 * -------------------------------------------------------------------------- */
function Keycap({ skill, isActive, isPressed, onActivate, onPreview }) {
  const { Icon } = skill;

  return (
    <button
      type="button"
      onClick={() => onActivate(skill.id, 'click')}
      onMouseEnter={() => onPreview(skill.id)}
      onFocus={() => onActivate(skill.id, 'focus')}
      aria-pressed={isActive}
      aria-label={`${skill.name} — ${skill.category}. Tekan tombol ${skill.key} untuk detail.`}
      className="preserve-3d group relative block cursor-pointer border-0 bg-transparent p-0"
      style={{ width: 'var(--cap)', height: 'var(--cap)' }}
    >
      {/* Bayangan keycap di atas plate */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-[16%] bg-black/70 blur-[3px]"
        style={{ transform: 'translateZ(1px) translate(6%, 6%)' }}
      />

      {/* Wrapper yang bergerak turun saat tombol ditekan */}
      <span
        aria-hidden="true"
        className="preserve-3d absolute inset-0 transition-transform duration-150 ease-out"
        style={{
          transform: isPressed
            ? 'translateZ(calc(var(--h) * -0.55))'
            : isActive
              ? 'translateZ(calc(var(--h) * 0.28))'
              : 'translateZ(0)',
        }}
      >
        {/* --- dinding utara --- */}
        <span
          className="absolute bottom-full left-0 w-full origin-bottom rounded-t-[10%]"
          style={{
            height: 'var(--h)',
            transform: 'rotateX(-90deg)',
            background: shade(skill.cap, 58),
          }}
        />
        {/* --- dinding barat --- */}
        <span
          className="absolute top-0 right-full h-full origin-right"
          style={{
            width: 'var(--h)',
            transform: 'rotateY(90deg)',
            background: shade(skill.cap, 52),
          }}
        />
        {/* --- dinding timur --- */}
        <span
          className="absolute top-0 left-full h-full origin-left"
          style={{
            width: 'var(--h)',
            transform: 'rotateY(-90deg)',
            background: shade(skill.cap, 34),
          }}
        />
        {/* --- dinding selatan (paling terang, menghadap penonton) --- */}
        <span
          className="absolute top-full left-0 w-full origin-top rounded-b-[10%]"
          style={{
            height: 'var(--h)',
            transform: 'rotateX(90deg)',
            background: shade(skill.cap, 22),
          }}
        />

        {/* --- permukaan atas --- */}
        <span
          className="absolute inset-0 flex flex-col items-center justify-center gap-[6%] rounded-[16%] shadow-[inset_0_2px_0_rgba(255,255,255,0.34),inset_0_-3px_6px_rgba(0,0,0,0.32)]"
          style={{
            transform: 'translateZ(var(--h))',
            background: `radial-gradient(125% 125% at 28% 18%, ${tint(
              skill.cap,
              26,
            )}, ${skill.cap} 52%, ${shade(skill.cap, 18)})`,
            color: skill.ink,
          }}
        >
          <Icon
            style={{ width: '46%', height: '46%' }}
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
          />
          <span
            className="font-mono leading-none font-bold opacity-55"
            style={{ fontSize: 'calc(var(--cap) * 0.17)' }}
          >
            {skill.key}
          </span>

          {/* Kilau saat hover */}
          <span className="pointer-events-none absolute inset-0 rounded-[16%] bg-white/0 transition-colors duration-200 group-hover:bg-white/14" />
        </span>
      </span>

      {/* Halo bila keycap sedang aktif */}
      {isActive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-14%] rounded-[22%]"
          style={{
            transform: 'translateZ(calc(var(--h) + 2px))',
            boxShadow: `0 0 0 2px ${skill.cap}, 0 0 26px 6px ${skill.cap}80`,
          }}
        />
      )}
    </button>
  );
}

/* -----------------------------------------------------------------------------
 * Panel penjelasan skill yang aktif.
 * -------------------------------------------------------------------------- */
function SkillDetail({ skill }) {
  const { Icon } = skill;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={skill.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel relative overflow-hidden rounded-3xl p-7 sm:p-9"
      >
        {/* Aksen warna skill */}
        <span
          aria-hidden="true"
          className="absolute -top-24 -right-16 h-56 w-56 rounded-full opacity-25 blur-[80px]"
          style={{ background: skill.cap }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${skill.cap}, transparent)`,
          }}
        />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          {/* Kiri: identitas + penjelasan */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: `${skill.cap}1f`,
                  border: `1px solid ${skill.cap}55`,
                  color: skill.cap,
                }}
              >
                <Icon className="h-7 w-7" />
              </span>

              <div>
                <h3 className="font-display text-3xl leading-none font-light text-white sm:text-4xl">
                  {skill.name}
                </h3>
                <p className="label-mono mt-2 text-white/40">
                  {skill.category}
                </p>
              </div>

              <kbd
                className="ml-auto hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] font-mono text-sm text-white/70 sm:flex"
                title={`Tekan ${skill.key} di keyboard kamu`}
              >
                {skill.key}
              </kbd>
            </div>

            <dl className="space-y-5">
              <div>
                <dt className="label-mono mb-2 text-nebula">What is this?</dt>
                <dd className="text-sm leading-7 text-white/70 sm:text-[0.95rem]">
                  {skill.what}
                </dd>
              </div>
              <div>
                <dt className="label-mono mb-2 text-nebula">
                  How I use it
                </dt>
                <dd className="text-sm leading-7 text-white/70 sm:text-[0.95rem]">
                  {skill.usedFor}
                </dd>
              </div>
            </dl>
          </div>

          {/* Kanan: proficiency + fokus */}
          <div className="lg:border-l lg:border-white/8 lg:pl-8">
            <p className="label-mono mb-3 text-white/40">Proficiency</p>
            <div className="mb-2 flex items-end justify-between">
              <span className="font-display text-4xl leading-none font-light text-white">
                {skill.level}
                <span className="text-lg text-white/35">%</span>
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${shade(skill.cap, 26)}, ${skill.cap})`,
                }}
              />
            </div>

            <p className="label-mono mt-8 mb-3 text-white/40">Focus</p>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* -----------------------------------------------------------------------------
 * Section Skills
 * -------------------------------------------------------------------------- */
export default function Skills() {
  const [activeId, setActiveId] = useState('docker');
  const [pressedId, setPressedId] = useState(null);
  const [inView, setInView] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const sectionRef = useRef(null);
  const pressTimer = useRef(null);

  const activeSkill = useMemo(
    () => skills.find((s) => s.id === activeId) ?? skills[0],
    [activeId],
  );

  /* Peta tombol fisik -> skill */
  const keyMap = useMemo(() => {
    const map = new Map();
    skills.forEach((s) => map.set(s.key.toUpperCase(), s));
    return map;
  }, []);

  const activate = useCallback((id) => {
    setActiveId(id);
    setPressedId(id);
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => setPressedId(null), 190);
  }, []);

  /* Preview saat hover: mengubah skill aktif tanpa animasi tekan */
  const preview = useCallback((id) => setActiveId(id), []);

  /* Pindah pilihan dengan tombol panah */
  const step = useCallback(
    (delta) => {
      const idx = skills.findIndex((s) => s.id === activeId);
      const next = (idx + delta + skills.length) % skills.length;
      activate(skills[next].id);
    },
    [activeId, activate],
  );

  useEffect(() => () => clearTimeout(pressTimer.current), []);

  /* Deteksi perangkat sentuh untuk menyesuaikan teks petunjuk */
  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  /* Section harus terlihat dulu sebelum keyboard fisik aktif,
     supaya tidak mengganggu saat user mengetik di form kontak. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const onKeyDown = (e) => {
      // jangan bajak tombol saat user sedang mengisi form
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        step(1);
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        step(-1);
        return;
      }

      const skill = keyMap.get(e.key.toUpperCase());
      if (skill) {
        e.preventDefault();
        activate(skill.id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inView, keyMap, activate, step]);

  return (
    <Section id="skills" center={false} atmosphere={<ConstellationFX />}>
      <div ref={sectionRef} className="mx-auto max-w-7xl">
        {/* ---------- Header ---------- */}
        <div className="mb-4 flex items-center gap-4">
          <span className="label-mono text-sm text-nebula sm:text-base">02 — Skills</span>
          <span className="h-px w-20 bg-gradient-to-r from-nebula/70 to-transparent" />
        </div>

        <Reveal>
          <h2 className="font-display text-5xl leading-none font-light tracking-tight text-white sm:text-6xl md:text-7xl">
            <span className="text-aurora">What I Work With ⭐</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60 sm:text-xl">
            Each keycap is one technology I use.{' '}
            {isTouch
              ? 'Tap a keycap'
              : 'Hover, click, or press the key shown on a keycap'}{' '}
            to see its explanation.
          </p>
        </Reveal>

        {/* ---------- Petunjuk ---------- */}
        <Reveal delay={0.16}>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-white/35">
            <span className="text-stardust">
              (hint: {isTouch ? 'tap a key' : 'press a key'})
            </span>
            {!isTouch && (
              <span className="flex items-center gap-2">
                <kbd className="rounded border border-white/15 px-1.5 py-0.5">←</kbd>
                <kbd className="rounded border border-white/15 px-1.5 py-0.5">→</kbd>
                to move
              </span>
            )}
          </p>
        </Reveal>

        {/* ---------- Panggung keyboard ---------- */}
        <div className="relative mt-14 lg:mt-8">
          {/* Label besar miring, mengikuti sudut keyboard (desktop) */}
          <div className="pointer-events-none absolute top-1/2 left-0 z-20 hidden -translate-y-1/2 lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkill.id}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
                className="origin-center -rotate-[57deg]"
              >
                <p
                  className="font-display text-6xl leading-none font-medium tracking-tight whitespace-nowrap xl:text-7xl"
                  style={{
                    color: '#fff',
                    textShadow: `0 0 34px ${activeSkill.cap}aa, 0 2px 10px rgba(0,0,0,0.8)`,
                  }}
                >
                  {activeSkill.name}
                </p>
                <p className="mt-2 font-mono text-sm tracking-[0.14em] whitespace-nowrap text-white/55">
                  {activeSkill.tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Label versi mobile / tablet */}
          <div className="mb-8 text-center lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.26 }}
              >
                <p
                  className="font-display text-4xl leading-none font-medium text-white sm:text-5xl"
                  style={{ textShadow: `0 0 26px ${activeSkill.cap}aa` }}
                >
                  {activeSkill.name}
                </p>
                <p className="mt-2 font-mono text-xs tracking-[0.12em] text-white/55">
                  {activeSkill.tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Keyboard 3D */}
          <div className="keyboard-scene flex justify-center overflow-hidden py-10 sm:py-14 lg:py-20">
            <div
              className="preserve-3d [--cap:28px] [--gap:5px] [--h:13px] sm:[--cap:40px] sm:[--gap:7px] sm:[--h:18px] md:[--cap:50px] md:[--gap:9px] md:[--h:21px] lg:[--cap:62px] lg:[--gap:11px] lg:[--h:26px]"
              style={{ transform: 'rotateX(54deg) rotateZ(-32deg)' }}
            >
              {/* Plate / body keyboard */}
              <div
                className="preserve-3d relative rounded-[18px] p-[calc(var(--gap)*1.8)]"
                style={{
                  background:
                    'linear-gradient(160deg, #1b1b22 0%, #0d0d12 55%, #08080c 100%)',
                  boxShadow:
                    '0 0 0 1px rgba(255,255,255,0.07), 0 60px 90px -40px rgba(0,0,0,0.95), 0 0 120px -20px rgba(124,92,255,0.35)',
                }}
              >
                <div
                  className="preserve-3d flex flex-col"
                  style={{ gap: 'var(--gap)' }}
                >
                  {ROWS.map((row) => (
                    <div
                      key={row}
                      className="preserve-3d flex"
                      style={{
                        gap: 'var(--gap)',
                        marginLeft: `calc(var(--cap) * ${row * 0.16})`,
                      }}
                    >
                      {skills
                        .filter((s) => s.row === row)
                        .map((skill) => (
                          <Keycap
                            key={skill.id}
                            skill={skill}
                            isActive={activeSkill.id === skill.id}
                            isPressed={pressedId === skill.id}
                            onActivate={activate}
                            onPreview={preview}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Penjelasan skill aktif ---------- */}
        <div className="mt-4 lg:mt-2">
          <SkillDetail skill={activeSkill} />
        </div>

        {/* ---------- Legenda kategori ---------- */}
        <Reveal delay={0.1}>
          <div className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {skillCategories.map((cat, i) => {
              return (
                <div
                  key={cat.name}
                  className="border-t border-white/8 pt-4"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-mono text-xs tracking-[0.14em] uppercase text-white/70">
                      {cat.name}
                    </p>
                    <span className="font-mono text-[0.7rem] text-white/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-white/45">
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
