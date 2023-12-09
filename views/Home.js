import React, {useEffect, useRef, useState, useCallback} from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MarqueeText from "react-native-marquee";
import axios from "axios";
import * as Notifications from "expo-notifications";
import {TouchableOpacity} from "react-native-gesture-handler";
import {useFocusEffect} from "@react-navigation/native";
import * as Permissions from "expo-permissions";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const fontRatio = SCREEN_HEIGHT / 800;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function Home({navigation, fonts}) {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [TMI, setTMI] = useState("");
  const onChangeTMI = (payload) => setTMI(payload);
  const [firstCome, setFirstCome] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  const [todayTMI, setTodayTMI] = useState("");
  const [plant, setPlant] = useState(null);
  const [plantLevel, setPlantLevel] = useState(null);
  const [plantName, setPlantName] = useState(null);
  const [plantPoint, setPlantPoint] = useState(0);
  const [plantModal, setPlantModal] = useState(false);
  const openModal = () => {
    setTMI(""); // 모달 열릴 때 tmi 초기화
    setModalVisible(true);
  };
  const movingObject = () => {
    const movingValue = useRef(new Animated.Value(0)).current;
    const [alienType, setAlienType] = useState("BASIC");
    useEffect(() => {
      const fetchAlienType = async () => {
        try {
          setAlienType(await AsyncStorage.getItem("alienType"));
        } catch (error) {
          console.error("Error fetching alienType from AsyncStorage:", error);
        }
      };
      fetchAlienType();
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
      <Animated.View style={{transform: [{translateX: interpolated}]}}>
        <TouchableOpacity onPress={() => navigation.navigate("Mini Games")}>
          {alienType === "BASIC" ? (
            <Image
              source={require(`../assets/img/character/BASIC.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "GLASSES" ? (
            <Image
              source={require(`../assets/img/character/GLASSES.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "GIRL" ? (
            <Image
              source={require(`../assets/img/character/GIRL.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "BAND_AID" ? (
            <Image
              source={require(`../assets/img/character/BAND_AID.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "RABBIT" ? (
            <Image
              source={require(`../assets/img/character/RABBIT.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "HEADBAND" ? (
            <Image
              source={require(`../assets/img/character/HEADBAND.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "TOMATO" ? (
            <Image
              source={require(`../assets/img/character/TOMATO.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "CHRISTMAS_TREE" ? (
            <Image
              source={require(`../assets/img/character/CHRISTMAS_TREE.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "SANTA" ? (
            <Image
              source={require(`../assets/img/character/SANTA.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={require(`../assets/img/character/PIRATE.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

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
        for (let i = 0; i < tmis.length; i++) {
          mytmi = mytmi + tmis[i].writer + ": " + tmis[i].content + "  ";
        }
        setTodayTMI(mytmi);
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        if (notification.request.content.title == "Family") {
          // console.log("update Family");
        } else if (notification.request.content.title == "TMI") {
          // console.log("update TMI");
          fetchData();
        } else if (notification.request.content.title == "Calendar") {
          // console.log("update Calendar");
        } else if (notification.request.content.title == "Photo") {
          // console.log("update Photo");
        } else if (notification.request.content.title == "Plant") {
          // console.log("update Plant");
          getplantInfo();
        } else {
          // console.log("update Chatting");
        }
      });
    const foregroundNotificationHandler = async (notification) => {
      // Handle the notification payload here
      // console.log(notification);
      const screenName = notification.notification.request.content.title;

      if (screenName) {
        if (screenName === "Calendar") {
          navigation.navigate("Calendar");
        } else if (screenName === "TMI") {
          navigation.navigate("Attendance");
        } else if (screenName === "Photo") {
          navigation.navigate("AlbumScreen");
        } else if (screenName === "Plant") {
          navigation.navigate("Home");
        } else if (screenName === "Family") {
          navigation.navigate("FamilyInfo");
        } else {
          navigation.navigate("Chatting");
        }
        // If the notification contains a screen name, navigate to that screen
        // navigationRef.current?.navigate(screenName);
      }
    };
    const foregroundNotificationSubscription =
      Notifications.addNotificationResponseReceivedListener(
        foregroundNotificationHandler
      );
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      foregroundNotificationSubscription.remove();
    };
  }, [notification]);

  const getplantInfo = async () => {
    try {
      const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
      const UserServerAccessToken = await AsyncStorage.getItem(
        "UserServerAccessToken"
      );
      await axios({
        method: "GET",
        url: SERVER_ADDRESS + "/plant",
        headers: {
          Authorization: "Bearer: " + UserServerAccessToken,
        },
      }).then((resp) => {
        const tmpPlant = resp.data.data;
        setPlantLevel(tmpPlant.level);
        setPlantName(tmpPlant.name);
        setPlantPoint(tmpPlant.point);
      });
    } catch (error) {
      console.error("Error getMsg:", error);
    }
  };

  const renderFlower = () => {
    // 레벨에 따라 다른 이미지 렌더링
    switch (plantPoint) {
      case 0:
        return (
          <Image
            source={require("../assets/img/level_0.png")}
            style={styles.plant}
          />
        );

      case 1:
        return (
          <Image
            source={require("../assets/img/level_2.png")}
            style={styles.plant}
          />
        );

      case 2:
        return (
          <Image
            source={require("../assets/img/level_4.png")}
            style={styles.plant}
          />
        );

      // case 3:
      //   return (
      //     <Image
      //       source={require("../assets/img/level_3.png")}
      //       style={styles.plant}
      //     />
      //   );

      // case 4:
      //   return (
      //     <Image
      //       source={require("../assets/img/level_4.png")}
      //       style={styles.plant}
      //     />
      //   );

      // 추가 레벨에 따른 이미지 케이스
      default:
        return (
          <Image
            source={require("../assets/img/level_4.png")}
            style={styles.plant}
          />
        );
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
      getplantInfo();
      // 여기에 다른 포커스를 받았을 때 실행하고 싶은 작업들을 추가할 수 있습니다.
      return () => {
        // 스크린이 포커스를 잃을 때 정리 작업을 수행할 수 있습니다.
      };
    }, []) // 두 번째 매개변수로 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행되도록 합니다.
  );
  useEffect(() => {
    // Set up a custom handler for background notifications
    const backgroundNotificationHandler = async (notification) => {
      // Handle the notification payload here
      // console.log(notification);
      const screenName = notification.notification.request.content.title;

      if (screenName) {
        if (screenName === "Calendar") {
          navigation.navigate("Calendar");
        }
        // If the notification contains a screen name, navigate to that screen
        // navigationRef.current?.navigate(screenName);
      }
    };

    // Subscribe to the background notification handler
    const backgroundNotificationSubscription =
      Notifications.addNotificationResponseReceivedListener(
        backgroundNotificationHandler
      );

    // Clean up subscriptions when the component unmounts
    return () => {
      backgroundNotificationSubscription.remove();
    };
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground
        source={require("../assets/img/background.png")}
        style={styles.backgroundImage}
      >
        <Container>
          <View style={styles.tmiTool}>
            <Image
              source={require("../assets/img/tmiTool.png")}
              style={{
                width: SCREEN_WIDTH * 0.85,
                height: SCREEN_HEIGHT * 0.5,
                resizeMode: "contain",
              }}
            />
            <View style={styles.tmiContainer}>
              <View style={styles.marqueeWrapper}>
                <MarqueeText
                  onPress={() => navigation.navigate("Attendance")}
                  style={styles.marqueeText}
                  speed={0.4}
                  marqueeOnStart
                  loop
                  delay={1000}
                >
                  {todayTMI ? todayTMI : "첫 TMI를 작성해주세요!"}
                </MarqueeText>
              </View>
            </View>
          </View>

          <View style={styles.tmiTextContainer}>
            <TouchableOpacity onPress={openModal}>
              <Text
                style={{
                  color: "white",
                  fontSize: 19 * fontRatio,
                  fontFamily: "dnf",
                }}
              >
                오늘의 TMI
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{flex: 1, justifyContent: "center", alignItems: "center"}}
          ></View>
          <View style={styles.alien}>{movingObject()}</View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("PlantInfo")}>
              {renderFlower()}
            </TouchableOpacity>
            <Modal
              animationType="none"
              transparent={true}
              visible={plantModal}
              onRequestClose={() => {
                // Handle modal close
              }}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                  {/* Modal content */}
                  <Text
                    style={{
                      ...styles.modalText,
                      fontFamily: "dnf",
                      fontSize: 20,
                    }}
                  >
                    {plantName}
                  </Text>
                  <Text
                    style={{
                      ...styles.modalText,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    level 🏆 {plantLevel}
                  </Text>
                  <Text style={{...styles.modalText, fontWeight: "bold"}}>
                    {plantPoint} p
                  </Text>
                  {/* Close button */}
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonClose,
                      {backgroundColor: "#CBCFC9"},
                    ]}
                    onPress={() => setPlantModal(false)}
                  >
                    <Text style={styles.textStyle}>닫기</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
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
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.modalOverlay}>
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
                        borderColor: "#D63CE3",
                        height: 100,
                        width: 300,
                        textAlign: "center",
                      }}
                    />
                    <View style={{flexDirection: "row", marginVertical: 10}}>
                      <Pressable
                        style={[styles.button, styles.buttonWrite]}
                        onPress={async () => {
                          if (!TMI) {
                            Alert.alert("TMI를 작성해주세요!");
                          } else {
                            const SERVER_ADDRESS = await AsyncStorage.getItem(
                              "ServerAddress"
                            );
                            const UserServerAccessToken =
                              await AsyncStorage.getItem(
                                "UserServerAccessToken"
                              );
                            await axios({
                              method: "POST",
                              url: SERVER_ADDRESS + "/tmi",
                              headers: {
                                Authorization:
                                  "Bearer: " + UserServerAccessToken,
                              },
                              data: {
                                content: TMI,
                              },
                            })
                              .then(async (resp) => {
                                fetchData();
                                if (firstCome) {
                                  setFirstCome(false);
                                  navigation.navigate("Attendance");
                                }
                              })
                              .catch(function (error) {
                                console.log("server error", error);
                              });
                            setModalVisible(!modalVisible);
                          }
                        }}
                      >
                        <Text style={{...styles.textStyle, color: "#fff"}}>
                          작성
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {
                          setFirstCome(false);
                          setModalVisible(!modalVisible);
                        }}
                      >
                        <Text style={{...styles.textStyle, color: "#727272"}}>
                          취소
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>

            <View
              style={{
                left: "-25%",
                bottom: 20,
              }}
            >
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
                            getplantInfo();
                            Alert.alert(resp.data.message);
                          })
                          .catch((e) => console.log(e));
                      }
                    })
                    .catch((e) => console.log(e));
                }}
              >
                <Image
                  source={require("../assets/img/wateringCan.png")}
                  style={styles.wateringCan}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Container>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: SCREEN_WIDTH,
    resizeMode: "cover",
  },
  tmiTool: {
    // position: "absolute",
    alignItems: "center",
    top: "-22%",
  },
  tmiTextContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? "6%" : "5%",
  },
  tmiContainer: {
    bottom: "39%",
    padding: "11%",
  },
  marqueeWrapper: {
    alignItems: "center",
    width: SCREEN_WIDTH * 0.7,
    overflow: "hidden", // 영역을 벗어난 부분 숨기기
  },
  marqueeText: {
    marginTop: 5,
    fontSize: 20,
    fontFamily: "DungGeunMo",
  },
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
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
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
    width: 65,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "black",
  },
  buttonWrite: {
    backgroundColor: "#C336CF",
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: "#DED1DF",
    marginHorizontal: 10,
  },
  textStyle: {
    textAlign: "center",
    fontFamily: "dnf",
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
  wateringCan: {
    width: SCREEN_WIDTH * 0.17,
    height: SCREEN_HEIGHT * 0.1,
    resizeMode: "contain",
  },
  bottomContainer: {
    position: "absolute",
    flex: 1,
    bottom: 40,
  },
  plant: {
    width: SCREEN_WIDTH * 0.23,
    height: SCREEN_HEIGHT * 0.2,
    resizeMode: "contain",
  },
  alien: {
    position: "absolute",
    bottom: "22%",
  },
  plantModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  plantModalView: {
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
  plantModalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "dnf", // Customize the font family if needed
    fontSize: 16, // Customize the font size if needed
  },
  plantButtonClose: {
    backgroundColor: "#DED1DF",
    marginHorizontal: 10,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  plantTextStyle: {
    textAlign: "center",
    fontFamily: "dnf",
    color: "#727272",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // 불투명한 검은 배경
    justifyContent: "center",
    alignItems: "center",
  },
});
