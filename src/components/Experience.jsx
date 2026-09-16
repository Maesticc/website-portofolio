import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { experiences } from '../data/content';
import Section from './Section';
import { OrbitPathsFX } from './SectionFX';
import { Reveal, SectionHeading, Tag } from './ui';

export default function Experience() {
  const [openId, setOpenId] = useState(experiences[0]?.id ?? null);

  return (
    <Section id="experience" center={false} atmosphere={<OrbitPathsFX />}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="04"
          eyebrow="Experience"
          title={
            <>
              The
              <br />
              <span className="text-aurora">journey so far.</span>
            </>
          }
          subtitle="A journey through entrepreneurship, event management, production, and technology. Click each experience to explore the details."
        />

        {/* Timeline */}
        <div className="relative mt-16 ml-1.5 border-l border-white/10 pl-8 sm:pl-10">
          {experiences.map((exp, i) => {
            const isOpen = openId === exp.id;
            return (
              <Reveal key={exp.id} delay={i * 0.07}>
                <div className="relative pb-8 last:pb-0">
                  {/* Titik bintang di garis waktu */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-6 -left-[2.28rem] flex h-3 w-3 items-center justify-center rounded-full transition-all duration-300 sm:-left-[2.78rem] ${
                      isOpen
                        ? 'bg-starlight shadow-[0_0_16px_4px_rgba(110,231,255,0.55)]'
                        : 'bg-white/25'
                    }`}
                  />

                  <div
                    className={`glass-panel overflow-hidden rounded-2xl transition-colors duration-300 ${
                      isOpen ? 'border-nebula/35' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : exp.id)}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-start justify-between gap-5 p-6 text-left sm:p-7"
                    >
                      <div className="min-w-0">
                        <p className="label-mono mb-2.5 text-white/35">
                          {exp.period} · {exp.location}
                        </p>
                        <h3 className="font-display text-2xl leading-snug font-light text-white sm:text-[1.7rem]">
                          {exp.role}
                        </h3>
                        <p className="mt-1.5 font-mono text-sm text-nebula">
                          {exp.org}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-white/55 transition-all duration-300 ${
                          isOpen
                            ? 'rotate-45 border-nebula text-white'
                            : 'border-white/15'
                        }`}
                      >
                        +
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/8 px-6 pt-5 pb-6 sm:px-7 sm:pb-7">
                            <p className="max-w-2xl text-sm leading-7 text-white/60">
                              {exp.description}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                              {exp.skills.map((skill) => (
                                <Tag key={skill}>{skill}</Tag>
                              ))}
                            </div>

                            {/* Sub-timeline: hanya muncul bila experience ini
                                punya field `timeline`. Ditampilkan sebagai
                                garis waktu mini di dalam kartu. */}
                            {Array.isArray(exp.timeline) &&
                              exp.timeline.length > 0 && (
                                <div className="relative mt-7 ml-1 border-l border-white/10 pl-6 sm:pl-7">
                                  {exp.timeline.map((item, ti) => (
                                    <div
                                      key={ti}
                                      className="relative pb-6 last:pb-0"
                                    >
                                      {/* titik di garis waktu mini */}
                                      <span
                                        aria-hidden="true"
                                        className="absolute top-1.5 -left-[1.72rem] h-2 w-2 rounded-full bg-starlight/70 shadow-[0_0_10px_2px_rgba(110,231,255,0.4)] sm:-left-[1.97rem]"
                                      />
                                      <p className="label-mono mb-1 text-nebula">
                                        {item.date}
                                      </p>
                                      <h4 className="font-display text-lg leading-snug font-light text-white">
                                        {item.title}
                                      </h4>
                                      {item.subtitle && (
                                        <p className="mt-0.5 font-mono text-xs tracking-wide text-white/45">
                                          {item.subtitle}
                                        </p>
                                      )}
                                      {item.description && (
                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                                          {item.description}
                                        </p>
                                      )}
                                      {Array.isArray(item.skills) &&
                                        item.skills.length > 0 && (
                                          <div className="mt-3 flex flex-wrap gap-1.5">
                                            {item.skills.map((skill) => (
                                              <Tag key={skill}>{skill}</Tag>
                                            ))}
                                          </div>
                                        )}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
