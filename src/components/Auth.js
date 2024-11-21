import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/FirebaseConfig";
import { FaUser, FaEnvelope, FaLock, FaCogs } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    setEmail("");
    setPassword("");
    setName("");
    setSkills("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name,
        email: user.email,
        role: "member",
        skills: skills.split(",").map((skill) => skill.trim()),
        availability: "available",
      });

      alert("Signup successful! You can now log in.");
      toggleAuthMode();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === "admin") {
          navigate("/admin");
        } else if (userData.role === "member") {
          navigate("/member");
        } else {
          alert("Invalid role. Please contact the administrator.");
        }
      } else {
        alert("No user data found!");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-container ${isSignup ? "signup-mode" : ""}`}>
      <div className="auth-card-container">
        <motion.div
          className="auth-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="auth-title">{isSignup ? "Create an Account" : "Welcome Back"}</h2>
          <AnimatePresence mode="wait">
            <motion.form
              key={isSignup ? "signup" : "login"}
              onSubmit={isSignup ? handleSignup : handleLogin}
              className="auth-form"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isSignup && (
                <>
                  <div className="auth-input-group">
                    <FaUser className="auth-icon" />
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-input-group">
                    <FaCogs className="auth-icon" />
                    <input
                      type="text"
                      placeholder="Skills (comma-separated)"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      required
                      className="auth-input"
                    />
                  </div>
                </>
              )}
              <div className="auth-input-group">
                <FaEnvelope className="auth-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <FaLock className="auth-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>
              <motion.button
                type="submit"
                className="auth-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {Array.from(isSignup ? "Signup" : "Login").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: index * 0.05,
                        duration: 0.2,
                      },
                    }}
                    whileHover={{
                      color: "#f5576c",
                      y: -5,
                      transition: {
                        yoyo: Infinity,
                        duration: 0.3,
                      },
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.button>
            </motion.form>
          </AnimatePresence>
          {isLoading && (
            <motion.div
              className="auth-progress-bar"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
            />
          )}
          <motion.p
            onClick={toggleAuthMode}
            className="auth-toggle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
