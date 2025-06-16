import { useNavigate } from "react-router-dom";
import PeopleDetails from "./Details";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

interface PeopleTableProps {
  users?: any[];
  onUserDeleted?: () => void;
}

export default function PeopleTable({ users = [], onUserDeleted }: PeopleTableProps) {
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    navigate(`${userId}`);
  };

  return (
    <div id="wd-people-table">
      <PeopleDetails onUserDeleted={onUserDeleted} />
      <table className="table table-striped">
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
          {users.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </Link>
              </td>
              <td>{user.loginId || `${user.username}@kambaz.edu`}</td>
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
      </table>
    </div>
  );
}