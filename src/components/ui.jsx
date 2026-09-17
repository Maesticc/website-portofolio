import { motion } from 'motion/react';

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

