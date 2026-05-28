/**
 * Exam paper upload mock data.
 * Each exam paper is uploaded by a lecturer and undergoes topic-coverage
 * matching against the teaching log before being forwarded to the exam office.
 */

export interface CourseSyllabus {
  courseCode: string;
  courseName: string;
  topics: string[];
}

export interface ExamQuestion {
  number: number;
  text: string;
  /** Keywords used for topic-matching against the teaching log */
  topicKeywords: string[];
  marks: number;
}

export interface ExamPaper {
  id: string;
  lecturerId: string;
  lecturerName: string;
  courseCode: string;
  courseName: string;
  semester: string;
  uploadDate: string;
  questions: ExamQuestion[];
  totalMarks: number;
  duration: string; // e.g. "3 hours"
  instructions: string;
  status: "draft" | "topic_review" | "flagged" | "cleared" | "submitted_to_office" | "approved_by_hod" | "rejected";
  coverageReport?: TopicCoverageReport;
}

export interface TopicCoverageReport {
  coveredTopics: string[];
  uncoveredTopics: string[];
  partialTopics: { topic: string; reason: string }[];
  coveragePct: number;
  flagCount: number;
  generatedAt: string;
}

/* ─── Course syllabi (the official topic list per course) ─── */

export const courseSyllabi: CourseSyllabus[] = [
  {
    courseCode: "CS301",
    courseName: "Software Engineering",
    topics: [
      "Software Development Life Cycle",
      "Requirements Engineering",
      "UML Diagrams",
      "Design Patterns",
      "Testing Fundamentals",
      "Version Control with Git",
      "CI/CD Pipelines",
      "Code Review and Refactoring",
      "API Design and REST",
      "Database Design and ORM",
      "Software Architecture",
      "Agile Methodologies",
      "Project Management",
      "Software Security",
    ],
  },
  {
    courseCode: "IT201",
    courseName: "Web Development",
    topics: [
      "HTML5 and Semantic Markup",
      "CSS Flexbox and Grid",
      "JavaScript ES6+",
      "React Components and Props",
      "State Management with Hooks",
      "React Router and Navigation",
      "REST API Integration",
      "Node.js and Express",
      "Database Connectivity",
      "Authentication and Authorization",
      "Docker Containerization",
      "GraphQL API Design",
    ],
  },
  {
    courseCode: "CS401",
    courseName: "Machine Learning",
    topics: [
      "Supervised vs Unsupervised Learning",
      "Linear Regression",
      "Logistic Regression",
      "Decision Trees and Random Forests",
      "Neural Networks and MLP",
      "Convolutional Neural Networks",
      "Recurrent Neural Networks",
      "Reinforcement Learning",
      "Model Evaluation and Validation",
      "Feature Engineering",
    ],
  },
  {
    courseCode: "ENG301",
    courseName: "Circuit Design",
    topics: [
      "KVL and KCL",
      "Thevenin and Norton Theorems",
      "Operational Amplifiers",
      "FPGA Design",
      "Signal Processing",
      "Power Electronics",
      "Transistor Circuits",
      "Digital Logic Design",
    ],
  },
];

/* ─── Mock exam papers with questions ─── */

export const examPapers: ExamPaper[] = [
  {
    id: "ep1",
    lecturerId: "u2",
    lecturerName: "Dr. Sarah Mugisha",
    courseCode: "CS301",
    courseName: "Software Engineering",
    semester: "2025-S1",
    uploadDate: "2025-03-10",
    totalMarks: 100,
    duration: "3 hours",
    instructions: "Answer ALL questions in Section A and any THREE from Section B.",
    status: "approved_by_hod",
    questions: [
      { number: 1, text: "Explain the Waterfall and Agile software development models. Compare their strengths and weaknesses.", topicKeywords: ["Software Development Life Cycle", "Agile"], marks: 15 },
      { number: 2, text: "Draw a Use Case diagram for an online library management system.", topicKeywords: ["Requirements Engineering", "UML Diagrams"], marks: 15 },
      { number: 3, text: "Describe the Singleton and Observer design patterns with code examples.", topicKeywords: ["Design Patterns"], marks: 15 },
      { number: 4, text: "Explain unit testing, integration testing, and system testing with examples.", topicKeywords: ["Testing Fundamentals"], marks: 15 },
      { number: 5, text: "Describe the Git branching strategy used in professional teams.", topicKeywords: ["Version Control with Git"], marks: 10 },
      { number: 6, text: "Design a REST API for a student registration system.", topicKeywords: ["API Design and REST"], marks: 15 },
      { number: 7, text: "Explain database normalization and ORM patterns.", topicKeywords: ["Database Design and ORM"], marks: 15 },
    ],
    coverageReport: {
      coveredTopics: ["Software Development Life Cycle", "Requirements Engineering", "UML Diagrams", "Design Patterns", "Testing Fundamentals", "Version Control with Git", "API Design and REST", "Database Design and ORM"],
      uncoveredTopics: [],
      partialTopics: [],
      coveragePct: 100,
      flagCount: 0,
      generatedAt: "2025-03-10T10:30:00",
    },
  },
  {
    id: "ep2",
    lecturerId: "u2",
    lecturerName: "Dr. Sarah Mugisha",
    courseCode: "IT201",
    courseName: "Web Development",
    semester: "2025-S1",
    uploadDate: "2025-03-14",
    totalMarks: 100,
    duration: "3 hours",
    instructions: "Answer ALL questions.",
    status: "flagged",
    questions: [
      { number: 1, text: "Explain semantic HTML5 elements and their importance for accessibility.", topicKeywords: ["HTML5 and Semantic Markup"], marks: 10 },
      { number: 2, text: "Build a responsive layout using CSS Grid. Explain your approach.", topicKeywords: ["CSS Flexbox and Grid"], marks: 15 },
      { number: 3, text: "Write a Dockerfile for a Node.js application and explain each layer.", topicKeywords: ["Docker Containerization"], marks: 15 },
      { number: 4, text: "Explain React hooks: useState, useEffect, and useContext.", topicKeywords: ["State Management with Hooks", "React Components and Props"], marks: 15 },
      { number: 5, text: "Implement client-side routing using React Router.", topicKeywords: ["React Router and Navigation"], marks: 10 },
      { number: 6, text: "Compare REST and GraphQL APIs. When would you choose one over the other?", topicKeywords: ["REST API Integration", "GraphQL API Design"], marks: 15 },
      { number: 7, text: "Design a GraphQL schema for a blog application with queries and mutations.", topicKeywords: ["GraphQL API Design"], marks: 20 },
    ],
    coverageReport: {
      coveredTopics: ["HTML5 and Semantic Markup", "CSS Flexbox and Grid", "State Management with Hooks", "React Components and Props", "React Router and Navigation"],
      uncoveredTopics: ["Docker Containerization", "GraphQL API Design"],
      partialTopics: [
        { topic: "REST API Integration", reason: "REST was mentioned but full API integration lab was not completed" },
      ],
      coveragePct: 58,
      flagCount: 3,
      generatedAt: "2025-03-14T14:20:00",
    },
  },
  {
    id: "ep3",
    lecturerId: "u9",
    lecturerName: "Prof. Agnes Ntamwiza",
    courseCode: "CS401",
    courseName: "Machine Learning",
    semester: "2025-S1",
    uploadDate: "2025-03-15",
    totalMarks: 100,
    duration: "3 hours",
    instructions: "Answer any FIVE questions.",
    status: "flagged",
    questions: [
      { number: 1, text: "Derive the cost function for linear regression and explain gradient descent.", topicKeywords: ["Linear Regression"], marks: 20 },
      { number: 2, text: "Explain logistic regression for binary classification problems.", topicKeywords: ["Logistic Regression"], marks: 15 },
      { number: 3, text: "Compare Decision Trees with Random Forests in terms of accuracy and overfitting.", topicKeywords: ["Decision Trees and Random Forests"], marks: 15 },
      { number: 4, text: "Explain forward and backward propagation in a multilayer perceptron.", topicKeywords: ["Neural Networks and MLP"], marks: 20 },
      { number: 5, text: "Describe the architecture and application of reinforcement learning.", topicKeywords: ["Reinforcement Learning"], marks: 15 },
      { number: 6, text: "Explain CNNs and their application in image classification.", topicKeywords: ["Convolutional Neural Networks"], marks: 15 },
    ],
    coverageReport: {
      coveredTopics: ["Linear Regression", "Logistic Regression", "Decision Trees and Random Forests", "Neural Networks and MLP", "Convolutional Neural Networks"],
      uncoveredTopics: [],
      partialTopics: [
        { topic: "Reinforcement Learning", reason: "Only 1 session was dedicated to RL; insufficient for a 15-mark question" },
      ],
      coveragePct: 83,
      flagCount: 1,
      generatedAt: "2025-03-15T09:45:00",
    },
  },
  {
    id: "ep4",
    lecturerId: "u10",
    lecturerName: "Dr. Jean B. Niyonzima",
    courseCode: "ENG301",
    courseName: "Circuit Design",
    semester: "2025-S1",
    uploadDate: "2025-03-16",
    totalMarks: 100,
    duration: "3 hours",
    instructions: "Answer ALL questions.",
    status: "flagged",
    questions: [
      { number: 1, text: "Apply KVL and KCL to solve a circuit with three meshes.", topicKeywords: ["KVL and KCL"], marks: 15 },
      { number: 2, text: "Design an FPGA-based digital counter and explain the synthesis process.", topicKeywords: ["FPGA Design"], marks: 20 },
      { number: 3, text: "Analyze an op-amp circuit in inverting and non-inverting configurations.", topicKeywords: ["Operational Amplifiers"], marks: 15 },
      { number: 4, text: "Explain discrete Fourier transform and its application in signal processing.", topicKeywords: ["Signal Processing"], marks: 15 },
      { number: 5, text: "Describe Thevenin's theorem and apply it to simplify a complex circuit.", topicKeywords: ["Thevenin and Norton Theorems"], marks: 15 },
      { number: 6, text: "Explain the operation of a buck converter and design one for 12V to 5V conversion.", topicKeywords: ["Power Electronics"], marks: 20 },
    ],
    coverageReport: {
      coveredTopics: ["KVL and KCL", "Thevenin and Norton Theorems", "Operational Amplifiers"],
      uncoveredTopics: ["FPGA Design", "Signal Processing", "Power Electronics"],
      partialTopics: [],
      coveragePct: 42,
      flagCount: 3,
      generatedAt: "2025-03-16T11:15:00",
    },
  },
];

/**
 * Utility: match exam questions against teaching log to generate coverage report.
 * In production this would call an API; here we use the pre-computed reports above.
 */
export function getExamPapersByLecturer(lecturerId: string): ExamPaper[] {
  return examPapers.filter((p) => p.lecturerId === lecturerId);
}

export function getExamPapersByCourse(courseCode: string): ExamPaper[] {
  return examPapers.filter((p) => p.courseCode === courseCode);
}

export function getAllFlaggedPapers(): ExamPaper[] {
  return examPapers.filter((p) => p.status === "flagged");
}
