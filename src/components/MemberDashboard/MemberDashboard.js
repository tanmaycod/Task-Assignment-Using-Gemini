import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { FaCheckCircle, FaHourglassHalf, FaTasks, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MemberDashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [teamDetails, setTeamDetails] = useState({});
    const [isCompleting, setIsCompleting] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    
    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;
            const q = query(collection(db, "tasks"), where("assignedTo", "array-contains", user.uid));
            const taskSnapshot = await getDocs(q);

            const fetchedTasks = taskSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

           
            fetchedTasks.sort((a, b) => {
                if (a.status === "in progress" && b.status === "completed") return -1;
                if (a.status === "completed" && b.status === "in progress") return 1;
                return 0;
            });

            
            const teamInfo = {};
            for (const task of fetchedTasks) {
                if (Array.isArray(task.assignedTo)) {
                    const teamQuery = query(
                        collection(db, "users"),
                        where("id", "in", task.assignedTo)
                    );
                    const teamSnapshot = await getDocs(teamQuery);
                    teamInfo[task.id] = teamSnapshot.docs.map((memberDoc) => ({
                        name: memberDoc.data().name,
                        email: memberDoc.data().email,
                    }));
                }
            }

            setTasks(fetchedTasks);
            setTeamDetails(teamInfo);
        };

        fetchTasks();
    }, [user]);

   
    const handleCompleteTask = async (task) => {
        setIsCompleting(true);
        try {
            const taskRef = doc(db, "tasks", task.id);
            await updateDoc(taskRef, {
                status: "completed",
            });

            
            if (Array.isArray(task.assignedTo)) {
                for (const memberId of task.assignedTo) {
                    const userRef = doc(db, "users", memberId);
                    await updateDoc(userRef, {
                        availability: "available",
                    });
                }
            } else {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    availability: "available",
                });
            }

            alert(`Task "${task.title}" has been marked as completed.`);
            window.location.reload(); 
        } catch (error) {
            console.error("Error completing task:", error);
            alert("Error completing task. Please try again.");
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <div className="member-dashboard">
             <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
            <motion.h1
                className="member-title"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                }}
            >
                My <span className="member-title-highlight">Tasks</span>
            </motion.h1>
            <motion.div
                className="member-title-border"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            ></motion.div>
            {isCompleting && (
                <div className="progress-bar">
                    <div className="progress-bar-inner"></div>
                </div>
            )}
            <ul className="member-task-list">
                {tasks.map((task) => (
                    <motion.li
                        key={task.id}
                        className="member-task-card"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <h3 className="member-task-title">
                            <FaTasks className="member-task-icon" /> {task.title}
                        </h3>
                        <p className="member-task-desc">{task.description}</p>
                        <p className={`member-task-status member-task-status-${task.status}`}>
                            {task.status === "in progress" ? (
                                <FaHourglassHalf className="member-status-icon" />
                            ) : (
                                <FaCheckCircle className="member-status-icon" />
                            )}
                            {` Status: ${task.status}`}
                        </p>
                        {Array.isArray(task.assignedTo) ? (
                            <>
                                <p>
                                    <strong>Team Size:</strong> {task.assignedTo.length}
                                </p>
                                <div className="member-team-details">
                                    <strong>Team Members:</strong>
                                    <ul>
                                        {teamDetails[task.id]?.map((member, index) => (
                                            <li key={index}>
                                                <FaUsers className="member-team-icon" />
                                                {member.name} ({member.email})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <p>
                                <strong>Assigned Individually:</strong> Yes
                            </p>
                        )}
                        {task.status === "in progress" && (
                            <motion.button
                                onClick={() => handleCompleteTask(task)}
                                className="member-task-button"
                                whileHover={{
                                    background: [
                                        "linear-gradient(90deg, #ff9a9e, #fad0c4)",
                                        "linear-gradient(90deg, #fbc2eb, #a18cd1)",
                                    ],
                                }}
                            >
                                Mark as Completed
                            </motion.button>
                        )}
                    </motion.li>
                ))}
            </ul>
            {tasks.length === 0 && (
                <motion.p
                    className="member-no-tasks"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    No tasks assigned to you.
                </motion.p>
            )}
        </div>
    );
};

export default MemberDashboard;
