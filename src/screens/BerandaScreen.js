import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, ScrollView, StyleSheet, TouchableOpacity, Alert, Share,
  StatusBar, Platform, KeyboardAvoidingView,
} from 'react-native';
import {
  Text, TextInput, Button, Checkbox, IconButton, Portal, Modal,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useVouchers } from '../hooks/useVouchers';
import { useTransactions } from '../hooks/useTransactions';
import { formatRupiah } from '../utils/format';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';

export default function BerandaScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { vouchers, loadVouchers } = useVouchers();
  const { saveTransaction } = useTransactions();

  const [mode, setMode] = useState('JUAL');
  const [items, setItems] = useState({});
  const [caption, setCaption] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [lastTransactionText, setLastTransactionText] = useState('');
  const [saving, setSaving] = useState(false);

  // Reload vouchers setiap kali tab Beranda difokus
  // (termasuk saat kembali dari Kelola Voucher)
  useFocusEffect(
    useCallback(() => {
      loadVouchers();
    }, [])
  );

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
    setItems(prev => ({ ...prev, [id]: { ...prev[id], qty } }));
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
      return { ...prev, [id]: { ...prev[id], qty: current > 1 ? current - 1 : 1 } };
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

  const selectedCount = useMemo(() => {
    return vouchers.filter(v => items[v.id]?.active).length;
  }, [vouchers, items]);

  const generateShareText = (txMode, activeItemsData, gTotal, cap, dateStr) => {
    let text = `Binary-Net\n\n${txMode} Voucher WiFi\n\n`;
    activeItemsData.forEach(item => {
      text += `${item.nama_voucher}\nQty : ${item.qty}\nTotal : ${formatRupiah(item.total)}\n\n`;
    });
    text += `Grand Total : ${formatRupiah(gTotal)}\n\n`;
    if (cap) text += `Caption:\n${cap}\n\n`;
    text += `Tanggal:\n${dateStr}`;
    return text;
  };

  const getActiveItemsData = () => {
    const data = [];
    vouchers.forEach(v => {
      const item = items[v.id];
      if (item && item.active && item.qty > 0) {
        const harga = mode === 'JUAL' ? v.harga_jual : v.harga_beli;
        data.push({
          voucher_id: v.id,
          nama_voucher: v.nama,
          qty: item.qty,
          harga,
          total: harga * item.qty,
        });
      }
    });
    return data;
  };

  const handleSimpan = async () => {
    const activeItemsData = getActiveItemsData();
    if (activeItemsData.length === 0) {
      Alert.alert('Perhatian', 'Pilih minimal 1 voucher dengan kuantitas lebih dari 0.');
      return;
    }
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const handleShareForm = async () => {
    const activeItemsData = getActiveItemsData();
    if (activeItemsData.length === 0) {
      Alert.alert('Perhatian', 'Pilih minimal 1 voucher untuk dibagikan.');
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoMark}>
            <MaterialCommunityIcons name="wifi" size={16} color={COLORS.white} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>BINARY-NET</Text>
            <Text style={styles.headerSubtitle}>Penjualan Voucher WiFi</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => navigation.navigate('Pengaturan')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="cog-outline" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Mode Selector */}
      <View style={styles.selectorWrapper}>
        <View style={styles.selector}>
          {['BELI', 'JUAL'].map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.selectorBtn, mode === m && styles.selectorBtnActive]}
              onPress={() => setMode(m)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={m === 'BELI' ? 'cart-arrow-down' : 'cash-fast'}
                size={16}
                color={mode === m ? COLORS.white : COLORS.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.selectorText, mode === m && styles.selectorTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedCount > 0 && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>{selectedCount} dipilih</Text>
          </View>
        )}
      </View>

      {/* Voucher List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {vouchers.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="ticket-outline" size={40} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Belum ada voucher</Text>
            <Text style={styles.emptyDesc}>Tambahkan voucher terlebih dahulu di menu Pengaturan</Text>
          </View>
        ) : (
          vouchers.map(v => {
            const item = items[v.id] || { active: false, qty: 1 };
            const harga = mode === 'JUAL' ? v.harga_jual : v.harga_beli;
            const totalItem = harga * item.qty;

            return (
              <TouchableOpacity
                key={v.id}
                style={[styles.card, item.active && styles.cardActive]}
                onPress={() => toggleItem(v.id)}
                activeOpacity={0.85}
              >
                {/* Left indicator */}
                {item.active && <View style={styles.cardIndicator} />}

                <View style={styles.cardInner}>
                  {/* Checkbox + Info */}
                  <View style={styles.cardTop}>
                    <View style={[styles.checkbox, item.active && styles.checkboxActive]}>
                      {item.active && (
                        <MaterialCommunityIcons name="check" size={14} color={COLORS.white} />
                      )}
                    </View>

                    <View style={styles.cardInfo}>
                      <Text style={[styles.voucherName, item.active && styles.voucherNameActive]}>
                        {v.nama}
                      </Text>
                      <Text style={styles.voucherPrice}>
                        @ {formatRupiah(harga)}
                      </Text>
                    </View>

                    {/* Qty Controls */}
                    {item.active ? (
                      <View style={styles.qtyWrapper}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => decrementQty(v.id)}
                          activeOpacity={0.7}
                        >
                          <MaterialCommunityIcons name="minus" size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TextInput
                          value={String(item.qty)}
                          onChangeText={(val) => updateQty(v.id, val)}
                          keyboardType="numeric"
                          style={styles.qtyInput}
                          underlineColor="transparent"
                          activeUnderlineColor="transparent"
                          dense
                        />
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => incrementQty(v.id)}
                          activeOpacity={0.7}
                        >
                          <MaterialCommunityIcons name="plus" size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.qtyPlaceholder}>
                        <Text style={styles.tapHint}>Tap</Text>
                      </View>
                    )}
                  </View>

                  {/* Subtotal */}
                  {item.active && (
                    <View style={styles.subtotalRow}>
                      <Text style={styles.subtotalLabel}>
                        {item.qty} × {formatRupiah(harga)}
                      </Text>
                      <Text style={styles.subtotalValue}>{formatRupiah(totalItem)}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: 20 }]}>
        {/* Grand Total */}
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Grand Total</Text>
            {selectedCount > 0 && (
              <Text style={styles.totalSub}>{selectedCount} jenis voucher</Text>
            )}
          </View>
          <Text style={styles.totalValue}>{formatRupiah(grandTotal)}</Text>
        </View>

        {/* Caption */}
        <TextInput
          label="Catatan (opsional)"
          value={caption}
          onChangeText={setCaption}
          mode="outlined"
          style={styles.captionInput}
          outlineStyle={styles.captionOutline}
          dense
          left={<TextInput.Icon icon="text" color={COLORS.textMuted} size={18} />}
        />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.btnShare]}
            onPress={handleShareForm}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="share-variant-outline" size={20} color={COLORS.primary} />
            <Text style={styles.btnShareText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnSimpan, saving && styles.btnDisabled]}
            onPress={handleSimpan}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <MaterialCommunityIcons name="loading" size={20} color={COLORS.white} />
            ) : (
              <MaterialCommunityIcons name="content-save-outline" size={20} color={COLORS.white} />
            )}
            <Text style={styles.btnSimpanText}>{saving ? 'Menyimpan...' : 'Simpan'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Modal */}
      <Portal>
        <Modal
          visible={successModalVisible}
          onDismiss={() => setSuccessModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalIconWrap}>
            <MaterialCommunityIcons name="check-circle" size={52} color={COLORS.success} />
          </View>
          <Text style={styles.modalTitle}>Transaksi Berhasil!</Text>
          <Text style={styles.modalText}>Data telah tersimpan di sistem.</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalBtnOutline}
              onPress={() => setSuccessModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalBtnOutlineText}>Tutup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtnPrimary}
              onPress={() => {
                Share.share({ message: lastTransactionText });
                setSuccessModalVisible(false);
              }}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="share-variant" size={18} color={COLORS.white} style={{ marginRight: 6 }} />
              <Text style={styles.modalBtnPrimaryText}>Share</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {},
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Mode Selector
  selectorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  selector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.lg,
    padding: 3,
    flex: 1,
  },
  selectorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: BORDER_RADIUS.md,
  },
  selectorBtnActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  selectorText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  selectorTextActive: {
    color: COLORS.white,
  },
  selectedBadge: {
    backgroundColor: COLORS.primarySurface,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  selectedBadgeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Scroll
  scrollView: { flex: 1 },
  listContent: {
    padding: SPACING.lg,
    gap: 10,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.xs,
  },
  cardActive: {
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  cardIndicator: {
    height: 3,
    backgroundColor: COLORS.primary,
  },
  cardInner: {
    padding: SPACING.lg,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  cardInfo: { flex: 1 },
  voucherName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  voucherNameActive: {
    color: COLORS.primary,
  },
  voucherPrice: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  // Qty
  qtyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyInput: {
    width: 38,
    height: 34,
    textAlign: 'center',
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    backgroundColor: 'transparent',
    color: COLORS.text,
    paddingHorizontal: 0,
  },
  qtyPlaceholder: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.sm,
  },
  tapHint: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  // Subtotal
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  subtotalLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  subtotalValue: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
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
    paddingHorizontal: 32,
    lineHeight: 18,
  },

  // Footer
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  totalValue: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  captionInput: {
    backgroundColor: COLORS.white,
    marginBottom: 10,
    fontSize: FONT_SIZE.base,
  },
  captionOutline: {
    borderRadius: BORDER_RADIUS.md,
    borderColor: COLORS.border,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnShare: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySurface,
  },
  btnShareText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.primary,
  },
  btnSimpan: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnSimpanText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  // Modal
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 28,
    marginHorizontal: 24,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  modalIconWrap: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalBtnOutline: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnOutlineText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  modalBtnPrimaryText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.white,
  },
});
