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
      <StarField />

      <main className="relative z-10">
        <Hero />
        <About />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Contact />
      </main>

      <FloatingNav />
    </>
  );
}
