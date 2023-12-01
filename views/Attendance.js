import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { Bold } from "lucide-react-native";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Attendance({ navigation }) {
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
  const str_today =
    JSON.stringify(today).toString().slice(1, 11) + "T00:00:00.000+00:00";
  const str_btoday =
    JSON.stringify(btoday).toString().slice(1, 11) + "T00:00:00.000+00:00";
  const str_bbtoday =
    JSON.stringify(bbtoday).toString().slice(1, 11) + "T00:00:00.000+00:00";
  const str_bbbtoday =
    JSON.stringify(bbbtoday).toString().slice(1, 11) + "T00:00:00.000+00:00";
  const str_bbbbtoday =
    JSON.stringify(bbbbtoday).toString().slice(1, 11) + "T00:00:00.000+00:00";
  const str_bbbbbtoday =
    JSON.stringify(bbbbbtoday).toString().slice(1, 11) + "T00:00:00.000+00:00";
  const str_bbbbbbtoday =
    JSON.stringify(bbbbbbtoday).toString().slice(1, 11) + "T00:00:00.000+00:00";
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
      "UserServerAccessToken",
    );
    await axios({
      method: "GET",
      url: SERVER_ADDRESS + "/weeklyAttendance",

      headers: {
        Authorization: "Bearer: " + UserServerAccessToken,
      },
    })
      .then((resp) => {
        console.log(resp.data.data);
        const tmpJson = {};
        const attendances = resp.data.data;
        for (let i = 0; i < week.length; i++) {
          const tmp = attendances[week[i]];
          let members = [];
          if (tmp) {
            members.push(tmp.length)
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
        setTmiJson(tmpJson);
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    fetchData();
  }, []);
  // const test = { a: "b" };
  return (
    
    <View style={styles.container}>
      <Text style={styles.main_title}>Attendance</Text>
      <ScrollView>
        {week.map((day) => (
          <View key={day} style={styles.attendence_container}>

            <Text style={styles.sub_title}># {JSON.stringify(day).slice(1, 11)}</Text>
            {tmiJson[day] && tmiJson[day].length > 0 ? (
              tmiJson[day].map((tmi, index) => <Text key={index} style={styles.tmi_txt}>- {tmi}</Text>)
            ) : (
              <Text>없어요...</Text>
            )}
            
            <View style={styles.image_container}>
              {attendanceJson[day] && attendanceJson[day].length > 0 ? (
                attendanceJson[day].map((attendant, index) =>
                Array.from({ length: attendant }).map((_, subIndex) => (
                  <Image key={subIndex} style={{width: 50, height: 50, marginLeft: 5}}source={require("../assets/img/attendance.png")} />
                ))
                )
                ) : (
                  <Text>없나요?...</Text>
                  )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'#DED1DF'
  },
  
  attendence_container: {
    width:SCREEN_WIDTH*0.8,
    backgroundColor: '#FFFFFF70',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderColor : 'gray'

  },
  
  main_title:{
    marginBottom: 20,
    fontSize : 60,
    padding:10,
    backgroundColor: 'white',
    alignSelf: 'flex-mid',
    width:'100%',
    textAlign:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.35,
    // shadowRadius: 20.84,
    elevation: 6,
  },

  sub_title:{
    color: '#353535',
    fontSize: 25,
    fontWeight:'700',
    marginBottom: 12,
    borderBottomWidth : 1,
    borderColor: '#DED1DF',

  },
  tmi_txt:{
    fontSize: 17,
    borderBottomWidth : 1,
    borderColor: '#DED1DF',
    paddingBottom: 2,
    marginBottom: 18
  },

  image_container:{
    // backgroundColor: 'gray',
    flexDirection:'row',
    flexWrap:'wrap',
    width: '100%',
    justifyContent:'flex-end'
  },

  attendant:{
    fontSize: 15,
    padding: 9,
    margin: 3,
    alignItems: 'flex-end',
    borderColor: '#D63CE3',
    border: 'solid',
    borderWidth: 1,
    borderRadius: 13,
    border: 3,

  },


  // log_container:{
  //   backgroundColor: '#fff'

  // }
});
