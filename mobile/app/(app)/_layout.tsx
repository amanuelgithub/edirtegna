import { Redirect, Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useOnboarding } from '@/context/OnboardingContext';
// import { useAuth } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthNewContext';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { account } from "@expo/vector-icons/AntDesign";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { onboardingCompleted } = useOnboarding();
  const { isAuthenticated, logout, getAccessToken, getRefreshToken } =
    useAuth();

  if (!getAccessToken() || !getRefreshToken()) {
    logout();
    return <Redirect href="/auth/signin" />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/signin" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          // add options to change the header color according to the theme
          // headerStyle: {
          //   backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
          // },
          // headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          // headerTitleStyle: {
          //   fontWeight: 'bold',
          // },
          // remove the header
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
          },
          headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
          },
          headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
          },
          headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Tabs>
  );
}
