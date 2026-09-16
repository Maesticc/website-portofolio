/* =============================================================================
 * theme.js
 * Sistem warna lingkungan yang menyatu untuk seluruh halaman.
 *
 * PERUBAHAN PENTING dari model lama:
 *   Dulu tiap section punya permukaan OPAQUE yang hampir menutup latar,
 *   sehingga tiap section terasa seperti halaman terpisah. Sekarang tiap
 *   section hanya memberi TINT sangat tipis di atas satu lingkungan bersama
 *   (StarField yang fixed). Bintang, Milky Way, dan nebula yang sama tembus ke
 *   seluruh halaman, jadi berpindah section terasa seperti kamera bergerak di
 *   dalam satu semesta, bukan berpindah halaman.
 *
 * Satu bahasa warna dipakai di mana-mana:
 *   - Primer   : navy sangat gelap, mendekati hitam
 *   - Sekunder : biru keabuan gelap
 *   - Aksen    : ungu lembut
 *   - Highlight: cyan halus
 * Yang berubah antar section hanya PERGESERAN HUE yang sangat halus, bukan
 * terang gelapnya, dan bukan penutup pekat. Tidak ada warna asing per section.
 * ========================================================================== */

/* Tint per section. Alpha sengaja kecil: ini hanya sapuan warna tipis di atas
 * lingkungan bersama, bukan permukaan yang menutupi. Hue bergeser perlahan
 * dari biru laut, ke ungu nebula, teal dalam, plum, lalu wine gelap, seperti
 * melintasi wilayah semesta yang berbeda tanpa pernah terputus. */
export const SECTION_TINTS = {
  home: `rgba(4, 3, 12, 0)`, //          transparan penuh, starfield utuh
  about: `rgba(12, 18, 38, 0.22)`, //    biru laut, sangat tipis
  skills: `rgba(22, 16, 46, 0.24)`, //   ungu nebula
  projects: `rgba(10, 24, 34, 0.22)`, // teal dalam
  experience: `rgba(24, 15, 38, 0.24)`, //plum
  contact: `rgba(20, 12, 30, 0.28)`, //  wine gelap, makin dalam di akhir
};

/* Kompatibilitas: sebagian kode lama masih mengimpor SECTION_SURFACES.
 * Dipetakan ke tint yang baru. */
export const SECTION_SURFACES = SECTION_TINTS;

/* Urutan section di halaman. Dipakai untuk membuat peralihan warna menyatu
 * dengan memulai gradien dari tint section sebelumnya. */
export const SECTION_ORDER = [
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'contact',
];

/**
 * Mengembalikan tint section beserta tint section sebelumnya. Tint sebelumnya
 * dipakai sebagai titik awal gradien di bagian atas section, sehingga batas
 * antar section melebur tanpa garis potong.
 */
export function getSurface(id) {
  const index = SECTION_ORDER.indexOf(id);
  const base = SECTION_TINTS[id] ?? SECTION_TINTS.home;
  if (index <= 0) return { base, previous: base };
  const previousId = SECTION_ORDER[index - 1];
  return { base, previous: SECTION_TINTS[previousId] ?? base };
}
