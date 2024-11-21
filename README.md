**Task Assignment Using Gemini**
================================

This project is an AI-powered task assignment system that leverages the Gemini API for intelligent task allocation. It includes features for task creation, team-based task assignment, and user role management (admin and member dashboards). The system is built using React.js, Firebase, and Framer Motion for advanced animations and transitions.

**Features**
------------

*   **Admin Dashboard**: Manage tasks, reassign tasks, and oversee team assignments.
    
*   **Member Dashboard**: View assigned tasks, mark tasks as completed, and see team details.
    
*   **Task Creation**: Easily create tasks with necessary details like skills and deadlines.
    
*   **Task Assignment**: Assign tasks intelligently to team members or individuals using the Gemini API.
    

**Getting Started**
-------------------

### **Installation**

1. **git clone https://github.com/tanmaycod/Task-Assignment-Using-Gemini.git
 cd Task-Assignment-Using-Gemini**
 
2. **npm install**
    
3.  **npm start**
        

### **Firebase Configuration**

1.  **Go to the Firebase Console.**
    
2.  **Create a new project**

3.  **In FirebaseConfig.js
   const firebaseConfig = { 
apiKey: "YOUR\_API\_KEY", 
authDomain: "YOUR\_AUTH\_DOMAIN", 
projectId: "YOUR\_PROJECT\_ID", 
storageBucket: "YOUR\_STORAGE\_BUCKET",
messagingSenderId: "YOUR\_MESSAGING\_SENDER\_ID", 
appId: "YOUR\_APP\_ID",
};**
    
5.  Enable **Firestore**:
    *   Go to the **Firestore Database** section and create a database in "test mode."
    
6.  Enable **Authentication**:
    
    *   Go to the **Authentication** section, and enable **Email/Password** sign-in.
        

### **Gemini API Key Configuration**

1. **Visit Google AI Studio.**
    
2.  **Sign in with your Google account.**
    
3.  **Get API key.**
    
4.  **In GeminiAI.js**
const apiKey = "YOUR\_GEMINI\_API\_KEY"; 
    

**How to Use**
--------------

### **Create a Task**

1.  **Navigate to** [http://localhost:3000/create-task](http://localhost:3000/create-task).
    
2.  **Fill in the task details:**
    
    *   Title
        
    *   Description
        
    *   Required Skills (comma-separated)
        
    *   Deadline
        
3.  Click **Create Task**. The task will be added to the database.
    

### **Assigning a Task: Detailed Process**

1.  **Navigate to the Assign Task Page:**
    
    *   Open your browser and go to [http://localhost:3000/assign-task](http://localhost:3000/assign-task).
        
    *   You will see a list of all **pending tasks** available for assignment.
        
2.  **Select a Task**:
    
    *   Browse through the displayed tasks.
        
    *   Each task will include details like:
        
        *   **Title**: The name of the task.
            
        *   **Description**: Information about the task requirements.
            
        *   **Skills Required**: The specific skills needed to complete the task.
            
    *   Click the **Assign Task** button associated with the task you want to assign.
        
3.  **Specify the Team Size**:
    
    *   A popup will appear asking you to specify the **team size**.
        
    *   Enter the desired number of team members in the input field.
        
    *   **Note:**
        *   The maximum team size allowed depends on the number of available users with the required skills.
            
        *   Ensure the team size does not exceed the number of users matching the task's criteria.
            
4.  **Click Apply**:
    
    *   Once the team size is entered, click the **Apply** button to assign the task.
        
    *   The system will:
        
        *   Use the **Gemini API** to intelligently select the best team members based on the required skills and user availability.
            
        *   Update the task status from **Pending** to **In Progress**.
    
        
**Future Enhancements**
-----------------------
    
*   Integrate additional AI capabilities.
    

**Contributing**
----------------

1.  Fork the repository.
    
2.  **git checkout -b feature/your-feature**
    
3.  **git commit -m "Add your message"**
    
4.  **git push origin feature/your-feature**
    
5.  Open a pull request.
    

**License**
-----------

This project is licensed under the MIT License.
