import { Navigate, Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import Signin from "./Signin";
import Signup from "./Signup";
import Users from "./Users";
import AccountNavigation from "./Navigation";

export default function Account() {
  return (
    <div className="d-flex">
      <div className="col-3">
        <AccountNavigation />
      </div>
      <div className="col-9">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/Kambaz/Account/Signin" />}
          />
          <Route path="Signin" element={<Signin />} />
          <Route path="Signup" element={<Signup />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="Users" element={<Users />} />
          <Route path="Users/:uid" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}