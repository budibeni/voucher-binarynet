import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TentangScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.card} elevation={2}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="wifi" size={52} color="#fff" />
          </View>
          <Text style={styles.appName}>Binary-Net</Text>
          <Text style={styles.appTagline}>Penjualan Voucher WiFi</Text>
        </View>

        <Divider style={{ marginVertical: 20 }} />

        <View style={styles.infoGroup}>
          <InfoRow icon="tag" label="Versi" value="1.0.0" />
          <InfoRow icon="cellphone" label="Platform" value="Android 8+" />
          <InfoRow icon="database" label="Database" value="SQLite (Offline)" />
          <InfoRow icon="wifi-off" label="Koneksi" value="Tidak perlu internet" />
        </View>

        <Divider style={{ marginVertical: 20 }} />

        <View style={styles.featureList}>
          <Text style={styles.featureTitle}>Fitur Utama</Text>
          <Feature text="Transaksi BELI & JUAL voucher" />
          <Feature text="Riwayat transaksi lengkap" />
          <Feature text="Share struk via WhatsApp, dll." />
          <Feature text="Kelola voucher dengan mudah" />
          <Feature text="Backup & restore database lokal" />
          <Feature text="Ringkasan statistik penjualan" />
        </View>
      </Surface>
    </ScrollView>
  );
}

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#E10600" style={{ marginRight: 12 }} />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const Feature = ({ text }) => (
  <View style={styles.featureRow}>
    <MaterialCommunityIcons name="check-circle" size={18} color="#E10600" style={{ marginRight: 10 }} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 24, backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center' },
  logoCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#E10600',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14, elevation: 4,
  },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#E10600', letterSpacing: 1 },
  appTagline: { fontSize: 14, color: 'gray', marginTop: 4 },
  infoGroup: { gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoLabel: { flex: 1, fontSize: 14, color: '#555' },
  infoValue: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  featureList: {},
  featureTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureText: { fontSize: 14, color: '#444' },
});
