import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ServicesLayout, { Dashboard } from "./component/layout";
import UserManagement from "./pages/usersmanagement";
import ProviderManagement from "./pages/ProviderManagement";
import ServicesManager from "./pages/ServicesManagement";
import BookingsManager from "./pages/BookingTable";
import AdminCoupons from "./pages/Coupons";
import AdminWallet from "./pages/AdminWallet";
import AdminLogin from "./pages/AdminLoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="login" element={<AdminLogin />} />

        {/* Admin layout with nested routes */}
        <Route path="/admin" element={<ServicesLayout />}>

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="providers" element={<ProviderManagement />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="bookings" element={<BookingsManager />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="wallet" element={<AdminWallet />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}