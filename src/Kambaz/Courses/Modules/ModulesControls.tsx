import { FaPlus } from "react-icons/fa6";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { Button, Dropdown } from "react-bootstrap";
import { useState } from "react";
import GreenCheckmark from "./GreenCheckmark";
import ModuleEditor from "./ModuleEditor";

export default function ModulesControls(
  { moduleName, setModuleName, addModule }:
  { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }
) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div id="wd-modules-controls" className="text-nowrap d-flex justify-content-between mb-3">
      <div className="d-flex">
        <Button 
          id="wd-collapse-all-btn" 
          variant="secondary" 
          size="lg" 
          className="me-2">
          Collapse All
        </Button>
        
        <Button 
          id="wd-view-progress-btn" 
          variant="secondary" 
          size="lg" 
          className="me-2">
          View Progress
        </Button>
      </div>
      
      <div className="d-flex">
        <Dropdown className="me-2">
          <Dropdown.Toggle 
            id="wd-publish-all-btn"
            variant="secondary" 
            size="lg">
            <GreenCheckmark />
            Publish All
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              <GreenCheckmark />
              Publish all modules and items
            </Dropdown.Item>
            <Dropdown.Item>
              <GreenCheckmark />
              Publish modules only
            </Dropdown.Item>
            <Dropdown.Item>
              <MdDoNotDisturbAlt className="me-2" />
              Unpublish all modules and items
            </Dropdown.Item>
            <Dropdown.Item>
              <MdDoNotDisturbAlt className="me-2" />
              Unpublish modules only
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
        <Button 
          id="wd-add-module-btn"
          variant="danger" 
          onClick={handleShow} 
          size="lg">
          <FaPlus className="me-2" />
          Module
        </Button>
        
        <ModuleEditor 
          show={show} 
          handleClose={handleClose} 
          dialogTitle="Add Module"
          moduleName={moduleName} 
          setModuleName={setModuleName} 
          addModule={addModule} 
        />
      </div>
    </div>
  );
}
