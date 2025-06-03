import { ListGroup } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import { FaChevronDown, FaChevronRight, FaFile } from "react-icons/fa";
import { FaPlus, FaFileLines } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Database";

export default function Modules() {
  const { cid } = useParams();
  
  // Get modules for the current course from the database
  const courseModules = db.modules.filter((module: any) => module.course === cid);
  
  const [expandedModules, setExpandedModules] = useState<string[]>(
    courseModules.map((module: any) => module._id)
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
        {courseModules.map((module: any) => (
          <div key={module._id} className="mb-3">
            {/* Module Header */}
            <ListGroup.Item 
              className="d-flex align-items-center p-2 bg-light border"
              style={{ cursor: "pointer" }}
              onClick={() => toggleModule(module._id)}
            >
              <div className="me-2">
                {expandedModules.includes(module._id) ? (
                  <FaChevronDown className="text-secondary" />
                ) : (
                  <FaChevronRight className="text-secondary" />
                )}
              </div>
              <BsGripVertical className="me-2 text-secondary" />
              <div className="flex-grow-1">{module.name}</div>
              <div className="d-flex align-items-center">
                <GreenCheckmark />
                <FaPlus className="mx-2 text-secondary" />
                <span className="fs-4 text-secondary">⋮</span>
              </div>
            </ListGroup.Item>

            {/* Module Content */}
            {expandedModules.includes(module._id) && (
              <ListGroup className="wd-module-items rounded-0">
                {/* Module Description */}
                <ListGroup.Item className="d-flex align-items-center py-2 ps-4 border-start border-success">
                  <BsGripVertical className="me-2 text-secondary invisible" />
                  <div className="me-2">
                    <FaFile className="text-secondary me-2" />
                  </div>
                  <div className="flex-grow-1">{module.description}</div>
                  <div className="d-flex align-items-center">
                    <GreenCheckmark />
                    <span className="fs-4 ms-2 text-secondary">⋮</span>
                  </div>
                </ListGroup.Item>
                
                {/* Module Lessons (if any) */}
                {module.lessons && module.lessons.map((lesson: any) => (
                  <ListGroup.Item 
                    key={lesson._id}
                    className="d-flex align-items-center py-2 ps-4 border-start border-success"
                  >
                    <BsGripVertical className="me-2 text-secondary invisible" />
                    <div className="me-2">
                      <FaFileLines className="text-danger me-2" />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold">{lesson.name}</div>
                      <div className="text-muted small">{lesson.description}</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <GreenCheckmark />
                      <span className="fs-4 ms-2 text-secondary">⋮</span>
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