import React, {useCallback, useRef, useState, useEffect} from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Notifications from "expo-notifications";
import FamilyInfo from "./FamilyInfo";
import MainDrawer from "./MainDrawer";
import MainScreen from "./MainScreen";
import {LongPressGestureHandler, State} from "react-native-gesture-handler";

const saveServer = async () => {
  try {
    await AsyncStorage.setItem("ServerAddress", "http://43.202.241.133:1998");
    await AsyncStorage.setItem(
      "FcmServerKey",
      "AAAAUCMBJiU:APA91bEs9fOJNe6l2ILHFI88jep5rw9wqR-qTWWbBrKxj7JQnKQ8ZAp4tJbn_yXcL2aP0ydygPIcT89XB6h38vhIozsJ5J61s7w2znBL9hPQG6a18sQcUFkMitr2pkvoCmmfslVQmk-u"
    );
  } catch (error) {
    console.log(error);
  }
};

const getData = async () => {
  try {
    const token = await AsyncStorage.getItem("UserServerAccessToken");
  } catch (error) {
    console.error("Error getMsg:", error);
  }
};

getData();

const Login = ({ navigation }) => {
  const [admin, setAdmin] = useState("");
  const onChangeAdmin = (payload) => setAdmin(payload);
  const [isButtonPressed, setButtonPressed] = useState(false);
  const [notification, setNotification] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const notificationListener = useRef();
  const onHandlerStateChange = useCallback(
    (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        // Long press가 활성화된 경우
        // console.log("Hello");
        onLongPress();
      }
    },
    [onLongPress]
  );
  const onLongPress = () => {
    // console.log("Long press activated!");
    // 10초 동안 눌렸을 때 실행되는 함수
    setModalVisible(true);
  };
  saveServer();
  let pressTimeout;

  const handlePressIn = () => {
    pressTimeout = setTimeout(() => {
      // 버튼을 누르고 있을 때의 동작을 여기에 추가
      // console.log("Button Pressed and Held!");
    }, 1000); // 10초 동안 버튼을 누르고 있어야 동작
    setModalVisible(true);
  };

  const handlePressOut = () => {
    clearTimeout(pressTimeout);
    // setModalVisible(false);
  };
  return (
    <ImageBackground
      source={require("../assets/img/loginScreen.png")}
      style={styles.backgroundImage}
    >
      <View style={{flex: 1}}>
        <View style={{flex: 7}}/>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.button, styles.transparentButton]}
        ></TouchableOpacity>
        <Modal
          animationType="none" // 모달이 나타날 때의 애니메이션 유형
          transparent={true} // 배경 투명하게
          visible={modalVisible} // 모달의 표시 여부
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                value={admin}
                placeholder="Code?"
                onChangeText={onChangeAdmin}
              />
              <TouchableOpacity
                onPress={async () => {
                  await axios({
                    method: "GET",
                    url: "http://43.202.241.133:1998/api/1/master/" + admin,
                  })
                    .then(async (resp) => {
                      if (resp.data.code === 12345) {
                        Alert.alert(" ","Wrong Code");
                      } else {
                        const t = resp.data.data.tokenInfo.accessToken;
                        await axios({
                          method: "GET",
                          url: "http://43.202.241.133:1998/api/login/token",
                          headers: {
                            Authorization: "Bearer " + t,
                          },
                        })
                          .then(async (resp) => {
                            const test = await AsyncStorage.getItem("test");
                            // console.log(test);
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
                            await AsyncStorage.setItem(
                              "UserServerAccessToken",
                              resp.data.data.tokenInfo.accessToken
                            );
                            // console.log(members);
                            // console.log(chatroomId);
                            // console.log(familyId);
                            // console.log(plant);
                            // console.log(myDB);
                          })
                          .then(() => {
                            setModalVisible(false);
                            navigation.navigate("MainDrawer");
                          })
                          .catch((e) => navigation.navigate("KaKaoLogin"));
                      }
                    })
                    .catch((e) => console.log(e));
                }}
              >
                <Text>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View
          style={{flex: 1.5, justifyContent: "center", alignItems: "center"}}
        >
          <Text
            style={{
              color: "white",
              fontSize: 35,
              lineHeight: 45,
              marginTop: 40,
              fontFamily: "dnf",
            }}
          >
            ALIEN
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 35,
              lineHeight: 45,
              fontFamily: "dnf",
            }}
          >
            FAMILY
          </Text>
          <Text style={{color: "white", marginVertical: 10}}>
            당신의 가족을 찾아보세요!
          </Text>
        </View>
        <View
          style={{
            flex: 1.5,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 3,
          }}
        >
          <View style={{overflow: "hidden", borderRadius: 15, width: 175}}>
            <ImageBackground source={require("../assets/img/pinkBtn.png")}>
              <TouchableOpacity
                onPressIn={() => setButtonPressed(true)}
                onPressOut={() => setButtonPressed(false)}
                onPress={async () => {
                  const SERVER_ADDRESS = await AsyncStorage.getItem(
                    "ServerAddress"
                  );
                  const UserServerAccessToken = await AsyncStorage.getItem(
                    "UserServerAccessToken"
                  );
                  if (UserServerAccessToken) {
                    await axios({
                      method: "GET",
                      url: SERVER_ADDRESS + "/api/login/token",
                      headers: {
                        Authorization: "Bearer " + UserServerAccessToken,
                      },
                    })
                      .then(async (resp) => {
                        const members =
                          resp.data.data.familyResponseDto.members;
                        const familyId =
                          resp.data.data.familyResponseDto.familyId;
                        const chatroomId =
                          resp.data.data.familyResponseDto.chatroomId;
                        const plant = resp.data.data.familyResponseDto.plant;
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
                        await AsyncStorage.setItem(
                          "UserServerAccessToken",
                          resp.data.data.tokenInfo.accessToken
                        );
                      })
                      .then(() => {
                        navigation.navigate("MainDrawer");
                      })
                      .catch((e) => navigation.navigate("KaKaoLogin"));
                  } else {
                    navigation.navigate("KaKaoLogin");
                  }
                }}
                style={[
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                  },
                  isButtonPressed && styles.pressedButton,
                ]}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "white",
                    marginHorizontal: 20,
                    marginVertical: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  Start!
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // 또는 'contain' 등 이미지 사이즈 조정
  },
  pressedButton: {
    backgroundColor: "purple", // 눌렸을 때의 색상
  },
  transparentButton: {
    position: "absolute",
    top: 50, // 상단 위치 조절
    alignSelf: "center", // 가운데 정렬
    padding: 10,
    width: 100,
    height: 100,
    // backgroundColor: "rgba(255, 255, 255, 0.3)", // 투명한 배경 색상
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명한 배경
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default Login;
