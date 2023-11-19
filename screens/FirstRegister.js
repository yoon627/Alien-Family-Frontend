import axios from "axios";
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FirstRegister = ({ navigation }) => {
  const [name, setName] = useState("");
  const [birthday, setBirthDay] = useState("");
  const [position, setPosition] = useState("");
  const onChangeName = (payload) => setName(payload);
  const onChangeBirthDay = (payload) => setBirthDay(payload);
  const onChangePosition = (payload) => setPosition(payload);
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>First Register Screen</Text>
      <TextInput
        value={name}
        placeholder="닉네임을 입력해주세요"
        style={styles.input}
        onChangeText={onChangeName}
      />
      <TextInput
        value={birthday}
        placeholder="생년월일을 입력해주세요"
        style={styles.input}
        onChangeText={onChangeBirthDay}
      />
      <TextInput
        value={position}
        placeholder="역할을 입력해주세요"
        style={styles.input}
        onChangeText={onChangePosition}
      />
      <View style={styles.footer}>
        <Button
          title="Choose Character"
          onPress={async () =>
            {
              const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
              const ServerAccessToken = await AsyncStorage.getItem("ServerAccessToken");
              await axios({
              method: "POST",
              url: SERVER_ADDRESS + "/api/register/user",
              headers: {
                Authorization: 'Bearer: '+ServerAccessToken,
              },
              data: {
                nickname: name,
                birthdate: birthday,
                title: position,
              },
            })
              .then((resp) => {
                navigation.navigate("Choose Character");
              })
              .catch(function (error) {
                console.log("server error", error);
              })}
          }
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
    marginTop: "auto",
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
