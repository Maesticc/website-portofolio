import StarField from './components/StarField';
import FloatingNav from './components/FloatingNav';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Notes from './components/Notes';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      {/* Latar galaksi, menempel di viewport dan tidak ikut scroll */}
      <StarField />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Notes />
        <Contact />
      </main>

      <Footer />

      {/* Pill navigasi: muncul saat berhenti scroll di luar section home */}
      <FloatingNav />
    </>
  );
}
