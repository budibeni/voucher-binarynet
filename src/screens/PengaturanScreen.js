import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MenuItem = ({ icon, label, description, onPress, danger }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Surface style={styles.menuItem} elevation={1}>
      <View style={[styles.iconWrapper, danger && styles.iconWrapperDanger]}>
        <MaterialCommunityIcons name={icon} size={24} color={danger ? '#fff' : '#E10600'} />
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
        {description && <Text style={styles.menuDesc}>{description}</Text>}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color="#bbb" />
    </Surface>
  </TouchableOpacity>
);

export default function PengaturanScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.group}>
        <Text style={styles.groupLabel}>VOUCHER</Text>
        <MenuItem
          icon="ticket-percent"
          label="Kelola Voucher"
          description="Tambah, edit, dan hapus voucher"
          onPress={() => navigation.navigate('KelolaVoucher')}
        />
        <Divider />
        <MenuItem
          icon="chart-bar"
          label="Ringkasan"
          description="Statistik penjualan dan pembelian"
          onPress={() => navigation.navigate('Ringkasan')}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.groupLabel}>DATA</Text>
        <MenuItem
          icon="database-export"
          label="Backup Data"
          description="Ekspor database ke file lokal"
          onPress={() => navigation.navigate('Backup')}
        />
        <Divider />
        <MenuItem
          icon="database-import"
          label="Restore Data"
          description="Pulihkan database dari file backup"
          onPress={() => navigation.navigate('Restore')}
        />
        <Divider />
        <MenuItem
          icon="delete-sweep"
          label="Reset Data"
          description="Hapus semua data transaksi"
          onPress={() => navigation.navigate('Reset')}
          danger
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.groupLabel}>LAINNYA</Text>
        <MenuItem
          icon="information"
          label="Tentang Aplikasi"
          description="Versi dan informasi developer"
          onPress={() => navigation.navigate('Tentang')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 40 },
  group: { marginBottom: 20 },
  groupLabel: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 8, marginLeft: 4, letterSpacing: 1 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 2,
  },
  iconWrapper: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: '#fff1f0',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
  },
  iconWrapperDanger: { backgroundColor: '#E10600' },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  menuLabelDanger: { color: '#E10600' },
  menuDesc: { fontSize: 12, color: '#888', marginTop: 2 },
});
