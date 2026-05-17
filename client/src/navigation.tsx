import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from './theme';
import {
  AnalyticsScreen,
  AuthScreen,
  ChatbotScreen,
  HomeScreen,
  LoginScreen,
  OtpScreen,
  PlannerScreen,
  ProfileScreen,
  RegisterScreen,
  ScannerScreen,
  SetupScreen,
  TrackerScreen,
  ScanHistoryScreen,
} from './screens';
import { ScanHistoryProvider } from './scanHistory';
import { ProfileProvider } from './profile';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabLabel({ title }: { title: string }) {
  return <Text style={styles.tabLabel}>{title}</Text>;
}

import CustomTabBar from './CustomTabBar';

function MainTabs() {
  return (
    <Tabs.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tabs.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Scan' }} />
      <Tabs.Screen name="History" component={ScanHistoryScreen} options={{ title: 'History' }} />
      <Tabs.Screen name="Planner" component={PlannerScreen} options={{ title: 'Plan' }} />
      <Tabs.Screen name="Tracker" component={TrackerScreen} options={{ title: 'Track' }} />
      <Tabs.Screen name="Chat" component={ChatbotScreen} options={{ title: 'Chat' }} />
      <Tabs.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Stats' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tabs.Navigator>
  );
}

function AuthStack({ onFinish }: { onFinish: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="Setup">
        {() => <SetupScreen onFinish={onFinish} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const [authenticated, setAuthenticated] = React.useState(false);

  return (
    <ProfileProvider>
      <ScanHistoryProvider>
        {authenticated ? <MainTabs /> : <AuthStack onFinish={() => setAuthenticated(true)} />}
      </ScanHistoryProvider>
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(6, 17, 31, 0.96)',
    borderTopColor: 'rgba(148,163,184,0.12)',
    height: 68,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
});
