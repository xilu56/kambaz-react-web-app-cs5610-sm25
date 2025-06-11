import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";

export default function PathParameters() {
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");
  const [result, setResult] = useState<string>("");

  const performOperation = async (operation: string) => {
    try {
      const response = await axios.get(`${REMOTE_SERVER}/lab5/${operation}/${a}/${b}`);
      setResult(response.data);
    } catch (error) {
      console.error(`Error performing ${operation}:`, error);
      setResult("Error occurred");
    }
  };

  return (
    <div>
      <h3>Path Parameters</h3>
      <FormControl 
        className="mb-2" 
        id="wd-path-parameter-a" 
        type="number" 
        value={a}
        onChange={(e) => setA(e.target.value)}
      />
      <FormControl 
        className="mb-2" 
        id="wd-path-parameter-b" 
        type="number" 
        value={b}
        onChange={(e) => setB(e.target.value)}
      />
      <Button 
        className="btn btn-primary me-2" 
        id="wd-path-parameter-add"
        onClick={() => performOperation("add")}
      >
        Add {a} + {b}
      </Button>
      <Button 
        className="btn btn-danger me-2" 
        id="wd-path-parameter-subtract"
        onClick={() => performOperation("subtract")}
      >
        Subtract {a} - {b}
      </Button>
      <Button 
        className="btn btn-success me-2" 
        id="wd-path-parameter-multiply"
        onClick={() => performOperation("multiply")}
      >
        Multiply {a} * {b}
      </Button>
      <Button 
        className="btn btn-warning" 
        id="wd-path-parameter-divide"
        onClick={() => performOperation("divide")}
      >
        Divide {a} / {b}
      </Button>
      
      {result && (
        <div className="mt-3">
          <strong>Result: </strong> {result}
        </div>
      )}
      <hr />
    </div>
  );
}
