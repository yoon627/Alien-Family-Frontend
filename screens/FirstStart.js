import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function FirstStart({ navigation }) {
  return (
    <View style={styles.container}>
      <TextInput placeholder='새싹이 이름을 입력해주세요' style={styles.input}/>
      <TextInput placeholder='우주선 이름을 입력해주세요' style={styles.input}/>
      <Text>초대코드:ABCDE</Text>
      <Button title="Go" onPress={() => navigation.navigate("MainDrawer")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    marginTop: "auto",
  },
  character: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  characterFont: {
    fontSize: 500,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
});
