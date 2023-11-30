import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

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
        const tmpJson = {};
        const attendances = resp.data.data;
        for (let i = 0; i < week.length; i++) {
          const tmp = attendances[week[i]];
          let members = "";
          if (tmp) {
            for (let j = 0; j < tmp.length; j++) {
              members += tmp[j].member.nickname;
              if (j < tmp.length - 1) {
                members += ", ";
              }
            }
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
        // console.log(resp.data.data)
        const tmpJson = {};
        const tmptmis = resp.data.data;
        for (let i = 0; i < week.length; i++) {
          const tmp = tmptmis[week[i]];
          let arr = [];
          if (tmp) {
            for (let j = 0; j < tmp.length; j++) {
              arr.push(tmp[j].member.nickname + ":" + tmp[j].content);
            }
          }
          // console.log(arr)
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
      <Text style={{ fontSize: 70 }}>Attendance</Text>
      <ScrollView>
        {week.map((day) => (
          <View key={day}>
            <Text>===========================================</Text>
            <Text>
              {JSON.stringify(day).slice(1, 11)} 출석한 사람들:{" "}
              {attendanceJson[day] ? (
                attendanceJson[day]
              ) : (
                <Text>없어요...</Text>
              )}
            </Text>
            <Text>#오늘의 TMI</Text>
            {tmiJson[day] && tmiJson[day].length > 0 ? (
              tmiJson[day].map((tmi, index) => <Text key={index}>{tmi}</Text>)
            ) : (
              <Text>없어요...</Text>
            )}
            <Text>===========================================</Text>
            <Text></Text>
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
  },
});
