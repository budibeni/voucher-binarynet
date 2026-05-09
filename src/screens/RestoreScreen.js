import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DB_DEST = `${FileSystem.documentDirectory}SQLite/binarynet.db`;

export default function RestoreScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal membuka file picker');
    }
  };

  const handleRestore = () => {
    if (!selectedFile) {
      Alert.alert('Pilih File', 'Silakan pilih file backup terlebih dahulu.');
      return;
    }

    Alert.alert(
      '⚠️ Peringatan',
      'Restore data akan mengganti SELURUH data yang ada saat ini. Proses ini tidak dapat dibatalkan. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Restore',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // Pastikan folder SQLite ada
              const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
              const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
              if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
              }

              await FileSystem.copyAsync({
                from: selectedFile.uri,
                to: DB_DEST,
              });

              Alert.alert(
                'Restore Berhasil',
                'Data berhasil dipulihkan. Restart aplikasi agar perubahan berlaku sepenuhnya.',
                [{ text: 'OK', onPress: () => navigation.popToTop() }]
              );
            } catch (error) {
              console.error('Restore error:', error);
              Alert.alert('Error', 'Gagal melakukan restore data');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.card} elevation={2}>
        <MaterialCommunityIcons name="database-import" size={48} color="#1565C0" style={styles.icon} />
        <Text style={styles.title}>Restore Data</Text>
        <Text style={styles.desc}>
          Pilih file backup (.db) dari penyimpanan Anda untuk memulihkan data. Semua data yang ada saat ini akan diganti.
        </Text>

        <View style={styles.warningBox}>
          <MaterialCommunityIcons name="alert" size={18} color="#F57F17" style={{ marginRight: 8 }} />
          <Text style={styles.warningText}>Proses restore tidak dapat dibatalkan setelah dikonfirmasi.</Text>
        </View>

        <Button
          mode="outlined"
          icon="folder-open"
          onPress={pickFile}
          style={styles.btnPilih}
          contentStyle={{ paddingVertical: 6 }}
        >
          Pilih File Backup
        </Button>

        {selectedFile && (
          <View style={styles.fileInfo}>
            <MaterialCommunityIcons name="file-check" size={20} color="#388E3C" />
            <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
          </View>
        )}

        <Button
          mode="contained"
          icon="database-import"
          onPress={handleRestore}
          loading={loading}
          disabled={loading || !selectedFile}
          style={[styles.btnRestore, !selectedFile && { opacity: 0.5 }]}
          contentStyle={{ paddingVertical: 6 }}
        >
          {loading ? 'Memproses...' : 'Restore Sekarang'}
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#222' },
  desc: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  warningBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF8E1', borderRadius: 10, padding: 12,
    marginBottom: 20, width: '100%',
  },
  warningText: { flex: 1, fontSize: 13, color: '#F57F17' },
  btnPilih: { width: '100%', marginBottom: 14, borderColor: '#1565C0' },
  fileInfo: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F5E9', borderRadius: 8, padding: 10,
    width: '100%', marginBottom: 16,
  },
  fileName: { flex: 1, fontSize: 13, color: '#388E3C', marginLeft: 8 },
  btnRestore: { width: '100%', backgroundColor: '#E10600' },
});
