import React from 'react';
import { useParams } from 'react-router-dom';
import CourseNavigation from '../Navigation';
import Modules from '../Modules';
import CourseStatus from './Status';

export default function Home() {
  const { cid } = useParams();

  return (
    <div id="wd-course-home">
      <table width="100%">
        <tbody>
          <tr>
            {/* Column 1: Course Navigation */}
            <td valign="top" className="wd-column wd-course-nav-column">
              <CourseNavigation />
            </td>
            
            {/* Column 2: Modules Content */}
            <td valign="top" className="wd-column wd-modules-column">
              <Modules />
            </td>
            
            {/* Column 3: Course Status */}
            <td valign="top" className="wd-column wd-status-column">
              <CourseStatus />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
