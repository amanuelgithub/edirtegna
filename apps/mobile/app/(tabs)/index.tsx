import { StyleSheet, View, Text } from "react-native";

import { useEffect, useState } from "react";
import { trpc } from "@mobile/utils/trpc";

export default function HomeScreen() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    trpc.hello.query({ name: "Amanuel" }).then((res) => {
      setGreeting(res.greeting);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>{greeting}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
