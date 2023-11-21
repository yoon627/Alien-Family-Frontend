import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "@dietime/react-native-date-picker";
const FirstRegister = ({ navigation }) => {
  const [name, setName] = useState("");
  const [birthday, setBirthDay] = useState(Date.now());
  const [title, setTitle] = useState("");
  const onChangeName = (payload) => setName(payload);
  const onChangeBirthDay = (payload) => setBirthDay(payload);
  const onChangeTitle = (payload) => setTitle(payload);
  var test = ""
  return (
      <View style={styles.container}>
        <View
          style={{
            marginVertical: 30,
            backgroundColor: "black",
            borderRadius: 30,
            paddingHorizontal: 30,
            paddingVertical: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            value={name}
            placeholder="닉네임을 입력해주세요"
            style={styles.input}
            onChangeText={onChangeName}
          />
          {/* <TextInput
          value={birthday}
          placeholder="생년월일을 입력해주세요"
          style={styles.input}
          onChangeText={onChangeBirthDay}
        /> */}
        <Text style={{color:"white",fontSize:25}}>생년월일을 입력해주세요</Text>
          <View>
            <DatePicker
              textColor="white"
              value={birthday}
              onChange={(value) => {
                test = JSON.stringify(value).slice(1, 11);
              }}
            />
          </View>
          <TextInput
            value={title}
            placeholder="역할을 입력해주세요"
            style={styles.input}
            onChangeText={onChangeTitle}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={async () => {
              const SERVER_ADDRESS = await AsyncStorage.getItem(
                "ServerAddress"
              );
              const ServerAccessToken = await AsyncStorage.getItem(
                "ServerAccessToken"
              );
              await axios({
                method: "POST",
                url: SERVER_ADDRESS + "/api/register/user",
                headers: {
                  Authorization: "Bearer: " + ServerAccessToken,
                },
                data: {
                  nickname: name,
                  birthdate: test,
                  title: title,
                },
              })
                .then((resp) => {
                  navigation.navigate("Choose Character");
                })
                .catch(function (error) {
                  console.log("server error", error);
                });
            }}
            style={{
              backgroundColor: "black",
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                marginHorizontal: 30,
                marginVertical: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              제출하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Choose Character")}
            style={{
              backgroundColor: "black",
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                marginHorizontal: 30,
                marginVertical: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              다음페이지로
            </Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 24,
    marginBottom: 16,
  },
  footer: {
    flex: 0.5,
    marginBottom: 5,
    // flexDirection: "row",
    // marginTop: "auto",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 5,
  },
});

export default FirstRegister;
