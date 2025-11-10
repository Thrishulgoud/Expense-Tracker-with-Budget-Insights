import React, { useEffect, useState } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import { exportCSV, exportPDF } from './utils/export';
import firebaseService from './services/firebaseService';

const demo = [
  { id: '1', type: 'income', amount: 3000, category: 'Salary', date: '2025-10-01', description: 'October salary' },
  { id: '2', type: 'expense', amount: 1200, category: 'Rent', date: '2025-10-05', description: 'Monthly rent' },
  { id: '3', type: 'expense', amount: 200, category: 'Groceries', date: '2025-10-10', description: 'Groceries' },
  { id: '4', type: 'income', amount: 250, category: 'Freelance', date: '2025-09-20', description: 'Side project' }
];

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const tx = await firebaseService.getTransactions();
        if (mounted) setTransactions(tx.length ? tx : demo);
      } catch (e) {
        console.error('Load error', e);
        if (mounted) setTransactions(demo);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  async function handleAdd(transaction) {
    const saved = await firebaseService.addTransaction(transaction);
    setTransactions(prev => [saved, ...prev]);
  }

  async function handleDelete(id) {
    await firebaseService.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  function handleExportCSV() {
    exportCSV(transactions, 'transactions.csv');
  }

  function handleExportPDF() {
    exportPDF(transactions, { title: 'Transactions Report' });
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="app">
      <div className="header">
        <h1>Expense Tracker</h1>
        <div>
          <button className="btn" onClick={handleExportCSV}>Export CSV</button>
          <button className="btn" style={{marginLeft:8}} onClick={handleExportPDF}>Export PDF</button>
        </div>
      </div>

      <div className="summary">
        <div className="card">Income<br/><strong>${totalIncome.toFixed(2)}</strong></div>
        <div className="card">Expenses<br/><strong>${totalExpense.toFixed(2)}</strong></div>
        <div className="card">Net<br/><strong>${(totalIncome - totalExpense).toFixed(2)}</strong></div>
      </div>

      <div className="row">
        <div className="column">
          <div className="form">
            <TransactionForm onAdd={handleAdd} />
          </div>
          <TransactionList transactions={transactions} onDelete={handleDelete} loading={loading} />
        </div>
        <div style={{width:420}}>
          <Dashboard transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
