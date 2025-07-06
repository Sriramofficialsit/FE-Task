import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { register } from "../utils/api";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    dob: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.name.length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.age && (formData.age < 0 || formData.age > 150)) {
      setError("Age must be between 0 and 150");
      return false;
    }
    if (formData.dob && new Date(formData.dob) > new Date()) {
      setError("Date of birth cannot be in the future");
      return false;
    }
    if (formData.contact && !formData.contact.match(/^\+?[\d\s-]{10,}$/)) {
      setError("Please enter a valid contact number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    try {
      const response = await register(formData);
      localStorage.setItem("token", response.data.token);
      navigate(`/profile/${response.data.userId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
        Sign Up
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
          { name: "name", type: "text", placeholder: "Full Name" },
          { name: "email", type: "email", placeholder: "Email Address" },
          { name: "password", type: "password", placeholder: "Password" },
          { name: "age", type: "number", placeholder: "Age (optional)" },
          {
            name: "dob",
            type: "date",
            placeholder: "Date of Birth (optional)",
          },
          {
            name: "contact",
            type: "tel",
            placeholder: "Contact Number (optional)",
          },
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
              required={["name", "email", "password"].includes(field.name)}
            />
          </motion.div>
        ))}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white p-3 sm:p-4 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Sign Up
        </motion.button>
      </div>
      <p className="mt-5 text-center text-sm sm:text-base text-gray-600">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Login
        </a>
      </p>
    </motion.div>
  );
}

export default Signup;
