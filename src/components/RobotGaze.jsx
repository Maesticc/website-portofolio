import { createContext, useContext, useEffect, useMemo, useRef } from 'react';

/**
 * RobotGaze
 * Sistem arah pandang terpusat untuk maskot robot.
 *
 * Ada tiga sumber perhatian, dengan urutan prioritas:
 *   1. Attractor  : elemen tertentu yang sedang disorot pengguna, misalnya
 *                   tautan navigasi. Robot menoleh ke arah elemen itu.
 *   2. Kursor     : posisi kursor terakhir.
 *   3. Diam       : bila kursor tidak bergerak beberapa saat, robot beralih
 *                   ke perilaku diam, yaitu memandang sekeliling perlahan.
 *
 * Seluruh nilai disimpan dalam ref, bukan state, sehingga tidak ada satu pun
 * render ulang React saat kursor bergerak. Hanya ada SATU listener pointer
 * untuk seluruh halaman, bukan satu per komponen.
 */
const GazeContext = createContext(null);

export function RobotGazeProvider({ children }) {
  // Titik yang sedang diperhatikan, dalam koordinat viewport.
  const pointer = useRef({ x: null, y: null });
  // Pusat elemen yang sedang menarik perhatian, bila ada.
  const attractor = useRef(null);
  // Penanda waktu gerakan kursor terakhir, untuk mendeteksi kondisi diam.
  const lastPointerAt = useRef(0);
  // Naik setiap kali attractor berganti, dipakai robot untuk bereaksi sekali.
  const attractorEpoch = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = !window.matchMedia('(hover: none)').matches;

    // Perangkat sentuh tidak punya kursor, dan pengguna yang meminta gerak
    // minimal tidak perlu dilacak sama sekali. Keduanya dilewati agar tidak
    // ada pekerjaan sia-sia.
    if (reduce || !canHover) return;

    let raf = 0;
    let queued = null;

    const commit = () => {
      raf = 0;
      if (!queued) return;
      pointer.current = queued;
      lastPointerAt.current = performance.now();
    };

    const onMove = (e) => {
      queued = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(commit);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Ref bersifat stabil, jadi objek api tidak perlu dibuat ulang.
  const api = useMemo(
    () => ({
      pointer,
      attractor,
      lastPointerAt,
      attractorEpoch,

      /** Minta robot menoleh ke arah sebuah elemen. */
      lookAt(el) {
        if (!el) return;
        const r = el.getBoundingClientRect();
        attractor.current = {
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
        };
        attractorEpoch.current += 1;
      },

      /** Lepaskan perhatian, robot kembali mengikuti kursor. */
      stopLooking() {
        if (!attractor.current) return;
        attractor.current = null;
        attractorEpoch.current += 1;
      },
    }),
    [],
  );

  return <GazeContext.Provider value={api}>{children}</GazeContext.Provider>;
}

export function useRobotGaze() {
  return useContext(GazeContext);
}

/**
 * useGazeAttractor
 * Mengembalikan sekumpulan handler untuk ditempelkan pada elemen apa pun yang
 * boleh menarik perhatian robot, misalnya tautan navigasi.
 *
 * Menyertakan onFocus dan onBlur, sehingga pengguna keyboard mendapat reaksi
 * yang sama dengan pengguna mouse.
 */
export function useGazeAttractor() {
  const gaze = useRobotGaze();

  return useMemo(() => {
    if (!gaze) return {};
    return {
      onMouseEnter: (e) => gaze.lookAt(e.currentTarget),
      onMouseLeave: () => gaze.stopLooking(),
      onFocus: (e) => gaze.lookAt(e.currentTarget),
      onBlur: () => gaze.stopLooking(),
    };
  }, [gaze]);
}
