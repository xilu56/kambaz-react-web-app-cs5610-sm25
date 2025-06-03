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
              <p>Welcome to the Web Development course. Please use the navigation above to explore Labs and Kambaz.</p>
            </div>} />
            <Route path="/Labs/*" element={<Labs />} />
            <Route path="/Kambaz/*" element={<Kambaz />} />
          </Routes>
        </div>
      </Provider>
    </HashRouter>
  );
}
