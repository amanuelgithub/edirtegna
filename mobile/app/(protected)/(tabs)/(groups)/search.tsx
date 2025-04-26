import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

export default function SearchScreen() {
  const router = useRouter();
  const searchInputRef = useRef<any>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 bg-white dark:bg-gray-900">
        <View className="px-4 py-6">
          <View className="flex-row items-center justify-between mb-4">
            <TextInput
              ref={searchInputRef}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-md border-2 border-indigo-600"
              placeholder="Search groups..."
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              className="ml-4"
              onPress={() => {
                // Navigate back to the previous page
                router.back();
              }}
            >
              <Text className="text-blue-500 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Search Groups
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            Find your community
          </Text>
        </View>

        {/* Search Results */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Search Results
          </Text>
          {/* Add your search results here */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
