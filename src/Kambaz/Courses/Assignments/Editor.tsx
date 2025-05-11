import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  
  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };
  
  const handleSave = () => {
    // Here you would typically save the form data
    // For now, just navigate back to the assignments list
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };
  
  return (
    <div id="wd-assignment-editor">
      <div className="wd-assignment-name">
        <h2>Assignment Name</h2>
        <input type="text" defaultValue="A1 - ENV + HTML" />
      </div>
      
      <div className="wd-assignment-description">
        <textarea rows={10} cols={50} defaultValue={
          "The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page."
        } />
      </div>
      
      <table className="wd-assignment-details">
        <tbody>
          <tr className="wd-detail-row">
            <td className="wd-detail-label">Points</td>
            <td className="wd-detail-input">
              <input type="text" defaultValue="100" />
            </td>
          </tr>
          
          <tr className="wd-detail-row">
            <td className="wd-detail-label">Assignment Group</td>
            <td className="wd-detail-input">
              <select defaultValue="ASSIGNMENTS">
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECT">PROJECT</option>
              </select>
            </td>
          </tr>
          
          <tr className="wd-detail-row">
            <td className="wd-detail-label">Display Grade as</td>
            <td className="wd-detail-input">
              <select defaultValue="Percentage">
                <option value="Percentage">Percentage</option>
                <option value="Points">Points</option>
                <option value="Letter">Letter</option>
              </select>
            </td>
          </tr>
          
          <tr className="wd-detail-row">
            <td className="wd-detail-label">Submission Type</td>
            <td className="wd-detail-input">
              <select defaultValue="Online">
                <option value="Online">Online</option>
                <option value="Paper">Paper</option>
                <option value="External">External</option>
              </select>
            </td>
          </tr>
          
          <tr className="wd-detail-row">
            <td className="wd-detail-label">Online Entry Options</td>
            <td className="wd-detail-input">
              <div className="wd-options">
                <div className="wd-option">
                  <input type="checkbox" id="text-entry" />
                  <label htmlFor="text-entry">Text Entry</label>
                </div>
                <div className="wd-option">
                  <input type="checkbox" id="website-url" />
                  <label htmlFor="website-url">Website URL</label>
                </div>
                <div className="wd-option">
                  <input type="checkbox" id="media-recordings" />
                  <label htmlFor="media-recordings">Media Recordings</label>
                </div>
                <div className="wd-option">
                  <input type="checkbox" id="student-annotation" />
                  <label htmlFor="student-annotation">Student Annotation</label>
                </div>
                <div className="wd-option">
                  <input type="checkbox" id="file-uploads" />
                  <label htmlFor="file-uploads">File Uploads</label>
                </div>
              </div>
            </td>
          </tr>
          
          <tr className="wd-detail-row">
            <td className="wd-detail-label">Assign</td>
            <td className="wd-detail-input">
              <div className="wd-assign-to">
                <label>Assign to</label>
                <input type="text" defaultValue="Everyone" />
              </div>
            </td>
          </tr>
          
          <tr className="wd-detail-row">
            <td className="wd-detail-label">Due</td>
            <td className="wd-detail-input">
              <input type="date" defaultValue="2024-05-13" />
            </td>
          </tr>
          
          <tr className="wd-detail-row">
            <td className="wd-detail-label">Available from</td>
            <td className="wd-detail-input">
              <input type="date" defaultValue="2024-05-06" />
            </td>
          </tr>
          
          <tr className="wd-detail-row">
            <td className="wd-detail-label">Until</td>
            <td className="wd-detail-input">
              <input type="date" defaultValue="2024-05-20" />
            </td>
          </tr>
        </tbody>
      </table>
      
      <div className="wd-buttons">
        <button 
          className="wd-cancel-btn" 
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          className="wd-save-btn" 
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
  