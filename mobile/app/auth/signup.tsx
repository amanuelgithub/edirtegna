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
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'react-native-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { RegisterDTO, registerSchema, useRegisterMutation } from '@/hooks/api';
import { z } from 'zod';

export const registerFormSchema = z.object({
  identifier: z
    .string()
    .min(9, 'Phone number must be at least 9 digits')
    .max(9, 'Phone number must be at most 9 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  // termsAccepted: z
  //   .boolean()
  //   .refine((val) => val, 'You must accept the terms and conditions'),
});

type RegisterFormInputs = z.infer<typeof registerFormSchema>;

export default function SignUpScreen() {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerFormSchema),
  });

  const { mutate: register, isError, isPending, error } = useRegisterMutation();

  const onSubmit = async (data: RegisterFormInputs) => {
    // if (!termsAccepted) {
    //   return;
    // }
    console.log('Submitting data:', data);

    try {
      register({
        phone: data?.identifier,
        // phone: `+251${data.identifier}`,
      });
    } catch (err) {
      console.error('Signup failed:', err);
    }
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
          Create an Account
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

        {/* Terms and Conditions */}
        <View className="flex-row items-center mt-4">
          <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)}>
            <LinearGradient
              colors={
                termsAccepted ? ['#34d399', '#3b82f6'] : ['#f3f4f6', '#f3f4f6']
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
          disabled={isPending}
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
                {isPending ? 'Signing up...' : 'Sign Up'}
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
                {isPending ? 'Signing up...' : 'Sign Up'}
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
  );
}
