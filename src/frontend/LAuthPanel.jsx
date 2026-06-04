import { useState } from "react";
import Spline from "@splinetool/react-spline";
import "./AuthPanel.css";

export function LAuthPanel() {

   const [mode, setMode] = useState("login");

   return (

      <section id="auth" className="auth-section">

         <div className="auth-bg">
            <div className="auth-glow"></div>
         </div>
         <div className="auth-wrapper">
         <div className="auth-card">

            {/* TOGGLE BUTTONS */}

            <div className="auth-toggle">

               {["login", "register"].map((m) => (

                  <button
                     key={m}
                     onClick={() => setMode(m)}
                     className={`toggle-btn ${mode === m ? "active" : ""}`}
                  >
                     {m}
                  </button>

               ))}

            </div>

            {/* CONTENT */}

            <div className="auth-content">

               <h3 className="auth-title">
                  {mode === "login"
                     ? "Welcome back"
                     : "Create your account"}
               </h3>

               <p className="auth-subtitle">
                  {mode === "login"
                     ? "Sign in to your NEXUS workspace."
                     : "Join the next generation of school operations."}
               </p>

               <div className="auth-inputs">

                  {mode === "register" && (
                     <input
                        type="text"
                        placeholder="Full name"
                        className="auth-input"
                     />
                  )}

                  <input
                     type="email"
                     placeholder="Email"
                     className="auth-input"
                  />

                  <input
                     type="password"
                     placeholder="Password"
                     className="auth-input"
                  />

               </div>

               <button className="auth-submit-btn">
                  {mode === "login"
                     ? "Sign in"
                     : "Create account"}
               </button>

            </div>


         </div>
                                 <div className="auth-spline">

               <Spline scene="https://prod.spline.design/CBT5tjZYHMnYSBLl/scene.splinecode" />

            </div>
            </div>

      </section>

   );

}