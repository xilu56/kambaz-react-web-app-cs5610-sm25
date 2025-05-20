import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaBook, FaCalendar, FaInbox } from "react-icons/fa";
import { GoBeaker } from "react-icons/go";
import { ImMeter } from "react-icons/im";
import { BsPeople } from "react-icons/bs";

export default function KambazNavigation() {
  const { pathname } = useLocation();
  const links = [
    {
      id: "wd-account-link",
      to: "/Kambaz/Account/Signin",
      text: "Account",
      icon: BsPeople,
    },
    {
      id: "wd-dashboard-link",
      to: "/Kambaz/Dashboard",
      text: "Dashboard",
      icon: ImMeter,
    },
    {
      id: "wd-course-link",
      to: "/Kambaz/Courses",
      text: "Courses",
      icon: FaBook,
    },
    {
      id: "wd-calendar-link",
      to: "/Kambaz/Calendar",
      text: "Calendar",
      icon: FaCalendar,
    },
    {
      id: "wd-inbox-link",
      to: "/Kambaz/Inbox",
      text: "Inbox",
      icon: FaInbox,
    },
    { id: "wd-labs-link", to: "/Labs", text: "Labs", icon: GoBeaker },
  ];
  return (
    <ListGroup
      id="wd-kambaz-navigation"
      className="rounded-0 p-0 m-0 border-0 position-fixed bottom-0 top-0 bg-black"
    >
      <ListGroup.Item
        action
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
        target="_blank"
        className="border-0 bg-black text-danger text-center"
      >
      <img src="/images/NEU.png" width="75px" />
      </ListGroup.Item>
      {links.map((link) => (
        <ListGroup.Item
          key={link.id}
          className={`border-0 text-center ${
            pathname.includes(link.text) || 
            (link.text === "Account" && pathname.includes("Account"))
              ? "bg-white text-danger"
              : "text-white bg-black"
          }`}
          as={Link}
          to={link.to}
          id={link.id}
        >
          {link.icon({ className: "fs-1 text-danger" })}
          <br />
          {link.text}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}