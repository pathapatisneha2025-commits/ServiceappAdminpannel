import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const ServicesLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
const handleLogout = () => {
  // clear stored auth (if you use localStorage)
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");

  // redirect to login page
  navigate("/login");
};
  const navItems = [
    { name: "Dashboard", path: "dashboard" },
    { name: "Users", path: "users" },
    { name: "Providers", path: "providers" },
    { name: "Services", path: "services" },
    { name: "Bookings", path: "bookings" },
    { name:"coupons", path: "coupons" },
    { name: "Wallet", path: "wallet" },
  ];

  const activeNav = navItems.find((item) =>
    location.pathname.endsWith(item.path)
  )?.name;

  return (
    <div style={styles.container}>
      {/* Global CSS for resets */}
      <style>{`
        body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fe; }
        * { box-sizing: border-box; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>1</div>
          <div>
            <div style={{ fontWeight: "bold" }}>1 Tap Services</div>
            <div style={{ fontSize: "10px", color: "#888" }}>Admin Panel</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => (
            <div
              key={item.name}
              style={{
                ...styles.navItem,
                ...(activeNav === item.name ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </div>
          ))}

          <div style={styles.logoutSection}>
  <button onClick={handleLogout} style={styles.logoutBtn}>
     Logout
  </button>
</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h2 style={{ margin: 0 }}>{activeNav || "Dashboard"}</h2>
          <p style={{ color: "#888", margin: 0 }}>Welcome back, Admin</p>
        </header>

        {/* Render nested routes here */}
        <Outlet />
      </main>
    </div>
  );
};

/* --- Dashboard Content Example --- */
export const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeProviders, setActiveProviders] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0); // <-- new state
  const [recentBookings, setRecentBookings] = useState([]);

  // Fetch total users
  useEffect(() => {
    fetch("https://servicesappdatabase-2mdi.onrender.com/users/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setTotalUsers(data.users.length);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Fetch approved providers
  useEffect(() => {
    fetch("https://servicesappdatabase-2mdi.onrender.com/providers/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.providers) {
          const approved = data.providers.filter((p) => p.status === "Approved");
          setActiveProviders(approved.length);
        }
      })
      .catch((err) => console.error("Error fetching providers:", err));
  }, []);

  // Fetch bookings
useEffect(() => {
  fetch("https://servicesappdatabase-2mdi.onrender.com/bookings/all")
    .then((res) => res.json())
    .then((data) => {
      if (data.bookings) {
        setTotalBookings(data.bookings.length);

        // Filter only completed bookings for revenue
        const completedBookings = data.bookings.filter(
          (b) => b.status.toLowerCase() === "completed"
        );

        // Calculate total revenue from completed bookings
        const revenue = completedBookings.reduce((sum, b) => {
          const price = parseFloat(b.price) || 0;
          const discount = parseFloat(b.discount) || 0;
          const wallet = parseFloat(b.wallet_used) || 0;
          return sum + (price - discount - wallet);
        }, 0);
        setTotalRevenue(revenue.toFixed(2));

        // Get 5 most recent bookings
        const recent = data.bookings
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecentBookings(recent);
      }
    })
    .catch((err) => console.error("Error fetching bookings:", err));
}, []);

  return (
    <>
      <section style={styles.statsRow}>
        <StatCard label="Total Users" value={totalUsers} growth="+8.2%" color="#4e73df" />
        <StatCard label="Active Providers" value={activeProviders} growth="+3.1%" color="#1cc88a" />
        <StatCard label="Total Bookings" value={totalBookings} growth="+12.5%" color="#36b9cc" />
        <StatCard label="Revenue" value={`$${totalRevenue}`} growth="-2.3%" color="#f6c23e" isNegative />
      </section>

      <section style={styles.tableCard}>
        <h3 style={{ marginBottom: "20px" }}>Recent Bookings</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Service</th>
              <th style={styles.th}>Provider</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((b) => (
              <TableRow
                key={b.id}
                id={`${b.id}`}
                name={b.customer_name}
                service={b.service_name}
                provider={b.provider_name || "-"}
                amount={`$${b.price}`}
                status={b.status}
              />
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};
/* --- Sub-Components --- */

const StatCard = ({ label, value, growth, color, isNegative }) => (
  <div style={styles.statCard}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ ...styles.iconBox, color }}>👤</div>
      <div style={{ color: isNegative ? "#e74a3b" : "#1cc88a", fontSize: "12px", fontWeight: "bold" }}>
        {isNegative ? "↘" : "↗"} {growth}
      </div>
    </div>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const TableRow = ({ id, name, service, provider, amount, status }) => {
  const getStatusStyle = (s) => {
    const colors = {
      Completed: { bg: "#e8f5e9", text: "#2e7d32" },
      Active: { bg: "#e3f2fd", text: "#1565c0" },
      Pending: { bg: "#fff3e0", text: "#ef6c00" },
      Cancelled: { bg: "#ffebee", text: "#c62828" },
    };
    const style = colors[s] || colors.Pending;
    return {
      backgroundColor: style.bg,
      color: style.text,
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold",
    };
  };

  return (
    <tr style={styles.tr}>
      <td style={styles.td}>{id}</td>
      <td style={styles.td}>{name}</td>
      <td style={styles.td}>{service}</td>
      <td style={styles.td}>{provider}</td>
      <td style={styles.td}>{amount}</td>
      <td style={styles.td}>
        <span style={getStatusStyle(status)}>{status}</span>
      </td>
    </tr>
  );
};

/* --- Styling --- */

const styles = {
  container: { display: "flex", minHeight: "100vh", width: "100%" },
  logoutSection: {
  marginTop: "auto",
  paddingTop: "20px",
  borderTop: "1px solid #eee",
},

logoutBtn: {
  width: "100%",
  padding: "12px",
  backgroundColor: "#e74a3b",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
},
  sidebar: { width: "240px", backgroundColor: "#fff", borderRight: "1px solid #eee", padding: "20px" },
  logo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" },
  logoIcon: { width: "35px", height: "35px", backgroundColor: "#2c3e50", color: "#fff", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" },
  nav: { display: "flex", flexDirection: "column", gap: "5px" },
  navItem: { padding: "12px 15px", color: "#555", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  activeNavItem: { backgroundColor: "#3b5998", color: "#fff", fontWeight: "500" },

  main: { flex: 1, padding: "40px" },
  header: { marginBottom: "30px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" },
  statCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" },
  statValue: { fontSize: "24px", fontWeight: "bold", margin: "10px 0 5px" },
  statLabel: { color: "#888", fontSize: "14px" },
  iconBox: { fontSize: "20px", backgroundColor: "#f8f9fa", padding: "8px", borderRadius: "10px" },

  tableCard: { backgroundColor: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", color: "#aaa", fontSize: "12px", textTransform: "uppercase", paddingBottom: "15px", borderBottom: "1px solid #f0f0f0" },
  td: { padding: "15px 0", fontSize: "14px", borderBottom: "1px solid #f8f8f8" },
  tr: { verticalAlign: "middle" },
};

export default ServicesLayout;