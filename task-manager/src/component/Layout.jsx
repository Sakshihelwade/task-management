import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow"> 
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
