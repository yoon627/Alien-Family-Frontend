import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ImagePickerComponent from "../components/ImagePicker";

export default function Album({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Album</Text>
      <ImagePickerComponent />
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
