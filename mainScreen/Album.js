import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Album({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Album</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
