import { useState, useCallback } from 'react';
import { openDb } from '../database/db';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const db = await openDb();
      const result = await db.getAllAsync('SELECT * FROM transactions ORDER BY created_at DESC');
      setTransactions(result);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTransaction = async (jenis, caption, grand_total, items) => {
    try {
      const db = await openDb();
      const createdAt = new Date().toISOString();
      
      await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
          'INSERT INTO transactions (jenis, caption, grand_total, created_at) VALUES (?, ?, ?, ?)',
          [jenis, caption, grand_total, createdAt]
        );
        const transactionId = result.lastInsertRowId;

        for (const item of items) {
          if (item.qty > 0) {
            await db.runAsync(
              'INSERT INTO transaction_items (transaction_id, voucher_id, nama_voucher, qty, harga, total) VALUES (?, ?, ?, ?, ?, ?)',
              [transactionId, item.voucher_id, item.nama_voucher, item.qty, item.harga, item.total]
            );
          }
        }
      });
      await loadTransactions();
      return true;
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  };

  const getTransactionDetails = async (transactionId) => {
    try {
      const db = await openDb();
      const tx = await db.getFirstAsync('SELECT * FROM transactions WHERE id = ?', [transactionId]);
      const items = await db.getAllAsync('SELECT * FROM transaction_items WHERE transaction_id = ?', [transactionId]);
      return { ...tx, items };
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const db = await openDb();
      await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
      await loadTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  return { transactions, loading, loadTransactions, saveTransaction, getTransactionDetails, deleteTransaction };
};
