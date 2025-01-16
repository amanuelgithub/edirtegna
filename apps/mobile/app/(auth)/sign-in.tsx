import { router } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

import { useSession } from '@mobile/state/context';
import { Button, Paragraph, TextInput, Title } from 'react-native-paper';
import { useState } from 'react';

export default function SignIn() {
  const { signIn } = useSession();
  //

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [togglePasswordVisibility, setTogglePasswordVisibility] =
    useState(true);

  const handleLogin = () => {
    setLoading(true);

    // Simulate an API call
    setTimeout(() => {
      console.log('Email:', email);
      console.log('Password:', password);
      setLoading(false);

      signIn();
      router.replace('/');
    }, 2000);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
      {/* <Text
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/');
        }}
      >
        Sign In
      </Text> */}

      <Title style={styles.title}>Welcome Back!</Title>
      <Paragraph>Please log in to continue</Paragraph>

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        secureTextEntry={togglePasswordVisibility}
        right={
          <TextInput.Icon
            icon={togglePasswordVisibility ? 'eye' : 'eye-off'}
            // forceTextInputFocus={false}
            onPress={() => setTogglePasswordVisibility((prev) => !prev)}
          />
        }
        autoCapitalize="none"
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        // style={styles.button}
        loading={loading}
        disabled={loading}
        style={{ marginBottom: 8 }}
      >
        Log In
      </Button>

      <Button
        mode="contained-tonal"
        onPress={() => router.push('/(auth)/sign-up')}
      >
        Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
