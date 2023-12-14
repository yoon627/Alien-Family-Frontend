import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ChoseCalendar from "./ChoseCalendar";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Drawer = createDrawerNavigator();
export default function Settings({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={{ overflow: "hidden", borderRadius: 15, width: 175 }}>
        <ImageBackground source={require("../assets/img/pinkBtn.png")}>
          <TouchableOpacity
            onPress={async () => {
              const familyCode = await AsyncStorage.getItem("familyCode");
              try {
                if (familyCode) {
                  // console.log(familyCode);
                  Clipboard.setString(familyCode);
                  alert("초대코드가 클립보드에 복사되었습니다.");
                } else {
                  alert("초대코드가 없습니다.");
                }
              } catch (error) {
                console.error("Error copying to clipboard:", error);
              }
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              color: "black",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
                marginHorizontal: 20,
                marginVertical: 15,
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              가족코드 복사
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              try {
                AsyncStorage.setItem("todayMissionClear","false")
                AsyncStorage.setItem("dailyMissionClear","false")
              } catch (error) {
                console.error("Error copying to clipboard:", error);
              }
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              color: "black",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
                marginHorizontal: 20,
                marginVertical: 15,
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              미션 초기화
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
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
