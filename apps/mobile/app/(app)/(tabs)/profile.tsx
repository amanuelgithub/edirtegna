import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

export default function Profile() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View>
        <Text style={{ color: theme.colors.inverseSurface }}>Profile</Text>
      </View>
    </SafeAreaView>
  );
}
