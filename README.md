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

1.  bashCopy codegit clone https://github.com/tanmaycod/Task-Assignment-Using-Gemini.gitcd Task-Assignment-Using-Gemini
    
2.  bashCopy codenpm install
    
3.  bashCopy codenpm start
    
4.  Open your browser and navigate to:
    
    *   **Create Task**: [http://localhost:3000/create-task](http://localhost:3000/create-task)
        
    *   **Assign Task**: [http://localhost:3000/assign-task](http://localhost:3000/assign-task)
        

### **Firebase Configuration**

1.  Go to the Firebase Console.
    
2.  Create a new project and navigate to the **Project Settings**.
    
3.  Under the **General** tab, find the Firebase configuration object.
    
4.  javascriptCopy codeconst firebaseConfig = { apiKey: "YOUR\_API\_KEY", authDomain: "YOUR\_AUTH\_DOMAIN", projectId: "YOUR\_PROJECT\_ID", storageBucket: "YOUR\_STORAGE\_BUCKET", messagingSenderId: "YOUR\_MESSAGING\_SENDER\_ID", appId: "YOUR\_APP\_ID",};
    
5.  Enable **Firestore**:
    
    *   Go to the **Firestore Database** section and create a database in "test mode."
        
6.  Enable **Authentication**:
    
    *   Go to the **Authentication** section, and enable **Email/Password** sign-in.
        

### **Gemini API Key Configuration**

1.  Visit the Gemini API Documentation.
    
2.  Sign in with your Google Cloud account.
    
3.  Enable the Gemini API and create an API key in the **API & Services** section of Google Cloud Console.
    
4.  javascriptCopy codeconst apiKey = "YOUR\_GEMINI\_API\_KEY";
    

**How to Use**
--------------

### **Create a Task**

1.  Navigate to [http://localhost:3000/create-task](http://localhost:3000/create-task).
    
2.  Fill in the task details:
    
    *   Title
        
    *   Description
        
    *   Required Skills (comma-separated)
        
    *   Deadline
        
3.  Click **Create Task**. The task will be added to the database.
    

### **Assign a Task**

1.  Navigate to [http://localhost:3000/assign-task](http://localhost:3000/assign-task).
    
2.  Select a task from the list of pending tasks.
    
3.  Specify the team size.
    
4.  Click **Apply** to assign the task to a team.
    

### **Navigation**

*   **Admin Dashboard**: /admin
    
    *   Manage tasks and reassign team members.
        
*   **Member Dashboard**: /member
    
    *   View and complete tasks assigned to you.
        
*   **Create Task**: /create-task
    
    *   Add new tasks to the system.
        
*   **Assign Task**: /assign-task
    
    *   Assign tasks to team members or individuals.
        

**Dependencies**
----------------

*   React.js
    
*   Firebase (Firestore and Authentication)
    
*   Framer Motion
    
*   Gemini API
    

**Folder Structure**
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cssCopy codesrc/  ├── components/  │   ├── AdminDashboard.js  │   ├── MemberDashboard.js  │   ├── CreateTask.js  │   ├── TaskAssignment.js  │   └── Auth.js  ├── context/  │   └── AuthContext.js  ├── utils/  │   ├── FirebaseConfig.js  │   └── GeminiAPI.js  ├── App.css  └── App.js   `

**Future Enhancements**
-----------------------

*   Add role-based permissions.
    
*   Improve UI with more animations.
    
*   Integrate additional AI capabilities.
    

**Contributing**
----------------

1.  Fork the repository.
    
2.  bashCopy codegit checkout -b feature/your-feature
    
3.  bashCopy codegit commit -m "Add your message"
    
4.  bashCopy codegit push origin feature/your-feature
    
5.  Open a pull request.
    

**License**
-----------

This project is licensed under the MIT License.
