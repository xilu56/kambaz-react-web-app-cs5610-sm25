import React from 'react';
import Modules from "../Modules";
import CourseStatus from "./Status";
import { Row, Col } from 'react-bootstrap';

export default function Home() {
  return (
    <div id="wd-home">
      <Row>
        {/* Main Content: Modules */}
        <Col lg={9} md={8} sm={12} className="pe-md-4">
          <h2 className="mb-4">Course Content</h2>
          <Modules />
        </Col>
        
        {/* Sidebar: Course Status - Hidden on small screens */}
        <Col lg={3} md={4} className="d-none d-md-block">
          <CourseStatus />
        </Col>
        
        {/* Course Status for mobile - Only visible on small screens */}
        <Col xs={12} className="d-md-none mt-4">
          <CourseStatus />
        </Col>
      </Row>
    </div>
  );
}