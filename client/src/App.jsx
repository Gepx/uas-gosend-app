// import AuthPage from "./pages/AuthPage";
// import SignupPage from "./components/SignupPage";
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

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vouchers" element={<Vouchers />} />
          <Route path="/saved-address" element={<SavedAddress />} />
          <Route path="/add-driver" element={<AddDriver />} />
          <Route path="/edit-driver/:id" element={<EditDriver />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/edit-address/:id" element={<EditAddress />} />
          <Route path="/history" element={<History />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/drivers" element={<Drivers />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
