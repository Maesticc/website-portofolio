import { navLinks, profile, socials } from '../data/content';
import { getSurface } from '../data/theme';

export default function Footer() {
  const { base, previous } = getSurface('footer');

  return (
    <footer className="relative z-10 border-t border-cosmic-line px-6 py-14 lg:px-10">
      {/* Permukaan footer, menyatu dari warna section contact ke void */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, ${previous} 0rem, ${base} 12rem, ${base} 100%)`,
        }}
      />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Identitas */}
          <div>
            <a href="#home" className="group inline-flex items-center gap-3">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-nebula/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-starlight shadow-[0_0_10px_3px_rgba(110,231,255,0.6)]" />
              </span>
              <span className="font-display text-sm tracking-[0.2em] uppercase text-white/80">
                {profile.name}
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/45">
              {profile.tagline}
            </p>
          </div>

          {/* Navigasi */}
          <nav aria-label="Navigasi footer">
            <p className="label-mono mb-4 text-white/30">Navigasi</p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-sm text-white/50 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kanal */}
          <div>
            <p className="label-mono mb-4 text-white/30">Kanal</p>
            <ul className="space-y-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer noopener"
                    className="text-sm text-white/50 transition hover:text-white"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-7 sm:flex-row sm:items-center">
          <p className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-white/30">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-white/30">
            Dibangun dengan React · Tailwind · Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
