import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";

const ClickBox = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={async () => {
          const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
          const ServerAccessToken = await AsyncStorage.getItem(
            "ServerAccessToken"
          );
          await axios({
            method: "GET",
            url: SERVER_ADDRESS + "/api/register/familyCode",
            headers: {
              Authorization: "Bearer: " + ServerAccessToken,
            },
          })
            .then(async (resp) => {
              const familyCode = resp.data;
              await AsyncStorage.setItem("familyCode", familyCode);
              navigation.navigate("First Start", familyCode);
            })
            .catch(function (error) {
              console.log("server error", error);
            });
        }}
      >
        <Entypo name="box" size={100} color="black" />
      </TouchableOpacity>
      <Text>박스를 눌러주세요!</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("First Start")}
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
});

export default ClickBox;
