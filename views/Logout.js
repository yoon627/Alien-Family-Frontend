import React from "react";
import {Alert, Button, Text, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CacheManager from "../components/CacheManager";

export default function Logout({navigation}) {
  return (
    <View>
      <Text>탈퇴하기</Text>
      <Button
        title="탈퇴하기"
        onPress={() => {
          Alert.alert("탈퇴하시겠습니까?", "정말로요?", [
            {
              text: "네!",
              onPress: async () => {
                await CacheManager.clearAllCache();   // 탈퇴 시 캐시 삭제
                const SERVER_ADDRESS = await AsyncStorage.getItem(
                  "ServerAddress"
                );
                const UserServerAccessToken = await AsyncStorage.getItem(
                  "UserServerAccessToken"
                );
                await axios({
                  method: "DELETE",
                  url: SERVER_ADDRESS + "/api/member",
                  headers: {
                    Authorization: "Bearer: " + UserServerAccessToken,
                  },
                })
                  .then(() => {
                    navigation.navigate("Login");
                  })
                  .catch((e) => {
                    console.log(e);
                  });
                // await AsyncStorage.removeItem("UserServerAccessToken");
                // await AsyncStorage.clear();
              },
            },
            {text: "아니오"},
          ]);
        }}
      />
    </View>
  );
}
