import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '@/context/OnboardingContext';
import { RegisterDTO, registerSchema } from '@/hooks/api/auth/types';
import { useAuth } from '@/context/AuthNewContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '@/config/request';

interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message?: string;
}

export default function SignUpScreen() {
  const router = useRouter();
  const { onboardingCompleted, completeOnboarding } = useOnboarding();
  const { login: loginUser } = useAuth();

  const { mutate: register, isPending } = useMutation<
    RegisterResponse,
    Error,
    RegisterDTO
  >({
    mutationFn: async (data: RegisterDTO) => {
      const response = await axiosInstance.post('/app/auth/register', data);
      return response.data;
    },
    onSuccess: (data: RegisterResponse) => {
      if (!!data) {
        if (!data.success && data.statusCode === 412) {
          router.push({
            pathname: '/auth/verify-otp',
            params: { phone: getValues('phone') },
          });
        } else if (!data.success && data.statusCode === 419) {
          router.push({
            pathname: '/auth/set-password',
            params: { phone: getValues('phone') },
          });
        } else if (!data.success && data.statusCode === 416) {
          router.push({
            pathname: '/auth/set-password',
            params: { phone: getValues('phone') },
          });
        } else if (data.success) {
          if (!onboardingCompleted) {
            completeOnboarding('true');
          }
          router.replace('/(app)/profile');
        }
      }
    },
  });

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDTO>({ resolver: zodResolver(registerSchema) });

  const onSubmit: SubmitHandler<RegisterDTO> = async (data: RegisterDTO) => {
    register(data);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1">
          <View className="px-4 py-6">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center mb-4">
                <Ionicons name="person-add" size={40} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Account
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                Join Edir to start managing your community
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <Controller
                name="firstName"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      First Name
                    </Text>
                    <TextInput
                      className={`rounded-xl px-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                        errors.firstName ? 'border border-red-500' : ''
                      }`}
                      placeholder="Enter your first name"
                      placeholderTextColor="#6B7280"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.firstName && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Last Name
                    </Text>
                    <TextInput
                      className={`rounded-xl px-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                        errors.lastName ? 'border border-red-500' : ''
                      }`}
                      placeholder="Enter your last name"
                      placeholderTextColor="#6B7280"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.lastName && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Phone Number
                    </Text>
                    <View className="relative">
                      <TextInput
                        className={`rounded-xl px-4 pl-16 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                          errors.phone ? 'border border-red-500' : ''
                        }`}
                        placeholder="Enter your phone number"
                        placeholderTextColor="#6B7280"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        maxLength={9}
                      />
                      <View className="absolute left-4 top-4">
                        <Text className="text-gray-500 dark:text-gray-400">
                          +251
                        </Text>
                      </View>
                    </View>
                    {errors.phone && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Sign Up Button */}
              <TouchableOpacity
                className="mt-4 bg-indigo-600 p-4 rounded-xl"
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
              >
                <Text className="text-white text-center font-semibold">
                  {isPending ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-gray-500 dark:text-gray-400">
                  Already have an account?
                </Text>
                <TouchableOpacity
                  className="ml-1"
                  onPress={() => router.push('/auth/signin')}
                >
                  <Text className="text-indigo-600 dark:text-indigo-400 font-medium">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
