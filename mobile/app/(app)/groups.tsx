import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function GroupsScreen() {
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* <SafeAreaView className="flex-1 bg-white dark:bg-gray-900"> */}
      {/* Search Bar */}
      <View className="px-4 py-4">
        <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search groups..."
            placeholderTextColor="#6B7280"
            className="flex-1 ml-2 text-gray-900 dark:text-white"
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* My Groups Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            My Groups
          </Text>
          <View className="space-y-4 flex-1 flex-col gap-2">
            {[1, 2].map((item) => (
              <TouchableOpacity
                key={item}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 space-x-3">
                    <View className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
                      <Ionicons name="people" size={24} color="#4F46E5" />
                    </View>
                    <View>
                      <Text className="text-gray-900 dark:text-white font-medium">
                        Addis Ababa Edir
                      </Text>
                      <Text className="text-gray-500 dark:text-gray-400 text-sm">
                        50 members • Monthly
                      </Text>
                    </View>
                  </View>
                  <View className="bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full">
                    <Text className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                      Active
                    </Text>
                  </View>
                </View>
                <View className="mt-4 flex-row justify-between items-center">
                  <View>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">
                      Next Payment
                    </Text>
                    <Text className="text-gray-900 dark:text-white font-medium">
                      ETB 500
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">
                      Due Date
                    </Text>
                    <Text className="text-gray-900 dark:text-white font-medium">
                      Apr 15
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Discover Groups Section */}
        <View className="px-4 pb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Discover Groups
          </Text>
          <View className="space-y-4 flex-1 flex-col gap-2">
            {[1, 2, 3].map((item) => (
              <TouchableOpacity
                key={item}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 space-x-3">
                    <View className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
                      <Ionicons name="people" size={24} color="#4F46E5" />
                    </View>
                    <View>
                      <Text className="text-gray-900 dark:text-white font-medium">
                        Bole Edir Group
                      </Text>
                      <Text className="text-gray-500 dark:text-gray-400 text-sm">
                        75 members • Weekly
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-full">
                    <Text className="text-white text-sm font-medium">Join</Text>
                  </TouchableOpacity>
                </View>
                <View className="mt-4">
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    Contribution: ETB 200/week
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    Location: Bole, Addis Ababa
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Create Group Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-indigo-600 w-14 h-14 rounded-full items-center justify-center shadow-lg">
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      {/* </SafeAreaView> */}
    </View>
  );
}
