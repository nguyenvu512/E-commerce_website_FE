import "./App.css";
import Navbar from "./components/header-footer/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <h1>Welcome to MyApp!</h1>
      </main>
    </div>
  );
}

export default App;
