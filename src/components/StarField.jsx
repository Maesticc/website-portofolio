import { useEffect, useRef } from 'react';

/**
 * StarField
 * Langit malam bergaya astrofotografi, dibangun secara prosedural.
 *
 * Yang membuat langit terasa nyata bukan jumlah bintangnya, melainkan
 * VARIASI KEPADATANNYA. Di sini kepadatan bintang ditentukan sebuah fungsi
 * yang meniru struktur Bima Sakti:
 *
 *   1. Ada pita galaksi yang membentang diagonal, terbit dari cakrawala kiri
 *      bawah menuju kanan atas. Kepadatan bintang meluruh menjauhi pita.
 *   2. Sepanjang pita ada dua gumpalan terang, di dekat cakrawala dan di
 *      kanan atas, dengan bagian tengah yang jauh lebih redup.
 *   3. Ada jalur debu gelap yang membelah pita di bagian tengah. Ini ciri
 *      paling khas foto Bima Sakti sungguhan, dan sekaligus alasan area di
 *      belakang judul tetap gelap sehingga teks tetap terbaca.
 *   4. Ada beberapa gugus bintang yang membuat sebarannya menggerombol,
 *      bukan tersebar rata.
 *   5. Mendekati cakrawala, kabut atmosfer memudarkan bintang.
 *
 * Kinerja. Ini pelajaran dari keluhan sebelumnya bahwa halaman terasa berat:
 *   - Langit digambar SEKALI ke kanvas statis. Nebulositas dan ribuan bintang
 *     redup tidak pernah digambar ulang.
 *   - Kanvas kedua yang tipis hanya berisi sekitar 40 bintang berkelip dan
 *     meteor yang jarang. Hanya kanvas inilah yang menggambar per frame, dan
 *     dibatasi 30 frame per detik.
 *   - Nebula memakai sprite yang dibuat sekali, lalu ditempel ulang dengan
 *     drawImage. Membuat radial gradient ratusan kali jauh lebih mahal.
 *   - Loop berhenti total saat tab tidak aktif.
 *   - prefers-reduced-motion mematikan seluruh gerak; langit statis tetap utuh.
 *
 * Sebaran bintang memakai generator acak berbenih, sehingga langit selalu
 * sama pada setiap render dan tidak berkedip saat komponen dirender ulang.
 */

/* ---------- generator acak berbenih ---------- */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SKY_SEED = 20260915;

/* ---------- geometri pita galaksi ---------- */
function makeBand(w, h) {
  const A = { x: -0.2 * w, y: 1.24 * h };
  const B = { x: 1.2 * w, y: -0.24 * h };
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy);
  return {
    A,
    len,
    ux: dx / len,
    uy: dy / len,
    nx: -dy / len,
    ny: dx / len,
  };
}

function bandPoint(band, t, u) {
  return {
    x: band.A.x + band.ux * band.len * t + band.nx * u,
    y: band.A.y + band.uy * band.len * t + band.ny * u,
  };
}

function bandCoords(band, x, y) {
  const px = x - band.A.x;
  const py = y - band.A.y;
  return {
    t: (px * band.ux + py * band.uy) / band.len,
    u: px * band.nx + py * band.ny,
  };
}

const gauss = (v, c, s) => Math.exp(-(((v - c) / s) ** 2));

/* Profil kecerahan sepanjang pita: terang di dekat cakrawala, redup di
 * tengah, terang lagi di kanan atas. */
function bandProfile(t) {
  return 0.18 + 1.05 * gauss(t, 0.19, 0.145) + 0.88 * gauss(t, 0.82, 0.17);
}

/* ---------- sprite nebula, dibuat sekali lalu dipakai ulang ---------- */
const NEBULA_TINTS = [
  '150, 172, 210', // biru pucat, tulang punggung pita
  '104, 122, 176', // biru
  '116, 100, 158', // ungu redam
  '206, 198, 186', // putih hangat, inti gumpalan
  '158, 118, 122', // merah jambu berdebu, dekat cakrawala
  '148, 122, 100', // cokelat kekuningan, kabut rendah
];
const DUST_TINT = '7, 8, 15'; // jalur debu gelap

function makePuffSprite(tint, size) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, `rgba(${tint},1)`);
  grad.addColorStop(0.32, `rgba(${tint},0.5)`);
  grad.addColorStop(0.62, `rgba(${tint},0.16)`);
  grad.addColorStop(1, `rgba(${tint},0)`);
  g.fillStyle = grad;
  g.beginPath();
  g.arc(r, r, r, 0, Math.PI * 2);
  g.fill();
  return c;
}

/* ---------- warna bintang, mengikuti kelas spektrum, sengaja diredam ---------- */
const STAR_TINTS = [
  { c: '228, 234, 246', w: 0.52 }, // putih kebiruan
  { c: '198, 216, 246', w: 0.16 }, // biru pucat
  { c: '246, 238, 218', w: 0.16 }, // putih hangat
  { c: '242, 208, 172', w: 0.11 }, // jingga
  { c: '236, 184, 164', w: 0.05 }, // kemerahan
];

function pickTint(rnd) {
  let r = rnd();
  for (const t of STAR_TINTS) {
    if (r < t.w) return t.c;
    r -= t.w;
  }
  return STAR_TINTS[0].c;
}

export default function StarField() {
  const staticRef = useRef(null);
  const liveRef = useRef(null);
  const wrapRef = useRef(null);
  const twinklers = useRef([]);

  useEffect(() => {
    const staticCanvas = staticRef.current;
    const liveCanvas = liveRef.current;
    const wrap = wrapRef.current;
    if (!staticCanvas || !liveCanvas || !wrap) return;

    const sctx = staticCanvas.getContext('2d');
    const lctx = liveCanvas.getContext('2d');
    if (!sctx || !lctx) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let frame = 0;
    let running = true;
    let resizeTimer = 0;
    let lastFrameAt = 0;
    let nextMeteorAt = 0;
    let meteors = [];

    /* =====================================================================
     * MENGGAMBAR LANGIT STATIS
     * ================================================================== */
    function paintSky() {
      const rnd = mulberry32(SKY_SEED);
      const band = makeBand(w, h);
      const area = w * h;

      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(0, 0, w, h);

      /* ---- 1. Dasar langit: biru dongker yang menggelap ke atas ---- */
      const base = sctx.createLinearGradient(0, 0, w * 0.25, h);
      base.addColorStop(0, '#05060f');
      base.addColorStop(0.45, '#070914');
      base.addColorStop(0.78, '#0a0c18');
      base.addColorStop(1, '#0c0e18');
      sctx.fillStyle = base;
      sctx.fillRect(0, 0, w, h);

      /* Sedikit ungu tua di kuadran kanan atas, arah pusat galaksi */
      const violet = sctx.createRadialGradient(
        w * 0.82,
        h * 0.1,
        0,
        w * 0.82,
        h * 0.1,
        Math.max(w, h) * 0.72,
      );
      violet.addColorStop(0, 'rgba(58, 46, 92, 0.3)');
      violet.addColorStop(0.5, 'rgba(38, 32, 66, 0.12)');
      violet.addColorStop(1, 'rgba(0,0,0,0)');
      sctx.fillStyle = violet;
      sctx.fillRect(0, 0, w, h);

      /* ---- 2. Gumpalan awan bintang sepanjang pita ---- */
      const sprites = NEBULA_TINTS.map((t) => makePuffSprite(t, 192));
      const dustSprite = makePuffSprite(DUST_TINT, 192);

      const puffCount = Math.round(Math.min(300, Math.max(120, area / 5200)));
      const spread = 0.125 * h;

      sctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < puffCount; i += 1) {
        const t = rnd();
        const profile = bandProfile(t);
        /* Gumpalan mengikuti sebaran normal di sekitar sumbu pita */
        const u = (rnd() + rnd() + rnd() - 1.5) * spread * 1.25;
        const p = bandPoint(band, t, u);
        if (p.x < -260 || p.x > w + 260 || p.y < -260 || p.y > h + 260) continue;

        /* Warna dipilih menurut posisi: inti hangat di tengah pita, biru dan
           ungu di pinggirnya, merah jambu berdebu mendekati cakrawala. */
        const edge = Math.abs(u) / (spread * 1.6);
        let idx;
        if (p.y > h * 0.72 && rnd() < 0.55) idx = rnd() < 0.5 ? 4 : 5;
        else if (edge < 0.4) idx = rnd() < 0.42 ? 3 : 0;
        else if (edge < 0.9) idx = rnd() < 0.6 ? 0 : 1;
        else idx = rnd() < 0.55 ? 2 : 1;

        const size = (0.1 + rnd() * 0.26) * Math.min(w, h) * (1 + edge * 0.5);
        const alpha = 0.032 * profile * (1 - edge * 0.45) * (0.6 + rnd() * 0.7);
        if (alpha <= 0.001) continue;

        sctx.globalAlpha = Math.min(0.09, alpha);
        sctx.drawImage(sprites[idx], p.x - size / 2, p.y - size / 2, size, size);
      }
      sctx.globalCompositeOperation = 'source-over';
      sctx.globalAlpha = 1;

      /* ---- 3. Jalur debu gelap yang membelah pita ----
         Digambar setelah awan, memakai warna dasar langit, sehingga benar
         benar mengurangi cahaya seperti debu yang menghalangi. Letaknya di
         bagian tengah pita, tepat di belakang judul. */
      const dustCount = Math.round(Math.min(90, Math.max(36, area / 17000)));
      for (let i = 0; i < dustCount; i += 1) {
        const t = 0.3 + rnd() * 0.42;
        const u = -0.04 * h + (rnd() + rnd() - 1) * 0.055 * h;
        const p = bandPoint(band, t, u);
        const size = (0.09 + rnd() * 0.2) * Math.min(w, h);
        sctx.globalAlpha = 0.16 + rnd() * 0.2;
        sctx.drawImage(dustSprite, p.x - size / 2, p.y - size / 2, size, size);
      }
      /* Beberapa jalur debu tipis di gumpalan kanan atas */
      for (let i = 0; i < Math.round(dustCount * 0.4); i += 1) {
        const t = 0.72 + rnd() * 0.2;
        const u = 0.03 * h + (rnd() + rnd() - 1) * 0.05 * h;
        const p = bandPoint(band, t, u);
        const size = (0.07 + rnd() * 0.14) * Math.min(w, h);
        sctx.globalAlpha = 0.12 + rnd() * 0.14;
        sctx.drawImage(dustSprite, p.x - size / 2, p.y - size / 2, size, size);
      }
      sctx.globalAlpha = 1;

      /* ---- 4. Gugus bintang, supaya sebarannya menggerombol ---- */
      const clusters = [];
      for (let i = 0; i < 6; i += 1) {
        const t = rnd();
        const u = (rnd() - 0.5) * spread * 1.6;
        const p = bandPoint(band, t, u);
        clusters.push({
          x: p.x,
          y: p.y,
          r: (0.05 + rnd() * 0.09) * Math.min(w, h),
          k: 0.5 + rnd() * 1.1,
        });
      }

      /* ---- 5. Fungsi kepadatan bintang ---- */
      const textCx = w * 0.5;
      const textCy = h * 0.45;

      function density(x, y) {
        const { t, u } = bandCoords(band, x, y);
        const bandTerm = Math.exp(-((u / spread) ** 2)) * bandProfile(t);

        /* jalur debu juga mengurangi jumlah bintang yang terlihat */
        const rift =
          1 -
          0.74 *
            gauss(u, -0.04 * h, 0.05 * h) *
            gauss(t, 0.5, 0.19);

        /* area di belakang judul dijaga tetap lengang */
        const text =
          1 -
          0.5 *
            Math.exp(
              -(
                ((x - textCx) / (0.36 * w)) ** 2 +
                ((y - textCy) / (0.2 * h)) ** 2
              ),
            );

        /* kabut dekat cakrawala memudarkan bintang */
        const horizon =
          y > h * 0.7 ? Math.max(0.12, 1 - (y - h * 0.7) / (h * 0.3)) : 1;

        let clump = 1;
        for (const c of clusters) {
          clump += c.k * Math.exp(-(((x - c.x) ** 2 + (y - c.y) ** 2) / (c.r * c.r)));
        }

        return Math.max(0, (0.12 + 1.05 * bandTerm) * clump * rift * text * horizon);
      }

      /* ---- 6. Bintang, disebar dengan penolakan sampel ---- */
      const target = Math.round(Math.min(1600, Math.max(320, area / 1150)));
      const maxDensity = 3.4;
      const twinkleList = [];
      let placed = 0;
      let guard = 0;

      while (placed < target && guard < target * 24) {
        guard += 1;
        const x = rnd() * w;
        const y = rnd() * h;
        if (rnd() * maxDensity > density(x, y)) continue;

        placed += 1;

        /* Kecerahan mengikuti hukum pangkat: sangat banyak yang redup, hanya
           sedikit yang benar benar terang. */
        const mag = Math.pow(rnd(), 3.1);
        const radius = 0.34 + mag * 1.75;
        const alpha = 0.16 + mag * 0.74;
        const tint = pickTint(rnd);

        /* Sekitar tiga persen bintang paling terang dipindahkan ke lapisan
           berkelip. Sisanya tetap di lapisan statis. */
        if (mag > 0.74 && twinkleList.length < 44) {
          twinkleList.push({
            x,
            y,
            radius,
            alpha,
            tint,
            phase: rnd() * Math.PI * 2,
            speed: 0.32 + rnd() * 0.55,
          });
          continue;
        }

        sctx.fillStyle = `rgba(${tint},${alpha.toFixed(3)})`;
        sctx.beginPath();
        sctx.arc(x, y, radius, 0, Math.PI * 2);
        sctx.fill();

        /* Bintang terang mendapat halo lembut, bukan cahaya neon */
        if (mag > 0.5) {
          const halo = sctx.createRadialGradient(x, y, 0, x, y, radius * 5.5);
          halo.addColorStop(0, `rgba(${tint},${(alpha * 0.2).toFixed(3)})`);
          halo.addColorStop(1, `rgba(${tint},0)`);
          sctx.fillStyle = halo;
          sctx.beginPath();
          sctx.arc(x, y, radius * 5.5, 0, Math.PI * 2);
          sctx.fill();
        }
      }
      twinklers.current = twinkleList;

      /* ---- 7. Warna atmosfer dekat cakrawala ----
         Merah jambu dan jingga yang sangat tipis, seperti pijar udara di
         langit malam. Sengaja tidak jenuh supaya tidak terasa palsu. */
      const airglow = sctx.createLinearGradient(0, h * 0.62, 0, h);
      airglow.addColorStop(0, 'rgba(0,0,0,0)');
      airglow.addColorStop(0.55, 'rgba(96, 62, 74, 0.1)');
      airglow.addColorStop(1, 'rgba(122, 82, 76, 0.2)');
      sctx.fillStyle = airglow;
      sctx.fillRect(0, h * 0.62, w, h * 0.38);

      /* Pijar hangat di kiri bawah, sejalan dengan arah sumber cahaya adegan */
      const warm = sctx.createRadialGradient(
        w * 0.2,
        h * 1.02,
        0,
        w * 0.2,
        h * 1.02,
        Math.max(w, h) * 0.6,
      );
      warm.addColorStop(0, 'rgba(150, 104, 92, 0.2)');
      warm.addColorStop(0.45, 'rgba(110, 80, 82, 0.08)');
      warm.addColorStop(1, 'rgba(0,0,0,0)');
      sctx.fillStyle = warm;
      sctx.fillRect(0, h * 0.5, w, h * 0.5);

      /* ---- 8. Penggelapan di belakang judul ----
         Lapisan terakhir. Memakai warna dasar langit, jadi terbaca sebagai
         wilayah langit yang memang gelap, bukan sebagai kotak hitam. */
      const mask = sctx.createRadialGradient(
        textCx,
        textCy,
        0,
        textCx,
        textCy,
        Math.max(w, h) * 0.46,
      );
      mask.addColorStop(0, 'rgba(5, 6, 13, 0.6)');
      mask.addColorStop(0.42, 'rgba(5, 6, 13, 0.34)');
      mask.addColorStop(1, 'rgba(5, 6, 13, 0)');
      sctx.fillStyle = mask;
      sctx.fillRect(0, 0, w, h);

      /* ---- 9. Vignette sinematik ---- */
      const vig = sctx.createRadialGradient(
        w * 0.5,
        h * 0.46,
        Math.min(w, h) * 0.3,
        w * 0.5,
        h * 0.46,
        Math.max(w, h) * 0.82,
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(3, 4, 9, 0.7)');
      sctx.fillStyle = vig;
      sctx.fillRect(0, 0, w, h);
    }

    /* =====================================================================
     * LAPISAN HIDUP: bintang berkelip dan meteor
     * ================================================================== */
    function spawnMeteor() {
      const fromLeft = Math.random() > 0.4;
      const angle = fromLeft
        ? 0.3 + Math.random() * 0.22
        : Math.PI - (0.3 + Math.random() * 0.22);
      const speed = 6.5 + Math.random() * 4;
      meteors.push({
        x: fromLeft ? Math.random() * w * 0.55 : w * 0.45 + Math.random() * w * 0.55,
        y: -40 + Math.random() * h * 0.35,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 52 + Math.random() * 34,
        len: 80 + Math.random() * 90,
      });
    }

    function paintLive(time) {
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lctx.clearRect(0, 0, w, h);

      const t = time / 1000;
      for (const s of twinklers.current) {
        const k = 0.62 + 0.38 * Math.sin(t * s.speed + s.phase);
        const a = s.alpha * k;
        lctx.fillStyle = `rgba(${s.tint},${a.toFixed(3)})`;
        lctx.beginPath();
        lctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        lctx.fill();

        const halo = lctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          s.radius * 6,
        );
        halo.addColorStop(0, `rgba(${s.tint},${(a * 0.22).toFixed(3)})`);
        halo.addColorStop(1, `rgba(${s.tint},0)`);
        lctx.fillStyle = halo;
        lctx.beginPath();
        lctx.arc(s.x, s.y, s.radius * 6, 0, Math.PI * 2);
        lctx.fill();
      }

      for (let i = meteors.length - 1; i >= 0; i -= 1) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life += 1;
        const p = m.life / m.maxLife;
        if (p >= 1 || m.x < -200 || m.x > w + 200 || m.y > h + 200) {
          meteors.splice(i, 1);
          continue;
        }
        const fade = Math.sin(Math.PI * p);
        const mag = Math.hypot(m.vx, m.vy) || 1;
        const tx = m.x - (m.vx / mag) * m.len;
        const ty = m.y - (m.vy / mag) * m.len;
        const grad = lctx.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, `rgba(236,242,255,${0.72 * fade})`);
        grad.addColorStop(0.4, `rgba(186,204,238,${0.26 * fade})`);
        grad.addColorStop(1, 'rgba(150,170,210,0)');
        lctx.strokeStyle = grad;
        lctx.lineWidth = 1.6;
        lctx.lineCap = 'round';
        lctx.beginPath();
        lctx.moveTo(m.x, m.y);
        lctx.lineTo(tx, ty);
        lctx.stroke();
      }
    }

    /* ---------- loop, dibatasi 30 frame per detik ---------- */
    const FRAME_MS = 1000 / 30;

    function loop(time) {
      if (!running) return;
      frame = requestAnimationFrame(loop);
      if (time - lastFrameAt < FRAME_MS) return;
      lastFrameAt = time;

      if (time > nextMeteorAt) {
        spawnMeteor();
        nextMeteorAt = time + 11000 + Math.random() * 16000;
      }
      paintLive(time);
    }

    /* ---------- ukuran ---------- */
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;

      for (const c of [staticCanvas, liveCanvas]) {
        c.width = Math.floor(w * dpr);
        c.height = Math.floor(h * dpr);
        c.style.width = `${w}px`;
        c.style.height = `${h}px`;
      }

      paintSky();
      meteors = [];
    }

    /* Menggambar langit itu pekerjaan berat, jadi resize ditunda sebentar
       supaya tidak dijalankan berulang saat jendela sedang diseret. */
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 220);
    }

    /* ---------- paralaks halus lewat transform, bukan menggambar ulang ---------- */
    let pointerAt = 0;
    function onPointerMove(e) {
      const now = performance.now();
      if (now - pointerAt < 70) return;
      pointerAt = now;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      wrap.style.transform = `translate3d(${(nx * -12).toFixed(2)}px, ${(ny * -8).toFixed(2)}px, 0)`;
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!reduceMotion) {
        running = true;
        lastFrameAt = 0;
        frame = requestAnimationFrame(loop);
      }
    }

    resize();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    if (!reduceMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      nextMeteorAt = performance.now() + 6000;
      frame = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void"
    >
      <div
        ref={wrapRef}
        className="absolute inset-0 will-change-transform"
        style={{ transition: 'transform 0.5s cubic-bezier(0.32,0.72,0,1)' }}
      >
        {/* Langit: digambar sekali, tidak pernah digambar ulang */}
        <canvas ref={staticRef} className="absolute inset-0 h-full w-full" />
        {/* Bintang berkelip dan meteor */}
        <canvas ref={liveRef} className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}
