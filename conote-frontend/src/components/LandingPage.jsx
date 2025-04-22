import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleGetStarted = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-theme text-theme font-theme">
      <h1 className="text-4xl font-bold">Welcome to CoNote</h1>
      <h2 className="text-2xl">collaborative note taking made easy</h2>

      <button
        onClick={handleGetStarted}
        className="px-6 py-3 text-[#722F37] bg-[#EFDFBB] border-2 border-[#722F37] rounded-lg font-medium transition-all duration-300 hover:bg-[#722F37] hover:text-white"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
