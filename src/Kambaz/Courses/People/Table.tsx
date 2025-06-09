import { FaUserCircle, FaSearch, FaUserPlus, FaFilter } from "react-icons/fa";
import { Table, Form, InputGroup, Button, Dropdown } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../../Database";

interface Person {
  id: string;
  name: string;
  loginId: string;
  section: string;
  role: string;
  lastActivity: string;
  totalActivity: string;
}

export default function PeopleTable() {
  const { cid } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    console.log("PeopleTable mounting with course ID:", cid);
    console.log("Available enrollments:", db.enrollments);
    
    if (!cid) {
      console.error("No course ID provided");
      setLoading(false);
      return;
    }

    try {
      // Force re-render by wrapping in setTimeout
      // This ensures the component re-renders with the updated data
      setTimeout(() => {
        // Get users enrolled in the current course
        const matchingEnrollments = db.enrollments.filter(
          (enrollment: any) => enrollment.course === cid
        );
        
        console.log("Matching enrollments:", matchingEnrollments);
        
        const enrolledUserIds = matchingEnrollments.map(
          (enrollment: any) => enrollment.user
        );
  
        // Collect debug information
        const debug = {
          currentCourseId: cid,
          availableCourseIds: [...new Set(db.enrollments.map((e: any) => e.course))],
          matchingEnrollments: matchingEnrollments,
          enrolledUserIds: enrolledUserIds,
          allCourses: db.courses.map((c: any) => ({ id: c._id, name: c.name }))
        };
        setDebugInfo(debug);
  
        // Find all enrolled users and format them for display
        const matchingUsers = db.users.filter((user: any) => 
          enrolledUserIds.includes(user._id)
        );
        
        console.log("Matching users:", matchingUsers);
  
        const enrolledPeople: Person[] = matchingUsers.map((user: any) => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          loginId: user.loginId,
          section: user.section,
          role: user.role,
          lastActivity: user.lastActivity,
          totalActivity: user.totalActivity
        }));
  
        setPeople(enrolledPeople);
        setLoading(false);
      }, 0);
    } catch (error) {
      console.error("Error loading people:", error);
      setLoading(false);
    }
  }, [cid]);

  // Clear people when course ID changes to prevent stale data
  useEffect(() => {
    setPeople([]);
    setLoading(true);
  }, [cid]);

  // Filter people based on search term
  const filteredPeople = people.filter((person) => 
    searchTerm === "" || 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.loginId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="wd-people-table">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>People for Course: {cid}</h2>
        <div>
          <Button variant="success" className="d-flex align-items-center">
            <FaUserPlus className="me-2" /> Add People
          </Button>
        </div>
      </div>

      <div className="d-flex mb-4 align-items-center">
        <InputGroup style={{ maxWidth: '400px' }} className="me-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search for people"
            aria-label="Search for people"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" id="role-filter" className="d-flex align-items-center">
            <FaFilter className="me-2" /> Filter
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>All Roles</Dropdown.Item>
            <Dropdown.Item>Students</Dropdown.Item>
            <Dropdown.Item>Teachers</Dropdown.Item>
            <Dropdown.Item>TAs</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div className="mb-3">
            <span className="text-muted">{filteredPeople.length} people enrolled in this course</span>
          </div>

          {debugInfo && filteredPeople.length === 0 && (
            <div className="alert alert-info mb-3">
              <p><strong>Debug Info:</strong></p>
              <p>Current Course ID: {debugInfo.currentCourseId}</p>
              <p>Available Course IDs in enrollments: {debugInfo.availableCourseIds.join(', ')}</p>
              <p>Matching enrollments found: {debugInfo.matchingEnrollments.length}</p>
              <p>Enrolled user IDs: {debugInfo.enrolledUserIds.join(', ')}</p>
              <p>All courses: {JSON.stringify(debugInfo.allCourses)}</p>
            </div>
          )}

          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Login ID</th>
                <th>Section</th>
                <th>Role</th>
                <th>Last Activity</th>
                <th>Total Activity</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeople.map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <FaUserCircle className="me-2 fs-4 text-secondary" />
                      {person.name}
                    </div>
                  </td>
                  <td>{person.loginId}</td>
                  <td>{person.section}</td>
                  <td>{person.role}</td>
                  <td>{person.lastActivity}</td>
                  <td>{person.totalActivity}</td>
                </tr>
              ))}
              {filteredPeople.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    {searchTerm 
                      ? "No people match your search criteria" 
                      : "No people enrolled in this course"}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}