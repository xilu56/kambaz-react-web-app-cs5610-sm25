import { ListGroup } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import { useParams } from "react-router-dom";
import { db } from "../../Database";

export default function Modules() {
  const { cid } = useParams();
  const modules = db.modules.filter((m: any) => m.course === cid);
  return (
    <div>
      <ModulesControls />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* Implement Collapse All button, View Progress button, etc. */}
      <ListGroup className="rounded-0">
        {modules.map((module) => (
          <ListGroup.Item
            className="wd-module
                    p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">{module.name}</div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson) => (
                  <ListGroup.Item className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" />
                    {lesson.name}
                    <LessonControlButtons />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}