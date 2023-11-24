import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function Attendance({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Attendance</Text>
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
