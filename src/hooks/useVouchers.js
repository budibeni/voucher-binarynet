import { useState, useCallback } from 'react';
import { getDb } from '../database/db';

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const db = await getDb();
      const result = await db.getAllAsync('SELECT * FROM vouchers ORDER BY harga_jual ASC');
      setVouchers(result);
    } catch (error) {
      console.error('Error loading vouchers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addVoucher = async (nama, harga_beli, harga_jual) => {
    try {
      const db = await getDb();
      await db.runAsync(
        'INSERT INTO vouchers (nama, harga_beli, harga_jual) VALUES (?, ?, ?)',
        [nama, harga_beli, harga_jual]
      );
      await loadVouchers();
    } catch (error) {
      console.error('Error adding voucher:', error);
      throw error;
    }
  };

  const updateVoucher = async (id, nama, harga_beli, harga_jual) => {
    try {
      const db = await getDb();
      await db.runAsync(
        'UPDATE vouchers SET nama = ?, harga_beli = ?, harga_jual = ? WHERE id = ?',
        [nama, harga_beli, harga_jual, id]
      );
      await loadVouchers();
    } catch (error) {
      console.error('Error updating voucher:', error);
      throw error;
    }
  };

  const deleteVoucher = async (id) => {
    try {
      const db = await getDb();
      await db.runAsync('DELETE FROM vouchers WHERE id = ?', [id]);
      await loadVouchers();
    } catch (error) {
      console.error('Error deleting voucher:', error);
      throw error;
    }
  };

  return { vouchers, loading, loadVouchers, addVoucher, updateVoucher, deleteVoucher };
};
