import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthNewContext';
import { useEffect } from 'react';
import { useOnboarding } from '@/context/OnboardingContext';

export default function HomeScreen() {
  const router = useRouter();
  const { completeOnboarding, onboardingCompleted } = useOnboarding();
  const { logout } = useAuth();

  useEffect(() => {
    // Check if onboarding is completed
    if (onboardingCompleted) {
      // Navigate to the home screen
      router.push('/(app)');
    }
    // If onboarding is not completed, redirect to the onboarding screen
    else {
      router.push('/onboarding');
    }
  }, [completeOnboarding, onboardingCompleted]);

  // Check if onboarding is completed
  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            Stay connected with your Edir community
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <TouchableOpacity className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-xl w-[45%]">
              <Ionicons name="add-circle-outline" size={24} color="#4F46E5" />
              <Text className="text-indigo-600 dark:text-indigo-400 font-medium mt-2">
                Create Edir
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-100 dark:bg-green-900 p-4 rounded-xl w-[45%]">
              <Ionicons name="people-outline" size={24} color="#047857" />
              <Text className="text-green-600 dark:text-green-400 font-medium mt-2">
                Find Edir
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-xl w-[45%]">
              <Ionicons name="wallet-outline" size={24} color="#D97706" />
              <Text className="text-yellow-600 dark:text-yellow-400 font-medium mt-2">
                Make Payment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-100 dark:bg-red-900 p-4 rounded-xl w-[45%]">
              <Ionicons name="help-circle-outline" size={24} color="#B91C1C" />
              <Text className="text-red-600 dark:text-red-400 font-medium mt-2">
                Request Help
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </Text>
          <View className="space-y-4 flex-1 flex-col gap-2">
            {[1, 2, 3].map((item) => (
              <View
                key={item}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 space-x-3">
                    <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
                      <Ionicons name="people" size={20} color="#4F46E5" />
                    </View>
                    <View>
                      <Text className="text-gray-900 dark:text-white font-medium">
                        Monthly Contribution
                      </Text>
                      <Text className="text-gray-500 dark:text-gray-400 text-sm">
                        Due in 5 days
                      </Text>
                    </View>
                  </View>
                  <Text className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    ETB 500
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Events */}
        <View className="px-4 pb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </Text>
          <View className="space-y-4 flex-1 flex-col gap-2">
            {[1, 2].map((item) => (
              <View
                key={item}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 space-x-3">
                    <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
                      <Ionicons name="calendar" size={20} color="#4F46E5" />
                    </View>
                    <View>
                      <Text className="text-gray-900 dark:text-white font-medium">
                        Monthly Meeting
                      </Text>
                      <Text className="text-gray-500 dark:text-gray-400 text-sm">
                        April 15, 2024
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
