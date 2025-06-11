import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import axiosWithCredentials from "../../api/axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";

export default function QueryParameters() {
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");
  const [result, setResult] = useState<string>("");

  const performOperation = async (operation: string) => {
    try {
      const response = await axiosWithCredentials.get(`/lab5/calculator`, {
        params: { operation, a, b }
      });
      setResult(response.data);
    } catch (error) {
      console.error(`Error performing ${operation}:`, error);
      setResult("Error occurred");
    }
  };

  return (
    <div id="wd-query-parameters">
      <h3>Query Parameters</h3>
      <FormControl 
        id="wd-query-parameter-a"
        className="mb-2"
        value={a} 
        type="number"
        onChange={(e) => setA(e.target.value)} 
      />
      <FormControl 
        id="wd-query-parameter-b"
        className="mb-2"
        value={b} 
        type="number"
        onChange={(e) => setB(e.target.value)} 
      />
      <Button 
        className="btn btn-primary me-2" 
        id="wd-query-parameter-add"
        onClick={() => performOperation("add")}
      >
        Add {a} + {b}
      </Button>
      <Button 
        className="btn btn-danger me-2" 
        id="wd-query-parameter-subtract"
        onClick={() => performOperation("subtract")}
      >
        Subtract {a} - {b}
      </Button>
      <Button 
        className="btn btn-success me-2" 
        id="wd-query-parameter-multiply"
        onClick={() => performOperation("multiply")}
      >
        Multiply {a} * {b}
      </Button>
      <Button 
        className="btn btn-warning" 
        id="wd-query-parameter-divide"
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