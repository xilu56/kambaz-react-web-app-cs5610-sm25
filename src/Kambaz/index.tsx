import { Navigate, Route, Routes } from "react-router-dom";
import KambazNavigation from "./Navigation";
import Account from "./Account";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import "./styles.css";
import { useEffect } from "react";

export default function Kambaz() {
  useEffect(() => {
    const handleImageErrors = () => {
      document.addEventListener('error', (event) => {
        const target = event.target as HTMLImageElement;
        if (target.tagName === 'IMG') {
          const imgSrc = target.src;
          const imgName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
          target.src = `/images/${imgName}`;
          target.onerror = () => {
            target.src = '/images/placeholder.jpg';
            target.onerror = null;
          };
        }
      }, true);
    };

    handleImageErrors();
  }, []);

return (
    <div id="wd-kambaz">
      <KambazNavigation />
      <div className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<Navigate to="Account" />} />
          <Route path="/Account/*" element={<Account />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Courses/:cid/*" element={<Courses />} />
          <Route path="/Calendar" element={<h1>Calendar</h1>} />
          <Route path="/Inbox" element={<h1>Inbox</h1>} />
        </Routes>
      </div>
    </div>
);}
