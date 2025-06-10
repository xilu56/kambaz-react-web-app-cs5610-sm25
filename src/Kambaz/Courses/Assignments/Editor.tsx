import { useParams, useNavigate } from 'react-router-dom';
import { Form, Container, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { BsCalendar } from 'react-icons/bs';
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import * as assignmentsClient from "./client";

// Define the assignment type to match the database structure
interface Assignment {
  _id?: string;
  title: string;
  course: string;
  description?: string;
  points?: number | string;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
  module?: string;
  status?: string;
}

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get assignments from Redux store
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  
  // Find the assignment if editing
  const existingAssignment = aid && aid !== 'new' 
    ? assignments.find((a: any) => a._id === aid) as Assignment | undefined
    : null;

  // Form state
  const [assignment, setAssignment] = useState<Assignment>({
    title: existingAssignment?.title || "New Assignment",
    course: cid || "",
    description: existingAssignment?.description || "",
    points: existingAssignment?.points || 100,
    dueDate: existingAssignment?.dueDate || "",
    availableFrom: existingAssignment?.availableFrom || "",
    availableUntil: existingAssignment?.availableUntil || "",
    module: existingAssignment?.module || "",
    status: existingAssignment?.status || "not-started"
  });

  // Fetch assignment details if editing
  const fetchAssignment = async () => {
    if (aid && aid !== 'new') {
      try {
        const assignment = await assignmentsClient.fetchAssignment(aid);
        setAssignment({
          title: assignment.title,
          course: assignment.course,
          description: assignment.description || "",
          points: assignment.points || 100,
          dueDate: assignment.dueDate || "",
          availableFrom: assignment.availableFrom || "",
          availableUntil: assignment.availableUntil || "",
          module: assignment.module || "",
          status: assignment.status || "not-started"
        });
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [aid]);

  // Update form when existing assignment changes
  useEffect(() => {
    if (existingAssignment) {
      setAssignment({
        title: existingAssignment.title,
        course: existingAssignment.course,
        description: existingAssignment.description || "",
        points: existingAssignment.points || 100,
        dueDate: existingAssignment.dueDate || "",
        availableFrom: existingAssignment.availableFrom || "",
        availableUntil: existingAssignment.availableUntil || "",
        module: existingAssignment.module || "",
        status: existingAssignment.status || "not-started"
      });
    }
  }, [existingAssignment]);

  // Format date for input (convert from "May 13 at 11:59pm" to "2024-05-13")
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const match = dateString.match(/(\w+)\s+(\d+)/);
    if (match) {
      const month = months[match[1]];
      const day = match[2].padStart(2, '0');
      const year = new Date().getFullYear();
      return `${year}-${month}-${day}`;
    }
    
    return '';
  };

  // Format date from input (convert from "2024-05-13" to "May 13 at 11:59pm")
  const formatDateFromInput = (inputDate: string) => {
    if (!inputDate) return '';
    
    const date = new Date(inputDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day} at 11:59pm`;
  };

  const handleSave = async () => {
    try {
      const formattedAssignment = {
        ...assignment,
        dueDate: assignment.dueDate ? formatDateFromInput(assignment.dueDate) : "",
        availableFrom: assignment.availableFrom ? formatDateFromInput(assignment.availableFrom) : "",
        availableUntil: assignment.availableUntil ? formatDateFromInput(assignment.availableUntil) : "",
      };

      if (aid === 'new' || !existingAssignment || !aid) {
        // Create new assignment
        const newAssignment = await assignmentsClient.createAssignment(formattedAssignment);
        dispatch(addAssignment(newAssignment));
      } else {
        // Update existing assignment
        const updatedAssignment = await assignmentsClient.updateAssignment(aid, formattedAssignment);
        dispatch(updateAssignment(updatedAssignment));
      }
      
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  const handleInputChange = (field: keyof Assignment, value: string | number) => {
    setAssignment(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const formSectionStyle: CSSProperties = {
    marginBottom: '1.5rem'
  };
  
  const descriptionStyle: CSSProperties = {
    margin: '1.5rem 0'
  };
  
  const buttonContainerStyle: CSSProperties = {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  };
  
  const formLabelStyle: CSSProperties = {
    fontWeight: 'bold'
  };
  
  return (
    <div style={{ marginBottom: '2rem' }}>
      <Container fluid style={{ maxWidth: '800px' }}>
        <div style={formSectionStyle}>
          <Form.Group>
            <Form.Label style={formLabelStyle}>Assignment Name</Form.Label>
            <Form.Control 
              type="text" 
              value={assignment.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </Form.Group>
        </div>
        
        <div style={{...formSectionStyle, ...descriptionStyle}}>
          <Form.Group>
            <Form.Label style={formLabelStyle}>Assignment Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={6} 
              value={assignment.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </Form.Group>
        </div>
        
        <div style={formSectionStyle}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Points</Form.Label>
            <Col sm={9}>
              <Form.Control 
                type="number" 
                value={assignment.points}
                onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 0)}
              />
            </Col>
          </Form.Group>
          
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Assignment Group</Form.Label>
            <Col sm={9}>
              <Form.Select 
                value={assignment.module}
                onChange={(e) => handleInputChange('module', e.target.value)}
              >
                <option value="">Select Module</option>
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECT">PROJECT</option>
              </Form.Select>
            </Col>
          </Form.Group>
          
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Display Grade as</Form.Label>
            <Col sm={9}>
              <Form.Select defaultValue="Percentage">
                <option value="Percentage">Percentage</option>
                <option value="Points">Points</option>
                <option value="Letter">Letter</option>
              </Form.Select>
            </Col>
          </Form.Group>
          
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Submission Type</Form.Label>
            <Col sm={9}>
              <Form.Select defaultValue="Online">
                <option value="Online">Online</option>
                <option value="Paper">Paper</option>
                <option value="External">External</option>
              </Form.Select>
            </Col>
          </Form.Group>
          
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Online Entry Options</Form.Label>
            <Col sm={9} style={{ marginBottom: '0.5rem' }}>
              <Form.Check 
                type="checkbox" 
                id="text-entry" 
                label="Text Entry" 
              />
              <Form.Check 
                type="checkbox" 
                id="website-url" 
                label="Website URL" 
                defaultChecked
              />
              <Form.Check 
                type="checkbox" 
                id="media-recordings" 
                label="Media Recordings" 
              />
              <Form.Check 
                type="checkbox" 
                id="student-annotation" 
                label="Student Annotation" 
              />
              <Form.Check 
                type="checkbox" 
                id="file-uploads" 
                label="File Uploads" 
              />
            </Col>
          </Form.Group>
          
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Assign</Form.Label>
            <Col sm={9}>
              <Form.Label style={formLabelStyle}>Assign to</Form.Label>
              <Form.Control type="text" defaultValue="Everyone" />
            </Col>
          </Form.Group>
          
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Due</Form.Label>
            <Col sm={9}>
              <InputGroup>
                <Form.Control 
                  type="date" 
                  value={formatDateForInput(assignment.dueDate || "")}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
                <InputGroup.Text style={{ backgroundColor: 'white', borderLeft: 'none' }}>
                  <BsCalendar />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Form.Group>
          
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Available from</Form.Label>
            <Col sm={9}>
              <InputGroup>
                <Form.Control 
                  type="date" 
                  value={formatDateForInput(assignment.availableFrom || "")}
                  onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                />
                <InputGroup.Text style={{ backgroundColor: 'white', borderLeft: 'none' }}>
                  <BsCalendar />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Form.Group>
          
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Until</Form.Label>
            <Col sm={9}>
              <InputGroup>
                <Form.Control 
                  type="date" 
                  value={formatDateForInput(assignment.availableUntil || "")}
                  onChange={(e) => handleInputChange('availableUntil', e.target.value)}
                />
                <InputGroup.Text style={{ backgroundColor: 'white', borderLeft: 'none' }}>
                  <BsCalendar />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Form.Group>
        </div>
        
        <div style={buttonContainerStyle}>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Container>
    </div>
  );
}