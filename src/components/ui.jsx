import { motion } from 'motion/react';

/** Wrapper reveal saat elemen masuk viewport. */
export function Reveal({ children, delay = 0, y = 26, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Judul section dengan penanda "koordinat" bergaya galaksi. */
export function SectionHeading({ index, eyebrow, title, subtitle, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <Reveal>
        <div
          className={`mb-5 flex items-center gap-4 ${
            align === 'center' ? 'justify-center' : ''
          }`}
        >
          <span className="label-mono text-sm text-nebula sm:text-base">
            {index} — {eyebrow}
          </span>
          <span className="h-px w-20 bg-gradient-to-r from-nebula/70 to-transparent" />
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="font-display text-4xl leading-[1.05] font-light tracking-tight text-white sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>

      {subtitle && (
        <Reveal delay={0.16}>
          <p
            className={`mt-6 max-w-2xl text-lg leading-8 text-white/60 sm:text-xl ${
              align === 'center' ? 'mx-auto' : ''
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Tag/pill kecil untuk stack teknologi & skill. */
export function Tag({ children, tone = 'default' }) {
  const tones = {
    default: 'border-white/12 bg-white/5 text-white/65',
    nebula: 'border-nebula/35 bg-nebula/12 text-white/85',
    star: 'border-starlight/30 bg-starlight/10 text-starlight',
  };
  return (
    <span
      className={`rounded-full border px-3 py-1 font-mono text-[0.68rem] tracking-wider uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Tombol utama bergaya "portal". */
export function GlowButton({ as = 'a', children, className = '', ...rest }) {
  const Comp = as;
  return (
    <Comp
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-nebula/40 bg-nebula/15 px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase text-white transition duration-300 hover:border-nebula hover:bg-nebula/25 ${className}`}
      {...rest}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
    </Comp>
  );
}

/** Tombol sekunder (outline tipis). */
export function GhostButton({ as = 'a', children, className = '', ...rest }) {
  const Comp = as;
  return (
    <Comp
      className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase text-white/70 transition duration-300 hover:border-white/40 hover:text-white ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}
