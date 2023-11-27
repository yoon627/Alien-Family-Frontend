import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import MainScreen from "./MainScreen";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

export default function CalendarScreen({ navigation }) {
  // const getAllKeys = async () => {
  //   let keys = []
  //   try {
  //     keys = await AsyncStorage.getAllKeys()
  //     await AsyncStorage.multiRemove(keys);
  //   } catch(e) {
  //     // 키를 가져오는데 에러 발생 시 처리
  //   }
  //   return keys;
  // }
  //
  // const clearAll = async () => {
  //   try {
  //     const keys = await getAllKeys();
  //     // await AsyncStorage.multiRemove(keys);
  //   } catch(e) {
  //     // 데이터 제거 중 에러 발생 시 처리
  //   }
  //
  //   console.log('Done')
  // }
  // clearAll();

  const [selected, setSelected] = useState("");
  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const token = await AsyncStorage.getItem("KakaoAccessToken");
      //   console.log("kakao token", token);
      const response = await fetch(
        "https://kapi.kakao.com/v2/api/calendar/calendars",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token, // Replace YOUR_ACCESS_TOKEN with your actual access token
            // Add other necessary headers if required
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      //   console.log(data);
    } catch (error) {
      console.error("There was an error fetching the calendars:", error);
    }
  };

  return (
    <View>
      <Calendar
        onDayPress={(day) => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: "orange",
          },
        }}
      />
    </View>
  );
}
