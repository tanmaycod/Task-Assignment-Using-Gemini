import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import { assignTask } from "../../utils/GeminiAPI";
import { motion, AnimatePresence } from "framer-motion";
import { FaTasks, FaUserFriends, FaCog, FaCheck } from "react-icons/fa";

const TaskAssignment = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [teamSize, setTeamSize] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskSnapshot = await getDocs(collection(db, "tasks"));
        setTasks(
          taskSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((task) => task.status === "pending")
        );

        const userQuery = query(collection(db, "users"), where("role", "==", "member"));
        const userSnapshot = await getDocs(userQuery);
        setUsers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching tasks or users:", error);
      }
    };

    fetchData();
  }, []);

  const handleAssignTaskClick = (task) => {
    setSelectedTask(task);
    setTeamSize(1); // Reset team size
  };

  const handleApplyAssignment = async () => {
    setIsAssigning(true);
    setProgressMessage("Connecting to AI system...");
    try {
      const assignedUsers = await assignTask(selectedTask, users, teamSize);

      setProgressMessage(`Assigning task "${selectedTask.title}" to the selected team...`);

      await Promise.all(
        assignedUsers.map(async (user) => {
          await updateDoc(doc(db, "tasks", selectedTask.id), {
            status: "in progress",
            assignedTo: assignedUsers.map((user) => user.id), // List of team members
          });

          await updateDoc(doc(db, "users", user.id), {
            availability: "busy",
          });
        })
      );

      setProgressMessage("Finalizing team assignment...");
      alert(`Task "${selectedTask.title}" has been assigned to a team of ${teamSize}.`);
      setTasks(tasks.filter((t) => t.id !== selectedTask.id)); // Remove the task from the list
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error assigning task: " + error.message);
    } finally {
      setIsAssigning(false);
      setProgressMessage("");
      setSelectedTask(null); // Close the popup
    }
  };

  return (
    <div className={`assign-container ${isAssigning ? "assign-disable-mouse" : ""}`}>
      <motion.h2
        className="assign-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <FaTasks className="assign-title-icon" /> Task Assignment
      </motion.h2>
      {isAssigning && (
        <motion.div
          className="assign-progress-bar"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3 }}
        >
          <motion.p
            className="assign-progress-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {progressMessage}
          </motion.p>
        </motion.div>
      )}
      <motion.ul
        className="assign-task-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {tasks.map((task) => (
          <motion.li
            className="assign-task-item"
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.6 }}
          >
            <h3>
              <FaTasks className="assign-task-icon" /> {task.title}
            </h3>
            <p>{task.description}</p>
            <p>
              <strong>
                <FaCog className="assign-skill-icon" /> Skills Required:
              </strong>{" "}
              {task.skillsRequired.join(", ")}
            </p>
            <motion.button
              className="assign-button"
              whileHover={{
                scale: 1.1,
                backgroundColor: "#6a11cb",
                color: "#fff",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAssignTaskClick(task)}
              disabled={isAssigning}
            >
              Assign Task
            </motion.button>
          </motion.li>
        ))}
      </motion.ul>
      {tasks.length === 0 && (
        <motion.p
          className="assign-no-tasks"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No pending tasks available.
        </motion.p>
      )}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            className="assign-popup"
            initial={{ opacity: 0, y: "-50%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-50%" }}
            transition={{ duration: 0.5 }}
          >
            <h3>
              <FaUserFriends className="assign-popup-icon" /> Assign Task:{" "}
              {selectedTask.title}
            </h3>
            <p>Task Description: {selectedTask.description}</p>
            <label>Team Size:</label>
            <motion.input
              type="number"
              min="1"
              max={users.length}
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value))}
              className="assign-popup-input"
              whileFocus={{ scale: 1.05, borderColor: "#6a11cb" }}
            />
            <div className="assign-popup-actions">
              <motion.button
                className="assign-popup-button apply"
                whileHover={{ scale: 1.1, backgroundColor: "#6a11cb", color: "#fff" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApplyAssignment}
              >
                <FaCheck className="assign-popup-icon" /> Apply
              </motion.button>
              <motion.button
                className="assign-popup-button cancel"
                whileHover={{ scale: 1.1, backgroundColor: "#f5576c", color: "#fff" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTask(null)}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskAssignment;
