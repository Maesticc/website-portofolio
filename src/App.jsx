import StarField from './components/StarField';
import FloatingNav from './components/FloatingNav';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import SectionDivider from './components/SectionDivider';

export default function App() {
  return (
    <>
      {/* Latar galaksi, menempel di viewport dan tidak ikut scroll */}
      <StarField />

      <main className="relative z-10">
        <Hero />
        <About />
        {/* Pemisah sinematik: jeda halus "memasuki bab berikutnya", tanpa
            memutus lingkungan yang menerus. Hero ke About tidak diberi
            pemisah karena sudah menyatu lewat cakrawala planet. */}
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Contact />
      </main>

      {/* Pill navigasi: muncul saat berhenti scroll di luar section home */}
      <FloatingNav />
    </>
  );
}
