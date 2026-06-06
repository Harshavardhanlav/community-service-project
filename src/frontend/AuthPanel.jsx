import "./AuthPanel.css";
import { useState } from "react";
import Spline from "@splinetool/react-spline";
import { School } from "lucide-react";

export function AuthPanel() {
   const [Username, SetUsername] = useState("");
   const [Email, SetEmail] = useState("");
   const [Password, SetPassword] = useState("");
   const [Schoolname, SetSchool] = useState("");
const handleRegister = async () => {

   const response = await fetch(
      "http://localhost:5000/admin/create-admin",
      {
         method: "POST",

         headers: {
            "Content-Type": "application/json"
         },

         body: JSON.stringify({
            schoolName: Schoolname,
            username: Username,
            email: Email,
            password: Password
         })
      }
   );

   const data = await response.json();

   console.log(data);

} 

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
   value={Schoolname}
   onChange={(e) => SetSchool(e.target.value)}
/>

   <input
   type="text"
   placeholder="Admin Username"
   className="auth-input"
   value={Username}
   onChange={(e) => SetUsername(e.target.value)}
/>
<input
   type="email"
   placeholder="Admin Email"
   className="auth-input"
   value={Email}
   onChange={(e) => SetEmail(e.target.value)}
/>
<input
   type="password"
   placeholder="Create Password"
   className="auth-input"
   value={Password}
   onChange={(e) => SetPassword(e.target.value)}
/>
                  </div>

                  <button className="auth-submit-btn" onClick={handleRegister}>
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