/* =============================================================================
 * SectionDivider
 * Pemisah sinematik antar section, bergaya luar angkasa.
 *
 * Tujuannya memberi jeda visual halus, sekadar berkata "kamu memasuki bab
 * berikutnya", tanpa memutus lingkungan yang menerus. Karena itu:
 *  - tidak ada kotak, tidak ada garis horizontal tebal, tidak ada latar solid
 *  - garisnya sangat tipis dan memudar ke transparan di kedua ujung, jadi tidak
 *    terbaca sebagai batas persegi
 *  - ada titik bintang lembut bercahaya di tengah, dengan busur orbit kecil
 *  - banyak ruang kosong di atas dan bawah untuk ritme visual
 *  - seluruhnya dekoratif dan aria-hidden
 *
 * Warna mengikuti aksen bersama situs (biru keunguan lembut), jadi tetap satu
 * bahasa warna dengan lingkungan dan momen tiap section.
 *
 * Komponen ini murni presentasional dan tidak menyentuh konten, tipografi,
 * atau elemen interaktif. Diletakkan di antara section pada App.
 */

const ACCENT = '150, 176, 235';

export default function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none relative z-10 flex items-center justify-center py-16 sm:py-20 lg:py-24"
    >
      <div className="relative flex w-full max-w-3xl items-center justify-center px-6">
        {/* Garis kiri: memudar dari transparan ke tengah, tepinya lembut */}
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${ACCENT},0.28))`,
            filter: 'blur(0.2px)',
          }}
        />

        {/* Simpul tengah: busur orbit tipis, halo lembut, dan bintang kecil */}
        <span className="relative mx-5 flex h-10 w-10 shrink-0 items-center justify-center">
          {/* busur orbit kecil, hanya sebagian lingkaran agar terasa ringan */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path
              d="M6 20 A14 14 0 0 1 34 20"
              stroke={`rgba(${ACCENT},0.22)`}
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <path
              d="M34 20 A14 14 0 0 1 6 20"
              stroke={`rgba(${ACCENT},0.1)`}
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>

          {/* halo lembut di sekitar bintang */}
          <span
            className="absolute h-6 w-6 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${ACCENT},0.28) 0%, transparent 70%)`,
              filter: 'blur(2px)',
            }}
          />

          {/* bintang kecil di pusat, berbentuk empat sudut lembut */}
          <span
            className="relative block h-1.5 w-1.5 rotate-45"
            style={{
              background: 'rgba(224, 236, 255, 0.9)',
              boxShadow: `0 0 6px 1px rgba(${ACCENT},0.6)`,
              borderRadius: '1px',
            }}
          />
        </span>

        {/* Garis kanan: cermin dari yang kiri */}
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, rgba(${ACCENT},0.28), transparent)`,
            filter: 'blur(0.2px)',
          }}
        />
      </div>

      {/* dua titik debu kecil di atas dan bawah simpul, menambah kesan ruang */}
      <span
        className="absolute left-1/2 top-6 h-[3px] w-[3px] -translate-x-1/2 rounded-full sm:top-8"
        style={{ background: `rgba(${ACCENT},0.4)` }}
      />
      <span
        className="absolute bottom-6 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full sm:bottom-8"
        style={{ background: `rgba(${ACCENT},0.3)` }}
      />
    </div>
  );
}
