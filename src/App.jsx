import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./frontend/RNavbar";
import { LNavbar } from "./frontend/LNavbar";

import { Hero } from "./frontend/Hero";
import { AuthPanel } from "./frontend/AuthPanel";
import { Features } from "./frontend/Features";
import { About } from "./frontend/About";
import { Team } from "./frontend/Team";
import { Footer } from "./frontend/Footer";
import {LAuthPanel} from "./frontend/LAuthPanel"
import{LHero} from "./frontend/LHero"

// Import Dashboard Components
import { Sidebar } from "./components/Sidebar/Sidebar";
import { TeacherSidebar } from "./components/TeacherSidebar/TeacherSidebar";
import { Header } from "./components/Header/Header";
import { AppRoutes } from "./routes/AppRoutes";
import { TeacherRoutes } from "./routes/TeacherRoutes";
import { ThemeProvider } from "./components/ThemeProvider/ThemeProvider";

import { useEffect, useState } from "react";

function App() {

   const [register, setRegister] = useState(true);
   const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
   const [userRole, setUserRole] = useState(null);

   const checkAdmin = async () => {
      try {
         const response = await fetch(
            "http://localhost:5000/admin/check-admin"
         );

         const data = await response.json();

         console.log(data);

         setRegister(false);
      } catch (err) {
         console.error(err);
         setRegister(true);
      }
   };

   useEffect(() => {
      // Check if user is logged in from localStorage
      const adminLoggedIn = localStorage.getItem("adminLoggedIn");
      const role = localStorage.getItem("userRole");
      
      if (adminLoggedIn === "true" || role === "admin") {
         setIsUserLoggedIn(true);
         setUserRole("admin");
      } else if (role === "teacher") {
         setIsUserLoggedIn(true);
         setUserRole("teacher");
      } else {
         checkAdmin();
      }
   }, []);

const handleLoginSuccess = () => {
   const role = localStorage.getItem("userRole");
   setUserRole(role);
   setIsUserLoggedIn(true);
};

const handleRegisterSuccess = () => {
   localStorage.setItem("userRole", "admin");
   localStorage.setItem("adminLoggedIn", "true");
   setUserRole("admin");
   setIsUserLoggedIn(true);
};

if (isUserLoggedIn && userRole === "admin") {
   return (
      <BrowserRouter>
         <ThemeProvider>
            <div className="app-dashboard">
               <Sidebar />
               <div className="app-dashboard-content">
                  <Header />
                  <AppRoutes />
               </div>
            </div>
         </ThemeProvider>
      </BrowserRouter>
   );
}

if (isUserLoggedIn && userRole === "teacher") {
   return (
      <BrowserRouter>
         <ThemeProvider>
            <div className="app-dashboard">
               <TeacherSidebar />
               <div className="app-dashboard-content">
                  <Header />
                  <TeacherRoutes />
               </div>
            </div>
         </ThemeProvider>
      </BrowserRouter>
   );
}

return (
   <div className="app">

      {register ? <Navbar /> : <LNavbar />}

      {register ? <Hero /> : <LHero />}

      {register ? (
         <AuthPanel onRegisterSuccess={handleRegisterSuccess} />
      ) : (
         <LAuthPanel onLoginSuccess={handleLoginSuccess} />
      )}

      <Features />
      <About />
      <Team />
      <Footer />

   </div>
);
}

export default App;