import { getSurface } from '../data/theme';

/**
 * Section
 * Pembungkus seragam untuk setiap section, dirancang agar seluruh halaman
 * terasa sebagai SATU lingkungan yang menerus.
 *
 * Perbedaan dari versi lama: section tidak lagi menutup latar dengan permukaan
 * pekat. Yang ada hanyalah:
 *   1. tint hue sangat tipis, supaya lingkungan bersama (StarField fixed)
 *      tetap tembus ke seluruh halaman;
 *   2. haze lokal lembut di belakang konten, murni untuk keterbacaan teks,
 *      bukan untuk menutup latar;
 *   3. slot atmosphere untuk "momen visual" khas section (rasi bintang,
 *      planet jauh, orbit, sinyal) yang dilapiskan tanpa memutus lingkungan.
 *
 * Tidak ada garis batas keras antar section. Gradien tint dimulai dari warna
 * section sebelumnya sehingga peralihannya melebur.
 *
 * min-h-[100dvh] menjaga tiap section mengisi layar tanpa melompat saat bilah
 * alamat browser mobile muncul dan hilang.
 */
export default function Section({
  id,
  children,
  className = '',
  center = true,
  atmosphere = null,
  fullHeight = true,
}) {
  const { base, previous } = getSurface(id);

  return (
    <section
      id={id}
      className={`relative flex flex-col px-6 py-24 lg:px-10 lg:py-28 ${
        fullHeight ? 'min-h-[100dvh]' : ''
      } ${center ? 'justify-center' : 'justify-start'} ${className}`}
    >
      {/* Tint hue tipis. Gradien memulai dari tint section sebelumnya, jadi
          perpindahan warna menyatu tanpa garis potong. Karena alpha kecil,
          bintang dan nebula di belakang tetap terlihat menembusnya. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, ${previous} 0%, ${base} 30%, ${base} 100%)`,
        }}
      />

      {/* Momen visual khas section, dilapiskan di atas tint namun di belakang
          konten. Opsional. */}
      {atmosphere}

      {/* Haze lokal lembut tepat di belakang konten, agar teks tetap terbaca
          di atas bintang tanpa perlu permukaan pekat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_50%_50%,rgba(6,8,18,0.5),transparent_75%)]"
      />

      <div className="relative w-full">{children}</div>
    </section>
  );
}
