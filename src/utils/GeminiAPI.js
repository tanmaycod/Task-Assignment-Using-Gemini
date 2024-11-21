const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "your_apiKey";

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

function generateInput(task, users, teamSize) {
  const taskDetails = `Task Details:
  - Title: ${task.title}
  - Description: ${task.description}
  - Skills Required: ${task.skillsRequired.join(", ")}
  - Deadline: ${task.deadline}
  - Team Size Required: ${teamSize}`;

  const userDetails = users
    .map(
      (user, index) => `
Candidate ${index + 1}:
  User ID: ${user.id}
  Name: ${user.name}
  Skills: ${user.skills.join(", ")}
  Availability: ${user.availability}`
    )
    .join("\n");

  return `${taskDetails}\n\nCandidates:\n${userDetails}\n\nBased on the task requirements and candidate profiles, please respond with the User IDs of the most suitable candidates for the team.`;
}

async function assignTask(task, users, teamSize) {
  if (!task || typeof task !== "object") {
    throw new Error("Task must be a valid object.");
  }
  if (!Array.isArray(users) || users.length === 0) {
    throw new Error("Users must be a non-empty array.");
  }

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const input = generateInput(task, users, teamSize);

  console.log("Generated Input for API:", input);

  const result = await chatSession.sendMessage(input);

  console.log("Full API Response:", JSON.stringify(result, null, 2));

  const candidateText =
    result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!candidateText) {
    throw new Error("Gemini API returned an unexpected response format.");
  }

  // Extract User IDs from the response
  const userIds = [...candidateText.matchAll(/([\w-]+)/g)].map((match) => match[1]);

  if (!userIds || userIds.length < teamSize) {
    throw new Error(
      "Unable to extract sufficient User IDs for team assignment from Gemini API response."
    );
  }

  // Find the users with the extracted IDs
  const assignedUsers = userIds
    .map((userId) => users.find((user) => user.id === userId))
    .filter((user) => user);

  if (assignedUsers.length !== teamSize) {
    console.error("Available Users:", users);
    throw new Error(`Not enough users found for team assignment.`);
  }

  return assignedUsers;
}

module.exports = { assignTask };
