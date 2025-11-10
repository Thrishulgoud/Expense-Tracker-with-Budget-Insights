import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function TransactionForm({ onAdd }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [description, setDescription] = useState('');

  function reset() {
    setType('expense'); setAmount(''); setCategory(''); setDate(new Date().toISOString().slice(0,10)); setDescription('');
  }

  function submit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return alert('Please enter a positive amount');
    const tx = {
      id: uuidv4(),
      type,
      amount: Number(amount),
      category,
      date,
      description
    };
    onAdd(tx);
    reset();
  }

  return (
    <form onSubmit={submit}>
      <div style={{display:'flex', gap:8}}>
        <select className="input" value={type} onChange={e=>setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} type="number" step="0.01" />
      </div>
      <input className="input" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
      <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
      <input className="input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <button className="btn" type="submit">Add Transaction</button>
    </form>
  );
}
