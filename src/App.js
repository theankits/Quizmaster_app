import React, { useState } from "react";
import "./App.css";

// Module Icons
const moduleIcons = {
  Addition: "➕",
  Subtraction: "➖",
  Multiplication: "✖️",
  Division: "➗",
  Algebra: "✏️",
  Geometry: "📐",
  Science: "🔬",
  History: "🏛️",
  Programming: "💻",
  GK: "🌍",
};

// Module Colors
const moduleColors = {
  Math: "#667eea",
  Science: "#43e97b",
  History: "#a18cd1",
  Programming: "#ff758c",
  GK: "#f9d423",
};

function App() {
  // Modules List
  const modulesList = [
    { title: "Addition", subject: "Math", type: "math", operation: "+" },
    { title: "Subtraction", subject: "Math", type: "math", operation: "-" },
    { title: "Multiplication", subject: "Math", type: "math", operation: "*" },
    { title: "Division", subject: "Math", type: "math", operation: "/" },
    { title: "Algebra", subject: "Math", type: "math", operation: "algebra" },
    { title: "Geometry", subject: "Math", type: "math", operation: "geometry" },
    { title: "Science Basics", subject: "Science", type: "quiz" },
    { title: "World History", subject: "History", type: "quiz" },
    { title: "Programming Basics", subject: "Programming", type: "quiz" },
    { title: "General Knowledge", subject: "GK", type: "quiz" },
  ];

  const [currentSubject, setCurrentSubject] = useState("All");
  const [activeQuizModule, setActiveQuizModule] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  // Question Bank for non-math modules
  const questionBank = {
    "Science Basics": [
      { question: "Water boils at ___°C?", options: ["90", "100", "110", "120"], answer: "100", explanation: "Water boils at 100°C." },
      { question: "Which planet is Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars", explanation: "Mars is called the Red Planet." },
    ],
    "World History": [
      { question: "Who discovered America?", options: ["Columbus", "Magellan", "Newton", "Einstein"], answer: "Columbus", explanation: "Christopher Columbus reached America in 1492." },
      { question: "The Great Wall is in?", options: ["China", "India", "Egypt", "Greece"], answer: "China", explanation: "The Great Wall is in China." },
    ],
    "Programming Basics": [
      { question: "Which language is used for web development?", options: ["Python", "JavaScript", "C++", "Java"], answer: "JavaScript", explanation: "JavaScript is widely used for web development." },
      { question: "HTML stands for?", options: ["Hyper Text Markup Language","High Text Markup Language","Hyper Tabular Markup Language","None"], answer: "Hyper Text Markup Language", explanation: "HTML stands for Hyper Text Markup Language." },
    ],
    "General Knowledge": [
      { question: "Capital of France?", options: ["Paris","London","Berlin","Madrid"], answer: "Paris", explanation: "Paris is the capital of France." },
      { question: "Fastest land animal?", options: ["Cheetah","Lion","Tiger","Horse"], answer: "Cheetah", explanation: "Cheetah is the fastest land animal." },
    ],
  };

  // Generate random math question
  const generateMathQuestion = (module) => {
    let a = Math.floor(Math.random() * 50) + 1;
    let b = Math.floor(Math.random() * 50) + 1;
    let question = "", answer = 0, explanation = "";

    switch (module.operation) {
      case "+": question = `${a} + ${b} = ?`; answer = a + b; explanation = `${a} + ${b} = ${answer}`; break;
      case "-": question = `${a} - ${b} = ?`; answer = a - b; explanation = `${a} - ${b} = ${answer}`; break;
      case "*": question = `${a} × ${b} = ?`; answer = a * b; explanation = `${a} × ${b} = ${answer}`; break;
      case "/":
        b = Math.floor(Math.random() * 10) + 1;
        a = b * (Math.floor(Math.random() * 10) + 1);
        question = `${a} ÷ ${b} = ?`; answer = a / b; explanation = `${a} ÷ ${b} = ${answer}`;
        break;
      case "algebra":
        const x = Math.floor(Math.random() * 20) + 1;
        const add = Math.floor(Math.random() * 10);
        question = `Solve: x + ${add} = ${x + add}`; answer = x; explanation = `x + ${add} = ${x + add} → x = ${answer}`; break;
      case "geometry":
        const side = Math.floor(Math.random() * 20) + 1;
        question = `Area of square with side ${side}?`; answer = side*side; explanation = `Area = side² → ${side}² = ${answer}`; break;
      default: question = "Unknown"; answer = 0; explanation = ""; break;
    }

    const options = [answer, answer + Math.floor(Math.random()*5)+1, answer - Math.floor(Math.random()*5)-1, answer + Math.floor(Math.random()*10)+2]
      .map(String).sort(() => Math.random() - 0.5);

    return { question, options, answer: String(answer), explanation };
  };

  const startQuiz = (module) => {
    setActiveQuizModule(module);
    setScore(0); setStreak(0); setQuestionIndex(0); setFeedback(null); setShowAbout(false);
    if (module.type === "math") setCurrentQuestion(generateMathQuestion(module));
    else setCurrentQuestion({ ...questionBank[module.title][0] });
  };

  const handleAnswer = (option) => {
    if (!currentQuestion) return;
    if (option === currentQuestion.answer) {
      setScore(score+1); setStreak(streak+1);
      setFeedback({ correct:true, explanation: currentQuestion.explanation });
    } else {
      setStreak(0);
      setFeedback({ correct:false, explanation: currentQuestion.explanation });
    }
  };

  const nextQuestion = () => {
    if (!activeQuizModule) return;
    if (activeQuizModule.type === "math") setCurrentQuestion(generateMathQuestion(activeQuizModule));
    else {
      const questions = questionBank[activeQuizModule.title];
      const nextIndex = (questionIndex+1) % questions.length;
      setCurrentQuestion({ ...questions[nextIndex] });
      setQuestionIndex(nextIndex);
    }
    setFeedback(null);
  };

  const skipQuestion = () => nextQuestion();
  const closeQuiz = () => { setActiveQuizModule(null); setCurrentQuestion(null); setScore(0); setStreak(0); setFeedback(null); };

  const filteredModules = currentSubject === "All" ? modulesList : modulesList.filter(mod => mod.subject === currentSubject);

  return (
    <div className="container">
      <header className="header">
        <h1 className="app-title">QuizMaster</h1>
        <div className="subject-nav">
          {["All","Math","Science","History","Programming","GK","About"].map(sub => (
            <button key={sub} 
              className={`subject-btn ${currentSubject===sub ? "active" : ""}`}
              onClick={() => {
                if(sub === "About") setShowAbout(true);
                else { setCurrentSubject(sub); setShowAbout(false); setActiveQuizModule(null); }
              }}>
              {sub}
            </button>
          ))}
        </div>
      </header>

      {showAbout ? (
        <div className="quiz-container">
          <h2>About QuizMaster</h2>
          <p>
            Welcome to <strong>QuizMaster</strong>! This app is designed by <strong>Ankit</strong> to make learning fun, interactive, and engaging for everyone. 
          </p>
          <p>Key Features:</p>
          <ul>
            <li>🎯 Infinite generated questions for Math modules like Addition, Algebra, and Geometry.</li>
            <li>🧪 Fun quizzes for Science, History, Programming, and General Knowledge.</li>
            <li>🏆 Track your score, streaks, and progress as you learn.</li>
            <li>🌈 Colorful icons and visually appealing module cards for easy navigation.</li>
            <li>📱 Responsive design for mobile and desktop devices.</li>
            <li>💡 Provides explanations for every answer to help you understand concepts better.</li>
          </ul>
          <p>
            Check out my GitHub for more projects: 
            <br/>
            <a href="https://github.com/theankitsuthar" target="_blank" rel="noopener noreferrer" style={{ color: "#43a047", fontWeight: "700" }}>
              https://github.com/theankitsuthar
            </a>
          </p>
        </div>
      ) : activeQuizModule ? (
        <div className="quiz-container">
          <h2 className="module-title">{moduleIcons[activeQuizModule.title] || ""} {activeQuizModule.title} Quiz</h2>
          <p>Score: {score} | Streak: {streak}</p>
          {currentQuestion && (
            <>
              <p className="module-description">{currentQuestion.question}</p>
              <div className="action-buttons">
                {currentQuestion.options.map(opt => (
                  <button key={opt} className="action-btn quiz-btn" onClick={()=>handleAnswer(opt)}>{opt}</button>
                ))}
              </div>
              {feedback && (
                <p className={`feedback ${feedback.correct ? "correct":"incorrect"}`}>
                  {feedback.correct ? "Correct! ✅" : "Incorrect! ❌"} <br />Explanation: {feedback.explanation}
                </p>
              )}
              <div className="action-buttons">
                <button className="action-btn complete-btn" onClick={nextQuestion}>Next</button>
                <button className="action-btn quiz-btn" onClick={skipQuestion}>Skip</button>
                <button className="action-btn quiz-btn" onClick={closeQuiz}>Exit Quiz</button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="learning-modules">
          {filteredModules.map(mod => (
            <div key={mod.title} className="module-card" style={{borderTopColor: moduleColors[mod.subject]}}>
              <h2 className="module-title">{moduleIcons[mod.title] || ""} {mod.title}</h2>
              <p className="module-description">Subject: {mod.subject}</p>
              <button className="action-btn complete-btn" onClick={()=>startQuiz(mod)}>Take Quiz</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
