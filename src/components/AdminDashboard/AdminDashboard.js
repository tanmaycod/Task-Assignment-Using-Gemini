import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTasks, FaEdit } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";


const AdminDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [replacingUser, setReplacingUser] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const fetchData = async () => {
        try {
            const taskSnapshot = await getDocs(collection(db, "tasks"));
            setTasks(taskSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

            const userSnapshot = await getDocs(collection(db, "users"));
            setUsers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching tasks or users:", error);
        }
    };

    useEffect(() => {
        fetchData();

        const handleMouseMove = (e) => {
            setPointerPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const getUserDetails = (userId) => {
        const user = users.find((user) => user.id === userId);
        return user
            ? { name: user.name || "N/A", email: user.email || "N/A" }
            : { name: "Unassigned", email: "N/A" };
    };

    const handleReassign = (task) => {
        const availableUsers = users.filter(
            (user) =>
                user.availability === "available" &&
                user.skills.some((skill) =>
                    task.skillsRequired.some(
                        (requiredSkill) =>
                            skill.toLowerCase() === requiredSkill.toLowerCase()
                    )
                )
        );
        setFilteredUsers(availableUsers);
        setSelectedTask(task);
        setSelectedUser("");
        setReplacingUser("");
    };

    const handleApplyReassign = async () => {
        setIsLoading(true);
        try {
            const taskRef = doc(db, "tasks", selectedTask.id);

            
            if (replacingUser) {
                const updatedTeam = selectedTask.assignedTo.map((userId) =>
                    userId === replacingUser ? selectedUser : userId
                );

                await updateDoc(taskRef, { assignedTo: updatedTeam });

                await updateDoc(doc(db, "users", replacingUser), {
                    availability: "available",
                });

                await updateDoc(doc(db, "users", selectedUser), {
                    availability: "busy",
                });
            } else {
              
                await updateDoc(taskRef, {
                    assignedTo: [selectedUser],
                    status: "in progress",
                });

                if (selectedTask.assignedTo?.length) {
                    for (const userId of selectedTask.assignedTo) {
                        await updateDoc(doc(db, "users", userId), { availability: "available" });
                    }
                }

                await updateDoc(doc(db, "users", selectedUser), {
                    availability: "busy",
                });
            }

            alert(
                `Task "${selectedTask.title}" ${
                    replacingUser ? "team member replaced" : "has been reassigned"
                }.` 
            );
            setSelectedTask(null);
            fetchData();
        } catch (error) {
            console.error("Error reassigning task:", error);
            alert("Error reassigning task. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "pending":
                return "status-pending";
            case "in progress":
                return "status-in-progress";
            case "completed":
                return "status-completed";
            default:
                return "status-default";
        }
    };

    return (
        <div
            className="admin-dashboard"
            style={{
                "--pointer-x": `${pointerPosition.x}px`,
                "--pointer-y": `${pointerPosition.y}px`,
            }}
        >
             
            <motion.h2
                className="admin-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <FaTasks /> Admin Dashboard<button onClick={handleLogout} className="logout-button">
                Logout
            </button>
            </motion.h2>
            
            <motion.table
                className="admin-table"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Required Skills</th>
                        <th>Status</th>
                        <th>Assigned Users</th>
                        <th>Assigned Emails</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <motion.tr
                            key={task.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.skillsRequired.join(", ")}</td>
                            <td>
                                <span className={`status ${getStatusClass(task.status)}`}>
                                    {task.status}
                                </span>
                            </td>
                            <td>
                                {Array.isArray(task.assignedTo)
                                    ? task.assignedTo
                                          .map((userId) => getUserDetails(userId).name)
                                          .join(", ")
                                    : "Unassigned"}
                            </td>
                            <td>
                                {Array.isArray(task.assignedTo)
                                    ? task.assignedTo
                                          .map((userId) => getUserDetails(userId).email)
                                          .join(", ")
                                    : "Unassigned"}
                            </td>
                            <td>
                                {task.status !== "completed" && (
                                    <motion.button
                                        className="admin-reassign-button"
                                        onClick={() => handleReassign(task)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FaEdit /> Reassign
                                    </motion.button>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>
            {tasks.length === 0 && (
                <motion.p
                    className="admin-no-tasks"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    No tasks available.
                </motion.p>
            )}
            <AnimatePresence>
                {selectedTask && (
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, y: "-50%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        exit={{ opacity: 0, y: "-50%" }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3>
                            {replacingUser
                                ? `Replace Team Member for Task: ${selectedTask.title}`
                                : `Reassign Task: ${selectedTask.title}`}
                        </h3>
                        <p>Task Description: {selectedTask.description}</p>
                        {Array.isArray(selectedTask.assignedTo) && (
                            <div>
                                <label>Select Member to Replace:</label>
                                <select
                                    value={replacingUser}
                                    onChange={(e) => setReplacingUser(e.target.value)}
                                    className="admin-modal-select"
                                >
                                    <option value="" disabled>
                                        Select a team member
                                    </option>
                                    {selectedTask.assignedTo.map((userId) => (
                                        <option key={userId} value={userId}>
                                            {getUserDetails(userId).name} (
                                            {getUserDetails(userId).email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <label>Select New User:</label>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="admin-modal-select"
                        >
                            <option value="" disabled>
                                Select a user
                            </option>
                            {filteredUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        <div className="admin-modal-actions">
                            <motion.button
                                className="admin-modal-button apply"
                                onClick={handleApplyReassign}
                                disabled={!selectedUser || isLoading}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Apply
                            </motion.button>
                            <motion.button
                                className="admin-modal-button cancel"
                                onClick={() => setSelectedTask(null)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                        </div>
                        {isLoading && (
                            <motion.div
                                className="admin-progress-bar"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2 }}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
