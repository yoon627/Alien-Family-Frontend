import React from "react";
import { View, Text, Button, StyleSheet, ScrollView, Dimensions,TextInput } from "react-native";

export default function FamilyInfo({navigation}){
  return (
    <View style={styles.container}>
      <Text>FamilyInfo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});