import React, { useEffect, useState, useRef, useCallback } from "react";
import { Dimensions, Image, StyleSheet, Text, View, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
// import LinearGradient from 'react-native-linear-gradient';
import {LinearGradient} from 'expo-linear-gradient';

import { Bold } from "lucide-react-native";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "@react-navigation/native";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Attendance({ navigation }) {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const [Family, setFamily] = useState({});
  const [isLoading, setIsLoading] = useState(true); 

  const [familyInfo, setFamilyInfo] = useState([]);
  const alienImagePath = {
    BASIC: require(`../assets/img/character/BASIC.png`),
    GLASSES: require(`../assets/img/character/GLASSES.png`),
    GIRL: require(`../assets/img/character/GIRL.png`),
    BAND_AID: require(`../assets/img/character/BAND_AID.png`),
    RABBIT: require(`../assets/img/character/RABBIT.png`),
    HEADBAND: require(`../assets/img/character/HEADBAND.png`),
    TOMATO: require(`../assets/img/character/TOMATO.png`),
    CHRISTMAS_TREE: require(`../assets/img/character/CHRISTMAS_TREE.png`),
    SANTA: require(`../assets/img/character/SANTA.png`),
    PIRATE: require(`../assets/img/character/PIRATE.png`),
  };


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
        console.log(resp.data.data);
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
        console.log(tmpJson);
        setTmiJson(tmpJson);
        
      })
      .catch((e) => console.log(e));
  }
  // if (isLoading) {
  //   return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  // }

  useEffect(() => {
    fetchData();
  }, []);

  // 가족정보
  useEffect(() => {
    const viewFamily = async () => {
      try {
        const resp = await AsyncStorage.getItem("myDB");
        setFamily(JSON.parse(resp) || {});
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    viewFamily();
  }, []);

  useEffect(() => {
    findImageByName();
  }, [Family]);
  

  const findImageByName = async (writer) => {
    console.log("writer:", writer);
    for (const key in familyInfo) {
      console.log("Nickname : ", familyInfo[key].nickname, writer)
      if (familyInfo[key].nickname === writer) {
        console.log("!!");
        return familyInfo[key].alien.type;
      } 
    return alienImagePath["BASIC"];
    }
  };

  
const renderImages = async () => {
  // 비동기 함수로 이미지 렌더링
  const imageSource = findImageByName(tmi.split(":")[0]);
  
  // 이미지 렌더링
  return (
    <Image
      style={styles.profilePic}
      source={imageSource}
    />
  );
};

  useFocusEffect(
    useCallback(() => {
      fetchData();
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
          console.log("update Family");
        } else if (notification.request.content.title == "TMI") {
          console.log("update TMI");
          fetchData();
        } else if (notification.request.content.title == "Calendar") {
          console.log("update Calendar");
        } else if (notification.request.content.title == "Photo") {
          console.log("update Photo");
        } else if (notification.request.content.title == "Plant") {
          console.log("update Plant");
        } else {
          console.log("update Chatting");
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
          imageStyle={{resizeMode: 'cover', height:  SCREEN_HEIGHT , width: SCREEN_WIDTH}}
        >
       <Text style={styles.month}>12月</Text>
      <ScrollView>
        {week.map((day, index) => (          
          <View key={day} style={[styles.attendance_container, { marginLeft: index % 2 === 1 ? 30 : 10}]}>
            {/* 별 배경 일자 */}
            <View style={styles.star_container}>
              {/* 출석도장 */}
              <View style={styles.small_star}>
                {attendanceJson[day] && attendanceJson[day].map((attendant, index) =>
                    Array.from({ length: attendant }).map((_, subIndex) => (
                      <Image
                        key={subIndex}
                        style={{ width: 25, height: 25}}
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
          
            {/* TMI */}
            <View key={day} style={styles.tmi_container}>
            {tmiJson[day] && tmiJson[day].length > 0 ? (
              tmiJson[day].map((tmi, index) => (
                <View key={index}>
                  {/* 그라데이션 */}
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
                    style={styles.tmi_gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {/* TMI */}
                    <Text key={index} style={styles.tmi_txt}>
                      {/* {tmi} */}
                      {/* <Image
                        style={styles.profilePic}
                        source={await findImageByName(tmi.split(":")[0])}
                      /> */}
                       {/* await renderImages({tmi}) */}
                      <Text style={styles.nickName}>{tmi.split(":")[0]}</Text>
                      <Text>{tmi.split(":")[1]}</Text>
                      
                    </Text>
                  </LinearGradient>
                </View>
              ))
            ) : (
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
                style={styles.tmi_gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
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
  month:{
    color: '#FFF',
    fontSize: 50,
    paddingVertical: 20,
    paddingLeft: 20


  },

  attendance_container : {
    alignContent: 'center',
    flexDirection: 'row',
    paddingTop: 40,
    alignItems: 'center',
    
  },


  star_container:{
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    
  },
  big_star:{
    justifyContent: 'center',
    alignContent: 'center',
    width: SCREEN_WIDTH*0.3,
    height: SCREEN_WIDTH*0.3,
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
  
  day_txt:{
    color: '#56186B',
    paddingLeft: 25,
    fontSize: 22,
    fontWeight: '900'
    
  },
  tmi_container:{
    borderColor: '#FFF',
    width: SCREEN_WIDTH*0.7,
    borderColor: "rgba(255, 255, 255, 0.7)",
    borderLeftWidth: 2,
    paddingLeft: 5,
    // borderCurve: 3,
    
  },
  tmi_gradient:{
    width: SCREEN_WIDTH*0.6,
    marginBottom: 10,

  },
  
  tmi_txt: {
    fontSize: 20,
    // marginBottom: 20,
    color: '#FFF',
    alignContent: 'center',
    paddingVertical: 15,
    paddingLeft: 20,
    justifyContent: 'center',
  }, 
  profilePic: {
    width: 35, // 이미지 크기 조절
    height: 35, // 이미지 크기 조절
    resizeMode: "cover",
    borderRadius: 35 / 2, // 원형으로 만들기
    backgroundColor: "#FFEEC3",
    marginRight: 5,
  },


});
