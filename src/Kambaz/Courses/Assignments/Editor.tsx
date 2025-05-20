import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { BsCalendar } from 'react-icons/bs';
import { db } from "../../Database";
import type { CSSProperties } from 'react';

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  
  // 如果存在aid，则查找对应的assignment
  const assignment = aid && aid !== 'new' ? db.assignments.find((a: any) => a._id === aid) : null;
  
  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };
  
  const handleSave = () => {
    // 这里通常会保存表单数据
    // 目前仅导航回assignments列表
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
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
              defaultValue={assignment?.title || "A1 - ENV + HTML"} 
            />
          </Form.Group>
        </div>
        
        <div style={{...formSectionStyle, ...descriptionStyle}}>
          <Form.Group>
            <Form.Label style={formLabelStyle}>Assignment Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={6} 
              defaultValue={assignment?.description || "The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page."}
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
                <Form.Control type="date" defaultValue="2024-05-13" />
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
                <Form.Control type="date" defaultValue="2024-05-06" />
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
          <Button 
            variant="primary"
            className="me-2"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </Container>
    </div>
  );
}