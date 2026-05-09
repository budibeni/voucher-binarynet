import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Surface, ActivityIndicator } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DB_SOURCE = `${FileSystem.documentDirectory}SQLite/binarynet.db`;
const BACKUP_DEST = `${FileSystem.documentDirectory}binarynet_backup.db`;

export default function BackupScreen() {
  const [backupInfo, setBackupInfo] = useState(null);
  const [loadingBackup, setLoadingBackup] = useState(false);

  const handleBackup = async () => {
    setLoadingBackup(true);
    try {
      const sourceInfo = await FileSystem.getInfoAsync(DB_SOURCE);
      if (!sourceInfo.exists) {
        Alert.alert('Error', 'File database tidak ditemukan.');
        return;
      }

      await FileSystem.copyAsync({ from: DB_SOURCE, to: BACKUP_DEST });

      const destInfo = await FileSystem.getInfoAsync(BACKUP_DEST);
      const sizeKB = (destInfo.size / 1024).toFixed(1);
      const backupDate = new Date().toLocaleString('id-ID');

      setBackupInfo({ date: backupDate, size: sizeKB });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(BACKUP_DEST, {
          mimeType: 'application/octet-stream',
          dialogTitle: 'Simpan File Backup',
        });
      } else {
        Alert.alert('Backup Selesai', `File backup berhasil dibuat.\nUkuran: ${sizeKB} KB`);
      }
    } catch (error) {
      console.error('Backup error:', error);
      Alert.alert('Error', 'Gagal membuat backup');
    } finally {
      setLoadingBackup(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.card} elevation={2}>
        <MaterialCommunityIcons name="database-export" size={48} color="#E10600" style={styles.icon} />
        <Text style={styles.title}>Backup Data</Text>
        <Text style={styles.desc}>
          Ekspor file database SQLite ke penyimpanan lokal Anda. File backup dapat disimpan atau dibagikan ke aplikasi lain (Google Drive, Email, dll).
        </Text>

        {backupInfo && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Backup terakhir</Text>
            <Text style={styles.infoValue}>{backupInfo.date}</Text>
            <Text style={styles.infoLabel}>Ukuran file</Text>
            <Text style={styles.infoValue}>{backupInfo.size} KB</Text>
          </View>
        )}

        <Button
          mode="contained"
          icon="database-export"
          onPress={handleBackup}
          loading={loadingBackup}
          disabled={loadingBackup}
          style={styles.btn}
          contentStyle={{ paddingVertical: 6 }}
        >
          {loadingBackup ? 'Memproses...' : 'Backup Sekarang'}
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
  desc: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  infoBox: {
    width: '100%', backgroundColor: '#f9f9f9',
    borderRadius: 10, padding: 14, marginBottom: 20,
  },
  infoLabel: { fontSize: 11, color: '#aaa', marginTop: 6 },
  infoValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  btn: { width: '100%', backgroundColor: '#E10600' },
});
