import Labs from "./Labs";
import Kambaz from "./Kambaz";
import { HashRouter, Route, Routes } from "react-router-dom";
import TOC from "./Labs/TOC";
import store from "./Kambaz/store";
import { Provider } from "react-redux";

export default function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <div>
          <TOC />
          <Routes>
            <Route path="/" element={<div>
              <h1>Web Development Course</h1>
              <p> Welcome to my Kambaz Quiz Project. My name is Xi Lu from CS5610 41980 Web Development SEC 04 Summer 1 2025. PLease navigate to the Kambaz tab to start.</p>
            </div>} />
            <Route path="/Labs/*" element={<Labs />} />
            <Route path="/Kambaz/*" element={<Kambaz />} />
          </Routes>
        </div>
      </Provider>
    </HashRouter>
  );
}
