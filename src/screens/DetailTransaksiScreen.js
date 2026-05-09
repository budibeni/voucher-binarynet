import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Share, Alert
} from 'react-native';
import { Text, Button, Divider, Surface, ActivityIndicator } from 'react-native-paper';
import { useTransactions } from '../hooks/useTransactions';
import { formatRupiah, formatTanggal } from '../utils/format';

export default function DetailTransaksiScreen({ route, navigation }) {
  const { transactionId, autoShare } = route.params;
  const { getTransactionDetails, deleteTransaction } = useTransactions();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [transactionId]);

  useEffect(() => {
    if (autoShare && detail) {
      handleShare();
    }
  }, [detail]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await getTransactionDetails(transactionId);
      setDetail(data);
    } catch (error) {
      console.error('Error loading detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildShareText = () => {
    if (!detail) return '';
    let text = `Binary-Net\n\n${detail.jenis} Voucher WiFi\n\n`;
    detail.items.forEach(item => {
      text += `${item.nama_voucher}\nQty : ${item.qty}\nTotal : ${formatRupiah(item.total)}\n\n`;
    });
    text += `Grand Total : ${formatRupiah(detail.grand_total)}\n\n`;
    if (detail.caption) text += `Caption:\n${detail.caption}\n\n`;
    text += `Tanggal:\n${formatTanggal(detail.created_at)}`;
    return text;
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: buildShareText() });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const handleHapus = () => {
    Alert.alert(
      'Hapus Transaksi',
      'Yakin ingin menghapus transaksi ini? Data tidak bisa dikembalikan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus transaksi');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E10600" />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Data tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <Surface style={styles.headerCard} elevation={2}>
        <View style={[styles.badge, detail.jenis === 'JUAL' ? styles.badgeJual : styles.badgeBeli]}>
          <Text style={styles.badgeText}>{detail.jenis} Voucher WiFi</Text>
        </View>
        <Text style={styles.tanggalText}>{formatTanggal(detail.created_at)}</Text>
        {detail.caption ? (
          <Text style={styles.captionText}>📝 {detail.caption}</Text>
        ) : null}
      </Surface>

      {/* Item List */}
      <Surface style={styles.itemsCard} elevation={2}>
        <Text style={styles.sectionTitle}>Rincian Voucher</Text>
        <Divider style={{ marginBottom: 12 }} />
        {detail.items.map((item, index) => (
          <View key={item.id}>
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.nama_voucher}</Text>
                <Text style={styles.itemMeta}>
                  {item.qty} × {formatRupiah(item.harga)}
                </Text>
              </View>
              <Text style={styles.itemTotal}>{formatRupiah(item.total)}</Text>
            </View>
            {index < detail.items.length - 1 && <Divider style={{ marginVertical: 8 }} />}
          </View>
        ))}
      </Surface>

      {/* Grand Total */}
      <Surface style={styles.grandTotalCard} elevation={2}>
        <Text style={styles.grandTotalLabel}>Grand Total</Text>
        <Text style={styles.grandTotalValue}>{formatRupiah(detail.grand_total)}</Text>
      </Surface>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          icon="share-variant"
          onPress={handleShare}
          style={[styles.btn, { flex: 2, backgroundColor: '#E10600' }]}
          labelStyle={{ color: '#fff' }}
        >
          SHARE
        </Button>
        <Button
          mode="outlined"
          icon="delete"
          onPress={handleHapus}
          style={[styles.btn, { flex: 1, borderColor: '#E10600' }]}
          textColor="#E10600"
        >
          HAPUS
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeJual: { backgroundColor: '#E10600' },
  badgeBeli: { backgroundColor: '#1565C0' },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  tanggalText: { fontSize: 13, color: 'gray', marginBottom: 4 },
  captionText: { fontSize: 14, color: '#333', marginTop: 6, fontStyle: 'italic' },
  itemsCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemName: { fontSize: 15, fontWeight: 'bold' },
  itemMeta: { fontSize: 13, color: 'gray', marginTop: 2 },
  itemTotal: { fontSize: 15, fontWeight: 'bold', color: '#E10600' },
  grandTotalCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  grandTotalValue: { fontSize: 24, fontWeight: 'bold', color: '#E10600' },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { paddingVertical: 4 },
});
