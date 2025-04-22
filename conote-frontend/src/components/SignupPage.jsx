import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://3.147.9.79:3000/api/auth/signup",
        formData
      );
      console.log(response.data);
      alert("Signup successful! Redirecting to login...");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-theme text-theme">
      <div className="flex flex-col items-center justify-center bg-[#EDDCD9] p-8 border-2 border-[#722F37] rounded-2xl shadow-[3px_4px_0px_1px_#722F37]">
        <p className="text-[#264143] font-extrabold text-2xl mt-5">SIGN UP</p>

        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="flex flex-col items-start my-2">
            <label className="font-semibold mb-1">Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="outline-none border-2 border-[#264143] shadow-[3px_4px_0px_1px_#722F37] w-[290px] p-3 rounded-md text-sm focus:translate-y-1 focus:shadow-[1px_2px_0px_0px_#E99F4C]"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col items-start my-2">
            <label className="font-semibold mb-1">Email</label>
            <input
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="Enter your email"
              className="outline-none border-2 border-[#264143] shadow-[3px_4px_0px_1px_#722F37] w-[290px] p-3 rounded-md text-sm focus:translate-y-1 focus:shadow-[1px_2px_0px_0px_#E99F4C]"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col items-start my-2">
            <label className="font-semibold mb-1">Password</label>
            <input
              onChange={handleChange}
              name="password"
              type="password"
              placeholder="Enter your password"
              className="outline-none border-2 border-[#264143] shadow-[3px_4px_0px_1px_#722F37] w-[290px] p-3 rounded-md text-sm focus:translate-y-1 focus:shadow-[1px_2px_0px_0px_#722F37]"
            />
          </div>

          {/* Signup Button */}
          <button className="w-[290px] p-4 mt-6 text-lg font-bold text-[#EFDFBB] bg-[#722F37] rounded-xl shadow-[3px_3px_0px_0px_#E99F4C] transition-all duration-200 hover:opacity-90 focus:translate-y-1 focus:shadow-[1px_2px_0px_0px_#E99F4C]">
            SIGN UP
          </button>

          {/* Login Link */}
          <p className="mt-4 text-sm font-bold">
            Have an account?{" "}
            <Link to="/login" className="text-[#264143] font-bold px-1">
              Login Here!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
