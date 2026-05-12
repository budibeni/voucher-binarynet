import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import BerandaScreen from '../screens/BerandaScreen';
import RiwayatScreen from '../screens/RiwayatScreen';
import DetailTransaksiScreen from '../screens/DetailTransaksiScreen';
import PengaturanScreen from '../screens/PengaturanScreen';
import KelolaVoucherScreen from '../screens/KelolaVoucherScreen';
import FormVoucherScreen from '../screens/FormVoucherScreen';
import BackupScreen from '../screens/BackupScreen';
import RestoreScreen from '../screens/RestoreScreen';
import ResetScreen from '../screens/ResetScreen';
import RingkasanScreen from '../screens/RingkasanScreen';
import TentangScreen from '../screens/TentangScreen';
import { COLORS, FONT_SIZE } from '../theme';

const Tab = createBottomTabNavigator();
const RiwayatStack = createNativeStackNavigator();
const PengaturanStack = createNativeStackNavigator();

const HEADER_OPTS = {
  headerStyle: {
    backgroundColor: COLORS.white,
  },
  headerTintColor: COLORS.primary,
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: COLORS.background },
};

function RiwayatNavigator() {
  return (
    <RiwayatStack.Navigator screenOptions={HEADER_OPTS}>
      <RiwayatStack.Screen
        name="RiwayatList"
        component={RiwayatScreen}
        options={{ title: 'Riwayat Transaksi' }}
      />
      <RiwayatStack.Screen
        name="DetailTransaksi"
        component={DetailTransaksiScreen}
        options={{ title: 'Detail Transaksi' }}
      />
    </RiwayatStack.Navigator>
  );
}

function PengaturanNavigator() {
  return (
    <PengaturanStack.Navigator screenOptions={HEADER_OPTS}>
      <PengaturanStack.Screen
        name="PengaturanMain"
        component={PengaturanScreen}
        options={{ title: 'Pengaturan' }}
      />
      <PengaturanStack.Screen
        name="KelolaVoucher"
        component={KelolaVoucherScreen}
        options={{ title: 'Kelola Voucher' }}
      />
      <PengaturanStack.Screen
        name="FormVoucher"
        component={FormVoucherScreen}
        options={({ route }) => ({
          title: route.params?.voucher ? 'Edit Voucher' : 'Tambah Voucher'
        })}
      />
      <PengaturanStack.Screen
        name="Ringkasan"
        component={RingkasanScreen}
        options={{ title: 'Ringkasan' }}
      />
      <PengaturanStack.Screen
        name="Backup"
        component={BackupScreen}
        options={{ title: 'Backup Data' }}
      />
      <PengaturanStack.Screen
        name="Restore"
        component={RestoreScreen}
        options={{ title: 'Restore Data' }}
      />
      <PengaturanStack.Screen
        name="Reset"
        component={ResetScreen}
        options={{ title: 'Reset Data' }}
      />
      <PengaturanStack.Screen
        name="Tentang"
        component={TentangScreen}
        options={{ title: 'Tentang Aplikasi' }}
      />
    </PengaturanStack.Navigator>
  );
}

const TAB_CONFIG = {
  Beranda: {
    active: 'home',
    inactive: 'home-outline',
    label: 'Beranda',
  },
  Riwayat: {
    active: 'history',
    inactive: 'history',
    label: 'Riwayat',
  },
  Pengaturan: {
    active: 'cog',
    inactive: 'cog-outline',
    label: 'Pengaturan',
  },
};

function TabIcon({ routeName, focused, color }) {
  const config = TAB_CONFIG[routeName];
  if (!config) return null;
  return (
    <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
      <MaterialCommunityIcons
        name={focused ? config.active : config.inactive}
        size={22}
        color={focused ? COLORS.primary : color}
      />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => (
            <TabIcon routeName={route.name} focused={focused} color={color} />
          ),
          tabBarLabel: ({ focused, children }) => (
            <Text style={[
              styles.tabLabel,
              { color: focused ? COLORS.primary : COLORS.textMuted }
            ]}>
              {children}
            </Text>
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabItem,
        })}
      >
        <Tab.Screen name="Beranda" component={BerandaScreen} />
        <Tab.Screen name="Riwayat" component={RiwayatNavigator} />
        <Tab.Screen name="Pengaturan" component={PengaturanNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: Platform.OS === 'ios' ? 85 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    gap: 2,
  },
  tabIconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconWrapActive: {
    backgroundColor: COLORS.primarySurface,
  },
  tabLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
