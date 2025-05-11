import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Modules() {
  const {} = useParams();
  
  // State for toggling view options
  const [showModules, setShowModules] = useState(true);
  const [showLessons, setShowLessons] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>(["week1", "week2", "week3", "week4"]);
  
  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter(id => id !== moduleId));
    } else {
      setExpandedModules([...expandedModules, moduleId]);
    }
  };
  
  // Toggle all modules
  const toggleAllModules = () => {
    if (expandedModules.length > 0) {
      setExpandedModules([]);
    } else {
      setExpandedModules(["week1", "week2", "week3", "week4"]);
    }
  };

  return (
    <div>
      {/* Header with action buttons */}
      <div className="wd-header">
        <h2>Modules - Course Content</h2>
        <div className="wd-controls">
          <button 
            className={`wd-button ${showModules ? 'active' : ''}`}
            onClick={() => setShowModules(!showModules)}
          >
            {showModules ? "Hide Modules" : "Show Modules"}
          </button>
          <button 
            className="wd-button"
            onClick={toggleAllModules}
          >
            {expandedModules.length > 0 ? "Collapse All" : "Expand All"}
          </button>
          <button 
            className={`wd-button ${showLessons ? 'active' : ''}`}
            onClick={() => setShowLessons(!showLessons)}
          >
            {showLessons ? "Hide Lessons" : "Show Lessons"}
          </button>
          <button className="wd-button">View Progress</button>
          <button className="wd-button">View Labs</button>
          <button className="wd-button">View Quizzes</button>
          <button className="wd-button">View Assignments</button>
        </div>
      </div>

      {/* Course description */}
      <div className="wd-description">
        <h3>Course Description</h3>
        <p>This course covers the basics of web development, including HTML, CSS, and JavaScript.</p>
        <p>Students will learn how to create responsive web pages and understand the fundamentals of web design.</p>
        <p>By the end of the course, students will be able to build a simple web application.</p>
      </div>

      {/* Course modules */}
      {showModules && (
        <ul id="wd-modules">
          {/* Week 1 */}
          <li className="wd-module">
            <div 
              className={`wd-title ${expandedModules.includes("week1") ? "expanded" : "collapsed"}`}
              onClick={() => toggleModule("week1")}
            >
              Week 1
              <span className="module-toggle">{expandedModules.includes("week1") ? "▼" : "►"}</span>
            </div>
            {expandedModules.includes("week1") && showLessons && (
              <ul className="wd-lessons">
                <li className="wd-lesson">
                  <span className="wd-title">LEARNING OBJECTIVES</span>
                  <ul className="wd-content">
                    <li className="wd-content-item">Introduction to the course</li>
                    <li className="wd-content-item">Learn what is Web Development</li>
                  </ul>
                </li>
              </ul>
            )}
          </li>

          {/* Week 2 */}
          <li className="wd-module">
            <div 
              className={`wd-title ${expandedModules.includes("week2") ? "expanded" : "collapsed"}`}
              onClick={() => toggleModule("week2")}
            >
              Week 2
              <span className="module-toggle">{expandedModules.includes("week2") ? "▼" : "►"}</span>
            </div>
            {expandedModules.includes("week2") && showLessons && (
              <ul className="wd-lessons">
                <li className="wd-lesson">
                  <span className="wd-title">LEARNING OBJECTIVES</span>
                  <ul className="wd-content">
                    <li className="wd-content-item">HTML Basics</li>
                    <li className="wd-content-item">CSS Basics</li>
                  </ul>
                </li>
                <li className="wd-lesson">
                  <span className="wd-title">ASSIGNMENTS</span>
                  <ul className="wd-content">
                    <li className="wd-content-item">Assignment 1: Create a simple webpage</li>
                    <li className="wd-content-item">Assignment 2: Style the webpage with CSS</li>
                  </ul>
                </li>
              </ul>
            )}
          </li>

          {/* Week 3 */}
          <li className="wd-module">
            <div 
              className={`wd-title ${expandedModules.includes("week3") ? "expanded" : "collapsed"}`}
              onClick={() => toggleModule("week3")}
            >
              Week 3
              <span className="module-toggle">{expandedModules.includes("week3") ? "▼" : "►"}</span>
            </div>
            {expandedModules.includes("week3") && showLessons && (
              <ul className="wd-lessons">
                <li className="wd-lesson">
                  <span className="wd-title">LEARNING OBJECTIVES</span>
                  <ul className="wd-content">
                    <li className="wd-content-item">JavaScript Basics</li>
                    <li className="wd-content-item">DOM Manipulation</li>
                  </ul>
                </li>
                <li className="wd-lesson">
                  <span className="wd-title">ASSIGNMENTS</span>
                  <ul className="wd-content">
                    <li className="wd-content-item">Assignment 3: Create a simple JavaScript program</li>
                    <li className="wd-content-item">Assignment 4: Manipulate the DOM with JavaScript</li>
                  </ul>
                </li>
              </ul>
            )}
          </li>

          {/* Week 4 */}
          <li className="wd-module">
            <div 
              className={`wd-title ${expandedModules.includes("week4") ? "expanded" : "collapsed"}`}
              onClick={() => toggleModule("week4")}
            >
              Week 4
              <span className="module-toggle">{expandedModules.includes("week4") ? "▼" : "►"}</span>
            </div>
            {expandedModules.includes("week4") && showLessons && (
              <ul className="wd-lessons">
                <li className="wd-lesson">
                  <span className="wd-title">LEARNING OBJECTIVES</span>
                  <ul className="wd-content">
                    <li className="wd-content-item">Responsive Web Design</li>
                    <li className="wd-content-item">CSS Flexbox and Grid</li>
                  </ul>
                </li>
                <li className="wd-lesson">
                  <span className="wd-title">ASSIGNMENTS</span>
                  <ul className="wd-content">
                    <li className="wd-content-item">Assignment 5: Create a responsive webpage</li>
                    <li className="wd-content-item">Assignment 6: Use CSS Flexbox and Grid</li>
                  </ul>
                </li>
              </ul>
            )}
          </li>
        </ul>
      )}
    </div>
  );
}
