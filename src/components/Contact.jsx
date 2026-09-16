import { useState } from 'react';
import { profile, socials } from '../data/content';
import Section from './Section';
import { SignalFX } from './SectionFX';
import { GlowButton, Reveal, SectionHeading } from './ui';

/**
 * Form kontak.
 *
 * Secara default form ini TIDAK mengirim data ke pihak ketiga:
 * isi form dirangkai menjadi tautan `mailto:` dan dibuka di aplikasi email
 * milik pengunjung. Jadi tidak ada backend dan tidak ada data yang dikirim
 * ke server mana pun.
 *
 * [OPSIONAL] Kalau nanti kamu mau form terkirim otomatis, kamu bisa pakai
 * layanan seperti Web3Forms / Formspree: ganti isi fungsi handleSubmit
 * menjadi fetch POST ke endpoint layanan tersebut beserta access key kamu.
 */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Nama masih kosong.';
    if (!form.email.trim()) next.email = 'Email masih kosong.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Format email belum benar.';
    if (!form.message.trim()) next.message = 'Tulis pesanmu dulu ya.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const subject = `[Portfolio] Pesan dari ${form.name}`;
    const body = `Nama: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  const fieldClass = (hasError) =>
    `w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 transition duration-200 focus:bg-white/[0.07] focus:outline-none ${
      hasError
        ? 'border-rose-400/60 focus:border-rose-400'
        : 'border-white/12 focus:border-nebula'
    }`;

  return (
    <Section id="contact" atmosphere={<SignalFX />}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="05"
          eyebrow="Contact"
          title={
            <>
              Mari bicara
              <br />
              <span className="text-aurora">lintas galaksi.</span>
            </>
          }
          subtitle="Terbuka untuk kolaborasi, project, maupun diskusi seputar teknologi dan desain. Kirim pesan lewat form di samping, atau lewat kanal mana pun di bawah."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          {/* ---------- Kiri: kanal kontak ---------- */}
          <div>
            <Reveal>
              <p className="label-mono mb-6 text-white/35">Kanal kontak</p>
            </Reveal>

            <ul className="space-y-2">
              {socials.map((social, i) => (
                <Reveal key={social.label} delay={i * 0.07}>
                  <li>
                    <a
                      href={social.url}
                      target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between gap-4 rounded-xl border border-white/8 px-5 py-4 transition duration-300 hover:border-nebula/40 hover:bg-white/[0.04]"
                    >
                      <span className="flex items-center gap-4">
                        <span className="font-display text-lg font-light text-white/85 transition group-hover:text-white">
                          {social.label}
                        </span>
                        <span className="font-mono text-xs text-white/35">
                          {social.handle}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-white/35 transition-transform duration-300 group-hover:rotate-45 group-hover:text-starlight"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.3}>
              <div className="glass-panel mt-8 rounded-2xl p-6">
                <p className="label-mono mb-3 text-white/35">Tersedia untuk</p>
                <p className="text-sm leading-7 text-white/60">
                  {profile.availableFor}
                </p>
              </div>
            </Reveal>
          </div>

          {/* ---------- Kanan: form ---------- */}
          <Reveal delay={0.12}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="glass-panel rounded-2xl p-7 sm:p-8"
            >
              <p className="label-mono mb-6 text-white/35">Kirim pesan</p>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block font-mono text-[0.68rem] tracking-[0.14em] uppercase text-white/45"
                  >
                    Nama
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Nama kamu"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={fieldClass(errors.name)}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-2 text-xs text-rose-300">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-mono text-[0.68rem] tracking-[0.14em] uppercase text-white/45"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="nama@email.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={fieldClass(errors.email)}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-2 text-xs text-rose-300">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-mono text-[0.68rem] tracking-[0.14em] uppercase text-white/45"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Tulis pesanmu di sini..."
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`${fieldClass(errors.message)} resize-none`}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 text-xs text-rose-300">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <GlowButton as="button" type="submit" className="mt-7 w-full justify-center">
                Kirim Pesan
              </GlowButton>

              <p
                aria-live="polite"
                className="mt-4 min-h-5 text-center text-xs text-white/45"
              >
                {sent
                  ? 'Aplikasi email kamu akan terbuka dengan pesan yang sudah terisi.'
                  : 'Form ini membuka aplikasi email kamu — tidak ada data yang dikirim ke server.'}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
