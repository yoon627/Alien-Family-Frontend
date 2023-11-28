import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRoute} from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const getAllKeys = async () => {
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      // 키를 가져오는데 에러 발생 시 처리
    }
    return keys;
  };

  const clearAll = async () => {
    try {
      const keys = await getAllKeys();
      await AsyncStorage.multiRemove(keys);
      console.log("캐시 삭제완료");
    } catch (e) {
      console.log("캐시 삭제에러");
    }
  };
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setDevicePushToken(token),
    );
  }, []);
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
          const ServerAccessToken =
            await AsyncStorage.getItem("ServerAccessToken");
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
              firebaseToken: devicePushToken,
            },
          })
            .then(async (resp) => {
              const UserServerAccessToken =
                resp.data.data.tokenInfo.accessToken;
              const UserServerRefreshToken =
                resp.data.data.tokenInfo.refreshToken;
              await AsyncStorage.setItem(
                "UserServerAccessToken",
                UserServerAccessToken,
              );
              await AsyncStorage.setItem(
                "UserServerRefreshToken",
                UserServerRefreshToken,
              );
              const members = resp.data.data.familyResponseDto.members;
              const familyId = resp.data.data.familyResponseDto.familyId;
              const chatroomId = resp.data.data.familyResponseDto.chatroomId;
              const plant = resp.data.data.familyResponseDto.plant;

              var myDB = {};
              for (let i = 0; i < members.length; i++) {
                const newkey = members[i].memberId;
                myDB[newkey] = members[i];
              }
              await AsyncStorage.setItem("myDB", JSON.stringify(myDB));
              await AsyncStorage.setItem("familyId", JSON.stringify(familyId));
              await AsyncStorage.setItem(
                "chatroomId",
                JSON.stringify(chatroomId),
              );
              await AsyncStorage.setItem("plantInfo", JSON.stringify(plant));
              await AsyncStorage.setItem(
                "devicePushToken",
                JSON.stringify(devicePushToken),
              );
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

      <TouchableOpacity
        onPress={clearAll}
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
          캐시삭제
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