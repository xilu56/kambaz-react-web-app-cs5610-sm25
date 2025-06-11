import { useState, useEffect } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "./client";

export default function WorkingWithObjectsAsynchronously() {
  const [assignment, setAssignment] = useState<any>({});

  const fetchAssignment = async () => {
    try {
      const data = await client.fetchAssignment();
      setAssignment(data);
    } catch (error) {
      console.error("Error fetching assignment:", error);
    }
  };

  const updateAssignmentData = async () => {
    try {
      const data = await client.updateAssignment(assignment);
      setAssignment(data);
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, []);

  return (
    <div>
      <h3>Working with Objects Asynchronously</h3>
      <h4>Assignment</h4>
      
      <div className="mb-3">
        <label className="form-label">Title:</label>
        <FormControl 
          value={assignment.title || ""}
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          className="mb-2"
        />
        <Button 
          className="btn btn-warning"
          onClick={updateAssignmentData}
        >
          Update Assignment
        </Button>
      </div>

      <pre>
        {JSON.stringify(assignment, null, 2)}
      </pre>
    </div>
  );
}
