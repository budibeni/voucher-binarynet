import * as SQLite from 'expo-sqlite';

const DB_NAME = 'binarynet.db';

// Singleton instance — satu koneksi dibuka sekali untuk seluruh app lifecycle
let _db = null;

export const getDb = async () => {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync(DB_NAME);
    // Aktifkan WAL dan foreign keys sekali saja saat pertama buka
    await _db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);
  }
  return _db;
};

// Alias untuk backward compat dengan kode lama
export const openDb = getDb;

// Dapatkan path file database yang sebenarnya dari instance yang sudah terbuka
// db.databasePath tersedia di expo-sqlite v16+
export const getDatabasePath = async () => {
  const db = await getDb();
  return db.databasePath ?? null;
};

export const initDatabase = async () => {
  try {
    const db = await getDb();

    // Create tables if not exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        harga_beli INTEGER NOT NULL,
        harga_jual INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jenis TEXT NOT NULL,
        caption TEXT,
        grand_total INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transaction_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER NOT NULL,
        voucher_id INTEGER NOT NULL,
        nama_voucher TEXT NOT NULL,
        qty INTEGER NOT NULL,
        harga INTEGER NOT NULL,
        total INTEGER NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE
      );
    `);

    // Seed default vouchers if empty
    const row = await db.getFirstAsync('SELECT count(*) as count FROM vouchers');
    if (row && row.count === 0) {
      await db.runAsync(
        'INSERT INTO vouchers (nama, harga_beli, harga_jual) VALUES (?, ?, ?)',
        ['2 Ribu = 6 Jam', 1500, 2000]
      );
      await db.runAsync(
        'INSERT INTO vouchers (nama, harga_beli, harga_jual) VALUES (?, ?, ?)',
        ['3 Ribu = 12 Jam', 2300, 3000]
      );
      await db.runAsync(
        'INSERT INTO vouchers (nama, harga_beli, harga_jual) VALUES (?, ?, ?)',
        ['4 Ribu = 24 Jam', 3300, 4000]
      );
      await db.runAsync(
        'INSERT INTO vouchers (nama, harga_beli, harga_jual) VALUES (?, ?, ?)',
        ['40 Ribu = 1 Bulan', 36000, 40000]
      );
      console.log('Default vouchers seeded');
    }
  } catch (error) {
    console.error('Failed to init database:', error);
    throw error;
  }
};
