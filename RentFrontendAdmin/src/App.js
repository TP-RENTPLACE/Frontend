import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmailAuth from "./components/Authentificator/EmailAuth";
import ModerationList from "./components/ModerationListComponents/ModerationList";
import AdsList from "./components/AdsListComponents/AdsList";
import Sidebar from "./components/SideBar/Sidebar";
import './styles/EmailStyles.css';
import AdDetails from "./components/ModerationListComponents/AdDetails";
import UsersList from "./components/UserListComponents/UsersList";
import BookingsTable from "./components/BookingListComponents/BookingsTable";
import AdminEditForm from "./components/AdminEditor/AdminEditForm";
import AddAdForm from "./components/AdsListComponents/AddAdForm";
import AddAdPage from "./components/AdsListComponents/AddAdPage";
import EditAdFormWrapper from "./components/AdsListComponents/EditAdFormWrapper";
import Header from "./components/HeaderComponents/Header";
import { UserProvider } from "./components/UserListComponents/UserContext"; // Импортируем UserProvider
import AddUserFormWrapper from "./components/UserListComponents/AddUserFormWrapper";
import EditUserFormWrapper from "./components/UserListComponents/EditUserFormWrapper";
import BookingModalRoute from "./components/BookingListComponents/BookingModalRoute";
import EditBookingModalRoute from "./components/BookingListComponents/EditBookingModalRoute";
import GalleryView from "./components/ModerationListComponents/GalleryView"
// import AdminEditRoute from "./components/AdminEditor/AdminEditRoute";

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
              
              <Route path="/ads/add" element={<ProtectedRoute><AddAdPage /></ProtectedRoute>} />
              <Route path="/ads/editad/:id" element={<ProtectedRoute><EditAdFormWrapper /></ProtectedRoute>} />


              <Route path="/users/add" element={<ProtectedRoute><AddUserFormWrapper /></ProtectedRoute>} />
              <Route path="/users/edit/:id" element={<ProtectedRoute><EditUserFormWrapper /></ProtectedRoute>} />


              <Route path="/bookings/add" element={<ProtectedRoute><BookingModalRoute /></ProtectedRoute>} />
              <Route path="/bookings/edit/:id" element={<ProtectedRoute><EditBookingModalRoute /> </ProtectedRoute>} />

              {/* <Route path="/admin/profile" element={<ProtectedRoute><AdminEditRoute /></ProtectedRoute>} /> */}
              <Route path="/gallery/:id" element={<GalleryView />} />

            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
