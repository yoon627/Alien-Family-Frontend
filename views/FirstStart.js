import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FirstStart = ({ navigation }) => {
  const [plantName, setPlantName] = useState("");
  const [ufoName, setUfoName] = useState("");
  const onChangePlantName = (payload) => setPlantName(payload);
  const onChangeUfoName = (payload) => setUfoName(payload);
  const route = useRoute();
  const familyCode = route.params;
  const copyToClipboard = async () => {
    try {
      Clipboard.setStringAsync(familyCode);
      alert("초대코드가 클립보드에 복사되었습니다.");
    } catch {
      alert("초대코드가 없습니다.");
    }
    await Clipboard.setStringAsync(familyCode);
  };
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
          value={plantName}
          placeholder="새싹이 이름을 입력해주세요"
          style={styles.input}
          onChangeText={onChangePlantName}
        />
        <TextInput
          value={ufoName}
          placeholder="우주선 이름을 입력해주세요"
          style={styles.input}
          onChangeText={onChangeUfoName}
        />
      </View>
      <Text>{familyCode}</Text>
      <TouchableOpacity
        onPress={copyToClipboard}
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
          초대코드 복사하기
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
          const ServerAccessToken = await AsyncStorage.getItem(
            "ServerAccessToken"
          );
          await axios({
            method: "POST",
            url: SERVER_ADDRESS + "/api/register/newFamily",
            headers: {
              Authorization: "Bearer: " + ServerAccessToken,
            },
            data: {
              ufoName: ufoName,
              plantName: plantName,
              code: familyCode,
            },
          })
            .then(async (resp) => {
              const UserServerAccessToken =
                resp.data.data.tokenInfo.accessToken;
              const UserServerRefreshToken =
                resp.data.data.tokenInfo.refreshToken;
              await AsyncStorage.setItem(
                "UserServerAccessToken",
                UserServerAccessToken
              );
              await AsyncStorage.setItem(
                "UserServerRefreshToken",
                UserServerRefreshToken
              );
              const members = resp.data.data.familyResponseDto.members;
              var myDB = {};
              for (i = 0; i < members.length; i++) {
                const newkey = members[i].memberId;
                myDB[newkey] = members[i];
              }
              await AsyncStorage.setItem("myDB", JSON.stringify(myDB));
              navigation.navigate("MainDrawer");
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
            marginVertical: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          GO!
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("MainDrawer")}
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
          다음페이지로
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default FirstStart;
