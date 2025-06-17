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
import * as modulesClient from "./client";
import * as courseClient from "../client";
import { useSelector, useDispatch } from "react-redux";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const [courseModules, setCourseModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const fetchModulesForCourse = async () => {
    if (!cid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const modules = await courseClient.findModulesForCourse(cid);
      
      if (Array.isArray(modules)) {
        setCourseModules(modules);
        setExpandedModules(modules.map((module: any) => module._id));
      } else {
        setCourseModules([]);
        setError("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
      setCourseModules([]);
      setError(`Failed to fetch modules: ${error}`);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (cid) {
      fetchModulesForCourse();
    }
  }, [cid]);

  // 6.4.2.3 Creating Modules for a Course
  const addModuleHandler = async () => {
    if (!moduleName.trim()) {
      alert("Please enter a module name");
      return;
    }
    
    try {
      const newModule = await courseClient.createModuleForCourse(cid!, {
        name: moduleName,
        course: cid,
      });
      setCourseModules(prev => [...prev, newModule]);
      setModuleName("");
    } catch (error) {
      console.error("Error creating module:", error);
      alert("Failed to create module");
    }
  };

  // 6.4.2.4 Deleting Modules
  const deleteModuleHandler = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module?")) {
      return;
    }
    
    try {
      await modulesClient.deleteModule(moduleId);
      setCourseModules(prev => prev.filter(module => module._id !== moduleId));
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module");
    }
  };

  // 6.4.2.5 Updating Modules
  const updateModuleHandler = async (module: any) => {
    try {
      console.log("Updating module:", module);
      await modulesClient.updateModule(module);
      setCourseModules(prev => 
        prev.map(m => m._id === module._id ? { ...m, ...module } : m)
      );
    } catch (error) {
      console.error("Error updating module:", error);
      alert("Failed to update module");
    }
  };

  // Handle module name change without immediate API call
  const handleModuleNameChange = (moduleId: string, newName: string) => {
    setCourseModules(prev => 
      prev.map(m => m._id === moduleId ? { ...m, name: newName } : m)
    );
  };

  // Save module changes (called on Enter or blur)
  const saveModuleChanges = async (module: any) => {
    const updatedModule = { ...module, editing: false };
    await updateModuleHandler(updatedModule);
  };

  const toggleModule = (moduleId: string) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter(id => id !== moduleId));
    } else {
      setExpandedModules([...expandedModules, moduleId]);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wd-modules">
      <ModulesControls 
        addModule={addModuleHandler}
        moduleName={moduleName} 
        setModuleName={setModuleName}
      />
      <br />

      {error && (
        <div className="alert alert-danger">
          Error: {error}
          <button onClick={fetchModulesForCourse} className="btn btn-sm btn-outline-danger ms-2">
            Retry
          </button>
        </div>
      )}

      {courseModules.length === 0 && !error ? (
        <div className="text-center p-4">
          <p className="text-muted">No modules found for this course.</p>
          <button onClick={fetchModulesForCourse} className="btn btn-primary">
            Refresh Modules
          </button>
        </div>
      ) : (
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
                  <input 
                    className="form-control w-50"
                    onChange={(e) => handleModuleNameChange(module._id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveModuleChanges(module);
                      }
                      if (e.key === "Escape") {
                        // Cancel editing without saving
                        setCourseModules(prev => 
                          prev.map(m => m._id === module._id ? { ...m, editing: false } : m)
                        );
                        fetchModulesForCourse(); // Restore original name
                      }
                    }}
                    onBlur={() => saveModuleChanges(module)}
                    value={module.name}
                    autoFocus
                  />
                )}
                
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => deleteModuleHandler(moduleId)}
                  editModule={(moduleId) => {
                    setCourseModules(prev => 
                      prev.map(m => m._id === moduleId ? { ...m, editing: true } : m)
                    );
                  }}
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
      )}
    </div>
  );
}