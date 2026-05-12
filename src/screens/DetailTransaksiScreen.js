import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Share, Alert, TouchableOpacity
} from 'react-native';
import { Text, ActivityIndicator, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTransactions } from '../hooks/useTransactions';
import { formatRupiah, formatTanggal } from '../utils/format';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';

export default function DetailTransaksiScreen({ route, navigation }) {
  const { transactionId, autoShare } = route.params;
  const { getTransactionDetails, deleteTransaction } = useTransactions();
  const insets = useSafeAreaInsets();

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
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat detail...</Text>
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={COLORS.textMuted} />
        <Text style={styles.notFoundText}>Data tidak ditemukan</Text>
      </View>
    );
  }

  const isJual = detail.jenis === 'JUAL';

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={[styles.jenisBar, isJual ? styles.jenisBarJual : styles.jenisBarBeli]} />
          <View style={styles.headerCardBody}>
            <View style={[styles.badge, isJual ? styles.badgeJual : styles.badgeBeli]}>
              <MaterialCommunityIcons
                name={isJual ? 'cash-fast' : 'cart-arrow-down'}
                size={13}
                color={COLORS.white}
                style={{ marginRight: 5 }}
              />
              <Text style={styles.badgeText}>{detail.jenis} Voucher WiFi</Text>
            </View>

            <View style={styles.headerMeta}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.tanggalText}>{formatTanggal(detail.created_at)}</Text>
            </View>

            {detail.caption ? (
              <View style={styles.captionBox}>
                <MaterialCommunityIcons name="text" size={14} color={COLORS.textSecondary} />
                <Text style={styles.captionText}>{detail.caption}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Items Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="ticket-outline" size={16} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Rincian Voucher</Text>
          </View>
          <View style={styles.dividerLine} />

          {detail.items.map((item, index) => (
            <View key={item.id}>
              <View style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemName}>{item.nama_voucher}</Text>
                  <Text style={styles.itemMeta}>
                    {item.qty} pcs × {formatRupiah(item.harga)}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>{formatRupiah(item.total)}</Text>
              </View>
              {index < detail.items.length - 1 && (
                <View style={styles.itemDivider} />
              )}
            </View>
          ))}
        </View>

        {/* Grand Total Card */}
        <View style={[styles.card, styles.grandTotalCard]}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>{formatRupiah(detail.grand_total)}</Text>
        </View>
      </ScrollView>

      {/* Sticky Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnHapus}
          onPress={handleHapus}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="delete-outline" size={20} color={COLORS.primary} />
          <Text style={styles.btnHapusText}>Hapus</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnShare}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="share-variant-outline" size={20} color={COLORS.white} />
          <Text style={styles.btnShareText}>Share Struk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    gap: 12,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
  },
  notFoundText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  // Header card
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.xs,
  },
  jenisBar: {
    height: 4,
  },
  jenisBarJual: { backgroundColor: COLORS.primary },
  jenisBarBeli: { backgroundColor: COLORS.info },
  headerCardBody: {
    padding: SPACING.lg,
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeJual: { backgroundColor: COLORS.primary },
  badgeBeli: { backgroundColor: COLORS.info },
  badgeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tanggalText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  captionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.sm,
    padding: 10,
  },
  captionText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  dividerLine: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 14,
  },

  // Item row
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemLeft: { flex: 1 },
  itemName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },
  itemMeta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  itemTotal: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.primary,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },

  // Grand total
  grandTotalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  grandTotalValue: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.md,
  },
  btnHapus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySurface,
  },
  btnHapusText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.primary,
  },
  btnShare: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  btnShareText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.white,
  },
});
