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
    <div className="page">
      <div className="card">
        <h2 className="title">Admin Wallet Update</h2>

        <input
          type="number"
          inputMode="numeric"
          placeholder="Enter Wallet Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />

        <button
          onClick={handleUpdateWallet}
          className="button"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Wallet for All Users'}
        </button>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>

      <style>{`
        /* ================= PAGE ================= */
        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px;
          background: #f3f6fb;
        }

        /* ================= CARD (FIXED MOBILE FEEL) ================= */
        .card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 16px;
          padding: 26px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        .title {
          font-size: 20px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 22px;
          color: #1e3a8a;
        }

        /* ================= INPUT (BIGGER MOBILE FRIENDLY) ================= */
        .input {
          width: 100%;
          padding: 16px;          /* ⬅ bigger touch area */
          font-size: 17px;        /* ⬅ no zoom + better readability */
          border: 1px solid #d0d5dd;
          border-radius: 12px;
          outline: none;
          margin-bottom: 16px;
          box-sizing: border-box;
        }

        .input:focus {
          border-color: #1e3a8a;
          box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.12);
        }

        /* ================= BUTTON (MORE TOUCH FRIENDLY) ================= */
        .button {
          width: 100%;
          padding: 16px;
          background: #1e3a8a;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .button:active {
          transform: scale(0.98);
        }

        .button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        /* ================= MESSAGE ================= */
        .message {
          margin-top: 16px;
          font-size: 14px;
          text-align: center;
          padding: 12px;
          border-radius: 10px;
        }

        .success {
          background: #e7f8ee;
          color: #166534;
        }

        .error {
          background: #ffecec;
          color: #b91c1c;
        }

        /* ================= MOBILE OPTIMIZATION ================= */
        @media (max-width: 480px) {
          .page {
            align-items: flex-start;
            padding-top: 40px;
          }

          .card {
            padding: 22px;
            border-radius: 14px;
          }

          .title {
            font-size: 19px;
          }

          .input {
            font-size: 18px;
            padding: 18px;
          }

          .button {
            padding: 18px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}