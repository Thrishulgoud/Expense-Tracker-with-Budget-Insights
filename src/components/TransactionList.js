import React from 'react';

export default function TransactionList({ transactions = [], onDelete, loading }) {
  if (loading) return <div>Loading transactions...</div>;
  return (
    <div style={{marginTop:12}}>
      <h3>Transactions</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.type}</td>
              <td>{t.category}</td>
              <td style={{color: t.type==='expense' ? '#e63946' : '#2a9d8f'}}>${Number(t.amount).toFixed(2)}</td>
              <td>{t.description}</td>
              <td><button className="btn" onClick={()=>onDelete && onDelete(t.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
