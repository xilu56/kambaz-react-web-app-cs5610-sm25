import React from 'react';

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <div className="wd-assignments-header">
        <input 
          placeholder="Search for Assignments"
          className="wd-search-assignment" 
        />
        <button className="wd-button wd-add-group-btn">+ Group</button>
        <button className="wd-button wd-add-assignment-btn">+ Assignment</button>
      </div>
      
      <h3 className="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button className="wd-add-btn">+</button>
      </h3>
      
      <ul className="wd-assignment-list">
        <li className="wd-assignment-item">
          <h4>
            <a href="#/Kambaz/Courses/5001/Assignments/a1" className="wd-assignment-link">
              A1 - ENV + HTML
            </a>
          </h4>
          <div className="wd-assignment-details">
            <div className="wd-assignment-modules">Multiple Modules | Not available until May 6 at 12:00am |</div>
            <div className="wd-assignment-due">Due May 13 at 11:59pm | 100 pts</div>
          </div>
        </li>
        
        <li className="wd-assignment-item">
          <h4>
            <a href="#/Kambaz/Courses/5001/Assignments/a2" className="wd-assignment-link">
              A2 - CSS + BOOTSTRAP
            </a>
          </h4>
          <div className="wd-assignment-details">
            <div className="wd-assignment-modules">Multiple Modules | Not available until May 13 at 12:00am |</div>
            <div className="wd-assignment-due">Due May 20 at 11:59pm | 100 pts</div>
          </div>
        </li>
        
        <li className="wd-assignment-item">
          <h4>
            <a href="#/Kambaz/Courses/5001/Assignments/a3" className="wd-assignment-link">
              A3 - JAVASCRIPT + REACT
            </a>
          </h4>
          <div className="wd-assignment-details">
            <div className="wd-assignment-modules">Multiple Modules | Not available until May 20 at 12:00am |</div>
            <div className="wd-assignment-due">Due May 27 at 11:59pm | 100 pts</div>
          </div>
        </li>
      </ul>
    </div>
  );
}
  