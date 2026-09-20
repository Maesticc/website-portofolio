<div align="center">

# 🌌 Galaxy Portfolio

### *Exploring code like exploring a galaxy.*

A personal portfolio with an outer-space theme, an explorer robot mascot whose eyes follow your cursor, and one continuous universe you travel through as you scroll.

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Motion](https://img.shields.io/badge/Motion-13-FF4D8D?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev)

[![Live on Vercel](https://img.shields.io/badge/Live-website--portofolio--maesticc.vercel.app-000000?style=flat-square&logo=vercel&logoColor=white)](https://website-portofolio-maesticc.vercel.app/)
[![Made by Darren Vincent](https://img.shields.io/badge/Made_by-Darren_Vincent-8B5CF6?style=flat-square)](https://github.com/Maesticc)

<br/>

**[✨ Live Demo](https://website-portofolio-maesticc.vercel.app/) &nbsp;·&nbsp; [🚀 Quick Start](#-quick-start) &nbsp;·&nbsp; [🛠 Tech Stack](#-tech-stack) &nbsp;·&nbsp; [📬 Contact](#-contact)**

</div>

---

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Sections](#-sections)
- [Skills](#-skills)
- [Featured Projects](#-featured-projects)
- [Customization](#-customization)
- [Contact](#-contact)

---

## 🪐 About

> Hi, I'm **Darren Vincent**, a Computer Science student at Bina Nusantara University with a growing interest in Artificial Intelligence, software development, and technology-driven solutions.

This portfolio is designed as a single, continuous space environment. Instead of jumping between pages, you glide through a galaxy: a procedural Milky Way sky sits behind everything, a robot mascot watches your cursor from a rocky planet horizon, and cinematic scrolling carries you from one chapter to the next.

<div align="center">

| 🎯 Focus | ⚙️ Core Skills | 🚀 Projects |
|:---:|:---:|:---:|
| Web · AI · Leadership | 9 | 6+ |

</div>

---

## ✨ Features

- 🌠 **Procedural Milky Way sky** — canvas-based star field with natural density variation, drifting dust, and rare meteors
- 🪨 **Rocky planet horizon** — an organic silhouette with rocks, craters, and cracks where the mascot stands
- 🤖 **Interactive robot mascot** — eyes follow the cursor and react to navigation
- ⌨️ **3D keyboard skills** — the Skills section is an interactive mechanical keyboard
- 🎬 **Cinematic scrolling** — navigation smoothly travels the viewport to each section, with active-section detection
- ✦ **Orbital section dividers** — subtle transitions that keep the universe continuous
- ♿ **Accessible** — respects `prefers-reduced-motion` and pauses animation off-screen for performance

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 |
| **Build tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **Animation** | Motion |
| **Icons** | react-icons |
| **Graphics** | HTML5 Canvas 2D (hand-rolled star field & horizon) |

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Maesticc/website-portofolio.git
cd website-portofolio

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:5173** 🌌

<details>
<summary><b>📦 Other commands</b></summary>

<br/>

```bash
npm run build     # Build for production (output in dist/)
npm run preview   # Preview the production build locally
```

</details>

---

## 📁 Project Structure

```
website/
├── public/
│   ├── profile.jpg          # Profile photo
│   └── projects/            # Project thumbnails
├── src/
│   ├── components/          # Section & visual components
│   │   ├── StarField.jsx        # Procedural Milky Way sky
│   │   ├── WalleBot.jsx         # Robot mascot
│   │   ├── PlanetHorizon.jsx    # Rocky planet landscape
│   │   ├── Hero.jsx  About.jsx  Skills.jsx
│   │   ├── Projects.jsx  Experience.jsx  Contact.jsx
│   │   ├── SectionDivider.jsx   # Orbital transitions
│   │   └── FloatingNav.jsx      # Floating pill navigation
│   ├── data/
│   │   ├── content.js       # ⭐ All text & data (edit here)
│   │   └── theme.js         # Background tint per section
│   ├── lib/
│   │   └── smoothScroll.js  # Cinematic navigation scrolling
│   ├── App.jsx
│   └── main.jsx
└── index.html
```

---

## 🧭 Sections

<div align="center">

`🏠 Home` &nbsp;→&nbsp; `👤 About Me` &nbsp;→&nbsp; `⌨️ Skills` &nbsp;→&nbsp; `🚀 Projects` &nbsp;→&nbsp; `🌟 Experience` &nbsp;→&nbsp; `📬 Contact`

</div>

---

## ⌨️ Skills

<div align="center">

| AI / ML | Web | Language | Data | Design | Tooling |
|:---:|:---:|:---:|:---:|:---:|:---:|
| Machine Learning | JavaScript | Java | SQL | Figma | Git |
| NLP | PHP / Laravel | | | | GitHub |
| Computer Vision | | | | | |

</div>

---

## 🚀 Featured Projects

<details open>
<summary><b>Click to expand / collapse</b></summary>

<br/>

| Project | Category | Stack | Link |
|---|---|---|---|
| **CoinRide** — AI personal finance tracker | Software Engineering | Next.js · Supabase · PostgreSQL | [Visit ↗](https://coinride.vercel.app/) |
| **Smart Triage** — AI emergency triage | AI / Machine Learning | Python · Streamlit · Transformers | [Visit ↗](https://optimization-healthcare-ai-vfgn3u28mpecacpxfii9dy.streamlit.app/) |
| **RPS Battle Arena** — adaptive game AI | AI / Machine Learning | Python · JS · Markov model | [Repo ↗](https://github.com/Maesticc/RPS-Arena) |
| **Symptom → Disease Classification** | AI / Machine Learning | Python · NLP · Scikit-learn | [Visit ↗](https://ml-finalproject-group-7-lf01.streamlit.app/) |
| **Medical RAG Evaluation** — local LLMs | LLM / RAG | Python · Gemma · ChromaDB · RAGAS | [Repo ↗](https://github.com/Maesticc/crosslingual-medical-rag) |
| **BukaCV** — document scanner | Computer Vision | Python · Flask · OpenCV · Flutter | [Repo ↗](https://github.com/Maesticc/bukacv) |

</details>

---

## 🎨 Customization

Everything personal lives in one place — no need to touch components.

<details>
<summary><b>Edit your content</b></summary>

<br/>

| What you want to change | File |
|---|---|
| Name, tagline, bio, stats | `src/data/content.js` → `profile` |
| Navigation items | `src/data/content.js` → `navLinks` |
| Social links | `src/data/content.js` → `socials` |
| Skills | `src/data/content.js` → `skills` |
| Projects | `src/data/content.js` → `projects` |
| Experience | `src/data/content.js` → `experiences` |
| Section background colors | `src/data/theme.js` |
| Profile photo | replace `public/profile.jpg` |
| Project thumbnails | add to `public/projects/` |

</details>

---

## 📬 Contact

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-@Maesticc-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Maesticc)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Darren_Vincent-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/darren-vincent-a22549326/)
[![Instagram](https://img.shields.io/badge/Instagram-@darren.vincent__-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/darren.vincent_/)
[![Email](https://img.shields.io/badge/Email-darrenvincent547@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:darrenvincent547@gmail.com)

</div>

<div align="center">

<br/>

*Built with ☕ and curiosity in Jakarta, Indonesia* 🇮🇩

**⭐ If you like this project, consider giving it a star!**

</div>
