import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { login } from "../utils/api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    try {
      const response = await login(formData);
      localStorage.setItem("token", response.data.token);
      navigate(`/profile/${response.data.userId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto"
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-gray-900">
        Login
      </h2>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-600 mb-4 text-sm text-center font-medium"
        >
          {error}
        </motion.p>
      )}
      <div className="space-y-5">
        {[
          { name: "email", type: "email", placeholder: "Email Address" },
          { name: "password", type: "password", placeholder: "Password" },
        ].map((field) => (
          <motion.div
            key={field.name}
            whileFocus={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-gray-50 text-gray-900 placeholder-gray-500"
              required
            />
          </motion.div>
        ))}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white p-3 sm:p-4 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Login
        </motion.button>
      </div>
      <p className="mt-5 text-center text-sm sm:text-base text-gray-600">
        Don't have an account?{" "}
        <a
          href="/signup"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Sign Up
        </a>
      </p>
    </motion.div>
  );
}

export default Login;
