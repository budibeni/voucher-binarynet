import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { openDb } from '../database/db';
import { formatRupiah } from '../utils/format';

export default function RingkasanScreen() {
  const [stats, setStats] = useState({
    totalJual: 0, countJual: 0,
    totalBeli: 0, countBeli: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const db = await openDb();
      const jual = await db.getFirstAsync(
        `SELECT COUNT(*) as count, SUM(grand_total) as total FROM transactions WHERE jenis='JUAL'`
      );
      const beli = await db.getFirstAsync(
        `SELECT COUNT(*) as count, SUM(grand_total) as total FROM transactions WHERE jenis='BELI'`
      );
      setStats({
        totalJual: jual?.total || 0,
        countJual: jual?.count || 0,
        totalBeli: beli?.total || 0,
        countBeli: beli?.count || 0,
      });
    } catch (e) {
      console.error('Stats error:', e);
    }
  };

  const profit = stats.totalJual - stats.totalBeli;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.card} elevation={2}>
        <Text style={styles.sectionTitle}>Ringkasan Transaksi</Text>
        <Divider style={{ marginBottom: 16 }} />

        <View style={styles.statRow}>
          <View style={[styles.statBox, { backgroundColor: '#fff1f0' }]}>
            <MaterialCommunityIcons name="arrow-up-circle" size={28} color="#E10600" />
            <Text style={styles.statLabel}>Total Penjualan</Text>
            <Text style={[styles.statValue, { color: '#E10600' }]}>{formatRupiah(stats.totalJual)}</Text>
            <Text style={styles.statCount}>{stats.countJual} transaksi</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#e3f2fd' }]}>
            <MaterialCommunityIcons name="arrow-down-circle" size={28} color="#1565C0" />
            <Text style={styles.statLabel}>Total Pembelian</Text>
            <Text style={[styles.statValue, { color: '#1565C0' }]}>{formatRupiah(stats.totalBeli)}</Text>
            <Text style={styles.statCount}>{stats.countBeli} transaksi</Text>
          </View>
        </View>

        <View style={[styles.profitBox, { backgroundColor: profit >= 0 ? '#E8F5E9' : '#FFEBEE' }]}>
          <MaterialCommunityIcons
            name={profit >= 0 ? 'trending-up' : 'trending-down'}
            size={28}
            color={profit >= 0 ? '#388E3C' : '#E10600'}
          />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.profitLabel}>Estimasi Profit</Text>
            <Text style={[styles.profitValue, { color: profit >= 0 ? '#388E3C' : '#E10600' }]}>
              {profit >= 0 ? '+' : ''}{formatRupiah(profit)}
            </Text>
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 20, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  statRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statBox: {
    flex: 1, borderRadius: 12, padding: 14, alignItems: 'center',
  },
  statLabel: { fontSize: 12, color: '#888', marginTop: 6, textAlign: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4, textAlign: 'center' },
  statCount: { fontSize: 11, color: '#aaa', marginTop: 2 },
  profitBox: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, padding: 16,
  },
  profitLabel: { fontSize: 13, color: '#666' },
  profitValue: { fontSize: 22, fontWeight: 'bold', marginTop: 2 },
});
