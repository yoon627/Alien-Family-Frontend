import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import * as Clipboard from 'expo-clipboard';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FirstStart = ({ navigation }) => {
  const [plantName, setPlantName] = useState("");
  const [ufoName, setUfoName] = useState("");
  const onChangePlantName = (payload) => setPlantName(payload);
  const onChangeUfoName = (payload) => setUfoName(payload);
  const route = useRoute();
  const familyCode = route.params;
  const copyToClipboard = async() => {
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
      {/* <Text>{familyCode}</Text> */}
      <Button
        title="초대코드 복사하기"
        onPress={
          copyToClipboard
        }
      />
      <Button
        title="Go"
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
            .then(async(resp) => {
              const UserServerAccessToken = resp.data.data.tokenInfo.accessToken;
              const UserServerRefreshToken = resp.data.data.tokenInfo.refreshToken;
              await AsyncStorage.setItem("UserServerAccessToken",UserServerAccessToken);
              await AsyncStorage.setItem("UserServerRefreshToken",UserServerRefreshToken);
              navigation.navigate("MainDrawer");
            })
            .catch(function (error) {
              console.log("server error", error);
            });
        }}
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

export default FirstStart;
