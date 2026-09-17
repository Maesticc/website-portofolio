import { socials } from '../data/content';
import Section from './Section';
import { SignalFX } from './SectionFX';
import { Reveal, SectionHeading } from './ui';

export default function Contact() {
  return (
    <Section id="contact" center={false} fullHeight={false} atmosphere={<SignalFX />}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="05"
          eyebrow="Contact"
          title={
            <>
              Let's build
              <br />
              <span className="text-aurora">something meaningful.</span>
            </>
          }
          subtitle="I'm open to collaborations, internship opportunities, and interesting projects in AI, software, and technology. Let's connect."
        />

        <div className="mt-14 max-w-xl">
          <Reveal>
            <p className="label-mono mb-6 text-white/35">Contact channels</p>
          </Reveal>

          <ul className="space-y-3">
            {socials.map((social, i) => {
              const Icon = social.Icon;
              const url = social.url || '#';
              const isExternal = !url.startsWith('mailto:');
              return (
                <Reveal key={social.label} delay={i * 0.07}>
                  <li>
                    <a
                      href={url}
                      target={isExternal ? '_blank' : undefined}
                      rel="noreferrer noopener"
                      className="group flex items-center gap-4 rounded-2xl border border-white/8 px-5 py-4 transition duration-300 hover:border-nebula/40 hover:bg-white/[0.04]"
                    >
                      {/* Logo/ikon kanal */}
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/70 transition duration-300 group-hover:border-nebula/40 group-hover:text-white">
                        {Icon ? <Icon className="h-5 w-5" /> : null}
                      </span>

                      {/* Nama kanal + handle */}
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-lg font-light text-white/90 transition group-hover:text-white">
                          {social.label}
                        </span>
                        {social.handle && (
                          <span className="block truncate font-mono text-xs text-white/40">
                            {social.handle}
                          </span>
                        )}
                      </span>

                      {/* Panah */}
                      <span
                        aria-hidden="true"
                        className="text-white/30 transition-transform duration-300 group-hover:rotate-45 group-hover:text-starlight"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
