import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Burnt from 'burnt';
import {
  setPasswordSchema,
  SetPasswordDTO,
  useSetPasswordMutation,
} from '@/hooks/api';

export default function SetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { identifier } = params as { identifier: string };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SetPasswordDTO>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      identifier: identifier,
      previousPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    mutate: setPasswordMutation,
    data: setPasswordData,
    isError: isSetPasswordFailed,
    isSuccess: isSetPasswordSuccessful,
    isPending: isSetPasswordInProgress,
    error: setPasswordError,
  } = useSetPasswordMutation();

  const onSubmit = (data: SetPasswordDTO) => {
    setPasswordMutation(data);
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-green-500 to-blue-700">
      <Animated.View entering={FadeIn} exiting={FadeOut} className="w-4/5">
        <Text className="text-3xl font-bold text-center mb-6 text-gray-700">
          Set Your Password
        </Text>

        <Text>{'phone: ' + identifier}</Text>

        {/* Current Password */}
        <Controller
          name="previousPassword"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="relative">
              <TextInput
                className={`rounded-lg px-4 py-4 mb-2 bg-white focus:border-2 focus:border-blue-800 ${
                  errors.previousPassword
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
                placeholder="Current Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons
                  name={showCurrentPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
              {errors.previousPassword && (
                <Text className="text-red-500 text-sm">
                  {errors.previousPassword.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* New Password */}
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="relative">
              <TextInput
                className={`rounded-lg px-4 py-4 mb-2 bg-white focus:border-2 focus:border-blue-800 ${
                  errors.password
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
                placeholder="New Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
              {errors.password && (
                <Text className="text-red-500 text-sm">
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Confirm Password */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="relative">
              <TextInput
                className={`rounded-lg px-4 py-4 mb-2 bg-white focus:border-2 focus:border-blue-800 ${
                  errors.confirmPassword
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
                placeholder="Confirm Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          className="mt-4"
          onPress={handleSubmit(onSubmit)}
          disabled={isSetPasswordInProgress}
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
                {isSetPasswordInProgress ? 'Updating...' : 'Update Password'}
              </Text>
            </View>
          ) : (
            <LinearGradient
              colors={['#34d399', '#3b82f6']}
              style={{ borderRadius: 8, paddingVertical: 16 }}
              className="shadow-sm"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text className="text-white text-center font-bold">
                {isSetPasswordInProgress ? 'Updating...' : 'Update Password'}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
