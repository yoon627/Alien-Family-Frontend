import React from "react";
import {Image, View, StyleSheet, Dimensions, Platform, TouchableOpacity} from "react-native";
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
import PlantInfo from "./PlantInfo";
const Tab = createBottomTabNavigator();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CustomTabBarButton = ({ accessibilityState, children, onPress }) => {
    const focused = accessibilityState.selected;

    return (
        <TouchableOpacity
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? "#F4F5FA" : "#fff",
            }}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
};

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
              source={require("../assets/img/navbarIcon/home.png")}
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
              source={require("../assets/img/navbarIcon/album.png")}
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
              source={require("../assets/img/navbarIcon/chat.png")}
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
              source={require("../assets/img/navbarIcon/calendar.png")}
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
              source={require("../assets/img/navbarIcon/alarm.png")}
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
    // marginTop: 6,
    flex: 1,
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_HEIGHT * 0.1,
    resizeMode: "contain",
  },
  chat: {
    paddingTop: 13,
    marginLeft: 5,
    flex: 1,
    width: SCREEN_WIDTH * 0.19,
    height: SCREEN_HEIGHT * 0.16,
    resizeMode: "contain",
  },
  tabBar: {
    backgroundColor: "#fff",
    height: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.08 : SCREEN_HEIGHT * 0.09,
    opacity: 0.8,
  },
});
