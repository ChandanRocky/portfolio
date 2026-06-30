import "@/App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Character from "@/components/Character";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Career from "@/components/Career";
import Contact from "@/components/Contact";
import BootSequence from "@/components/BootSequence";
import SectionIndicator from "@/components/SectionIndicator";
import ScrollProgress from "@/components/ScrollProgress";
import MarqueeBand from "@/components/MarqueeBand";

const Home = () => {
  const [bootDone, setBootDone] = useState(false);

  // Show boot sequence only once per session
  useEffect(() => {
    if (sessionStorage.getItem("boot_seen") === "1") {
      setBootDone(true);
    } else {
      sessionStorage.setItem("boot_seen", "1");
    }
  }, []);

  return (
    <SmoothScroll>
      <div className="relative bg-void-900 text-white" data-testid="home">
        {!bootDone && <BootSequence onDone={() => setBootDone(true)} />}
        <ScrollProgress />
        <CustomCursor />
        <SectionIndicator />
        <Nav />
        <main>
          <Hero />
          <MarqueeBand
            items={["GenAI Engineering", "RAG Systems", "LLM Architecture", "Cloud Native", "Data Pipelines", "AI Agents", "Production Ready"]}
            speedSec={45}
            variant="ghost"
          />
          <Character />
          <About />
          <MarqueeBand
            items={["Open to opportunities", "Available for hire", "GenAI · Data · LLM", "Let's build the future"]}
            speedSec={28}
            variant="solid"
            direction="right"
          />
          <Skills />
          <Projects />
          <MarqueeBand
            items={["Shipped 13 projects", "7 AI agents", "Zero data loss migrations", "Healthcare AI", "Internal AI platforms"]}
            speedSec={36}
            variant="ghost"
          />
          <Career />
          <Contact />
        </main>
        <div className="grain-overlay" aria-hidden />
      </div>
    </SmoothScroll>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
