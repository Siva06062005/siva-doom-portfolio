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
import Certificates from "./pages/Certificates";

export default function App() {
  const location = useLocation();

  // Ensure website starts smoothly from the beginning (top) on initial open / reload
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      // Force instant clean start at top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      // Clean any stale hash leftover from previous sessions so it doesn't jump
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  // Handle in-page navigation if the user clicks a specific path route
  useEffect(() => {
    const rawPath = location.pathname.replace("/", "").toLowerCase();
    if (rawPath && ["about", "skills", "projects", "certificates", "experience", "contact"].includes(rawPath)) {
      const el = document.getElementById(rawPath);
      if (el) el.scrollIntoView({ behavior: "smooth" });
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

            <SectionDivider nextTarget="certificates" nextLabel="05 // CREDENTIAL VERIFICATION" />

            <section id="certificates" className="page-section">
              <Certificates />
            </section>

            <SectionDivider nextTarget="experience" nextLabel="06 // SERVICE TIMELINE" />

            <section id="experience" className="page-section">
              <Experience />
            </section>

            <SectionDivider nextTarget="contact" nextLabel="07 // TRANSMISSION UPLINK" />

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