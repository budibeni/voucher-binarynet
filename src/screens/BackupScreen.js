import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';

const DB_SOURCE = `${FileSystem.documentDirectory}SQLite/binarynet.db`;
const BACKUP_DEST = `${FileSystem.documentDirectory}binarynet_backup.db`;

export default function BackupScreen() {
  const insets = useSafeAreaInsets();
  const [backupInfo, setBackupInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon Header */}
        <View style={styles.iconSection}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="database-export-outline" size={40} color={COLORS.success} />
          </View>
          <Text style={styles.pageTitle}>Backup Data</Text>
          <Text style={styles.pageDesc}>
            Ekspor file database SQLite ke penyimpanan lokal. File backup dapat disimpan atau dibagikan ke Google Drive, Email, dan lainnya.
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cara Backup</Text>
          {[
            { num: '1', text: 'Tap tombol "Backup Sekarang" di bawah' },
            { num: '2', text: 'Pilih lokasi penyimpanan atau aplikasi tujuan' },
            { num: '3', text: 'File backup tersimpan sebagai binarynet_backup.db' },
          ].map(step => (
            <View key={step.num} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{step.num}</Text>
              </View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        {/* Last Backup Info */}
        {backupInfo && (
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.success} />
              <Text style={styles.infoTitle}>Backup Berhasil</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Waktu</Text>
              <Text style={styles.infoValue}>{backupInfo.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ukuran</Text>
              <Text style={styles.infoValue}>{backupInfo.size} KB</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.btnBackup, loading && styles.btnDisabled]}
          onPress={handleBackup}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <MaterialCommunityIcons name="database-export-outline" size={22} color={COLORS.white} />
          )}
          <Text style={styles.btnText}>
            {loading ? 'Memproses...' : 'Backup Sekarang'}
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
    backgroundColor: COLORS.successSurface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BBF7D0',
    ...SHADOWS.sm,
  },
  pageTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  pageDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: 14,
    ...SHADOWS.xs,
  },
  cardTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primarySurface,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  stepText: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Info card
  infoCard: {
    backgroundColor: COLORS.successSurface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: SPACING.lg,
    gap: 10,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.success,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text,
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
  btnBackup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.success,
    ...SHADOWS.sm,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.white,
  },
});
