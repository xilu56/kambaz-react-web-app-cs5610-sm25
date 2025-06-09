import Lab1 from "./Lab1";
import { Route, Routes } from "react-router";
import Lab2 from "./Lab2";
import Lab3 from "./Lab3";
import Lab4 from "./Lab4";
import Lab5 from "./Lab5";
import store from "./store";
import { Provider } from "react-redux";


export default function Labs() {
  return (
    <Provider store={store}>
      <div className="container-fluid">
        <h1>Labs</h1>
      <Routes>
        <Route path="/" element={<div>
          <h2>Laboratory Assignments</h2>
          <p>Please select a specific lab from the navigation to view its content:</p>
          <ul>
            <li>Lab 1: HTML Basics</li>
            <li>Lab 2: CSS Styling</li>
            <li>Lab 3: JavaScript Fundamentals</li>
            <li>Lab 4: React Components and State Management</li>
            <li>Lab 5: Advanced React Concepts</li>
          </ul>
        </div>} />
        <Route path="Lab1" element={<Lab1 />} />
        <Route path="Lab2/*" element={<Lab2 />} />
        <Route path="Lab3/*" element={<Lab3 />} />
        <Route path="Lab4/*" element={<Lab4 />} />
        <Route path="Lab5/*" element={<Lab5 />} />
      </Routes>
    </div>
    </Provider>
  );
}
