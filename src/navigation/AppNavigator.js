import React from 'react';
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

const Tab = createBottomTabNavigator();
const RiwayatStack = createNativeStackNavigator();
const PengaturanStack = createNativeStackNavigator();

const headerOpts = {
  headerStyle: { backgroundColor: '#E10600' },
  headerTintColor: '#fff',
  headerTitleAlign: 'center',
};

function RiwayatNavigator() {
  return (
    <RiwayatStack.Navigator screenOptions={headerOpts}>
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
    <PengaturanStack.Navigator screenOptions={headerOpts}>
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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Beranda') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Riwayat') {
              iconName = focused ? 'history' : 'history';
            } else if (route.name === 'Pengaturan') {
              iconName = focused ? 'cog' : 'cog-outline';
            }
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#E10600',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Beranda" component={BerandaScreen} />
        <Tab.Screen name="Riwayat" component={RiwayatNavigator} />
        <Tab.Screen name="Pengaturan" component={PengaturanNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
