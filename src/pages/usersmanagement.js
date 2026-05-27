import React, { useState, useEffect } from "react";

// --- CSS Styles ---
const styles = `
  .admin-container {
    display: flex;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    height: 100vh;
    background-color: #f8fafc;
    color: #334155;
  }

  /* Sidebar Styles */
  .sidebar {
    width: 240px;
    background: white;
    border-right: 1px solid #e2e8f0;
    padding: 20px 0;
  }

  .brand {
    padding: 0 24px 30px;
    font-weight: bold;
    font-size: 1.2rem;
    color: #1e293b;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    color: #64748b;
  }

  .nav-item:hover {
    background-color: #f1f5f9;
  }

  .nav-item.active {
    background-color: #1e3a8a;
    color: white;
    border-radius: 0 20px 20px 0;
    margin-right: 15px;
  }

  /* Main Content Area */
  .main-content {
    flex: 1;
    padding: 40px;
    overflow-y: auto;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .search-bar {
    padding: 8px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    width: 250px;
    outline: none;
  }

  /* Table Styles */
  .table-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  th {
    background-color: #ffffff;
    padding: 16px;
    font-size: 12px;
    text-transform: uppercase;
    color: #94a3b8;
    border-bottom: 1px solid #f1f5f9;
  }

  td {
    padding: 16px;
    font-size: 14px;
    border-bottom: 1px solid #f1f5f9;
  }

  .status-pill {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  @media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    display: flex;
    overflow-x: auto;
  }

  .main-content {
    padding: 16px;
  }

  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .search-bar {
    width: 100%;
  }
}

  .status-active { background: #dcfce7; color: #166534; }
  .status-inactive { background: #f1f5f9; color: #475569; }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://servicesappdatabase-2mdi.onrender.com/users/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          // Map API data to match your table structure
          const formatted = data.users.map((u) => ({
            name: u.full_name,
            email: u.email,
            phone: u.phone,
            joined: new Date().toLocaleDateString(), // Demo joined date
            status: "Active",
          }));
          setUsers(formatted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading users...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div className="admin-container">
      <style>{styles}</style>

      {/* Main Content */}
      <main className="main-content">
        <div className="header-row">
          <h1 style={{ fontSize: "24px", margin: 0 }}>Users</h1>
          <input type="text" placeholder="Search users..." className="search-bar" />
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: "500" }}>{user.name}</td>
                  <td style={{ color: "#2563eb" }}>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.joined}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        user.status === "Active" ? "status-active" : "status-inactive"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td style={{ color: "#94a3b8", cursor: "pointer" }}>•••</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;