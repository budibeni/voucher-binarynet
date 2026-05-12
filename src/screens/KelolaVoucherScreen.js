import React, { useCallback } from 'react';
import {
  View, FlatList, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVouchers } from '../hooks/useVouchers';
import { formatRupiah } from '../utils/format';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';

export default function KelolaVoucherScreen({ navigation }) {
  const { vouchers, loadVouchers, deleteVoucher } = useVouchers();
  const insets = useSafeAreaInsets();

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

  const renderItem = ({ item }) => {
    const margin = item.harga_jual - item.harga_beli;
    const marginPct = item.harga_beli > 0
      ? ((margin / item.harga_beli) * 100).toFixed(0)
      : 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.cardIconWrap}>
            <MaterialCommunityIcons name="ticket-percent-outline" size={20} color={COLORS.primary} />
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.voucherName}>{item.nama}</Text>

          <View style={styles.priceRow}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Harga Beli</Text>
              <Text style={styles.priceBeli}>{formatRupiah(item.harga_beli)}</Text>
            </View>

            <View style={styles.priceDivider} />

            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Harga Jual</Text>
              <Text style={styles.priceJual}>{formatRupiah(item.harga_jual)}</Text>
            </View>

            <View style={styles.priceDivider} />

            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Margin</Text>
              <Text style={[styles.priceMargin, { color: margin >= 0 ? COLORS.success : COLORS.primary }]}>
                +{marginPct}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('FormVoucher', { voucher: item })}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="pencil-outline" size={18} color={COLORS.info} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnDanger]}
            onPress={() => handleDelete(item)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="delete-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={vouchers}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={
          vouchers.length > 0 ? (
            <Text style={styles.listHeader}>{vouchers.length} voucher terdaftar</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="ticket-outline" size={40} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Belum ada voucher</Text>
            <Text style={styles.emptyDesc}>Tap tombol + untuk menambah voucher baru</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        color={COLORS.white}
        onPress={() => navigation.navigate('FormVoucher', { voucher: null })}
        label="Tambah"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  listHeader: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: SPACING.md,
  },

  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.xs,
  },
  cardLeft: {},
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  cardBody: {
    flex: 1,
  },
  voucherName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceItem: {},
  priceDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  priceLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  priceBeli: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.info,
  },
  priceJual: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  priceMargin: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },

  // Actions
  cardActions: {
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.infoSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDanger: {
    backgroundColor: COLORS.primarySurface,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: COLORS.primary,
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
