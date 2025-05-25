import { ListGroup } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import { FaChevronDown, FaChevronRight, FaFile } from "react-icons/fa";
import { FaPlus, FaFileLines } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { useState } from "react";

// Sample data structure for modules - weekly content including learning objectives, reading materials, slides, and assessments
const moduleData = [
  {
    id: "week1",
    title: "Week 1",
    items: [
      { id: "w1-item1", type: "header", title: "LEARNING OBJECTIVES" },
      { id: "w1-item2", type: "content", title: "Introduction to the course" },
      { id: "w1-item3", type: "content", title: "Learn what is Web Development" },
      { id: "w1-item4", type: "header", title: "READING" },
      { id: "w1-item5", type: "reading", title: "Full Stack Developer - Chapter 1 - Introduction" },
      { id: "w1-item6", type: "reading", title: "Full Stack Developer - Chapter 2 - Creating User Interfaces With HTML" },
      { id: "w1-item7", type: "header", title: "SLIDES" },
      { id: "w1-item8", type: "slide", title: "Introduction to Web Development" },
      { id: "w1-item9", type: "slide", title: "Creating an HTTP server with Node.js" },
      { id: "w1-item10", type: "slide", title: "Creating a React Application" },
      { id: "w1-item11", type: "slide", title: "Commit your source to GitHub.com" },
      { id: "w1-item12", type: "slide", title: "Deploying to Netlify" },
      { id: "w1-item13", type: "slide", title: "Deploying multiple branches in Netlify" },
      { id: "w1-item14", type: "header", title: "EVALUATIONS" }
    ]
  },
  {
    id: "week2",
    title: "Week 2",
    items: [
      { id: "w2-item1", type: "header", title: "LEARNING OBJECTIVES" },
      { id: "w2-item2", type: "content", title: "Learn about React State Management" },
      { id: "w2-item3", type: "content", title: "Understanding Component Lifecycle" },
      { id: "w2-item4", type: "header", title: "READING" },
      { id: "w2-item5", type: "reading", title: "Full Stack Developer - Chapter 3 - JavaScript Basics" },
      { id: "w2-item6", type: "reading", title: "Full Stack Developer - Chapter 4 - React Fundamentals" },
      { id: "w2-item7", type: "header", title: "SLIDES" },
      { id: "w2-item8", type: "slide", title: "React Components and Props" },
      { id: "w2-item9", type: "slide", title: "State and Lifecycle Methods" },
      { id: "w2-item10", type: "slide", title: "Handling Events in React" },
      { id: "w2-item11", type: "header", title: "EVALUATIONS" },
      { id: "w2-item12", type: "assignment", title: "Assignment 1: Create a React App" }
    ]
  }
];

export default function Modules() {
  const [expandedModules, setExpandedModules] = useState<string[]>(
    moduleData.map(module => module.id)
  );

  const toggleModule = (moduleId: string) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter(id => id !== moduleId));
    } else {
      setExpandedModules([...expandedModules, moduleId]);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "slide":
        return <FaFileLines className="text-danger me-2" />;
      case "reading":
        return <FaFile className="text-secondary me-2" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ModulesControls />
      <ListGroup className="rounded-0 wd-modules-list">
        {moduleData.map((module) => (
          <div key={module.id} className="mb-3">
            {/* Module Header */}
            <ListGroup.Item 
              className="d-flex align-items-center p-2 bg-light border"
              style={{ cursor: "pointer" }}
              onClick={() => toggleModule(module.id)}
            >
              <div className="me-2">
                {expandedModules.includes(module.id) ? (
                  <FaChevronDown className="text-secondary" />
                ) : (
                  <FaChevronRight className="text-secondary" />
                )}
              </div>
              <BsGripVertical className="me-2 text-secondary" />
              <div className="flex-grow-1">{module.title}</div>
              <div className="d-flex align-items-center">
                <GreenCheckmark />
                <FaPlus className="mx-2 text-secondary" />
                <span className="fs-4 text-secondary">⋮</span>
              </div>
            </ListGroup.Item>

            {/* Module Items */}
            {expandedModules.includes(module.id) && (
              <ListGroup className="wd-module-items rounded-0">
                {module.items.map((item) => (
                  <ListGroup.Item 
                    key={item.id} 
                    className={`d-flex align-items-center py-2 ps-4 border-start ${item.type === 'header' ? 'fw-bold bg-light' : 'border-success'}`}
                  >
                    <BsGripVertical className="me-2 text-secondary invisible" />
                    <div className="me-2">
                      {getIconForType(item.type)}
                    </div>
                    <div className="flex-grow-1">{item.title}</div>
                    <div className="d-flex align-items-center">
                      {item.type !== 'header' && <GreenCheckmark />}
                      {item.type !== 'header' && <span className="fs-4 ms-2 text-secondary">⋮</span>}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        ))}
      </ListGroup>
    </div>
  );
}