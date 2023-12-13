import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useState, useEffect, useCallback, useRef} from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  View,
  StatusBar,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import axios from "axios";
import {useFocusEffect} from "@react-navigation/native";
import AlienType from "../components/AlienType";
import {MaterialIcons} from '@expo/vector-icons';
import {AnimatedCircularProgress} from "react-native-circular-progress";
import * as Notifications from "expo-notifications";
import LottieView from "lottie-react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

const missionImages = {
  "사진 찍어서 올리기": require("../assets/img/missionIcon/camera.png"),
  "내 갤러리 사진 등록하기": require("../assets/img/missionIcon/gallery.png"),
  "사진에 댓글 달기": require("../assets/img/missionIcon/comment.png"),
  "가족들과 채팅으로 인사하기": require("../assets/img/missionIcon/chat.png"),
  "캘린더에 일정 등록하기": require("../assets/img/missionIcon/calendar.png"),
};

const missionNav = {
  "사진 찍어서 올리기": "AlbumScreen",
  "내 갤러리 사진 등록하기": "AlbumScreen",
  "사진에 댓글 달기": "AlbumScreen",
  "가족들과 채팅으로 인사하기": "Chat",
  "캘린더에 일정 등록하기": "Calendar",
};

export default function PlantInfo({navigation}) {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const [familyPoint, setFamilyPoint] = useState([]);
  const [plantLevel, setPlantLevel] = useState(0);
  const [plantName, setPlantName] = useState(null);
  const [plantPoint, setPlantPoint] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [todayMission, setTodayMission] = useState("");
  const [todayMissionClear, setTodayMissionClear] = useState(false);
  const [dailyMissionClear, setDailyMissionClear] = useState(false);
  const [isDayMission, setDayMission] = useState(false);
  const [isTodayMission, setIsTodayMission] = useState(true);

  const handleDayMission = () => {
    setDayMission(true);
    setIsTodayMission(false);
  };

  const handleTodayMission = () => {
    setDayMission(false);
    setIsTodayMission(true);
  };

  // useEffect(() => {
  //   // 타이머를 사용하여 5초마다 말풍선을 표시
  //   const interval = setInterval(() => {
  //     setIsVisible(true);
  //     // 3초 후에 말풍선을 숨김
  //     setTimeout(() => {
  //       setIsVisible(false);
  //     }, 5000);
  //   }, 10000);
  //   // 컴포넌트 언마운트 시에 타이머 클리어
  //   return () => clearInterval(interval);
  // }, []);
  const levelPoint = [20, 30, 50, 60, 70, 80, 90, 100, 900, 1500, 2000];
  const [progressBar, setProgressBar] = useState(0);
  const [playLottie, setPlayLottie] = useState(false);
  const [levelUp, setLevelUp] = useState(false);

  const renderFlower = () => {
    switch (plantLevel) {
      case 0:
        return (
          <Image
            source={require("../assets/img/level_0.png")}
            style={styles.plantImage}
          />
        );
      case 1:
        return (
          <Image
            source={require("../assets/img/level_1.png")}
            style={styles.plantImage}
          />
        );
      case 2:
        return (
          <Image
            source={require("../assets/img/level_2.png")}
            style={styles.plantImage}
          />
        );
      case 3:
        return (
          <Image
            source={require("../assets/img/level_3.png")}
            style={styles.plantImage}
          />
        );
      case 4:
        return (
          <Image
            source={require("../assets/img/level_4.png")}
            style={styles.plantImage}
          />
        );
      case 5:
        return (
          <Image
            source={require("../assets/img/level_5.png")}
            style={styles.plantImage}
          />
        );
      default:
        return (
          <Image
            source={require("../assets/img/level_5.png")}
            style={styles.plantImage}
          />
        );
    }
  };

  const TingleFamily = async (nickname) => {
    try {
      const myDB = await AsyncStorage.getItem("myDB");
      // console.log("마이디비~~", myDB);
      const data = JSON.parse(myDB);

      const memberId = Object.values(data)
        .filter((user) => user.nickname === nickname)
        .map((user) => user.memberId)[0];

      // console.log("memberId:", memberId);

      if (memberId) {
        const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
        const UserServerAccessToken = await AsyncStorage.getItem(
          "UserServerAccessToken"
        );

        await axios({
          method: "GET",
          url: SERVER_ADDRESS + `/tingle/${memberId}`,
          headers: {
            Authorization: "Bearer " + UserServerAccessToken,
          },
        }).then((resp) => {
          const tmp = resp.data;
          console.log(tmp);
        });
      } else {
        console.log("해당 닉네임을 가진 사용자를 찾을 수 없습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFamilyScore = async () => {
    var tmpList = [];
    const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
    const UserServerAccessToken = await AsyncStorage.getItem(
      "UserServerAccessToken"
    );
    await axios({
      method: "GET",
      url: SERVER_ADDRESS + "/api/family/points",
      headers: {
        Authorization: "Bearer: " + UserServerAccessToken,
      },
    })
      .then((resp) => {
        const tmp = resp.data.data;
        for (let i = 0; i < tmp.length; i++) {
          tmpList.push(tmp[i].nickname + ":" + tmp[i].point);
        }
        // console.log(tmpList);
        setFamilyPoint(tmpList);
      })
      .catch((e) => console.log(e));
  };

  const renderChat = () => {
    const chatContainerStyles = [
      styles.plantSay0,
      styles.plantSay1,
      styles.plantSay2,
      styles.plantSay3,
      styles.plantSay4,
      styles.plantSay4, // fallback for default case
    ];
    const chatMessages = [
      "오늘도\n행복한 하루\n보내세요!",
      "가족끼리\n서로 안부를 \n물어볼까요?",
      "저에게\n물을 주세요..",
      "오늘의\nTMI를\n작성했나요?",
      "늘 응원합니다!",
    ];

    const randomMessage = () => {
      const randomIndex = Math.floor(Math.random() * chatMessages.length);
      return chatMessages[randomIndex];
    };
    return (
      <View style={chatContainerStyles[plantLevel]}>
        {isVisible && (
          <View
            style={{
              left: SCREEN_WIDTH * 0.1,
              bottom:
                Platform.OS === "ios"
                  ? SCREEN_HEIGHT * 0.15
                  : SCREEN_HEIGHT * 0.2,
              zIndex: 1,
            }}
          >
            {Platform.OS === 'ios' ? (
              <View style={{justifyContent: "flex-start", marginTop: "20%"}}>
              <ImageBackground
              source={require("../assets/img/bubble.png")}
              style={styles.textBubble}
            >
              <Text style={styles.text}>{randomMessage()}</Text>
            </ImageBackground>
              </View>) : (<View style={{justifyContent: "flex-start", marginTop: "-10%"}}>
              <ImageBackground
                source={require("../assets/img/bubble.png")}
                style={styles.textBubble}
              >
                <Text style={styles.text}>{randomMessage()}</Text>
              </ImageBackground>
            </View>)}

          </View>
        )}
      </View>
    );
  };

  const getPlantInfo = async () => {
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
      }).then(async (resp) => {
        const tmpPlant = resp.data.data;
        if (plantLevel < tmpPlant.level) {
          setProgressBar(100);
        }
        setPlantLevel(tmpPlant.level);
        setPlantName(tmpPlant.name);
        setPlantPoint(tmpPlant.point);
        setProgressBar((tmpPlant.point / levelPoint[tmpPlant.level]) * 100);
        const originLevel = await AsyncStorage.getItem("plantLevel");
        const lvup = await AsyncStorage.getItem("levelUp");
        if (originLevel != tmpPlant.level.toString() || lvup === "true") {
          AsyncStorage.setItem("plantLevel", tmpPlant.level.toString());
          AsyncStorage.setItem("levelUp", "false");
          setIsVisible(false);
          setPlayLottie(true);
          const timeoutId = setTimeout(() => {
            setPlayLottie(false);
            setIsVisible(false);
          }, 1900);
          return () => {
            clearTimeout(timeoutId);
          };
        }
      });
    } catch (error) {
      console.error("Error getMsg:", error);
    }
  };

  const getMission = async () => {
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
        // setPlantLevel(tmpPlant.level);
        setPlantName(tmpPlant.name);
        setPlantPoint(tmpPlant.point);
        setProgressBar((tmpPlant.point / levelPoint[tmpPlant.level]) * 100);
        AsyncStorage.setItem("plantLevel", tmpPlant.level.toString());
      });
    } catch (error) {
      console.error("Error getMsg:", error);
    }
    const ktc = new Date();
    ktc.setHours(ktc.getHours() + 9);
    const str_today = JSON.stringify(ktc).toString().slice(1, 11);
    const test = JSON.parse(await AsyncStorage.getItem("todayMission"));
    const todayMissions = [
      // "사진 찍어서 올리기",
      // "내 갤러리 사진 등록하기",
      "사진에 댓글 달기",
      // "가족들과 채팅으로 인사하기",
      // "캘린더에 일정 등록하기",
    ];

    if (test) {
      // console.log(test);
      if (test && typeof test === "object" && str_today in test) {
        setTodayMission(test[str_today]);
        const tmp_TMC = await AsyncStorage.getItem("todayMissionClear");
        if (tmp_TMC === "true") {
          setTodayMissionClear(true);
        }
        const tmp_DMC = await AsyncStorage.getItem("dailyMissionClear");
        if (tmp_DMC === "true") {
          setDailyMissionClear(true);
        }
      } else {
        const randomIndex = Math.floor(Math.random() * todayMissions.length);
        setTodayMission(todayMissions[randomIndex]);
        await AsyncStorage.setItem(
          "todayMission",
          JSON.stringify({[str_today]: todayMissions[randomIndex]})
        );
        await AsyncStorage.setItem("todayMissionClear", "false");
        await AsyncStorage.setItem("dailyMissionClear", "false");
      }
    } else {
      const randomIndex = Math.floor(Math.random() * todayMissions.length);
      setTodayMission(todayMissions[randomIndex]);
      await AsyncStorage.setItem(
        "todayMission",
        JSON.stringify({[str_today]: todayMissions[randomIndex]})
      );
      await AsyncStorage.setItem("todayMissionClear", "false");
      await AsyncStorage.setItem("dailyMissionClear", "false");
    }
  };

  useEffect(() => {
    getFamilyScore();
    getMission();
    getPlantInfo();
    // 타이머를 사용하여 5초마다 말풍선을 표시
    const interval = setInterval(() => {
      setIsVisible(true);
      // 3초 후에 말풍선을 숨김
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 10000);

    // 컴포넌트 언마운트 시에 타이머 클리어
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        getFamilyScore();
        getPlantInfo();
      });

    const foregroundNotificationHandler = async (notification) => {
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

  useFocusEffect(
    useCallback(() => {
      getPlantInfo();
      getFamilyScore();
      const getMission = async () => {
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
            AsyncStorage.setItem("plantLevel", tmpPlant.level.toString());
          });
        } catch (error) {
          console.error("Error getMsg:", error);
        }
        const ktc = new Date();
        ktc.setHours(ktc.getHours() + 9);
        const str_today = JSON.stringify(ktc).toString().slice(1, 11);
        const test = JSON.parse(await AsyncStorage.getItem("todayMission"));
        const todayMissions = [
          // "사진 찍어서 올리기",
          // "내 갤러리 사진 등록하기",
          "사진에 댓글 달기",
          // "가족들과 채팅으로 인사하기",
          // "캘린더에 일정 등록하기",
        ];

        if (test) {
          if (test && typeof test === "object" && str_today in test) {
            setTodayMission(test[str_today]);
            const tmp_TMC = await AsyncStorage.getItem("todayMissionClear");
            if (tmp_TMC === "true") {
              setTodayMissionClear(true);
            }
            const tmp_DMC = await AsyncStorage.getItem("dailyMissionClear");
            if (tmp_DMC === "true") {
              setDailyMissionClear(true);
            }
          } else {
            const randomIndex = Math.floor(
              Math.random() * todayMissions.length
            );
            setTodayMission(todayMissions[randomIndex]);
            await AsyncStorage.setItem(
              "todayMission",
              JSON.stringify({[str_today]: todayMissions[randomIndex]})
            );
            await AsyncStorage.setItem("todayMissionClear", "false");
            await AsyncStorage.setItem("dailyMissionClear", "false");
          }
        } else {
          const randomIndex = Math.floor(Math.random() * todayMissions.length);
          setTodayMission(todayMissions[randomIndex]);
          await AsyncStorage.setItem(
            "todayMission",
            JSON.stringify({[str_today]: todayMissions[randomIndex]})
          );
          await AsyncStorage.setItem("todayMissionClear", "false");
          await AsyncStorage.setItem("dailyMissionClear", "false");
        }
      };
      getMission();
      return () => {
        // 스크린이 포커스를 잃을 때 정리 작업을 수행할 수 있습니다.
      };
    }, []) // 두 번째 매개변수로 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행되도록 합니다.
  );

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <StatusBar barStyle="light-content" backgroundColor="#000000"/>
      <View style={styles.topContainer}>
        <View style={styles.box}>
          <Text
            style={{
              ...styles.missionText,
              fontFamily: "doss",
              paddingVertical: 8,
              textShadowColor: "#B1B0B0",
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 5,
            }}
          >
            가족 랭킹
          </Text>
          <ScrollView
            style={{
              maxHeight: SCREEN_HEIGHT * 0.3,
              borderTopWidth: 1,
              borderTopColor: "#DBDBDB",
            }}
          >
            {familyPoint.map((family, index) => (
              <View key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.rankText}>{index + 1}.</Text>

                    <AlienType writer={family.split(":")[0]}/>

                    <View style={{marginLeft: -7}}>
                      <Text style={styles.ranker}>{family.split(":")[0]}</Text>

                      <View
                        style={{flexDirection: "row", alignItems: "center"}}
                      >
                        <Image
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: "contain",
                          }}
                          source={require("../assets/img/missionIcon/coin.png")}
                        />
                        <Text
                          style={{
                            fontFamily: "doss",
                            color: "#FF9D3A",
                            paddingLeft: 5,
                            fontSize: 18,
                          }}
                        >
                          {family.split(":")[1]}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      TingleFamily(family.split(":")[0]);
                      Alert.alert(
                        `${family.split(":")[0]}님께 찌릿 통신을 보냈습니다!`
                      );
                    }}
                  >
                    <Image
                      style={{width: 25, height: 25, resizeMode: "contain"}}
                      source={require("../assets/img/tingle2.png")}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.line}/>
              </View>
            ))}
          </ScrollView>
        </View>
        {isTodayMission && (
          <View style={styles.box}>
            <Text
              style={{
                ...styles.missionText,
                fontFamily: "doss",
                paddingTop: 5,
                textShadowColor: "#B1B0B0",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 5,
              }}
            >
              오늘의{"\n"}랜덤 미션
            </Text>
            <View style={styles.missionImageContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    ...styles.missionImage,
                    marginLeft: 35,
                    marginRight: 10,
                  }}
                  source={missionImages[todayMission]}
                />
                <TouchableOpacity onPress={handleDayMission}>
                  <MaterialIcons
                    style={{}}
                    name="navigate-next"
                    size={28}
                    color="#555456"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {todayMissionClear ? (
              <View>
                <Text
                  style={{
                    ...styles.missionText,
                    fontSize: 19,
                    ...(todayMissionClear ? styles.crossedText : null),
                  }}
                >
                  {todayMission}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate(missionNav[todayMission])}
              >
                <Text
                  style={{
                    ...styles.missionText,
                    fontSize: 19,
                    ...(todayMissionClear ? styles.crossedText : null),
                  }}
                >
                  {todayMission}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {isDayMission && (
          <View style={styles.box}>
            <Text
              style={{
                ...styles.missionText,
                fontFamily: "doss",
                paddingVertical: 8,
                textShadowColor: "#B1B0B0",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 5,
              }}
            >
              일일 미션
            </Text>
            <View style={styles.missionImageContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={handleTodayMission}>
                  <MaterialIcons
                    name="navigate-before"
                    size={28}
                    color="#555456"
                  />
                </TouchableOpacity>
                <Image
                  style={{
                    ...styles.missionImage,
                    marginRight: 40,
                    marginLeft: 15,
                  }}
                  source={require("../assets/img/tmi.png")}
                />
              </View>
            </View>
            {dailyMissionClear ? (
              <View>
                <Text
                  style={{
                    ...styles.missionText,
                    fontSize: 19,
                    ...(dailyMissionClear ? styles.crossedText : null),
                  }}
                >
                  오늘의 TMI 작성하기
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate(missionNav[todayMission])}
              >
                <Text
                  style={{
                    ...styles.missionText,
                    fontSize: 19,
                    ...(dailyMissionClear ? styles.crossedText : null),
                  }}
                >
                  오늘의 TMI 작성하기
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <AnimatedCircularProgress
          size={390}
          width={10}
          backgroundWidth={5}
          fill={progressBar}
          tintColor="#9ACD32"
          // onAnimationComplete={() => console.log("onAnimationComplete")}
          arcSweepAngle={360}
          rotation={180}
          lineCap="round"
          backgroundColor="#DBDBDB"
          style={{
            backgroundColor: "#F5F2F2",
            borderRadius: 390,
            width: 390,
            height: 390,
          }}
        >
          {(fill) => (
            <View style={{}}>
              <View style={{top: 75}}>
                <View style={styles.bottomCircle}/>
                <View
                  style={{
                    position: "absolute",
                    alignItems: "center",
                    bottom:
                      Platform.OS === "ios"
                        ? SCREEN_HEIGHT * 0.11
                        : SCREEN_HEIGHT * 0.15,
                    left: 0,
                    right: 0,
                  }}
                >
                  <View>{renderChat()}</View>
                  <View style={styles.plantContainer}>{renderFlower()}</View>
                  <Text style={styles.plantText}>
                    {plantName}
                    {"\n"}Lv.{plantLevel}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </AnimatedCircularProgress>
        {playLottie && (
          <LottieView
            source={require("../assets/json/evolution.json")}
            autoPlay={playLottie}
            loop={false}
            style={{
              position: "absolute", // Ensure it overlays other components
              width: SCREEN_WIDTH * 0.8,
              height: SCREEN_HEIGHT * 0.8,
              zIndex: 2,
            }}
          />
        )}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{alignItems: "flex-start", paddingLeft: 35, paddingTop: 5}}
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
                        getPlantInfo();
                        Alert.alert(resp.data.message);
                      })
                      .catch((e) => console.log(e));
                  }
                })
                .catch((e) => console.log(e));
            }}
          >
            <Image
              source={require("../assets/img/wateringCan3.png")}
              style={{
                width: SCREEN_WIDTH * 0.17,
                height: SCREEN_WIDTH * 0.17,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{alignItems: "flex-end", paddingRight: 30, paddingTop: 0}}
        >
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Image
              source={require("../assets/img/missionIcon/exit.png")}
              style={{
                width: SCREEN_WIDTH * 0.13,
                height: SCREEN_WIDTH * 0.15,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? 10 : 45,
    paddingHorizontal: Platform.OS === "ios" ? 12 : 15,
  },
  box: {
    paddingVertical: 15,
    paddingHorizontal: Platform.OS === "ios" ? 10 : 20,
    width: SCREEN_WIDTH * 0.45,
    height: SCREEN_HEIGHT * 0.3,
    borderColor: "#F5F2F2",
    borderRadius: 30,
    borderWidth: 1.5,
  },
  rankText: {
    fontFamily: "doss",
    fontSize: 18,
    color: "#1B1A1A",
    marginRight: 1,
  },
  ranker: {
    fontSize: Platform.OS === "ios" ? 16 : 18,
    fontFamily: "wooju",
    paddingBottom: 3,
    paddingLeft: 3,
  },
  line: {
    borderColor: "#DBDBDB",
    borderWidth: 0.4,
  },
  mission: {
    alignItems: "center",
  },
  missionText: {
    fontSize: 26,
    fontFamily: "wooju",
    textAlign: "center",
  },
  missionImageContainer: {
    alignItems: "center",
    marginVertical: 15,
    marginBottom: 20,
  },
  missionImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  bottomCircle: {
    marginTop: Platform.OS === 'ios' ? 0 : 35,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH,
    left: SCREEN_WIDTH * 0.05,
    right: SCREEN_WIDTH * 0.05,
    top: SCREEN_WIDTH * 0.05,
    // borderRadius: SCREEN_WIDTH / 2,
    // backgroundColor: "#F5F2F2",
  },
  textBubble: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.15,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  text: {
    position: "absolute",
    paddingHorizontal: 10,
    lineHeight: 22,
    fontFamily: "doss",
    fontSize: Platform.OS === "ios" ? 14 : 18,
    top: "20%",
  },
  plantContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  plantImage: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.32,
    height: SCREEN_HEIGHT * 0.32,
    resizeMode: "contain",
    zIndex: 0,
  },
  plantText: {
    paddingTop: Platform.OS === "ios" ? null : 5,
    fontSize: 22,
    fontFamily: "doss",
    textAlign: "center",
  },
  plantSay0: {
    marginTop: 200,
  },
  plantSay1: {
    marginTop: 150,
  },
  plantSay2: {
    marginTop: 100,
  },
  plantSay3: {
    marginTop: 50,
  },
  plantSay4: {
    marginTop: 0,
  },
  bonusMissionContainer: {
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  bonusMissionText: {
    fontSize: 20,
  },
  crossedText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    color: "gray",
  },
});
