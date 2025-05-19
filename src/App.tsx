import Labs from "./Labs";
import Kambaz from "./Kambaz";
import { HashRouter, Route, Routes } from "react-router-dom";
import TOC from "./Labs/TOC";

export default function App() {
  return (
    <HashRouter>
      <div>
        <TOC />
        <Routes>
          <Route path="/" element={<div>
            <h1>Web Development Course</h1>
            <p>Welcome to the Web Development course. Please use the navigation above to explore Labs and Kambaz.</p>
          </div>} />
          <Route path="/Labs/*" element={<Labs />} />
          <Route path="/Kambaz/*" element={<Kambaz />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
