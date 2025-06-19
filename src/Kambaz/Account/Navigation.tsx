import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { pathname } = useLocation();
 const active = (path: string) => (pathname.includes(path) ? "active" : "");
  return (
    <div id="wd-account-navigation">
      <Link to={`/Kambaz/Account/Signin`}  > Signin  </Link> <br/>
      <Link to={`/Kambaz/Account/Signup`}  > Signup  </Link> <br/>
      <Link to={`/Kambaz/Account/Profile`} > Profile </Link> <br/>
      <Link to={`/Kambaz/Dashboard`}      > Dashboard </Link> <br/>
      {currentUser && currentUser.role === "FACULTY" && (
       <Link to={`/Kambaz/Account/Users`} > Users </Link> )} <br/>
    </div>
  );
}