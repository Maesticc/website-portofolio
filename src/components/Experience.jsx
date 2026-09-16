import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { experiences } from '../data/content';
import Section from './Section';
import { Reveal, SectionHeading, Tag } from './ui';

export default function Experience() {
  const [openId, setOpenId] = useState(experiences[0]?.id ?? null);

  return (
    <Section id="experience">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="04"
          eyebrow="Experience"
          title={
            <>
              Jejak
              <br />
              <span className="text-aurora">perjalanan.</span>
            </>
          }
          subtitle="Pengalaman saya mencakup organisasi kampus, kepanitiaan acara, mentoring mahasiswa baru, dan kepemimpinan siswa. Klik setiap item untuk melihat detailnya."
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
