import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { Table } from "react-bootstrap";
import * as client from "./client";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
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
                  <span>{user.firstName} {user.lastName}</span>
                </div>
              </td>
              <td>{user.loginId}</td>
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
