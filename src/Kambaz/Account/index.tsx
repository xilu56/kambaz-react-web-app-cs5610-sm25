import { Navigate, Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import Signin from "./Signin";
import Signup from "./Signup";

export default function Account() {
  return (
    <div className="mt-4">
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/Kambaz/Account/Signin" />}
        />
        <Route path="Signin" element={<Signin />} />
        <Route path="Signup" element={<Signup />} />
        <Route path="Profile" element={<Profile />} />
      </Routes>
    </div>
  );
}