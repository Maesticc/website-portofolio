/* =============================================================================
 * content.js — SATU-SATUNYA file yang perlu kamu edit untuk personalisasi.
 * Semua teks, project, pengalaman, dan skill diambil dari sini.
 * Cari tanda [EDIT] untuk bagian yang sebaiknya kamu ganti dengan data asli.
 * ========================================================================== */

import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiVite,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiCplusplus,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiPrisma,
  SiGit,
  SiGithub,
  SiDocker,
  SiLinux,
  SiFigma,
  SiTensorflow,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';

/* -----------------------------------------------------------------------------
 * PROFIL  [EDIT]
 * -------------------------------------------------------------------------- */
export const profile = {
  name: 'Darren Vincent',
  firstName: 'Darren',
  role: 'Computer Science Student',
  tagline: 'Menjelajah kode seperti menjelajah galaksi.',
  /* Hero: sapaan kecil, nama, lalu pernyataan utama. Pernyataan utama dipecah
   * per baris persis seperti yang diinginkan. */
  heroIntro: 'Hello, I am',
  heroStatement: ['Building interfaces', 'that feel', 'like outer space.'],
  /* heroHeadline lama tetap disimpan untuk kompatibilitas, tidak dipakai di
   * hero lagi. */
  heroHeadline: 'Building interfaces that feel\nlike outer space.',
  location: 'Jakarta, Indonesia',
  email: 'kamu@email.com',
  availableFor:
    'Frontend projects, portfolio website, dan kolaborasi seputar web development, AI, serta desain produk digital.',
  /* Kutipan maskot robot, muncul di samping robot saat disorot atau diketuk.
   * Terasa seperti robot berbicara kepada pengunjung.  [EDIT] */
  robotQuote: 'Every idea is a world waiting to be explored.',
  aboutParagraphs: [
    'Hai! Saya Darren Vincent, mahasiswa Computer Science yang tertarik membangun antarmuka web modern, produk berbasis AI, dan pengalaman digital yang terasa sederhana, berguna, dan menyenangkan untuk dipakai.',
    'Saya suka menggabungkan desain visual, frontend development, dan interaksi yang dipikirkan matang untuk mengubah ide rumit menjadi pengalaman digital yang jelas, mudah diakses, dan bermakna.',
    'Di luar kuliah, saya banyak bereksperimen dengan animasi web, rendering 3D di browser, dan hal-hal kecil yang membuat sebuah halaman terasa hidup.',
  ],
  focus: [
    {
      title: 'Frontend Engineering',
      description: 'React, Tailwind, animasi, dan interaksi yang halus.',
    },
    {
      title: 'AI & Machine Learning',
      description: 'Model sederhana yang menyelesaikan masalah nyata.',
    },
    {
      title: 'Product Design',
      description: 'Membangun antarmuka yang bersih dan punya tujuan.',
    },
  ],
  stats: [
    { value: '24', label: 'Teknologi dipakai' },
    { value: '6+', label: 'Project selesai' },
    { value: '3', label: 'Bidang fokus' },
  ],
};

/* -----------------------------------------------------------------------------
 * NAVIGASI
 * -------------------------------------------------------------------------- */
export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

/* -----------------------------------------------------------------------------
 * SOCIAL LINKS  [EDIT] — ganti URL-nya
 * -------------------------------------------------------------------------- */
export const socials = [
  { label: 'GitHub', url: 'https://github.com/Maesticc' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/darren-vincent-a22549326/' },
  { label: 'Instagram',  url: 'https://www.instagram.com/darren.vincent_/' },
  { label: 'Email',  url: 'darrenvincent547@gmail.com' },
];

/* -----------------------------------------------------------------------------
 * SKILLS — dipakai oleh keyboard 3D di section Skills.
 *
 * Setiap skill adalah satu keycap:
 *   key      : tombol fisik di keyboard kamu untuk memicu skill ini
 *   tagline  : kalimat pendek yang muncul besar saat keycap aktif
 *   what     : penjelasan skill-nya (ini yang menjawab "skill ini apa sih?")
 *   usedFor  : penjelasan bagaimana kamu memakainya
 *   level    : 0-100, dipakai untuk bar "proficiency"
 *   cap      : warna keycap, ink: warna ikon/tulisan di atas keycap
 * -------------------------------------------------------------------------- */
export const skills = [
  // ---------- Row 1 : Web fundamentals & UI ----------
  {
    id: 'html',
    name: 'HTML5',
    key: 'H',
    row: 0,
    category: 'Frontend',
    level: 92,
    Icon: SiHtml5,
    cap: '#e34f26',
    ink: '#ffffff',
    tagline: 'Pondasi setiap halaman web!',
    what: 'Bahasa markup yang menyusun struktur dan makna sebuah halaman web. HTML menentukan apa itu judul, paragraf, tombol, form, atau navigasi.',
    usedFor:
      'Saya menulis HTML semantik supaya halaman mudah dibaca mesin pencari dan ramah untuk screen reader.',
    tags: ['Semantic HTML', 'Accessibility', 'SEO'],
  },
  {
    id: 'css',
    name: 'CSS',
    key: 'C',
    row: 0,
    category: 'Frontend',
    level: 90,
    Icon: SiCss,
    cap: '#2965f1',
    ink: '#ffffff',
    tagline: 'Tempat desain jadi kenyataan!',
    what: 'Bahasa untuk mengatur tampilan: layout, warna, tipografi, animasi, dan responsivitas di berbagai ukuran layar.',
    usedFor:
      'Saya banyak pakai Flexbox, Grid, custom properties, dan transform 3D — termasuk untuk keyboard yang kamu lihat di section ini.',
    tags: ['Flexbox & Grid', 'Animation', 'Responsive'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    key: 'J',
    row: 0,
    category: 'Frontend',
    level: 88,
    Icon: SiJavascript,
    cap: '#f7df1e',
    ink: '#111111',
    tagline: 'Bahasa yang menghidupkan web!',
    what: 'Bahasa pemrograman utama di browser. JavaScript menangani interaksi, manipulasi DOM, pengambilan data, dan logika aplikasi.',
    usedFor:
      'Saya gunakan untuk logika komponen, animasi berbasis canvas, dan komunikasi dengan API.',
    tags: ['ES2023+', 'Async/Await', 'DOM & Canvas'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    key: 'T',
    row: 0,
    category: 'Frontend',
    level: 82,
    Icon: SiTypescript,
    cap: '#3178c6',
    ink: '#ffffff',
    tagline: 'JavaScript yang tidak bikin kaget!',
    what: 'Superset JavaScript dengan sistem tipe statis. Kesalahan tertangkap saat menulis kode, bukan saat aplikasi sudah jalan.',
    usedFor:
      'Saya pakai untuk project yang lebih besar supaya refactor aman dan autocomplete editor jauh lebih pintar.',
    tags: ['Type Safety', 'Generics', 'Refactor aman'],
  },
  {
    id: 'react',
    name: 'React',
    key: 'R',
    row: 0,
    category: 'Frontend',
    level: 90,
    Icon: SiReact,
    cap: '#20c9f2',
    ink: '#04263a',
    tagline: 'Semuanya adalah komponen!',
    what: 'Library UI berbasis komponen. Tampilan dipecah jadi bagian kecil yang bisa dipakai ulang, dan React mengurus pembaruan tampilan saat data berubah.',
    usedFor:
      'Framework utama saya. Website ini sendiri dibangun dengan React dan hooks.',
    tags: ['Hooks', 'Composition', 'State Management'],
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    key: 'N',
    row: 0,
    category: 'Frontend',
    level: 76,
    Icon: SiNextdotjs,
    cap: '#141414',
    ink: '#ffffff',
    tagline: 'React yang siap produksi!',
    what: 'Framework React dengan routing, server rendering, dan optimasi bawaan. Cocok untuk situs yang butuh SEO dan performa baik sejak awal.',
    usedFor:
      'Saya pakai untuk project yang butuh halaman ter-render di server dan struktur file routing yang rapi.',
    tags: ['App Router', 'SSR / SSG', 'API Routes'],
  },

  // ---------- Row 2 : Tooling & runtime ----------
  {
    id: 'tailwind',
    name: 'Tailwind',
    key: 'W',
    row: 1,
    category: 'Frontend',
    level: 91,
    Icon: SiTailwindcss,
    cap: '#0ea5b7',
    ink: '#ffffff',
    tagline: 'Styling tanpa pindah file!',
    what: 'Framework CSS utility-first. Gaya ditulis langsung lewat class kecil yang spesifik, jadi desain konsisten dan cepat dibuat.',
    usedFor:
      'Seluruh tampilan situs ini memakai Tailwind, termasuk token warna galaxy-nya.',
    tags: ['Utility-first', 'Design Tokens', 'Dark UI'],
  },
  {
    id: 'vite',
    name: 'Vite',
    key: 'V',
    row: 1,
    category: 'Tooling',
    level: 80,
    Icon: SiVite,
    cap: '#646cff',
    ink: '#ffffff',
    tagline: 'Dev server yang instan!',
    what: 'Build tool modern dengan hot reload sangat cepat dan bundling produksi yang efisien lewat Rollup.',
    usedFor: 'Semua project frontend saya sekarang di-scaffold dengan Vite.',
    tags: ['HMR', 'Fast Build', 'Plugin Ecosystem'],
  },
  {
    id: 'motion',
    name: 'Motion',
    key: 'F',
    row: 1,
    category: 'Frontend',
    level: 78,
    Icon: SiFramer,
    cap: '#0055ff',
    ink: '#ffffff',
    tagline: 'Animasi yang terasa alami!',
    what: 'Library animasi untuk React (dulu Framer Motion). Menangani transisi, gesture, dan animasi saat elemen masuk atau keluar layar.',
    usedFor:
      'Dipakai untuk transisi antar section, modal, dan reveal saat scroll di situs ini.',
    tags: ['Spring Physics', 'Scroll Reveal', 'Layout Animation'],
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    key: 'O',
    row: 1,
    category: 'Backend',
    level: 79,
    Icon: SiNodedotjs,
    cap: '#4a8f3c',
    ink: '#ffffff',
    tagline: 'JavaScript keluar dari browser!',
    what: 'Runtime yang menjalankan JavaScript di server. Dipakai untuk membuat API, tooling CLI, dan proses otomatisasi.',
    usedFor: 'Saya pakai untuk membangun REST API dan script automation kecil.',
    tags: ['REST API', 'npm Ecosystem', 'Scripting'],
  },
  {
    id: 'express',
    name: 'Express',
    key: 'E',
    row: 1,
    category: 'Backend',
    level: 75,
    Icon: SiExpress,
    cap: '#3d3d3d',
    ink: '#ffffff',
    tagline: 'Backend minimalis, cepat jadi!',
    what: 'Framework web untuk Node.js yang ringan. Menyediakan routing dan middleware tanpa banyak aturan kaku.',
    usedFor:
      'Backend pilihan saya untuk prototipe API dan project kuliah yang butuh server sederhana.',
    tags: ['Routing', 'Middleware', 'JWT Auth'],
  },
  {
    id: 'python',
    name: 'Python',
    key: 'P',
    row: 1,
    category: 'Backend',
    level: 85,
    Icon: SiPython,
    cap: '#3776ab',
    ink: '#ffffff',
    tagline: 'Bahasa serba bisa!',
    what: 'Bahasa dengan sintaks bersih yang kuat untuk data, machine learning, automation, dan scripting.',
    usedFor:
      'Saya pakai untuk tugas data, eksperimen machine learning, dan mengolah dataset.',
    tags: ['Data Analysis', 'Automation', 'ML'],
  },

  // ---------- Row 3 : Languages & data ----------
  {
    id: 'java',
    name: 'Java',
    key: 'A',
    row: 2,
    category: 'Language',
    level: 80,
    Icon: FaJava,
    cap: '#c74634',
    ink: '#ffffff',
    tagline: 'OOP yang disiplin!',
    what: 'Bahasa berorientasi objek yang berjalan di JVM. Banyak dipakai untuk aplikasi berskala besar dan jadi dasar belajar OOP.',
    usedFor:
      'Bahasa utama saya di mata kuliah Object-Oriented Programming, termasuk membuat game 2D dengan Java Swing.',
    tags: ['OOP', 'JVM', 'Swing'],
  },
  {
    id: 'cpp',
    name: 'C++',
    key: 'X',
    row: 2,
    category: 'Language',
    level: 72,
    Icon: SiCplusplus,
    cap: '#00599c',
    ink: '#ffffff',
    tagline: 'Dekat dengan mesin!',
    what: 'Bahasa berperforma tinggi dengan kontrol manual atas memori. Sering dipakai untuk algoritma, sistem, dan competitive programming.',
    usedFor:
      'Saya pakai untuk latihan struktur data, algoritma, dan tugas dasar pemrograman.',
    tags: ['Data Structures', 'Algorithms', 'STL'],
  },
  {
    id: 'mysql',
    name: 'MySQL',
    key: 'Q',
    row: 2,
    category: 'Database',
    level: 78,
    Icon: SiMysql,
    cap: '#00758f',
    ink: '#ffffff',
    tagline: 'Data yang tertata rapi!',
    what: 'Database relasional yang menyimpan data dalam tabel berelasi dan diakses dengan SQL.',
    usedFor:
      'Saya gunakan untuk merancang skema dan menulis query di project berbasis database.',
    tags: ['SQL', 'Schema Design', 'Joins'],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    key: 'G',
    row: 2,
    category: 'Database',
    level: 74,
    Icon: SiPostgresql,
    cap: '#336791',
    ink: '#ffffff',
    tagline: 'Relational yang serius!',
    what: 'Database relasional open source dengan fitur lanjutan seperti tipe JSON, window function, dan indeks yang kaya.',
    usedFor:
      'Pilihan saya saat project butuh query kompleks dan integritas data yang kuat.',
    tags: ['JSONB', 'Indexing', 'Transactions'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    key: 'M',
    row: 2,
    category: 'Database',
    level: 76,
    Icon: SiMongodb,
    cap: '#3fa037',
    ink: '#ffffff',
    tagline: 'Data berbentuk dokumen!',
    what: 'Database NoSQL yang menyimpan data sebagai dokumen mirip JSON, fleksibel saat struktur data masih berubah.',
    usedFor:
      'Saya pakai bersama Node.js untuk prototipe yang skemanya masih sering berganti.',
    tags: ['NoSQL', 'Aggregation', 'Mongoose'],
  },
  {
    id: 'prisma',
    name: 'Prisma',
    key: 'Z',
    row: 2,
    category: 'Database',
    level: 70,
    Icon: SiPrisma,
    cap: '#2d3748',
    ink: '#ffffff',
    tagline: 'Query database yang aman tipe!',
    what: 'ORM modern yang membuat akses database punya tipe otomatis, plus sistem migrasi skema yang rapi.',
    usedFor:
      'Saya pakai bersama TypeScript agar query database ikut terjaga tipenya.',
    tags: ['ORM', 'Migrations', 'Type-safe'],
  },

  // ---------- Row 4 : Workflow, infra & AI ----------
  {
    id: 'git',
    name: 'Git',
    key: 'I',
    row: 3,
    category: 'Tooling',
    level: 86,
    Icon: SiGit,
    cap: '#f05033',
    ink: '#ffffff',
    tagline: 'Mesin waktu untuk kode!',
    what: 'Version control yang mencatat setiap perubahan kode, memungkinkan branching, dan mengembalikan kondisi sebelumnya kapan pun.',
    usedFor:
      'Saya pakai di setiap project: branch per fitur, commit yang deskriptif, dan resolve conflict.',
    tags: ['Branching', 'Rebase', 'Conflict Resolution'],
  },
  {
    id: 'github',
    name: 'GitHub',
    key: 'B',
    row: 3,
    category: 'Tooling',
    level: 84,
    Icon: SiGithub,
    cap: '#1f2328',
    ink: '#ffffff',
    tagline: 'Tempat kode berkolaborasi!',
    what: 'Platform hosting repositori Git dengan pull request, code review, issue tracking, dan otomatisasi lewat Actions.',
    usedFor:
      'Saya kelola project kuliah dan personal di sini, termasuk deploy lewat GitHub Pages.',
    tags: ['Pull Request', 'Actions', 'GitHub Pages'],
  },
  {
    id: 'docker',
    name: 'Docker',
    key: 'D',
    row: 3,
    category: 'DevOps',
    level: 68,
    Icon: SiDocker,
    cap: '#2496ed',
    ink: '#ffffff',
    tagline: 'The best containerization!',
    what: 'Alat untuk mengemas aplikasi beserta seluruh dependensinya ke dalam container, sehingga jalan sama di mana pun.',
    usedFor:
      'Saya pakai untuk menyamakan environment development dan menghindari masalah "di laptop saya jalan, kok".',
    tags: ['Containers', 'Dockerfile', 'Compose'],
  },
  {
    id: 'linux',
    name: 'Linux',
    key: 'L',
    row: 3,
    category: 'DevOps',
    level: 73,
    Icon: SiLinux,
    cap: '#fcc624',
    ink: '#1a1a1a',
    tagline: 'Terminal adalah rumah!',
    what: 'Sistem operasi open source yang menjalankan sebagian besar server di dunia. Kuat di command line dan automation.',
    usedFor:
      'Saya nyaman bekerja dengan shell, permission file, proses, dan deploy ke server Linux.',
    tags: ['Shell', 'Bash Script', 'Server'],
  },
  {
    id: 'figma',
    name: 'Figma',
    key: 'Y',
    row: 3,
    category: 'Design',
    level: 80,
    Icon: SiFigma,
    cap: '#a259ff',
    ink: '#ffffff',
    tagline: 'Desain dulu, koding kemudian!',
    what: 'Alat desain antarmuka berbasis browser dengan komponen, auto layout, dan prototyping kolaboratif.',
    usedFor:
      'Saya rancang layout dan design system di Figma sebelum menuliskannya jadi komponen.',
    tags: ['UI Design', 'Auto Layout', 'Prototyping'],
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    key: 'K',
    row: 3,
    category: 'AI / ML',
    level: 65,
    Icon: SiTensorflow,
    cap: '#ff6f00',
    ink: '#ffffff',
    tagline: 'Mengajari mesin melihat pola!',
    what: 'Framework machine learning untuk membangun dan melatih model, dari regresi sederhana sampai neural network.',
    usedFor:
      'Saya pakai untuk eksperimen klasifikasi gambar dan tugas machine learning di kampus.',
    tags: ['Neural Network', 'Keras', 'Training'],
  },
];

/* Kategori skill + penjelasan singkat, tampil di bawah keyboard */
export const skillCategories = [
  { name: 'Frontend', description: 'Antarmuka, interaksi, dan animasi.' },
  { name: 'Backend', description: 'API, server, dan logika aplikasi.' },
  { name: 'Database', description: 'Menyimpan dan mengambil data.' },
  { name: 'Language', description: 'Dasar pemrograman dan algoritma.' },
  { name: 'Tooling', description: 'Alat kerja sehari-hari.' },
  { name: 'DevOps', description: 'Environment dan deployment.' },
  { name: 'Design', description: 'Merancang sebelum membangun.' },
  { name: 'AI / ML', description: 'Model dan data.' },
];

/* -----------------------------------------------------------------------------
 * PROJECTS  [EDIT] — ganti dengan project kamu sendiri
 * -------------------------------------------------------------------------- */
export const projectCategories = [
  'All',
  'Frontend',
  'AI / Machine Learning',
  'Software Engineering',
  'Data',
];

export const projects = [
  {
    id: 'galaxy-portfolio',
    title: 'Galaxy Portfolio',
    category: 'Frontend',
    course: 'Personal Project',
    year: '2026',
    summary:
      'Website portofolio bertema galaksi dengan latar starfield berbasis canvas dan section skill berbentuk keyboard mekanik 3D interaktif.',
    detail:
      'Dibangun dengan React dan Tailwind. Latar bintangnya digambar di canvas dengan efek paralaks, sementara keyboard 3D-nya murni CSS transform dan bisa dikendalikan lewat tombol fisik keyboard.',
    stack: ['React', 'Tailwind', 'Motion', 'Canvas'],
    highlight: 'Interactive 3D',
    url: '',
  },
  {
    id: 'flood-report',
    title: 'Flood Report Platform',
    category: 'Software Engineering',
    course: 'Software Engineering',
    year: '2026',
    summary:
      'Platform berbasis komunitas untuk pelaporan banjir secara real-time beserta pemantauan wilayah rawan.',
    detail:
      'Pengguna dapat mengirim laporan berisi lokasi dan foto, lalu laporan diverifikasi sebelum tampil di peta. Fokus pengerjaan ada pada alur verifikasi dan tampilan peta yang mudah dibaca.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Maps API'],
    highlight: 'Real-time',
    url: '',
  },
  {
    id: 'image-segmentation',
    title: 'Image Segmentation Tool',
    category: 'AI / Machine Learning',
    course: 'Computer Vision',
    year: '2025',
    summary:
      'Alat berbasis web untuk memisahkan objek dari latar belakang gambar menggunakan algoritma GrabCut.',
    detail:
      'Pengguna menandai area objek, lalu algoritma menyempurnakan batas seleksinya. Tantangan utamanya adalah menjaga proses tetap responsif saat gambar berukuran besar.',
    stack: ['Python', 'OpenCV', 'Flask'],
    highlight: 'GrabCut',
    url: '',
  },
  {
    id: 'style-transfer',
    title: 'Text Style Transfer',
    category: 'AI / Machine Learning',
    course: 'Natural Language Processing',
    year: '2025',
    summary:
      'Aplikasi NLP yang menerjemahkan gaya bahasa satu generasi ke generasi lain tanpa mengubah maknanya.',
    detail:
      'Menggunakan pendekatan sequence-to-sequence. Bagian paling menantang adalah menjaga makna asli kalimat tetap utuh setelah gaya bahasanya berubah.',
    stack: ['Python', 'Transformers', 'Seq2Seq'],
    highlight: 'Seq2Seq',
    url: '',
  },
  {
    id: 'coffee-website',
    title: 'Coffee Shop Website',
    category: 'Frontend',
    course: 'Human Computer Interaction',
    year: '2025',
    summary:
      'Website coffee shop yang responsif dengan navigasi sederhana dan struktur visual yang bersih.',
    detail:
      'Dikerjakan dengan penekanan pada prinsip HCI: hierarki visual yang jelas, target sentuh yang nyaman, dan kontras warna yang memenuhi standar aksesibilitas.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    highlight: 'UI / UX',
    url: '',
  },
  {
    id: 'growth-analysis',
    title: 'Production Growth Analysis',
    category: 'Data',
    course: 'Scientific Computing',
    year: '2025',
    summary:
      'Pemodelan pertumbuhan produksi dan prediksi keluaran menggunakan metode numerik serta visualisasi data.',
    detail:
      'Membandingkan beberapa metode numerik untuk mencari model yang paling pas dengan data historis, lalu memvisualkan hasil prediksinya.',
    stack: ['Python', 'NumPy', 'Pandas', 'Matplotlib'],
    highlight: 'Numerical',
    url: '',
  },
];

/* -----------------------------------------------------------------------------
 * EXPERIENCE  [EDIT]
 * -------------------------------------------------------------------------- */
export const experiences = [
  {
    id: 'exp-1',
    org: 'Nama Organisasi Kampus',
    role: 'Core Team Member',
    period: '2026 — sekarang',
    location: 'Jakarta, Indonesia',
    description:
      'Membantu menyusun materi belajar terstruktur agar anggota baru lebih cepat memahami dasar-dasar teknologi yang dibahas komunitas.',
    skills: ['Teamwork', 'Critical Thinking', 'Documentation'],
  },
  {
    id: 'exp-2',
    org: 'Nama Kepanitiaan',
    role: 'Committee Member',
    period: '2025',
    location: 'Jakarta, Indonesia',
    description:
      'Menjaga komunikasi antar peserta dan mendukung jalannya diskusi selama rangkaian acara berlangsung.',
    skills: ['Communication', 'Coordination', 'Event Management'],
  },
  {
    id: 'exp-3',
    org: 'Nama Universitas',
    role: 'Freshmen Leader',
    period: '2025',
    location: 'Jakarta, Indonesia',
    description:
      'Mendampingi mahasiswa baru melewati masa orientasi sekaligus melatih kemampuan memimpin, berempati, dan berkolaborasi.',
    skills: ['Leadership', 'Public Speaking', 'Mentoring'],
  },
  {
    id: 'exp-4',
    org: 'Nama Sekolah',
    role: 'Student Event Coordinator',
    period: '2023 — 2024',
    location: 'Indonesia',
    description:
      'Memimpin dan mengoordinasikan beberapa acara sekolah yang berfokus pada keterlibatan siswa dan pengembangan kepemimpinan.',
    skills: ['Event Planning', 'Team Leadership', 'Community Building'],
  },
];


