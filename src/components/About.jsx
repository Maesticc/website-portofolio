import { profile } from '../data/content';
import Section from './Section';
import { Reveal, SectionHeading } from './ui';

export default function About() {
  return (
    <Section id="about">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="01"
          eyebrow="About"
          title={
            <>
              Di balik antarmuka,
              <br />
              <span className="text-aurora">ada rasa penasaran.</span>
            </>
          }
        />

        <div className="mt-16 grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ---------- Portrait / visual ---------- */}
          <Reveal>
            <div className="relative mx-auto w-full max-w-sm">
              {/* Cincin orbit di sekitar foto */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-full border border-white/[0.07]"
              />
              <div
                aria-hidden="true"
                className="absolute -inset-6 animate-orbit rounded-full"
              >
                <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-starlight shadow-[0_0_14px_4px_rgba(110,231,255,0.6)]" />
              </div>

              <div className="glass-panel relative aspect-square overflow-hidden rounded-full">
                {/* Ganti bagian ini dengan <img src="..." /> foto kamu  [EDIT] */}
                <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_30%_25%,rgba(124,92,255,0.42),transparent_65%),radial-gradient(70%_70%_at_75%_80%,rgba(232,121,249,0.32),transparent_60%)]" />
                <div className="relative flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="font-display text-6xl font-light text-white/85">
                    {profile.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')}
                  </span>
                  <span className="label-mono text-white/35">
                    Foto kamu di sini
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ---------- Bio ---------- */}
          <div>
            <Reveal delay={0.08}>
              <h3 className="mb-8 font-display text-3xl leading-tight font-light text-white sm:text-4xl">
                Membangun antarmuka
                <br />
                dengan tujuan yang jelas.
              </h3>
            </Reveal>

            <div className="max-w-2xl space-y-5">
              {profile.aboutParagraphs.map((p, i) => (
                <Reveal key={i} delay={0.14 + i * 0.07}>
                  <p className="text-base leading-8 text-white/60">{p}</p>
                </Reveal>
              ))}
            </div>

            {/* Statistik singkat */}
            <Reveal delay={0.34}>
              <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/8 pt-8">
                {profile.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-display text-3xl font-light text-white sm:text-4xl">
                        {stat.value}
                      </span>
                      <span className="mt-1.5 block font-mono text-[0.68rem] tracking-[0.14em] uppercase text-white/40">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* ---------- Fokus ---------- */}
        <div className="mt-20">
          <Reveal>
            <p className="label-mono mb-6 text-white/35">Fokus saat ini</p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {profile.focus.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <article className="glass-panel group h-full rounded-2xl p-6 transition-colors duration-300 hover:border-nebula/40">
                  <span className="mb-5 flex h-9 w-9 items-center justify-center rounded-full border border-nebula/30 bg-nebula/10 font-mono text-[0.7rem] text-starlight">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="font-display text-xl font-light text-white">
                    {item.title}
                  </h4>
                  <p className="mt-2.5 text-sm leading-6 text-white/50">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
