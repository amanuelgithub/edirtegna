import { StyleSheet, View, Text } from 'react-native';

import { Button } from 'react-native-paper';

import { useEffect, useState } from 'react';
import { trpc } from '@mobile/utils/trpc';

export default function HomeScreen() {
  const usersQuery = trpc.users.findUsers.useQuery();
  const mutation = trpc.users.create.useMutation();

  useEffect(() => {
    console.log(usersQuery.data);
  }, []);

  const addUser = () => {
    mutation.mutate({ name: 'another test' });
  };

  return (
    <View style={styles.container}>
      {usersQuery.data &&
        usersQuery.data.map((user) => {
          return (
            <View key={user.id}>
              <Text>{user.id}</Text>
              <Text>{user.name}</Text>
            </View>
          );
        })}

      <Button icon="camera" mode="contained" onPress={addUser}>
        Add User
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
