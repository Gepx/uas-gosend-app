import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Vouchers from "./pages/Vouchers";
import SavedAddress from "./pages/SavedAddress";
import AddAddress from "./pages/AddAddress";
import EditAddress from "./pages/EditAddress";
import History from "./pages/History";
import AuthPage from "./pages/AuthPage";
import AddDriver from "./pages/AddDriver";
import Drivers from "./pages/Drivers";
import EditDriver from "./pages/EditDriver";
import DeliveryDistance from "./pages/DeliveryDistance";
import DeliveryTracking from "./pages/DeliveryTracking";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected routes for logged-in users */}
          <Route
            path="/delivery-distance"
            element={
              <ProtectedRoute>
                <DeliveryDistance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vouchers"
            element={
              <ProtectedRoute>
                <Vouchers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-address"
            element={
              <ProtectedRoute>
                <SavedAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-address"
            element={
              <ProtectedRoute>
                <AddAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-address/:id"
            element={
              <ProtectedRoute>
                <EditAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery-tracking"
            element={
              <ProtectedRoute>
                <DeliveryTracking />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/drivers"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Drivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-driver"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddDriver />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-driver/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <EditDriver />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
