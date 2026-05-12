import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme, COLORS } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from './src/database/db';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setupDb = async () => {
      await initDatabase();
      setDbReady(true);
    };
    setupDb();
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.splash}>
        <View style={styles.splashLogo}>
          <MaterialCommunityIcons name="wifi" size={48} color={COLORS.white} />
        </View>
        <Text style={styles.splashTitle}>BINARY-NET</Text>
        <Text style={styles.splashSub}>Penjualan Voucher WiFi</Text>
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
        <StatusBar style="dark" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 2,
  },
  splashSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 6,
    fontWeight: '500',
  },
});
