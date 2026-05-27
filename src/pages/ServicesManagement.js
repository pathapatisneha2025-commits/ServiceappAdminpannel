import React, { useState, useEffect } from 'react';
import { FaBroom, FaBolt, FaWater, FaSnowflake, FaPaintRoller, FaTv, FaCut, FaTrash, FaEdit } from "react-icons/fa";

const styles = `
  .services-container { display: flex; font-family: 'Inter', sans-serif; background: #f8fafc; min-height: 100vh; }
  .main-content { flex: 1; padding: 40px; }
  .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .add-btn { background: #1e3a8a; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; }

  .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .modal-content { background: white; padding: 32px; border-radius: 16px; width: 600px; max-width: 90%; position: relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
  .close-modal { position: absolute; top: 20px; right: 20px; border: none; background: none; font-size: 20px; cursor: pointer; color: #64748b; }

  .grid-form { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 20px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group label { font-size: 12px; font-weight: 600; color: #64748b; }
  .form-group input, .form-group select, .form-group textarea { padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; }
  .form-group textarea { resize: vertical; min-height: 60px; }
  .submit-btn { background: #1e3a8a; color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; grid-column: span 2; font-weight: 600; margin-top: 10px; }

  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 12px; color: #94a3b8; padding: 12px; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; }
  td { padding: 14px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }

  .service-icon-preview { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }

  .icon-grid { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
  .icon-box { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid #e2e8f0; font-size: 18px; }
  .icon-box.selected { border: 2px solid #1e3a8a; background: #eef2ff; }
`;

const iconList = [
  { name: "broom", icon: <FaBroom /> },
  { name: "flash", icon: <FaBolt /> },
  { name: "water", icon: <FaWater /> },
  { name: "air-conditioner", icon: <FaSnowflake /> },
  { name: "content-cut", icon: <FaCut /> },
  { name: "format-paint", icon: <FaPaintRoller /> },
  { name: "television", icon: <FaTv /> }
];

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    color: '#3b82f6',
    image: null,
    category: '',
    price: '',
    is_popular: false,
    description: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('https://servicesappdatabase-2mdi.onrender.com/services/all');
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const selectIcon = (iconName) => {
    setFormData({ ...formData, icon: iconName });
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      icon: service.icon,
      color: service.color,
      image: null, // optional: keep existing
      category: service.category,
      price: service.price,
      is_popular: service.is_popular,
      description: service.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`https://servicesappdatabase-2mdi.onrender.com/services/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices(services.filter(s => s.id !== id));
      }
    } catch (err) { console.error(err); }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Prepare JSON payload
    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      icon: formData.icon,
      // color: formData.color,
      is_popular: formData.is_popular,
      description: formData.description
    };

    // Determine URL and method based on add or update
    const url = editingService
      ? `https://servicesappdatabase-2mdi.onrender.com/services/update/${editingService.id}`
      : 'https://servicesappdatabase-2mdi.onrender.com/services/add';
    const method = editingService ? 'PUT' : 'POST';

    // Send request
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      if (editingService) {
        // Update service in state
        setServices(services.map(s => s.id === data.service.id ? data.service : s));
      } else {
        // Add new service to state
        setServices([...services, data.service]);
      }

      setIsModalOpen(false);
      setEditingService(null);
      alert(`Service ${editingService ? 'updated' : 'added'} successfully!`);
    } else {
      alert(data.message || 'Something went wrong!');
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
};

  return (
    <div className="services-container">
      <style>{styles}</style>
      <main className="main-content">
        <div className="header-section">
          <h1 style={{margin:0}}>Services</h1>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ Add Service</button>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-modal" onClick={() => { setIsModalOpen(false); setEditingService(null); }}>×</button>
              <h2>{editingService ? 'Edit Service' : 'Create New Service'}</h2>
              <form className="grid-form" onSubmit={handleSubmit}>

                <div className="form-group">
                  <label>Service Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option>Home</option>
                    <option>Cleaning</option>
                    <option>Repair</option>
                    <option>Beauty</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input name="price" type="number" value={formData.price} onChange={handleChange} required />
                </div>

                <div className="form-group" style={{gridColumn:'span 2'}}>
                  <label>Select Icon</label>
                  <div className="icon-grid">
                    {iconList.map((item) => (
                      <div key={item.name} className={`icon-box ${formData.icon === item.name ? 'selected' : ''}`} onClick={() => selectIcon(item.name)}>
                        {item.icon}
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div className="form-group">
                  <label>Color</label>
                  <input name="color" type="color" value={formData.color} onChange={handleChange} />
                </div> */}

                <div className="form-group">
                  <label>Upload Image</label>
                  <input name="image" type="file" accept="image/*" onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                </div>

                <div className="form-group">
                  <label>
                    <input type="checkbox" name="is_popular" checked={formData.is_popular} onChange={handleChange} /> Popular Service
                  </label>
                </div>

                <button type="submit" className="submit-btn">Save to Database</button>
              </form>
            </div>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <div className="service-icon-preview" style={{background:s.color}}>
                    {iconList.find(i=>i.name===s.icon)?.icon}
                  </div>
                  <span style={{fontWeight:'600'}}>{s.name}</span>
                </td>
                <td>{s.category}</td>
                <td>${s.price}</td>
                <td style={{display:'flex', gap:'8px'}}>
                  <button onClick={() => openEditModal(s)}><FaEdit /></button>
                  <button onClick={() => handleDelete(s.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ServicesManager;