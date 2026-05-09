import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useVouchers } from '../hooks/useVouchers';

export default function FormVoucherScreen({ route, navigation }) {
  const { voucher } = route.params; // null = tambah baru, object = edit
  const isEdit = !!voucher;

  const { addVoucher, updateVoucher, deleteVoucher } = useVouchers();

  const [nama, setNama] = useState(voucher?.nama || '');
  const [hargaBeli, setHargaBeli] = useState(voucher ? String(voucher.harga_beli) : '');
  const [hargaJual, setHargaJual] = useState(voucher ? String(voucher.harga_jual) : '');
  const [loading, setLoading] = useState(false);

  const parseAngka = (val) => parseInt(val.replace(/[^0-9]/g, '')) || 0;

  const validate = () => {
    if (!nama.trim()) { Alert.alert('Validasi', 'Nama voucher tidak boleh kosong'); return false; }
    if (parseAngka(hargaBeli) <= 0) { Alert.alert('Validasi', 'Harga beli harus lebih dari 0'); return false; }
    if (parseAngka(hargaJual) <= 0) { Alert.alert('Validasi', 'Harga jual harus lebih dari 0'); return false; }
    return true;
  };

  const handleSimpan = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await updateVoucher(voucher.id, nama.trim(), parseAngka(hargaBeli), parseAngka(hargaJual));
      } else {
        await addVoucher(nama.trim(), parseAngka(hargaBeli), parseAngka(hargaJual));
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextInput
        label="Nama Voucher"
        value={nama}
        onChangeText={setNama}
        mode="outlined"
        style={styles.input}
        placeholder="Contoh: 2 Ribu = 6 Jam"
      />
      <TextInput
        label="Harga Beli (Rp)"
        value={hargaBeli}
        onChangeText={setHargaBeli}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        placeholder="Contoh: 1500"
      />
      <TextInput
        label="Harga Jual (Rp)"
        value={hargaJual}
        onChangeText={setHargaJual}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        placeholder="Contoh: 2000"
      />

      <Button
        mode="contained"
        onPress={handleSimpan}
        loading={loading}
        disabled={loading}
        style={styles.btnSimpan}
        contentStyle={{ paddingVertical: 6 }}
      >
        {isEdit ? 'Simpan Perubahan' : 'Tambah Voucher'}
      </Button>

      {isEdit && (
        <Button
          mode="outlined"
          icon="delete"
          onPress={handleHapus}
          style={styles.btnHapus}
          textColor="#E10600"
          contentStyle={{ paddingVertical: 6 }}
        >
          Hapus Voucher
        </Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingBottom: 40 },
  input: { marginBottom: 16, backgroundColor: '#fff' },
  btnSimpan: { marginTop: 8, marginBottom: 12, backgroundColor: '#E10600' },
  btnHapus: { borderColor: '#E10600' },
});
