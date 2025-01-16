import { Tabs } from 'expo-router';
import React from 'react';
import { BottomNavigation, Icon, useTheme } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabConfig = {
  name: string;
  title: string;
  icon: string;
};

export default function TabLayout() {
  // ====== Prop Destructuring ======

  // ====== Constants ======
  const iconSize = 24 as const;

  const tabs: TabConfig[] = [
    { name: 'index', title: 'Home', icon: 'home' },
    { name: 'edre', title: 'Edre', icon: 'account-group' },
    { name: 'profile', title: 'Profile', icon: 'account' },
    { name: 'settings', title: 'Settings', icon: 'cog' },
  ];

  // ====== Global Context ======

  const theme = useTheme();

  // ====== State Variables ======

  // ====== Effect Hooks ======

  // ====== Functions ======

  // ====== Event Handlers ======

  // ====== Render Helpers ======

  // ====== Render ======
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarActiveBackgroundColor: theme.colors.background,
          tabBarInactiveTintColor: theme.colors.secondary,
          tabBarInactiveBackgroundColor: theme.colors.background,
          headerShown: false,
        }}
        initialRouteName="index"
        //   tabBar={({ navigation, state, descriptors, insets }) => (
        //     <BottomNavigation.Bar
        //       navigationState={state}
        //       safeAreaInsets={insets}
        //       onTabPress={({ route, preventDefault }) => {
        //         const event = navigation.emit({
        //           type: 'tabPress',
        //           target: route.key,
        //           canPreventDefault: true,
        //         });

        //         if (event.defaultPrevented) {
        //           preventDefault();
        //         } else {
        //           navigation.dispatch({
        //             ...CommonActions.navigate(route.name, route.params),
        //             target: state.key,
        //           });
        //         }
        //       }}
        //       renderIcon={({ route, focused, color }) => {
        //         const { options } = descriptors[route.key];
        //         if (options.tabBarIcon) {
        //           return options.tabBarIcon({ focused, color, size: 24 });
        //         }

        //         return null;
        //       }}
        //       getLabelText={({ route }) => {
        //         const { options } = descriptors[route.key];
        //         const label =
        //           options.tabBarLabel !== undefined
        //             ? options.tabBarLabel
        //             : options.title !== undefined
        //               ? options.title
        //               : route.name;

        //         return typeof label === 'string' ? label : undefined;
        //       }}
        //     />
        //   )}
      >
        {tabs.map((tabConfig) => (
          <Tabs.Screen
            key={`tab-${tabConfig.name}`}
            name={tabConfig.name}
            options={{
              title: tabConfig.title,
              tabBarIcon: ({ color, focused }) => (
                <Icon source={tabConfig.icon} color={color} size={iconSize} />
              ),
              animation: 'fade',
            }}
          />
        ))}
      </Tabs>
    </React.Fragment>
  );
}
