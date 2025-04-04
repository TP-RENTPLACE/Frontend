import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmailAuth from "./components/EmailAuth";
import ModerationList from "./components/ModerationList";
import AdsList from "./components/AdsList";
import Sidebar from "./components/Sidebar";
import './styles/EmailStyles.css';
import AdDetails from "./components/AdDetails";
import UsersList from "./components/UsersList";
import BookingsTable from "./components/BookingsTable";
import AdminEditForm from "./components/AdminEditForm";
import Header from "./components/Header";
import { UserProvider } from "./components/UserContext"; // Импортируем UserProvider

function ProtectedRoute({ children }) {
  return localStorage.getItem("isAdmin") === "true" ? children : <Navigate to="/email" />;
}

function App() {
  return (
    <UserProvider> {/* Оборачиваем все приложение в UserProvider */}
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/email" replace />} />
              <Route path="/email" element={<EmailAuth />} />
              <Route path="/admin" element={<ProtectedRoute><Navigate to="/ads" replace /></ProtectedRoute>} />
              <Route path="/ads" element={<ProtectedRoute><AdsList /></ProtectedRoute>} />
              <Route path="/ad/:id" element={<ProtectedRoute><AdDetails /></ProtectedRoute>} /> {/* Маршрут для AdDetails */}
              <Route path="/moderation" element={<ProtectedRoute><ModerationList /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><BookingsTable /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><AdminEditForm /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
