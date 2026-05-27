import React, { useState } from 'react';

export default function AdminWallet() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateWallet = async () => {
    if (!amount) {
      setMessage('Wallet amount is required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        'https://servicesappdatabase-2mdi.onrender.com/users/wallet/one-time',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Number(amount) }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Error updating wallet');
        return;
      }

      setMessage(`Wallet updated for all users: ${data.updatedCount} users`);
      setAmount('');
    } catch (err) {
      console.error(err);
      setMessage('Error updating wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Admin Wallet Update</h2>

        <input
          type="number"
          placeholder="Enter Wallet Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />

        <button onClick={handleUpdateWallet} className="button" disabled={loading}>
          {loading ? 'Updating...' : 'Update Wallet for All Users'}
        </button>

        {message && (
          <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
      </div>

      {/* CSS */}
      <style>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f5f7fb;
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .title {
          text-align: center;
          margin-bottom: 20px;
          font-size: 20px;
          font-weight: 600;
          color: #1e3a8a;
        }

        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 15px;
          outline: none;
        }

        .input:focus {
          border-color: #1e3a8a;
        }

        .button {
          width: 100%;
          padding: 12px;
          background: #1e3a8a;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
        }

        .button:disabled {
          background: #93a4c7;
          cursor: not-allowed;
        }

        .message {
          margin-top: 15px;
          text-align: center;
          font-size: 14px;
        }

        .success {
          color: green;
        }

        .error {
          color: red;
        }

        /* 📱 Mobile tweaks */
        @media (max-width: 480px) {
          .card {
            padding: 18px;
            border-radius: 10px;
          }

          .title {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}