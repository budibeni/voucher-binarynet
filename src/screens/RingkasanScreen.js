import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openDb } from '../database/db';
import { formatRupiah } from '../utils/format';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';

export default function RingkasanScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({
    totalJual: 0, countJual: 0,
    totalBeli: 0, countBeli: 0,
  });
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const profit = stats.totalJual - stats.totalBeli;
  const isProfit = profit >= 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Stats Cards */}
      <View style={styles.statsRow}>
        {/* Penjualan */}
        <View style={[styles.statCard, styles.statCardJual]}>
          <View style={styles.statIcon}>
            <MaterialCommunityIcons name="cash-fast" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.statLabel}>Total Penjualan</Text>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>
            {formatRupiah(stats.totalJual)}
          </Text>
          <View style={styles.statBadge}>
            <Text style={[styles.statCount, { color: COLORS.primary }]}>
              {stats.countJual} transaksi
            </Text>
          </View>
        </View>

        {/* Pembelian */}
        <View style={[styles.statCard, styles.statCardBeli]}>
          <View style={[styles.statIcon, { backgroundColor: COLORS.infoSurface }]}>
            <MaterialCommunityIcons name="cart-arrow-down" size={22} color={COLORS.info} />
          </View>
          <Text style={styles.statLabel}>Total Pembelian</Text>
          <Text style={[styles.statValue, { color: COLORS.info }]}>
            {formatRupiah(stats.totalBeli)}
          </Text>
          <View style={[styles.statBadge, { backgroundColor: COLORS.infoSurface }]}>
            <Text style={[styles.statCount, { color: COLORS.info }]}>
              {stats.countBeli} transaksi
            </Text>
          </View>
        </View>
      </View>

      {/* Total Transaksi */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={[styles.infoIcon, { backgroundColor: COLORS.surfaceMuted }]}>
            <MaterialCommunityIcons name="receipt" size={18} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.infoLabel}>Total Transaksi</Text>
          <Text style={styles.infoValue}>
            {stats.countJual + stats.countBeli} transaksi
          </Text>
        </View>
      </View>

      {/* Profit Card */}
      <View style={[
        styles.profitCard,
        isProfit ? styles.profitCardPositive : styles.profitCardNegative
      ]}>
        <View style={styles.profitHeader}>
          <MaterialCommunityIcons
            name={isProfit ? 'trending-up' : 'trending-down'}
            size={24}
            color={isProfit ? COLORS.success : COLORS.primary}
          />
          <Text style={[styles.profitTitle, { color: isProfit ? COLORS.success : COLORS.primary }]}>
            Estimasi Profit
          </Text>
        </View>

        <Text style={[styles.profitValue, { color: isProfit ? COLORS.success : COLORS.primary }]}>
          {isProfit ? '+' : ''}{formatRupiah(profit)}
        </Text>

        <Text style={styles.profitDesc}>
          {isProfit
            ? 'Total pendapatan dari selisih jual-beli'
            : 'Total pengeluaran melebihi pendapatan'}
        </Text>

        {/* Breakdown */}
        <View style={styles.profitBreakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Pendapatan (Jual)</Text>
            <Text style={[styles.breakdownValue, { color: COLORS.primary }]}>
              {formatRupiah(stats.totalJual)}
            </Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Pengeluaran (Beli)</Text>
            <Text style={[styles.breakdownValue, { color: COLORS.info }]}>
              {formatRupiah(stats.totalBeli)}
            </Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { fontWeight: '700', color: COLORS.text }]}>
              Profit Bersih
            </Text>
            <Text style={[styles.breakdownValue, { fontWeight: '800', color: isProfit ? COLORS.success : COLORS.primary }]}>
              {isProfit ? '+' : ''}{formatRupiah(profit)}
            </Text>
          </View>
        </View>
      </View>

      {/* Refresh hint */}
      <TouchableOpacity style={styles.refreshBtn} onPress={loadStats} activeOpacity={0.7}>
        <MaterialCommunityIcons name="refresh" size={16} color={COLORS.textMuted} />
        <Text style={styles.refreshText}>Perbarui data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    gap: 12,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: 8,
    ...SHADOWS.xs,
  },
  statCardJual: { borderColor: COLORS.primaryBorder },
  statCardBeli: { borderColor: '#BFDBFE' },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 4,
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
  statBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySurface,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statCount: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },

  // Info card
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Profit card
  profitCard: {
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.xl,
    gap: 12,
    ...SHADOWS.sm,
  },
  profitCardPositive: {
    backgroundColor: COLORS.successSurface,
    borderColor: '#BBF7D0',
  },
  profitCardNegative: {
    backgroundColor: COLORS.primarySurface,
    borderColor: COLORS.primaryBorder,
  },
  profitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profitTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  profitValue: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  profitDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  profitBreakdown: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: 0,
    marginTop: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  breakdownLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  breakdownValue: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
  },

  // Refresh
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: SPACING.md,
  },
  refreshText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
});
