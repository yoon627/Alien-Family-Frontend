import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
  Button,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import MarqueeText from "react-native-marquee";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "../redux/Slicers/counterSlice";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(devicePushToken) {
  const message = {
    to: devicePushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

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
    // token = await Notifications.getExpoPushTokenAsync({
    //   projectId: Constants.expoConfig.extra.eas.projectId,
    // });
    token = await Notifications.getDevicePushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token.data;
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter.value);
  const [TMI, setTMI] = useState("");
  const onChangeTMI = (payload) => setTMI(payload);
  const [modalVisible, setModalVisible] = useState(false);
  const [todayTMI, setTodayTMI] = useState("");
  const [flower, setFlower] = useState(false);
  const [plant, setPlant] = useState(null);
  const [devicePushToken, setDevicePushToken] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    async function fetchData() {
      const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
      const UserServerAccessToken = await AsyncStorage.getItem(
        "UserServerAccessToken"
      );
      const familyId = await AsyncStorage.getItem("familyId");
      await axios({
        method: "GET",
        url: SERVER_ADDRESS + "/familyTmi",

        headers: {
          Authorization: "Bearer: " + UserServerAccessToken,
        },
      })
        .then((resp) => {
          const tmis = resp.data;
          var mytmi = "";
          for (i = 0; i < tmis.length; i++) {
            mytmi = mytmi + tmis[i].writer + ": " + tmis[i].content + "  ";
          }
          setTodayTMI(mytmi);
        })
        .catch((e) => console.log(e));
    }
    fetchData();

    registerForPushNotificationsAsync().then((token) =>
      // setExpoPushToken(token)
      setDevicePushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const movingObject = () => {
    const movingValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const getData = async () => {
        try {
          const plant = await AsyncStorage.getItem("plantInfo");
          // setPlant(JSON.parse(plant));
          setPlant(
            JSON.stringify({
              level: 5,
              point: 100,
              name: "Sunflower",
            })
          );
        } catch (error) {
          console.error("Error getMsg:", error);
        }
      };

      getData();
    }, []);

    useEffect(() => {
      async function fetchData() {
        const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
        const UserServerAccessToken = await AsyncStorage.getItem(
          "UserServerAccessToken"
        );
        const familyId = await AsyncStorage.getItem("familyId");
        await axios({
          method: "GET",
          url: SERVER_ADDRESS + "/familyTmi",

          headers: {
            Authorization: "Bearer: " + UserServerAccessToken,
          },
        }).then((resp) => {
          const tmis = resp.data;
          var mytmi = "";
          for (let i = 0; i < tmis.length; i++) {
            mytmi = mytmi + tmis[i].writer + ": " + tmis[i].content + "  ";
          }
          setTodayTMI(mytmi);
        });
      }

      fetchData();
    });
    const movingObject = () => {
      const movingValue = useRef(new Animated.Value(0)).current;

      useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(movingValue, {
              toValue: 100,
              duration: 5000,
              useNativeDriver: true,
            }),
            Animated.timing(movingValue, {
              duration: 5000,
              useNativeDriver: true,
            }),
            Animated.timing(movingValue, {
              toValue: -100,
              duration: 5000,
              useNativeDriver: true,
            }),
            Animated.timing(movingValue, {
              duration: 5000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, []);
      const interpolated = movingValue.interpolate({
        inputRange: [-1, 1],
        outputRange: [-1, 1],
      });

      return (
        <Animated.View style={{ transform: [{ translateX: interpolated }] }}>
          <TouchableOpacity onPress={() => navigation.navigate("Mini Games")}>
            <FontAwesome5 name="ghost" size={75} color="black" />
          </TouchableOpacity>
        </Animated.View>
      );
    };

    return (
      <Container>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderColor: "black",
            borderWidth: 2,
            borderRadius: 10,
          }}
        >
          <Text>
            {"<"}TMI{">"}
          </Text>
          <MarqueeText
            style={{ fontSize: 24 }}
            speed={0.5}
            marqueeOnStart={true}
            loop={true}
            delay={1000}
          >
            {todayTMI}
          </MarqueeText>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        ></View>
        <View style={styles.centeredView}>{movingObject()}</View>
        {flower ? (
          <MaterialCommunityIcons name="flower" size={100} color="black" />
        ) : (
          <MaterialCommunityIcons name="sprout" size={100} color="black" />
        )}
        <Text>{plant}</Text>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TextInput
                    value={TMI}
                    placeholder="당신의 TMI를 알려주세요!"
                    onChangeText={onChangeTMI}
                    multiline={true}
                    numberOfLines={3}
                    maxLength={40}
                    editable={true}
                    style={{
                      ...styles.input,
                      margin: 5,
                      borderColor: "black",
                      height: 100,
                      width: 300,
                      textAlign: "center",
                    }}
                  />
                  <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={async () => {
                        const SERVER_ADDRESS = await AsyncStorage.getItem(
                          "ServerAddress"
                        );
                        const UserServerAccessToken =
                          await AsyncStorage.getItem("UserServerAccessToken");
                        await axios({
                          method: "POST",
                          url: SERVER_ADDRESS + "/tmi",
                          headers: {
                            Authorization: "Bearer: " + UserServerAccessToken,
                          },
                          data: {
                            content: TMI,
                          },
                        })
                          .then(async (resp) => {
                            //todo
                            const writer = await AsyncStorage.getItem(
                              "nickname"
                            );
                            setTodayTMI(writer + ": " + TMI + "  " + todayTMI);
                          })
                          .catch(function (error) {
                            console.log("server error", error);
                          });
                        setModalVisible(!modalVisible);
                      }}
                    >
                      <Text style={styles.textStyle}>작성</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>취소</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ backgroundColor: "black", borderRadius: 50 }}
              >
                <Text
                  style={{
                    color: "white",
                    marginHorizontal: 30,
                    marginVertical: 20,
                  }}
                >
                  TMI 작성
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
              <TouchableOpacity
                onPress={async () => {
                  const SERVER_ADDRESS = await AsyncStorage.getItem(
                    "ServerAddress"
                  );
                  const UserServerAccessToken = await AsyncStorage.getItem(
                    "UserServerAccessToken"
                  );
                  await axios({
                    method: "GET",
                    url: SERVER_ADDRESS + "/tmi/check",
                    headers: {
                      Authorization: "Bearer: " + UserServerAccessToken,
                    },
                  })
                    .then(async (resp) => {
                      if (resp.data.message != "오늘의 tmi를 작성했습니다.") {
                        Alert.alert("출석을 위해 TMI를 작성해주세요!");
                      } else {
                        await axios({
                          method: "GET",
                          url: SERVER_ADDRESS + "/attendance",
                          headers: {
                            Authorization: "Bearer: " + UserServerAccessToken,
                          },
                        })
                          .then((resp) => {
                            Alert.alert(resp.data.message);
                            if (flower) {
                              setFlower(false);
                            } else {
                              setFlower(true);
                            }
                          })
                          .catch((e) => console.log(e));
                      }
                    })
                    .catch((e) => console.log(e));
                }}
                style={{ backgroundColor: "black", borderRadius: 50 }}
              >
                <Text
                  style={{
                    color: "white",
                    marginHorizontal: 30,
                    marginVertical: 20,
                  }}
                >
                  출첵
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <View>
        <Text>Counter: {counter}</Text>
        <Button title="Increment" onPress={() => dispatch(increment())} />
        <Button title="Decrement" onPress={() => dispatch(decrement())} />
      </View> */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {/* <Text>Your expo push token: {expoPushToken}</Text> */}
          <Text>Your device push token: {devicePushToken}</Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>
              Title: {notification && notification.request.content.title}{" "}
            </Text>
            <Text>
              Body: {notification && notification.request.content.body}
            </Text>
            <Text>
              Data:{" "}
              {notification &&
                JSON.stringify(notification.request.content.data)}
            </Text>
          </View>
          <Button
            title="Press to Send Notification"
            onPress={async () => {
              // await sendPushNotification(expoPushToken);
              await sendPushNotification(devicePushToken);
            }}
          />
        </View>
      </Container>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    color: "black",
  },
  buttonOpen: {
    backgroundColor: "black",
  },
  buttonClose: {
    backgroundColor: "black",
    marginHorizontal: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});
