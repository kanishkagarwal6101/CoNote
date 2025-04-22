import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import NewNote from "./components/NewNote";
import NotePage from "./components/NotePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/note/new" element={<NewNote />} />
        <Route path="/note/:id" element={<NotePage />} />
      </Routes>
    </Router>
  );
}

export default App;
