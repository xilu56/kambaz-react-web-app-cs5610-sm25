import { FaUserCircle, FaSearch, FaUserPlus } from "react-icons/fa";
import { Table, Form, InputGroup, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState } from "react";
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

  // Get users enrolled in the current course using the updated enrollments data structure
  const enrolledUserIds = db.enrollments
    .filter((enrollment: any) => enrollment.course === cid)
    .map((enrollment: any) => enrollment.user);

  // Convert database users to the Person interface format
  const people: Person[] = db.users
    .filter((user: any) => enrolledUserIds.includes(user._id))
    .map((user: any) => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      loginId: user.loginId,
      section: user.section,
      role: user.role,
      lastActivity: user.lastActivity,
      totalActivity: user.totalActivity
    }))
    .filter((person) => 
      searchTerm === "" || 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.loginId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div id="wd-people-table">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>People</h2>
        <div>
          <Button variant="success" className="d-flex align-items-center">
            <FaUserPlus className="me-2" /> Add People
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <InputGroup style={{ maxWidth: '400px' }}>
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
      </div>

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
          {people.map((person) => (
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
          {people.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No people found for this course
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {/* <pre>{JSON.stringify(enrollments, null, 2)}</pre>
      <pre>{JSON.stringify(users, null, 2)}</pre> */}
    </div>
  );
}