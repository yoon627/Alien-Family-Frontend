import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert } from "react-native";

const FCM_SERVER_KEY =
  "AAAAUCMBJiU:APA91bEs9fOJNe6l2ILHFI88jep5rw9wqR-qTWWbBrKxj7JQnKQ8ZAp4tJbn_yXcL2aP0ydygPIcT89XB6h38vhIozsJ5J61s7w2znBL9hPQG6a18sQcUFkMitr2pkvoCmmfslVQmk-u";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

const FirstStart = ({ navigation }) => {
  const [devicePushToken, setDevicePushToken] = useState("");
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
                  value={plantName}
                  placeholder="새싹이 이름을 입력해주세요"
                  style={{
                    ...styles.input,
                    borderColor: "#F213A6",
                    borderWidth: 3,
                    marginBottom: 10,
                    width: 250,
                    height: 70,
                  }}
                  onChangeText={onChangePlantName}
                />
              </View>
              <View>
                <TextInput
                  value={ufoName}
                  placeholder="우주선 이름을 입력해주세요"
                  style={{
                    ...styles.input,
                    borderColor: "#F213A6",
                    borderWidth: 3,
                    marginBottom: 10,
                    width: 250,
                    height: 70,
                  }}
                  onChangeText={onChangeUfoName}
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
                    // console.log(plantName, ufoName);
                    await AsyncStorage.setItem("plantName", plantName);
                    await AsyncStorage.setItem("ufoName", ufoName);
                    if (!plantName) {
                      Alert.alert("새싹이 이름을 지어주세요");
                    } else if (!ufoName) {
                      Alert.alert("우주선 이름을 지어주세요");
                    } else {
                      navigation.navigate("FirstRegister", {
                        cameFrom: "FirstStart",
                      });
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
                  onPress={() => navigation.navigate("ClickBox")}
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

export default FirstStart;
