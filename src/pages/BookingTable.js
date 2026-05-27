import React, { useState, useEffect } from 'react';

const styles = `
  .admin-layout { display: flex; font-family: 'Inter', sans-serif; background: #f8fafc; min-height: 100vh; color: #334155; }
  .sidebar { width: 240px; background: white; border-right: 1px solid #e2e8f0; padding-top: 20px; }
  .nav-item { padding: 12px 24px; font-size: 14px; color: #64748b; cursor: pointer; transition: 0.2s; }
  .nav-item.active { background: #1e3a8a; color: white; margin: 0 12px; border-radius: 8px; }
  
  .content { flex: 1; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .add-booking-btn { background: #1e3a8a; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }

  /* Table Card */
  .table-container { background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 12px; color: #94a3b8; padding: 16px; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; }
  td { padding: 16px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }

  /* Status Badges */
  .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .status-completed { background: #dcfce7; color: #166534; }
  .status-active { background: #eff6ff; color: #1e40af; }
  .status-pending { background: #fef3c7; color: #92400e; }

  /* Modal Styles */
  .modal-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .modal-box { background: white; padding: 30px; border-radius: 12px; width: 500px; position: relative; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-group label { font-size: 12px; font-weight: 600; color: #64748b; }
  .form-group input, .form-group select { padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; }
  .save-btn { grid-column: span 2; background: #1e3a8a; color: white; border: none; padding: 12px; border-radius: 8px; margin-top: 10px; cursor: pointer; font-weight: 600; }
  @media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    display: flex;
    overflow-x: auto;
  }

  .content {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .modal-box {
    width: 95%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
`;

const BookingsManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('https://servicesappdatabase-2mdi.onrender.com/bookings/all');
        const data = await res.json();

        // Map API response to your table format
        const formattedBookings = data.bookings.map(b => ({
          id: b.id,
          customer: b.customer_name, // Replace with actual customer name if available
          service: b.service_name,
          provider: b.provider_name, // Adjust if provider info exists
          amount: `$${parseFloat(b.price).toFixed(2)}`,
          status: b.status.toLowerCase(),
        }));

        setBookings(formattedBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="admin-layout">
      <style>{styles}</style>

      <main className="content">
        <div className="header">
          <h1 style={{margin: 0}}>Bookings</h1>
          <button className="add-booking-btn" onClick={() => setShowModal(true)}>+ New Booking</button>
        </div>

        {showModal && (
          <div className="modal-bg">
            <div className="modal-box">
              <h3 style={{margin: 0}}>Create New Booking</h3>
              <form className="form-grid" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                <div className="form-group">
                  <label>Customer Name</label>
                  <input type="text" placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Service Type</label>
                  <select>
                    <option>Cleaning</option>
                    <option>Repair</option>
                    <option>Electrical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Provider</label>
                  <input type="text" placeholder="Assigned Professional" />
                </div>
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input type="number" placeholder="0.00" />
                </div>
                <button type="submit" className="save-btn">Confirm Booking</button>
                <button type="button" onClick={() => setShowModal(false)} style={{gridColumn: 'span 2', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer'}}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        <div className="table-container">
          {loading ? (
            <p style={{padding: '20px'}}>Loading bookings...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Provider</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={i}>
                    <td style={{color: '#64748b', fontWeight: '500'}}>{b.id}</td>
                    <td style={{fontWeight: '600'}}>{b.customer}</td>
                    <td>{b.service}</td>
                    <td>{b.provider}</td>
                    <td style={{fontWeight: '700'}}>{b.amount}</td>
                    <td>
                      <span className={`badge status-${b.status}`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingsManager;