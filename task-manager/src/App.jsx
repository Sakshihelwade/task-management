import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import Registration from "./Pages/Registration";
import ResetPassword from "./Pages/ResetPassword";

// Lazy loading components
const Login = lazy(() => import("./Pages/Login"));
const register= lazy(()=>import ("./Pages/Registration"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const TaskManager = lazy(() => import("./Pages/TaskManager"));
const Layout = lazy(() => import("./component/Layout"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/registration" element={<Registration/>} />
        
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task-manager" element={<TaskManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
