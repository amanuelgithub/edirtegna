import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'react-native-linear-gradient';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useMutation({
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
        {/* Logo */}
        <View className="items-center mb-6">
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

        {/* Back to Sign In Link */}
        <TouchableOpacity
          className="bg-white rounded-lg py-4 mt-4 shadow-sm"
          onPress={() => router.push('/auth/signin')}
        >
          <Text className="text-center text-blue-800 font-bold">
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
