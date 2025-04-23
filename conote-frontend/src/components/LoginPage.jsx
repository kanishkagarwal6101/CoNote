import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://62f3-3-147-9-79.ngrok-free.app//api/auth/login",
        formData
      );
      localStorage.setItem("token", response.data.token);

      // ✅ Check if there's a redirect URL, otherwise go to dashboard
      const redirectPath =
        new URLSearchParams(location.search).get("redirect") || "/dashboard";
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-theme text-theme">
      <div className="flex flex-col items-center justify-center bg-[#EDDCD9] p-8 border-2 border-[#264143] rounded-2xl shadow-[3px_4px_0px_1px_#E99F4C]">
        <p className="text-[#264143] font-extrabold text-2xl mt-5">LOGIN</p>

        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="flex flex-col items-start my-2">
            <label className="font-semibold mb-1">Email</label>
            <input
              name="email"
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="outline-none border-2 border-[#264143] shadow-[3px_4px_0px_1px_#722F37] w-[290px] p-3 rounded-md text-sm focus:translate-y-1 focus:shadow-[1px_2px_0px_0px_#722F37]"
            />
          </div>

          <div className="flex flex-col items-start my-2">
            <label className="font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              className="outline-none border-2 border-[#722F37] shadow-[3px_4px_0px_1px_#722F37] w-[290px] p-3 rounded-md text-sm focus:translate-y-1 focus:shadow-[1px_2px_0px_0px_#722F37]"
            />
          </div>

          <button className="w-[290px] p-4 mt-6 text-lg font-bold text-[#EFDFBB] bg-[#722F37] rounded-xl shadow-[3px_3px_0px_0px_#722F37] transition-all duration-200 hover:opacity-90 focus:translate-y-1 focus:shadow-[1px_2px_0px_0px_#E99F4C]">
            LOGIN
          </button>

          <p className="mt-4 text-sm font-bold">
            Don't have an account?{" "}
            <Link
              to={`/signup?redirect=${location.search}`}
              className="text-[#264143] font-bold px-1"
            >
              Sign Up Here!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
