import React, { useState, useEffect } from 'react';
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
import { VerifyOtpDTO, verifyOtpSchema } from '@/hooks/api/auth/types';
import { useAuth } from '@/context/AuthNewContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '@/config/request';

interface VerifyOtpResponse {
  success: boolean;
  statusCode: number;
  message?: string;
}

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { onboardingCompleted, completeOnboarding } = useOnboarding();
  const { login: loginUser } = useAuth();

  const { mutate: verifyOtp, isPending } = useMutation<
    VerifyOtpResponse,
    Error,
    VerifyOtpDTO
  >({
    mutationFn: async (data: VerifyOtpDTO) => {
      const response = await axiosInstance.post('/app/auth/verify-otp', data);
      return response.data;
    },
    onSuccess: (data: VerifyOtpResponse) => {
      console.log('Verify OTP Response:', data);

      if (!!data) {
        if (!data.success && data.statusCode === 419) {
          router.push({
            pathname: '/auth/set-password',
            params: { phone },
          });
        } else if (!data.success && data.statusCode === 416) {
          router.push({
            pathname: '/auth/set-password',
            params: { phone },
          });
        } else if (data.success) {
          if (!onboardingCompleted) {
            completeOnboarding('true');
          }
          router.replace('/(protected)/(tabs)/profile');
        }
      }
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpDTO>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      identifier: phone,
    },
  });

  const onSubmit: SubmitHandler<VerifyOtpDTO> = async (data: VerifyOtpDTO) => {
    console.log('Verify OTP Data:', data);
    verifyOtp(data);
  };

  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const { mutate: resendOtp, isPending: isResending } = useMutation<
    void,
    Error,
    { phone: string }
  >({
    mutationFn: async ({ phone }) => {
      await axiosInstance.post('/app/auth/resend-otp', { phone });
    },
    onSuccess: () => {
      setResendTimer(30);
      setCanResend(false);
    },
  });

  const handleResendCode = () => {
    if (canResend) {
      resendOtp({ phone });
    }
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
                <Ionicons name="shield-checkmark" size={40} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                Verify Your Phone
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                Enter the verification code sent to +251 {phone}
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <Controller
                name="otp"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Verification Code
                    </Text>
                    <TextInput
                      className={`rounded-xl px-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                        errors.otp ? 'border border-red-500' : ''
                      }`}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="#6B7280"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                    {errors.otp && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.otp.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Verify Button */}
              <TouchableOpacity
                className="mt-4 bg-indigo-600 p-4 rounded-xl"
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
              >
                <Text className="text-white text-center font-semibold">
                  {isPending ? 'Verifying...' : 'Verify Code'}
                </Text>
              </TouchableOpacity>

              {/* Resend Code Link */}
              <TouchableOpacity
                className="items-center mt-4"
                onPress={handleResendCode}
                disabled={!canResend || isResending}
              >
                <Text
                  className={`${
                    canResend
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-400 dark:text-gray-600'
                  } font-medium`}
                >
                  {canResend
                    ? "Didn't receive the code? Resend"
                    : `Resend available in ${resendTimer}s`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
