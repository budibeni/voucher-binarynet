import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <MaterialCommunityIcons name={icon} size={18} color={COLORS.primary} />
    </View>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const Feature = ({ text }) => (
  <View style={styles.featureRow}>
    <View style={styles.featureCheck}>
      <MaterialCommunityIcons name="check" size={13} color={COLORS.white} />
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

export default function TentangScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* App Identity */}
      <View style={styles.heroCard}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="wifi" size={44} color={COLORS.white} />
        </View>
        <Text style={styles.appName}>Binary-Net</Text>
        <Text style={styles.appTagline}>Penjualan Voucher WiFi</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="information-outline" size={16} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Informasi Aplikasi</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoList}>
          <InfoRow icon="cellphone" label="Platform" value="Android 8+" />
          <View style={styles.rowDivider} />
          <InfoRow icon="database-outline" label="Database" value="SQLite (Offline)" />
          <View style={styles.rowDivider} />
          <InfoRow icon="wifi-off" label="Koneksi" value="Tidak perlu internet" />
          <View style={styles.rowDivider} />
          <InfoRow icon="shield-check-outline" label="Data" value="Tersimpan lokal" />
        </View>
      </View>

      {/* Features */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="star-outline" size={16} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Fitur Utama</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.featureList}>
          <Feature text="Transaksi BELI & JUAL voucher" />
          <Feature text="Riwayat transaksi lengkap" />
          <Feature text="Share struk via WhatsApp, dll." />
          <Feature text="Kelola voucher dengan mudah" />
          <Feature text="Backup & restore database lokal" />
          <Feature text="Ringkasan statistik penjualan" />
        </View>
      </View>

      {/* Footer Credit */}
      <View style={styles.creditBox}>
        <MaterialCommunityIcons name="heart" size={14} color={COLORS.primary} />
        <Text style={styles.creditText}>Dibuat untuk kemudahan operasional lapangan</Text>
      </View>
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
    gap: 16,
  },

  // Hero
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xxl,
    alignItems: 'center',
    gap: 10,
    ...SHADOWS.sm,
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    ...SHADOWS.md,
  },
  appName: {
    fontSize: FONT_SIZE.display,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  versionBadge: {
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: COLORS.primarySurface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  versionText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  // Info list
  infoList: {
    padding: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    gap: 12,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 46,
  },

  // Feature list
  featureList: {
    padding: SPACING.lg,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    flex: 1,
  },

  // Credit
  creditBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.md,
  },
  creditText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
});
