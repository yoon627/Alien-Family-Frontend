import React, {useEffect, useState, useRef} from "react";
import {Dimensions, Image, StyleSheet, Text, View, ImageBackground} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {ScrollView} from "react-native-gesture-handler";
import {LinearGradient} from 'expo-linear-gradient';
import * as Notifications from "expo-notifications";
import AlienType from "../components/AlienType";

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
  const [tmiJson, setTmiJson] = useState({});
  const [attendanceJson, setAttendanceJson] = useState({});

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
  }, [tmiJson]);

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
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/img/attendance_bg.jpg")}
        imageStyle={{resizeMode: 'cover', height: SCREEN_HEIGHT, width: SCREEN_WIDTH}}
      >
        <Text style={styles.month}>
          {new Date().getMonth() + 1}月
        </Text>
        <ScrollView>
          {week.map((day, index) => (
            <View
              key={day}
              style={[styles.attendance_container, {marginLeft: index % 2 === 1 ? 30 : 10}]}
            >
              {/* 별 배경 일자 */}
              {tmiJson[day] && tmiJson[day].length > 0 ? (
                <View style={styles.star_container}>
                  {/* 출석도장 */}
                  <View style={styles.small_star}>
                    {attendanceJson[day] && attendanceJson[day].map((attendant, index) =>
                      Array.from({length: attendant}).map((_, subIndex) => (
                        <Image
                          key={subIndex}
                          style={{width: 25, height: 25}}
                          source={require("../assets/img/small_star.png")}
                          imageStyle={{resizeMode: 'contain'}}
                        />
                      )),
                    )}
                  </View>
                  <ImageBackground
                    source={require("../assets/img/star.png")}
                    imageStyle={{resizeMode: 'contain'}}
                    style={styles.big_star}
                  >
                    <Text style={styles.day_txt}>
                      {JSON.stringify(day).slice(9, 11)}
                    </Text>
                  </ImageBackground>
                </View>
              ) : null
              }

              {/* TMI */}
              <View key={day} style={styles.tmi_container}>
                {tmiJson[day] ? (
                  tmiJson[day].map((tmi, index) => (
                    <View key={index}>
                      {/* 그라데이션 */}
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
                        style={styles.tmi_gradient}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                      >
                        <AlienType
                          writer={tmi.split(":")[0]}
                        />
                        {/* TMI */}
                        <Text key={index} style={styles.tmi_txt}>
                          <Text>{tmi.split(":")[0]}: {tmi.split(":")[1]}</Text>
                        </Text>
                      </LinearGradient>
                    </View>
                  ))
                ) : (
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
                    style={styles.tmi_gradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                  >
                    <Text style={styles.tmi_txt}></Text>
                  </LinearGradient>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  month: {
    color: '#FFF',
    fontSize: 50,
    paddingVertical: 20,
    paddingLeft: 20,
  },
  attendance_container: {
    alignContent: 'center',
    flexDirection: 'row',
    paddingTop: 20,
    alignItems: 'center',

  },
  star_container: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  big_star: {
    justifyContent: 'center',
    alignContent: 'center',
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
  },
  small_star: {
    flexDirection: "row",
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    height: 25,
    position: 'absolute',
    top: 0,
    left: 0
  },
  day_txt: {
    color: '#56186B',
    paddingLeft: 25,
    fontSize: 22,
    fontWeight: '900'
  },
  tmi_container: {
    width: SCREEN_WIDTH * 0.7,
    borderColor: "rgba(255, 255, 255, 0.7)",
    borderLeftWidth: 2,
    paddingLeft: 5,
  },
  tmi_gradient: {
    width: SCREEN_WIDTH * 0.6,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  tmi_txt: {
    fontSize: 20,
    color: '#FFF',
    alignContent: 'center',
    paddingVertical: 15,
    justifyContent: 'center',
  },
});