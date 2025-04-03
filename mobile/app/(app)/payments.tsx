import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1">
        {/* Balance Overview */}
        <View className="px-4 py-6 bg-indigo-600">
          <Text className="text-white text-lg">Total Balance</Text>
          <Text className="text-white text-3xl font-bold mt-2">ETB 2,500</Text>
          <View className="flex-row mt-4 space-x-4">
            <View className="flex-1 bg-white/10 p-4 rounded-xl">
              <Text className="text-white/80 text-sm">Available</Text>
              <Text className="text-white text-lg font-semibold mt-1">
                ETB 1,500
              </Text>
            </View>
            <View className="flex-1 bg-white/10 p-4 rounded-xl">
              <Text className="text-white/80 text-sm">Pending</Text>
              <Text className="text-white text-lg font-semibold mt-1">
                ETB 1,000
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <TouchableOpacity className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-xl w-[45%]">
              <Ionicons name="add-circle-outline" size={24} color="#4F46E5" />
              <Text className="text-indigo-600 dark:text-indigo-400 font-medium mt-2">
                Add Money
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-xl w-[45%]">
              <Ionicons name="send-outline" size={24} color="#4F46E5" />
              <Text className="text-indigo-600 dark:text-indigo-400 font-medium mt-2">
                Send Money
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-xl w-[45%]">
              <Ionicons name="download-outline" size={24} color="#4F46E5" />
              <Text className="text-indigo-600 dark:text-indigo-400 font-medium mt-2">
                Withdraw
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-xl w-[45%]">
              <Ionicons name="receipt-outline" size={24} color="#4F46E5" />
              <Text className="text-indigo-600 dark:text-indigo-400 font-medium mt-2">
                Statements
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-4 pb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Transactions
          </Text>
          <View className="space-y-4">
            {[1, 2, 3].map((item) => (
              <View
                key={item}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-3">
                    <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
                      <Ionicons name="arrow-up" size={20} color="#4F46E5" />
                    </View>
                    <View>
                      <Text className="text-gray-900 dark:text-white font-medium">
                        Monthly Contribution
                      </Text>
                      <Text className="text-gray-500 dark:text-gray-400 text-sm">
                        Addis Ababa Edir
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-red-500 font-semibold">-ETB 500</Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">
                      Apr 10, 2024
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
