import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToggleButton } from "react-native-paper";
import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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

const ChooseCharacter = ({ navigation }) => {
  const [alienType, setAlienType] = useState("BASIC");
  const [selectedToggle, setSelectedToggle] = useState(0);
  const [activeButton, setActiveButton] = useState(0);
  const [devicePushToken, setDevicePushToken] = useState("");
  const scrollViewRef = useRef(0);
  const imageList = [
    require("../assets/img/character/BASIC.png"),
    require("../assets/img/character/GLASSES.png"),
    require("../assets/img/character/GIRL.png"),
    require("../assets/img/character/BAND_AID.png"),
    require("../assets/img/character/RABBIT.png"),
    require("../assets/img/character/HEADBAND.png"),
    require("../assets/img/character/TOMATO.png"),
    require("../assets/img/character/CHRISTMAS_TREE.png"),
    require("../assets/img/character/SANTA.png"),
    require("../assets/img/character/PIRATE.png"),
  ];
  const iconList = [
    require("../assets/img/characterIcon/BASIC.png"),
    require("../assets/img/characterIcon/GLASSES.png"),
    require("../assets/img/characterIcon/GIRL.png"),
    require("../assets/img/characterIcon/BAND_AID.png"),
    require("../assets/img/characterIcon/RABBIT.png"),
    require("../assets/img/characterIcon/HEADBAND.png"),
    require("../assets/img/characterIcon/TOMATO.png"),
    require("../assets/img/characterIcon/CHRISTMAS_TREE.png"),
    require("../assets/img/characterIcon/SANTA.png"),
    require("../assets/img/characterIcon/PIRATE.png"),
  ];
  const ChooseType = (event) => {
    const { width } = Dimensions.get("window");
    const offset = event.nativeEvent.contentOffset.x;
    const page = Math.round(offset / (width * 0.85 - 20));
    setActiveButton(page);
    if (page >= 0 && page < iconList.length) {
      var type = [
        "BASIC",
        "GLASSES",
        "GIRL",
        "BAND_AID",
        "RABBIT",
        "HEADBAND",
        "TOMATO",
        "CHRISTMAS_TREE",
        "SANTA",
        "PIRATE",
      ];
      setAlienType(type[page]);
      setSelectedToggle(page);
    }
  };
  const handleToggleChange = (value) => {
    // setActiveButton(value);
    const index = value;
    if (index !== -1) {
      scrollViewRef.current.scrollTo({
        x: index * (SCREEN_WIDTH * 0.85 - 20),
        // animated: true,
      });
      var tmp = value;
      var type = [
        "BASIC",
        "GLASSES",
        "GIRL",
        "BAND_AID",
        "RABBIT",
        "HEADBAND",
        "TOMATO",
        "CHRISTMAS_TREE",
        "SANTA",
        "PIRATE",
      ];
      setAlienType(type[tmp]);
      setSelectedToggle(value);
      if (value === index * (SCREEN_WIDTH * 0.85 - 20)) {
        setActiveButton(value);
      }
    }
  };
  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      setDevicePushToken(token);
      await AsyncStorage.setItem("firebaseToken", token);
    });
  }, []);
  return (
    <ImageBackground style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={{ flex: 1, width: 0.85 * SCREEN_WIDTH }}>
            <View style={{ flex: 0.03 }} />
            <View style={{ flex: 0.6, paddingHorizontal: 10 }}>
              <ScrollView
                ref={scrollViewRef}
                indicatorStyle="black"
                pagingEnabled
                horizontal
                onScroll={ChooseType}
                showsHorizontalScrollIndicator={false}
                style={{
                  backgroundColor: "#DED1DF",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                {imageList.map((character, index) => (
                  <View key={index} style={{ flexDirection: "row" }}>
                    <View style={{}} />
                    <View
                      key={index}
                      style={{
                        width: SCREEN_WIDTH * 0.85 - 20,
                        height: SCREEN_HEIGHT * 0.8,
                        justifyContent: "flex-end", // 아래 정렬
                        alignItems: "flex-end", // 오른쪽 정렬
                        overflow: "hidden",
                      }}
                    >
                      <Image source={character} style={styles.character} />
                    </View>
                    <View style={{}} />
                  </View>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                flex: 0.1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: 260,
                }}
              >
                {iconList.map((characterIcon, index) => (
                  <ToggleButton
                    key={index}
                    icon={() => (
                      <Image
                        source={characterIcon}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          resizeMode: "contain",
                          borderColor:
                            activeButton === index ? "#F213A6" : "#DED1DF",
                          borderWidth: 3,
                        }}
                      />
                    )}
                    value={index}
                    style={{ marginRight: index % 5 !== 4 ? 10 : 0 }}
                    onPress={() => {
                      handleToggleChange(index);
                    }}
                  />
                ))}
              </View>
            </View>
            <View style={{ flex: 0.2 }}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View
                  style={{
                    overflow: "hidden",
                    borderRadius: 15,
                    width: 175,
                    marginTop: 20,
                  }}
                >
                  <ImageBackground
                    source={require("../assets/img/pinkBtn.png")}
                  >
                    <TouchableOpacity
                      onPress={async () => {
                        await AsyncStorage.setItem("alienType", alienType);
                        const SERVER_ADDRESS = await AsyncStorage.getItem(
                          "ServerAddress"
                        );
                        const nickname = await AsyncStorage.getItem("nickname");
                        const birthday = await AsyncStorage.getItem("birthday");
                        const familyRole = await AsyncStorage.getItem(
                          "familyRole"
                        );
                        const familyCode = await AsyncStorage.getItem(
                          "familyCode"
                        );
                        const kakaoEmail = await AsyncStorage.getItem(
                          "kakaoEmail"
                        );
                        const plantName = await AsyncStorage.getItem(
                          "plantName"
                        );
                        const ufoName = await AsyncStorage.getItem("ufoName");

                        // console.log(nickname);
                        // console.log(birthday);
                        // console.log(familyRole);
                        // console.log(devicePushToken);
                        // console.log(alienType);
                        // console.log(familyCode);
                        // console.log(kakaoEmail);
                        // console.log(plantName);
                        // console.log(ufoName);
                        if (ufoName && plantName) {
                          await axios({
                            method: "POST",
                            url: SERVER_ADDRESS + "/api/register/newFamily",
                            headers: {},
                            data: {
                              ufoName: ufoName,
                              plantName: plantName,
                              code: familyCode,
                              firebaseToken: devicePushToken,
                              email: kakaoEmail,
                              nickname: nickname,
                              birthdate: birthday,
                              familyRole: familyRole,
                              alienType: alienType,
                            },
                          })
                            .then(async (resp) => {
                              await AsyncStorage.setItem(
                                "UserServerAccessToken",
                                resp.data.data.tokenInfo.accessToken
                              );
                              const members =
                                resp.data.data.familyResponseDto.members;
                              console.log(
                                resp.data.data.familyResponseDto.members[0]
                              );
                              const familyId =
                                resp.data.data.familyResponseDto.familyId;
                              const chatroomId =
                                resp.data.data.familyResponseDto.chatroomId;
                              const plant =
                                resp.data.data.familyResponseDto.plant;
                              var myDB = {};
                              for (let i = 0; i < members.length; i++) {
                                const newkey = members[i].memberId;
                                myDB[newkey] = members[i];
                              }
                              await AsyncStorage.setItem(
                                "myDB",
                                JSON.stringify(myDB)
                              );
                              await AsyncStorage.setItem(
                                "familyId",
                                JSON.stringify(familyId)
                              );
                              await AsyncStorage.setItem(
                                "chatroomId",
                                JSON.stringify(chatroomId)
                              );
                              await AsyncStorage.setItem(
                                "plantInfo",
                                JSON.stringify(plant)
                              );
                              // navigation.navigate("MainDrawer");
                            })
                            .catch((e) => console.log(e));
                        } else {
                          await axios({
                            method: "POST",
                            url: SERVER_ADDRESS + "/api/register/currentFamily",
                            headers: {},
                            data: {
                              code: familyCode,
                              firebaseToken: devicePushToken,
                              email: kakaoEmail,
                              nickname: nickname,
                              birthdate: birthday,
                              familyRole: familyRole,
                              alienType: alienType,
                            },
                          })
                            .then(async (resp) => {
                              await AsyncStorage.setItem(
                                "UserServerAccessToken",
                                resp.data.data.tokenInfo.accessToken
                              );
                              const members =
                                resp.data.data.familyResponseDto.members;
                              const familyId =
                                resp.data.data.familyResponseDto.familyId;
                              const chatroomId =
                                resp.data.data.familyResponseDto.chatroomId;
                              const plant =
                                resp.data.data.familyResponseDto.plant;
                              var myDB = {};
                              for (let i = 0; i < members.length; i++) {
                                const newkey = members[i].memberId;
                                myDB[newkey] = members[i];
                              }
                              await AsyncStorage.setItem(
                                "myDB",
                                JSON.stringify(myDB)
                              );
                              await AsyncStorage.setItem(
                                "familyId",
                                JSON.stringify(familyId)
                              );
                              await AsyncStorage.setItem(
                                "chatroomId",
                                JSON.stringify(chatroomId)
                              );
                              await AsyncStorage.setItem(
                                "plantInfo",
                                JSON.stringify(plant)
                              );
                              navigation.navigate("MainDrawer");
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
                        선택완료!
                      </Text>
                    </TouchableOpacity>
                  </ImageBackground>
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
                  <ImageBackground
                    source={require("../assets/img/grayBtn.png")}
                  >
                    <TouchableOpacity
                      onPress={async () => {
                        navigation.navigate("FirstRegister");
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
                        이전 페이지로
                      </Text>
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              </View>
            </View>
          </View>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 30,
    marginVertical: 40,
    borderRadius: 30,
  },
  character: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.75 * 0.9,
    resizeMode: "contain",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "white",
  },
});

export default ChooseCharacter;
