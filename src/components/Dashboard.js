import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function aggregateMonthly(transactions) {
  // returns map YYYY-MM -> {income, expense}
  const map = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    map[key] = map[key] || { income:0, expense:0 };
    map[key][t.type] += Number(t.amount);
  });
  return map;
}

export default function Dashboard({ transactions = [] }) {
  const totals = useMemo(() => {
    const income = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0);
    const expense = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount),0);
    return { income, expense };
  }, [transactions]);

  const monthly = useMemo(() => {
    const map = aggregateMonthly(transactions);
    const keys = Object.keys(map).sort();
    return { keys, map };
  }, [transactions]);

  const pieData = {
    labels: ['Income', 'Expense'],
    datasets: [{ data: [totals.income, totals.expense], backgroundColor: ['#2a9d8f', '#e63946'] }]
  };

  const barData = {
    labels: monthly.keys,
    datasets: [
      { label: 'Income', data: monthly.keys.map(k=>monthly.map[k].income), backgroundColor: '#2a9d8f' },
      { label: 'Expense', data: monthly.keys.map(k=>monthly.map[k].expense), backgroundColor: '#e63946' }
    ]
  };

  return (
    <div>
      <h3>Analytics</h3>
      <div style={{marginBottom:12}}>
        <div style={{height:220}}>
          <Pie data={pieData} />
        </div>
      </div>
      <div>
        <h4>Monthly</h4>
        <div style={{height:260}}>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
