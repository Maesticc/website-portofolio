import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { projectCategories, projects } from '../data/content';
import Section from './Section';
import { DistantWorldsFX } from './SectionFX';
import { Reveal, SectionHeading, Tag } from './ui';

/* ---------- Thumbnail project ----------
   Menampilkan gambar dari project.image. Jika file gambar belum ada atau
   gagal dimuat, otomatis beralih ke placeholder bertema (inisial project di
   atas gradien galaksi), jadi tidak pernah tampil ikon gambar rusak. */
function ProjectThumb({ project, className = '' }) {
  const [failed, setFailed] = useState(false);
  const initials = project.title
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden bg-[radial-gradient(120%_120%_at_20%_10%,rgba(124,92,255,0.28),transparent_55%),radial-gradient(120%_120%_at_90%_90%,rgba(110,231,255,0.16),transparent_55%),#0b0e18] ${className}`}
    >
      {project.image && !failed ? (
        <img
          src={project.image}
          alt={`${project.title} preview`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-4xl font-light text-white/25">
            {initials}
          </span>
        </div>
      )}
      {/* garis tepi halus supaya menyatu dengan kartu */}
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/8" />
    </div>
  );
}

/* ---------- Modal detail project ---------- */
function ProjectModal({ project, onClose }) {
  /* Tutup dengan Escape + kunci scroll body */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      className="fixed inset-0 z-60 flex items-center justify-center bg-void/85 p-5 backdrop-blur-md"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Project details: ${project.title}`}
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel relative max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-8 sm:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-white/40 hover:text-white"
        >
          ✕
        </button>

        <ProjectThumb
          project={project}
          className="mb-7 aspect-[16/9] w-full rounded-2xl"
        />

        <p className="label-mono mb-4 text-nebula">Project Detail</p>

        <h3 className="font-display text-4xl leading-tight font-light text-white sm:text-5xl">
          {project.title}
        </h3>

        <p className="mt-3 font-mono text-sm tracking-wide text-white/45">
          {project.course} · {project.year}
        </p>

        <div className="mt-8 space-y-4 text-base leading-8 text-white/65">
          <p>{project.summary}</p>
          <p>{project.detail}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Tag key={tech} tone="nebula">
              {tech}
            </Tag>
          ))}
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-9 inline-flex items-center gap-2 rounded-full border border-nebula/40 bg-nebula/15 px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase text-white transition hover:bg-nebula/30"
          >
            Open Project <span aria-hidden="true">↗</span>
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ---------- Kartu project ---------- */
function ProjectCard({ project, onOpen }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel group relative overflow-hidden rounded-2xl"
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="block w-full cursor-pointer text-left"
      >
        {/* Sorotan warna saat hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-20 h-52 w-52 rounded-full bg-nebula/0 blur-[70px] transition-colors duration-500 group-hover:bg-nebula/25"
        />

        {/* Thumbnail di atas kartu */}
        <ProjectThumb
          project={project}
          className="aspect-[16/9] w-full transition-transform duration-500 group-hover:scale-[1.02]"
        />

        <div className="relative flex items-start justify-between gap-6 p-7 pb-3 sm:p-8 sm:pb-3">
          <div className="min-w-0">
            <p className="label-mono mb-3 text-white/35">
              {project.course} · {project.year}
            </p>
            <h3 className="font-display text-2xl leading-snug font-light text-white transition-colors group-hover:text-starlight sm:text-3xl">
              {project.title}
            </h3>
          </div>

          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/55 transition-all duration-300 group-hover:rotate-45 group-hover:border-nebula group-hover:text-white"
          >
            ↗
          </span>
        </div>

        <p className="relative mt-1 px-7 text-sm leading-7 text-white/55 sm:px-8">
          {project.summary}
        </p>

        <div className="relative mt-6 flex flex-wrap gap-2 px-7 pb-7 sm:px-8 sm:pb-8">
          {project.stack.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      </button>
    </motion.article>
  );
}

/* ---------- Section ---------- */
export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const visible = useMemo(
    () =>
      filter === 'All'
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter],
  );

  return (
    <Section id="projects" center={false} atmosphere={<DistantWorldsFX />}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title={
            <>
              Things I've built
              <br />
              <span className="text-aurora">along the way.</span>
            </>
          }
          subtitle="A collection of projects exploring AI, software development, computer vision, and practical problem solving."
        />

        {/* Filter kategori */}
        <Reveal delay={0.12}>
          <div className="mt-12 mb-10 flex flex-wrap gap-2.5">
            {projectCategories.map((cat) => {
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  aria-pressed={isActive}
                  className={`cursor-pointer rounded-full border px-4 py-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase transition duration-300 ${
                    isActive
                      ? 'border-nebula bg-nebula/25 text-white'
                      : 'border-white/12 text-white/45 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid project */}
        <motion.div layout className="grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={setSelected}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <p className="text-sm text-white/45">
            No projects in this category yet.
          </p>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}
