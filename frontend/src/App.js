import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Career from "@/components/Career";
import Contact from "@/components/Contact";

const Home = () => {
  return (
    <SmoothScroll>
      <div className="relative bg-void-900 text-white" data-testid="home">
        <CustomCursor />
        <Nav />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
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
