import EnvironmentVariables from "./EnvironmentVariables";
import PathParameters from "./PathParameters.tsx";
import QueryParameters from "./QueryParameters.tsx";
import WorkingWithObjects from "./WorkingWithObjects.tsx";
import WorkingWithArrays from "./WorkingWithArrays.tsx";
import HttpClient from "./HttpClient.tsx";

export default function Lab5() {
  return (
    <div id="wd-lab5">
      <h2>Lab 5</h2>
      <div className="list-group">
        <a href="http://localhost:4000/lab5/welcome"          
           className="list-group-item">
           Welcome
        </a>
      </div><hr/>
      <EnvironmentVariables />
      <PathParameters />
      <QueryParameters />
      <WorkingWithObjects />
      <WorkingWithArrays />
      <HttpClient />
    </div>
  );
}
