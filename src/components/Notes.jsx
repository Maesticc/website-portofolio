import { notes } from '../data/content';
import Section from './Section';
import { Reveal, SectionHeading, Tag } from './ui';

export default function Notes() {
  return (
    <Section id="notes">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="06"
          eyebrow="Notes"
          title={
            <>
              Catatan, ide,
              <br />
              <span className="text-aurora">dan hal yang dipelajari.</span>
            </>
          }
          subtitle="Ruang untuk membagikan pemikiran seputar teknologi, frontend development, desain produk digital, dan hal-hal kecil yang menarik saat ngoding."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {notes.map((note, i) => (
            <Reveal key={note.id} delay={i * 0.09}>
              <article className="glass-panel group flex h-full cursor-pointer flex-col rounded-2xl p-7 transition-colors duration-300 hover:border-nebula/40">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <Tag tone="star">{note.tag}</Tag>
                  <span className="font-mono text-[0.68rem] text-white/30">
                    {note.readTime}
                  </span>
                </div>

                <h3 className="font-display text-xl leading-snug font-light text-white transition-colors group-hover:text-starlight">
                  {note.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-white/50">
                  {note.excerpt}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
                  <span className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-white/35">
                    {note.date}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-starlight"
                  >
                    →
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
