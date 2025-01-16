import { useRouter } from 'expo-router';
import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { Button, Paragraph, TextInput, Title } from 'react-native-paper';

export default function SignUp() {
  const [firstName, setFirstName] = React.useState('');
  const [middleName, setMiddleName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <Text>SignUp</Text> */}
      <Title style={styles.title}>Sign Up Now!</Title>
      <Paragraph>Please sign up to find Edir neer you</Paragraph>

      <TextInput
        label="First Name"
        mode="outlined"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
        style={styles.input}
        // keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Middle Name"
        mode="outlined"
        value={middleName}
        onChangeText={(text) => setMiddleName(text)}
        style={styles.input}
        // keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Last Name"
        mode="outlined"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
        style={styles.input}
        // keyboardType="email-address"
        autoCapitalize="none"
      />

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
        secureTextEntry
        right={<TextInput.Icon icon="eye" />}
        autoCapitalize="none"
      />

      <Button mode="contained">Sign Up</Button>

      <Button mode="text" onPress={() => router.replace('/(auth)/sign-in')}>
        Already have an account? Sign In
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 16,
    // alignItems: 'center',
    justifyContent: 'center',
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
