import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'react-native-linear-gradient';

const setPasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords must match',
        path: ['confirmPassword'], // points the error to confirmPassword
      });
    }
  });

// const setPasswordSchema = z.object({
//   currentPassword: z.string().min(6, 'Current password is required'),
//   newPassword: z.string().min(6, 'New password must be at least 6 characters'),
//   confirmPassword: z
//     .string()
//     .min(6, 'Confirm password must be at least 6 characters')
//     .superRefine((val, ctx) => {
//       const newPassword = ctx.parent?.newPassword;
//       if (val !== newPassword) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'Passwords must match',
//         });
//       }
//     }),
// });

type SetPasswordFormInputs = z.infer<typeof setPasswordSchema>;

export default function SetPasswordScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordFormInputs>({
    resolver: zodResolver(setPasswordSchema),
  });

  const setPasswordMutation = useMutation({
    mutationFn: async (data: SetPasswordFormInputs) => {
      const response = await axios.post('/api/set-password', data);
      return response.data;
    },
    onSuccess: () => {
      router.push('/auth/signin');
    },
    onError: (error) => {
      console.error('Set password failed:', error);
    },
  });

  const onSubmit = (data: SetPasswordFormInputs) => {
    setPasswordMutation.mutate(data);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-green-500 to-blue-700">
      <Animated.View entering={FadeIn} exiting={FadeOut} className="w-4/5">
        <Text className="text-3xl font-bold text-center mb-6 text-gray-700">
          Set Your Password
        </Text>

        {/* Current Password */}
        <Controller
          name="currentPassword"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                className={`rounded-lg px-4 py-4 mb-2 bg-white focus:border-2 focus:border-blue-800 ${
                  errors.currentPassword
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
                placeholder="Current Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
              {errors.currentPassword && (
                <Text className="text-red-500 text-sm">
                  {errors.currentPassword.message}
                </Text>
              )}
            </>
          )}
        />

        {/* New Password */}
        <Controller
          name="newPassword"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                className={`rounded-lg px-4 py-4 mb-2 bg-white focus:border-2 focus:border-blue-800 ${
                  errors.newPassword
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
                placeholder="New Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
              {errors.newPassword && (
                <Text className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Confirm Password */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
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
                secureTextEntry
              />
              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          className="mt-4"
          onPress={handleSubmit(onSubmit)}
          disabled={setPasswordMutation.isPending}
        >
          <LinearGradient
            colors={['#34d399', '#3b82f6']}
            style={{ borderRadius: 8, paddingVertical: 16 }}
            className="shadow-lg"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text className="text-white text-center font-bold">
              {setPasswordMutation.isPending
                ? 'Updating...'
                : 'Update Password'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
