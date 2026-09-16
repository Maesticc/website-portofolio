import { getSurface } from '../data/theme';

/**
 * Section
 * Pembungkus seragam untuk setiap section di halaman.
 *
 * Tugasnya:
 *  - Memberi warna latar khas per section, sehingga berpindah section terasa
 *    seperti berpindah halaman meski tetap satu halaman.
 *  - Membuat peralihan warna antar section menyatu, dengan memulai gradien
 *    dari warna section sebelumnya.
 *  - Menjamin tinggi minimal satu layar penuh, supaya warnanya benar-benar
 *    mengisi viewport saat tombol navigasi diklik. Ini yang menjual kesan
 *    "halaman baru".
 *
 * Memakai min-h-[100dvh], bukan h-screen, agar tidak melompat saat bilah
 * alamat browser mobile muncul dan hilang.
 */
export default function Section({
  id,
  children,
  className = '',
  center = true,
}) {
  const { base, previous } = getSurface(id);

  return (
    <section
      id={id}
      className={`relative z-10 flex min-h-[100dvh] flex-col px-6 py-24 lg:px-10 lg:py-28 ${
        center ? 'justify-center' : 'justify-start'
      } ${className}`}
    >
      {/* Permukaan berwarna. Gradien di 16rem teratas memulai dari warna
          section sebelumnya, jadi batasnya tidak terlihat sebagai garis. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, ${previous} 0rem, ${base} 16rem, ${base} 100%)`,
        }}
      />

      {/* Garis cahaya tipis di batas atas, penanda halus bahwa ini wilayah baru */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-nebula/25 to-transparent"
      />

      <div className="w-full">{children}</div>
    </section>
  );
}
