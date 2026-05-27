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

  // ✅ Proper date format
  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d)) return '-';
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
        setFormData({
          code: '',
          discount_percent: '',
          usage_limit: '',
          start_date: '',
          end_date: '',
        });
        fetchCoupons();
      } else {
        alert(data.message || 'Error adding coupon');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const res = await fetch(
        `https://servicesappdatabase-2mdi.onrender.com/coupon/delete/${id}`,
        { method: 'DELETE' }
      );

      const data = await res.json();

      if (res.ok) {
        alert('Coupon deleted successfully');
        fetchCoupons();
      } else {
        alert(data.message || 'Error deleting coupon');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon({
      ...coupon,
      start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
      end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCoupon) return;

    try {
      const res = await fetch(
        `https://servicesappdatabase-2mdi.onrender.com/coupon/update/${editingCoupon.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: editingCoupon.code.toUpperCase(),
            discount_percent: parseInt(editingCoupon.discount_percent),
            usage_limit: parseInt(editingCoupon.usage_limit),
            start_date: editingCoupon.start_date || null,
            end_date: editingCoupon.end_date || null,
            is_active: editingCoupon.is_active,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert('Coupon updated successfully!');
        setEditingCoupon(null);
        fetchCoupons();
      } else {
        alert(data.message || 'Error updating coupon');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="container">
      <h1>Manage Coupons</h1>

      {/* FORM */}
      <form onSubmit={editingCoupon ? handleUpdate : handleSubmit} className="form">
        <input
          name="code"
          placeholder="Coupon Code"
          value={editingCoupon ? editingCoupon.code : formData.code}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          name="discount_percent"
          type="number"
          placeholder="Discount %"
          value={editingCoupon ? editingCoupon.discount_percent : formData.discount_percent}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          name="usage_limit"
          type="number"
          placeholder="Usage Limit"
          value={editingCoupon ? editingCoupon.usage_limit : formData.usage_limit}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          name="start_date"
          type="date"
          value={editingCoupon ? editingCoupon.start_date : formData.start_date}
          onChange={handleChange}
          className="input"
        />

        <input
          name="end_date"
          type="date"
          value={editingCoupon ? editingCoupon.end_date : formData.end_date}
          onChange={handleChange}
          className="input"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editingCoupon ? 'Update' : 'Add'}
        </button>

        {editingCoupon && (
          <button type="button" onClick={() => setEditingCoupon(null)}>
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      <div className="tableWrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Used/Limit</th>
              <th>Start</th>
              <th>End</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td data-label="Code">{c.code}</td>
                <td data-label="Discount">{c.discount_percent}%</td>
                <td data-label="Used/Limit">{c.used_count} / {c.usage_limit}</td>
                <td data-label="Start">{formatDate(c.start_date)}</td>
                <td data-label="End">{formatDate(c.end_date)}</td>
                <td data-label="Active">{c.is_active ? 'Yes' : 'No'}</td>

                <td data-label="Actions">
                  <button onClick={() => handleEdit(c)}>Edit</button>
                  <button onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSS */}
      <style>{`
        .container {
          padding: 20px;
          max-width: 900px;
          margin: auto;
          font-family: Inter, sans-serif;
        }

        .form {
          display: grid;
          gap: 12px;
          margin-bottom: 30px;
        }

        .input {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        button {
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          background: #1e3a8a;
          color: white;
          margin-right: 6px;
        }

        .tableWrapper {
          width: 100%;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }

        /* 📱 MOBILE CARD VIEW */
        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }

          .table, thead, tbody, th, td, tr {
            display: block;
            width: 100%;
          }

          thead {
            display: none;
          }

          tr {
            margin-bottom: 12px;
            background: #fff;
            padding: 12px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }

          td {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border: none;
            font-size: 14px;
          }

          td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #555;
          }

          .input {
            font-size: 16px;
            padding: 14px;
          }

          button {
            padding: 6px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminCoupons;