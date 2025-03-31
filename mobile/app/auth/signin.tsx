import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient'; // Ensure compatibility with iOS
import { Ionicons } from '@expo/vector-icons'; // Import Expo's built-in icons
import { useOnboarding } from '@/context/OnboardingContext';
import { LoginDTO, loginSchema, useLoginMutation } from '@/hooks/api';

export default function SignInScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const { onboardingCompleted, completeOnboarding } = useOnboarding();

  const {
    // mutateAsync: asyncLogin,
    mutate: login,
    data,
    isError,
    isPending,
    isSuccess,
    error,
  } = useLoginMutation();

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginDTO> = async (data: LoginDTO) => {
    login(data);
  };

  useEffect(() => {
    // console.log('login error', error?.message);

    console.log('login data: ', data);

    if (!!data) {
      if (!data?.success && data?.statusCode === 412) {
        router.push({
          pathname: '/auth/verify-otp',
          params: { phone: getValues('identifier') },
        });
      } else if (!data?.success && data?.statusCode === 419) {
        router.push({
          pathname: '/auth/set-password',
          params: { phone: getValues('identifier') },
        });
      } else if (!data?.success && data?.statusCode === 416) {
        router.push({
          pathname: '/auth/set-password',
          params: { phone: getValues('identifier') },
        });
      } else if (!data?.success) {
        // this.toastService.show(data?.message, {
        //   classname: 'bg-danger text-white',
        //   delay: 15000,
        // });
        // this.isLoading = false;
      } else {
        router.replace('/(app)/profile');
      }
    }
  }, [isError, isSuccess, error, data]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
                <View className="relative">
                  <TextInput
                    className={`rounded-lg px-4 pl-16 py-4 mb-2 text-nowrap bg-white focus:border-2 focus:border-purple-800 ${
                      errors.identifier
                        ? 'border border-red-500'
                        : 'border border-gray-300'
                    }`}
                    placeholder="Phone Number"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="phone-pad"
                    // autoCapitalize="none"
                    textContentType="telephoneNumber"
                    // autoComplete="tel"
                    maxLength={9} // Adjust the max length as neededa
                    numberOfLines={1} // Prevents multiline input
                  />
                  <View
                    className="absolute left-4 top-[27%]"
                    // onPress={() => setShowPassword((prev) => !prev)}
                  >
                    <Text className="text-gray-950">+251</Text>
                  </View>
                </View>
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
                <View className="relative">
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
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
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
            disabled={isPending}
          >
            {/* {Platform.OS === 'ios' ? ( */}
            <View
              style={{
                backgroundColor: '#34d399',
                borderRadius: 8,
                paddingVertical: 16,
              }}
              className="shadow-sm"
            >
              <Text className="text-white text-center font-bold">
                {isPending ? 'Logging in...' : 'Login'}
              </Text>
            </View>
            {/* ) : (
              <LinearGradient
                colors={['#34d399', '#3b82f6']}
                style={{ borderRadius: 8, paddingVertical: 16 }}
                className="shadow-sm"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text className="text-white text-center font-bold">
                  {isPending ? 'Logging in...' : 'Login'}
                </Text>
              </LinearGradient>
            )} */}
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
          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push('/auth/set-password')}
          >
            <Text className="text-center text-blue-800 font-medium underline">
              Set Password?
            </Text>
          </TouchableOpacity>

          {/* Verify  Otp Link */}
          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push('/auth/verify-otp')}
          >
            <Text className="text-center text-blue-800 font-medium underline">
              Verify Otp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4"
            onPress={() => completeOnboarding('false')}
          >
            <View
              style={{
                backgroundColor: '#34d399',
                borderRadius: 8,
                paddingVertical: 16,
              }}
              className="shadow-sm"
            >
              <Text className="text-white text-center font-bold">
                reset onboarding
              </Text>
            </View>
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
    </KeyboardAvoidingView>
  );
}
