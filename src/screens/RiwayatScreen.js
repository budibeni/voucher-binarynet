import React, { useCallback } from 'react';
import {
  View, FlatList, StyleSheet, TouchableOpacity, Share, RefreshControl
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTransactions } from '../hooks/useTransactions';
import { formatRupiah, formatTanggal, isToday } from '../utils/format';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';

const FilterChip = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

export default function RiwayatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
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
      <View style={styles.card}>
        {/* Colored top bar */}
        <View style={[styles.cardBar, tx.jenis === 'JUAL' ? styles.cardBarJual : styles.cardBarBeli]} />

        <View style={styles.cardBody}>
          {/* Header row */}
          <View style={styles.cardHeader}>
            <View style={[styles.badge, tx.jenis === 'JUAL' ? styles.badgeJual : styles.badgeBeli]}>
              <MaterialCommunityIcons
                name={tx.jenis === 'JUAL' ? 'cash-fast' : 'cart-arrow-down'}
                size={12}
                color={COLORS.white}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.badgeText}>{tx.jenis}</Text>
            </View>

            <View style={styles.cardDateWrap}>
              <MaterialCommunityIcons name="clock-outline" size={12} color={COLORS.textMuted} style={{ marginRight: 4 }} />
              <Text style={styles.cardDate}>{formatTanggal(tx.created_at)}</Text>
            </View>

            <TouchableOpacity
              style={styles.shareBtn}
              onPress={() => navigation.navigate('DetailTransaksi', { transactionId: tx.id, autoShare: true })}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="share-variant-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Caption */}
          {tx.caption ? (
            <View style={styles.captionRow}>
              <MaterialCommunityIcons name="text" size={13} color={COLORS.textMuted} style={{ marginRight: 6 }} />
              <Text style={styles.cardCaption} numberOfLines={1}>{tx.caption}</Text>
            </View>
          ) : null}

          {/* Footer */}
          <View style={styles.cardFooter}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{formatRupiah(tx.grand_total)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter bar */}
      <View style={styles.filterBar}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupLabel}>JENIS</Text>
          <View style={styles.filterChips}>
            {['SEMUA', 'BELI', 'JUAL'].map(f => (
              <FilterChip
                key={f}
                label={f}
                active={filterJenis === f}
                onPress={() => setFilterJenis(f)}
              />
            ))}
          </View>
        </View>

        <View style={styles.filterDivider} />

        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupLabel}>TANGGAL</Text>
          <View style={styles.filterChips}>
            {['SEMUA', 'HARI INI'].map(f => (
              <FilterChip
                key={f}
                label={f}
                active={filterTanggal === f}
                onPress={() => setFilterTanggal(f)}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Count info */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>
          {filteredTransactions.length} transaksi
        </Text>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 32 }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadTransactions}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="history" size={40} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
            <Text style={styles.emptyDesc}>
              {filterJenis !== 'SEMUA' || filterTanggal !== 'SEMUA'
                ? 'Coba ubah filter di atas'
                : 'Transaksi akan muncul di sini'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Filter bar
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  filterGroup: {
    flex: 1,
  },
  filterGroupLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 6,
  },
  filterDivider: {
    width: 1,
    height: 44,
    backgroundColor: COLORS.border,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },

  // Count bar
  countBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
  },
  countText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  // List
  list: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
    gap: 10,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.xs,
  },
  cardBar: {
    height: 3,
  },
  cardBarJual: { backgroundColor: COLORS.primary },
  cardBarBeli: { backgroundColor: COLORS.info },
  cardBody: {
    padding: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeJual: { backgroundColor: COLORS.primary },
  badgeBeli: { backgroundColor: COLORS.info },
  badgeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZE.xs,
  },
  cardDateWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  shareBtn: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cardCaption: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  grandTotalLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  grandTotalValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.primary,
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
