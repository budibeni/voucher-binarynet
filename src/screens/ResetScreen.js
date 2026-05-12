import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openDb } from '../database/db';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';

export default function ResetScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [konfirmasi, setKonfirmasi] = useState('');
  const [loading, setLoading] = useState(false);

  const KATA_KUNCI = 'RESET';
  const isValid = konfirmasi === KATA_KUNCI;

  const handleReset = async () => {
    if (!isValid) {
      Alert.alert('Validasi', `Ketik kata "${KATA_KUNCI}" untuk mengkonfirmasi.`);
      return;
    }

    Alert.alert(
      '⚠️ Konfirmasi Akhir',
      'SEMUA DATA transaksi akan dihapus permanen. Voucher default akan dikembalikan. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset Sekarang', style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const db = await openDb();
              await db.execAsync(`
                DELETE FROM transaction_items;
                DELETE FROM transactions;
              `);
              Alert.alert('Selesai', 'Semua data transaksi berhasil dihapus.', [
                { text: 'OK', onPress: () => navigation.popToTop() }
              ]);
            } catch (e) {
              console.error('Reset error:', e);
              Alert.alert('Error', 'Gagal mereset data');
            } finally {
              setLoading(false);
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
        {/* Icon Header */}
        <View style={styles.iconSection}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="delete-sweep-outline" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.pageTitle}>Reset Data</Text>
          <Text style={styles.pageDesc}>
            Fitur ini akan menghapus SEMUA data transaksi secara permanen. Data voucher tidak akan terhapus.
          </Text>
        </View>

        {/* Danger Warning */}
        <View style={styles.dangerCard}>
          <MaterialCommunityIcons name="alert-circle" size={20} color={COLORS.primary} />
          <Text style={styles.dangerText}>
            Tindakan ini tidak dapat dibatalkan! Pastikan Anda sudah melakukan backup data terlebih dahulu.
          </Text>
        </View>

        {/* What will be deleted */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Yang akan dihapus:</Text>
          {[
            'Seluruh riwayat transaksi JUAL',
            'Seluruh riwayat transaksi BELI',
            'Semua item transaksi terkait',
          ].map((item, i) => (
            <View key={i} style={styles.deleteItem}>
              <MaterialCommunityIcons name="close-circle-outline" size={16} color={COLORS.primary} />
              <Text style={styles.deleteItemText}>{item}</Text>
            </View>
          ))}
          <View style={styles.keepItem}>
            <MaterialCommunityIcons name="check-circle-outline" size={16} color={COLORS.success} />
            <Text style={styles.keepItemText}>Data voucher tetap tersimpan</Text>
          </View>
        </View>

        {/* Confirmation Input */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Konfirmasi Reset</Text>
          <Text style={styles.konfirmasiLabel}>
            Ketik{' '}
            <Text style={{ fontWeight: '800', color: COLORS.primary }}>
              {KATA_KUNCI}
            </Text>
            {' '}untuk melanjutkan
          </Text>
          <TextInput
            value={konfirmasi}
            onChangeText={setKonfirmasi}
            mode="outlined"
            placeholder={KATA_KUNCI}
            style={[styles.input, isValid && styles.inputValid]}
            outlineStyle={[
              styles.inputOutline,
              isValid && styles.inputOutlineValid,
            ]}
            autoCapitalize="characters"
            right={isValid
              ? <TextInput.Icon icon="check-circle" color={COLORS.success} />
              : null
            }
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.btnReset, (!isValid || loading) && styles.btnDisabled]}
          onPress={handleReset}
          disabled={!isValid || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <MaterialCommunityIcons name="delete-forever" size={22} color={COLORS.white} />
          )}
          <Text style={styles.btnText}>
            {loading ? 'Menghapus...' : 'Reset Semua Data'}
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
    paddingTop: SPACING.xl,
    gap: 16,
  },

  // Icon header
  iconSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: 12,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryBorder,
    ...SHADOWS.sm,
  },
  pageTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  pageDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  // Danger card
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.primarySurface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    padding: SPACING.lg,
  },
  dangerText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: 18,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: 12,
    ...SHADOWS.xs,
  },
  cardTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },

  // Delete items list
  deleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteItemText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
  },
  keepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  keepItemText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.success,
    fontWeight: '600',
  },

  // Input
  konfirmasiLabel: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  input: {
    backgroundColor: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    letterSpacing: 2,
  },
  inputOutline: {
    borderRadius: BORDER_RADIUS.md,
    borderColor: COLORS.border,
  },
  inputValid: {},
  inputOutlineValid: {
    borderColor: COLORS.success,
  },

  // Footer
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.md,
  },
  btnReset: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.white,
  },
});
