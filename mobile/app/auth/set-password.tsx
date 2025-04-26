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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '@/context/OnboardingContext';
import { SetPasswordDTO, setPasswordSchema } from '@/hooks/api/auth/types';
import { useAuth } from '@/context/AuthNewContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '@/config/request';

interface SetPasswordResponse {
  success: boolean;
  statusCode: number;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

export default function SetPasswordScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { onboardingCompleted, completeOnboarding } = useOnboarding();
  const { login: loginUser } = useAuth();

  // .object({
  //   identifier: z
  //     .string()
  //     .min(9, 'Phone number must be at least 9 digits')
  //     .max(9, 'Phone number must be at most 9 digits'),
  //   previousPassword: z.string().min(4, 'Current password is required'),
  //   password: z.string().min(4, 'New password must be at least 4 characters'),
  //   confirmPassword: z
  //     .string()
  //     .min(4, 'Confirm password must be at least 4 characters'),
  // })
  // .superRefine((data, ctx) => {
  //   if (data.confirmPassword !== data.password) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Passwords must match',
  //     });
  //   }
  // });

  const { mutate: setPassword, isPending } = useMutation<
    SetPasswordResponse,
    Error,
    SetPasswordDTO
  >({
    mutationFn: async (data: SetPasswordDTO) => {
      const response = await axiosInstance.post('/app/auth/set-password', data);
      return response.data;
    },
    onSuccess: (data: SetPasswordResponse) => {
      if (data.success && data.accessToken && data.refreshToken) {
        if (!onboardingCompleted) {
          completeOnboarding('true');
        }
        loginUser(data.accessToken, data.refreshToken);
        router.replace('/(protected)/(tabs)/profile');
      }
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordDTO>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      identifier: phone,
    },
  });

  const onSubmit: SubmitHandler<SetPasswordDTO> = async (
    data: SetPasswordDTO,
  ) => {
    setPassword(data);
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
                <Ionicons name="lock-closed" size={40} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                Set Your Password
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                Create a secure password for your account
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <Controller
                name="previousPassword"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Previous Password
                    </Text>
                    <View className="relative">
                      <TextInput
                        className={`rounded-xl px-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                          errors.previousPassword ? 'border border-red-500' : ''
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
                    {errors.previousPassword && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.previousPassword.message}
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

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Confirm Password
                    </Text>
                    <View className="relative">
                      <TextInput
                        className={`rounded-xl px-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                          errors.confirmPassword ? 'border border-red-500' : ''
                        }`}
                        placeholder="Confirm your password"
                        placeholderTextColor="#6B7280"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity
                        className="absolute right-4 top-4"
                        onPress={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        <Ionicons
                          name={showConfirmPassword ? 'eye-off' : 'eye'}
                          size={24}
                          color="#6B7280"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Set Password Button */}
              <TouchableOpacity
                className="mt-4 bg-indigo-600 p-4 rounded-xl"
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
              >
                <Text className="text-white text-center font-semibold">
                  {isPending ? 'Setting Password...' : 'Set Password'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
