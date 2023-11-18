import React from "react";
import { View, Text, Button, StyleSheet, ScrollView, Dimensions,TextInput } from "react-native";


const ClickBox = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
          title="박스를 눌러보세요!"
          onPress={() => navigation.navigate("First Start")}
        />
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

export default ClickBox;
