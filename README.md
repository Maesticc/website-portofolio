# Galaxy Portfolio

Website portofolio pribadi bertema galaksi, dibangun dengan React, Vite, dan Tailwind CSS. Halaman utamanya menampilkan maskot robot penjelajah yang berdiri di atas lanskap planet berbatu di bawah langit Bima Sakti, dengan mata yang mengikuti kursor.

## Fitur

- Langit Bima Sakti prosedural berbasis canvas, dengan variasi kepadatan bintang yang alami
- Lanskap planet berbatu dengan siluet organik, batu, kawah, dan retakan
- Maskot robot interaktif: mata mengikuti kursor, bereaksi ke navigasi, dan menyapa pengunjung
- Section Skills berupa keyboard mekanik 3D interaktif
- Navigasi pill mengapung yang muncul saat berhenti scroll
- Tiap section punya warna latar sendiri sehingga terasa berpindah halaman

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:5173

## Build produksi

```bash
npm run build
npm run preview
```

## Struktur

- `src/components/` komponen tiap section dan elemen visual
- `src/data/content.js` seluruh teks dan data, satu tempat untuk personalisasi
- `src/data/theme.js` warna latar tiap section

## Teknologi

React, Vite, Tailwind CSS, Motion, react-icons.
