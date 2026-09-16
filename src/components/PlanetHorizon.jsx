import { SECTION_SURFACES } from '../data/theme';

/**
 * PlanetHorizon
 * Lanskap berbatu di planet asing, tempat maskot robot berdiri.
 *
 * Susunan kedalamannya tiga tingkat, dan tekstur fisiknya makin kuat ke depan:
 *
 *   LATAR      : langit Bima Sakti, ditangani StarField.
 *   TENGAH     : cakrawala planet yang jauh beserta kabut atmosfer. Halus,
 *                pucat, rendah kontras, karena banyak udara yang dilewati
 *                cahaya. Cakrawala yang jauh memang mulus, itu wajar.
 *   DEPAN      : tanah berbatu tempat robot berdiri. Di sinilah seluruh
 *                tekstur fisik berada: bongkahan batu, kerikil, kawah, retakan,
 *                bercak tanah, debu, dan bayangan.
 *
 * Siluet tanahnya dibangun dengan midpoint displacement, bukan kurva bezier.
 * Itu sebabnya tepinya bergerigi dan tidak beraturan, sehingga tidak lagi
 * terbaca sebagai panggung bertingkat.
 *
 * Bongkahan batu TIDAK ikut diregangkan bersama siluet tanah. Siluet memakai
 * preserveAspectRatio none karena garis tanah yang organik memang tidak
 * masalah kalau melebar, tetapi batu dirender sebagai SVG terpisah dengan
 * rasio tetap. Kalau tidak, batu akan tampak seperti paku tipis di layar
 * ponsel dan melebar aneh di layar lebar.
 *
 * Ukuran batu ditetapkan relatif terhadap tinggi robot lewat --bot-h, jadi
 * hubungan skala antara robot dan bebatuan tetap masuk akal di semua layar.
 *
 * SATU sumber cahaya untuk seluruh adegan: pucat kebiruan, datang dari KIRI
 * BAWAH di balik cakrawala. Setiap batu mendapat bidang terang di sisi kiri,
 * dan bayangannya jatuh ke kanan. Rim light pada robot memakai arah yang sama.
 */

/* Cahaya pucat kebiruan, sengaja tidak jenuh supaya tidak terasa neon. */
const LIGHT = '186, 214, 255';
/* Warna permukaan section berikutnya, tujuan peralihan warna. */
const NEXT_SURFACE = SECTION_SURFACES.about;

/* Palet tanah: arang, kelabu gelap, kelabu kebiruan redam, sedikit tanah
 * kecokelatan. Sengaja tidak ada ungu atau biru menyala. Warna dibiarkan
 * datang dari langit. */
const SOIL = {
  farRock: '#242c39', // kelabu kebiruan, jauh dan berkabut
  midRock: '#161c25', // kelabu gelap
  nearRock: '#0e121a', // arang, paling dekat
  rockBody: '#131821', // badan bongkahan batu
  earth: '44, 36, 24', // cokelat tanah, dipakai sangat tipis sebagai bercak
};

/* ==========================================================================
 * Pembangkit lanskap. Dijalankan sekali saat modul dimuat, memakai generator
 * acak berbenih supaya bentuk tanah selalu sama di setiap render dan tidak
 * berubah saat komponen dirender ulang.
 * ======================================================================= */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Garis tanah bergerigi lewat midpoint displacement.
 *
 * Peluruhan amplitudo dibuat lambat (sekitar 0,74) supaya gerigi halus tetap
 * bertahan sampai tingkat terakhir. Kalau peluruhannya cepat, detail kecilnya
 * hilang dan garisnya kembali terbaca mulus seperti panggung.
 *
 * Di batas atas dan bawah, simpangan dipantulkan ke dalam, bukan dipotong.
 * Memotong akan membuat bagian yang menyentuh batas menjadi rata.
 */
function jaggedLine(rnd, width, baseY, amp, depth, decay, minY, maxY) {
  let pts = [
    [0, baseY],
    [width, baseY],
  ];
  for (let d = 0; d < depth; d += 1) {
    const a = amp * decay ** d;
    const next = [];
    for (let i = 0; i < pts.length - 1; i += 1) {
      const p = pts[i];
      const q = pts[i + 1];
      next.push(p);
      let my = (p[1] + q[1]) / 2 + (rnd() * 2 - 1) * a;
      if (my < minY) my = minY + (minY - my) * 0.32;
      else if (my > maxY) my = maxY - (my - maxY) * 0.32;
      next.push([(p[0] + q[0]) / 2, my]);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
  }
  return pts;
}

const fmt = (n) => n.toFixed(1);

function lineToPath(pts, width, height) {
  return `M0 ${height} L${pts
    .map((p) => `${fmt(p[0])} ${fmt(p[1])}`)
    .join(' L')} L${width} ${height} Z`;
}

function lineToStroke(pts) {
  return `M${pts.map((p) => `${fmt(p[0])} ${fmt(p[1])}`).join(' L')}`;
}

/** Bongkahan batu tak beraturan, duduk di garis dasar viewBox 100x72. */
function rockShape(rnd) {
  const n = 8 + Math.floor(rnd() * 5);
  const pts = [];
  for (let i = 0; i <= n; i += 1) {
    const t = i / n;
    const a = Math.PI * (1 - t);
    const jitter = 0.66 + rnd() * 0.56;
    pts.push([
      50 + Math.cos(a) * 47,
      Math.max(3, 70 - Math.sin(a) * 60 * jitter),
    ]);
  }
  const body = `M3 70 L${pts
    .map((p) => `${fmt(p[0])} ${fmt(p[1])}`)
    .join(' L')} L97 70 Z`;

  /* Bidang yang menghadap cahaya: sisi kiri atas batu, ditarik ke arah pusat
     sehingga terbaca sebagai satu permukaan datar yang tersinari. */
  const left = pts.slice(0, Math.ceil(pts.length * 0.46));
  const lit = `M3 70 L${left
    .map((p) => `${fmt(p[0])} ${fmt(p[1])}`)
    .join(' L')} L${fmt(left[left.length - 1][0] - 12)} 70 Z`;

  /* Sisi kanan yang membelakangi cahaya. Dibuat sebagai bidang gelap
     tersendiri, bukan gradien beridentitas, supaya tidak perlu referensi
     antar SVG yang rapuh dan tidak menimbulkan id ganda di halaman. */
  const right = pts.slice(Math.floor(pts.length * 0.54));
  const shade = `M${fmt(right[0][0])} 70 L${right
    .map((p) => `${fmt(p[0])} ${fmt(p[1])}`)
    .join(' L')} L97 70 Z`;

  return { body, lit, shade };
}

function buildTerrain() {
  const rnd = mulberry32(73915);

  /* ---- garis tanah, dari yang jauh ke yang dekat ---- */
  const far = jaggedLine(rnd, 1200, 74, 17, 6, 0.72, 48, 98);
  const mid = jaggedLine(rnd, 1200, 88, 21, 6, 0.72, 58, 110);

  /* ---- tanah terdepan ----
     Punya gundukan di bagian tengah, tepat di tempat robot berdiri, supaya
     sepertiga bawah rodanya tertutup tanah.

     Urutannya penting. Gerigi dibuat lebih dulu, gundukan ditambahkan di
     atasnya, lalu seluruh garis diberi jitter halus sekali lagi. Tanpa
     langkah terakhir itu, lereng gundukan yang curam akan menelan gerigi
     halusnya dan garisnya kembali terlihat mulus. */
  const FG_W = 1440;
  const FG_H = 240;
  const RISE_CX = 760;
  const RISE_W = 245;
  let near = jaggedLine(rnd, FG_W, 206, 30, 7, 0.74, 176, 228);

  near = near.map(([x, y]) => [
    x,
    y - 198 * Math.exp(-(((x - RISE_CX) / RISE_W) ** 2)),
  ]);

  /* Jitter halus terakhir, memberi kekasaran seperti kerikil pada seluruh
     garis termasuk lereng gundukan. */
  near = near.map(([x, y]) => [x, y + (rnd() * 2 - 1) * 7.5]);

  /* Puncak dikunci pada y = 2 supaya perhitungan tumpang tindih dengan roda
     robot tetap persis seperti yang diverifikasi. */
  const peak = Math.min(...near.map((p) => p[1]));
  near = near.map(([x, y]) => [x, y + (2 - peak)]);

  /* Setelah digeser, sebagian titik bisa jatuh melewati dasar viewBox,
     sehingga tanah menghilang dan meninggalkan celah. Rentangnya dikompres
     secara proporsional, bukan dipotong, supaya gerigi tetap utuh sementara
     tanah selalu punya ketebalan yang terlihat. */
  const lowest = Math.max(...near.map((p) => p[1]));
  const CEILING = 224;
  if (lowest > CEILING) {
    const k = (CEILING - 2) / (lowest - 2);
    near = near.map(([x, y]) => [x, 2 + (y - 2) * k]);
  }

  /* Tinggi tanah pada koordinat x tertentu, dipakai untuk mendudukkan batu
     tepat di permukaan, bukan mengapung di atasnya. */
  function nearYAt(x) {
    let best = near[0];
    for (const p of near) {
      if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
    }
    return best[1];
  }

  /* ---- retakan tanah ---- */
  const cracks = [];
  for (let i = 0; i < 5; i += 1) {
    const x0 = 90 + rnd() * 1240;
    const y0 = 206 + rnd() * 22;
    let d = `M${fmt(x0)} ${fmt(y0)}`;
    let x = x0;
    let y = y0;
    const steps = 4 + Math.floor(rnd() * 4);
    for (let s = 0; s < steps; s += 1) {
      x += (rnd() * 2 - 1) * 44;
      y += 3 + rnd() * 7;
      d += ` L${fmt(x)} ${fmt(y)}`;
    }
    cracks.push(d);
  }

  /* ---- bercak tanah dan debu di permukaan ----
     Alpha ditulis langsung pada warnanya, tidak lewat atribut opacity
     terpisah, supaya tingkat kecerahannya jelas terbaca dari kodenya. */
  const patches = [];
  for (let i = 0; i < 9; i += 1) {
    const o = 0.05 + rnd() * 0.07;
    patches.push({
      cx: 40 + rnd() * 1360,
      cy: 208 + rnd() * 26,
      rx: 26 + rnd() * 62,
      ry: 4 + rnd() * 8,
      /* dua dari tiga bercak berupa debu terang, sisanya tanah kecokelatan */
      fill:
        i % 3 === 0
          ? `rgba(${SOIL.earth}, ${(o * 2.6).toFixed(3)})`
          : `rgba(${LIGHT}, ${o.toFixed(3)})`,
    });
  }

  /* ---- bongkahan batu ----
     Sengaja dijauhkan dari rentang 44 sampai 63 persen, yaitu tempat robot
     berdiri, supaya robot tidak tertutup. Di dekat robot hanya ada kerikil. */
  const rockSpots = [
    { left: 5, k: 0.3 },
    { left: 13, k: 0.19 },
    { left: 22, k: 0.36 },
    { left: 31, k: 0.14 },
    { left: 37, k: 0.24 },
    { left: 68, k: 0.22 },
    { left: 75, k: 0.34 },
    { left: 84, k: 0.17 },
    { left: 91, k: 0.28 },
    { left: 96, k: 0.2 },
  ];
  const rocks = rockSpots.map((spot) => {
    const shape = rockShape(rnd);
    const y = nearYAt((spot.left / 100) * FG_W);
    return {
      ...spot,
      ...shape,
      /* posisi dasar batu sebagai bagian dari tinggi lapisan tanah */
      seat: (FG_H - y) / FG_H,
      flip: rnd() < 0.42,
    };
  });

  /* ---- kerikil, termasuk di sekitar roda robot ---- */
  const stoneSpots = [
    2, 9, 17, 26, 34, 40, 43, 46, 48, 52, 56, 59, 62, 66, 71, 78, 82, 88, 94, 99,
  ];
  const stones = stoneSpots.map((left) => {
    const shape = rockShape(rnd);
    const y = nearYAt((left / 100) * FG_W);
    return {
      left,
      k: 0.035 + rnd() * 0.05,
      body: shape.body,
      lit: shape.lit,
      seat: (FG_H - y) / FG_H,
      flip: rnd() < 0.5,
    };
  });

  /* ---- kawah kecil ---- */
  const craters = [
    { left: 27, k: 0.16 },
    { left: 58, k: 0.11 },
    { left: 80, k: 0.13 },
  ].map((c) => {
    const y = nearYAt((c.left / 100) * FG_W);
    return { ...c, seat: (FG_H - y) / FG_H };
  });

  /* ---- batu kecil di kejauhan, di bawah garis cakrawala ---- */
  const distantRocks = [];
  for (let i = 0; i < 14; i += 1) {
    const shape = rockShape(rnd);
    distantRocks.push({
      left: 3 + rnd() * 94,
      k: 0.03 + rnd() * 0.045,
      body: shape.body,
      seat: 0.52 + rnd() * 0.2,
    });
  }

  return {
    FG_W,
    FG_H,
    far: { path: lineToPath(far, 1200, 120), stroke: lineToStroke(far) },
    mid: { path: lineToPath(mid, 1200, 120), stroke: lineToStroke(mid) },
    near: {
      path: lineToPath(near, FG_W, FG_H),
      stroke: lineToStroke(near),
    },
    cracks,
    patches,
    rocks,
    stones,
    craters,
    distantRocks,
  };
}

const T = buildTerrain();

/* Tinggi lapisan tanah terdepan. Dipakai berulang, jadi disimpan sekali. */
const FG_HEIGHT = 'calc(var(--horizon) - 2.1rem + var(--bot-h) * 0.055)';

/* ==========================================================================
 * Batu sebagai komponen tersendiri, dengan rasio tetap.
 * ======================================================================= */
function Rock({ left, k, body, lit, shade, seat, flip, tone = SOIL.rockBody }) {
  const size = `calc(var(--bot-h) * ${k})`;
  return (
    <svg
      viewBox="0 0 100 78"
      className="absolute"
      style={{
        left: `${left}%`,
        bottom: `calc(${FG_HEIGHT} * ${seat.toFixed(4)})`,
        width: size,
        height: 'auto',
        transform: `translateX(-50%)${flip ? ' scaleX(-1)' : ''}`,
      }}
    >
      {/* bayangan kontak, jatuh ke kanan menjauhi cahaya */}
      <ellipse cx="58" cy="70" rx="46" ry="6" fill="rgba(3,5,10,0.6)" />
      <path d={body} fill={tone} />
      {/* sisi kanan yang membelakangi cahaya */}
      <path d={shade} fill="rgba(4,6,12,0.42)" />
      {/* bidang yang menghadap cahaya */}
      <path d={lit} fill={`rgba(${LIGHT},0.09)`} />
      {/* tepi atas menangkap cahaya */}
      <path
        d={lit}
        fill="none"
        stroke={`rgba(${LIGHT},0.19)`}
        strokeWidth="1.2"
      />
    </svg>
  );
}

function Crater({ left, k, seat }) {
  const size = `calc(var(--bot-h) * ${k})`;
  return (
    <svg
      viewBox="0 0 100 40"
      className="absolute"
      style={{
        left: `${left}%`,
        bottom: `calc(${FG_HEIGHT} * ${seat.toFixed(4)})`,
        width: size,
        height: 'auto',
        transform: 'translateX(-50%)',
      }}
    >
      {/* cekungan */}
      <ellipse cx="50" cy="22" rx="44" ry="15" fill="rgba(4,6,11,0.66)" />
      {/* dinding dalam sisi kanan menerima cahaya dari kiri */}
      <path
        d="M8 22 A44 15 0 0 0 92 22"
        fill="none"
        stroke={`rgba(${LIGHT},0.13)`}
        strokeWidth="2.4"
      />
      {/* tanggul luar sisi kiri ikut tersinari */}
      <path
        d="M6 20 A46 16 0 0 1 50 5"
        fill="none"
        stroke={`rgba(${LIGHT},0.16)`}
        strokeWidth="1.6"
      />
    </svg>
  );
}

/* ==========================================================================
 * Cakrawala planet dan atmosfer. Lapisan tengah.
 * ======================================================================= */
export default function PlanetHorizon() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden"
      style={{ height: 'calc(var(--horizon) + 26vh)' }}
    >
      {/* ---- Hamburan atmosfer yang tinggi dan lemah. Selain memberi kesan
           udara, lapisan ini menaikkan sedikit tingkat gelap langit sehingga
           bintang di dekat cakrawala kehilangan kontras. Itu perilaku
           atmosfer yang sebenarnya, dan sekaligus menyatukan planet dengan
           latar galaksi di belakangnya. ---- */}
      <div
        className="absolute inset-x-0"
        style={{
          bottom: 'var(--horizon)',
          height: '24vh',
          background: `linear-gradient(0deg, rgba(${LIGHT},0.12) 0%, rgba(${LIGHT},0.05) 38%, rgba(${LIGHT},0.014) 68%, transparent 100%)`,
        }}
      />

      {/* Pijar hangat berdebu tepat di atas cakrawala, sisi kiri, sejalan
          dengan warna atmosfer di langit. */}
      <div
        className="absolute inset-x-0"
        style={{
          bottom: 'calc(var(--horizon) - 1vh)',
          height: '15vh',
          background:
            'radial-gradient(42% 100% at 22% 100%, rgba(158,116,104,0.14) 0%, rgba(140,104,100,0.05) 46%, transparent 76%)',
        }}
      />

      {/* Cahaya sumber di balik cakrawala */}
      <div
        className="absolute inset-x-0"
        style={{
          bottom: 'calc(var(--horizon) - 3vh)',
          height: '26vh',
          background: `radial-gradient(40% 100% at 20% 100%, rgba(${LIGHT},0.2) 0%, rgba(${LIGHT},0.07) 44%, transparent 74%)`,
        }}
      />

      {/* ================= BADAN PLANET =================
          Cakrawala yang jauh dibiarkan mulus. Itu memang wajar: horizon yang
          jauh tidak menunjukkan kekasaran permukaan. Seluruh kekasaran
          ditempatkan pada tanah di depan. */}
      <div
        className="absolute left-1/2 w-[300vw] -translate-x-1/2 overflow-hidden rounded-full"
        style={{
          top: '26vh',
          height: '300vw',
          background:
            'linear-gradient(180deg, #28313f 0px, #1d2531 46px, #151b24 110px, #0e131a 240px, #090c12 460px, #05070b 900px)',
          boxShadow: `inset 0 1px 0 rgba(${LIGHT},0.22), inset 0 12px 26px -14px rgba(${LIGHT},0.24)`,
        }}
      >
        {/* Terminator: sisi kiri tersinari, sisi kanan jatuh ke bayangan.
            Anak elemen dibuat selebar layar dan dipusatkan, supaya persentase
            gradiennya memetakan ke viewport, bukan ke lebar bola yang 300vw. */}
        <div
          className="absolute left-1/2 w-screen -translate-x-1/2"
          style={{
            top: 0,
            height: 'calc(var(--horizon) + 6vh)',
            background: `linear-gradient(97deg, rgba(${LIGHT},0.15) 0%, rgba(${LIGHT},0.055) 24%, rgba(${LIGHT},0.01) 46%, transparent 62%)`,
          }}
        />
        <div
          className="absolute left-1/2 w-screen -translate-x-1/2"
          style={{
            top: 0,
            height: 'calc(var(--horizon) + 6vh)',
            background:
              'linear-gradient(268deg, rgba(4,6,12,0.44) 0%, rgba(4,6,12,0.15) 28%, transparent 54%)',
          }}
        />

        {/* Bercak permukaan berkontras rendah: dataran berdebu dan cekungan */}
        <div
          className="absolute left-1/2 w-screen -translate-x-1/2"
          style={{
            top: 0,
            height: 'var(--horizon)',
            opacity: 0.5,
            background: `
              radial-gradient(closest-side at 14% 42%, rgba(${LIGHT},0.045), transparent),
              radial-gradient(closest-side at 33% 76%, rgba(0,0,0,0.16), transparent),
              radial-gradient(closest-side at 52% 30%, rgba(${LIGHT},0.03), transparent),
              radial-gradient(closest-side at 68% 64%, rgba(0,0,0,0.2), transparent),
              radial-gradient(closest-side at 86% 40%, rgba(0,0,0,0.14), transparent),
              radial-gradient(closest-side at 44% 92%, rgba(0,0,0,0.18), transparent)
            `,
            backgroundSize:
              '46% 60%, 34% 46%, 40% 52%, 30% 42%, 38% 50%, 26% 36%',
            backgroundPosition:
              '10% 30%, 26% 62%, 46% 20%, 62% 52%, 80% 30%, 38% 78%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Bukit jauh. Bergerigi, tetapi pucat dan rendah kontras karena
            perspektif atmosfer. */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute left-1/2 w-screen -translate-x-1/2"
          style={{
            top: 'calc(var(--horizon) * 0.03)',
            height: 'calc(var(--horizon) * 0.5)',
          }}
        >
          <path d={T.far.path} fill={SOIL.farRock} fillOpacity="0.4" />
          <path
            d={T.far.stroke}
            fill="none"
            stroke={`rgba(${LIGHT},0.14)`}
            strokeWidth="1.2"
          />
        </svg>

        {/* Bukit menengah, lebih gelap dan lebih tegas */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute left-1/2 w-screen -translate-x-1/2"
          style={{
            top: 'calc(var(--horizon) * 0.24)',
            height: 'calc(var(--horizon) * 0.54)',
          }}
        >
          <path d={T.mid.path} fill={SOIL.midRock} fillOpacity="0.82" />
          <path
            d={T.mid.stroke}
            fill="none"
            stroke={`rgba(${LIGHT},0.09)`}
            strokeWidth="1.1"
          />
        </svg>

        {/* Batu kecil di kejauhan, memecah garis tanah supaya tidak terbaca
            sebagai bidang datar.
            Dibungkus wadah selebar layar. Tanpa ini, persentase left akan
            mengacu ke lebar bola yang 300vw, sehingga hampir semua batu
            terlempar keluar layar. */}
        <div
          className="absolute left-1/2 w-screen -translate-x-1/2"
          style={{ top: 0, height: 'var(--horizon)' }}
        >
          {T.distantRocks.map((r, i) => (
            <svg
              key={i}
              viewBox="0 0 100 78"
              className="absolute"
              style={{
                left: `${r.left.toFixed(2)}%`,
                top: `calc(var(--horizon) * ${r.seat.toFixed(3)})`,
                width: `calc(var(--bot-h) * ${r.k.toFixed(3)})`,
                height: 'auto',
                transform: 'translateX(-50%)',
              }}
            >
              <path d={r.body} fill="rgba(14,18,25,0.78)" />
            </svg>
          ))}
        </div>

        {/* Genangan cahaya di tanah, tempat sinaran menyerempet permukaan */}
        <div
          className="absolute left-1/2 w-screen -translate-x-1/2"
          style={{
            top: 0,
            height: 'calc(var(--horizon) * 0.8)',
            background: `radial-gradient(58% 100% at 26% 0%, rgba(${LIGHT},0.1) 0%, rgba(${LIGHT},0.028) 40%, transparent 70%)`,
          }}
        />

        {/* Peralihan menuju section berikutnya. Warna dasar planet melebur ke
            warna permukaan section About, jadi tidak ada garis potong antara
            hero dan section sesudahnya. */}
        <div
          className="absolute left-1/2 w-screen -translate-x-1/2"
          style={{
            top: 'calc(var(--horizon) * 0.52)',
            height: 'calc(var(--horizon) * 0.48 + 1px)',
            background: `linear-gradient(180deg, transparent 0%, rgba(6,9,16,0.5) 46%, ${NEXT_SURFACE} 100%)`,
          }}
        />
      </div>

      {/* Sorotan pada tepi planet di sisi yang tersinari */}
      <div
        className="absolute inset-x-0"
        style={{
          bottom: 'calc(var(--horizon) - 2vh)',
          height: '8vh',
          background: `radial-gradient(34% 100% at 21% 0%, rgba(${LIGHT},0.22) 0%, transparent 66%)`,
        }}
      />
    </div>
  );
}

/* ==========================================================================
 * Tanah terdepan. Digambar DI DEPAN robot.
 *
 * Ini kunci agar robot terasa berdiri di dalam lanskap, bukan di depan sebuah
 * gambar lanskap. Sepertiga bawah rodanya tertutup tanah dan kabut permukaan,
 * lalu ada kerikil serta debu di sekeliling rodanya.
 * ======================================================================= */
export function HorizonForeground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 z-20"
      style={{ bottom: 0, height: 'calc(var(--horizon) + 2vh)' }}
    >
      {/* Kabut permukaan yang melarutkan kaki robot ke dalam tanah */}
      <div
        className="absolute inset-x-0"
        style={{
          bottom: 'calc(var(--horizon) - 2.4rem)',
          height: '3.6rem',
          background:
            'linear-gradient(0deg, rgba(9,12,20,0.6) 0%, rgba(9,12,20,0.2) 52%, transparent 100%)',
        }}
      />

      {/* ---- Siluet tanah terdepan ----
           Dibangun dengan midpoint displacement, jadi tepinya bergerigi dan
           tidak beraturan. Diregangkan penuh, dan itu tidak masalah karena
           garis tanah organik tetap terbaca wajar saat melebar. */}
      <svg
        viewBox={`0 0 ${T.FG_W} ${T.FG_H}`}
        preserveAspectRatio="none"
        className="absolute inset-x-0"
        style={{ bottom: 0, height: FG_HEIGHT }}
      >
        <path d={T.near.path} fill={SOIL.nearRock} />

        {/* Tepi tanah menangkap cahaya. Sisi kiri lebih terang, sisi kanan
            dibiarkan gelap karena membelakangi cahaya. */}
        <path
          d={T.near.stroke}
          fill="none"
          stroke={`rgba(${LIGHT},0.15)`}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Bercak tanah dan debu di permukaan */}
        {T.patches.map((p, i) => (
          <ellipse
            key={i}
            cx={p.cx}
            cy={p.cy}
            rx={p.rx}
            ry={p.ry}
            fill={p.fill}
          />
        ))}

        {/* Retakan tanah, dengan tepi tipis yang tersinari di satu sisi */}
        {T.cracks.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="rgba(3,4,9,0.85)" strokeWidth="1.8" />
            <path
              d={d}
              fill="none"
              stroke={`rgba(${LIGHT},0.07)`}
              strokeWidth="0.7"
              transform="translate(-1.2,-1.2)"
            />
          </g>
        ))}
      </svg>

      {/* ---- Kawah kecil ---- */}
      {T.craters.map((c, i) => (
        <Crater key={i} {...c} />
      ))}

      {/* ---- Bongkahan batu. Rasionya tetap, jadi bentuknya tidak melenceng
           di layar sempit maupun lebar. ---- */}
      {T.rocks.map((r, i) => (
        <Rock key={i} {...r} />
      ))}

      {/* ---- Kerikil, termasuk beberapa di sekitar roda robot ---- */}
      {T.stones.map((s, i) => (
        <Rock key={`s${i}`} {...s} tone={SOIL.rockBody} />
      ))}

      {/* ---- Debu di sekeliling roda robot ----
           Sedikit debu yang menempel di titik kontak, memberi kesan bobot dan
           menyatukan roda dengan permukaan. ---- */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 'calc(var(--horizon) - 2.9rem)',
          width: 'calc(var(--bot-h) * 1.5)',
          height: 'calc(var(--bot-h) * 0.2)',
          background:
            'radial-gradient(50% 100% at 50% 100%, rgba(44,38,32,0.34) 0%, rgba(30,28,26,0.14) 44%, transparent 74%)',
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 'calc(var(--horizon) - 2.5rem)',
          width: 'calc(var(--bot-h) * 1.05)',
          height: 'calc(var(--bot-h) * 0.1)',
          background:
            'radial-gradient(50% 100% at 46% 100%, rgba(3,5,10,0.5) 0%, transparent 72%)',
        }}
      />
    </div>
  );
}

/* ==========================================================================
 * Planet kecil jauh di langit. Lapisan kedalaman paling belakang di dalam
 * hero. Sisi kirinya tersinari, mengikuti arah cahaya yang sama.
 * ======================================================================= */
export function DistantPlanet() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-[14%] right-[9%] z-0 h-16 w-16 rounded-full sm:h-20 sm:w-20 lg:h-24 lg:w-24"
      style={{
        background:
          'radial-gradient(circle at 32% 30%, #3a4761 0%, #212a3a 42%, #10141d 72%, #0a0d13 100%)',
        boxShadow: `inset 7px 5px 16px -7px rgba(${LIGHT},0.26), 0 0 44px -14px rgba(122,150,200,0.16)`,
      }}
    />
  );
}
