import React, { useEffect, useState } from 'react';
import {
  View, FlatList, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { Text, FAB, Surface, Divider, IconButton } from 'react-native-paper';
import { useVouchers } from '../hooks/useVouchers';
import { formatRupiah } from '../utils/format';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function KelolaVoucherScreen({ navigation }) {
  const { vouchers, loadVouchers, deleteVoucher } = useVouchers();

  useFocusEffect(
    useCallback(() => {
      loadVouchers();
    }, [])
  );

  const handleDelete = (voucher) => {
    Alert.alert(
      'Hapus Voucher',
      `Yakin hapus voucher "${voucher.nama}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus', style: 'destructive',
          onPress: async () => {
            try {
              await deleteVoucher(voucher.id);
            } catch (e) {
              Alert.alert('Error', 'Gagal menghapus voucher');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.voucherName}>{item.nama}</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Harga Beli</Text>
              <Text style={styles.priceBeli}>{formatRupiah(item.harga_beli)}</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Harga Jual</Text>
              <Text style={styles.priceJual}>{formatRupiah(item.harga_jual)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            iconColor="#1565C0"
            onPress={() => navigation.navigate('FormVoucher', { voucher: item })}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor="#E10600"
            onPress={() => handleDelete(item)}
          />
        </View>
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={vouchers}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada voucher</Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={() => navigation.navigate('FormVoucher', { voucher: null })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16, paddingBottom: 100 },
  card: { borderRadius: 12, backgroundColor: '#fff', padding: 14 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  voucherName: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  priceRow: { flexDirection: 'row', gap: 20 },
  priceItem: {},
  priceLabel: { fontSize: 11, color: '#aaa', marginBottom: 2 },
  priceBeli: { fontSize: 14, fontWeight: 'bold', color: '#1565C0' },
  priceJual: { fontSize: 14, fontWeight: 'bold', color: '#E10600' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  fab: {
    position: 'absolute', bottom: 24, right: 20,
    backgroundColor: '#E10600',
  },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: 'gray' },
});
