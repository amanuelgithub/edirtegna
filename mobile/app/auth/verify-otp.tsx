import React, { useEffect, useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'react-native-linear-gradient';
// import Toast from 'react-native-toast-message';
import * as Burnt from 'burnt';
import { useVerifyOtpMutation, useResendOtpMutation } from '@/hooks/api';

const verifyOtpFormSchema = z.object({
  otp: z
    .string()
    .length(4, 'OTP must be a 4-digit number')
    .regex(/^\d{4}$/, 'OTP must contain only numbers'),
});

type VerifyOtpFormInputs = z.infer<typeof verifyOtpFormSchema>;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [resendTimer, setResendTimer] = useState(3);

  const { phone } = params as { phone: string };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormInputs>({
    resolver: zodResolver(verifyOtpFormSchema),
  });

  const {
    mutate: verifyOtpMutation,
    data: verifiedOtpData,
    isError: isOtpVerificationFailed,
    isSuccess: isOtpValidationSuccessful,
    isPending: isOtpVerificationInProgress,
    error: verificationError,
  } = useVerifyOtpMutation();
  const {
    mutate: resendOtpMutation,
    data: resendOtpData,
    isError: resendOtpError,
    isSuccess: resendOtpSuccess,
    isPending: resendOtpPending,
    error: resendOtpErrorData,
  } = useResendOtpMutation();

  useEffect(() => {
    if (isOtpValidationSuccessful) {
      router.push('/auth/set-password');
    }
    if (isOtpVerificationFailed && verificationError) {
      console.log('Error verifying OTP:', verificationError);
      // Handle error state
      Burnt.toast({
        title: 'Error verifying OTP',
        preset: 'error',
        message: 'Please try again.',
        from: 'top',
        // optionally customize layout
        // layout: {
        //   iconSize: {
        //     height: 24,
        //     width: 24,
        //   },
        // },
      });
    }
  }, [
    isOtpValidationSuccessful,
    isOtpVerificationFailed,
    verifiedOtpData,
    verificationError,
  ]);

  useEffect(() => {
    if (resendOtpSuccess) {
      Burnt.toast({
        title: 'OTP resent successfully.',
        preset: 'done',
        message: 'Please check your email or phone.',
        from: 'top',
      });
      setResendTimer(3); // Reset the timer
    }

    if (resendOtpError && resendOtpErrorData) {
      // Handle error state
      Burnt.toast({
        title: 'Error resending OTP',
        preset: 'error',
        message: 'Please try again.',
        from: 'top',
      });
    }
  }, [resendOtpSuccess, resendOtpError, resendOtpErrorData]);

  const onSubmit = (data: VerifyOtpFormInputs) => {
    verifyOtpMutation({ ...data, identifier: phone });
  };

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

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

        <Text>{'phone number is: ' + phone}</Text>

        <Text className="text-3xl font-bold text-center mb-2 text-gray-700">
          Verify OTP
        </Text>
        <Text className="text-center text-gray-600 mb-6">
          Enter the 4-digit code sent to your email or phone number.
        </Text>

        <Controller
          name="otp"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                className={`rounded-lg px-4 py-4 mb-2 bg-white focus:border-2 focus:border-blue-800 text-center text-xl ${
                  errors.otp
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
                placeholder="Enter OTP"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                maxLength={4}
              />
              {errors.otp && (
                <Text className="text-red-500 text-sm">
                  {errors.otp.message}
                </Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          className="mt-4"
          onPress={handleSubmit(onSubmit)}
          disabled={isOtpVerificationInProgress}
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
                {isOtpVerificationInProgress ? 'Verifying...' : 'Verify OTP'}
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
                {isOtpVerificationInProgress ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <TouchableOpacity
          className="mt-4"
          onPress={() => resendOtpMutation({ identifier: phone })}
          disabled={resendTimer > 0 || resendOtpPending}
        >
          <Text
            className={`text-center font-bold ${
              resendTimer > 0 ? 'text-gray-400' : 'text-blue-800'
            }`}
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </Text>
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
