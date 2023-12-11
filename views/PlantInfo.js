import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useState, useEffect, useCallback} from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  View,
  StatusBar,
  ImageBackground, Alert, Platform,
} from "react-native";
import axios from "axios";
import {useFocusEffect} from "@react-navigation/native";
import AlienType from "../components/AlienType";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

const missionImages = {
  "사진 찍어서 올리기": require('../assets/img/missionIcon/camera.png'),
  "내 갤러리 사진 등록하기": require('../assets/img/missionIcon/gallery.png'),
  "사진에 댓글 달기": require('../assets/img/missionIcon/comment.png'),
  "가족들과 채팅으로 인사하기": require('../assets/img/missionIcon/chat.png'),
  "캘린더에 일정 등록하기": require('../assets/img/missionIcon/calendar.png'),
};

const missionNav = {
  "사진 찍어서 올리기": 'AlbumScreen',
  "내 갤러리 사진 등록하기": 'AlbumScreen',
  "사진에 댓글 달기": 'AlbumScreen',
  "가족들과 채팅으로 인사하기": 'Chat',
  "캘린더에 일정 등록하기": 'Calendar',
};

export default function PlantInfo({navigation}) {
  const [familyPoint, setFamilyPoint] = useState([]);
  const [plantLevel, setPlantLevel] = useState(null);
  const [plantName, setPlantName] = useState(null);
  const [plantPoint, setPlantPoint] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [todayMission, setTodayMission] = useState("");
  const [todayMissionClear, setTodayMissionClear] = useState(false);
  const [dailyMissionClear, setDailyMissionClear] = useState(false);

  useEffect(() => {
    // 타이머를 사용하여 5초마다 말풍선을 표시
    const interval = setInterval(() => {
      setIsVisible(true);
      // 3초 후에 말풍선을 숨김
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }, 2000);

    // 컴포넌트 언마운트 시에 타이머 클리어
    return () => clearInterval(interval);
  }, []);

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
      default:
        return (
          <Image
            source={require("../assets/img/level_4.png")}
            style={styles.plantImage}
          />
        );
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
        console.log(tmpList);
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
              bottom: SCREEN_HEIGHT * 0.15,
              zIndex: 1,
            }}
          >
            <ImageBackground
              source={require('../assets/img/bubble.png')}
              style={styles.textBubble}
            >
              <Text style={styles.text}>
                {randomMessage()}
              </Text>
            </ImageBackground>
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
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
        });
      } catch (error) {
        console.error("Error getMsg:", error);
      }
      const ktc = new Date();
      ktc.setHours(ktc.getHours() + 9);
      const str_today = JSON.stringify(ktc).toString().slice(1, 11);
      const test = JSON.parse(await AsyncStorage.getItem("todayMission"));
      const todayMissions = [
        "사진 찍어서 올리기",
        "내 갤러리 사진 등록하기",
        "사진에 댓글 달기",
        "가족들과 채팅으로 인사하기",
        "캘린더에 일정 등록하기",
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
    getMission();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // 여기에 다른 포커스를 받았을 때 실행하고 싶은 작업들을 추가할 수 있습니다.
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
          });
        } catch (error) {
          console.error("Error getMsg:", error);
        }
        const ktc = new Date();
        ktc.setHours(ktc.getHours() + 9);
        const str_today = JSON.stringify(ktc).toString().slice(1, 11);
        const test = JSON.parse(await AsyncStorage.getItem("todayMission"));
        const todayMissions = [
          "사진 찍어서 올리기",
          "내 갤러리 사진 등록하기",
          "사진에 댓글 달기",
          "가족들과 채팅으로 인사하기",
          "캘린더에 일정 등록하기",
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
          <Text style={{...styles.missionText, fontFamily: "doss", paddingVertical: 8,}}>
            가족 랭킹
          </Text>
          <ScrollView style={{maxHeight: SCREEN_HEIGHT * 0.3}}>
            {familyPoint.map((family, index) => (
              <View key={index}>
                <View style={{flexDirection: "row", paddingVertical: 10, alignItems: "center",}}>
                  {/*<Text style={styles.rankText}>*/}
                  {/*{index === 0 ? ('🥇') : (index === 1 ? ('🥈') : (index === 2 ? ('🥉') : (index + 1)))*/}
                  {/*}*/}
                  {/*</Text>*/}
                  <Text style={styles.rankText}>
                    {index + 1}.
                  </Text>

                  <AlienType writer={family.split(':')[0]}/>

                  <View>
                    <Text style={styles.rankName}>
                      {family.split(':')[0]}
                    </Text>

                    <View style={{flexDirection: "row", alignItems: "center",}}>
                      <Image
                        style={{width: 20, height: 20, resizeMode: "contain"}}
                        source={require('../assets/img/missionIcon/coin.png')}
                      />
                      <Text style={{fontFamily: "doss", color: "#FF9D3A", paddingLeft: 5, fontSize: 18,}}>
                        {family.split(':')[1]}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.line}/>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.box}>
          <Text style={{...styles.missionText, fontFamily: "doss", paddingTop: 10,}}>
            오늘의{'\n'}랜덤 미션
          </Text>
          <View style={styles.missionImageContainer}>
            <Image
              style={styles.missionImage}
              source={missionImages[todayMission]}
            />
          </View>
          {todayMissionClear ? (
            <View>
              <Text
                style={{
                  ...styles.missionText,
                  fontSize: Platform.OS === 'ios' ? 19 : 23,
                  ...todayMissionClear ? styles.crossedText : null,
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
                  fontSize: Platform.OS === 'ios' ? 19 : 23,
                  ...todayMissionClear ? styles.crossedText : null,
                }}
              >
                {todayMission}
              </Text>
            </TouchableOpacity>
          )}

        </View>
      </View>

      <View style={styles.bottomCircle}/>

      <View
        style={{
          position: "absolute",
          alignItems: "center",
          bottom: Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.11 : SCREEN_HEIGHT * 0.15,
          left: 0,
          right: 0,
        }}
      >
        <View>{renderChat()}</View>
        <View style={styles.plantContainer}>{renderFlower()}</View>

        <View style={{alignItems: "center"}}>
          <Text style={styles.plantText}>
            {plantName}{'\n'}Lv.{plantLevel}
          </Text>
        </View>
      </View>

      {/*    <View style={{flexDirection: "row"}}>*/}
      {/*      <Text style={styles.missionText}>일일 미션:</Text>*/}
      {/*      <Text*/}
      {/*        style={[*/}
      {/*          styles.missionText,*/}
      {/*          dailyMissionClear ? styles.crossedText : null,*/}
      {/*        ]}*/}
      {/*      >*/}
      {/*        TMI 작성하기*/}
      {/*      </Text>*/}
      {/*    </View>*/}

      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View
          style={{alignItems: "flex-start", paddingLeft: 35, paddingTop: 35,}}>
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
              source={require("../assets/img/wateringCan3.png")}
              style={{width: SCREEN_WIDTH * 0.17, height: SCREEN_WIDTH * 0.17, resizeMode: "contain",}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{alignItems: "flex-end", paddingRight: 30, paddingTop: 30,}}>
          <TouchableOpacity
            onPress={() => navigation.pop()}>
            <Image
              source={require("../assets/img/missionIcon/exit.png")}
              style={{width: SCREEN_WIDTH * 0.13, height: SCREEN_WIDTH * 0.15, resizeMode: "contain",}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
    ;
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Platform.OS === 'ios' ? 30 : 50,
    paddingHorizontal: Platform.OS === 'ios' ? 12 : 15,
  },
  box: {
    paddingVertical: 15,
    paddingHorizontal: Platform.OS === 'ios' ? 10 : 20,
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
    marginRight: 3,
    paddingLeft: 3,
  },
  rankName: {
    fontSize: Platform.OS === 'ios' ? 16 : 18,
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
    marginVertical: 17,
    marginBottom: Platform.OS === 'ios' ? 15 : 30,
  },
  missionImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  bottomCircle: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH,
    left: SCREEN_WIDTH * 0.05,
    right: SCREEN_WIDTH * 0.05,
    top: SCREEN_WIDTH * 0.05,
    borderRadius: SCREEN_WIDTH / 2,
    backgroundColor: "#F5F2F2",
  },
  textBubble: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.2,
    resizeMode: "contain",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    position: "absolute",
    top: 35,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'android' ? 5 : null,
    lineHeight: 22,
    fontFamily: "doss",
    fontSize: Platform.OS === 'ios' ? 18 : 20,
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
    paddingTop: Platform.OS === 'ios' ? null : 5,
    fontSize: 22,
    fontFamily: "doss",
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
    color: 'gray',
  },
});