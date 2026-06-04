import "./App.css";

import { Navbar } from "./frontend/Navbar";
import { Hero } from "./frontend/Hero";
import { AuthPanel } from "./frontend/AuthPanel";
import { Features } from "./frontend/Features";
import { About } from "./frontend/About";
import { Team } from "./frontend/Team";
import { Footer } from "./frontend/Footer";
import {Render} from "./frontend/Render"
import "./App.css"
function App() {

   return (

      <div className="app">
         <Render/>
         <Navbar />

         <Hero />

         <AuthPanel />

         <Features />

         <About />

         <Team />

         <Footer />

      </div>

   );

}

export default App;