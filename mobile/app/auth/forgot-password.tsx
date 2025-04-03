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
import {
  ForgotPasswordDTO,
  forgotPasswordSchema,
} from '@/hooks/api/auth/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '@/config/request';

interface ForgotPasswordResponse {
  success: boolean;
  statusCode: number;
  message?: string;
}

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const { mutate: forgotPassword, isPending } = useMutation<
    ForgotPasswordResponse,
    Error,
    ForgotPasswordDTO
  >({
    mutationFn: async (data: ForgotPasswordDTO) => {
      const response = await axiosInstance.post(
        '/app/auth/forgot-password',
        data,
      );
      return response.data;
    },
    onSuccess: (data: ForgotPasswordResponse) => {
      if (data.success) {
        router.push({
          pathname: '/auth/verify-otp',
          params: { phone: getValues('identifier') },
        });
      }
    },
  });

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordDTO>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordDTO> = async (
    data: ForgotPasswordDTO,
  ) => {
    forgotPassword(data);
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
                <Ionicons name="key" size={40} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                Forgot Password
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                Enter your phone number to reset your password
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

              {/* Reset Password Button */}
              <TouchableOpacity
                className="mt-4 bg-indigo-600 p-4 rounded-xl"
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
              >
                <Text className="text-white text-center font-semibold">
                  {isPending ? 'Sending...' : 'Send Reset Code'}
                </Text>
              </TouchableOpacity>

              {/* Back to Sign In Link */}
              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-gray-500 dark:text-gray-400">
                  Remember your password?
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
{
  /* const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormInputs) => {
      const response = await axios.post('/api/forgot-password', data);
      return response.data;
    },
    onSuccess: () => {
      alert('Password reset link sent to your email.');
      router.push('/auth/signin');
    },
    onError: (error) => {
      console.error('Password reset failed:', error);
    },
  });

  const onSubmit = (data: ForgotPasswordFormInputs) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-green-500 to-blue-700">
      <Animated.View entering={FadeIn} exiting={FadeOut} className="w-4/5">
        {/* Logo */
}
{
  /* <View className="items-center mb-6">
          <Image
            source={require('../../assets/images/react-logo.png')} // Replace with your logo path
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-bold text-center mb-2 text-gray-700">
          Forgot Password
        </Text>
        <Text className="text-center text-gray-600 mb-6">
          Enter your email or phone number to receive a password reset link.
        </Text>

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                className={`rounded-lg px-4 py-4 mb-2 bg-white focus:border-2 focus:border-blue-800 ${
                  errors.email
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text className="text-red-500 text-sm">
                  {errors.email.message}
                </Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          className="mt-4"
          onPress={handleSubmit(onSubmit)}
          disabled={forgotPasswordMutation.isPending}
        >
          {Platform.OS === 'ios' ? (
            <View
              style={{
                backgroundColor: '#34d399',
                borderRadius: 8,
                paddingVertical: 16,
              }}
              className="shadow-sm"
            >
              <Text className="text-white text-center font-bold">
                {forgotPasswordMutation.isPending
                  ? 'Sending...'
                  : 'Send Reset Link'}
              </Text>
            </View>
          ) : (
            <LinearGradient
              colors={['#34d399', '#3b82f6']}
              style={{ borderRadius: 8, paddingVertical: 16 }}
              className="shadow-lg"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text className="text-white text-center font-bold">
                {forgotPasswordMutation.isPending
                  ? 'Sending...'
                  : 'Send Reset Link'}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        {/* Back to Sign In Link */
}
{
  /* <TouchableOpacity
          className="bg-white rounded-lg py-4 mt-4 shadow-sm"
          onPress={() => router.push('/auth/signin')}
        >
          <Text className="text-center text-blue-800 font-bold">
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </Animated.View> */
}
{
  /* </View> */
}
{
  /* ); */
}
