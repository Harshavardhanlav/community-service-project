import "./AuthPanel.css";

import Spline from "@splinetool/react-spline";

export function AuthPanel() {

   return (

      <section id="auth" className="auth-section">

         <div className="auth-bg">
            <div className="auth-glow"></div>
         </div>

         {/* FLEX CONTAINER */}

         <div className="auth-wrapper">

            {/* LEFT SIDE — FORM */}

            <div className="auth-card">

               <div className="auth-content">

                  <h3 className="auth-title">
                     Register Your School
                  </h3>

                  <p className="auth-subtitle">
                     Create the admin account to initialize your NEXUS workspace.
                  </p>

                  <div className="auth-inputs">

                     <input
                        type="text"
                        placeholder="School Name"
                        className="auth-input"
                     />

                     <input
                        type="text"
                        placeholder="Admin Username"
                        className="auth-input"
                     />

                     <input
                        type="email"
                        placeholder="Admin Email"
                        className="auth-input"
                     />

                     <input
                        type="password"
                        placeholder="Create Password"
                        className="auth-input"
                     />

                  </div>

                  <button className="auth-submit-btn">
                     Create Workspace
                  </button>

               </div>

            </div>

            {/* RIGHT SIDE — 3D MODEL */}

            <div className="auth-spline">

               <Spline scene="https://prod.spline.design/CBT5tjZYHMnYSBLl/scene.splinecode" />

            </div>

         </div>

      </section>

   );

}