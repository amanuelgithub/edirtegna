import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { createLogoutMutationOptions, useGetProfile } from '@/hooks/api';
import { useAuth } from '@/context/AuthNewContext';
import dayjs from 'dayjs';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { logout, getRefreshToken } = useAuth();
  const { mutate: logoutMutate } = useMutation({
    ...createLogoutMutationOptions(),
    onSuccess: () => {
      // call the logout method from the auth context
      logout();
    },
  });
  const { data: userData } = useGetProfile();
  console.log('profile', userData);

  const handleEditAvatar = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      console.log('Selected image URI:', pickerResult.assets[0].uri);
      // Handle the selected image URI (e.g., upload to server or update state)
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="px-4 py-6">
          <View className="relative items-center">
            {/* Profile Avatar */}
            {userData?.userProfile?.profilePic ? (
              <Image
                source={{
                  uri: 'http://localhost/' + userData.userProfile.profilePic,
                }}
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 items-center justify-center">
                <Ionicons name="person" size={40} color="#4F46E5" />
              </View>
            )}
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full"
              onPress={handleEditAvatar}
            >
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4">
            {userData?.userProfile?.firstName ?? '-'}{' '}
            {userData?.userProfile?.middleName ?? '-'}{' '}
          </Text>
          {/* <Text className="text-gray-500 dark:text-gray-400">
            Member since 2023
          </Text> */}
          <Text className="text-gray-500 dark:text-gray-400">
            {`Member since ${dayjs(userData?.createdAt).format(
              'MMMM D, YYYY',
            )}`}
          </Text>

          <Text className="text-gray-500 dark:text-gray-400">
            {JSON.stringify(userData)}
          </Text>
        </View>

        {/* Profile Stats */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-around bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
            <View className="items-center">
              <Text className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                2
              </Text>
              <Text className="text-gray-500 dark:text-gray-400">Groups</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                12
              </Text>
              <Text className="text-gray-500 dark:text-gray-400">Payments</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                98%
              </Text>
              <Text className="text-gray-500 dark:text-gray-400">
                Attendance
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Settings
          </Text>
          <View className="space-y-2">
            <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
                  <Ionicons name="person-outline" size={20} color="#4F46E5" />
                </View>
                <Text className="text-gray-900 dark:text-white">
                  Edit Profile
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#4F46E5"
                  />
                </View>
                <Text className="text-gray-900 dark:text-white">
                  Notifications
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#4F46E5"
                  />
                </View>
                <Text className="text-gray-900 dark:text-white">Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#4F46E5"
                  />
                </View>
                <Text className="text-gray-900 dark:text-white">
                  Help & Support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Settings */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Language
          </Text>
          <View className="space-y-2">
            <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
                  <Ionicons name="language-outline" size={20} color="#4F46E5" />
                </View>
                <Text className="text-gray-900 dark:text-white">English</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-4 pb-6">
          <TouchableOpacity
            className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex-row items-center justify-center space-x-2"
            onPress={async () => {
              logoutMutate({
                // get the refresh token from the storage
                refreshToken: await getRefreshToken(),
              });
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-500 font-medium">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
