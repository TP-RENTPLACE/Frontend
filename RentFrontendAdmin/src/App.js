import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmailAuth from "./components/EmailAuth";
import ModerationList from "./components/ModerationList";
import AdsList from "./components/AdsList";
import Sidebar from "./components/Sidebar";
import './styles/EmailStyles.css';
import AdDetails from "./components/AdDetails";

function ProtectedRoute({ children }) {
  return localStorage.getItem("isAdmin") === "true" ? children : <Navigate to="/email" />;
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/email" replace />} />
            <Route path="/email" element={<EmailAuth />} />
            <Route path="/admin" element={<ProtectedRoute><Navigate to="/ads" replace /></ProtectedRoute>} />
            <Route path="/ads" element={<ProtectedRoute><AdsList /></ProtectedRoute>} />
            <Route path="/ad/:id" element={<ProtectedRoute><AdDetails /></ProtectedRoute>} />
            <Route path="/moderation" element={<ProtectedRoute><ModerationList /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default App;
