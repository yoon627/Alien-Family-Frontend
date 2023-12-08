import React from "react";
import { Image, View, StyleSheet, Dimensions, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AlbumScreen from "./AlbumScreen";
import Home from "./Home";
import CalendarScreen from "./CalendarScreen";
import Feed from "./Feed";
import Attendance from "./Attendance";
import LadderScreen from "./LadderScreen";
import RouletteScreen from "./RouletteScreen";
import NewGame from "./NewGame";
import ChatRoom from "./Chatting";

const Tab = createBottomTabNavigator();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MainScreen({ navigation, route }) {
  // const showFamilyInfo = route.params?.showFamilyInfo || false;
  // if (showFamilyInfo){
  //   console.log("hi");
  //   navigation.navigate("FamilyInfo");
  //   console.log("hi2");
  // }
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require("../assets/img/navbarIcon/home3.png")}
              style={styles.icon}
            />
          ),
          tabBarShowLabel: false,
          // tabBarActiveBackgroundColor: "gray",
        }}
      />
      <Tab.Screen
        name="AlbumScreen"
        component={AlbumScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require("../assets/img/navbarIcon/album3.png")}
              style={styles.icon}
            />
          ),
          tabBarShowLabel: false,
          // tabBarActiveBackgroundColor: "gray",
        }}
      />
      <Tab.Screen
        name="Chatting"
        component={ChatRoom}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require("../assets/img/navbarIcon/chat3.png")}
              style={styles.chat}
            />
          ),
          tabBarShowLabel: false,
          // tabBarActiveBackgroundColor: "gray",
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require("../assets/img/navbarIcon/calendar3.png")}
              style={styles.icon}
            />
          ),
          tabBarShowLabel: false,
          // tabBarActiveBackgroundColor: "gray",
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require("../assets/img/navbarIcon/alarm3.png")}
              style={styles.icon}
            />
          ),
          tabBarShowLabel: false,
          // tabBarActiveBackgroundColor: "gray",
        }}
      />
      {/* <Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
          tabBarVisible: false, //hide tab bar on this screen
        }}
      /> */}

      <Tab.Screen
        name="Ladder"
        component={LadderScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
          tabBarVisible: false,
        }}
      />
      <Tab.Screen
        name="Roulette"
        component={RouletteScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
          tabBarVisible: false,
        }}
      />
      <Tab.Screen
        name="Mole"
        component={NewGame}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
          tabBarVisible: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginTop: 6,
    flex: 1,
    width: SCREEN_WIDTH * 0.11,
    height: SCREEN_HEIGHT * 0.1,
    resizeMode: "contain",
  },
  chat: {
    marginTop: 15,
    marginLeft: 6,
    flex: 1,
    width: SCREEN_WIDTH * 0.11,
    height: SCREEN_HEIGHT * 0.1,
    resizeMode: "contain",
  },
  tabBar: {
    backgroundColor: "#8FB7D2", // 탭 바 색
    height: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.09 : SCREEN_HEIGHT * 0.09,
  },
});
