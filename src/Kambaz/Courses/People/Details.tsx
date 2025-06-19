import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle, FaCheck } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { FormControl } from "react-bootstrap";
import * as client from "../../Account/client";

interface PeopleDetailsProps {
  onUserDeleted?: () => void;
}

export default function PeopleDetails({ onUserDeleted }: PeopleDetailsProps = {}) {
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  // Check if current user is admin
  const isFaculty = currentUser && currentUser.role === "FACULTY";
  
  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
    setName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
    setEmail(user.email || '');
    setRole(user.role || 'STUDENT');
  };
  
  const saveUser = async () => {
    const [firstName, lastName] = name.split(" ");
    const updatedUser = { 
      ...user, 
      firstName: firstName || '', 
      lastName: lastName || '',
      email,
      // Only update role if user is faculty
      ...(isFaculty && { role })
    };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    navigate(-1);
  };
  
  const deleteUser = async (uid: string) => {
    try {
      await client.deleteUser(uid);
      // Call the callback to update the parent component's user list
      if (onUserDeleted) {
        onUserDeleted();
      }
      navigate(-1);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  
  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);
  
  if (!uid) return null;
  
  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button onClick={() => navigate(-1)} className="btn position-fixed end-0 top-0 wd-close-details">
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      
      <div className="text-danger fs-4">
        {!editing && (
          <FaPencil onClick={() => setEditing(true)}
              className="float-end fs-5 mt-2 wd-edit" /> )}
        {editing && (
          <FaCheck onClick={() => saveUser()}
              className="float-end fs-5 mt-2 me-2 wd-save" /> )}
        {!editing && (
          <div className="wd-name"
               onClick={() => setEditing(true)}>
            {user.firstName} {user.lastName}</div>)}
        {user && editing && (
          <FormControl className="w-50 wd-edit-name"
            defaultValue={`${user.firstName || ''} ${user.lastName || ''}`.trim()}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { saveUser(); }}}/>)}
      </div>
      
      <div className="mt-3">
        <b>Email:</b> 
        {!editing && <span className="wd-email ms-2">{user.email}</span>}
        {editing && (
          <FormControl 
            type="email"
            className="mt-1 wd-edit-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { saveUser(); }}}
          />
        )}
      </div>
      
      <div className="mt-2">
        <b>Roles:</b> 
        {!editing && <span className="wd-roles ms-2">{user.role}</span>}
        {editing && isFaculty && (
          <select 
            className="form-select mt-1 wd-edit-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
          </select>
        )}
        {editing && !isFaculty && (
          <span className="wd-roles ms-2 text-muted">{user.role} (Read-only)</span>
        )}
      </div>
      
      <div className="mt-2">
        <b>Login ID:</b> <span className="wd-login-id ms-2">{user.loginId}</span>
      </div>
      <div className="mt-2">
        <b>Section:</b> <span className="wd-section ms-2">{user.section}</span>
      </div>
      <div className="mt-2">
        <b>Total Activity:</b> <span className="wd-total-activity ms-2">{user.totalActivity}</span>
      </div>
      
      <hr />
      {isFaculty && (
        <button 
          onClick={() => deleteUser(uid)} 
          className="btn btn-danger float-end wd-delete"
        >
          Delete
        </button>
      )}
      <button 
        onClick={() => navigate(-1)}
        className="btn btn-secondary float-start me-2 wd-cancel"
      >
        Cancel
      </button>
    </div>
  );
}