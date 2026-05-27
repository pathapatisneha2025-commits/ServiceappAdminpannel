import React, { useState, useEffect } from "react";

// --- CSS Styles ---
const styles = `
  .admin-panel {
    display: flex;
    font-family: 'Inter', sans-serif;
    background-color: #f8fafc;
    min-height: 100vh;
    color: #334155;
  }

  .main { flex: 1; padding: 40px; }
  .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .search-input { padding: 10px 18px; border-radius: 20px; border: 1px solid #e2e8f0; width: 280px; font-size: 14px; outline: none; background-color: #f1f5f9; }

  .card { background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }
  table { width: 100%; border-collapse: collapse; text-align: left; }
  th { padding: 16px; font-size: 12px; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
  td { padding: 18px 16px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }

  img { max-width: 100px; border-radius: 8px; }

  /* Status badge */
  .badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  .approved { background-color: #dcfce7; color: #166534; }
  .rejected { background-color: #fee2e2; color: #b91c1c; }
  .pending { background-color: #fef3c7; color: #92400e; }

  .action-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    margin-right: 6px;
    transition: 0.2s;
  }
  .approve-btn { background-color: #2563eb; color: white; }
  .approve-btn:hover { background-color: #1d4ed8; }
  .reject-btn { background-color: #ef4444; color: white; }
  .reject-btn:hover { background-color: #b91c1c; }

  @media (max-width: 768px) {
  .main {
    padding: 16px;
  }

  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .search-input {
    width: 100%;
  }

  img {
    max-width: 60px;
  }
}
`;

const ProviderManagement = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://servicesappdatabase-2mdi.onrender.com/providers/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.providers) {
          const formatted = data.providers.map((p) => ({
            id: p.id,
            name: p.full_name,
            service: p.service_type || "-",
            phone: p.phone,
            aadhaar: p.aadhaar_url,
            pan: p.pan_url,
            status: p.status, // default status
          }));
          setProviders(formatted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch providers");
        setLoading(false);
      });
  }, []);
const handleStatusChange = async (id, status) => {
  try {
    const res = await fetch(`https://servicesappdatabase-2mdi.onrender.com/providers/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }), // pass "Approved" or "Rejected"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update status');

    // Update local state
    setProviders(providers.map(p => p.id === id ? { ...p, status } : p));
  } catch (err) {
    console.error(err);
    alert('Error: ' + err.message);
  }
};

  if (loading) return <div style={{ padding: 40 }}>Loading providers...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div className="admin-panel">
      <style>{styles}</style>

      <main className="main">
        <div className="header-row">
          <h1 style={{ fontSize: "24px", margin: 0 }}>Providers</h1>
          <input type="text" placeholder="Search providers..." className="search-input" />
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Phone</th>
                <th>Aadhaar</th>
                <th>PAN</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: "500" }}>{p.name}</td>
                  <td style={{ color: "#2563eb" }}>{p.service}</td>
                  <td>{p.phone}</td>
                  <td><img src={p.aadhaar} alt="Aadhaar" /></td>
                  <td><img src={p.pan} alt="PAN" /></td>
                  <td>
                    <span className={`badge ${
                      p.status === "Approved" ? "approved" :
                      p.status === "Rejected" ? "rejected" : "pending"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    {p.status === "Pending" && (
                      <>
                      <button className="action-btn approve-btn" onClick={() => handleStatusChange(p.id, 'Approved')}>Approve</button>
<button className="action-btn reject-btn" onClick={() => handleStatusChange(p.id, 'Rejected')}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ProviderManagement;