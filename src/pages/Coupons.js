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
  const [editingCoupon, setEditingCoupon] = useState(null); // for editing

  // Fetch all coupons
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingCoupon) {
      setEditingCoupon({ ...editingCoupon, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ADD coupon
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
      console.error(err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  // DELETE coupon
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`https://servicesappdatabase-2mdi.onrender.com/coupon/delete/${id}`, { method: 'DELETE' });
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

  // START editing coupon
  const handleEdit = (coupon) => {
    setEditingCoupon({
      ...coupon,
      start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
      end_date: coupon.end_date ? coupon.end_date.split('T')[0] : ''
    });
  };

  // UPDATE coupon
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCoupon) return;
    try {
      const res = await fetch(`https://servicesappdatabase-2mdi.onrender.com/coupon/update/${editingCoupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editingCoupon.code.toUpperCase(),
          discount_percent: parseInt(editingCoupon.discount_percent),
          usage_limit: parseInt(editingCoupon.usage_limit),
          start_date: editingCoupon.start_date || null,
          end_date: editingCoupon.end_date || null,
          is_active: editingCoupon.is_active
        }),
      });
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
    <div style={{ padding: 40, fontFamily: 'Inter, sans-serif', maxWidth: 700, margin: '0 auto' }}>
      <h1>Manage Coupons</h1>

      {/* Add / Edit Coupon Form */}
      <form
        onSubmit={editingCoupon ? handleUpdate : handleSubmit}
        style={{ display: 'grid', gap: 16, marginBottom: 40 }}
      >
        <input
          name="code"
          placeholder="Coupon Code (e.g., FIRST20)"
          value={editingCoupon ? editingCoupon.code : formData.code}
          onChange={handleChange}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <input
          name="discount_percent"
          type="number"
          placeholder="Discount %"
          value={editingCoupon ? editingCoupon.discount_percent : formData.discount_percent}
          onChange={handleChange}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <input
          name="usage_limit"
          type="number"
          placeholder="Usage Limit"
          value={editingCoupon ? editingCoupon.usage_limit : formData.usage_limit}
          onChange={handleChange}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <input
          name="start_date"
          type="date"
          value={editingCoupon ? editingCoupon.start_date : formData.start_date}
          onChange={handleChange}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <input
          name="end_date"
          type="date"
          value={editingCoupon ? editingCoupon.end_date : formData.end_date}
          onChange={handleChange}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        />
        {editingCoupon && (
          <label>
            Active:
            <input
              type="checkbox"
              checked={editingCoupon.is_active}
              onChange={(e) => setEditingCoupon({ ...editingCoupon, is_active: e.target.checked })}
              style={{ marginLeft: 10 }}
            />
          </label>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: 12, backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: 6 }}
        >
          {loading ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Add Coupon'}
        </button>
        {editingCoupon && (
          <button
            type="button"
            onClick={() => setEditingCoupon(null)}
            style={{ padding: 12, backgroundColor: '#ccc', border: 'none', borderRadius: 6 }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Existing Coupons Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: 12, textAlign: 'left' }}>Code</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 12, textAlign: 'left' }}>Discount %</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 12, textAlign: 'left' }}>Used / Limit</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 12, textAlign: 'left' }}>Active</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 12, textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: 12 }}>{c.code}</td>
              <td style={{ padding: 12 }}>{c.discount_percent}%</td>
              <td style={{ padding: 12 }}>{c.used_count} / {c.usage_limit}</td>
              <td style={{ padding: 12 }}>{c.is_active ? 'Yes' : 'No'}</td>
              <td style={{ padding: 12 }}>
                <button
                  onClick={() => handleEdit(c)}
                  style={{ marginRight: 8, padding: 6, backgroundColor: '#FACC15', borderRadius: 6 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={{ padding: 6, backgroundColor: '#EF4444', color: '#fff', borderRadius: 6 }}
                >
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