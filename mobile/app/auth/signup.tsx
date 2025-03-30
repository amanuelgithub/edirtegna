import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'react-native-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const signupSchema = z.object({
  identifier: z.string().email('Invalid email address'),
  termsAccepted: z
    .boolean()
    .refine((val) => val, 'You must accept the terms and conditions'),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

export default function SignUpScreen() {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormInputs) => {
      const response = await axios.post('/api/signup', data);
      return response.data;
    },
    onSuccess: () => {
      router.push('/auth/signin');
    },
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });

  const onSubmit = (data: SignupFormInputs) => {
    signupMutation.mutate({ ...data, termsAccepted });
  };

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
            Create an Account
          </Text>

          <Controller
            name="identifier"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  className={`rounded-lg px-4 py-4 mb-2 bg-white focus:border-2 focus:border-blue-800 ${
                    errors.identifier
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
                {errors.identifier && (
                  <Text className="text-red-500 text-sm">
                    {errors.identifier.message}
                  </Text>
                )}
              </>
            )}
          />

          {/* Terms and Conditions */}
          <View className="flex-row items-center mt-4">
            <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)}>
              <LinearGradient
                colors={
                  termsAccepted
                    ? ['#34d399', '#3b82f6']
                    : ['#f3f4f6', '#f3f4f6']
                }
                className={`w-6 h-6 rounded-sm border justify-center items-center`}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {termsAccepted && (
                  <MaterialIcons name="check" size={18} color="white" />
                )}
              </LinearGradient>
            </TouchableOpacity>
            <Text className="ml-2 text-gray-700">
              I agree to the{' '}
              <Text className="text-blue-800 underline">
                Terms and Conditions
              </Text>
            </Text>
          </View>
          {errors.termsAccepted && (
            <Text className="text-red-500 text-sm mt-2">
              {errors.termsAccepted.message}
            </Text>
          )}

          <TouchableOpacity
            className="mt-4"
            onPress={handleSubmit(onSubmit)}
            disabled={signupMutation.isPending}
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
                  {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
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
                  {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
                </Text>
              </LinearGradient>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity
            className="bg-white rounded-lg py-4 mt-4 shadow-sm"
            onPress={() => router.push('/auth/signin')}
          >
            <Text className="text-center text-blue-800 font-bold">
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
