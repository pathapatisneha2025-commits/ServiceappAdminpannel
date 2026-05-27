import React, { useState } from 'react';

export default function AdminWallet() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateWallet = async () => {
    if (!amount) {
      setMessage('Wallet amount is required.');
      return;
    }

    try {
const response = await fetch('https://servicesappdatabase-2mdi.onrender.com/users/wallet/one-time', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: Number(amount) }),
});
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Error updating wallet');
        return;
      }

      setMessage(`Wallet updated for all users: ${data.updatedCount} users`);
    } catch (err) {
      console.error(err);
      setMessage('Error updating wallet');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Admin Wallet Update</h2>
      <input
        type="number"
        placeholder="Wallet Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <button onClick={handleUpdateWallet} style={{ width: '100%', padding: 10 }}>
        Update Wallet for All Users
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}