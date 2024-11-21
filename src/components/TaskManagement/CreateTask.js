import React, { useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import { motion } from "framer-motion";
import { FaTasks, FaRegCalendarAlt, FaCogs, FaEdit } from "react-icons/fa";

const CreateTask = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [skillsRequired, setSkillsRequired] = useState("");
    const [deadline, setDeadline] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const docRef = await addDoc(collection(db, "tasks"), {
                title,
                description,
                skillsRequired: skillsRequired.split(",").map((skill) => skill.trim()),
                deadline,
                status: "pending",
            });

            await updateDoc(doc(db, "tasks", docRef.id), {
                id: docRef.id,
            });

            alert("Task created successfully!");
            setTitle("");
            setDescription("");
            setSkillsRequired("");
            setDeadline("");
        } catch (error) {
            alert("Error creating task: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="task-container">
            <motion.h2
                className="task-title"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                whileHover={{ scale: 1.1 }}
            >
                <FaTasks style={{ marginRight: "10px" }} /> Create Task
            </motion.h2>
            <motion.form
                className="task-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    ease: [0.17, 0.67, 0.83, 0.67],
                }}
                whileHover={{
                    borderRadius: ["15px", "25px", "35px", "45px", "15px"],
                }}
            >
                <motion.div
                    className="task-input-wrapper"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <FaEdit className="task-input-icon" />
                    <motion.input
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="task-input"
                        whileFocus={{
                            scale: 1.05,
                            borderColor: "#6a11cb",
                            boxShadow: "0 0 8px rgba(106, 17, 203, 0.5)",
                        }}
                    />
                </motion.div>
                <motion.div
                    className="task-input-wrapper"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <FaEdit className="task-input-icon" />
                    <motion.textarea
                        placeholder="Task Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="task-textarea"
                        whileFocus={{
                            scale: 1.05,
                            borderColor: "#2575fc",
                            boxShadow: "0 0 8px rgba(37, 117, 252, 0.5)",
                        }}
                    />
                </motion.div>
                <motion.div
                    className="task-input-wrapper"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <FaCogs className="task-input-icon" />
                    <motion.input
                        type="text"
                        placeholder="Skills Required (comma-separated)"
                        value={skillsRequired}
                        onChange={(e) => setSkillsRequired(e.target.value)}
                        required
                        className="task-input"
                        whileFocus={{
                            scale: 1.05,
                            borderColor: "#f093fb",
                            boxShadow: "0 0 8px rgba(240, 147, 251, 0.5)",
                        }}
                    />
                </motion.div>
                <motion.div
                    className="task-input-wrapper"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <FaRegCalendarAlt className="task-input-icon" />
                    <motion.input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                        className="task-input"
                        whileFocus={{
                            scale: 1.05,
                            borderColor: "#f5576c",
                            boxShadow: "0 0 8px rgba(245, 87, 108, 0.5)",
                        }}
                    />
                </motion.div>
                <motion.button
                    type="submit"
                    className="task-button"
                    whileHover={{
                        scale: 1.1,
                        backgroundColor: "#6a11cb",
                        boxShadow: "0 8px 16px rgba(106, 17, 203, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create Task"}
                </motion.button>
                {isSubmitting && (
                    <motion.div
                        className="task-progress-bar"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </motion.form>
        </div>
    );
};

export default CreateTask;
