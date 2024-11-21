import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateTask from "./components/TaskManagement/CreateTask";
import TaskAssignment from "./components/TaskManagement/TaskAssignment";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import MemberDashboard from "./components/MemberDashboard/MemberDashboard";
import Auth from "./components/Auth";
import ProtectedRoute from "./ProtectedRoute"; 
import { AuthProvider } from "./context/AuthContext";
import "./styles/App.css";

const App = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/create-task" element={<CreateTask />} />
                <Route path="/assign-task" element={<TaskAssignment />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/member"
                    element={
                        <ProtectedRoute>
                            <MemberDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
