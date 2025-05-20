import React from 'react';
import Modules from "../Modules";
import CourseStatus from "./Status";
import { Row, Col } from 'react-bootstrap';

export default function Home() {
  return (
    <div id="wd-home">
      <Row>
        {/* First Column: Navigation - Handled in parent component */}
        
        {/* Second Column: Main Content: Modules */}
        <Col xl={6} lg={8} md={12}>
          <h2 className="mb-4">Course Content</h2>
          <Modules />
        </Col>
        
        {/* Third Column: Empty space on very wide screens */}
        <Col xl={3} className="d-none d-xl-block">
          {/* Empty column for spacing */}
        </Col>
        
        {/* Fourth Column: Course Status - Hidden on smaller screens */}
        <Col xl={3} lg={4} className="d-none d-lg-block">
          <CourseStatus />
        </Col>
      </Row>
    </div>
  );
}