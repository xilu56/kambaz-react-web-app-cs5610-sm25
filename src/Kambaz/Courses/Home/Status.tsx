import React from 'react';

export default function CourseStatus() {
  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>
      
      <div className="wd-status-buttons">
        <button className="wd-button">Unpublish</button>
        <button className="wd-button">Publish</button>
      </div>
      
      <div className="wd-status-options">
        <button className="wd-button">Import Existing Content</button><br/>
        <button className="wd-button">Import from Commons</button><br/>
        <button className="wd-button">Choose Home Page</button><br/>
        <button className="wd-button">View Course Stream</button><br/>
        <button className="wd-button">New Announcement</button><br/>
        <button className="wd-button">New Analytics</button><br/>
        <button className="wd-button">View Course Notifications</button><br/>
      </div>
    </div>
  );
}