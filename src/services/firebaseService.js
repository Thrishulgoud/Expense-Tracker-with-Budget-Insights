import { firebaseConfig } from '../firebaseConfig';

// Service provides getTransactions, addTransaction, deleteTransaction
// If firebaseConfig has an apiKey, this tries to use Firestore (modular). Otherwise falls back to localStorage.

let useFirestore = !!(firebaseConfig && firebaseConfig.apiKey);
let db = null;
let transactionsCollection = null;

async function initFirestore() {
  if (!useFirestore) return;
  try {
    const { initializeApp } = await import('firebase/app');
    const { getFirestore, collection } = await import('firebase/firestore');
    initializeApp(firebaseConfig);
    db = getFirestore();
    transactionsCollection = collection(db, 'transactions');
  } catch (e) {
    console.warn('Failed to initialize Firestore, falling back to localStorage', e);
    useFirestore = false;
  }
}

function readLocal() {
  try {
    const raw = localStorage.getItem('transactions');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return [] }
}

function writeLocal(arr) {
  localStorage.setItem('transactions', JSON.stringify(arr));
}

const service = {
  async getTransactions() {
    if (useFirestore && !db) await initFirestore();
    if (useFirestore && db) {
      const { getDocs, query, orderBy } = await import('firebase/firestore');
      const q = query(transactionsCollection, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    // local fallback
    return readLocal();
  },
  async addTransaction(tx) {
    if (useFirestore && !db) await initFirestore();
    if (useFirestore && db) {
      const { addDoc } = await import('firebase/firestore');
      const docRef = await addDoc(transactionsCollection, tx);
      return { id: docRef.id, ...tx };
    }
    const arr = readLocal();
    arr.unshift(tx);
    writeLocal(arr);
    return tx;
  },
  async deleteTransaction(id) {
    if (useFirestore && !db) await initFirestore();
    if (useFirestore && db) {
      const { deleteDoc, doc } = await import('firebase/firestore');
      const d = doc(db, 'transactions', id);
      await deleteDoc(d);
      return;
    }
    const arr = readLocal().filter(t => t.id !== id);
    writeLocal(arr);
  }
};

export default service;
