import { ListGroup, FormControl } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import { BsGripVertical } from "react-icons/bs";
import { FaChevronDown, FaChevronRight, FaFile } from "react-icons/fa";
import { FaFileLines } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import * as modulesClient from "./client";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  // Get modules for the current course from Redux state
  const courseModules = modules.filter((module: any) => module.course === cid);
  
  const [expandedModules, setExpandedModules] = useState<string[]>(
    courseModules.map((module: any) => module._id)
  );

  const fetchModules = async () => {
    if (cid) {
      try {
        const modules = await modulesClient.fetchModulesForCourse(cid);
        dispatch(setModules(modules));
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    }
  };

  const createModule = async () => {
    if (cid && moduleName) {
      try {
        const newModule = await modulesClient.createModule({
          name: moduleName,
          course: cid,
          lessons: []
        });
        dispatch(addModule(newModule));
        setModuleName("");
      } catch (error) {
        console.error("Error creating module:", error);
      }
    }
  };

  const removeModule = async (moduleId: string) => {
    try {
      await modulesClient.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  useEffect(() => {
    setExpandedModules(courseModules.map((module: any) => module._id));
  }, [courseModules]);

  const toggleModule = (moduleId: string) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter(id => id !== moduleId));
    } else {
      setExpandedModules([...expandedModules, moduleId]);
    }
  };

  return (
    <div className="wd-modules">
      <ModulesControls 
        moduleName={moduleName} 
        setModuleName={setModuleName}
        addModule={createModule}
      />
      <ListGroup id="wd-modules" className="rounded-0">
        {courseModules.map((module: any) => (
          <div key={module._id} className="mb-3">
            {/* Module Header */}
            <ListGroup.Item className="d-flex align-items-center p-3 ps-2 bg-secondary">
              <div className="me-2">
                {expandedModules.includes(module._id) ? (
                  <FaChevronDown 
                    className="text-secondary" 
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleModule(module._id)}
                  />
                ) : (
                  <FaChevronRight 
                    className="text-secondary" 
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleModule(module._id)}
                  />
                )}
              </div>
              <BsGripVertical className="me-2 fs-3" />
              
              {!module.editing && (
                <div className="flex-grow-1 text-white">{module.name}</div>
              )}
              
              {module.editing && (
                <FormControl 
                  className="w-50 d-inline-block"
                  onChange={(e) =>
                    dispatch(
                      updateModule({ ...module, name: e.target.value })
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      dispatch(updateModule({ ...module, editing: false }));
                    }
                  }}
                  defaultValue={module.name}
                />
              )}
              
              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={removeModule}
                editModule={(moduleId) => dispatch(editModule(moduleId))}
              />
            </ListGroup.Item>

            {/* Module Content */}
            {expandedModules.includes(module._id) && (
              <ListGroup className="wd-module-items rounded-0">
                {/* Module Description */}
                {module.description && (
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
                )}
                
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