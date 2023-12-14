import React from "react";
import {View, StyleSheet, Dimensions, Platform, TouchableOpacity} from "react-native";
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
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';import PlantInfo from "./PlantInfo";
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
          tabBarIcon: ({ color }) => (
            <Foundation name="home" size={32} color={color} />
          ),
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#0B0B0B",
          tabBarInactiveTintColor: "#B1B1B1",
        }}
      />
      <Tab.Screen
        name="AlbumScreen"
        component={AlbumScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="image" size={32} color={color} />
          ),
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#0B0B0B",
          tabBarInactiveTintColor: "#B1B1B1",
        }}
      />
      <Tab.Screen
        name="Chatting"
        component={ChatRoom}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={32} color={color} />
          ),
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#0B0B0B",
          tabBarInactiveTintColor: "#B1B1B1",
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="calendar-heart" size={32} color={color} />
          ),
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#0B0B0B",
          tabBarInactiveTintColor: "#B1B1B1",
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Ionicons name="ios-planet" size={32} color={color} />
          ),
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#0B0B0B",
          tabBarInactiveTintColor: "#B1B1B1",
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
      {/*<Tab.Screen*/}
      {/*  name="PlantInfo"*/}
      {/*  component={PlantInfo}*/}
      {/*  options={{*/}
      {/*    headerShown: false,*/}
      {/*    tabBarShowLabel: false,*/}
      {/*    tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,*/}
      {/*    tabBarVisible: false,*/}
      {/*  }}*/}
      {/*/>*/}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    height: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.08 : SCREEN_HEIGHT * 0.09,
    opacity: 0.8,
  },
});
