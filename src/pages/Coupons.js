import React, { useState, useEffect } from 'react';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    discount_percent: '',
    usage_limit: '',
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('https://servicesappdatabase-2mdi.onrender.com/coupon/all');
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingCoupon) {
      setEditingCoupon({ ...editingCoupon, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://servicesappdatabase-2mdi.onrender.com/coupon/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          discount_percent: parseInt(formData.discount_percent),
          usage_limit: parseInt(formData.usage_limit),
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Coupon added successfully!');
        setFormData({ code: '', discount_percent: '', usage_limit: '', start_date: '', end_date: '' });
        fetchCoupons();
      } else {
        alert(data.message || 'Error adding coupon');
      }
    } catch (err) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    await fetch(`https://servicesappdatabase-2mdi.onrender.com/coupon/delete/${id}`, {
      method: 'DELETE',
    });

    fetchCoupons();
  };

  const handleEdit = (coupon) => {
    setEditingCoupon({
      ...coupon,
      start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
      end_date: coupon.end_date ? coupon.end_date.split('T')[0] : ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCoupon) return;

    await fetch(`https://servicesappdatabase-2mdi.onrender.com/coupon/update/${editingCoupon.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editingCoupon,
        code: editingCoupon.code.toUpperCase(),
        discount_percent: parseInt(editingCoupon.discount_percent),
        usage_limit: parseInt(editingCoupon.usage_limit),
      }),
    });

    setEditingCoupon(null);
    fetchCoupons();
  };

  return (
    <div className="coupon-container">

      {/* 🔥 INLINE RESPONSIVE CSS */}
      <style>{`
        .coupon-container {
          padding: 40px;
          font-family: Inter, sans-serif;
          max-width: 900px;
          margin: auto;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        form {
          display: grid;
          gap: 14px;
          margin-bottom: 40px;
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        button {
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }

        /* ✅ MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .coupon-container {
            padding: 16px;
          }

          h1 {
            font-size: 20px;
          }

          table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }

          th, td {
            padding: 10px;
            font-size: 13px;
          }

          button {
            padding: 8px;
            font-size: 12px;
          }
        }

        /* EXTRA SMALL MOBILE */
        @media (max-width: 480px) {
          .coupon-container {
            padding: 12px;
          }

          input {
            font-size: 14px;
          }

          th, td {
            font-size: 12px;
          }
        }
      `}</style>

      <h1>Manage Coupons</h1>

      {/* FORM */}
      <form onSubmit={editingCoupon ? handleUpdate : handleSubmit}>
        <input name="code" placeholder="Coupon Code"
          value={editingCoupon ? editingCoupon.code : formData.code}
          onChange={handleChange}
        />

        <input name="discount_percent" type="number" placeholder="Discount %"
          value={editingCoupon ? editingCoupon.discount_percent : formData.discount_percent}
          onChange={handleChange}
        />

        <input name="usage_limit" type="number" placeholder="Usage Limit"
          value={editingCoupon ? editingCoupon.usage_limit : formData.usage_limit}
          onChange={handleChange}
        />

        <input type="date" name="start_date"
          value={editingCoupon ? editingCoupon.start_date : formData.start_date}
          onChange={handleChange}
        />

        <input type="date" name="end_date"
          value={editingCoupon ? editingCoupon.end_date : formData.end_date}
          onChange={handleChange}
        />

        <button style={{ background: '#1e3a8a', color: '#fff' }}>
          {editingCoupon ? 'Update' : loading ? 'Saving...' : 'Add Coupon'}
        </button>

        {editingCoupon && (
          <button type="button" onClick={() => setEditingCoupon(null)}>
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Used / Limit</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.discount_percent}%</td>
              <td>{c.used_count} / {c.usage_limit}</td>
              <td>{c.is_active ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(c)} style={{ background: '#FACC15' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(c.id)} style={{ background: '#EF4444', color: '#fff', marginLeft: 8 }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default AdminCoupons;