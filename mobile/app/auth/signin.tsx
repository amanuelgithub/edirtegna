import React, { useState } from 'react';
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
import { LoginDTO, loginSchema, login as loginApi } from '@/hooks/api';
import { useAuth } from '@/context/AuthNewContext';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoginResponse {
  success: boolean;
  statusCode: number;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

export default function SignInScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { onboardingCompleted, completeOnboarding } = useOnboarding();
  const { login: loginUser } = useAuth();

  const { mutate: login, isPending } = useMutation<
    LoginResponse,
    Error,
    LoginDTO
  >({
    mutationFn: loginApi,
    onSuccess: (data: LoginResponse) => {
      if (!!data) {
        if (!data.success && data.statusCode === 412) {
          router.push({
            pathname: '/auth/verify-otp',
            params: { phone: getValues('identifier') },
          });
        } else if (
          !data.success &&
          (data.statusCode === 419 || data.statusCode === 416)
        ) {
          router.push({
            pathname: '/auth/set-password',
            params: { phone: getValues('identifier') },
          });
        } else if (data.success && data.accessToken && data.refreshToken) {
          if (!onboardingCompleted) {
            completeOnboarding('true');
          }
          loginUser(data.accessToken, data.refreshToken);
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
  } = useForm<LoginDTO>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginDTO> = async (data: LoginDTO) => {
    login(data);
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
                <Ionicons name="person" size={40} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                Sign in to continue managing your Edir groups
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <Controller
                name="identifier"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Phone Number
                    </Text>
                    <View className="relative">
                      <TextInput
                        className={`rounded-xl px-4 pl-16 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                          errors.identifier ? 'border border-red-500' : ''
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
                    {errors.identifier && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.identifier.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Password
                    </Text>
                    <View className="relative">
                      <TextInput
                        className={`rounded-xl px-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                          errors.password ? 'border border-red-500' : ''
                        }`}
                        placeholder="Enter your password"
                        placeholderTextColor="#6B7280"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        className="absolute right-4 top-4"
                        onPress={() => setShowPassword((prev) => !prev)}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={24}
                          color="#6B7280"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                className="items-end"
                onPress={() => router.push('/auth/forgot-password')}
              >
                <Text className="text-indigo-600 dark:text-indigo-400 font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                className="mt-4 bg-indigo-600 p-4 rounded-xl"
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
              >
                <Text className="text-white text-center font-semibold">
                  {isPending ? 'Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-gray-500 dark:text-gray-400">
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  className="ml-1"
                  onPress={() => router.push('/auth/signup')}
                >
                  <Text className="text-indigo-600 dark:text-indigo-400 font-medium">
                    Sign Up
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
