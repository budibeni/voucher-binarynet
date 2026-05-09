import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Surface, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { openDb } from '../database/db';

export default function ResetScreen({ navigation }) {
  const [konfirmasi, setKonfirmasi] = useState('');
  const [loading, setLoading] = useState(false);

  const KATA_KUNCI = 'RESET';

  const handleReset = async () => {
    if (konfirmasi !== KATA_KUNCI) {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Surface style={styles.card} elevation={2}>
        <MaterialCommunityIcons name="delete-sweep" size={56} color="#E10600" style={styles.icon} />
        <Text style={styles.title}>Reset Data</Text>
        <Text style={styles.desc}>
          Fitur ini akan menghapus SEMUA data transaksi secara permanen. Data voucher tidak akan terhapus.
        </Text>

        <View style={styles.warningBox}>
          <MaterialCommunityIcons name="alert-circle" size={18} color="#E10600" style={{ marginRight: 8 }} />
          <Text style={styles.warningText}>Tindakan ini tidak dapat dibatalkan!</Text>
        </View>

        <View style={styles.konfirmasiBox}>
          <Text style={styles.konfirmasiLabel}>
            Ketik <Text style={{ fontWeight: 'bold', color: '#E10600' }}>{KATA_KUNCI}</Text> untuk melanjutkan
          </Text>
          <TextInput
            value={konfirmasi}
            onChangeText={setKonfirmasi}
            mode="outlined"
            placeholder={KATA_KUNCI}
            style={styles.input}
            autoCapitalize="characters"
          />
        </View>

        <Button
          mode="contained"
          icon="delete-forever"
          onPress={handleReset}
          loading={loading}
          disabled={loading || konfirmasi !== KATA_KUNCI}
          style={[styles.btnReset, konfirmasi !== KATA_KUNCI && { opacity: 0.5 }]}
          contentStyle={{ paddingVertical: 6 }}
        >
          Reset Semua Data
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 24, backgroundColor: '#fff', alignItems: 'center' },
  icon: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#E10600' },
  desc: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  warningBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFEBEE', borderRadius: 10, padding: 12,
    marginBottom: 20, width: '100%',
  },
  warningText: { flex: 1, fontSize: 13, color: '#E10600', fontWeight: 'bold' },
  konfirmasiBox: { width: '100%', marginBottom: 20 },
  konfirmasiLabel: { fontSize: 14, color: '#555', marginBottom: 8 },
  input: { backgroundColor: '#fff' },
  btnReset: { width: '100%', backgroundColor: '#E10600' },
});
