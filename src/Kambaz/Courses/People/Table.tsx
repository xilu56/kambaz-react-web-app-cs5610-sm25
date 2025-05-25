import { FaUserCircle, FaSearch, FaUserPlus } from "react-icons/fa";
import { Table, Form, InputGroup, Button } from "react-bootstrap";

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
  // courseId will be used in future API calls
  // const { cid } = useParams();

  // Sample course participants data
  const people: Person[] = [
    {
      id: "1",
      name: "Tony Stark",
      loginId: "001234561S",
      section: "S101",
      role: "STUDENT",
      lastActivity: "2020-10-01T00:00:00.000Z",
      totalActivity: "10:21:32"
    },
    {
      id: "2",
      name: "Bruce Wayne",
      loginId: "001234562S",
      section: "S101",
      role: "STUDENT",
      lastActivity: "2020-11-02T00:00:00.000Z",
      totalActivity: "15:32:43"
    },
    {
      id: "3",
      name: "Steve Rogers",
      loginId: "001234563S",
      section: "S101",
      role: "STUDENT",
      lastActivity: "2020-10-02T00:00:00.000Z",
      totalActivity: "23:32:43"
    },
    {
      id: "4",
      name: "Natasha Romanoff",
      loginId: "001234564S",
      section: "S101",
      role: "TA",
      lastActivity: "2020-11-05T00:00:00.000Z",
      totalActivity: "13:23:34"
    },
    {
      id: "5",
      name: "Thor Odinson",
      loginId: "001234565S",
      section: "S101",
      role: "STUDENT",
      lastActivity: "2020-12-01T00:00:00.000Z",
      totalActivity: "11:22:33"
    },
    {
      id: "6",
      name: "Bruce Banner",
      loginId: "001234566S",
      section: "S101",
      role: "STUDENT",
      lastActivity: "2020-12-01T00:00:00.000Z",
      totalActivity: "22:33:44"
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
        </tbody>
      </Table>
      {/* <pre>{JSON.stringify(enrollments, null, 2)}</pre>
      <pre>{JSON.stringify(users, null, 2)}</pre> */}
    </div>
  );
}