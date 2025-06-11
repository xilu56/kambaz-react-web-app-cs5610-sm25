import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import axiosWithCredentials from "../../api/axios";
import * as client from "./client";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });

  const [module, setModule] = useState({
    id: "CS5610",
    name: "Web Development",
    description: "Learn full-stack web development",
    course: "CS5610"
  });

  const getAssignment = async () => {
    try {
      const data = await client.fetchAssignment();
      setAssignment(data);
    } catch (error) {
      console.error("Error fetching assignment:", error);
    }
  };

  const updateAssignment = async () => {
    try {
      const data = await client.updateAssignment(assignment);
      setAssignment(data);
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      
      {/* Assignment Object Section */}
      <h4>Assignment Object</h4>
      <div className="mb-3">
        <Button 
          className="btn btn-primary me-2"
          onClick={getAssignment}
        >
          Get Assignment
        </Button>
      </div>

      <div className="mb-3">
        <label className="form-label">Assignment Title:</label>
        <FormControl 
          className="mb-2"
          value={assignment.title}
          onChange={(e) => setAssignment({...assignment, title: e.target.value})}
        />
        <Button 
          className="btn btn-warning me-2"
          onClick={updateAssignment}
        >
          Update Assignment
        </Button>
      </div>

      <div className="mb-3">
        <label className="form-label">Assignment Score:</label>
        <FormControl 
          className="mb-2"
          type="number"
          value={assignment.score}
          onChange={(e) => setAssignment({...assignment, score: parseInt(e.target.value) || 0})}
        />
        <a href={`${REMOTE_SERVER}/lab5/assignment/score/${assignment.score}`} 
           className="btn btn-info me-2" target="_blank" rel="noopener noreferrer">
          Update Score
        </a>
      </div>

      <div className="mb-3">
        <div className="form-check">
          <input 
            className="form-check-input"
            type="checkbox"
            checked={assignment.completed}
            onChange={(e) => setAssignment({...assignment, completed: e.target.checked})}
          />
          <label className="form-check-label">Assignment Completed</label>
        </div>
        <a href={`${REMOTE_SERVER}/lab5/assignment/completed/${assignment.completed}`} 
           className="btn btn-success me-2" target="_blank" rel="noopener noreferrer">
          Update Completed
        </a>
      </div>

      {/* Module Object Section */}
      <h4>Module Object</h4>
      <div className="mb-3">
        <a href={`${REMOTE_SERVER}/lab5/module`} 
           className="btn btn-primary me-2" target="_blank" rel="noopener noreferrer">
          Get Module
        </a>
        <a href={`${REMOTE_SERVER}/lab5/module/name`} 
           className="btn btn-secondary me-2" target="_blank" rel="noopener noreferrer">
          Get Module Name
        </a>
      </div>

      <div className="mb-3">
        <label className="form-label">Module Name:</label>
        <FormControl 
          className="mb-2"
          value={module.name}
          onChange={(e) => setModule({...module, name: e.target.value})}
        />
        <a href={`${REMOTE_SERVER}/lab5/module/name/${module.name}`} 
           className="btn btn-warning me-2" target="_blank" rel="noopener noreferrer">
          Update Module Name
        </a>
      </div>

      <div className="mb-3">
        <label className="form-label">Module Description:</label>
        <FormControl 
          className="mb-2"
          as="textarea"
          rows={3}
          value={module.description}
          onChange={(e) => setModule({...module, description: e.target.value})}
        />
        <a href={`${REMOTE_SERVER}/lab5/module/description/${module.description}`} 
           className="btn btn-info" target="_blank" rel="noopener noreferrer">
          Update Module Description
        </a>
      </div>
      
      <hr />
    </div>
  );
}
