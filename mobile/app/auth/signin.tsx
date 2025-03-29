import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'react-native-linear-gradient';

const loginSchema = z.object({
  identifier: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function SignInScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormInputs) => {
      const response = await axios.post('/api/login', data);
      return response.data;
    },
    onSuccess: () => {
      router.push('/(app)');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
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

        <Text className="text-3xl font-bold text-center mb-6 text-gray-700">
          Welcome Back
        </Text>

        <Controller
          name="identifier"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                className={`rounded-lg px-4 py-4 mb-2 bg-white focus:border-2 focus:border-purple-800 ${
                  errors.identifier
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
                placeholder="Email or Phone Number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.identifier && (
                <Text className="text-red-500 text-sm">
                  {errors.identifier.message}
                </Text>
              )}
            </>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                className={`rounded-lg px-4 py-4 mb-2 bg-white focus:border-2 focus:border-purple-800 ${
                  errors.password
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
              {errors.password && (
                <Text className="text-red-500 text-sm">
                  {errors.password.message}
                </Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          className="mt-4"
          onPress={handleSubmit(onSubmit)}
          disabled={loginMutation.isPending}
        >
          <LinearGradient
            colors={['#34d399', '#3b82f6']}
            style={{ borderRadius: 8, paddingVertical: 16 }}
            className="shadow-lg"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text className="text-white text-center font-bold">
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity
          className="mt-4"
          onPress={() => router.push('/auth/forgot-password')}
        >
          <Text className="text-center text-blue-800 font-medium underline">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Set Password Link */}
        {/* <TouchableOpacity
          className="mt-4"
          onPress={() => router.push('/auth/forgot-password')}
        >
          <Text className="text-center text-blue-800 font-medium underline">
            Forgot Password?
          </Text>
        </TouchableOpacity> */}

        {/* Verify  Otp Link */}
        <TouchableOpacity
          className="mt-4"
          onPress={() => router.push('/auth/verify-otp')}
        >
          <Text className="text-center text-blue-800 font-medium underline">
            Verify Otp
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="bg-white rounded-lg py-4 mt-4 shadow-sm"
          onPress={() => router.push('/auth/signup')}
        >
          <Text className="text-center text-blue-800 font-bold">
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
