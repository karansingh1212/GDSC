import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"

import Home from "./pages/Home";
import Login from "./pages/Login";
import Discuss from "./pages/Discuss";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:groupName" element={<Discuss />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
