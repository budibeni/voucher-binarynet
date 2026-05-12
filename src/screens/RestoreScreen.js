import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../theme';

const DB_DEST = `${FileSystem.documentDirectory}SQLite/binarynet.db`;

export default function RestoreScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSelectedFile(result.assets[0]);
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
              const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
              const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
              if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
              }

              await FileSystem.copyAsync({ from: selectedFile.uri, to: DB_DEST });

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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.iconSection}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="database-import-outline" size={40} color={COLORS.info} />
          </View>
          <Text style={styles.pageTitle}>Restore Data</Text>
          <Text style={styles.pageDesc}>
            Pilih file backup (.db) dari penyimpanan Anda untuk memulihkan data. Semua data yang ada saat ini akan digantikan.
          </Text>
        </View>

        {/* Warning */}
        <View style={styles.warningCard}>
          <MaterialCommunityIcons name="alert-circle-outline" size={20} color={COLORS.warning} />
          <Text style={styles.warningText}>
            Proses restore bersifat permanen dan tidak dapat dibatalkan setelah dikonfirmasi.
          </Text>
        </View>

        {/* File Picker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pilih File Backup</Text>
          <Text style={styles.cardDesc}>File harus berformat .db dari backup Binary-Net</Text>

          <TouchableOpacity
            style={styles.pickerBtn}
            onPress={pickFile}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="folder-open-outline" size={22} color={COLORS.info} />
            <Text style={styles.pickerBtnText}>Pilih File dari Penyimpanan</Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.fileBox}>
              <View style={styles.fileIconWrap}>
                <MaterialCommunityIcons name="file-check-outline" size={22} color={COLORS.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
                <Text style={styles.fileSize}>
                  {selectedFile.size ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'File terpilih'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedFile(null)}>
                <MaterialCommunityIcons name="close-circle-outline" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[
            styles.btnRestore,
            (!selectedFile || loading) && styles.btnDisabled,
            selectedFile && styles.btnRestoreActive,
          ]}
          onPress={handleRestore}
          disabled={loading || !selectedFile}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <MaterialCommunityIcons name="database-import-outline" size={22} color={COLORS.white} />
          )}
          <Text style={styles.btnText}>
            {loading ? 'Memproses...' : 'Restore Sekarang'}
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

  // Header
  iconSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: 12,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.infoSurface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BFDBFE',
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

  // Warning
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.warningSurface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: SPACING.lg,
  },
  warningText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.warning,
    lineHeight: 18,
    fontWeight: '600',
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
  },
  cardDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },

  // Picker
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.info,
    borderStyle: 'dashed',
    backgroundColor: COLORS.infoSurface,
  },
  pickerBtnText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: COLORS.info,
  },

  // File box
  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.successSurface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: SPACING.md,
  },
  fileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileName: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  fileSize: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
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
  btnRestore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.border,
  },
  btnRestoreActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.white,
  },
});
