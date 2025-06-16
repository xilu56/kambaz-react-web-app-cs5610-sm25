import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { Table } from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";
import * as client from "./client";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      const users = await client.findUsersByRole(role);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };
  const [name, setName] = useState("");
  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await client.findAllUsers();
      setUsers(users);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Only show this page to ADMIN users
  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="alert alert-danger">
        <h3>Access Denied</h3>
        <p>You must be an administrator to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <h3>Users</h3>
        <div>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3>Users</h3>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div id="wd-users">
      <h1>Users</h1>
      <select value={role} onChange={(e) =>filterUsersByRole(e.target.value)}
              className="form-select float-start w-25 wd-select-role" >
        <option value="">All Roles</option>    <option value="STUDENT">Students</option>
        <option value="TA">Assistants</option> <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Administrators</option>
      </select>
      <FormControl onChange={(e) => filterUsersByName(e.target.value)} placeholder="Search people"
             className="float-start w-25 me-2 wd-filter-by-name" />
             
      <Table striped hover responsive className="mt-4">
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
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <div className="d-flex align-items-center">
                  <FaUserCircle className="me-3 fs-1 text-secondary" />
                  <span>
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.firstName || user.lastName 
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                        : user.username
                    }
                  </span>
                </div>
              </td>
              <td>
                {user.loginId || `${user.username}@kambaz.edu`}
              </td>
              <td>{user.section || 'S101'}</td>
              <td>
                <span className={`badge ${
                  user.role === 'ADMIN' ? 'bg-danger' : 
                  user.role === 'FACULTY' ? 'bg-primary' : 
                  user.role === 'TA' ? 'bg-warning' : 'bg-success'
                }`}>
                  {user.role || 'STUDENT'}
                </span>
              </td>
              <td>{user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : '2020-10-01'}</td>
              <td>{user.totalActivity || '10:21:32'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {users.length === 0 && (
        <div className="text-center py-4">
          <p>No users found.</p>
        </div>
      )}
    </div>
  );
}
