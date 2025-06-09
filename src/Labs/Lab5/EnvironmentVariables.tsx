const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";

export default function EnvironmentVariables() {
  return (
    <div id="wd-environment-variables">
      <h3>Environment Variables</h3>
      <p>Remote Server: <strong>{REMOTE_SERVER}</strong></p>
      
      {!import.meta.env.VITE_REMOTE_SERVER && (
        <div className="alert alert-warning">
          <small>
            <strong>Note:</strong> VITE_REMOTE_SERVER not set. Using default: {REMOTE_SERVER}
          </small>
        </div>
      )}
      
      <hr/>
    </div>
  );
}
