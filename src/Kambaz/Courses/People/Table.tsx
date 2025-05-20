import React from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle, FaSearch, FaUserPlus } from "react-icons/fa";
import { Table, Form, InputGroup, Button } from "react-bootstrap";

interface Person {
  id: string;
  name: string;
  role: string;
  email: string;
  lastActivity: string;
}

export default function PeopleTable() {
  const { cid } = useParams();

  // 模拟课程参与者数据
  const people: Person[] = [
    {
      id: "1",
      name: "Dr. John Smith",
      role: "Instructor",
      email: "john.smith@university.edu",
      lastActivity: "Today, 9:42 AM"
    },
    {
      id: "2",
      name: "Maya Rodriguez",
      role: "Teaching Assistant",
      email: "m.rodriguez@university.edu",
      lastActivity: "Yesterday, 4:15 PM"
    },
    {
      id: "3",
      name: "David Chen",
      role: "Teaching Assistant",
      email: "d.chen@university.edu",
      lastActivity: "Today, 10:30 AM"
    },
    {
      id: "4",
      name: "Sophia Williams",
      role: "Student",
      email: "s.williams@university.edu",
      lastActivity: "Today, 11:05 AM"
    },
    {
      id: "5",
      name: "Michael Johnson",
      role: "Student",
      email: "m.johnson@university.edu",
      lastActivity: "Yesterday, 8:20 PM"
    },
    {
      id: "6",
      name: "Emma Davis",
      role: "Student",
      email: "e.davis@university.edu",
      lastActivity: "Today, 8:55 AM"
    },
    {
      id: "7",
      name: "Daniel Kim",
      role: "Student",
      email: "d.kim@university.edu",
      lastActivity: "3 days ago"
    },
    {
      id: "8",
      name: "Olivia Martinez",
      role: "Student",
      email: "o.martinez@university.edu",
      lastActivity: "Today, 12:15 PM"
    }
  ];

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
          />
        </InputGroup>
      </div>

      <Table responsive hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Last Activity</th>
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
              <td>{person.role}</td>
              <td>{person.email}</td>
              <td>{person.lastActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* <pre>{JSON.stringify(enrollments, null, 2)}</pre>
      <pre>{JSON.stringify(users, null, 2)}</pre> */}
    </div>
  );
}