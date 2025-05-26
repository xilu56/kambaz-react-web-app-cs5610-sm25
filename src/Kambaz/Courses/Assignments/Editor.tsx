import { useParams } from 'react-router-dom';
import { Form, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { BsCalendar } from 'react-icons/bs';
import { db } from "../../Database";
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

// Define the assignment type to match the database structure
interface Assignment {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number | string;
  dueDate?: string;
  availableFrom?: string;
  module?: string;
  status?: string;
}

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  
  // Find the assignment in the database using the aid from URL params
  const assignment = aid && aid !== 'new' 
    ? db.assignments.find((a: any) => a._id.toLowerCase() === aid.toLowerCase()) as Assignment | undefined
    : null;

  // Format date strings from the assignment data (if they exist) to be used in date inputs
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    // Extract date from format like "May 13 at 11:59pm"
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const match = dateString.match(/(\w+)\s+(\d+)/);
    if (match) {
      const month = months[match[1]];
      const day = match[2].padStart(2, '0');
      // Use current year as a fallback
      const year = new Date().getFullYear();
      return `${year}-${month}-${day}`;
    }
    
    return '';
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
    justifyContent: 'flex-end'
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
              defaultValue={assignment?.title || ""} 
            />
          </Form.Group>
        </div>
        
        <div style={{...formSectionStyle, ...descriptionStyle}}>
          <Form.Group>
            <Form.Label style={formLabelStyle}>Assignment Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={6} 
              defaultValue={assignment?.description || ""}
            />
          </Form.Group>
        </div>
        
        <div style={formSectionStyle}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Points</Form.Label>
            <Col sm={9}>
              <Form.Control type="text" defaultValue={assignment?.points || "100"} />
            </Col>
          </Form.Group>
          
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} style={formLabelStyle}>Assignment Group</Form.Label>
            <Col sm={9}>
              <Form.Select defaultValue="ASSIGNMENTS">
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
                  defaultValue={formatDateForInput(assignment?.dueDate) || "2024-05-13"} 
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
                  defaultValue={formatDateForInput(assignment?.availableFrom) || "2024-05-06"} 
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
                <Form.Control type="date" defaultValue="2024-05-20" />
                <InputGroup.Text style={{ backgroundColor: 'white', borderLeft: 'none' }}>
                  <BsCalendar />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Form.Group>
        </div>
        
        <div style={buttonContainerStyle}>
          <Link 
            to={`/Kambaz/Courses/${cid}/Assignments`}
            className="btn btn-primary me-2"
          >
            Cancel
          </Link>
          <Link 
            to={`/Kambaz/Courses/${cid}/Assignments`}
            className="btn btn-danger"
          >
            Save
          </Link>
        </div>
      </Container>
    </div>
  );
}