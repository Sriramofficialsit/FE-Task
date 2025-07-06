import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getProfile, updateProfile, logout } from "../utils/api";

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    dob: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await getProfile(userId, token);
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          age: response.data.age || "",
          dob: response.data.dob ? response.data.dob.split("T")[0] : "",
          contact: response.data.contact || "",
        });
      } catch (err) {
        setError("Failed to fetch profile");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [userId, navigate]);

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
      const token = localStorage.getItem("token");
      await updateProfile(userId, formData, token);
      setIsEditing(false);
      setUser({ ...user, ...formData });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await logout(token);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      setError("Failed to logout");
    }
  };

  if (!user)
    return (
      <motion.div
        className="text-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading...
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto"
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-gray-900">
        Profile
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
      {isEditing ? (
        <div className="space-y-5">
          {[
            {
              name: "name",
              type: "text",
              value: formData.name,
              placeholder: "Full Name",
            },
            {
              name: "email",
              type: "email",
              value: formData.email,
              placeholder: "Email Address",
            },
            {
              name: "age",
              type: "number",
              value: formData.age,
              placeholder: "Age (optional)",
            },
            {
              name: "dob",
              type: "date",
              value: formData.dob,
              placeholder: "Date of Birth (optional)",
            },
            {
              name: "contact",
              type: "tel",
              value: formData.contact,
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
                value={field.value}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-gray-50 text-gray-900 placeholder-gray-500"
                required={["name", "email"].includes(field.name)}
                placeholder={field.placeholder}
              />
            </motion.div>
          ))}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white p-3 sm:p-4 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#6b7280" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="w-full bg-gray-500 text-white p-3 sm:p-4 rounded-lg hover:bg-gray-600 transition font-semibold"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <p className="text-sm sm:text-base text-gray-700">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-sm sm:text-base text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-sm sm:text-base text-gray-700">
            <strong>Age:</strong> {user.age || "Not set"}
          </p>
          <p className="text-sm sm:text-base text-gray-700">
            <strong>DOB:</strong>{" "}
            {user.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
          </p>
          <p className="text-sm sm:text-base text-gray-700">
            <strong>Contact:</strong> {user.contact || "Not set"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="w-full bg-indigo-600 text-white p-3 sm:p-4 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Edit Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="w-full bg-red-600 text-white p-3 sm:p-4 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Profile;
