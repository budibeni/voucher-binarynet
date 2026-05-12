import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';

const MenuItem = ({ icon, label, description, onPress, danger, iconColor }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
    <View style={[styles.menuItem, danger && styles.menuItemDanger]}>
      <View style={[styles.iconWrapper, danger ? styles.iconWrapperDanger : { backgroundColor: COLORS.primarySurface }]}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={danger ? COLORS.primary : (iconColor || COLORS.primary)}
        />
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
        {description && <Text style={styles.menuDesc}>{description}</Text>}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textMuted} />
    </View>
  </TouchableOpacity>
);

export default function PengaturanScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Voucher Group */}
      <View style={styles.group}>
        <Text style={styles.groupLabel}>VOUCHER</Text>
        <View style={styles.groupCard}>
          <MenuItem
            icon="ticket-percent-outline"
            label="Kelola Voucher"
            description="Tambah, edit, dan hapus voucher"
            onPress={() => navigation.navigate('KelolaVoucher')}
          />
          <View style={styles.separator} />
          <MenuItem
            icon="chart-bar"
            label="Ringkasan"
            description="Statistik penjualan dan pembelian"
            onPress={() => navigation.navigate('Ringkasan')}
            iconColor={COLORS.navy}
          />
        </View>
      </View>

      {/* Data Group */}
      <View style={styles.group}>
        <Text style={styles.groupLabel}>DATA</Text>
        <View style={styles.groupCard}>
          <MenuItem
            icon="database-export-outline"
            label="Backup Data"
            description="Ekspor database ke file lokal"
            onPress={() => navigation.navigate('Backup')}
            iconColor={COLORS.success}
          />
          <View style={styles.separator} />
          <MenuItem
            icon="database-import-outline"
            label="Restore Data"
            description="Pulihkan database dari file backup"
            onPress={() => navigation.navigate('Restore')}
            iconColor={COLORS.info}
          />
          <View style={styles.separator} />
          <MenuItem
            icon="delete-sweep-outline"
            label="Reset Data"
            description="Hapus semua data transaksi"
            onPress={() => navigation.navigate('Reset')}
            danger
          />
        </View>
      </View>

      {/* Lainnya Group */}
      <View style={styles.group}>
        <Text style={styles.groupLabel}>LAINNYA</Text>
        <View style={styles.groupCard}>
          <MenuItem
            icon="information-outline"
            label="Tentang Aplikasi"
            description="Versi dan informasi developer"
            onPress={() => navigation.navigate('Tentang')}
            iconColor={COLORS.textSecondary}
          />
        </View>
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
  },
  group: {
    marginBottom: SPACING.xl,
  },
  groupLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1.2,
  },
  groupCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.xs,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 60,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
  },
  menuItemDanger: {},
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconWrapperDanger: {
    backgroundColor: COLORS.primarySurface,
  },
  menuText: { flex: 1 },
  menuLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  menuLabelDanger: {
    color: COLORS.primary,
  },
  menuDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
});
