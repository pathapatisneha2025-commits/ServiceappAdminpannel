import React from 'react';

// --- CSS Styles ---
const styles = `
  .dashboard-container {
    display: flex;
    font-family: 'Inter', -apple-system, sans-serif;
    background-color: #f8fafc;
    min-height: 100vh;
    color: #334155;
  }

  /* Sidebar */
  .sidebar {
    width: 240px;
    background: white;
    border-right: 1px solid #e2e8f0;
    padding: 24px 0;
  }

  .brand-box {
    padding: 0 24px 32px;
  }

  .brand-title { font-weight: 700; font-size: 16px; margin: 0; }
  .brand-subtitle { font-size: 11px; color: #94a3b8; }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    font-size: 14px;
    color: #64748b;
    cursor: pointer;
    transition: 0.2s;
  }

  .nav-link.active {
    background-color: #1e3a8a;
    color: white;
    margin: 0 12px;
    border-radius: 8px;
  }

  /* Main Content Area */
  .content { flex: 1; padding: 32px; }

  .header { margin-bottom: 32px; }
  .header h1 { font-size: 24px; margin: 0 0 4px 0; color: #0f172a; }
  .header p { font-size: 14px; color: #64748b; margin: 0; }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: white;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    position: relative;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    background: #eff6ff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b82f6;
    margin-bottom: 16px;
  }

  .stat-value { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
  .stat-label { font-size: 12px; color: #94a3b8; }
  .trend {
    position: absolute;
    top: 24px;
    right: 24px;
    font-size: 12px;
    font-weight: 600;
  }
  .trend.up { color: #22c55e; }
  .trend.down { color: #ef4444; }

  /* Table Card */
  .table-section {
    background: white;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    padding: 24px;
  }

  .table-title { font-size: 16px; font-weight: 600; margin-bottom: 20px; }

  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 12px; color: #94a3b8; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; }
  td { padding: 16px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }

  /* Status Pills */
  .badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }
  .completed { background: #dcfce7; color: #166534; }
  .active-status { background: #eff6ff; color: #1e40af; }
  .pending { background: #fef3c7; color: #92400e; }
  .cancelled { background: #fee2e2; color: #991b1b; }
`;

const Dashboard = () => {
  const stats = [
    { label: "Total Users", value: "12", trend: "+8.2%", up: true },
    { label: "Active Providers", value: "1,234", trend: "+3.1%", up: true },
    { label: "Total Bookings", value: "45,890", trend: "+12.5%", up: true },
    { label: "Revenue", value: "$284,500", trend: "-2.3%", up: false },
  ];

  const bookings = [
    { id: "B-4521", customer: "Sarah M.", service: "Deep Cleaning", provider: "John D.", amount: "$89.50", status: "Completed" },
    { id: "B-4520", customer: "Mike R.", service: "AC Repair", provider: "Tom S.", amount: "$49.00", status: "Active" },
    { id: "B-4519", customer: "Lisa K.", service: "Plumbing", provider: "James P.", amount: "$55.00", status: "Pending" },
    { id: "B-4518", customer: "David W.", service: "Electrical", provider: "Mark L.", amount: "$65.00", status: "Completed" },
    { id: "B-4517", customer: "Anna B.", service: "Beauty", provider: "Kate R.", amount: "$45.00", status: "Cancelled" },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'completed';
      case 'Active': return 'active-status';
      case 'Pending': return 'pending';
      case 'Cancelled': return 'cancelled';
      default: return '';
    }
  };

  return (
    <div className="dashboard-container">
      <style>{styles}</style>
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand-box">
          <p className="brand-title">1 Tap Services</p>
          <p className="brand-subtitle">Admin Panel</p>
        </div>
        <nav>
          <div className="nav-link active">Dashboard</div>
          <div className="nav-link">Users</div>
          <div className="nav-link">Providers</div>
          <div className="nav-link">Services</div>
          <div className="nav-link">Bookings</div>
          <div className="nav-link">Payments</div>
          <div className="nav-link">Reports</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        <header className="header">
       
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon">📊</div>
              <div className={`trend ${stat.up ? 'up' : 'down'}`}>
                {stat.up ? '↗' : '↘'} {stat.trend}
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Bookings Table */}
        <section className="table-section">
          <div className="table-title">Recent Bookings</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Provider</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, i) => (
                <tr key={i}>
                  <td style={{ color: '#64748b' }}>{booking.id}</td>
                  <td style={{ fontWeight: '500' }}>{booking.customer}</td>
                  <td>{booking.service}</td>
                  <td>{booking.provider}</td>
                  <td style={{ fontWeight: '600' }}>{booking.amount}</td>
                  <td>
                    <span className={`badge ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;