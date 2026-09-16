/* =============================================================================
 * theme.js
 * Warna permukaan (surface) untuk setiap section.
 *
 * Tujuannya: saat pengunjung berpindah section, latarnya berganti warna
 * sehingga terasa seperti membuka halaman baru, padahal tetap satu halaman.
 *
 * Aturan yang dipakai supaya tetap harmonis:
 *  - Semua warna tetap gelap dengan tingkat kecerahan yang mirip (L sekitar 8%
 *    sampai 12%). Yang berubah hanya HUE-nya, bukan terang gelapnya. Jadi tidak
 *    ada section yang terasa "menyala" atau "jatuh" dibanding lainnya.
 *  - Hue-nya berjalan berurutan mengelilingi spektrum: biru laut, ungu nebula,
 *    teal, plum, indigo, lalu wine. Terasa seperti melintasi wilayah galaksi
 *    yang berbeda.
 *  - Alpha 0.95, bukan 1. Bintang di latar masih terlihat samar menembus
 *    permukaan, jadi tema galaksinya tidak hilang.
 *  - Warna aksen (nebula ungu dan starlight biru) TIDAK diubah per section,
 *    supaya identitas situs tetap satu.
 * ========================================================================== */

const A = 0.95;

/* Warna dasar tiap section, berurutan sesuai urutan di halaman. */
export const SECTION_SURFACES = {
  home: `rgba(4, 3, 12, 0)`, //        transparan, biar starfield terlihat penuh
  about: `rgba(8, 14, 30, ${A})`, //   biru laut dalam
  skills: `rgba(19, 14, 44, ${A})`, // ungu nebula
  projects: `rgba(6, 24, 32, ${A})`, //teal dalam
  experience: `rgba(25, 13, 35, ${A})`, // plum
  contact: `rgba(28, 11, 27, ${A})`, //wine gelap, section terakhir
};

/* Urutan section di halaman. Dipakai untuk mencari warna section sebelumnya
 * agar peralihan antar warna bisa dibuat menyatu, tanpa garis potong keras. */
export const SECTION_ORDER = [
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'contact',
];

/**
 * Mengembalikan warna dasar section beserta warna section sebelumnya.
 * Warna sebelumnya dipakai sebagai titik awal gradien di bagian atas section,
 * sehingga batas antar section terasa menyatu.
 */
export function getSurface(id) {
  const index = SECTION_ORDER.indexOf(id);
  const base = SECTION_SURFACES[id] ?? SECTION_SURFACES.home;

  if (index <= 0) return { base, previous: base };

  const previousId = SECTION_ORDER[index - 1];
  return { base, previous: SECTION_SURFACES[previousId] ?? base };
}
