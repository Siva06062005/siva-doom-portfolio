import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackgroundEffects from "./components/BackgroundEffects";
import SectionDivider from "./components/SectionDivider";
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Contact from "./pages/Contact";

export default function App() {
  const location = useLocation();

  // Smooth scroll to section if URL has a hash or route like /about, /skills, etc.
  useEffect(() => {
    const rawHash = window.location.hash.replace("#", "").toLowerCase();
    const rawPath = location.pathname.replace("/", "").toLowerCase();
    const target = rawHash || rawPath;
    if (target && ["home", "about", "skills", "projects", "experience", "contact"].includes(target)) {
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="app">
          <ScrollProgress />
          <BackgroundEffects />
          <ScrollToTop />
          <Navbar />
          <main id="main-content" className="single-page-layout">
            <section id="home" className="page-section">
              <Home />
            </section>

            <SectionDivider nextTarget="about" nextLabel="02 // PROFILE & DOSSIER" />

            <section id="about" className="page-section">
              <About />
            </section>

            <SectionDivider nextTarget="skills" nextLabel="03 // TECHNICAL ARSENAL" />

            <section id="skills" className="page-section">
              <Skills />
            </section>

            <SectionDivider nextTarget="projects" nextLabel="04 // TACTICAL BUILDS" />

            <section id="projects" className="page-section">
              <Projects />
            </section>

            <SectionDivider nextTarget="experience" nextLabel="05 // SERVICE TIMELINE" />

            <section id="experience" className="page-section">
              <Experience />
            </section>

            <SectionDivider nextTarget="contact" nextLabel="06 // TRANSMISSION UPLINK" />

            <section id="contact" className="page-section">
              <Contact />
            </section>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}