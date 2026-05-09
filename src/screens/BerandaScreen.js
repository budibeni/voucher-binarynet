import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import { Text, TextInput, Button, Card, Checkbox, IconButton, useTheme, Portal, Modal } from 'react-native-paper';
import { useVouchers } from '../hooks/useVouchers';
import { useTransactions } from '../hooks/useTransactions';
import { formatRupiah } from '../utils/format';

export default function BerandaScreen({ navigation }) {
  const theme = useTheme();
  const { vouchers, loadVouchers } = useVouchers();
  const { saveTransaction } = useTransactions();

  const [mode, setMode] = useState('JUAL'); // 'BELI' | 'JUAL'
  const [items, setItems] = useState({}); // { [id]: { active: boolean, qty: number } }
  const [caption, setCaption] = useState('');

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [lastTransactionText, setLastTransactionText] = useState('');

  useEffect(() => {
    loadVouchers();
  }, []);

  // Initialize items state when vouchers change
  useEffect(() => {
    const newItems = { ...items };
    let hasChanges = false;
    vouchers.forEach(v => {
      if (!newItems[v.id]) {
        newItems[v.id] = { active: false, qty: 1 };
        hasChanges = true;
      }
    });
    if (hasChanges) setItems(newItems);
  }, [vouchers]);

  const toggleItem = (id) => {
    setItems(prev => ({
      ...prev,
      [id]: { ...prev[id], active: !prev[id].active }
    }));
  };

  const updateQty = (id, text) => {
    const qty = parseInt(text.replace(/[^0-9]/g, '')) || 0;
    setItems(prev => ({
      ...prev,
      [id]: { ...prev[id], qty: qty }
    }));
  };

  const incrementQty = (id) => {
    setItems(prev => ({
      ...prev,
      [id]: { ...prev[id], qty: (prev[id]?.qty || 0) + 1 }
    }));
  };

  const decrementQty = (id) => {
    setItems(prev => {
      const current = prev[id]?.qty || 0;
      return {
        ...prev,
        [id]: { ...prev[id], qty: current > 1 ? current - 1 : 1 }
      };
    });
  };

  const grandTotal = useMemo(() => {
    return vouchers.reduce((total, v) => {
      const item = items[v.id];
      if (item && item.active) {
        const harga = mode === 'JUAL' ? v.harga_jual : v.harga_beli;
        return total + (harga * item.qty);
      }
      return total;
    }, 0);
  }, [vouchers, items, mode]);

  const generateShareText = (txMode, activeItemsData, gTotal, cap, dateStr) => {
    let text = `Binary-Net\n\n${txMode} Voucher WiFi\n\n`;
    activeItemsData.forEach(item => {
      text += `${item.nama_voucher}\nQty : ${item.qty}\nTotal : ${formatRupiah(item.total)}\n\n`;
    });
    text += `Grand Total : ${formatRupiah(gTotal)}\n\n`;
    if (cap) {
      text += `Caption:\n${cap}\n\n`;
    }
    text += `Tanggal:\n${dateStr}`;
    return text;
  };

  const getActiveItemsData = () => {
    const activeItemsData = [];
    vouchers.forEach(v => {
      const item = items[v.id];
      if (item && item.active && item.qty > 0) {
        const harga = mode === 'JUAL' ? v.harga_jual : v.harga_beli;
        activeItemsData.push({
          voucher_id: v.id,
          nama_voucher: v.nama,
          qty: item.qty,
          harga: harga,
          total: harga * item.qty
        });
      }
    });
    return activeItemsData;
  };

  const handleSimpan = async () => {
    const activeItemsData = getActiveItemsData();
    if (activeItemsData.length === 0) {
      Alert.alert('Validasi', 'Pilih minimal 1 voucher dengan kuantitas lebih dari 0.');
      return;
    }

    try {
      await saveTransaction(mode, caption, grandTotal, activeItemsData);

      const dateOptions = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      const dateStr = new Date().toLocaleDateString('id-ID', dateOptions).replace(/\./g, ':');
      const shareTxt = generateShareText(mode, activeItemsData, grandTotal, caption, dateStr);
      setLastTransactionText(shareTxt);

      setCaption('');
      setItems({});
      loadVouchers();
      setSuccessModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan transaksi');
    }
  };

  const handleShareForm = async () => {
    const activeItemsData = getActiveItemsData();
    if (activeItemsData.length === 0) {
      Alert.alert('Validasi', 'Pilih minimal 1 voucher untuk dibagikan.');
      return;
    }

    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateStr = new Date().toLocaleDateString('id-ID', dateOptions).replace(/\./g, ':');
    const shareTxt = generateShareText(mode, activeItemsData, grandTotal, caption, dateStr);

    try {
      await Share.share({ message: shareTxt });
    } catch (error) {
      console.log('Share error', error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>BINARY-NET</Text>
          <Text style={styles.headerSubtitle}>Penjualan Voucher WiFi</Text>
        </View>
        <IconButton icon="cog" size={28} onPress={() => navigation.navigate('Pengaturan')} />
      </View>

      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, mode === 'BELI' ? styles.segmentActive : styles.segmentInactive]}
          onPress={() => setMode('BELI')}
        >
          <Text style={[styles.segmentText, mode === 'BELI' ? styles.segmentTextActive : styles.segmentTextInactive]}>BELI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, mode === 'JUAL' ? styles.segmentActive : styles.segmentInactive]}
          onPress={() => setMode('JUAL')}
        >
          <Text style={[styles.segmentText, mode === 'JUAL' ? styles.segmentTextActive : styles.segmentTextInactive]}>JUAL</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer}>
        {vouchers.map(v => {
          const item = items[v.id] || { active: false, qty: 1 };
          const harga = mode === 'JUAL' ? v.harga_jual : v.harga_beli;
          const totalItem = harga * item.qty;

          return (
            <Card key={v.id} style={[styles.card, item.active && styles.cardActive]} onPress={() => toggleItem(v.id)}>
              <View style={styles.cardRow}>
                <Checkbox
                  status={item.active ? 'checked' : 'unchecked'}
                  onPress={() => toggleItem(v.id)}
                  color={theme.colors.primary}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.voucherName}>{v.nama}</Text>
                  <Text style={styles.voucherPrice}>@{formatRupiah(harga)}</Text>
                </View>

                {item.active && (
                  <View style={styles.qtyContainer}>
                    <IconButton icon="minus-circle-outline" size={20} onPress={() => decrementQty(v.id)} />
                    <TextInput
                      value={String(item.qty)}
                      onChangeText={(val) => updateQty(v.id, val)}
                      keyboardType="numeric"
                      style={styles.qtyInput}
                      dense
                    />
                    <IconButton icon="plus-circle-outline" size={20} onPress={() => incrementQty(v.id)} />
                  </View>
                )}
              </View>
              {item.active && (
                <View style={styles.itemTotalContainer}>
                  <Text style={styles.itemTotalText}>Subtotal: {formatRupiah(totalItem)}</Text>
                </View>
              )}
            </Card>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.grandTotalContainer}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>{formatRupiah(grandTotal)}</Text>
        </View>

        <TextInput
          label="Caption (Opsional)"
          value={caption}
          onChangeText={setCaption}
          mode="outlined"
          style={styles.captionInput}
          dense
        />

        <View style={styles.actionButtons}>
          <Button mode="contained" onPress={handleSimpan} style={styles.btnSimpan}>
            SIMPAN
          </Button>
          <Button mode="outlined" onPress={handleShareForm} style={styles.btnShare}>
            SHARE
          </Button>
        </View>
      </View>

      <Portal>
        <Modal
          visible={successModalVisible}
          onDismiss={() => setSuccessModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Transaksi Berhasil!</Text>
          <Text style={styles.modalText}>Data transaksi telah tersimpan di sistem.</Text>
          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={() => setSuccessModalVisible(false)} style={{ flex: 1, marginRight: 8 }}>
              TUTUP
            </Button>
            <Button
              mode="contained"
              icon="share-variant"
              onPress={() => {
                Share.share({ message: lastTransactionText });
                setSuccessModalVisible(false);
              }}
              style={{ flex: 1, marginLeft: 8 }}
            >
              SHARE
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#E10600' },
  headerSubtitle: { fontSize: 14, color: 'gray' },
  segmentContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    backgroundColor: '#fff'
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentActive: { backgroundColor: '#E10600' },
  segmentInactive: { backgroundColor: '#fff' },
  segmentText: { fontWeight: 'bold', fontSize: 16 },
  segmentTextActive: { color: '#fff' },
  segmentTextInactive: { color: 'gray' },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  card: { marginBottom: 12, backgroundColor: '#fff' },
  cardActive: { borderColor: '#E10600', borderWidth: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  cardInfo: { flex: 1, marginLeft: 8 },
  voucherName: { fontSize: 16, fontWeight: 'bold' },
  voucherPrice: { fontSize: 14, color: 'gray' },
  qtyContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyInput: { width: 45, textAlign: 'center', backgroundColor: 'transparent' },
  itemTotalContainer: { borderTopWidth: 1, borderTopColor: '#eee', padding: 8, alignItems: 'flex-end' },
  itemTotalText: { fontWeight: 'bold', color: '#E10600' },
  footer: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, elevation: 10 },
  grandTotalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  grandTotalLabel: { fontSize: 18, fontWeight: 'bold' },
  grandTotalValue: { fontSize: 24, fontWeight: 'bold', color: '#E10600' },
  captionInput: { marginBottom: 16 },
  actionButtons: { flexDirection: 'row', gap: 12 },
  btnSimpan: { flex: 2, paddingVertical: 4 },
  btnShare: { flex: 1, paddingVertical: 4 },
  modalContainer: { backgroundColor: 'white', padding: 24, margin: 20, borderRadius: 12, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#E10600', marginBottom: 12 },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 24 },
  modalActions: { flexDirection: 'row', width: '100%' }
});
