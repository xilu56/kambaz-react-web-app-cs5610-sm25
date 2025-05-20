import { Link, useParams } from "react-router-dom";
import { db } from "../../Database";
import { ListGroup } from "react-bootstrap";
export default function Assignments() {
  const { cid } = useParams();
  const assignments = db.assignments.filter((a: any) => a.course === cid);
  return (
    <div id="wd-assignments">
      <input id="wd-search-assignment" placeholder="Search for Assignments" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>
      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button>
      </h3>
      <ListGroup id="wd-assignment-groups">
        {assignments.map((assignment: any) => (
          <ListGroup.Item
            as={Link}
            to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
            className="wd-assignment-group"
            key={assignment._id}
          >
            <h4 className="wd-assignment-group-title">{assignment.title}</h4>
            <p className="wd-assignment-group-description">
              {assignment.description}
            </p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}