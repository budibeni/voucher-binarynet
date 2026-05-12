import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVouchers } from '../hooks/useVouchers';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';
import { formatRupiah } from '../utils/format';

export default function FormVoucherScreen({ route, navigation }) {
  const { voucher } = route.params;
  const isEdit = !!voucher;
  const { addVoucher, updateVoucher, deleteVoucher } = useVouchers();
  const insets = useSafeAreaInsets();

  const [nama, setNama] = useState(voucher?.nama || '');
  const [hargaBeli, setHargaBeli] = useState(voucher ? String(voucher.harga_beli) : '');
  const [hargaJual, setHargaJual] = useState(voucher ? String(voucher.harga_jual) : '');
  const [loading, setLoading] = useState(false);

  const parseAngka = (val) => parseInt(val.replace(/[^0-9]/g, '')) || 0;

  const beliNum = parseAngka(hargaBeli);
  const jualNum = parseAngka(hargaJual);
  const margin = jualNum - beliNum;
  const marginPct = beliNum > 0 ? ((margin / beliNum) * 100).toFixed(1) : 0;

  const validate = () => {
    if (!nama.trim()) { Alert.alert('Validasi', 'Nama voucher tidak boleh kosong'); return false; }
    if (beliNum <= 0) { Alert.alert('Validasi', 'Harga beli harus lebih dari 0'); return false; }
    if (jualNum <= 0) { Alert.alert('Validasi', 'Harga jual harus lebih dari 0'); return false; }
    return true;
  };

  const handleSimpan = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await updateVoucher(voucher.id, nama.trim(), beliNum, jualNum);
      } else {
        await addVoucher(nama.trim(), beliNum, jualNum);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Gagal menyimpan voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = () => {
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
              navigation.goBack();
            } catch (e) {
              Alert.alert('Error', 'Gagal menghapus voucher');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informasi Voucher</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nama Voucher</Text>
            <TextInput
              value={nama}
              onChangeText={setNama}
              mode="outlined"
              placeholder="Contoh: 2 Ribu = 6 Jam"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="ticket-outline" color={COLORS.textMuted} size={18} />}
            />
          </View>

          <View style={styles.priceRow}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Harga Beli (Rp)</Text>
              <TextInput
                value={hargaBeli}
                onChangeText={setHargaBeli}
                keyboardType="numeric"
                mode="outlined"
                placeholder="0"
                style={styles.input}
                outlineStyle={styles.inputOutline}
                left={<TextInput.Icon icon="cart-arrow-down" color={COLORS.info} size={18} />}
              />
            </View>

            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Harga Jual (Rp)</Text>
              <TextInput
                value={hargaJual}
                onChangeText={setHargaJual}
                keyboardType="numeric"
                mode="outlined"
                placeholder="0"
                style={styles.input}
                outlineStyle={styles.inputOutline}
                left={<TextInput.Icon icon="cash-fast" color={COLORS.primary} size={18} />}
              />
            </View>
          </View>

          {/* Margin Preview */}
          {beliNum > 0 && jualNum > 0 && (
            <View style={[styles.marginBox, margin >= 0 ? styles.marginBoxPositive : styles.marginBoxNegative]}>
              <MaterialCommunityIcons
                name={margin >= 0 ? 'trending-up' : 'trending-down'}
                size={18}
                color={margin >= 0 ? COLORS.success : COLORS.primary}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.marginLabel, { color: margin >= 0 ? COLORS.success : COLORS.primary }]}>
                  Margin: {formatRupiah(margin)} ({margin >= 0 ? '+' : ''}{marginPct}%)
                </Text>
                <Text style={styles.marginSub}>
                  Per voucher yang terjual
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        {isEdit && (
          <TouchableOpacity
            style={styles.btnHapus}
            onPress={handleHapus}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="delete-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.btnSimpan, loading && styles.btnDisabled]}
          onPress={handleSimpan}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <MaterialCommunityIcons name="loading" size={20} color={COLORS.white} />
          ) : (
            <MaterialCommunityIcons name="content-save-outline" size={20} color={COLORS.white} />
          )}
          <Text style={styles.btnSimpanText}>
            {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Voucher'}
          </Text>
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
    gap: 16,
    paddingTop: SPACING.xl,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    gap: 16,
    ...SHADOWS.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },

  // Fields
  field: { gap: 6 },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: COLORS.white,
    fontSize: FONT_SIZE.base,
  },
  inputOutline: {
    borderRadius: BORDER_RADIUS.md,
    borderColor: COLORS.border,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },

  // Margin box
  marginBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  marginBoxPositive: {
    backgroundColor: COLORS.successSurface,
    borderColor: '#BBF7D0',
  },
  marginBoxNegative: {
    backgroundColor: COLORS.primarySurface,
    borderColor: COLORS.primaryBorder,
  },
  marginLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
  },
  marginSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.md,
  },
  btnHapus: {
    width: 50,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSimpan: {
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
  btnDisabled: {
    opacity: 0.6,
  },
  btnSimpanText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.white,
  },
});
