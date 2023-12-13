import React, {useEffect, useState, useRef, useCallback} from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {ScrollView} from "react-native-gesture-handler";
import {LinearGradient} from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import AlienType from "../components/AlienType";
import {useFocusEffect} from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Attendance({navigation}) {
  const [notification, setNotification] = useState(false);
  const [tmiJson, setTmiJson] = useState({});
  const [attendanceJson, setAttendanceJson] = useState({});
  const notificationListener = useRef();

  const ktc = new Date();
  ktc.setHours(ktc.getHours() + 9);
  const today = new Date();
  today.setHours(ktc.getHours() + 9);
  const btoday = new Date(ktc.setDate(ktc.getDate() - 1));
  const bbtoday = new Date(ktc.setDate(ktc.getDate() - 1));
  const bbbtoday = new Date(ktc.setDate(ktc.getDate() - 1));
  const bbbbtoday = new Date(ktc.setDate(ktc.getDate() - 1));
  const bbbbbtoday = new Date(ktc.setDate(ktc.getDate() - 1));
  const bbbbbbtoday = new Date(ktc.setDate(ktc.getDate() - 1));
  const str_today = JSON.stringify(today).toString().slice(1, 11);
  const str_btoday = JSON.stringify(btoday).toString().slice(1, 11);
  const str_bbtoday = JSON.stringify(bbtoday).toString().slice(1, 11);
  const str_bbbtoday = JSON.stringify(bbbtoday).toString().slice(1, 11);
  const str_bbbbtoday = JSON.stringify(bbbbtoday).toString().slice(1, 11);
  const str_bbbbbtoday = JSON.stringify(bbbbbtoday).toString().slice(1, 11);
  const str_bbbbbbtoday = JSON.stringify(bbbbbbtoday).toString().slice(1, 11);
  const week = [
    str_today,
    str_btoday,
    str_bbtoday,
    str_bbbtoday,
    str_bbbbtoday,
    str_bbbbbtoday,
    str_bbbbbbtoday,
  ];

  async function fetchData() {
    const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
    const UserServerAccessToken = await AsyncStorage.getItem(
      "UserServerAccessToken"
    );

    await axios({
      method: "GET",
      url: SERVER_ADDRESS + "/weeklyAttendance",

      headers: {
        Authorization: "Bearer: " + UserServerAccessToken,
      },
    })
      .then((resp) => {
        const tmpJson = {};
        const attendances = resp.data.data;
        for (let i = 0; i < week.length; i++) {
          const tmp = attendances[week[i]];
          let members = [];
          if (tmp) {
            members.push(tmp.length);
          }
          tmpJson[week[i]] = members;
        }
        setAttendanceJson(tmpJson);
      })
      .catch((e) => console.log(e));
    await axios({
      method: "GET",
      url: SERVER_ADDRESS + "/weeklyTmi",
      headers: {
        Authorization: "Bearer: " + UserServerAccessToken,
      },
    })
      .then((resp) => {
        // console.log(resp.data.data);
        const tmpJson = {};
        const tmptmis = resp.data.data;
        for (let i = 0; i < week.length; i++) {
          const tmp = tmptmis[week[i]];
          let arr = [];
          if (tmp) {
            for (let j = 0; j < tmp.length; j++) {
              arr.push(tmp[j].member.nickname + " : " + tmp[j].content);
            }
          }
          tmpJson[week[i]] = arr;
        }
        // console.log(tmpJson);
        setTmiJson(tmpJson);
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData();
    };
    fetchDataAsync();
  }, []);
  useFocusEffect(
    useCallback(() => {
      const fetchDataAsync = async () => {
        await fetchData();
      };
      fetchDataAsync();
      // 여기에 다른 포커스를 받았을 때 실행하고 싶은 작업들을 추가할 수 있습니다.
      return () => {
        // 스크린이 포커스를 잃을 때 정리 작업을 수행할 수 있습니다.
      };
    }, []) // 두 번째 매개변수로 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행되도록 합니다.
  );
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
        } else {
          // console.log("update Chatting");
        }
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, [notification]);
  return (

    <ImageBackground
      source={require("../assets/img/historyBg.png")}
      imageStyle={{
        flex: 1,
        resizeMode: "cover",
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
      }}
    >
      <View>
        <Text style={{...styles.month, paddingTop: 30, paddingBottom: 0, fontSize: 40,}}>TMI 히스토리</Text>
        <Text style={styles.month}>{new Date().getMonth() + 1}월</Text>
        <ScrollView style={{marginBottom: 200,}}>
          {week.map((day, index) => (
            <View
              key={day}
              style={[
                styles.attendance_container,
                {marginLeft: index % 2 === 1 ? 30 : 10},
              ]}
            >
              {/* 별 배경 일자 */}
              {tmiJson[day] && tmiJson[day].length > 0 ? (
                <View style={styles.star_container}>
                  {/* 출석도장 */}
                  <View style={styles.small_star}>
                    {attendanceJson[day] &&
                      attendanceJson[day].map((attendant, index) =>
                        Array.from({length: attendant}).map((_, subIndex) => (
                          <Image
                            key={subIndex}
                            style={{width: 20, height: 20}}
                            source={require("../assets/img/small_star.png")}
                            imageStyle={{resizeMode: "contain"}}
                          />
                        ))
                      )}
                  </View>
                  <ImageBackground
                    source={require("../assets/img/img.png")}
                    imageStyle={{resizeMode: "contain"}}
                    style={styles.big_star}
                  >
                    <Text style={styles.day_txt}>
                      {JSON.stringify(day).slice(9, 11)}
                    </Text>
                  </ImageBackground>
                </View>
              ) : null}

              {/* TMI */}
              <View key={day} style={styles.tmi_container}>
                {tmiJson[day] ? (
                  tmiJson[day].map((tmi, index) => (
                    <View key={index} style={styles.tmi_gradient}>
                      <AlienType writer={tmi.split(":")[0]}/>
                      {/* TMI */}

                      <View key={index} style={{flexDirection: "row",}}>
                        <Text style={{...styles.tmi_txt, fontFamily: "jamsil2", fontSize: 19, paddingRight: 0,}}>
                          {tmi.split(":")[0]}
                        </Text>
                        <View>
                          <Text style={styles.tmi_txt} numberOfLines={2}>
                            : {tmi.split(":")[1]}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.tmi_gradient}>
                    <Text style={styles.tmi_txt}></Text>
                  </View>
                )}
              </View>
            </View>
          ))}
          <View style={{marginBottom: 70,}}></View>
        </ScrollView>
        <View style={{position: "absolute", top: 30, left: 25}}>
          <TouchableOpacity
            onPress={() => navigation.pop()}>
            <Image
              style={styles.exit}
              source={require('../assets/img/out.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  month: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "doss",
    textAlign: "center",
    paddingTop: 7,
    paddingBottom: 10,
    textShadowColor: '#FFFBEF',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  attendance_container: {
    alignContent: "center",
    flexDirection: "row",
    paddingTop: 20,
    alignItems: "center",
  },
  star_container: {
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
  },
  big_star: {
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.2,
    marginLeft: 5,
  },
  small_star: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    height: 25,
    position: "absolute",
    top: 0,
    left: 15,
  },
  day_txt: {
    color: "#FF6B00",
    fontSize: 20,
    fontFamily: "doss",
    paddingHorizontal: 23,
    textShadowColor: '#fff',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  tmi_container: {
    width: SCREEN_WIDTH * 0.7,
    marginTop: 10,
    paddingBottom: 10,
  },
  tmi_gradient: {
    flexDirection: "row",
    alignItems: "center",
    width: SCREEN_WIDTH,
    marginBottom: 5,
    overflow: "hidden",
  },
  tmi_txt: {
    fontSize: 20,
    fontFamily: "wooju",
    color: "#000",
    paddingVertical: 15,
    paddingRight: 20,
    maxWidth: SCREEN_WIDTH * 0.45,
  },
  exit: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    resizeMode: "contain",
  },
});