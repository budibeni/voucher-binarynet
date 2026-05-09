# Binary-Net Mobile App Agent Prompt

## Project Overview

Buat aplikasi Android native sederhana bernama **Binary-Net** untuk transaksi voucher WiFi hotspot.

Aplikasi HARUS:
- Bisa diinstall di HP Android
- Menghasilkan APK Android
- Berjalan full offline
- Menyimpan data di internal storage HP
- Tanpa server
- Tanpa internet
- Tanpa login

---

# Technology Stack

Gunakan teknologi berikut:

- React Native
- Expo SDK terbaru
- SQLite local database
- Expo SQLite
- Expo Sharing
- Expo FileSystem
- React Navigation
- React Native Paper atau NativeWind
- AsyncStorage untuk konfigurasi kecil

Target:
- Android smartphone
- Android 8+
- Responsive semua ukuran layar HP

---

# Design System

Desain:
- Modern minimalis
- Clean UI
- Tema merah dan putih
- Ringan
- Cepat
- Mudah dipakai operator voucher

Style:
- Dominan merah (#E10600)
- Background putih
- Rounded card
- Shadow lembut
- Icon outline
- Spacing lega
- Typography modern
- Native Android feel

---

# Main Features

Aplikasi hanya memiliki 3 menu utama:
- Beranda
- Riwayat
- Pengaturan

Gunakan bottom navigation.

---

# HALAMAN BERANDA

## Header
- Binary-Net
- Subtitle: “Penjualan Voucher WiFi”
- Icon pengaturan

---

## Mode Transaksi
Gunakan segmented tab:
- BELI
- JUAL

Tab aktif:
- Background merah
- Text putih

Tab nonaktif:
- Putih
- Border abu

---

# DATA VOUCHER DEFAULT

Saat aplikasi pertama kali install:
- Otomatis insert data voucher default ke SQLite
- Hanya insert jika tabel voucher masih kosong

## Data Default

### 1
Nama Voucher:
2 Ribu = 6 Jam

Harga Beli:
1500

Harga Jual:
2000

---

### 2
Nama Voucher:
3 Ribu = 12 Jam

Harga Beli:
2300

Harga Jual:
3000

---

### 3
Nama Voucher:
4 Ribu = 24 Jam

Harga Beli:
3300

Harga Jual:
4000

---

### 4
Nama Voucher:
40 Ribu = 1 Bulan

Harga Beli:
36000

Harga Jual:
40000

---

Gunakan format Rupiah:
- 1500 → Rp 1.500
- 40000 → Rp 40.000

Urutkan voucher berdasarkan harga jual ascending.

---

# LIST TRANSAKSI

Tampilkan voucher dalam bentuk card list sederhana.

Setiap item:
- Checkbox aktif/nonaktif
- Nama voucher
- Qty input
- Total otomatis

Rumus:
total_item = qty × harga

Jika mode:
- BELI → gunakan harga_beli
- JUAL → gunakan harga_jual

Grand total tampil besar di bawah.

Di bawah grand total:
- Input caption optional
- Tombol SIMPAN
- Tombol SHARE

---

# FITUR SHARE

Saat tombol share ditekan:
- Generate text transaksi otomatis
- Buka native Android share intent

Gunakan:
- Expo Sharing API

## Contoh Share Text

Binary-Net

JUAL Voucher WiFi

2 Ribu = 6 Jam
Qty : 2
Total : Rp 4.000

3 Ribu = 12 Jam
Qty : 1
Total : Rp 3.000

Grand Total : Rp 7.000

Caption:
Penjualan voucher hotspot binary-net

Tanggal:
09 Mei 2026 10:30

---

# FITUR SIMPAN

Saat tombol simpan:
- Validasi qty
- Simpan transaksi ke SQLite
- Simpan detail item
- Reset form
- Tampilkan popup sukses

Popup sukses:
- Tombol tutup
- Tombol share

---

# HALAMAN RIWAYAT

List transaksi dalam bentuk card.

## Filter
- Semua
- BELI
- JUAL

## Filter Tanggal
- Hari Ini
- Semua

## Card Transaksi
- Badge BELI/JUAL
- Nama voucher
- Qty
- Total
- Tanggal
- Tombol share kecil

Klik card:
- Buka halaman detail transaksi

---

# HALAMAN DETAIL TRANSAKSI

Tampilkan:
- Jenis transaksi
- List voucher
- Qty
- Harga
- Total
- Caption
- Tanggal transaksi

Tombol:
- SHARE
- HAPUS

---

# HALAMAN PENGATURAN

Menu:
- Kelola Voucher
- Ringkasan
- Backup Data
- Restore Data
- Reset Data
- Tentang Aplikasi

---

# KELOLA VOUCHER

List voucher:
- Nama voucher
- Harga beli
- Harga jual
- Tombol edit
- Tombol hapus

FAB:
- Tambah voucher

---

# TAMBAH / EDIT VOUCHER

Field:
- Nama voucher
- Harga beli
- Harga jual

Tombol:
- Simpan
- Hapus voucher

---

# BACKUP DATA

Export SQLite database ke file lokal.

Gunakan:
- Expo FileSystem
- Document picker

Fitur:
- Backup sekarang
- Tampilkan tanggal backup
- Tampilkan ukuran file

---

# RESTORE DATA

Pilih file backup lalu restore database SQLite.

Tampilkan warning sebelum restore.

---

# DATABASE SQLITE

## TABLE vouchers

- id
- nama
- harga_beli
- harga_jual

---

## TABLE transactions

- id
- jenis
- caption
- grand_total
- created_at

---

## TABLE transaction_items

- id
- transaction_id
- voucher_id
- nama_voucher
- qty
- harga
- total

---

# VALIDASI

- Qty tidak boleh minus
- Qty 0 tidak disimpan
- Konfirmasi sebelum hapus
- Konfirmasi sebelum reset data

---

# PROJECT STRUCTURE

Gunakan struktur project modular:

```txt
src/
 ├── components
 ├── screens
 ├── database
 ├── services
 ├── hooks
 ├── utils
 ├── navigation
 └── theme