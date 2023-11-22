import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  TextInput,
  PanResponder,
  Easing,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import MarqueeText from "react-native-marquee";
import Chanhopark from "./chanhopark";
import MiniGames from "./MiniGames";
import axios from "axios";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function Home({ navigation }) {
  const [TMI, setTMI] = useState("");
  const onChangeTMI = (payload) => setTMI(payload);
  const [modalVisible, setModalVisible] = useState(false);
  const [todayTMI, setTodayTMI] = useState("");
  const [flower, setFlower] = useState(false);
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
        console.log(resp.data);
        const tmis = resp.data;
        var mytmi = "";
        for (i = 0; i < tmis.length; i++) {
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
          {/* {Object.keys(TMI).map((key)=>(<Text>TMI[key] </Text>))} */}
        </MarqueeText>
      </View>
      {/* <View style={{ marginHorizontal: 3, marginVertical: 3 }}>
        <TouchableOpacity
          onPress={async () => {
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
                console.log(resp.data);
                const tmis = resp.data;
                var mytmi = "";
                for (i = 0; i < tmis.length; i++) {
                  mytmi =
                    mytmi + tmis[i].writer + ": " + tmis[i].content + "  ";
                }
                console.log(mytmi);
                setTodayTMI(mytmi);
              })
              .catch(function (error) {
                console.log("server error", error);
              });
          }}
          style={{ backgroundColor: "black", borderRadius: 50 }}
        >
          <Text
            style={{
              color: "white",
              marginHorizontal: 10,
              marginVertical: 5,
            }}
          >
            새로고침
          </Text>
        </TouchableOpacity>
      </View> */}
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      ></View>
      <View style={styles.centeredView}>{movingObject()}</View>
      {flower ? (
        <MaterialCommunityIcons name="flower" size={100} color="black" />
      ) : (
        <MaterialCommunityIcons name="sprout" size={100} color="black" />
      )}
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
              // Alert.alert("Modal has been closed.");
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
                      const UserServerAccessToken = await AsyncStorage.getItem(
                        "UserServerAccessToken"
                      );
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
                          // console.log("TMI SUCCESS");
                          // console.log(resp.data.message);
                          //todo
                          const writer = await AsyncStorage.getItem("nickname");
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
                    // console.log(resp.data.message);
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
                          if (flower){
                            setFlower(false);
                          }else{
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
    </Container>
  );
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
