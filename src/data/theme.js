export const SECTION_TINTS = {
  home: `rgba(4, 3, 12, 0)`, //          transparan penuh, starfield utuh
  about: `rgba(12, 18, 38, 0.22)`, //    biru laut, sangat tipis
  skills: `rgba(22, 16, 46, 0.24)`, //   ungu nebula
  projects: `rgba(10, 24, 34, 0.22)`, // teal dalam
  experience: `rgba(24, 15, 38, 0.24)`, //plum
  contact: `rgba(20, 12, 30, 0.28)`, //  wine gelap, makin dalam di akhir
};

export const SECTION_SURFACES = SECTION_TINTS;

export const SECTION_ORDER = [
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'contact',
];

export function getSurface(id) {
  const index = SECTION_ORDER.indexOf(id);
  const base = SECTION_TINTS[id] ?? SECTION_TINTS.home;
  if (index <= 0) return { base, previous: base };
  const previousId = SECTION_ORDER[index - 1];
  return { base, previous: SECTION_TINTS[previousId] ?? base };
}
