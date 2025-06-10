import { FaUserCircle, FaSearch, FaUserPlus, FaFilter } from "react-icons/fa";
import { Table, Form, InputGroup, Button, Dropdown } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as enrollmentsClient from "../../Enrollments/client";

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
  const [error, setError] = useState<string | null>(null);

  const fetchPeopleInCourse = async () => {
    if (!cid) {
      setError("No course ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get enrollments for the current course
      const enrollments = await enrollmentsClient.findEnrollmentsForCourse(cid);
      console.log("Enrollments for course:", enrollments);

      if (enrollments.length === 0) {
        setPeople([]);
        setLoading(false);
        return;
      }

      // Get all users
      const allUsers = await fetch(`${import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000"}/api/users`)
        .then(res => res.json());

      // Filter users who are enrolled in this course
      const enrolledUserIds = enrollments.map((enrollment: any) => enrollment.user);
      const enrolledUsers = allUsers.filter((user: any) => 
        enrolledUserIds.includes(user._id)
      );

      // Format users for display
      const formattedPeople: Person[] = enrolledUsers.map((user: any) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        loginId: user.loginId,
        section: user.section,
        role: user.role,
        lastActivity: user.lastActivity,
        totalActivity: user.totalActivity
      }));

      setPeople(formattedPeople);
    } catch (err) {
      console.error("Error fetching people:", err);
      setError("Failed to load people for this course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeopleInCourse();
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
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="mb-3">
            <span className="text-muted">{filteredPeople.length} people enrolled in this course</span>
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