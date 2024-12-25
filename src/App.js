import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter } from "react-router-dom";
import Routerr from "./router/Routerr";

function App() {
  return (
    <BrowserRouter>
      <Routerr></Routerr>
    </BrowserRouter>
  );
}

export default App;
