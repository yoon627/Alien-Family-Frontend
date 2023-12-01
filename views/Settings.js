import React from "react";
import { StyleSheet, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ChoseCalendar from "./ChoseCalendar";

const Drawer = createDrawerNavigator();
export default function Settings({ navigation }) {
  return (
    <View style={styles.container}>
      <ChoseCalendar />
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
