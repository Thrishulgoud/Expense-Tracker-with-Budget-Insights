import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

export function exportCSV(transactions, filename = 'transactions.csv') {
  if (!transactions || transactions.length === 0) {
    alert('No transactions to export');
    return;
  }
  const header = ['id','date','type','category','amount','description'];
  const rows = transactions.map(t => [t.id, t.date, t.type, t.category, Number(t.amount).toFixed(2), (t.description||'')]);
  const csv = [header.join(','), ...rows.map(r => r.map(c => '"'+String(c).replace(/"/g,'""')+'"').join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

export function exportPDF(transactions, opts = {}) {
  if (!transactions || transactions.length === 0) {
    alert('No transactions to export');
    return;
  }
  const doc = new jsPDF();
  const title = opts.title || 'Transactions';
  doc.setFontSize(14);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  const startY = 30;
  const rowHeight = 7;
  const pageHeight = doc.internal.pageSize.height;
  let y = startY;
  doc.text(['Date', 'Type', 'Category', 'Amount', 'Description'], 14, y);
  y += rowHeight;
  transactions.forEach((t, i) => {
    if (y + rowHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
    const line = `${new Date(t.date).toLocaleDateString()}  ${t.type}  ${t.category}  $${Number(t.amount).toFixed(2)}  ${t.description||''}`;
    doc.text(line, 14, y);
    y += rowHeight;
  });
  doc.save((opts.filename) || 'transactions.pdf');
}
