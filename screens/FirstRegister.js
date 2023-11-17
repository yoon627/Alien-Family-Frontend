import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, TextInput } from "react-native";

const FirstRegister = ({ navigation }) => {
  const [name, setName] = useState("");
  const [birthday, setBirthDay] = useState("");
  const [position, setPosition] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>First Register Screen</Text>
      <TextInput value={name} placeholder='닉네임을 입력해주세요' style={styles.input}/>
      <TextInput value={birthday} placeholder='생년월일을 입력해주세요' style={styles.input}/>
      <TextInput value={position} placeholder='역할을 입력해주세요' style={styles.input}/>
      <View style={styles.footer}>
        <Button
          title="Choose Character"
          onPress={() => navigation.navigate("Choose Character")}
        />
      </View>
    </View>
  );
};

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
    marginTop: 'auto',
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

export default FirstRegister;