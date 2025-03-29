import React, { useState } from 'react';
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

const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(4, 'OTP must be a 4-digit number')
    .regex(/^\d{4}$/, 'OTP must contain only numbers'),
});

type VerifyOtpFormInputs = z.infer<typeof verifyOtpSchema>;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const [resendTimer, setResendTimer] = useState(30);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormInputs>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: VerifyOtpFormInputs) => {
      const response = await axios.post('/api/verify-otp', data);
      return response.data;
    },
    onSuccess: () => {
      alert('OTP verified successfully.');
      router.push('/auth/set-password'); // Redirect to the home page or dashboard
    },
    onError: (error) => {
      console.error('OTP verification failed:', error);
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/resend-otp');
      return response.data;
    },
    onSuccess: () => {
      alert('OTP resent successfully.');
      setResendTimer(30); // Reset the timer
    },
    onError: (error) => {
      console.error('Resend OTP failed:', error);
    },
  });

  const onSubmit = (data: VerifyOtpFormInputs) => {
    verifyOtpMutation.mutate(data);
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
          disabled={verifyOtpMutation.isPending}
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
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
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
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <TouchableOpacity
          className="mt-4"
          onPress={() => resendOtpMutation.mutate()}
          disabled={resendTimer > 0 || resendOtpMutation.isPending}
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
