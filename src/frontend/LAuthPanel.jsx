import { useState } from "react";
import Spline from "@splinetool/react-spline";
import "./AuthPanel.css";

export function LAuthPanel() {

   const [mode, setMode] = useState("Admin Login");

   return (

      <section id="auth" className="auth-section">

         <div className="auth-bg">
            <div className="auth-glow"></div>
         </div>

         <div className="auth-wrapper">

            {/* LOGIN CARD */}

            <div className="auth-card">

               {/* TOGGLE BUTTONS */}

               <div className="auth-toggle">

                  {["Admin Login", "Teacher Login"].map((m) => (

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
                     Welcome Back
                  </h3>

                  <p className="auth-subtitle">
                     {mode === "Admin Login"
                        ? "Sign in to manage your NEXUS workspace."
                        : "Sign in to access your teacher dashboard."}
                  </p>

                  <div className="auth-inputs">

                     <input
                        type="text"
                        placeholder={
                           mode === "Admin Login"
                              ? "Admin ID"
                              : "Teacher ID"
                        }
                        className="auth-input"
                     />

                     <input
                        type="password"
                        placeholder="Password"
                        className="auth-input"
                     />

                  </div>

                  <button className="auth-submit-btn">
                     Login
                  </button>

                  <p className="forgot-password">
                     Forgot Password?
                  </p>

               </div>

            </div>

            {/* 3D MODEL */}

            <div className="auth-spline">

               <Spline scene="https://prod.spline.design/CBT5tjZYHMnYSBLl/scene.splinecode" />

            </div>

         </div>

      </section>

   );

}