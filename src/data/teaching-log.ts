import type { TeachingLogEntry } from "@/types";

export const teachingLogEntries: TeachingLogEntry[] = [
  { id: "tl1", lecturerId: "u2", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-03", topicsCovered: "Introduction to Software Development Life Cycle", duration: 90, notes: "Covered waterfall and agile models", semester: "2025-S1" },
  { id: "tl2", lecturerId: "u2", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-05", topicsCovered: "Requirements Engineering & Use Cases", duration: 90, notes: "Students practiced writing use case diagrams", semester: "2025-S1" },
  { id: "tl3", lecturerId: "u2", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-10", topicsCovered: "UML Diagrams – Class and Sequence Diagrams", duration: 90, notes: "Hands-on modeling session", semester: "2025-S1" },
  { id: "tl4", lecturerId: "u2", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-12", topicsCovered: "Design Patterns – Singleton, Factory, Observer", duration: 90, notes: "Implemented patterns in Java", semester: "2025-S1" },
  { id: "tl5", lecturerId: "u2", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-17", topicsCovered: "Testing Fundamentals – Unit, Integration, System", duration: 90, notes: "JUnit introduction", semester: "2025-S1" },
  { id: "tl6", lecturerId: "u2", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-19", topicsCovered: "Version Control with Git & Branching Strategies", duration: 90, notes: "Git flow demo", semester: "2025-S1" },
  { id: "tl7", lecturerId: "u2", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-24", topicsCovered: "CI/CD Pipelines and DevOps Basics", duration: 90, notes: "GitHub Actions walkthrough", semester: "2025-S1" },
  { id: "tl8", lecturerId: "u2", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-26", topicsCovered: "Code Review and Refactoring Best Practices", duration: 90, notes: "Live refactoring exercise", semester: "2025-S1" },
  { id: "tl9", lecturerId: "u2", courseCode: "CS301", courseName: "Software Engineering", date: "2025-03-03", topicsCovered: "API Design and RESTful Web Services", duration: 90, notes: "Built a simple REST API", semester: "2025-S1" },
  { id: "tl10", lecturerId: "u2", courseCode: "CS301", courseName: "Software Engineering", date: "2025-03-05", topicsCovered: "Database Design and ORM Patterns", duration: 90, notes: "Prisma and TypeORM comparison", semester: "2025-S1" },
  { id: "tl11", lecturerId: "u2", courseCode: "IT201", courseName: "Web Development", date: "2025-02-04", topicsCovered: "HTML5 and Semantic Markup", duration: 90, notes: "Accessibility best practices", semester: "2025-S1" },
  { id: "tl12", lecturerId: "u2", courseCode: "IT201", courseName: "Web Development", date: "2025-02-06", topicsCovered: "CSS Flexbox and Grid Layout", duration: 90, notes: "Responsive design principles", semester: "2025-S1" },
  { id: "tl13", lecturerId: "u2", courseCode: "IT201", courseName: "Web Development", date: "2025-02-11", topicsCovered: "JavaScript ES6+ Features", duration: 90, notes: "Arrow functions, destructuring, async/await", semester: "2025-S1" },
  { id: "tl14", lecturerId: "u2", courseCode: "IT201", courseName: "Web Development", date: "2025-02-13", topicsCovered: "React Fundamentals – Components and Props", duration: 90, notes: "First React project created", semester: "2025-S1" },
  { id: "tl15", lecturerId: "u2", courseCode: "IT201", courseName: "Web Development", date: "2025-02-18", topicsCovered: "State Management with Hooks", duration: 90, notes: "useState, useEffect patterns", semester: "2025-S1" },
  { id: "tl16", lecturerId: "u2", courseCode: "IT201", courseName: "Web Development", date: "2025-02-20", topicsCovered: "React Router and Client-Side Navigation", duration: 90, notes: "Built a multi-page SPA", semester: "2025-S1" },
  { id: "tl17", lecturerId: "u9", courseCode: "CS401", courseName: "Machine Learning", date: "2025-02-03", topicsCovered: "Introduction to ML – Supervised vs Unsupervised", duration: 90, notes: "Overview of applications", semester: "2025-S1" },
  { id: "tl18", lecturerId: "u9", courseCode: "CS401", courseName: "Machine Learning", date: "2025-02-05", topicsCovered: "Linear Regression and Gradient Descent", duration: 90, notes: "Mathematical foundations", semester: "2025-S1" },
  { id: "tl19", lecturerId: "u9", courseCode: "CS401", courseName: "Machine Learning", date: "2025-02-10", topicsCovered: "Logistic Regression and Classification", duration: 90, notes: "Binary classification problems", semester: "2025-S1" },
  { id: "tl20", lecturerId: "u9", courseCode: "CS401", courseName: "Machine Learning", date: "2025-02-12", topicsCovered: "Decision Trees and Random Forests", duration: 90, notes: "Sklearn implementation", semester: "2025-S1" },
  { id: "tl21", lecturerId: "u9", courseCode: "CS401", courseName: "Machine Learning", date: "2025-02-17", topicsCovered: "Neural Networks – Perceptron and MLP", duration: 90, notes: "Forward and backward propagation", semester: "2025-S1" },
  { id: "tl22", lecturerId: "u9", courseCode: "CS401", courseName: "Machine Learning", date: "2025-02-19", topicsCovered: "Convolutional Neural Networks", duration: 90, notes: "Image classification with CNNs", semester: "2025-S1" },
  { id: "tl23", lecturerId: "u10", courseCode: "ENG301", courseName: "Circuit Design", date: "2025-02-03", topicsCovered: "Fundamental Circuit Laws – KVL, KCL", duration: 90, notes: "Problem-solving session", semester: "2025-S1" },
  { id: "tl24", lecturerId: "u10", courseCode: "ENG301", courseName: "Circuit Design", date: "2025-02-05", topicsCovered: "Thevenin and Norton Theorems", duration: 90, notes: "Lab component included", semester: "2025-S1" },
  { id: "tl25", lecturerId: "u10", courseCode: "ENG301", courseName: "Circuit Design", date: "2025-02-10", topicsCovered: "Operational Amplifiers", duration: 90, notes: "Op-amp configurations", semester: "2025-S1" },
];

/** Total expected sessions in the semester (for computing completion %) */
export const SEMESTER_TOTAL_SESSIONS = 28;
