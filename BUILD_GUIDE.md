# Binary-Net — Panduan Build APK

## Cara Menjalankan (Development)

```bash
# Di terminal, masuk ke folder project:
cd voucher-binarynet

# Start Expo dev server:
npx expo start

# Scan QR Code dengan Expo Go (install dari Play Store)
# ATAU tekan "a" untuk langsung buka di Android emulator
```

---

## Cara Build APK (untuk di-install di HP)

### Opsi 1: EAS Build (Rekomendasi — APK via Cloud Expo)

**Langkah 1: Install EAS CLI**
```bash
npm install -g eas-cli
```

**Langkah 2: Login ke akun Expo (buat gratis di https://expo.dev)**
```bash
eas login
```

**Langkah 3: Inisialisasi project EAS**
```bash
eas build:configure
```

**Langkah 4: Build APK (preview profile)**
```bash
eas build -p android --profile preview
```
> APK akan di-build di cloud Expo dan bisa di-download dari dashboard https://expo.dev/accounts

---

### Opsi 2: Local Build (Build Langsung di PC — Butuh Android Studio)

**Prasyarat:**
- Android Studio sudah terinstall
- JAVA_HOME dan ANDROID_HOME sudah di-set di environment variables

```bash
# Generate project Android native (prebuild)
npx expo prebuild --platform android

# Build APK debug lokal
cd android
.\gradlew.bat assembleDebug

# APK tersimpan di:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Struktur Folder Final

```
voucher-binarynet/
├── App.js                   # Entry point
├── app.json                 # Config Expo (nama, package, icon)
├── eas.json                 # Config EAS Build
├── src/
│   ├── components/          # (siap untuk komponen reusable)
│   ├── database/
│   │   └── db.js            # Init SQLite + seed data default
│   ├── hooks/
│   │   ├── useVouchers.js   # CRUD voucher
│   │   └── useTransactions.js # CRUD transaksi
│   ├── navigation/
│   │   └── AppNavigator.js  # Bottom tabs + Stack navigators
│   ├── screens/
│   │   ├── BerandaScreen.js
│   │   ├── RiwayatScreen.js
│   │   ├── DetailTransaksiScreen.js
│   │   ├── PengaturanScreen.js
│   │   ├── KelolaVoucherScreen.js
│   │   ├── FormVoucherScreen.js
│   │   ├── RingkasanScreen.js
│   │   ├── BackupScreen.js
│   │   ├── RestoreScreen.js
│   │   ├── ResetScreen.js
│   │   └── TentangScreen.js
│   ├── theme/
│   │   └── index.js         # Color tokens, shadows, spacing
│   └── utils/
│       └── format.js        # formatRupiah, formatTanggal, isToday
└── assets/                  # Icon, splash screen
```

---

## Catatan Penting

- Aplikasi **100% offline** — tidak butuh internet sama sekali setelah install
- Database SQLite tersimpan di internal storage HP
- File backup tersimpan di: `[DocumentDirectory]/binarynet_backup.db`
- Minimum Android versi **8.0 (API 26)**
