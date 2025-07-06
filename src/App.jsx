import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-indigo-100 to-gray-200"
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </motion.div>
    </Router>
  );
}

export default App;
