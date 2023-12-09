import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getDevicePushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token.data;
}

const { width } = Dimensions.get("window");

const InvitationScreen = ({ navigation }) => {
  const [devicePushToken, setDevicePushToken] = useState("");
  const [InvitationCode, setInvitationCode] = useState("");
  const onChangeInvitationCode = (payload) => setInvitationCode(payload);
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setDevicePushToken(token)
    );
  }, []);
  return (
    <ImageBackground
      source={require("../assets/img/pinkBtn.png")}
      style={styles.backgroundImage}
    >
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 30,
            flex: 0.5,
            width: 0.85 * width,
          }}
        >
          <View
            style={{
              marginTop: 35,
              flex: 0.9,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                marginVertical: 5,
                borderRadius: 30,
                paddingHorizontal: 30,
                paddingVertical: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View>
                <TextInput
                  value={InvitationCode}
                  placeholder="초대코드를 입력해주세요"
                  style={{
                    ...styles.input,
                    borderColor: "#F213A6",
                    borderWidth: 3,
                    marginBottom: 10,
                    height: 70,
                  }}
                  onChangeText={onChangeInvitationCode}
                />
              </View>
            </View>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <View
              style={{
                overflow: "hidden",
                borderRadius: 15,
                width: 175,
                marginTop: 20,
              }}
            >
              <ImageBackground source={require("../assets/img/pinkBtn.png")}>
                <TouchableOpacity
                  onPress={async () => {
                    const SERVER_ADDRESS = await AsyncStorage.getItem(
                      "ServerAddress"
                    );
                    if (!InvitationCode) {
                      Alert.alert("초대코드를 입력해주세요");
                    } else {
                      // console.log(InvitationCode);
                      await axios({
                        method: "GET",
                        url:
                          SERVER_ADDRESS +
                          "/api/register/familyCode/" +
                          InvitationCode,
                      })
                        .then(async (resp) => {
                          // console.log(resp);
                          if (resp.data.data) {
                            await AsyncStorage.removeItem("ufoName");
                            await AsyncStorage.removeItem("plantName");
                            await AsyncStorage.setItem(
                              "familyCode",
                              InvitationCode
                            )
                              .then(async () => {
                                await axios({
                                  method: "GET",
                                  url:
                                    SERVER_ADDRESS +
                                    "/api/familyInfo/" +
                                    InvitationCode,
                                })
                                  .then((resp) => {
                                    // console.log(resp.data.data.roles);
                                    const roles = resp.data.data.roles;
                                    var roleArr = [];
                                    for (let i = 0; i < roles.length; i++) {
                                      if (roles[i]["enabled"]) {
                                        roleArr.push(roles[i]["role"]);
                                      }
                                    }
                                    // console.log(roleArr);
                                    navigation.navigate("FirstRegister", {
                                      roleArr: roleArr,
                                    });
                                  })
                                  .catch((e) => console.log(e));
                              })
                              // .then(() => console.log("hi"))
                              .catch((e) => console.log(e));
                          } else {
                            Alert.alert("유효하지 않은 초대코드입니다");
                          }
                        })
                        .catch((e) => console.log(e));
                    }
                  }}
                  style={{
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
                    제출하기
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <View style={{ overflow: "hidden", borderRadius: 15, width: 175 }}>
              <ImageBackground source={require("../assets/img/grayBtn.png")}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Greet")}
                  style={{
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
                    이전 페이지로
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontSize: 18,
    marginVertical: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default InvitationScreen;
