import React, { useEffect, useCallback } from 'react';
import {
  View, FlatList, StyleSheet, TouchableOpacity, Share, RefreshControl
} from 'react-native';
import { Text, Chip, IconButton, Surface } from 'react-native-paper';
import { useTransactions } from '../hooks/useTransactions';
import { formatRupiah, formatTanggal, isToday } from '../utils/format';
import { useFocusEffect } from '@react-navigation/native';

export default function RiwayatScreen({ navigation }) {
  const { transactions, loading, loadTransactions, getTransactionDetails } = useTransactions();

  const [filterJenis, setFilterJenis] = React.useState('SEMUA');
  const [filterTanggal, setFilterTanggal] = React.useState('SEMUA');

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const filteredTransactions = transactions.filter(tx => {
    const jenisOk = filterJenis === 'SEMUA' || tx.jenis === filterJenis;
    const tanggalOk = filterTanggal === 'SEMUA' || isToday(tx.created_at);
    return jenisOk && tanggalOk;
  });

  const handleShare = async (tx) => {
    try {
      const detail = await getTransactionDetails(tx.id);
      let text = `Binary-Net\n\n${tx.jenis} Voucher WiFi\n\n`;
      detail.items.forEach(item => {
        text += `${item.nama_voucher}\nQty : ${item.qty}\nTotal : ${formatRupiah(item.total)}\n\n`;
      });
      text += `Grand Total : ${formatRupiah(tx.grand_total)}\n\n`;
      if (tx.caption) text += `Caption:\n${tx.caption}\n\n`;
      text += `Tanggal:\n${formatTanggal(tx.created_at)}`;
      await Share.share({ message: text });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const renderItem = ({ item: tx }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetailTransaksi', { transactionId: tx.id })}
      activeOpacity={0.85}
    >
      <Surface style={styles.card} elevation={2}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, tx.jenis === 'JUAL' ? styles.badgeJual : styles.badgeBeli]}>
            <Text style={styles.badgeText}>{tx.jenis}</Text>
          </View>
          <Text style={styles.cardDate}>{formatTanggal(tx.created_at)}</Text>
          <IconButton
            icon="share-variant"
            size={20}
            iconColor="#E10600"
            onPress={() => navigation.navigate('DetailTransaksi', { transactionId: tx.id, autoShare: true })}
            style={{ margin: 0 }}
          />
        </View>

        {tx.caption ? (
          <Text style={styles.cardCaption} numberOfLines={1}>{tx.caption}</Text>
        ) : null}

        <View style={styles.cardFooter}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>{formatRupiah(tx.grand_total)}</Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter Jenis */}
      <View style={styles.filterRow}>
        {['SEMUA', 'BELI', 'JUAL'].map(f => (
          <Chip
            key={f}
            selected={filterJenis === f}
            onPress={() => setFilterJenis(f)}
            selectedColor="#E10600"
            style={[styles.chip, filterJenis === f && styles.chipActive]}
            textStyle={filterJenis === f ? styles.chipTextActive : styles.chipText}
          >
            {f}
          </Chip>
        ))}

        <View style={styles.divider} />

        {/* Filter Tanggal */}
        {['SEMUA', 'HARI INI'].map(f => (
          <Chip
            key={f}
            selected={filterTanggal === f}
            onPress={() => setFilterTanggal(f)}
            selectedColor="#E10600"
            style={[styles.chip, filterTanggal === f && styles.chipActive]}
            textStyle={filterTanggal === f ? styles.chipTextActive : styles.chipText}
          >
            {f}
          </Chip>
        ))}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTransactions} colors={['#E10600']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada transaksi</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  chip: { backgroundColor: '#f0f0f0' },
  chipActive: { backgroundColor: '#E10600' },
  chipText: { color: '#555' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  divider: { width: 1, height: 24, backgroundColor: '#ddd', marginHorizontal: 2 },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginRight: 8,
  },
  badgeJual: { backgroundColor: '#E10600' },
  badgeBeli: { backgroundColor: '#1565C0' },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  cardDate: { flex: 1, fontSize: 12, color: 'gray' },
  cardCaption: { fontSize: 13, color: '#555', marginBottom: 8, fontStyle: 'italic' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 4,
  },
  grandTotalLabel: { fontSize: 14, color: 'gray' },
  grandTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#E10600' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: 'gray' },
});
